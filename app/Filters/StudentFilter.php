<?php

namespace App\Filters;

use Illuminate\Database\Eloquent\Builder;

class StudentFilter
{
    public function apply(Builder $query, array $filters): Builder
    {
        return $query
            ->when($filters['search'] ?? null, fn ($q, $v) => $this->search($q, $v))
            ->when($filters['gender'] ?? null, fn ($q, $v) => $this->gender($q, $v))
            ->when($filters['county'] ?? null, fn ($q, $v) => $this->county($q, $v))
            ->when($filters['status'] ?? null, fn ($q, $v) => $this->status($q, $v))
            ->when($filters['module'] ?? null, fn ($q, $v) => $this->module($q, $v))
            ->when(isset($filters['is_active']), fn ($q) => $this->active($q, $filters['is_active']))
            ->when(
                ($filters['date_from'] ?? null) || ($filters['date_to'] ?? null),
                fn ($q) => $this->dateRange($q, $filters)
            );
    }

    protected function search(Builder $query, string $term): void
    {
        $query->where(function ($q) use ($term) {
            $q->where('students.admission_number', 'like', "%{$term}%")
                ->orWhere('students.first_name', 'like', "%{$term}%")
                ->orWhere('students.last_name', 'like', "%{$term}%")
                ->orWhere('students.email', 'like', "%{$term}%")
                ->orWhere('students.phone_number', 'like', "%{$term}%");
        });
    }

    protected function gender(Builder $query, string $value): void
    {
        $query->where('students.gender', $value);
    }

    protected function county(Builder $query, string $value): void
    {
        $query->where('students.county', $value);
    }

    protected function status(Builder $query, string $value): void
    {
        $query->where('students.enrollment_status', $value);
    }

    protected function module(Builder $query, string $value): void
    {
        $query->where('students.current_module', $value);
    }

    protected function active(Builder $query, mixed $value): void
    {
        $query->whereHas('user', fn ($q) => $q->where('is_active', $value));
    }

    protected function dateRange(Builder $query, array $filters): void
    {
        $from = $filters['date_from'] ?? null;
        $to = $filters['date_to'] ?? null;

        if ($from && $to) {
            $query->whereBetween('students.created_at', [$from, $to]);
        } elseif ($from) {
            $query->whereDate('students.created_at', '>=', $from);
        } elseif ($to) {
            $query->whereDate('students.created_at', '<=', $to);
        }
    }
}
