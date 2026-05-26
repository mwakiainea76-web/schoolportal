<?php

namespace App\Filters;

use Illuminate\Database\Eloquent\Builder;

class StudentFilter
{
    public function apply(Builder $query, array $filters)
    {
        $this->joinUsers($query);

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

    protected function joinUsers(Builder $query): void
    {
        $joins = $query->getQuery()->joins ?? [];

        foreach ($joins as $join) {
            if ($join->table === 'users') {
                return;
            }
        }

        $query->join('users', function ($join) {
            $join->on('users.id', '=', 'students.user_id')
                ->whereNull('users.deleted_at');
        });
    }

    protected function search($query, $term)
    {
        $query->where(function ($q) use ($term) {
            $q->where('students.registration_number', 'like', "%{$term}%")
                ->orWhere('users.first_name', 'like', "%{$term}%")
                ->orWhere('users.last_name', 'like', "%{$term}%")
                ->orWhere('users.email', 'like', "%{$term}%")
                ->orWhere('users.phone_number', 'like', "%{$term}%");
        });
    }

    protected function gender($query, $value)
    {
        $query->where('users.gender', $value);
    }

    protected function county($query, $value)
    {
        $query->where('users.county', $value);
    }

    protected function status($query, $value)
    {
        $query->where('students.student_status', $value);
    }

    protected function module($query, $value)
    {
        $query->where('students.current_module', $value);
    }

    protected function active($query, $value)
    {
        $query->where('users.is_active', $value);
    }

    protected function dateRange($query, $filters)
    {
        $from = $filters['date_from'] ?? null;
        $to = $filters['date_to'] ?? null;

        if ($from && $to) {
            $query->whereBetween('students.admission_date', [$from, $to]);
        } elseif ($from) {
            $query->whereDate('students.admission_date', '>=', $from);
        } elseif ($to) {
            $query->whereDate('students.admission_date', '<=', $to);
        }
    }
}
