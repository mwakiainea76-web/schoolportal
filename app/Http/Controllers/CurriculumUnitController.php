<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreCurriculumUnitRequest;
use App\Http\Requests\UpdateCurriculumUnitRequest;
use App\Models\Curriculum;
use App\Models\CurriculumMapping;
use App\Models\CurriculumUnit;
use App\Services\CurriculumUnitService;
use App\Services\StudentAcademicContextService;
use Illuminate\Http\Request;

class CurriculumUnitController extends Controller
{
    public function __construct(
        protected CurriculumUnitService $service,
        protected StudentAcademicContextService $studentAcademicContextService
    ) {}

    public function index(Request $request)
    {
        $filters = [
            'curriculum_id' => (string) ($request->integer('curriculum_id') ?: ''),
            'curriculum_mapping_id' => (string) ($request->integer('curriculum_mapping_id') ?: ''),
        ];
        $sortField = $request->string('sort')->toString();
        $sortDirection = $request->string('direction')->toString() === 'asc' ? 'asc' : 'desc';
        $allowedSorts = ['created_at', 'curriculum_mapping_id', 'module_taught'];

        if (! in_array($sortField, $allowedSorts, true)) {
            $sortField = 'created_at';
        }

        $curriculum_units = CurriculumUnit::with([
            'unit',
            'curriculum.course',
            'curriculumMapping.course',
            'curriculumMapping.curriculum',
        ])
            ->when($filters['curriculum_id'] !== '', function ($query) use ($filters) {
                $query->where('curriculum_id', $filters['curriculum_id']);
            })
            ->when($filters['curriculum_mapping_id'] !== '', function ($query) use ($filters) {
                $query->where('curriculum_mapping_id', $filters['curriculum_mapping_id']);
            })
            ->where(function ($query) {
                $query->whereHas('curriculum', fn ($versionQuery) => $versionQuery->where('is_active', true))
                    ->orWhereHas('curriculumMapping', fn ($mappingQuery) => $mappingQuery->where('is_active', true));
            })
            ->orderBy($sortField, $sortDirection)
            ->paginate(40)
            ->withQueryString();

        $selectedCurriculum = $filters['curriculum_id'] !== ''
            ? Curriculum::query()->find($filters['curriculum_id'], ['id', 'name'])
            : null;

        $selectedMapping = $filters['curriculum_mapping_id'] !== ''
            ? CurriculumMapping::query()
                ->with([
                    'course:id,name,code,certification_level_id',
                    'curriculum:id,name',
                    'course.certificationLevel:id,name',
                ])
                ->find($filters['curriculum_mapping_id'])
            : null;

        return inertia('CurriculumUnits/Index', [
            'curriculum_units' => $curriculum_units,
            'filters' => $filters,
            'selected_curriculum' => $selectedCurriculum
                ? ['id' => $selectedCurriculum->id, 'name' => $selectedCurriculum->name]
                : null,
            'selected_curriculum_mapping' => $selectedMapping
                ? [
                    'id' => $selectedMapping->id,
                    'name' => collect([
                        $selectedMapping->curriculum?->name,
                        $selectedMapping->course?->display_name ?? $selectedMapping->course?->name,
                        $selectedMapping->course?->certificationLevel?->name,
                    ])->filter()->implode(' - '),
                ]
                : null,
        ]);
    }

    public function studentIndex(Request $request)
    {
        $student = $request->user()?->student;
        $courseEnrollment = $this->studentAcademicContextService->currentCourseEnrollmentForStudent($student);

        $units = $courseEnrollment
            ? CurriculumUnit::query()
                ->with('unit:id,code,name,credit_factor,training_hours')
                ->when(
                    $courseEnrollment->curriculum_id,
                    fn ($query) => $query->where('curriculum_id', $courseEnrollment->curriculum_id),
                    fn ($query) => $query->where('curriculum_mapping_id', $courseEnrollment->curriculum_mapping_id)
                )
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
                    'units' => $moduleUnits->map(fn (CurriculumUnit $curriculumUnit) => [
                        'id' => $curriculumUnit->id,
                        'code' => $curriculumUnit->unit?->code,
                        'name' => $curriculumUnit->unit?->name,
                        'credit_factor' => $curriculumUnit->unit?->credit_factor,
                        'training_hours' => $curriculumUnit->unit?->training_hours,
                    ])->values(),
                ])
                ->sortBy('module')
                ->values(),
        ]);
    }

    public function create()
    {
        return inertia('CurriculumUnits/Create');
    }

    public function store(StoreCurriculumUnitRequest $request)
    {
        $error = $this->service->store($request->validated());

        if ($error) {
            return to_route('units.curriculum-units.create')->with('error', $error);
        }

        return to_route('units.curriculum-units.create')
            ->with('success', 'Curriculum unit created successfully.');
    }

    public function edit(CurriculumUnit $curriculum_unit)
    {
        $curriculum_unit->load([
            'unit',
            'curriculum.course',
            'curriculumMapping.course',
            'curriculumMapping.curriculum',
        ]);

        return inertia('CurriculumUnits/Edit', [
            'curriculum_unit' => $curriculum_unit,
        ]);
    }

    public function update(UpdateCurriculumUnitRequest $request, CurriculumUnit $curriculum_unit)
    {
        $error = $this->service->update($curriculum_unit, $request->validated());

        if ($error) {
            return to_route('units.curriculum-units.edit', $curriculum_unit)
                ->with('error', $error);
        }

        return to_route('units.curriculum-units.edit', $curriculum_unit)
            ->with('success', 'Curriculum unit updated successfully.');
    }

    public function destroy(CurriculumUnit $curriculum_unit)
    {
        $this->service->delete($curriculum_unit);

        return to_route('units.curriculum-units.index')
            ->with('success', 'Curriculum unit deleted successfully.');
    }
}
