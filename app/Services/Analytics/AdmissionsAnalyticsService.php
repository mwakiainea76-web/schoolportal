<?php

namespace App\Services\Analytics;

use App\Models\AcademicSession;
use App\Models\Student;
use App\Services\Analytics\Concerns\BuildsAnalyticsFilters;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class AdmissionsAnalyticsService
{
    use BuildsAnalyticsFilters;

    public function summary(array $filters = []): array
    {
        $filters = $this->normalizeFilters($filters);
        $startDate = ! empty($filters['date_from'])
            ? Carbon::parse($filters['date_from'])->startOfDay()
            : Carbon::now()->subMonths(5)->startOfMonth();
        $endDate = ! empty($filters['date_to'])
            ? Carbon::parse($filters['date_to'])->endOfDay()
            : Carbon::now()->endOfMonth();
        $activeSession = AcademicSession::query()
            ->with('academicYear')
            ->where('is_active', true)
            ->latest('start_date')
            ->latest('id')
            ->first();

        $admissionsBase = Student::query()
            ->whereNull('students.deleted_at');

        $totalAdmissions = (clone $admissionsBase)->count();
        $newAdmissionsInRange = (clone $admissionsBase)
            ->whereBetween('students.created_at', [$startDate->toDateString(), $endDate->toDateString()])
            ->count();
        $activeAccounts = (clone $admissionsBase)
            ->whereHas('user', fn($q) => $q->where('is_active', true))
            ->count();
        $inactiveAccounts = (clone $admissionsBase)
            ->whereHas('user', fn($q) => $q->where('is_active', false))
            ->count();
        $pwdStudents = (clone $admissionsBase)
            ->where('is_pwd', true)
            ->count();

        $admissionsByDepartment = Student::query()
            ->leftJoin('course_enrollments', function ($join) {
                $join->on('course_enrollments.student_id', '=', 'students.id')
                    ->whereNull('course_enrollments.deleted_at');
            })
            ->leftJoin('curriculum_mappings', 'curriculum_mappings.id', '=', 'course_enrollments.curriculum_mapping_id')
            ->leftJoin('courses', 'courses.id', '=', 'curriculum_mappings.course_id')
            ->leftJoin('departments', 'departments.id', '=', 'courses.department_id')
            ->whereNull('students.deleted_at')
            ->selectRaw("COALESCE(departments.name, 'Unassigned') as department_name")
            ->selectRaw('COUNT(DISTINCT students.id) as total')
            ->groupBy('department_name')
            ->orderByDesc('total')
            ->get()
            ->map(fn ($row) => [
                'department_name' => $row->department_name,
                'total' => (int) $row->total,
            ])
            ->all();

        $admissionsByCourse = Student::query()
            ->leftJoin('course_enrollments', function ($join) {
                $join->on('course_enrollments.student_id', '=', 'students.id')
                    ->whereNull('course_enrollments.deleted_at');
            })
            ->leftJoin('curriculum_mappings', 'curriculum_mappings.id', '=', 'course_enrollments.curriculum_mapping_id')
            ->leftJoin('courses', 'courses.id', '=', 'curriculum_mappings.course_id')
            ->whereNull('students.deleted_at')
            ->selectRaw("COALESCE(courses.name, 'Unassigned') as course_name")
            ->selectRaw('COUNT(DISTINCT students.id) as total')
            ->groupBy('course_name')
            ->orderByDesc('total')
            ->limit(10)
            ->get()
            ->map(fn ($row) => [
                'course_name' => $row->course_name,
                'total' => (int) $row->total,
            ])
            ->all();

        $admissionsByCounty = (clone $admissionsBase)
            ->select('county')
            ->selectRaw('COUNT(*) as total')
            ->groupBy('county')
            ->orderByDesc('total')
            ->limit(10)
            ->get()
            ->map(fn ($row) => [
                'county' => $row->county,
                'total' => (int) $row->total,
            ])
            ->all();

        $admissionsByGender = (clone $admissionsBase)
            ->select('gender')
            ->selectRaw('COUNT(*) as total')
            ->groupBy('gender')
            ->orderBy('gender')
            ->get()
            ->map(fn ($row) => [
                'gender' => $row->gender,
                'total' => (int) $row->total,
            ])
            ->all();

        $intakeTrend = collect(range(0, 5))
            ->map(function ($offset) use ($startDate) {
                return $startDate->copy()->startOfMonth()->addMonths($offset);
            })
            ->filter(fn ($date) => $date->lte($endDate))
            ->values()
            ->map(function (Carbon $month) {
                $monthStart = $month->copy()->startOfMonth()->toDateString();
                $monthEnd = $month->copy()->endOfMonth()->toDateString();

                $total = Student::query()
                    ->whereBetween('created_at', [$monthStart, $monthEnd])
                    ->count();

                return [
                    'month' => $month->format('M Y'),
                    'total' => (int) $total,
                ];
            })
            ->all();

        $studentsMissingCourseEnrollment = Student::query()
            ->whereNull('students.deleted_at')
            ->whereNotExists(function ($query) {
                $query->selectRaw('1')
                    ->from('course_enrollments')
                    ->whereColumn('course_enrollments.student_id', 'students.id')
                    ->whereNull('course_enrollments.deleted_at');
            })
            ->select('students.id', 'students.admission_number', 'students.created_at', 'students.first_name', 'students.last_name')
            ->orderByDesc('students.created_at')
            ->limit(10)
            ->get()
            ->map(fn ($row) => [
                'student_id' => (int) $row->id,
                'admission_number' => $row->admission_number,
                'student_name' => $row->full_name,
                'admission_date' => $row->created_at->toDateString(),
            ])
            ->all();

        $studentsMissingNextOfKin = Student::query()
            ->join('users', 'users.id', '=', 'students.user_id')
            ->leftJoin('next_of_kin', function ($join) {
                $join->on('next_of_kin.user_id', '=', 'users.id')
                    ->whereNull('next_of_kin.deleted_at');
            })
            ->whereNull('students.deleted_at')
            ->whereNull('users.deleted_at')
            ->whereNull('next_of_kin.id')
            ->select('students.id', 'students.admission_number', 'students.first_name', 'students.last_name')
            ->orderBy('students.last_name')
            ->limit(10)
            ->get()
            ->map(fn ($row) => [
                'student_id' => (int) $row->id,
                'admission_number' => $row->admission_number,
                'student_name' => $row->full_name,
            ])
            ->all();

        $inactiveStudentAccounts = (clone $admissionsBase)
            ->whereHas('user', fn($q) => $q->where('is_active', false))
            ->with('user:id,email')
            ->select('students.id', 'students.admission_number', 'students.first_name', 'students.last_name', 'students.user_id')
            ->orderBy('students.last_name')
            ->limit(10)
            ->get()
            ->map(fn ($row) => [
                'student_id' => (int) $row->id,
                'admission_number' => $row->admission_number,
                'student_name' => $row->full_name,
                'email' => $row->user?->email,
            ])
            ->all();

        $studentsNotSessionEnrolled = $activeSession
            ? Student::query()
                ->whereNull('students.deleted_at')
                ->whereNotExists(function ($query) use ($activeSession) {
                    $query->selectRaw('1')
                        ->from('course_enrollments')
                        ->join('academic_session_enrollments', 'academic_session_enrollments.course_enrollment_id', '=', 'course_enrollments.id')
                        ->whereColumn('course_enrollments.student_id', 'students.id')
                        ->whereNull('course_enrollments.deleted_at')
                        ->whereNull('academic_session_enrollments.deleted_at')
                        ->where('academic_session_enrollments.academic_session_id', $activeSession->id);
                })
                ->select('students.id', 'students.admission_number', 'students.first_name', 'students.last_name')
                ->orderBy('students.last_name')
                ->limit(10)
                ->get()
                ->map(fn ($row) => [
                    'student_id' => (int) $row->id,
                    'admission_number' => $row->admission_number,
                    'student_name' => $row->full_name,
                ])
                ->all()
            : [];

        $duplicateContactRisk = DB::table(DB::raw("
            (
                SELECT email as contact_value, 'email' as contact_type, COUNT(*) as duplicate_count
                FROM users
                WHERE deleted_at IS NULL AND email IS NOT NULL AND email <> ''
                GROUP BY email
                HAVING COUNT(*) > 1
                UNION ALL
                SELECT phone_number as contact_value, 'phone' as contact_type, COUNT(*) as duplicate_count
                FROM (
                    SELECT phone_number FROM staffs WHERE deleted_at IS NULL AND phone_number IS NOT NULL AND phone_number <> ''
                    UNION ALL
                    SELECT phone_number FROM students WHERE deleted_at IS NULL AND phone_number IS NOT NULL AND phone_number <> ''
                ) all_phones
                GROUP BY phone_number
                HAVING COUNT(*) > 1
            ) duplicate_contacts
        "))
            ->orderByDesc('duplicate_count')
            ->limit(10)
            ->get()
            ->map(fn ($row) => [
                'contact_type' => $row->contact_type,
                'contact_value' => $row->contact_value,
                'duplicate_count' => (int) $row->duplicate_count,
            ])
            ->all();

        return [
            'filters' => $filters,
            'active_session' => $activeSession
                ? [
                    'id' => $activeSession->id,
                    'label' => $activeSession->display_name,
                ]
                : null,
            'metrics' => [
                'total_admissions' => (int) $totalAdmissions,
                'new_admissions_in_range' => (int) $newAdmissionsInRange,
                'active_accounts' => (int) $activeAccounts,
                'inactive_accounts' => (int) $inactiveAccounts,
                'pwd_students' => (int) $pwdStudents,
                'students_missing_course_enrollment_count' => count($studentsMissingCourseEnrollment),
                'students_missing_next_of_kin_count' => count($studentsMissingNextOfKin),
                'students_not_session_enrolled_count' => count($studentsNotSessionEnrolled),
                'duplicate_contact_risk_count' => count($duplicateContactRisk),
            ],
            'breakdowns' => [
                'intake_trend' => $intakeTrend,
                'admissions_by_department' => $admissionsByDepartment,
                'admissions_by_course' => $admissionsByCourse,
                'admissions_by_county' => $admissionsByCounty,
                'admissions_by_gender' => $admissionsByGender,
            ],
            'exceptions' => [
                'students_missing_course_enrollment' => $studentsMissingCourseEnrollment,
                'students_missing_next_of_kin' => $studentsMissingNextOfKin,
                'inactive_student_accounts' => $inactiveStudentAccounts,
                'students_not_session_enrolled' => $studentsNotSessionEnrolled,
                'duplicate_contact_risk' => $duplicateContactRisk,
            ],
        ];
    }
}
