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
            if ($this->hodDepartmentId($request) !== null) {
                abort(403);
            }

            return $next($request);
        })->only(['create', 'store', 'edit', 'update', 'destroy']);
    }

    // -------------------------------------------------------------------------
    // Read
    // -------------------------------------------------------------------------

    public function index(Request $request)
    {
        if ($this->hodDepartmentId($request) !== null) {
            return redirect()->route('courses.hod.index');
        }

        return inertia('Courses/Index', [
            'summary' => $this->summary(),
            'departmentBreakdown' => $this->departmentBreakdown(),
            'recentCourses' => $this->recentCourses(),
        ]);
    }

    public function editIndex(Request $request, CourseFilter $filter)
    {
        if ($this->hodDepartmentId($request) !== null) {
            return redirect()->route('courses.hod.index');
        }

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

        $courses = Course::query()
            ->with([
                'certificationLevel:id,name',
                'department:id,name',
                'curriculum',
            ])
            ->tap(fn ($q) => $filter->apply($q, $filters))
            ->latest()
            ->paginate(10)
            ->withQueryString()
            ->through(fn (Course $course) => $this->courseRow($course));

        return inertia('Courses/EditIndex', [
            'courses'         => $courses,
            'filters'         => (object) $filters,
            'selectedFilters' => $this->selectedIndexFilters($filters),
        ]);
    }

    public function hodIndex(Request $request, CourseFilter $filter)
    {
        $departmentId = $this->hodDepartmentId($request);
        abort_unless($departmentId !== null, 403);

        $filters = $request->only([
            'search',
            'course_id',
            'sort',
            'direction',
            'curriculum_id',
        ]);

        $courses = Course::query()
            ->with([
                'certificationLevel:id,name',
                'department:id,name',
                'curriculum',
            ])
            ->where('department_id', $departmentId)
            ->whereHas('curriculumMappings', fn ($mq) => $this->activeMappingScope($mq))
            ->tap(fn ($q) => $filter->apply($q, $filters))
            ->latest()
            ->paginate(10)
            ->withQueryString()
            ->through(fn (Course $course) => $this->courseRow($course));

        return inertia('Courses/HodIndex', [
            'courses'            => $courses,
            'filters'            => (object) $filters,
            'selectedFilters'    => $this->selectedIndexFilters($filters),
            'department_context' => $this->departmentContext($departmentId),
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

        return back()->with($result['status'] ? 'success' : 'error', $result['message']);
    }

    // -------------------------------------------------------------------------
    // Search
    // -------------------------------------------------------------------------

    public function search(Request $request)
    {
        $limit = min(max($request->integer('limit', 10), 1), 25);
        $q = trim((string) $request->query('q', ''));
        $versionedOnly = $request->boolean('versioned_only');
        $departmentId = $request->integer('department_id') ?: null;

        $courses = Course::query()
            ->when($departmentId, fn (Builder $b) => $b->where('department_id', $departmentId))
            ->when($versionedOnly, fn (Builder $b) => $this->versionedOnlyScope($b))
            ->when($q !== '', fn (Builder $b) => $this->nameOrCodeScope($b, $q))
            ->orderBy('name')
            ->limit($limit)
            ->get(['id', 'name', 'code'])
            ->map(fn (Course $course) => ['id' => (string) $course->id, 'name' => $course->name])
            ->values();

        return response()->json($courses);
    }

    public function hodSearch(Request $request)
    {
        $departmentId = $this->hodDepartmentId($request);
        abort_unless($departmentId !== null, 403);

        $limit = min(max($request->integer('limit', 10), 1), 25);
        $q = trim((string) $request->query('q', ''));
        $versionedOnly = $request->boolean('versioned_only');

        $courses = Course::query()
            ->where('department_id', $departmentId)
            ->whereHas('curriculumMappings', fn ($mq) => $this->activeMappingScope($mq))
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

    private function summary(): array
    {
        return [
            'total' => Course::query()->count(),
            'mapped' => Course::query()->whereHas('curriculumMappings')->count(),
            'unmapped' => Course::query()->whereDoesntHave('curriculumMappings')->count(),
            'departments' => Course::query()->whereNotNull('department_id')->distinct('department_id')->count('department_id'),
            'certification_levels' => Course::query()->whereNotNull('certification_level_id')->distinct('certification_level_id')->count('certification_level_id'),
            'active_curriculum_mappings' => Course::query()
                ->whereHas('curriculumMappings', fn ($query) => $this->activeMappingScope($query))
                ->count(),
        ];
    }

    private function recentCourses()
    {
        return Course::query()
            ->select(['id', 'name', 'code', 'department_id', 'certification_level_id', 'updated_at'])
            ->with([
                'department:id,name',
                'certificationLevel:id,name',
            ])
            ->withExists([
                'curriculumMappings as has_active_mapping' => fn ($query) => $this->activeMappingScope($query),
            ])
            ->latest('updated_at')
            ->limit(5)
            ->get()
            ->map(fn (Course $course) => [
                'id' => $course->id,
                'name' => $course->display_name,
                'code' => $course->code,
                'department' => $course->department?->name,
                'certification_level' => $course->certificationLevel?->name,
                'has_active_mapping' => (bool) $course->has_active_mapping,
                'updated_at' => $course->updated_at?->toDateString(),
            ])
            ->values();
    }

    private function departmentBreakdown()
    {
        return Course::query()
            ->with('department:id,code,name')
            ->selectRaw('department_id, COUNT(*) as courses_count')
            ->groupBy('department_id')
            ->orderByDesc('courses_count')
            ->limit(6)
            ->get()
            ->map(fn (Course $course) => [
                'id' => $course->department_id,
                'name' => $course->department
                    ? trim("{$course->department->code} - {$course->department->name}", ' -')
                    : 'Unassigned',
                'count' => (int) $course->courses_count,
            ])
            ->values();
    }

    // -------------------------------------------------------------------------
    // Role / department resolution
    // -------------------------------------------------------------------------

    /**
     * Returns the department ID that should constrain this request,
     * or null if the user is an unrestricted admin.
     */
    private function hodDepartmentId(Request $request): ?int
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
