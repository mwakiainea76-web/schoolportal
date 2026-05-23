<?php

namespace App\Repositories\FeeManagement\Contracts;

use App\Models\FeePlan;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

interface FeePlanRepositoryInterface
{
    public function create(array $data): FeePlan;

    public function paginate(?string $status): LengthAwarePaginator;

    public function findById(int $id): ?FeePlan;

    public function findByIdWithDetails(int $id): ?FeePlan;

    public function update(FeePlan $feePlan, array $data): FeePlan;

    public function delete(FeePlan $feePlan): void;

    public function hasName(string $name, ?int $ignoreId = null): bool;

    public function hasAnyAssignments(FeePlan $feePlan): bool;

    public function hasActiveAssignments(FeePlan $feePlan): bool;

    public function previousAcademicYears(FeePlan $feePlan): Collection;
}
