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
            'course_id',
            'curriculum_mapping_id',
            'sort',
            'direction',
        ]);

        $selectedMappingId = $request->integer('curriculum_mapping_id') ?: null;
        $selectedMapping = $selectedMappingId
            ? CurriculumMapping::query()
                ->with(['course.certificationLevel', 'curriculum'])
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
            ->when($request->filled('unit_id'), fn ($query) => $query->whereKey($request->integer('unit_id')))
            ->when($request->filled('module_taught'), fn ($query) => $query->where('module_taught', $request->integer('module_taught')))
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

    public function create(Request $request)
    {
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
        $data = $request->validated();
        $unit = $this->service->store($data);

        return to_route('units.index', ['curriculum_mapping_id' => $unit->curriculum_mapping_id])
            ->with('success', 'Unit created successfully.');
    }

    public function edit(Unit $unit)
    {
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
        $data = $request->validated();
        $this->service->update($unit, $data);

        return to_route('units.index', ['curriculum_mapping_id' => $unit->fresh()->curriculum_mapping_id])
            ->with('success', 'Unit updated successfully.');
    }

    public function destroy(Unit $unit)
    {
        $mappingId = $unit->curriculum_mapping_id;

        $this->service->delete($unit);

        return to_route('units.index', ['curriculum_mapping_id' => $mappingId])
            ->with('success', 'Unit deleted successfully.');
    }

    public function search(Request $request)
    {
        $limit = min(max($request->integer('limit', 10), 1), 25);
        $query = trim((string) $request->query('q', ''));

        $units = Unit::query()
            ->with(['curriculumMapping.course:id,name', 'curriculumMapping.curriculum:id,name'])
            ->when($request->filled('curriculum_mapping_id'), fn ($builder) => $builder->where('curriculum_mapping_id', $request->integer('curriculum_mapping_id')))
            ->when($request->filled('course_id'), function ($builder) use ($request) {
                $builder->whereHas('curriculumMapping.course', fn ($courseQuery) => $courseQuery->whereKey($request->integer('course_id')));
            })
            ->when($request->filled('exam_body_id'), function ($builder) use ($request) {
                $builder->whereHas('curriculumMapping.course.certificationLevel', fn ($levelQuery) => $levelQuery->where('exam_body_id', $request->integer('exam_body_id')));
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

        return [
            'unit' => $unit
                ? trim($unit->code.' - '.$unit->name.' (Module '.$unit->module_taught.')', ' -')
                : null,
            'course' => $course?->display_name,
        ];
    }
}
