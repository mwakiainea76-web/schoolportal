<?php

namespace App\Http\Controllers;

use App\Models\AcademicSession;
use App\Models\AcademicYear;
use App\Models\Course;
use App\Models\CourseEnrollment;
use App\Models\Curriculum;
use App\Models\Department;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;

class CourseEnrollmentController extends Controller
{
    private const STATUSES = [
        'active',
        'deferred',
        'transferred',
        'suspended',
        'completed',
        'dropped',
        'deactivated',
    ];

    public function index(Request $request)
    {
        $scopedDepartmentId = $this->scopedDepartmentId($request);

        $filters = $request->only([
            'course_id',
            'curriculum_id',
            'academic_year_id',
            'academic_session_id',
            'department_id',
            'year_of_study',
            'admission_number',
            'status',
        ]);

        // Prevent HODs from filtering outside their department
        if ($scopedDepartmentId !== null) {
            unset($filters['department_id']);
        }

        $courseEnrollments = CourseEnrollment::with([
            'student',
            'course:id,name,code,department_id',
            'course.department:id,name',
            'curriculum:id,name',
            'curriculumMapping.course.department:id,name',
            'curriculumMapping.curriculum',
            'academicSessionEnrollments.academicSession.academicYear',
        ])
            ->when($scopedDepartmentId, fn (Builder $q, int $id) => $this->applyDepartmentScope($q, $id))
            ->when($filters['course_id'] ?? null, function (Builder $q, $id) {
                $q->where(fn (Builder $cq) => $cq
                    ->where('course_id', $id)
                    ->orWhereHas('curriculumMapping', fn (Builder $mq) => $mq->where('course_id', $id))
                );
            })
            ->when($filters['curriculum_id'] ?? null, function (Builder $q, $id) {
                $q->where(fn (Builder $cq) => $cq
                    ->where('curriculum_id', $id)
                    ->orWhereHas('curriculumMapping', fn (Builder $mq) => $mq->where('curriculum_id', $id))
                );
            })
            ->when($filters['academic_year_id'] ?? null, fn (Builder $q, $id) => $q
                ->whereHas('academicSessionEnrollments.academicSession', fn (Builder $sq) => $sq->where('academic_year_id', $id))
            )
            ->when($filters['academic_session_id'] ?? null, fn (Builder $q, $id) => $q
                ->whereHas('academicSessionEnrollments', fn (Builder $sq) => $sq->where('academic_session_id', $id))
            )
            ->when($filters['department_id'] ?? null, fn (Builder $q, $id) => $this->applyDepartmentScope($q, (int) $id))
            ->when($filters['year_of_study'] ?? null, fn (Builder $q, $year) => $q
                ->whereHas('academicSessionEnrollments', fn (Builder $sq) => $sq->where('year_of_study', $year))
            )
            ->when($filters['admission_number'] ?? null, fn (Builder $q, $num) => $q
                ->whereHas('student', fn (Builder $sq) => $sq->where('admission_number', 'like', "%{$num}%"))
            )
            ->when($filters['status'] ?? null, fn (Builder $q, $status) => $q->where('status', $status))
            ->latest()
            ->paginate(20)
            ->withQueryString()
            ->through(fn (CourseEnrollment $enrollment) => $this->transformEnrollment($enrollment));

        return inertia('CourseEnrollments/Index', [
            'courseEnrollments' => $courseEnrollments,
            'filters' => (object) $filters,
            'selectedFilters' => $this->selectedFilters($filters, $scopedDepartmentId),
            'statuses' => self::STATUSES,
            'department_context' => $scopedDepartmentId
                ? $this->departmentContext($scopedDepartmentId)
                : null,
        ]);
    }

    // -------------------------------------------------------------------------
    // Helpers
    // -------------------------------------------------------------------------

    /**
     * Returns the department ID that should constrain all results.
     * HODs are locked to their own department; admins get null (no constraint).
     */
    private function scopedDepartmentId(Request $request): ?int
    {
        $user = $request->user();

        if ($user?->hasRole('hod') && ! $user->hasRole('admin')) {
            $id = $user->staff?->department_id;

            return $id ? (int) $id : null;
        }

        return null;
    }

    private function applyDepartmentScope(Builder $query, int $departmentId): Builder
    {
        return $query->where(function (Builder $q) use ($departmentId) {
            $q->whereHas('course', fn (Builder $cq) => $cq->where('department_id', $departmentId))
                ->orWhereHas('curriculumMapping.course', fn (Builder $cq) => $cq->where('department_id', $departmentId));
        });
    }

    private function transformEnrollment(CourseEnrollment $enrollment): array
    {
        $sessionEnrollment = $enrollment->academicSessionEnrollments
            ->sortByDesc('academic_session_id')
            ->first();

        $academicSession = $sessionEnrollment?->academicSession;

        return [
            'id' => $enrollment->id,
            'student_name' => $enrollment->student?->full_name,
            'admission_number' => $enrollment->student?->admission_number,
            'department' => $enrollment->course?->department?->name
                                    ?? $enrollment->curriculumMapping?->course?->department?->name,
            'course' => $enrollment->course?->name
                                    ?? $enrollment->curriculumMapping?->course?->name,
            'curriculum' => $enrollment->curriculum?->name
                                    ?? $enrollment->curriculumMapping?->curriculum?->name,
            'academic_year' => $academicSession?->academicYear?->name,
            'academic_session' => $academicSession?->display_name,
            'year_of_study' => $sessionEnrollment?->year_of_study,
            'status' => $enrollment->status,
            'created_at' => $enrollment->created_at,
        ];
    }

    private function selectedFilters(array $filters, ?int $scopedDepartmentId): array
    {
        $course = isset($filters['course_id'])
            ? Course::select('id', 'name', 'code', 'certification_level_id')
                ->with('certificationLevel:id,name')
                ->when($scopedDepartmentId, fn (Builder $q) => $q->where('department_id', $scopedDepartmentId))
                ->find($filters['course_id'])
            : null;

        $curriculum = isset($filters['curriculum_id'])
            ? Curriculum::select('id', 'name')->find($filters['curriculum_id'])
            : null;

        $academicYear = isset($filters['academic_year_id'])
            ? AcademicYear::select('id', 'academic_year', 'label')->find($filters['academic_year_id'])
            : null;

        $academicSession = isset($filters['academic_session_id'])
            ? AcademicSession::select('id', 'academic_year_id', 'session_number', 'session_No', 'label')
                ->with('academicYear:id,academic_year,label')
                ->find($filters['academic_session_id'])
            : null;

        $department = isset($filters['department_id'])
            ? Department::select('id', 'name', 'code')->find($filters['department_id'])
            : null;

        return [
            'course' => $course?->display_name ?? $course?->name,
            'curriculum' => $curriculum?->name,
            'academic_year' => $academicYear?->name,
            'academic_session' => $academicSession?->display_name,
            'department' => $department
                ? trim("{$department->code} - {$department->name}", ' -')
                : null,
            'year_of_study' => $filters['year_of_study'] ?? null,
            'admission_number' => $filters['admission_number'] ?? null,
        ];
    }

    private function departmentContext(int $departmentId): ?array
    {
        $department = Department::select('id', 'code', 'name')->find($departmentId);

        return $department ? [
            'id' => (string) $department->id,
            'code' => $department->code,
            'name' => $department->name,
            'label' => trim("{$department->code} - {$department->name}", ' -'),
        ] : null;
    }
}
