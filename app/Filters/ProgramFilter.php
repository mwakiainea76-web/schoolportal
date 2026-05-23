<?php

namespace App\Filters;

use Illuminate\Database\Eloquent\Builder;

class ProgramFilter
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
            ->when($filters['sort'] ?? null, fn ($q, $sort) => $this->sort($q, $sort, $filters['direction'] ?? 'desc'));
    }

    protected function search(Builder $query, string $search): void
    {
        $query->where(function ($q) use ($search) {
            $q->where('code', 'like', "%{$search}%")
                ->orWhere('name', 'like', "%{$search}%")
                ->orWhereHas('department', fn ($q) => $q->where('name', 'like', "%{$search}%")
                );
        });
    }

    protected function sort(Builder $query, string $sort, string $direction): void
    {
        $direction = in_array($direction, ['asc', 'desc']) ? $direction : 'desc';

        $column = $this->allowedSorts[$sort] ?? 'created_at';

        $query->orderBy($column, $direction);
    }
}

