<?php

namespace App\Filters;

use Illuminate\Database\Eloquent\Builder;

class StudentFilter
{
    public function apply(Builder $query, array $filters)
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

    protected function search($query, $term)
    {
        $query->where(function ($q) use ($term) {
            $q->where('registration_number', 'like', "%$term%")
                ->orWhereHas('user', function ($q2) use ($term) {
                    $q2->where('first_name', 'like', "%$term%")
                        ->orWhere('last_name', 'like', "%$term%")
                        ->orWhere('email', 'like', "%$term%")
                        ->orWhere('phone_number', 'like', "%$term%");
                });
        });
    }

    protected function gender($query, $value)
    {
        $query->whereHas('user', fn ($q) => $q->where('gender', $value));
    }

    protected function county($query, $value)
    {
        $query->whereHas('user', fn ($q) => $q->where('county', $value));
    }

    protected function status($query, $value)
    {
        $query->where('student_status', $value);
    }

    protected function module($query, $value)
    {
        $query->where('current_module', $value);
    }

    protected function active($query, $value)
    {
        $query->whereHas('user', fn ($q) => $q->where('is_active', $value));
    }

    protected function dateRange($query, $filters)
    {
        $from = $filters['date_from'] ?? null;
        $to = $filters['date_to'] ?? null;

        if ($from && $to) {
            $query->whereBetween('admission_date', [$from, $to]);
        } elseif ($from) {
            $query->whereDate('admission_date', '>=', $from);
        } elseif ($to) {
            $query->whereDate('admission_date', '<=', $to);
        }
    }
}
