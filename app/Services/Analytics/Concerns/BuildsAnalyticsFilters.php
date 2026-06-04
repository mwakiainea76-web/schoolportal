<?php

namespace App\Services\Analytics\Concerns;

trait BuildsAnalyticsFilters
{
    protected function normalizeFilters(array $filters): array
    {
        return [
            'date_from' => $filters['date_from'] ?? null,
            'date_to' => $filters['date_to'] ?? null,
            'academic_year_id' => $filters['academic_year_id'] ?? null,
            'academic_session_id' => $filters['academic_session_id'] ?? null,
            'department_id' => $filters['department_id'] ?? null,
            'course_id' => $filters['course_id'] ?? null,
            'course_version_id' => $filters['course_version_id'] ?? null,
            'student_status' => $filters['student_status'] ?? null,
            'module' => $filters['module'] ?? null,
            'year_of_study' => $filters['year_of_study'] ?? null,
            'hostel_id' => $filters['hostel_id'] ?? null,
        ];
    }
}
