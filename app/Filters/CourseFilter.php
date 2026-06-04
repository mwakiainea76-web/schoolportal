<?php

namespace App\Filters;

use Illuminate\Database\Eloquent\Builder;

class CourseFilter
{
    protected array $allowedSorts = [
        'id' => 'id',
        'code' => 'code',
        'name' => 'name',
        'duration' => 'duration_in_months',
        'created_at' => 'created_at',
    ];

    public function apply(Builder $query, array $filters): Builder
    {
        return $query
            ->when($filters['search'] ?? null, fn ($q, $search) => $this->search($q, $search))
            ->when($filters['course_id'] ?? null, fn ($q, $courseId) => $q->whereKey($courseId))
            ->when($filters['department_id'] ?? null, fn ($q, $departmentId) => $q->where('department_id', $departmentId))
            ->when($filters['exam_body_id'] ?? null, function ($q, $examBodyId) {
                $q->whereHas('certificationLevel', fn ($levelQuery) => $levelQuery->where('exam_body_id', $examBodyId));
            })
            ->when($filters['certification_level_id'] ?? null, fn ($q, $levelId) => $q->where('certification_level_id', $levelId))
            ->when($filters['course_version_id'] ?? null, function ($q, $courseVersionId) {
                $q->whereHas('courseVersionMappings', function ($mappingQuery) use ($courseVersionId) {
                    $mappingQuery
                        ->where('course_version_id', $courseVersionId)
                        ->where('is_active', true);
                });
            })
            ->when($filters['sort'] ?? null, fn ($q, $sort) => $this->sort($q, $sort, $filters['direction'] ?? 'desc'));
    }

    protected function search(Builder $query, string $search): void
    {
        $query->where(function ($q) use ($search) {
            $q->where('name', 'like', "%{$search}%");
        });
    }

    protected function sort(Builder $query, string $sort, string $direction): void
    {
        $direction = in_array($direction, ['asc', 'desc']) ? $direction : 'desc';

        $column = $this->allowedSorts[$sort] ?? 'created_at';

        $query->orderBy($column, $direction);
    }
}
