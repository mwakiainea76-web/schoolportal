<?php

namespace App\Services;

use App\Jobs\WriteAuditLogJob;
use App\Models\User;
use App\Support\RequestLogContext;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Throwable;

class AuditService
{
    protected static bool $disabled = false;

    public static function log(array $payload): void
    {
        app(self::class)->dispatch($payload);
    }

    public static function withoutAuditing(callable $callback): mixed
    {
        $previous = self::$disabled;
        self::$disabled = true;

        try {
            return $callback();
        } finally {
            self::$disabled = $previous;
        }
    }

    public static function isDisabled(): bool
    {
        return self::$disabled || ! config('audit.enabled', true);
    }

    public function dispatch(array $payload): void
    {
        if (self::isDisabled()) {
            return;
        }

        $normalized = $this->normalizePayload($payload);

        if ($normalized === null) {
            return;
        }

        try {
            if (app()->runningUnitTests() && config('audit.queue.sync_in_tests', true)) {
                dispatch_sync(new WriteAuditLogJob($normalized));

                return;
            }

            WriteAuditLogJob::dispatch($normalized);
        } catch (Throwable $exception) {
            Log::warning('audit_log_dispatch_failed', [
                'message' => $exception->getMessage(),
                'payload' => $normalized,
            ]);
        }
    }

    public function logModelEvent(
        Model $model,
        string $event,
        ?array $oldValues = null,
        ?array $newValues = null,
        array $metadata = [],
        array $auditOnly = [],
        array $auditExclude = []
    ): void
    {
        $module = method_exists($model, 'auditModule')
            ? $model->auditModule()
            : Str::snake(class_basename($model));

        self::log([
            'module' => $module,
            'action' => Str::snake(class_basename($model)).'_'.$event,
            'entity' => $model,
            'old_values' => $oldValues,
            'new_values' => $newValues,
            'metadata' => $metadata,
            'audit_only' => $auditOnly,
            'audit_exclude' => $auditExclude,
        ]);
    }

    public function shouldSkipAutomaticModelAudit(?Request $request = null): bool
    {
        if (self::isDisabled()) {
            return true;
        }

        return app()->runningInConsole() && ! app()->runningUnitTests() && ! $request;
    }

    protected function normalizePayload(array $payload): ?array
    {
        $request = request();
        $entity = $payload['entity'] ?? null;
        $actor = $payload['actor'] ?? $request?->user();
        $actorId = $payload['user_id'] ?? ($actor instanceof User ? $actor->id : null);
        $metadata = $this->cleanArray($payload['metadata'] ?? []);

        [$oldValues, $newValues, $hasProvidedDiff] = $this->prepareDiff(
            $payload['old_values'] ?? null,
            $payload['new_values'] ?? null,
            $payload['audit_only'] ?? [],
            $payload['audit_exclude'] ?? []
        );

        if (($payload['high_risk'] ?? false) === true) {
            $metadata['high_risk'] = true;

            if ($hasProvidedDiff && $oldValues === null && $newValues === null) {
                $metadata['warning'] = 'No meaningful field changes were detected for a high-risk action.';
            }
        }

        $requestContext = $this->requestContext($request);
        if ($requestContext !== []) {
            $metadata['request'] = $requestContext;
        }

        $module = trim((string) ($payload['module'] ?? ''));
        $action = trim((string) ($payload['action'] ?? ''));

        if ($module === '' || $action === '') {
            return null;
        }

        return array_filter([
            'user_id' => $actorId,
            'school_id' => $payload['school_id'] ?? null,
            'module' => $module,
            'action' => $action,
            'entity_type' => $payload['entity_type'] ?? $this->resolveEntityType($entity),
            'entity_id' => $payload['entity_id'] ?? $this->resolveEntityId($entity),
            'entity_label' => $payload['entity_label'] ?? $this->resolveEntityLabel($entity),
            'old_values' => $oldValues,
            'new_values' => $newValues,
            'metadata' => $metadata !== [] ? $metadata : null,
            'ip_address' => $payload['ip_address'] ?? $request?->ip(),
            'user_agent_hash' => $payload['user_agent_hash'] ?? $this->userAgentHash($request),
            'request_id' => $payload['request_id'] ?? ($request ? RequestLogContext::ensureRequestId($request) : null),
            'created_at' => $payload['created_at'] ?? now(),
        ], fn ($value) => $value !== null && $value !== '');
    }

    protected function prepareDiff(?array $oldValues, ?array $newValues, array $auditOnly = [], array $auditExclude = []): array
    {
        $hasProvidedDiff = is_array($oldValues) || is_array($newValues);

        if (! $hasProvidedDiff) {
            return [null, null, false];
        }

        $sanitizedOld = $this->sanitizeAuditValues($oldValues ?? [], $auditOnly, $auditExclude);
        $sanitizedNew = $this->sanitizeAuditValues($newValues ?? [], $auditOnly, $auditExclude);

        $keys = collect(array_keys($sanitizedOld))
            ->merge(array_keys($sanitizedNew))
            ->unique()
            ->values();

        $changedOld = [];
        $changedNew = [];

        foreach ($keys as $key) {
            $before = $sanitizedOld[$key] ?? null;
            $after = $sanitizedNew[$key] ?? null;

            if ($before === $after) {
                continue;
            }

            if (array_key_exists($key, $sanitizedOld)) {
                $changedOld[$key] = $before;
            }

            if (array_key_exists($key, $sanitizedNew)) {
                $changedNew[$key] = $after;
            }
        }

        return [
            $changedOld !== [] ? $changedOld : null,
            $changedNew !== [] ? $changedNew : null,
            true,
        ];
    }

    protected function sanitizeAuditValues(array $values, array $auditOnly = [], array $auditExclude = []): array
    {
        $sanitized = $this->cleanArray($this->redactSensitiveValues($values));

        if ($auditOnly !== []) {
            $keys = array_values(array_unique($auditOnly));

            return Arr::only($sanitized, $keys);
        }

        $excluded = array_values(array_unique(array_merge(
            config('audit.ignored_model_fields', []),
            $auditExclude
        )));

        return Arr::except($sanitized, $excluded);
    }

    protected function redactSensitiveValues(array $values): array
    {
        $redactedFields = collect(config('audit.redacted_fields', []))
            ->map(fn ($field) => Str::lower((string) $field))
            ->all();

        $result = [];

        foreach ($values as $key => $value) {
            $normalizedKey = Str::lower((string) $key);

            if (in_array($normalizedKey, $redactedFields, true)) {
                $result[$key] = '[REDACTED]';

                continue;
            }

            $result[$key] = is_array($value)
                ? $this->redactSensitiveValues($value)
                : $value;
        }

        return $result;
    }

    protected function cleanArray(array $values): array
    {
        $cleaned = [];

        foreach ($values as $key => $value) {
            if (is_array($value)) {
                $value = $this->cleanArray($value);
            }

            if ($value === null) {
                continue;
            }

            if (is_array($value) && $value === []) {
                continue;
            }

            $cleaned[$key] = $value;
        }

        return $cleaned;
    }

    protected function requestContext(?Request $request): array
    {
        if (! $request) {
            return [];
        }

        return array_filter([
            'method' => $request->method(),
            'path' => '/'.ltrim($request->path(), '/'),
            'route' => $request->route()?->getName(),
        ], fn ($value) => $value !== null && $value !== '');
    }

    protected function userAgentHash(?Request $request): ?string
    {
        $userAgent = trim((string) $request?->userAgent());

        return $userAgent !== '' ? hash('sha256', $userAgent) : null;
    }

    protected function resolveEntityType(mixed $entity): ?string
    {
        if (! $entity instanceof Model) {
            return null;
        }

        return Str::snake(class_basename($entity));
    }

    protected function resolveEntityId(mixed $entity): ?int
    {
        if (! $entity instanceof Model || ! $entity->getKey()) {
            return null;
        }

        return (int) $entity->getKey();
    }

    protected function resolveEntityLabel(mixed $entity): ?string
    {
        if (! $entity instanceof Model) {
            return null;
        }

        $data = $entity->toArray();

        if (method_exists($entity, 'auditLabel')) {
            return $entity->auditLabel();
        }

        foreach (['full_name', 'name', 'title', 'label', 'code', 'admission_number', 'staff_number', 'invoice_number', 'reference', 'email'] as $field) {
            $value = Arr::get($data, $field);

            if (filled($value)) {
                return (string) $value;
            }
        }

        return Str::headline(class_basename($entity)).' #'.$entity->getKey();
    }
}
