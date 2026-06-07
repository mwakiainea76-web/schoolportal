<?php

namespace App\Filters;

use Illuminate\Database\Eloquent\Builder;

class StudentInvoicesFilter
{
    public function apply(Builder $query, array $filters): Builder
    {
        return $query
            ->when($filters['search'] ?? null, fn ($q, $search) => $this->search($q, $search))
            ->when($filters['status'] ?? null, fn ($q, $status) => $this->status($q, $status))
            ->when($filters['enrollment'] ?? null, fn ($q, $enrollmentId) => $this->enrollment($q, $enrollmentId))
            ->when($filters['fee_model'] ?? null, fn ($q, $feeModelId) => $this->feeModel($q, $feeModelId))
            ->when(
                ($filters['date_from'] ?? null) || ($filters['date_to'] ?? null),
                fn ($q) => $this->dateRange($q, $filters)
            )
            ->when($filters['sort'] ?? null, fn ($q) => $this->sort($q, $filters));
    }

    protected function search(Builder $query, string $search): void
    {
        $query->where(function ($q) use ($search) {
            $q->where('id', 'like', "%{$search}%")
                ->orWhereHas('enrollment.student', function ($q2) use ($search) {
                    $q2->where('first_name', 'like', "%{$search}%")
                        ->orWhere('last_name', 'like', "%{$search}%")
                        ->orWhere('admission_number', 'like', "%{$search}%")
                        ->orWhereHas('user', function ($q3) use ($search) {
                            $q3->where('email', 'like', "%{$search}%");
                        });
                })
                ->orWhereHas('enrollment.academicSession', function ($q2) use ($search) {
                    $q2->where('session_No', 'like', "%{$search}%");
                });
        });
    }

    protected function status(Builder $query, string $status): void
    {
        $query->byStatus($status);
    }

    protected function enrollment(Builder $query, int $enrollmentId): void
    {
        $query->where('enrollment_id', $enrollmentId);
    }

    protected function feeModel(Builder $query, int $feeModelId): void
    {
        $query->where('fee_model_id', $feeModelId);
    }

    protected function dateRange(Builder $query, array $filters): void
    {
        $from = $filters['date_from'] ?? null;
        $to = $filters['date_to'] ?? null;

        if ($from && $to) {
            $query->whereBetween('due_date', [$from, $to]);
        } elseif ($from) {
            $query->whereDate('due_date', '>=', $from);
        } elseif ($to) {
            $query->whereDate('due_date', '<=', $to);
        }
    }

    protected function sort(Builder $query, array $filters): void
    {
        $field = $filters['sort'] ?? 'created_at';
        $direction = $filters['direction'] ?? 'desc';

        if ($field === 'student_name') {
            $query->join('academic_session_enrollments', 'student_invoices.enrollment_id', '=', 'academic_session_enrollments.id')
                ->join('course_enrollments', 'academic_session_enrollments.course_enrollment_id', '=', 'course_enrollments.id')
                ->join('students', 'course_enrollments.student_id', '=', 'students.id')
                ->orderBy('students.first_name', $direction)
                ->orderBy('students.last_name', $direction)
                ->select('student_invoices.*');
        } else {
            $query->orderBy($field, $direction);
        }
    }
}
