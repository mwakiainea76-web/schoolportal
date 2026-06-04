<?php

namespace App\Repositories\FeeManagement\Contracts;

use App\Models\FeePlan;
use App\Models\FeePlanAssignment;
use Illuminate\Database\Eloquent\Collection;

interface FeePlanAssignmentRepositoryInterface
{
    public function findActiveConflict(int $curriculumId, int $academicYearId, int $sessionId): ?FeePlanAssignment;

    public function create(array $data): FeePlanAssignment;

    public function bulkInsert(array $rows): void;

    public function assignmentsForPlan(FeePlan $feePlan): Collection;

    public function assignmentsForCourseVersion(int $curriculumId): Collection;

    public function findById(string $id): ?FeePlanAssignment;

    public function cancel(FeePlanAssignment $assignment, int $userId, string $reason): FeePlanAssignment;

    public function activeAssignmentsForPlanTuple(FeePlan $feePlan, int $academicYearId, int $sessionId): Collection;

    public function conflictsForCurricula(array $curriculumIds, int $academicYearId, int $sessionId): Collection;

    public function unassignedCurricula(int $academicYearId, int $sessionId): Collection;
}

