<?php

namespace App\Http\Controllers;

use App\Filters\CurriculumMappingFilter;
use App\Http\Requests\StoreCurriculumMappingRequest;
use App\Http\Requests\UpdateCurriculumMappingRequest;
use App\Models\Course;
use App\Models\Curriculum;
use App\Models\CurriculumMapping;
use App\Models\ExamBody;
use App\Services\CurriculumMappingService;
use Illuminate\Http\Request;

class CurriculumMappingController extends Controller
{
    public function __construct(
        protected CurriculumMappingService $service
    ) {}

    public function index(CurriculumMappingFilter $filter)
    {
        $filters = request()->only([
            'search',
            'course_id',
            'curriculum_id',
            'exam_body_id',
            'is_active',
            'sort',
            'direction',
        ]);

        $curriculumMappings = CurriculumMapping::query()
            ->tap(fn ($query) => $filter->apply(
                $query,
                $filters
            ))
            ->latest()
            ->with(['course.certificationLevel.examBody', 'curriculum'])
            ->paginate(10)
            ->withQueryString();

        return inertia('CurriculumMappings/Index', [
            'curriculumMappings' => $curriculumMappings,
            'filters' => (object) $filters,
            'selectedFilters' => $this->selectedIndexFilters($filters),
        ]);
    }

    public function create()
    {
        return inertia('CurriculumMappings/Create');
    }

    public function store(StoreCurriculumMappingRequest $request)
    {
        $result = $this->service->create($request->validated());

        return redirect()
            ->route('courses.curriculum-mappings.index')
            ->with($result['status'] ? 'success' : 'error', $result['message']);
    }

    public function edit(CurriculumMapping $curriculumMapping)
    {
        $curriculumMapping->load([
            'course:id,name,certification_level_id',
            'course.certificationLevel:id,name,exam_body_id',
            'course.certificationLevel.examBody:id,code,name',
            'curriculum:id,name',
        ]);

        return inertia('CurriculumMappings/Edit', [
            'curriculumMapping' => $curriculumMapping,
        ]);
    }

    public function update(UpdateCurriculumMappingRequest $request, CurriculumMapping $curriculumMapping)
    {
        $result = $this->service->update($curriculumMapping, $request->validated());

        return redirect()
            ->route('courses.curriculum-mappings.index')
            ->with($result['status'] ? 'success' : 'error', $result['message']);
    }

    public function activate(CurriculumMapping $curriculumMapping)
    {
        $result = $this->service->activate($curriculumMapping);

        return redirect()
            ->route('courses.curriculum-mappings.index')
            ->with($result['status'] ? 'success' : 'error', $result['message']);
    }

    public function deactivate(CurriculumMapping $curriculumMapping)
    {
        $result = $this->service->deactivate($curriculumMapping);

        return redirect()
            ->route('courses.curriculum-mappings.index')
            ->with($result['status'] ? 'success' : 'error', $result['message']);
    }

    public function destroy(CurriculumMapping $curriculumMapping)
    {
        $result = $this->service->delete($curriculumMapping);

        return redirect()
            ->route('courses.curriculum-mappings.index')
            ->with($result['status'] ? 'success' : 'error', $result['message']);
    }

    public function search(Request $request)
    {
        $limit = min(max($request->integer('limit', 10), 1), 25);
        $query = trim((string) $request->query('q', ''));
        $hodDepartmentId = $this->shouldScopeToHodDepartment($request)
            ? $this->currentDepartmentId($request)
            : null;

        $mappings = CurriculumMapping::query()
            ->with([
                'course:id,name,code',
                'curriculum:id,name',
            ])
            ->when($hodDepartmentId, function ($builder) use ($hodDepartmentId) {
                $builder
                    ->where('is_active', true)
                    ->whereHas('curriculum', fn ($curriculumQuery) => $curriculumQuery->where('is_active', true))
                    ->whereHas('course', fn ($courseQuery) => $courseQuery->where('department_id', $hodDepartmentId));
            })
            ->when($query !== '', function ($builder) use ($query) {
                $builder->where(function ($mappingQuery) use ($query) {
                    $mappingQuery
                        ->whereHas('course', fn ($courseQuery) => $courseQuery
                            ->where('name', 'like', "%{$query}%")
                            ->orWhere('code', 'like', "%{$query}%"))
                        ->orWhereHas('curriculum', fn ($curriculumQuery) => $curriculumQuery
                            ->where('name', 'like', "%{$query}%"));
                });
            })
            ->latest('id')
            ->limit($limit)
            ->get(['id', 'course_id', 'curriculum_id'])
            ->map(fn (CurriculumMapping $mapping) => [
                'id' => (string) $mapping->id,
                'name' => trim(($mapping->curriculum?->name ?? '').' - '.($mapping->course?->display_name ?? $mapping->course?->name ?? ''), ' -'),
            ])
            ->values();

        return response()->json($mappings);
    }

    public function courseSearch(Request $request)
    {
        $q = $request->q;

        $examBodies = ExamBody::query()
            ->when($q, function ($query) use ($q) {
                $query->where(function ($sub) use ($q) {
                    $sub->where('name', 'like', "%{$q}%")
                        ->orWhere('code', 'like', "%{$q}%");
                });
            })
            ->orderBy('code')
            ->limit(10)
            ->get(['id', 'name', 'code'])
            ->map(fn ($examBody) => [
                'id' => $examBody->id,
                'name' => trim($examBody->code.' - '.$examBody->name, ' -'),
            ]);

        return response()->json($examBodies);
    }

    protected function selectedIndexFilters(array $filters): array
    {
        $course = ($filters['course_id'] ?? '') !== ''
            ? Course::with('certificationLevel:id,name')->select('id', 'name', 'certification_level_id')->find($filters['course_id'])
            : null;
        $curriculum = ($filters['curriculum_id'] ?? '') !== ''
            ? Curriculum::select('id', 'name')->find($filters['curriculum_id'])
            : null;
        $examBody = ($filters['exam_body_id'] ?? '') !== ''
            ? ExamBody::select('id', 'code', 'name')->find($filters['exam_body_id'])
            : null;

        return [
            'course' => $course?->display_name,
            'curriculum' => $curriculum?->name,
            'exam_body' => $examBody
                ? trim($examBody->code.' - '.$examBody->name, ' -')
                : null,
            'status' => match ((string) ($filters['is_active'] ?? '')) {
                '1' => 'Active',
                '0' => 'Inactive',
                default => null,
            },
        ];
    }

    protected function shouldScopeToHodDepartment(Request $request): bool
    {
        return (bool) (
            $request->user()?->hasRole('hod')
            && ! $request->user()?->hasRole('admin')
            && $this->currentDepartmentId($request)
        );
    }

    protected function currentDepartmentId(Request $request): ?int
    {
        return $request->user()?->staff?->department_id
            ? (int) $request->user()->staff->department_id
            : null;
    }

}
