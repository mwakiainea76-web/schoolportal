<?php

namespace App\Services;

use App\Models\Staff;
use App\Models\StaffStatusLog;
use Carbon\CarbonInterface;
use Illuminate\Support\Carbon;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;

class StaffStatusService
{
    public function ensureCurrentStatusLogged(Staff $staff, array $extra = []): ?StaffStatusLog
    {
        $this->syncUserActiveState($staff, $staff->staff_status);

        if ($staff->statusLogs()->exists()) {
            return $staff->statusLogs()
                ->latest('effective_date')
                ->latest('id')
                ->first();
        }

        return $staff->statusLogs()->create([
            'status' => $staff->staff_status,
            'effective_date' => $this->normalizeDate($extra['effective_date'] ?? $staff->created_at ?? now()),
            'reason' => $extra['reason'] ?? null,
            'resume_date' => $this->normalizeDate($extra['resume_date'] ?? null),
            'recorded_by' => $extra['recorded_by'] ?? auth()->id(),
        ]);
    }

    public function recordInitialStatus(Staff $staff, array $extra = []): ?StaffStatusLog
    {
        return $this->ensureCurrentStatusLogged($staff, $extra);
    }

    public function updateStatus(Staff $staff, string $status, array $extra = []): ?StaffStatusLog
    {
        $normalizedStatus = strtolower(trim($status));

        return DB::transaction(function () use ($staff, $normalizedStatus, $extra) {
            $currentStatus = $staff->staff_status;
            $this->syncUserActiveState($staff, $normalizedStatus);

            if ($currentStatus === $normalizedStatus) {
                return $this->ensureCurrentStatusLogged($staff, $extra);
            }

            $staff->update([
                'staff_status' => $normalizedStatus,
            ]);

            $log = $staff->statusLogs()->create([
                'status' => $normalizedStatus,
                'effective_date' => $this->normalizeDate($extra['effective_date'] ?? now()),
                'reason' => $extra['reason'] ?? null,
                'resume_date' => $this->normalizeDate($extra['resume_date'] ?? null),
                'recorded_by' => $extra['recorded_by'] ?? auth()->id(),
            ]);

            AuditService::log([
                'module' => 'staff',
                'action' => 'staff_status_changed',
                'entity' => $staff,
                'old_values' => [
                    'staff_status' => $currentStatus,
                ],
                'new_values' => [
                    'staff_status' => $normalizedStatus,
                ],
                'metadata' => Arr::only([
                    'effective_date' => $this->normalizeDate($extra['effective_date'] ?? now()),
                    'reason' => $extra['reason'] ?? null,
                    'resume_date' => $this->normalizeDate($extra['resume_date'] ?? null),
                    'status_log_id' => $log->id,
                ], ['effective_date', 'reason', 'resume_date', 'status_log_id']),
                'high_risk' => in_array($normalizedStatus, ['suspended', 'exited'], true),
            ]);

            return $log;
        });
    }

    private function normalizeDate(mixed $value): ?string
    {
        if ($value === null || $value === '') {
            return null;
        }

        if ($value instanceof CarbonInterface) {
            return $value->toDateString();
        }

        return Carbon::parse($value)->toDateString();
    }

    private function syncUserActiveState(Staff $staff, string $status): void
    {
        if (! $staff->user) {
            return;
        }

        $shouldBeActive = $status === 'active';

        if ((bool) $staff->user->is_active === $shouldBeActive) {
            return;
        }

        $staff->user->update([
            'is_active' => $shouldBeActive,
        ]);
    }
}
