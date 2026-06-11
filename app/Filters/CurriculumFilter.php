<?php

namespace App\Filters;

use Illuminate\Database\Eloquent\Builder;

class CurriculumFilter
{
    protected array $allowedSorts = [
        'id' => 'id',
        'name' => 'name',
        'start_date' => 'start_date',
        'end_date' => 'end_date',
        'created' => 'created_at',
        'created_at' => 'created_at',
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
            $q->where('name', 'like', "%{$search}%")
                ->orWhere('description', 'like', "%{$search}%");
        });
    }

    protected function sort(Builder $query, string $sort, string $direction): void
    {
        $direction = in_array($direction, ['asc', 'desc']) ? $direction : 'desc';

        $column = $this->allowedSorts[$sort] ?? 'created_at';

        $query->orderBy($column, $direction);
    }
}
