<?php

namespace App\Services\FeeManagement;

use App\Exceptions\ApiException;
use App\Models\AcademicSession;
use App\Models\AcademicYear;
use App\Models\FeePlanAssignment;
use App\Repositories\FeeManagement\Contracts\ProgramVersionRepositoryInterface;
use App\Repositories\FeeManagement\Contracts\FeePlanAssignmentRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class FeeAssignmentService
{
    public function __construct(
        protected FeePlanService $plans,
        protected FeeComponentService $components,
        protected FeePlanAssignmentRepositoryInterface $assignments,
        protected ProgramVersionRepositoryInterface $curricula
    ) {}

    public function assign(int $planId, array $data, int $userId): FeePlanAssignment
    {
        $plan = $this->plans->findPlan($planId);
        $this->assertPlanPublished($plan);

        $curriculum = $this->curricula->findActiveById($data['curriculum_id']);
        $academicYear = $this->activeAcademicYear($data['academic_year_id']);
        $session = $this->activeSession($data['session_id']);

        if (! $curriculum) {
            throw new ApiException('CURRICULA_NOT_FOUND', 'Program version not found or inactive.', 404);
        }

        $this->assertSessionYearMatch($session, $academicYear);
        $this->plans->assertReusableYearReview($plan, $academicYear, $session, (bool) ($data['reviewed_and_confirmed'] ?? false));

        $conflict = $this->assignments->findActiveConflict($curriculum->id, $academicYear->id, $session->id);

        if ($conflict) {
            throw new ApiException(
                'ASSIGNMENT_CONFLICT',
                'An active fee assignment already exists for this program version, academic year, and session.',
                409,
                $this->conflictDetails($conflict)
            );
        }

        $revisesAssignmentId = $this->resolveRevisionTarget($data, $curriculum->id, $academicYear->id, $session->id);

        return $this->assignments->create([
            'fee_plan_id' => $plan->id,
            'curriculum_id' => $curriculum->id,
            'academic_year_id' => $academicYear->id,
            'session_id' => $session->id,
            'plan_type_context' => $data['plan_type_context'],
            'revises_assignment_id' => $revisesAssignmentId,
            'amount_snapshot' => $this->components->snapshot($plan),
            'assigned_by' => $userId,
            'assigned_at' => now(),
            'status' => 'active',
        ]);
    }

    public function bulkAssign(int $planId, array $data, int $userId): array
    {
        $plan = $this->plans->findPlan($planId);
        $this->assertPlanPublished($plan);

        $academicYear = $this->activeAcademicYear($data['academic_year_id']);
        $session = $this->activeSession($data['session_id']);
        $this->assertSessionYearMatch($session, $academicYear);
        $this->plans->assertReusableYearReview($plan, $academicYear, $session, (bool) ($data['reviewed_and_confirmed'] ?? false));

        $curricula = $this->curricula->activeByDepartmentAndCertificationLevel(
            $data['department_id'],
            $data['certification_level']
        );

        if ($curricula->isEmpty()) {
            throw new ApiException(
                'CURRICULA_NOT_FOUND',
                'No active curricula found for this department and certification level.',
                404
            );
        }

        $conflicts = $this->assignments->conflictsForCurricula(
            $curricula->pluck('id')->all(),
            $academicYear->id,
            $session->id
        );

        if ($conflicts->isNotEmpty() && ! ($data['force'] ?? false)) {
            throw new ApiException(
                'ASSIGNMENT_BULK_CONFLICT',
                'Bulk assignment has conflicts and requires force confirmation to overwrite.',
                409,
                [
                    'force' => false,
                    'conflicts' => $conflicts->map(fn (FeePlanAssignment $assignment) => [
                        'curriculum_id' => $assignment->curriculum_id,
                        'program_version_name' => $assignment->curriculum?->name,
                        'current_plan_name' => $assignment->feePlan?->name,
                        'assigned_date' => optional($assignment->assigned_at)->toIso8601String(),
                    ])->values()->all(),
                ]
            );
        }

        if (($data['plan_type_context'] ?? 'original') === 'revised' && $conflicts->count() !== $curricula->count()) {
            throw new ApiException(
                'ASSIGNMENT_BULK_CONFLICT',
                'Bulk revised assignments require an existing assignment for every targeted program-versions.',
                422,
                ['force' => false]
            );
        }

        $snapshot = $this->components->snapshot($plan);
        $overwritten = [];
        $assigned = [];

        DB::transaction(function () use ($curricula, $conflicts, $data, $userId, $plan, $academicYear, $session, $snapshot, &$overwritten, &$assigned) {
            if ($data['force'] ?? false) {
                foreach ($conflicts as $conflict) {
                    $this->assignments->cancel($conflict, $userId, 'Overwritten by bulk assignment');
                    $overwritten[] = $conflict->curriculum_id;
                }
            }

            $conflictsByProgramVersion = $conflicts->keyBy('curriculum_id');
            $rows = [];

            foreach ($curricula as $curriculum) {
                $revisionTarget = null;

                if (($data['plan_type_context'] ?? 'original') === 'revised') {
                    $revisionTarget = $conflictsByProgramVersion->get($curriculum->id)?->id;
                }

                $rows[] = [
                    'id' => (string) Str::uuid(),
                    'fee_plan_id' => $plan->id,
                    'curriculum_id' => $curriculum->id,
                    'academic_year_id' => $academicYear->id,
                    'session_id' => $session->id,
                    'plan_type_context' => $data['plan_type_context'],
                    'revises_assignment_id' => $revisionTarget,
                    'amount_snapshot' => json_encode($snapshot, JSON_THROW_ON_ERROR),
                    'assigned_by' => $userId,
                    'assigned_at' => now(),
                    'status' => 'active',
                    'created_at' => now(),
                    'updated_at' => now(),
                ];

                $assigned[] = $curriculum->id;
            }

            $this->assignments->bulkInsert($rows);
        });

        return [
            'assigned' => array_values($assigned),
            'overwritten' => array_values($overwritten),
            'skipped' => [],
            'total' => count($assigned),
        ];
    }

    public function assignmentsForPlan(int $planId): Collection
    {
        $plan = $this->plans->findPlan($planId);

        return $this->assignments->assignmentsForPlan($plan);
    }

    public function assignmentsForProgramVersion(int $curriculumId): Collection
    {
        return $this->assignments->assignmentsForProgramVersion($curriculumId);
    }

    public function cancel(string $assignmentId, string $reason, int $userId): FeePlanAssignment
    {
        $assignment = $this->assignments->findById($assignmentId);

        if (! $assignment) {
            throw new ApiException('ASSIGNMENT_CONFLICT', 'Assignment not found.', 404);
        }

        if ($assignment->status === 'cancelled') {
            return $assignment;
        }

        return $this->assignments->cancel($assignment, $userId, $reason);
    }

    public function unassignedCurricula(int $academicYearId, int $sessionId): Collection
    {
        $academicYear = $this->activeAcademicYear($academicYearId);
        $session = $this->activeSession($sessionId);
        $this->assertSessionYearMatch($session, $academicYear);

        return $this->assignments->unassignedCurricula($academicYearId, $sessionId);
    }

    private function resolveRevisionTarget(array $data, int $curriculumId, int $academicYearId, int $sessionId): ?string
    {
        if ($data['plan_type_context'] !== 'revised') {
            return null;
        }

        $revisesAssignmentId = $data['revises_assignment_id'] ?? null;

        if (! $revisesAssignmentId) {
            throw new ApiException(
                'ASSIGNMENT_CONFLICT',
                'revises_assignment_id is required when plan_type_context is revised.',
                422
            );
        }

        $assignment = $this->assignments->findById($revisesAssignmentId);

        if (! $assignment ||
            $assignment->curriculum_id !== $curriculumId ||
            $assignment->academic_year_id !== $academicYearId ||
            $assignment->session_id !== $sessionId) {
            throw new ApiException(
                'ASSIGNMENT_CONFLICT',
                'The revision target must match the same curriculum, academic year, and session.',
                422
            );
        }

        return $assignment->id;
    }

    private function activeAcademicYear(int $id): AcademicYear
    {
        $academicYear = AcademicYear::query()->where('is_active', true)->find($id);

        if (! $academicYear) {
            throw new ApiException('PLAN_NOT_FOUND', 'Academic year not found or inactive.', 404);
        }

        return $academicYear;
    }

    private function activeSession(int $id): AcademicSession
    {
        $session = AcademicSession::query()->where('is_active', true)->find($id);

        if (! $session) {
            throw new ApiException('PLAN_NOT_FOUND', 'Session not found or inactive.', 404);
        }

        return $session;
    }

    private function assertSessionYearMatch(AcademicSession $session, AcademicYear $academicYear): void
    {
        if ($session->academic_year_id !== $academicYear->id) {
            throw new ApiException(
                'SESSION_YEAR_MISMATCH',
                'The selected session does not belong to the provided academic year.',
                422
            );
        }
    }

    private function assertPlanPublished($plan): void
    {
        if ($plan->status !== 'published') {
            throw new ApiException('PLAN_NOT_PUBLISHED', 'Only published plans can be assigned.', 422);
        }
    }

    private function conflictDetails(FeePlanAssignment $conflict): array
    {
        return [
            'assignment_id' => $conflict->id,
            'curriculum_id' => $conflict->curriculum_id,
            'program_version_name' => $conflict->curriculum?->name,
            'academic_year_id' => $conflict->academic_year_id,
            'session_id' => $conflict->session_id,
            'fee_plan_id' => $conflict->fee_plan_id,
            'fee_plan_name' => $conflict->feePlan?->name,
            'assigned_at' => optional($conflict->assigned_at)->toIso8601String(),
        ];
    }
}


