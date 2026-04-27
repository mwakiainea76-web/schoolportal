<?php
namespace App\Filters;

use Illuminate\Database\Eloquent\Builder;

class FeeTemplateFilter
{
    public function apply(Builder $query, array $filters): Builder
    {
        return $query
            ->when($filters['search'] ?? null, fn ($q, $search) => $this->search($q, $search))
            ->when($filters['status'] ?? null, fn ($q, $status) => $this->status($q, $status))
            ->when($filters['reusable'] ?? null, fn ($q, $reusable) => $this->reusable($q, $reusable))
            ->when($filters['sort'] ?? null, fn ($q) => $this->sort($q, $filters));
    }

    // ---------------- SEARCH ----------------
    protected function search(Builder $query, string $search): void
    {
        $query->where(function ($q) use ($search) {
            $q->where('name', 'like', "%{$search}%")
              ->orWhere('description', 'like', "%{$search}%");
        });
    }

    // ---------------- STATUS FILTER ----------------
    protected function status(Builder $query, string $status): void
    {
        if ($status === 'active') {
            $query->where('is_active', true);
        }

        if ($status === 'inactive') {
            $query->where('is_active', false);
        }
    }

    // ---------------- REUSABLE FILTER ----------------
    protected function reusable(Builder $query, string $reusable): void
    {
        if ($reusable === 'yes') {
            $query->where('is_reusable', true);
        }

        if ($reusable === 'no') {
            $query->where('is_reusable', false);
        }
    }

    // ---------------- SORT ----------------
    protected function sort(Builder $query, array $filters): void
    {
        $field = $filters['sort'] ?? 'created_at';
        $direction = $filters['direction'] ?? 'desc';

        $query->orderBy($field, $direction);
    }
}