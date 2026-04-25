<?php

namespace App\Filters;

use Illuminate\Database\Eloquent\Builder;

class StaffFilter
{
    public function apply(Builder $query, array $filters): Builder
    {
        return $query
            // 🔎 SEARCH (user + staff_number)
            ->when($filters['search'] ?? null, function ($q, $search) {
                $q->where(function ($sub) use ($search) {
                    $sub->where('staff_number', 'like', "%{$search}%")
                        ->orWhereHas('user', function ($uq) use ($search) {
                            $uq->where('first_name', 'like', "%{$search}%")
                                ->orWhere('last_name', 'like', "%{$search}%")
                                ->orWhere('other_name', 'like', "%{$search}%")
                                ->orWhere('email', 'like', "%{$search}%")
                                ->orWhere('phone_number', 'like', "%{$search}%");
                        });
                });
            })

            // 🏢 Department filter (staff table)
            ->when($filters['department_id'] ?? null, function ($q, $departmentId) {
                $q->where('department_id', $departmentId);
            })

            // 🎭 Role filter (via user → roles)
            ->when($filters['role'] ?? null, function ($q, $role) {
                $q->whereHas('user.roles', function ($rq) use ($role) {
                    $rq->where('name', $role);
                });
            })

            // 🔵 Active status (from users table)
            ->when(isset($filters['is_active']), function ($q) use ($filters) {
                $q->whereHas('user', function ($uq) use ($filters) {
                    $uq->where('is_active', $filters['is_active']);
                });
            })

            // ⚧ Gender filter (users table)
            ->when($filters['gender'] ?? null, function ($q, $gender) {
                $q->whereHas('user', function ($uq) use ($gender) {
                    $uq->where('gender', $gender);
                });
            })

            ->when($filters['county'] ?? null, function ($q, $county) {
                $q->whereHas('user', function ($uq) use ($county) {
                    $uq->where('county', $county);
                });
            });
    }
}
