<?php

namespace App\Http\Controllers;

use App\Filters\CourseFilter;
use App\Http\Requests\StorecourseRequest;
use App\Http\Requests\UpdatecourseRequest;
use App\Models\CertificationLevel;
use App\Models\Course;
use App\Models\Curriculum;
use App\Models\Department;
use App\Models\ExamBody;
use App\Services\CourseService;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;

class CourseController extends Controller
{
    public function __construct(private CourseService $service)
    {
        // HODs cannot mutate courses — gate all write actions once here
        $this->middleware(function (Request $request, $next) {
            if ($this->scopedDepartmentId($request) !== null) {
                abort(403);
            }

            return $next($request);
        })->only(['create', 'store', 'edit', 'update', 'destroy']);
    }

    // -------------------------------------------------------------------------
    // Read
    // -------------------------------------------------------------------------

    public function index(Request $request, CourseFilter $filter)
    {
        $scopedDepartmentId = $this->scopedDepartmentId($request);

        $filters = $request->only([
            'search',
            'course_id',
            'sort',
            'direction',
            'department_id',
            'exam_body_id',
            'certification_level_id',
            'curriculum_id',
        ]);

        // These filters are meaningless (and exploitable) when locked to one department
        if ($scopedDepartmentId !== null) {
            unset($filters['department_id'], $filters['exam_body_id'], $filters['certification_level_id']);
        }

        $courses = Course::query()
            ->with([
                'certificationLevel:id,name',
                'department:id,name',
                'curriculum',
            ])
            ->when($scopedDepartmentId, function (Builder $q, int $departmentId) {
                $q->where('department_id', $departmentId)
                  ->whereHas('curriculumMappings', fn ($mq) => $this->activeMappingScope($mq));
            })
            ->tap(fn ($q) => $filter->apply($q, $filters))
            ->latest()
            ->paginate(10)
            ->withQueryString()
            ->through(fn (Course $course) => $this->courseRow($course));

        return inertia('Courses/Index', [
            'courses'            => $courses,
            'filters'            => (object) $filters,
            'selectedFilters'    => $this->selectedIndexFilters($filters),
            'department_context' => $scopedDepartmentId
                ? $this->departmentContext($scopedDepartmentId)
                : null,
        ]);
    }

    public function create()
    {
        return inertia('Courses/Create');
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
            'certificationLevel:id,exam_body_id,name',
            'certificationLevel.examBody:id,code,name',
            'curriculumMappings:id,course_id,curriculum_id,is_active',
            'curriculumMappings.curriculum:id,name',
        ]);

        $selectedMapping = $course->curriculumMappings->firstWhere('is_active', true)
            ?? $course->curriculumMappings->first();

        return inertia('Courses/Edit', [
            'selected_filters' => [
                'department'          => $course->department?->name,
                'exam_body'           => $course->certificationLevel?->examBody
                    ? trim("{$course->certificationLevel->examBody->code} - {$course->certificationLevel->examBody->name}", ' -')
                    : null,
                'certification_level' => $course->certificationLevel?->name,
                'curriculum'          => $selectedMapping?->curriculum?->name,
            ],
            'course' => $course,
        ]);
    }

    public function update(UpdatecourseRequest $request, Course $course)
    {
        $this->service->update($course, $request->validated());

        return redirect()
            ->route('courses.edit', $course)
            ->with('success', 'Course updated successfully.');
    }

    public function destroy(Course $course)
    {
        $result = $this->service->delete($course);

        return redirect()
            ->route('courses.index')
            ->with($result['status'] ? 'success' : 'error', $result['message']);
    }

    // -------------------------------------------------------------------------
    // Search
    // -------------------------------------------------------------------------

    public function search(Request $request)
    {
        $scopedDepartmentId = $this->scopedDepartmentId($request);
        $limit       = min(max($request->integer('limit', 10), 1), 25);
        $q           = trim((string) $request->query('q', ''));
        $versionedOnly = $request->boolean('versioned_only');

        // Admins may filter by any department; HODs are locked to their own
        $departmentId = $scopedDepartmentId
            ?? ($request->integer('department_id') ?: null);

        $courses = Course::query()
            ->when($departmentId, fn (Builder $b) => $b->where('department_id', $departmentId))
            ->when($scopedDepartmentId !== null, fn (Builder $b) => $b
                ->whereHas('curriculumMappings', fn ($mq) => $this->activeMappingScope($mq))
            )
            ->when($versionedOnly, fn (Builder $b) => $this->versionedOnlyScope($b))
            ->when($q !== '', fn (Builder $b) => $this->nameOrCodeScope($b, $q))
            ->orderBy('name')
            ->limit($limit)
            ->get(['id', 'name', 'code'])
            ->map(fn (Course $course) => ['id' => (string) $course->id, 'name' => $course->name])
            ->values();

        return response()->json($courses);
    }

    // -------------------------------------------------------------------------
    // Scopes
    // -------------------------------------------------------------------------

    private function activeMappingScope($query)
    {
        return $query
            ->where('is_active', true)
            ->whereHas('curriculum', fn ($cq) => $cq->where('is_active', true));
    }

    private function versionedOnlyScope(Builder $builder): Builder
    {
        return $builder->whereHas('curriculumMappings', function ($mq) {
            $this->activeMappingScope($mq)->whereHas('units');
        });
    }

    private function nameOrCodeScope(Builder $builder, string $query): Builder
    {
        return $builder->where(fn ($q) => $q
            ->where('name', 'like', "%{$query}%")
            ->orWhere('code', 'like', "%{$query}%")
        );
    }

    // -------------------------------------------------------------------------
    // Transforms
    // -------------------------------------------------------------------------

    private function courseRow(Course $course): array
    {
        return [
            'id'                  => $course->id,
            'name'                => $course->display_name,
            'code'                => $course->code,
            'certification_level' => $course->certificationLevel?->name,
            'department'          => $course->department?->name,
            'curriculum'          => $course->curriculum?->name,
            'created_at'          => $course->created_at,
        ];
    }

    private function selectedIndexFilters(array $filters): array
    {
        $department = isset($filters['department_id'])
            ? Department::select('id', 'code', 'name')->find($filters['department_id'])
            : null;

        $course = isset($filters['course_id'])
            ? Course::select('id', 'name', 'certification_level_id')
                ->with('certificationLevel:id,name')
                ->find($filters['course_id'])
            : null;

        $certificationLevel = isset($filters['certification_level_id'])
            ? CertificationLevel::select('id', 'name')->find($filters['certification_level_id'])
            : null;

        $examBody = isset($filters['exam_body_id'])
            ? ExamBody::select('id', 'code', 'name')->find($filters['exam_body_id'])
            : null;

        $curriculum = isset($filters['curriculum_id'])
            ? Curriculum::select('id', 'name')->find($filters['curriculum_id'])
            : null;

        return [
            'course'              => $course?->display_name,
            'department'          => $department
                ? trim("{$department->code} - {$department->name}", ' -')
                : null,
            'exam_body'           => $examBody
                ? trim("{$examBody->code} - {$examBody->name}", ' -')
                : null,
            'certification_level' => $certificationLevel?->name,
            'curriculum'          => $curriculum?->name,
        ];
    }

    // -------------------------------------------------------------------------
    // Role / department resolution
    // -------------------------------------------------------------------------

    /**
     * Returns the department ID that should constrain this request,
     * or null if the user is an unrestricted admin.
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

    private function departmentContext(int $departmentId): ?array
    {
        $department = Department::select('id', 'code', 'name')->find($departmentId);

        return $department ? [
            'id'    => (string) $department->id,
            'code'  => $department->code,
            'name'  => $department->name,
            'label' => trim("{$department->code} - {$department->name}", ' -'),
        ] : null;
    }
}