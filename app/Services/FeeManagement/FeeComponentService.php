<?php

namespace App\Services\FeeManagement;

use App\Exceptions\ApiException;
use App\Models\FeeComponent;
use App\Models\FeePlan;
use App\Repositories\FeeManagement\Contracts\FeeComponentRepositoryInterface;

class FeeComponentService
{
    public function __construct(
        protected FeePlanService $plans,
        protected FeeComponentRepositoryInterface $components
    ) {}

    public function create(int $planId, array $data): FeeComponent
    {
        $plan = $this->plans->findPlan($planId);
        $this->assertDraftPlan($plan);
        $this->assertAmount($data['amount']);

        return $this->components->create($plan, $data);
    }

    public function update(int $planId, string $componentId, array $data): FeeComponent
    {
        $plan = $this->plans->findPlan($planId);
        $this->assertDraftPlan($plan);
        $this->assertAmount($data['amount']);

        $component = $this->findComponent($plan, $componentId);

        return $this->components->update($component, $data);
    }

    public function delete(int $planId, string $componentId): void
    {
        $plan = $this->plans->findPlan($planId);
        $this->assertDraftPlan($plan);

        $component = $this->findComponent($plan, $componentId);
        $this->components->delete($component);
    }

    public function snapshot(FeePlan $plan): array
    {
        $components = $this->components->planComponents($plan);

        return [
            'total' => (float) $components->sum('amount'),
            'components' => $components->map(fn (FeeComponent $component) => [
                'name' => $component->name,
                'amount' => (float) $component->amount,
                'is_optional' => $component->is_optional,
                'display_order' => $component->display_order,
            ])->values()->all(),
        ];
    }

    private function findComponent(FeePlan $plan, string $componentId): FeeComponent
    {
        $component = $this->components->findForPlan($plan, $componentId);

        if (! $component) {
            throw new ApiException('PLAN_NOT_FOUND', 'Fee component not found for this plan.', 404);
        }

        return $component;
    }

    private function assertDraftPlan(FeePlan $plan): void
    {
        if ($plan->status !== 'draft') {
            throw new ApiException(
                'PLAN_HAS_ACTIVE_ASSIGNMENTS',
                'This plan has been published and has active assignments. To change amounts, archive this plan and create a new one.',
                422
            );
        }
    }

    private function assertAmount(mixed $amount): void
    {
        if ($amount === null || (float) $amount <= 0) {
            throw new ApiException('COMPONENT_AMOUNT_INVALID', 'Fee component amount must be greater than zero.', 422);
        }
    }
}
