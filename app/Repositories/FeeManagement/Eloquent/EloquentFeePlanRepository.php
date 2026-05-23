<?php

namespace App\Repositories\FeeManagement\Eloquent;

use App\Models\FeePlan;
use App\Repositories\FeeManagement\Contracts\FeePlanRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

class EloquentFeePlanRepository implements FeePlanRepositoryInterface
{
    public function create(array $data): FeePlan
    {
        return FeePlan::create($data);
    }

    public function paginate(?string $status): LengthAwarePaginator
    {
        return FeePlan::query()
            ->withCount(['feeComponents', 'assignments'])
            ->when($status, fn ($query) => $query->where('status', $status))
            ->latest()
            ->paginate(15);
    }

    public function findById(int $id): ?FeePlan
    {
        return FeePlan::find($id);
    }

    public function findByIdWithDetails(int $id): ?FeePlan
    {
        return FeePlan::query()
            ->with([
                'feeComponents',
                'assignments.curriculum',
                'assignments.academicYear',
                'assignments.session',
                'assignments.assignedBy',
                'assignments.cancelledBy',
                'assignments.revisesAssignment',
            ])
            ->find($id);
    }

    public function update(FeePlan $feePlan, array $data): FeePlan
    {
        $feePlan->update($data);

        return $feePlan->refresh();
    }

    public function delete(FeePlan $feePlan): void
    {
        $feePlan->delete();
    }

    public function hasName(string $name, ?int $ignoreId = null): bool
    {
        return FeePlan::query()
            ->where('name', $name)
            ->when($ignoreId, fn ($query) => $query->where('id', '!=', $ignoreId))
            ->exists();
    }

    public function hasAnyAssignments(FeePlan $feePlan): bool
    {
        return $feePlan->assignments()->withTrashed()->exists();
    }

    public function hasActiveAssignments(FeePlan $feePlan): bool
    {
        return $feePlan->assignments()->where('status', 'active')->exists();
    }

    public function previousAcademicYears(FeePlan $feePlan): Collection
    {
        return $feePlan->assignments()
            ->join('academic_years', 'academic_years.id', '=', 'fee_plan_assignments.academic_year_id')
            ->select('academic_years.id', 'academic_years.label', 'academic_years.academic_year')
            ->distinct()
            ->orderBy('academic_years.start_date')
            ->get();
    }
}
