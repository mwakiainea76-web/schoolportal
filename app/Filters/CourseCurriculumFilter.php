<?php

namespace App\Filters;

use Illuminate\Database\Eloquent\Builder;

class CourseCurriculumFilter
{
    protected array $allowedSorts = [
        'id' => 'id',
        'name' => 'curriculum_id',
        'course' => 'course_id',
        'created' => 'created_at',
        'created_at' => 'created_at',
        'is_active' => 'is_active',
    ];

    public function apply(Builder $query, array $filters): Builder
    {
        return $query
            ->when($filters['search'] ?? null, fn ($q, $search) => $this->search($q, $search))
            ->when($filters['sort'] ?? null, fn ($q, $sort) => $this->sort($q, $sort, $filters['direction'] ?? 'desc'));
    }

    protected function search(Builder $query, string $search): void
    {
        $query->where(function ($q) use ($search) {
            $q->whereHas('curriculum', function ($curriculumQuery) use ($search) {
                $curriculumQuery->where('name', 'like', "%{$search}%");
            })->orWhereHas('course', function ($courseQuery) use ($search) {
                $courseQuery->where('name', 'like', "%{$search}%")
                    ->orWhere('code', 'like', "%{$search}%");
            });
        });
    }

    protected function sort(Builder $query, string $sort, string $direction): void
    {
        $direction = in_array($direction, ['asc', 'desc']) ? $direction : 'desc';

        $column = $this->allowedSorts[$sort] ?? 'created_at';

        $query->orderBy($column, $direction);
    }
}
