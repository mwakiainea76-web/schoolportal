<?php

namespace App\Repositories\FeeManagement\Eloquent;

use App\Models\FeePlan;
use App\Models\FeePlanAssignment;
use App\Repositories\FeeManagement\Contracts\FeePlanAssignmentRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

class EloquentFeePlanAssignmentRepository implements FeePlanAssignmentRepositoryInterface
{
    public function findActiveConflict(int $curriculumId, int $academicYearId, int $sessionId): ?FeePlanAssignment
    {
        return FeePlanAssignment::query()
            ->with(['feePlan', 'curriculum', 'academicYear', 'session'])
            ->active()
            ->where('curriculum_id', $curriculumId)
            ->where('academic_year_id', $academicYearId)
            ->where('session_id', $sessionId)
            ->first();
    }

    public function create(array $data): FeePlanAssignment
    {
        return FeePlanAssignment::create($data);
    }

    public function bulkInsert(array $rows): void
    {
        FeePlanAssignment::insert($rows);
    }

    public function assignmentsForPlan(FeePlan $feePlan): Collection
    {
        return $feePlan->assignments()
            ->with(['curriculum', 'academicYear', 'session', 'assignedBy', 'cancelledBy', 'revisesAssignment'])
            ->latest('assigned_at')
            ->get();
    }

    public function assignmentsForCurriculum(int $curriculumId): Collection
    {
        return FeePlanAssignment::query()
            ->with(['feePlan', 'academicYear', 'session', 'assignedBy', 'cancelledBy', 'revisesAssignment'])
            ->where('curriculum_id', $curriculumId)
            ->latest('assigned_at')
            ->get();
    }

    public function findById(string $id): ?FeePlanAssignment
    {
        return FeePlanAssignment::query()
            ->with(['feePlan', 'curriculum', 'academicYear', 'session', 'assignedBy', 'cancelledBy'])
            ->find($id);
    }

    public function cancel(FeePlanAssignment $assignment, int $userId, string $reason): FeePlanAssignment
    {
        $assignment->update([
            'status' => 'cancelled',
            'cancelled_by' => $userId,
            'cancelled_at' => now(),
            'cancellation_reason' => $reason,
        ]);

        return $assignment->refresh();
    }

    public function activeAssignmentsForPlanTuple(FeePlan $feePlan, int $academicYearId, int $sessionId): Collection
    {
        return $feePlan->assignments()
            ->active()
            ->where('academic_year_id', $academicYearId)
            ->where('session_id', $sessionId)
            ->get();
    }

    public function conflictsForCurricula(array $curriculumIds, int $academicYearId, int $sessionId): Collection
    {
        return FeePlanAssignment::query()
            ->with(['feePlan', 'curriculum'])
            ->active()
            ->where('academic_year_id', $academicYearId)
            ->where('session_id', $sessionId)
            ->whereIn('curriculum_id', $curriculumIds)
            ->get();
    }

    public function unassignedCurricula(int $academicYearId, int $sessionId): Collection
    {
        return \App\Models\Curriculum::query()
            ->active()
            ->whereDoesntHave('feePlanAssignments', function ($query) use ($academicYearId, $sessionId) {
                $query->where('academic_year_id', $academicYearId)
                    ->where('session_id', $sessionId)
                    ->where('status', 'active');
            })
            ->orderBy('name')
            ->get();
    }
}

