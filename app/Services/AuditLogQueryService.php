<?php

namespace App\Services;

use App\Models\AuditLog;
use Illuminate\Database\Eloquent\Builder;

class AuditLogQueryService
{
    public function query(array $filters = []): Builder
    {
        return AuditLog::query()
            ->with([
                'user:id,email,login_id',
                'user.roles:id,name',
                'user.staff:id,user_id,first_name,last_name,other_name',
                'user.student:id,user_id,first_name,last_name,other_name',
            ])
            ->when($filters['user_id'] ?? null, fn (Builder $query, $userId) => $query->where('user_id', $userId))
            ->when($filters['module'] ?? null, fn (Builder $query, $module) => $query->where('module', $module))
            ->when($filters['action'] ?? null, fn (Builder $query, $action) => $query->where('action', $action))
            ->when($filters['entity_type'] ?? null, fn (Builder $query, $entityType) => $query->where('entity_type', $entityType))
            ->when($filters['entity_id'] ?? null, fn (Builder $query, $entityId) => $query->where('entity_id', $entityId))
            ->when($filters['date_from'] ?? null, fn (Builder $query, $dateFrom) => $query->whereDate('created_at', '>=', $dateFrom))
            ->when($filters['date_to'] ?? null, fn (Builder $query, $dateTo) => $query->whereDate('created_at', '<=', $dateTo))
            ->when(($filters['high_risk'] ?? '') !== '', function (Builder $query) use ($filters) {
                $isHighRisk = filter_var($filters['high_risk'], FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE);

                if ($isHighRisk === null) {
                    return;
                }

                $query->where('metadata->high_risk', $isHighRisk);
            })
            ->when($filters['search'] ?? null, function (Builder $query, string $search) {
                $query->where(function (Builder $nested) use ($search) {
                    $nested
                        ->where('module', 'like', "%{$search}%")
                        ->orWhere('action', 'like', "%{$search}%")
                        ->orWhere('entity_type', 'like', "%{$search}%")
                        ->orWhere('entity_label', 'like', "%{$search}%")
                        ->orWhere('request_id', 'like', "%{$search}%");
                });
            })
            ->orderByDesc('created_at')
            ->orderByDesc('id');
    }
}
