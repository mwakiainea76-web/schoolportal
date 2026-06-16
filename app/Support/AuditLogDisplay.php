<?php

namespace App\Support;

use App\Models\AuditLog;
use App\Models\User;
use Illuminate\Support\Arr;
use Illuminate\Support\Str;

class AuditLogDisplay
{
    public static function toArray(AuditLog $log, bool $detailed = false, ?string $dateFormat = 'd M, Y h:i A'): array
    {
        $payload = [
            'id' => $log->id,
            'user_id' => $log->user_id,
            'school_id' => $log->school_id,
            'created_at' => self::formatDate($log, $dateFormat),
            'module' => $log->module,
            'module_label' => self::moduleLabel($log->module),
            'action' => $log->action,
            'action_label' => self::actionLabel($log->action),
            'entity_type' => $log->entity_type,
            'entity_id' => $log->entity_id,
            'entity_label' => $log->entity_label,
            'entity_record_label' => self::entityRecordLabel($log),
            'event_description' => self::eventDescription($log),
            'change_summary' => self::changeSummary($log),
            'platform' => self::platform($log),
            'ip_address' => $log->ip_address,
            'request_id' => $log->request_id,
            'user' => $log->user ? [
                'id' => (string) $log->user->id,
                'name' => self::userDisplayLabel($log->user),
                'email' => $log->user->email,
                'login_id' => $log->user->login_id,
            ] : null,
            'is_high_risk' => (bool) data_get($log->metadata, 'high_risk', false),
        ];

        if ($detailed) {
            $payload += [
                'old_values' => $log->old_values,
                'new_values' => $log->new_values,
                'old_values_display' => self::displayPayload($log->old_values),
                'new_values_display' => self::displayPayload($log->new_values),
                'metadata' => $log->metadata,
                'user_agent_hash' => $log->user_agent_hash,
            ];
        }

        return $payload;
    }

    public static function moduleLabel(?string $module): string
    {
        return Str::headline((string) ($module ?: 'system'));
    }

    public static function actionLabel(?string $action): string
    {
        $action = Str::lower((string) $action);

        foreach ([
            'created' => 'Created',
            'updated' => 'Updated',
            'deleted' => 'Deleted',
            'restored' => 'Restored',
            'changed' => 'Changed',
            'recorded' => 'Recorded',
            'granted' => 'Granted',
            'failure' => 'Failed',
            'success' => 'Succeeded',
        ] as $suffix => $label) {
            if (Str::endsWith($action, '_'.$suffix) || $action === $suffix) {
                return $label;
            }
        }

        return Str::headline($action ?: 'Activity');
    }

    public static function platform(AuditLog $log): string
    {
        $platform = data_get($log->metadata, 'platform');

        if (filled($platform)) {
            return Str::headline((string) $platform);
        }

        return $log->request_id ? 'Web' : 'System';
    }

    public static function eventDescription(AuditLog $log): string
    {
        $actor = $log->user_id ? 'User' : 'System';
        $verb = Str::lower(self::actionLabel($log->action));
        $record = 'a '.self::entityRecordLabel($log).' record';
        $id = $log->entity_id
            ? ' (ID: '.$log->entity_id.').'
            : '.';

        return trim("{$actor} {$verb} {$record}{$id}");
    }

    public static function entityRecordLabel(AuditLog $log): string
    {
        $type = $log->entity_type ?: Str::singular((string) $log->module) ?: 'record';

        return Str::studly(Str::singular($type));
    }

    public static function changeSummary(AuditLog $log): array
    {
        if (in_array(self::actionLabel($log->action), ['Created', 'Deleted', 'Restored'], true)) {
            return [];
        }

        $ignored = config('audit.ignored_model_fields', []);
        $oldValues = Arr::except($log->old_values ?? [], $ignored);
        $newValues = Arr::except($log->new_values ?? [], $ignored);

        if ($oldValues === [] && $newValues === []) {
            return [];
        }

        $keys = collect(array_keys($oldValues))
            ->merge(array_keys($newValues))
            ->unique()
            ->values();

        $limit = (int) config('audit.max_display_changes', 8);

        return $keys
            ->take($limit)
            ->map(function (string $key) use ($oldValues, $newValues) {
                $label = self::fieldLabel($key);
                $hasOld = Arr::exists($oldValues, $key);
                $hasNew = Arr::exists($newValues, $key);

                if ($hasOld && $hasNew) {
                    return "Changed {$label} from ".self::formatValue($oldValues[$key]).' to '.self::formatValue($newValues[$key]);
                }

                if ($hasNew) {
                    return "Set {$label} to ".self::formatValue($newValues[$key]);
                }

                return "Removed {$label} value ".self::formatValue($oldValues[$key]);
            })
            ->when($keys->count() > $limit, function ($items) use ($keys, $limit) {
                return $items->push('And '.($keys->count() - $limit).' more change(s)');
            })
            ->all();
    }

    public static function displayPayload(?array $payload): array
    {
        if (! $payload) {
            return [];
        }

        return collect(Arr::except($payload, config('audit.ignored_model_fields', [])))
            ->mapWithKeys(fn ($value, $key) => [self::fieldLabel((string) $key) => self::plainValue($value)])
            ->all();
    }

    public static function userDisplayLabel(User $user): string
    {
        $roleLabel = $user->relationLoaded('roles')
            ? $user->roles->pluck('name')->filter()->map(fn ($role) => ucfirst((string) $role))->join(' / ')
            : '';

        $profile = $user->relationLoaded('student') && $user->student
            ? $user->student
            : (($user->relationLoaded('staff') && $user->staff) ? $user->staff : null);

        $name = $profile?->full_name
            ?: $user->login_id
            ?: $user->email;

        return trim(($roleLabel !== '' ? $roleLabel.' - ' : '').$name);
    }

    protected static function formatDate(AuditLog $log, ?string $dateFormat): ?string
    {
        if (! $log->created_at) {
            return null;
        }

        return $dateFormat ? $log->created_at->format($dateFormat) : $log->created_at->toDateTimeString();
    }

    protected static function fieldLabel(string $field): string
    {
        return Str::headline(str_replace('.', ' ', $field));
    }

    protected static function formatValue(mixed $value): string
    {
        return "'".self::plainValue($value)."'";
    }

    protected static function plainValue(mixed $value): string
    {
        if ($value === null) {
            return 'null';
        }

        if ($value === '') {
            return 'blank';
        }

        if (is_bool($value)) {
            return $value ? 'yes' : 'no';
        }

        if (is_array($value)) {
            return json_encode($value, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE) ?: '[complex value]';
        }

        return (string) $value;
    }
}
