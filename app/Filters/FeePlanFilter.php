<?php

namespace App\Filters;

use Illuminate\Database\Eloquent\Builder;

class FeePlanFilter
{
    protected array $allowedSorts = [
        'id' => 'id',
        'name' => 'name',
        'version' => 'version',
        'status' => 'is_active',
        'created' => 'created_at',
        'updated' => 'updated_at',
    ];

    public function apply(Builder $query, array $filters): Builder
    {
        return $query
            ->when($filters['search'] ?? null, fn ($q, $search) => $this->search($q, $search))
            ->when($filters['is_active'] ?? null, fn ($q, $status) => $this->status($q, $status))
            ->when($filters['version'] ?? null, fn ($q, $version) => $this->version($q, $version))
            ->when($filters['created_by'] ?? null, fn ($q, $createdBy) => $this->createdBy($q, $createdBy))
            ->when($filters['sort'] ?? null, fn ($q, $sort) =>
                $this->sort($q, $sort, $filters['direction'] ?? 'desc')
            );
    }

    /**
     * SEARCH (name only or extended if needed)
     */
    protected function search(Builder $query, string $search): void
    {
        $query->where(function ($q) use ($search) {
            $q->where('name', 'like', "%{$search}%")
              ->orWhere('version', 'like', "%{$search}%");
        });
    }

    /**
     * FILTER BY ACTIVE STATUS
     */
    protected function status(Builder $query, string $status): void
    {
        $query->where('is_active', $status);
    }

    /**
     * FILTER BY VERSION
     */
    protected function version(Builder $query, string $version): void
    {
        $query->where('version', $version);
    }

    /**
     * FILTER BY CREATOR (staff)
     */
    protected function createdBy(Builder $query, int $createdBy): void
    {
        $query->where('created_by', $createdBy);
    }

    /**
     * SORTING LOGIC
     */
    protected function sort(Builder $query, string $sort, string $direction): void
    {
        $direction = in_array($direction, ['asc', 'desc']) ? $direction : 'desc';

        $column = $this->allowedSorts[$sort] ?? 'created_at';

        $query->orderBy($column, $direction);
    }
}