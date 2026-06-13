<?php

namespace App\Services;

use App\Models\Student;
use App\Models\StudentStatusLog;
use Carbon\CarbonInterface;
use Illuminate\Support\Carbon;

class StudentEnrollmentStatusService
{
    public function ensureCurrentStatusLogged(Student $student, array $extra = []): ?StudentStatusLog
    {
        $this->syncUserActiveState($student, $student->enrollment_status);

        if ($student->statusLogs()->exists()) {
            return $student->statusLogs()
                ->latest('effective_date')
                ->latest('id')
                ->first();
        }

        return $student->statusLogs()->create([
            'status' => $student->enrollment_status,
            'effective_date' => $this->normalizeDate($extra['effective_date'] ?? $student->created_at ?? now()),
            'reason' => $extra['reason'] ?? null,
            'resume_date' => $this->normalizeDate($extra['resume_date'] ?? null),
            'recorded_by' => $extra['recorded_by'] ?? auth()->id(),
        ]);
    }

    public function recordInitialStatus(Student $student, array $extra = []): ?StudentStatusLog
    {
        return $this->ensureCurrentStatusLogged($student, $extra);
    }

    public function updateEnrollmentStatus(Student $student, string $status, array $extra = []): ?StudentStatusLog
    {
        $normalizedStatus = strtolower(trim($status));

        $this->syncUserActiveState($student, $normalizedStatus);

        if ($student->enrollment_status === $normalizedStatus) {
            return $this->ensureCurrentStatusLogged($student, $extra);
        }

        $student->update([
            'enrollment_status' => $normalizedStatus,
        ]);

        return $student->statusLogs()->create([
            'status' => $normalizedStatus,
            'effective_date' => $this->normalizeDate($extra['effective_date'] ?? now()),
            'reason' => $extra['reason'] ?? null,
            'resume_date' => $this->normalizeDate($extra['resume_date'] ?? null),
            'recorded_by' => $extra['recorded_by'] ?? auth()->id(),
        ]);
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

    private function syncUserActiveState(Student $student, string $status): void
    {
        if (! $student->user) {
            return;
        }

        $shouldBeActive = $status === 'active';

        if ((bool) $student->user->is_active === $shouldBeActive) {
            return;
        }

        $student->user->update([
            'is_active' => $shouldBeActive,
        ]);
    }
}
