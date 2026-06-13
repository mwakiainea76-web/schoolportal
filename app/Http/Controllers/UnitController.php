<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreCurriculumUnitRequest;
use App\Http\Requests\UpdateCurriculumUnitRequest;
use App\Models\Course;
use App\Models\CurriculumMapping;
use App\Models\Unit;
use App\Services\StudentAcademicContextService;
use App\Services\UnitService;
use Illuminate\Http\Request;

class UnitController extends Controller
{
    public function __construct(
        protected UnitService $service,
        protected StudentAcademicContextService $studentAcademicContextService
    ) {}

    public function index(Request $request)
    {
        $filters = $request->only([
            'unit_id',
            'module_taught',
            'scope',
            'course_id',
            'curriculum_mapping_id',
            'sort',
            'direction',
        ]);

        $selectedMappingId = $request->integer('curriculum_mapping_id') ?: null;
        $hodDepartmentId = $this->shouldScopeToHodDepartment($request)
            ? $this->currentDepartmentId($request)
            : null;
        $selectedMapping = $selectedMappingId
            ? CurriculumMapping::query()
                ->with(['course.certificationLevel', 'curriculum'])
                ->when($hodDepartmentId, function ($query) use ($hodDepartmentId) {
                    $query->whereHas('course', fn ($courseQuery) => $courseQuery->where('department_id', $hodDepartmentId));
                })
                ->find($selectedMappingId)
            : null;

        $sortField = $request->string('sort')->toString();
        $sortDirection = $request->string('direction')->toString() === 'asc' ? 'asc' : 'desc';
        $allowedSorts = ['created_at', 'module_taught', 'code', 'name'];

        if (! in_array($sortField, $allowedSorts, true)) {
            $sortField = 'module_taught';
            $sortDirection = 'asc';
        }

        $units = Unit::query()
            ->with(['curriculumMapping.course.certificationLevel', 'curriculumMapping.curriculum'])
            ->when($hodDepartmentId, function ($query) use ($hodDepartmentId) {
                $query->whereHas('curriculumMapping', function ($mappingQuery) use ($hodDepartmentId) {
                    $mappingQuery
                        ->where('is_active', true)
                        ->whereHas('curriculum', fn ($curriculumQuery) => $curriculumQuery->where('is_active', true))
                        ->whereHas('course', fn ($courseQuery) => $courseQuery->where('department_id', $hodDepartmentId));
                });
            })
            ->when($request->filled('unit_id'), fn ($query) => $query->whereKey($request->integer('unit_id')))
            ->when($request->filled('module_taught'), fn ($query) => $query->where('module_taught', $request->integer('module_taught')))
            ->when($request->filled('scope'), fn ($query) => $query->where('scope', $request->string('scope')->toString()))
            ->when($selectedMappingId, fn ($query) => $query->where('curriculum_mapping_id', $selectedMappingId))
            ->when($request->filled('course_id'), function ($query) use ($request) {
                $query->whereHas('curriculumMapping.course', fn ($courseQuery) => $courseQuery->whereKey($request->integer('course_id')));
            })
            ->orderBy($sortField, $sortDirection)
            ->paginate(40)
            ->withQueryString();

        return inertia('CurriculumUnits/Index', [
            'curriculum_mapping' => $selectedMapping,
            'selected_mapping_option' => $this->mappingOption($selectedMapping),
            'units' => $units,
            'filters' => (object) $filters,
            'selectedFilters' => $this->selectedIndexFilters($filters),
            'can_manage_units' => ! $this->shouldScopeToHodDepartment($request),
        ]);
    }

    public function studentIndex(Request $request)
    {
        $student = $request->user()?->student;
        $courseEnrollment = $this->studentAcademicContextService->currentCourseEnrollmentForStudent($student);

        $units = $courseEnrollment
            ? Unit::query()
                ->where('curriculum_mapping_id', $courseEnrollment->curriculum_mapping_id)
                ->orderBy('module_taught')
                ->orderBy('id')
                ->get()
            : collect();

        return inertia('CurriculumUnits/StudentIndex', [
            'course' => $courseEnrollment ? [
                'name' => $courseEnrollment->course?->name
                    ?? $courseEnrollment->curriculumMapping?->course?->name,
                'version' => $courseEnrollment->curriculum?->name
                    ?? $courseEnrollment->curriculumMapping?->curriculum?->name,
            ] : null,
            'units_by_module' => $units
                ->groupBy('module_taught')
                ->map(fn ($moduleUnits, $module) => [
                    'module' => (int) $module,
                    'units' => $moduleUnits->map(fn (Unit $unit) => [
                        'id' => $unit->id,
                        'code' => $unit->code,
                        'name' => $unit->name,
                        'credit_factor' => $unit->credit_factor,
                        'training_hours' => $unit->training_hours,
                    ])->values(),
                ])
                ->sortBy('module')
                ->values(),
        ]);
    }

    public function registeredUnitsIndex(Request $request)
    {
        $student = $request->user()?->student;
        $latestSessionEnrollment = $this->studentAcademicContextService->latestSessionEnrollmentForStudent($student);

        $registeredUnits = $latestSessionEnrollment
            ? $latestSessionEnrollment->unitRegistrations()
                ->with('curriculumUnit')
                ->get()
                ->pluck('curriculumUnit')
                ->filter()
            : collect();

        return inertia('CurriculumUnits/RegisteredUnits', [
            'session' => $latestSessionEnrollment ? [
                'name' => $latestSessionEnrollment->academicSession?->display_name,
                'module' => $latestSessionEnrollment->module,
                'year_of_study' => $latestSessionEnrollment->year_of_study,
            ] : null,
            'units' => $registeredUnits->map(fn (Unit $unit) => [
                'id' => $unit->id,
                'code' => $unit->code,
                'name' => $unit->name,
                'credit_factor' => $unit->credit_factor,
                'training_hours' => $unit->training_hours,
                'module_taught' => $unit->module_taught,
            ])->values(),
        ]);
    }

    public function create(Request $request)
    {
        abort_if($this->shouldScopeToHodDepartment($request), 403);

        $selectedMappingId = $request->integer('curriculum_mapping_id') ?: null;
        $selectedMapping = $selectedMappingId
            ? CurriculumMapping::query()
                ->with(['course.certificationLevel', 'curriculum'])
                ->find($selectedMappingId)
            : null;

        return inertia('CurriculumUnits/Create', [
            'curriculum_mapping' => $selectedMapping,
            'selected_mapping_option' => $this->mappingOption($selectedMapping),
        ]);
    }

    public function store(StoreCurriculumUnitRequest $request)
    {
        abort_if($this->shouldScopeToHodDepartment($request), 403);

        $data = $request->validated();
        $unit = $this->service->store($data);

        return to_route('units.index', ['curriculum_mapping_id' => $unit->curriculum_mapping_id])
            ->with('success', 'Unit created successfully.');
    }

    public function edit(Unit $unit)
    {
        abort_if($this->shouldScopeToHodDepartment(request()), 403);

        $unit->load([
            'curriculumMapping.course',
            'curriculumMapping.course.certificationLevel',
            'curriculumMapping.curriculum',
        ]);

        return inertia('CurriculumUnits/Edit', [
            'curriculum_mapping' => $unit->curriculumMapping,
            'unit' => $unit,
            'selected_mapping_option' => $this->mappingOption($unit->curriculumMapping),
        ]);
    }

    public function update(UpdateCurriculumUnitRequest $request, Unit $unit)
    {
        abort_if($this->shouldScopeToHodDepartment($request), 403);

        $data = $request->validated();
        $this->service->update($unit, $data);

        return to_route('units.index', ['curriculum_mapping_id' => $unit->fresh()->curriculum_mapping_id])
            ->with('success', 'Unit updated successfully.');
    }

    public function destroy(Unit $unit)
    {
        abort_if($this->shouldScopeToHodDepartment(request()), 403);

        $mappingId = $unit->curriculum_mapping_id;

        $this->service->delete($unit);

        return to_route('units.index', ['curriculum_mapping_id' => $mappingId])
            ->with('success', 'Unit deleted successfully.');
    }

    public function search(Request $request)
    {
        $limit = min(max($request->integer('limit', 10), 1), 25);
        $query = trim((string) $request->query('q', ''));
        $hodDepartmentId = $this->shouldScopeToHodDepartment($request)
            ? $this->currentDepartmentId($request)
            : null;

        $units = Unit::query()
            ->with(['curriculumMapping.course:id,name', 'curriculumMapping.curriculum:id,name'])
            ->when($hodDepartmentId, function ($builder) use ($hodDepartmentId) {
                $builder->whereHas('curriculumMapping', function ($mappingQuery) use ($hodDepartmentId) {
                    $mappingQuery
                        ->where('is_active', true)
                        ->whereHas('curriculum', fn ($curriculumQuery) => $curriculumQuery->where('is_active', true))
                        ->whereHas('course', fn ($courseQuery) => $courseQuery->where('department_id', $hodDepartmentId));
                });
            })
            ->when($request->filled('curriculum_mapping_id'), fn ($builder) => $builder->where('curriculum_mapping_id', $request->integer('curriculum_mapping_id')))
            ->when($request->filled('course_id'), function ($builder) use ($request) {
                $builder->whereHas('curriculumMapping.course', fn ($courseQuery) => $courseQuery->whereKey($request->integer('course_id')));
            })
            ->when($request->filled('certification_level_id'), function ($builder) use ($request) {
                $builder->whereHas('curriculumMapping.course', fn ($courseQuery) => $courseQuery->where('certification_level_id', $request->integer('certification_level_id')));
            })
            ->when($query !== '', function ($builder) use ($query) {
                $builder->where(function ($unitQuery) use ($query) {
                    $unitQuery
                        ->where('units.name', 'like', "%{$query}%")
                        ->orWhere('units.code', 'like', "%{$query}%")
                        ->orWhereHas('curriculumMapping.course', fn ($courseQuery) => $courseQuery->where('name', 'like', "%{$query}%"))
                        ->orWhereHas('curriculumMapping.curriculum', fn ($curriculumQuery) => $curriculumQuery->where('name', 'like', "%{$query}%"));
                });
            })
            ->orderBy('module_taught')
            ->orderBy('code')
            ->limit($limit)
            ->get(['id', 'curriculum_mapping_id', 'code', 'name', 'module_taught'])
            ->map(fn (Unit $unit) => [
                'id' => (string) $unit->id,
                'name' => trim(($unit->code ?? '').' - '.($unit->name ?? ''), ' -'),
            ])
            ->values();

        return response()->json($units);
    }

    protected function mappingOption(?CurriculumMapping $mapping): ?array
    {
        if (! $mapping) {
            return null;
        }

        return [
            'id' => (string) $mapping->id,
            'name' => collect([
                $mapping->curriculum?->name,
                $mapping->course?->display_name ?? $mapping->course?->name,
            ])->filter()->implode(' - '),
        ];
    }

    protected function selectedIndexFilters(array $filters): array
    {
        $unit = ! empty($filters['unit_id'])
            ? Unit::select('id', 'code', 'name', 'module_taught')->find($filters['unit_id'])
            : null;
        $course = ! empty($filters['course_id'])
            ? Course::with('certificationLevel:id,name')
                ->select('id', 'name', 'certification_level_id')
                ->find($filters['course_id'])
            : null;
        $mapping = ! empty($filters['curriculum_mapping_id'])
            ? CurriculumMapping::query()
                ->with([
                    'course:id,name,certification_level_id',
                    'course.certificationLevel:id,name',
                    'curriculum:id,name',
                ])
                ->find($filters['curriculum_mapping_id'])
            : null;

        return [
            'unit' => $unit
                ? trim($unit->code.' - '.$unit->name.' (Module '.$unit->module_taught.')', ' -')
                : null,
            'scope' => ($filters['scope'] ?? '') !== ''
                ? ucfirst((string) $filters['scope'])
                : null,
            'course' => $course?->display_name,
            'curriculum_mapping' => $mapping
                ? collect([
                    $mapping->curriculum?->name,
                    $mapping->course?->display_name ?? $mapping->course?->name,
                ])->filter()->implode(' - ')
                : null,
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
