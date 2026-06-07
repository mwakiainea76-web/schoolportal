<?php

namespace App\Http\Controllers;

use App\Models\AcademicSession;
use App\Models\AcademicYear;
use App\Models\CourseEnrollment;
use App\Models\Course;
use App\Models\Curriculum;
use Illuminate\Http\Request;

class CourseEnrollmentController extends Controller
{
    public function index(Request $request)
    {
        $filters = $request->only([
            'course_id',
            'curriculum_id',
            'academic_year_id',
            'academic_session_id',
            'status',
        ]);

        $courseEnrollments = CourseEnrollment::with([
            'student',
            'course:id,name,code',
            'curriculum:id,name',
            'curriculumMapping.course',
            'curriculumMapping.curriculum',
            'academicSessionEnrollments.academicSession.academicYear',
        ])
            ->when($filters['course_id'] ?? null, function ($query, $courseId) {
                $query->where(function ($courseQuery) use ($courseId) {
                    $courseQuery
                        ->where('course_id', $courseId)
                        ->orWhereHas('curriculumMapping', fn ($mappingQuery) => $mappingQuery->where('course_id', $courseId));
                });
            })
            ->when($filters['curriculum_id'] ?? null, function ($query, $curriculumId) {
                $query->where(function ($curriculumQuery) use ($curriculumId) {
                    $curriculumQuery
                        ->where('curriculum_id', $curriculumId)
                        ->orWhereHas('curriculumMapping', fn ($mappingQuery) => $mappingQuery->where('curriculum_id', $curriculumId));
                });
            })
            ->when($filters['academic_year_id'] ?? null, function ($query, $academicYearId) {
                $query->whereHas('academicSessionEnrollments.academicSession', fn ($sessionQuery) => $sessionQuery->where('academic_year_id', $academicYearId));
            })
            ->when($filters['academic_session_id'] ?? null, function ($query, $academicSessionId) {
                $query->whereHas('academicSessionEnrollments', fn ($sessionEnrollmentQuery) => $sessionEnrollmentQuery->where('academic_session_id', $academicSessionId));
            })
            ->when($filters['status'] ?? null, fn ($query, $status) => $query->where('status', $status))
            ->latest()
            ->paginate(20)
            ->withQueryString()
            ->through(function (CourseEnrollment $enrollment) {
                $sessionEnrollment = $enrollment->academicSessionEnrollments
                    ->sortByDesc('academic_session_id')
                    ->first();
                $academicSession = $sessionEnrollment?->academicSession;

                return [
                    'id' => $enrollment->id,
                    'student_name' => $enrollment->student?->full_name,
                    'admission_number' => $enrollment->student?->admission_number,
                    'course' => $enrollment->course?->name
                        ?? $enrollment->curriculumMapping?->course?->name,
                    'curriculum' => $enrollment->curriculum?->name
                        ?? $enrollment->curriculumMapping?->curriculum?->name,
                    'academic_year' => $academicSession?->academicYear?->name,
                    'academic_session' => $academicSession?->display_name,
                    'status' => $enrollment->status,
                    'created_at' => $enrollment->created_at,
                ];
            });

        return inertia('CourseEnrollments/Index', [
            'courseEnrollments' => $courseEnrollments,
            'filters' => (object) $filters,
            'selectedFilters' => $this->selectedFilters($filters),
            'statuses' => [
                'active',
                'deferred',
                'transferred',
                'suspended',
                'completed',
                'dropped',
                'deactivated',
            ],
        ]);
    }

    protected function selectedFilters(array $filters): array
    {
        $course = ! empty($filters['course_id'])
            ? Course::select('id', 'name', 'code', 'certification_level_id')
                ->with('certificationLevel:id,name')
                ->find($filters['course_id'])
            : null;

        $curriculum = ! empty($filters['curriculum_id'])
            ? Curriculum::select('id', 'name')->find($filters['curriculum_id'])
            : null;

        $academicYear = ! empty($filters['academic_year_id'])
            ? AcademicYear::select('id', 'academic_year', 'label')->find($filters['academic_year_id'])
            : null;

        $academicSession = ! empty($filters['academic_session_id'])
            ? AcademicSession::with('academicYear:id,academic_year,label')
                ->select('id', 'academic_year_id', 'session_number', 'session_No', 'label')
                ->find($filters['academic_session_id'])
            : null;

        return [
            'course' => $course?->display_name ?? $course?->name,
            'curriculum' => $curriculum?->name,
            'academic_year' => $academicYear?->name,
            'academic_session' => $academicSession?->display_name,
        ];
    }
}
