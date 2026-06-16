<?php

namespace App\Traits;

use App\Services\AuditService;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\MissingAttributeException;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Arr;

trait Auditable
{
    public static function bootAuditable(): void
    {
        static::created(function (Model $model): void {
            $model->writeAuditLog('created', null, null);
        });

        static::updated(function (Model $model): void {
            $changes = Arr::except($model->getChanges(), config('audit.ignored_model_fields', []));

            if ($changes === []) {
                return;
            }

            $newValues = Arr::only($model->auditAttributesForAudit(), array_keys($changes));
            $oldValues = Arr::only($model->getOriginal(), array_keys($changes));

            $model->writeAuditLog('updated', $oldValues, $newValues);
        });

        static::deleted(function (Model $model): void {
            $model->writeAuditLog('deleted', null, null);
        });

        if (in_array(SoftDeletes::class, class_uses_recursive(static::class), true)) {
            static::restored(function (Model $model): void {
                $model->writeAuditLog('restored', null, null);
            });
        }
    }

    public function writeAuditLog(string $event, ?array $oldValues, ?array $newValues, array $metadata = []): void
    {
        $service = app(AuditService::class);

        if ($service->shouldSkipAutomaticModelAudit(request())) {
            return;
        }

        $service->logModelEvent(
            $this,
            $event,
            $oldValues,
            $newValues,
            $metadata + [
                'automatic' => true,
            ],
            $this->auditOnly(),
            $this->auditExclude()
        );
    }

    public function auditAttributesForAudit(): array
    {
        return $this->attributesToArray();
    }

    public function auditModule(): string
    {
        return property_exists($this, 'auditModule') ? $this->auditModule : \Illuminate\Support\Str::snake(class_basename($this));
    }

    public function auditLabel(): string
    {
        foreach (['full_name', 'name', 'title', 'label', 'code', 'admission_number', 'staff_number', 'invoice_number', 'email'] as $field) {
            try {
                $value = $this->getAttribute($field);
            } catch (MissingAttributeException) {
                continue;
            }

            if (filled($value)) {
                return (string) $value;
            }
        }

        return class_basename($this).' #'.$this->getKey();
    }

    public function auditOnly(): array
    {
        return property_exists($this, 'auditOnly') ? $this->auditOnly : [];
    }

    public function auditExclude(): array
    {
        return property_exists($this, 'auditExclude') ? $this->auditExclude : [];
    }
}
