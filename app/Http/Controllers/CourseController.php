<?php

namespace App\Http\Controllers;

use App\Filters\courseFilter;
use App\Http\Requests\StorecourseRequest;
use App\Http\Requests\UpdatecourseRequest;
use App\Models\CertificationLevel;
use App\Models\Course;
use App\Models\CourseVersion;
use App\Models\Department;
use App\Models\ExamBody;
use App\Services\courseService;
use Illuminate\Http\Request;

class CourseController extends Controller
{
    protected $service;

    public function __construct(courseService $service)
    {
        $this->service = $service;
    }

    public function index(courseFilter $filter)
    {
        $filters = request()->only([
            'search',
            'course_id',
            'sort',
            'direction',
            'department_id',
            'exam_body_id',
            'certification_level_id',
            'course_version_id',
        ]);

        if (empty($filters['exam_body_id'])) {
            unset($filters['certification_level_id']);
        }

        $courses = Course::query()
            ->with([
                'certificationLevel:id,name',
                'department:id,name',
                'curriculum',
            ])
            ->tap(fn ($query) => $filter->apply(
                $query,
                $filters
            ))
            ->latest('created_at')
            ->paginate(10)
            ->withQueryString()
            ->through(fn ($course) => [
                'id' => $course->id,
                'name' => $course->display_name,
                'code' => $course->code,
                'certification_level' => $course->certificationLevel?->name,
                'department' => $course->department?->name,
                'curriculum' => $course->curriculum?->name,
                'created_at' => $course->created_at,
            ]);

        return inertia('courses/Index', [
            'courses' => $courses,
            'filters' => (object) $filters,
            'selectedFilters' => $this->selectedIndexFilters($filters),
        ]);
    }

    public function create()
    {
        return inertia('courses/Create');
    }

    public function store(StorecourseRequest $request)
    {
        $this->service->create($request->validated());

        return redirect()
            ->route('courses.create')
            ->with('success', 'Course created successfully.');
    }

    public function edit(Course $course)
    {
        $course->load([
            'department:id,name',
            'certificationLevel:id,name',
            'courseVersionMappings:id,course_id,course_version_id,is_active',
            'courseVersionMappings.courseVersion:id,name',
        ]);

        $selectedMapping = $course->courseVersionMappings
            ->firstWhere('is_active', true)
            ?? $course->courseVersionMappings->first();

        return inertia('courses/Edit', [
            'selected_filters' => [
                'department' => $course->department?->name,
                'certification_level' => $course->certificationLevel?->name,
                'course_version' => $selectedMapping?->courseVersion?->name,
            ],
            'course' => $course,
        ]);
    }

    public function update(UpdatecourseRequest $request, Course $course)
    {
        $this->service->update($course, $request->validated());

        return redirect()
            ->route('courses.edit', $course->id)
            ->with('success', 'Course updated successfully.');
    }

    public function destroy(Course $course)
    {
        $result = $this->service->delete($course);

        if (! $result['status']) {
            return redirect()
                ->route('courses.index')
                ->with('error', $result['message']);
        }

        return redirect()
            ->route('courses.index')
            ->with('success', $result['message']);
    }

    public function search(Request $request)
    {
        $limit = min(max((int) $request->integer('limit', 10), 1), 25);
        $departmentId = $request->integer('department_id') ?: null;
        $query = trim((string) $request->query('q', ''));
        $versionedOnly = $request->boolean('versioned_only');
        $plainName = $request->boolean('plain_name');

        $courses = Course::query()
            ->with('certificationLevel:id,name')
            ->when($departmentId, fn ($builder) => $builder->where('department_id', $departmentId))
            ->when($versionedOnly, function ($builder) {
                $builder->whereHas('courseVersionMappings', function ($mappingQuery) {
                    $mappingQuery
                        ->where('is_active', true)
                        ->whereHas('courseVersion', fn ($courseVersionQuery) => $courseVersionQuery->where('is_active', true))
                        ->whereHas('courseVersionUnits');
                });
            })
            ->when($query !== '', function ($builder) use ($query) {
                $builder->where(function ($searchQuery) use ($query) {
                    $searchQuery
                        ->where('name', 'like', "%{$query}%")
                        ->orWhere('code', 'like', "%{$query}%");
                });
            })
            ->orderBy('name')
            ->limit($limit)
            ->get(['id', 'name', 'code', 'certification_level_id'])
            ->map(fn (Course $course) => [
                'id' => (string) $course->id,
                'name' => $plainName ? $course->name : $course->display_name,
            ])
            ->values();

        return response()->json($courses);
    }

    protected function selectedIndexFilters(array $filters): array
    {
        $department = ! empty($filters['department_id'])
            ? Department::select('id', 'code', 'name')->find($filters['department_id'])
            : null;
        $course = ! empty($filters['course_id'])
            ? Course::with('certificationLevel:id,name')->select('id', 'name', 'certification_level_id')->find($filters['course_id'])
            : null;
        $certificationLevel = ! empty($filters['certification_level_id'])
            ? CertificationLevel::select('id', 'name')->find($filters['certification_level_id'])
            : null;
        $examBody = ! empty($filters['exam_body_id'])
            ? ExamBody::select('id', 'code', 'name')->find($filters['exam_body_id'])
            : null;
        $courseVersion = ! empty($filters['course_version_id'])
            ? CourseVersion::select('id', 'name')->find($filters['course_version_id'])
            : null;

        return [
            'course' => $course?->display_name,
            'department' => $department
                ? trim($department->code.' - '.$department->name, ' -')
                : null,
            'exam_body' => $examBody
                ? trim($examBody->code.' - '.$examBody->name, ' -')
                : null,
            'certification_level' => $certificationLevel?->name,
            'course_version' => $courseVersion?->name,
        ];
    }

}
