<?php

namespace App\Filters;

use Illuminate\Database\Eloquent\Builder;

class FeeAssignmentFilter
{
    protected array $allowedSorts = [
        'created' => 'created_at',
        'fee_plan_id' => 'fee_plan_id',
        'course_curriculum_id' => 'course_version_mapping_id',
        'year_of_study' => 'year_of_study',
        'session_number' => 'session_number',
        'valid_from' => 'valid_from',
        'valid_to' => 'valid_to',
    ];

    public function apply(Builder $query, array $filters): Builder
    {
        return $query
            ->when($filters['academic_year_id'] ?? null, fn ($q, $id) => $q->where('academic_year_id', $id)
            )

            ->when($filters['course_curriculum_id'] ?? null, fn ($q, $id) => $q->where('course_version_mapping_id', $id)
            )

            ->when($filters['fee_plan_id'] ?? null, fn ($q, $id) => $q->where('fee_plan_id', $id)
            )

            ->when($filters['year_of_study'] ?? null, fn ($q, $value) => $q->where('year_of_study', $value)
            )

            ->when($filters['session_number'] ?? null, fn ($q, $value) => $q->where('session_number', $value)
            )

            ->when($filters['is_active'] ?? null, fn ($q, $value) => $q->where('is_active', $value === 'true' || $value === true)
            )

            ->when($filters['active_only'] ?? null, fn ($q) => $q->where(function ($q2) {
                $q2->whereNull('valid_to')
                    ->orWhere('valid_to', '>=', now()->toDateString());
            })->where('valid_from', '<=', now()->toDateString())
            )

            ->when($filters['sort'] ?? null, fn ($q, $sort) => $this->sort($q, $sort, $filters['direction'] ?? 'desc')
            );
    }

    protected function sort(Builder $query, string $sort, string $direction): void
    {
        $direction = in_array($direction, ['asc', 'desc']) ? $direction : 'desc';

        $column = $this->allowedSorts[$sort] ?? 'created_at';

        $query->orderBy($column, $direction);
    }
}
