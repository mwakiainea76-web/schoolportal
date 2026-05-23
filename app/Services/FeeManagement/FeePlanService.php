<?php

namespace App\Services\FeeManagement;

use App\Exceptions\ApiException;
use App\Models\AcademicSession;
use App\Models\AcademicYear;
use App\Models\FeePlan;
use App\Repositories\FeeManagement\Contracts\FeeComponentRepositoryInterface;
use App\Repositories\FeeManagement\Contracts\FeePlanRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class FeePlanService
{
    public function __construct(
        protected FeePlanRepositoryInterface $plans,
        protected FeeComponentRepositoryInterface $components
    ) {}

    public function list(?string $status): LengthAwarePaginator
    {
        return $this->plans->paginate($status);
    }

    public function create(array $data, int $createdBy): FeePlan
    {
        if ($this->plans->hasName($data['name'])) {
            throw new ApiException('PLAN_NAME_DUPLICATE', 'A fee plan with this name already exists.', 422);
        }

        return $this->plans->create([
            'name' => $data['name'],
            'plan_type' => $data['plan_type'] ?? 'original',
            'status' => 'draft',
            'created_by' => $createdBy,
            'version' => $data['plan_type'] ?? 'original',
            'is_active' => false,
        ]);
    }

    public function details(int $id): FeePlan
    {
        $plan = $this->plans->findByIdWithDetails($id);

        if (! $plan) {
            throw new ApiException('PLAN_NOT_FOUND', 'Fee plan not found.', 404);
        }

        return $plan;
    }

    public function update(int $id, array $data): FeePlan
    {
        $plan = $this->findPlan($id);

        if ($plan->status !== 'draft') {
            throw new ApiException('PLAN_HAS_ACTIVE_ASSIGNMENTS', 'Only draft plans can be updated.', 422);
        }

        if ($this->plans->hasName($data['name'], $plan->id)) {
            throw new ApiException('PLAN_NAME_DUPLICATE', 'A fee plan with this name already exists.', 422);
        }

        return $this->plans->update($plan, [
            'name' => $data['name'],
            'plan_type' => $data['plan_type'] ?? $plan->plan_type,
        ]);
    }

    public function publish(int $id): FeePlan
    {
        $plan = $this->findPlan($id);
        $components = $this->components->planComponents($plan);

        $checks = [];

        if (blank($plan->name)) {
            $checks[] = 'Plan name is required.';
        }

        if ($components->isEmpty()) {
            $checks[] = 'Plan must have at least one component.';
        }

        if ($components->contains(fn ($component) => (float) $component->amount <= 0)) {
            $checks[] = 'All component amounts must be greater than zero.';
        }

        if ($checks !== []) {
            $code = $components->isEmpty() ? 'PLAN_HAS_NO_COMPONENTS' : 'COMPONENT_AMOUNT_INVALID';

            throw new ApiException(
                $code,
                'Fee plan could not be published.',
                422,
                ['checks' => $checks]
            );
        }

        return $this->plans->update($plan, [
            'status' => 'published',
            'is_active' => true,
        ]);
    }

    public function archive(int $id): FeePlan
    {
        $plan = $this->findPlan($id);

        if ($plan->status === 'archived') {
            throw new ApiException('PLAN_ALREADY_ARCHIVED', 'This fee plan is already archived.', 422);
        }

        if ($this->plans->hasActiveAssignments($plan)) {
            throw new ApiException(
                'PLAN_HAS_ACTIVE_ASSIGNMENTS',
                'This fee plan has active assignments and cannot be archived.',
                409,
                $this->assignmentImpactDetails($plan, true)
            );
        }

        return $this->plans->update($plan, [
            'status' => 'archived',
            'is_active' => false,
        ]);
    }

    public function delete(int $id): void
    {
        $plan = $this->findPlan($id);

        if ($this->plans->hasAnyAssignments($plan)) {
            throw new ApiException(
                'PLAN_HAS_ACTIVE_ASSIGNMENTS',
                'This fee plan has assignment history and cannot be deleted. Archive it instead.',
                409,
                $this->assignmentImpactDetails($plan, false)
            );
        }

        $this->plans->delete($plan);
    }

    public function reusePreview(int $id): array
    {
        $plan = $this->details($id);

        return [
            'plan' => $plan,
            'components' => $plan->feeComponents,
            'previous_years' => $this->plans->previousAcademicYears($plan),
            'prompt' => 'Confirm these components and amounts are correct for the selected academic year and session?',
        ];
    }

    public function assertReusableYearReview(FeePlan $plan, AcademicYear $academicYear, AcademicSession $session, bool $reviewed): void
    {
        $previousYears = $this->plans->previousAcademicYears($plan)->pluck('id');
        $isNewYear = ! $previousYears->contains($academicYear->id);

        if ($isNewYear && ! $reviewed) {
            throw new ApiException(
                'REVIEW_NOT_CONFIRMED',
                'You must review and confirm plan components before assigning to a new academic year.',
                422,
                [
                    'academic_year' => $academicYear->label ?? $academicYear->academic_year,
                    'session' => $session->label ?? ('Session '.$session->session_number),
                ]
            );
        }
    }

    public function findPlan(int $id): FeePlan
    {
        $plan = $this->plans->findById($id);

        if (! $plan) {
            throw new ApiException('PLAN_NOT_FOUND', 'Fee plan not found.', 404);
        }

        return $plan;
    }

    private function assignmentImpactDetails(FeePlan $plan, bool $activeOnly): array
    {
        $assignments = $plan->assignments()
            ->with(['curriculum:id,name'])
            ->when($activeOnly, fn ($query) => $query->where('status', 'active'))
            ->get();

        return [
            'count' => $assignments->count(),
            'active_only' => $activeOnly,
            'curricula' => $assignments->map(fn ($assignment) => [
                'assignment_id' => $assignment->id,
                'curriculum_id' => $assignment->curriculum_id,
                'curriculum_name' => $assignment->curriculum?->name,
                'status' => $assignment->status,
            ])->values()->all(),
        ];
    }
}
