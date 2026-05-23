<?php

namespace App\Repositories\FeeManagement\Contracts;

use App\Models\FeeComponent;
use App\Models\FeePlan;
use Illuminate\Database\Eloquent\Collection;

interface FeeComponentRepositoryInterface
{
    public function create(FeePlan $feePlan, array $data): FeeComponent;

    public function update(FeeComponent $component, array $data): FeeComponent;

    public function delete(FeeComponent $component): void;

    public function findForPlan(FeePlan $feePlan, string $componentId): ?FeeComponent;

    public function planComponents(FeePlan $feePlan): Collection;
}
