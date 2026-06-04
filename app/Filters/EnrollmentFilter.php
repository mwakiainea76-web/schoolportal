<?php

namespace App\Filters;

use Illuminate\Database\Eloquent\Builder;

class EnrollmentFilter
{
    public function apply(Builder $query, array $filters)
    {
        return $query
            ->when($filters['search'] ?? null, fn ($q, $v) => $this->search($q, $v))
            ->when($filters['status'] ?? null, fn ($q, $v) => $this->status($q, $v))
            ->when($filters['academic_session_id'] ?? null, fn ($q, $v) => $this->academicSession($q, $v))
            ->when($filters['course_id'] ?? null, fn ($q, $v) => $this->course($q, $v));
    }

    protected function search($query, $term)
    {
        $query->where(function ($q) use ($term) {
            $q->whereHas('student', function ($q2) use ($term) {
                $q2->where('registration_number', 'like', "%$term%")
                    ->orWhereHas('user', function ($q3) use ($term) {
                        $q3->where('first_name', 'like', "%$term%")
                            ->orWhere('last_name', 'like', "%$term%")
                            ->orWhere('email', 'like', "%$term%");
                    });
            });
        });
    }

    protected function status($query, $value)
    {
        $query->where('status', $value);
    }

    protected function academicSession($query, $value)
    {
        $query->where('academic_session_id', $value);
    }

    protected function course($query, $value)
    {
        $query->whereHas('courseEnrollment.courseVersionMapping', function ($courseVersionMappingQuery) use ($value) {
            $courseVersionMappingQuery->where('course_id', $value);
        });
    }
}

