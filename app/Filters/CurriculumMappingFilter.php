<?php

namespace App\Filters;

use Illuminate\Database\Eloquent\Builder;

class CurriculumMappingFilter
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
        $query
            ->when($filters['search'] ?? null, fn ($q, $search) => $this->search($q, $search))
            ->when($filters['sort'] ?? null, fn ($q, $sort) => $this->sort($q, $sort, $filters['direction'] ?? 'desc'));

        if (($filters['course_id'] ?? '') !== '') {
            $query->where('course_id', $filters['course_id']);
        }

        if (($filters['curriculum_id'] ?? '') !== '') {
            $query->where('curriculum_id', $filters['curriculum_id']);
        }

        if (($filters['exam_body_id'] ?? '') !== '') {
            $query->whereHas('course.certificationLevel', function ($levelQuery) use ($filters) {
                $levelQuery->where('exam_body_id', $filters['exam_body_id']);
            });
        }

        if (($filters['is_active'] ?? '') !== '' && in_array((string) $filters['is_active'], ['0', '1'], true)) {
            $query->where('is_active', (bool) $filters['is_active']);
        }

        return $query;
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
