<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreProgramVersionUnitRequest;
use App\Http\Requests\UpdateProgramVersionUnitRequest;
use App\Models\ProgramVersionMapping;
use App\Models\ProgramVersionUnit;
use App\Models\Unit;
use App\Services\ProgramVersionUnitService;
use App\Services\StudentAcademicContextService;
use Illuminate\Http\Request;

class ProgramVersionUnitController extends Controller
{
    public function __construct(
        protected ProgramVersionUnitService $service,
        protected StudentAcademicContextService $studentAcademicContextService
    ) {}

    public function index()
    {
        $curriculum_units = ProgramVersionUnit::with([
            'unit',
            'programVersionMapping.program',
            'programVersionMapping.programVersion',
        ])
            ->whereHas('programVersionMapping', function ($query) {
                $query->where('is_active', true);
            })
            ->latest()
            ->paginate(40);

        return inertia('ProgramVersionUnits/Index', [
            'curriculum_units' => $curriculum_units,
        ]);
    }

    public function studentIndex(Request $request)
    {
        $student = $request->user()?->student;
        $programEnrollment = $this->studentAcademicContextService->currentProgramEnrollmentForStudent($student);

        $units = $programEnrollment
            ? ProgramVersionUnit::query()
                ->with('unit:id,code,name,credit_factor,training_hours')
                ->where('program_version_mapping_id', $programEnrollment->program_version_mapping_id)
                ->orderBy('module_taught')
                ->orderBy('id')
                ->get()
            : collect();

        return inertia('ProgramVersionUnits/StudentIndex', [
            'program' => $programEnrollment ? [
                'name' => $programEnrollment->programVersionMapping?->program?->name,
                'version' => $programEnrollment->programVersionMapping?->programVersion?->name,
            ] : null,
            'units_by_module' => $units
                ->groupBy('module_taught')
                ->map(fn ($moduleUnits, $module) => [
                    'module' => (int) $module,
                    'units' => $moduleUnits->map(fn (ProgramVersionUnit $programVersionUnit) => [
                        'id' => $programVersionUnit->id,
                        'code' => $programVersionUnit->unit?->code,
                        'name' => $programVersionUnit->unit?->name,
                        'credit_factor' => $programVersionUnit->unit?->credit_factor,
                        'training_hours' => $programVersionUnit->unit?->training_hours,
                    ])->values(),
                ])
                ->sortBy('module')
                ->values(),
        ]);
    }

    public function create()
    {
        $curricula = ProgramVersionMapping::query()
            ->active()
            ->with(['program:id,name', 'programVersion:id,name'])
            ->orderByDesc('id')
            ->get()
            ->map(function ($curriculum) {
                return [
                    'id' => $curriculum->id,
                    'name' => $curriculum->programVersion->name.' - '.$curriculum->program->name,
                ];
            });

        return inertia('ProgramVersionUnits/Create', [
            'curricula' => $curricula,
            'units' => Unit::orderBy('name')->get(['id', 'name', 'code']),
        ]);
    }

    public function store(StoreProgramVersionUnitRequest $request)
    {
        $error = $this->service->store($request->validated());

        if ($error) {
            return to_route('units.program-version-units.create')->with('error', $error);
        }

        return to_route('units.program-version-units.create')
            ->with('success', 'ProgramVersion unit created successfully.');
    }

    public function edit(ProgramVersionUnit $curriculum_unit)
    {
        $curriculum_unit->load([
            'unit',
            'programVersionMapping.program',
            'programVersionMapping.programVersion',
        ]);

        return inertia('ProgramVersionUnits/Edit', [
            'curriculum_unit' => $curriculum_unit,

        'curricula' => ProgramVersionMapping::query()
            ->active()
            ->with(['program:id,name', 'programVersion:id,name'])
            ->orderByDesc('id')
            ->get()
            ->map(fn ($c) => [
                'id' => $c->id,
                'name' => $c->programVersion->name.' ('.$c->program->name.')',
            ]),

            'units' => Unit::query()
                ->orderBy('name')
                ->get(['id', 'name', 'code']),
        ]);
    }

    public function update(UpdateProgramVersionUnitRequest $request, ProgramVersionUnit $curriculum_unit)
    {
        $error = $this->service->update($curriculum_unit, $request->validated());

        if ($error) {
            return to_route('units.program-version-units.edit', $curriculum_unit)
                ->with('error', $error);
        }

        return to_route('units.program-version-units.edit', $curriculum_unit)
            ->with('success', 'ProgramVersion unit updated successfully.');
    }

    public function destroy(ProgramVersionUnit $curriculum_unit)
    {
        $this->service->delete($curriculum_unit);

        return to_route('units.program-version-units.index')
            ->with('success', 'ProgramVersion unit deleted successfully.');
    }
}


