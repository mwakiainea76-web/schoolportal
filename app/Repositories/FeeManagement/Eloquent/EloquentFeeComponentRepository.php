<?php

namespace App\Repositories\FeeManagement\Eloquent;

use App\Models\FeeComponent;
use App\Models\FeePlan;
use App\Repositories\FeeManagement\Contracts\FeeComponentRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

class EloquentFeeComponentRepository implements FeeComponentRepositoryInterface
{
    public function create(FeePlan $feePlan, array $data): FeeComponent
    {
        return $feePlan->feeComponents()->create($data);
    }

    public function update(FeeComponent $component, array $data): FeeComponent
    {
        $component->update($data);

        return $component->refresh();
    }

    public function delete(FeeComponent $component): void
    {
        $component->delete();
    }

    public function findForPlan(FeePlan $feePlan, string $componentId): ?FeeComponent
    {
        return $feePlan->feeComponents()->where('id', $componentId)->first();
    }

    public function planComponents(FeePlan $feePlan): Collection
    {
        return $feePlan->feeComponents()->get();
    }
}
