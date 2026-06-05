<?php

namespace App\Http\Controllers;

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
            'status',
        ]);

        $courseEnrollments = CourseEnrollment::with([
            'student.user',
            'course:id,name,code',
            'curriculum:id,name',
            'curriculumMapping.course',
            'curriculumMapping.curriculum',
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
            ->when($filters['status'] ?? null, fn ($query, $status) => $query->where('status', $status))
            ->latest()
            ->paginate(20)
            ->withQueryString()
            ->through(fn (CourseEnrollment $enrollment) => [
                'id' => $enrollment->id,
                'student_name' => trim(
                    ($enrollment->student?->user?->first_name ?? '').' '.
                    ($enrollment->student?->user?->last_name ?? '')
                ),
                'registration_number' => $enrollment->student?->registration_number,
                'course' => $enrollment->course?->name
                    ?? $enrollment->curriculumMapping?->course?->name,
                'curriculum' => $enrollment->curriculum?->name
                    ?? $enrollment->curriculumMapping?->curriculum?->name,
                'status' => $enrollment->status,
                'created_at' => $enrollment->created_at,
            ]);

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

        return [
            'course' => $course?->display_name ?? $course?->name,
            'curriculum' => $curriculum?->name,
        ];
    }
}
