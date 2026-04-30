<?php

namespace App\Http\Controllers;

use App\Http\Requests\Storecurriculum_unitRequest;
use App\Http\Requests\Updatecurriculum_unitRequest;
use App\Models\CourseCurriculum;
use App\Models\CurriculumUnit;
use App\Models\Unit;
use App\Services\CurriculumUnitService;

class CurriculumUnitController extends Controller
{
    public function __construct(
        protected CurriculumUnitService $service
    ) {}

    public function index()
    {
        $curriculum_units = CurriculumUnit::with([
            'unit',
            'courseCurriculum.course',
            'courseCurriculum.curriculum',
        ])
            ->whereHas('courseCurriculum', function ($query) {
                $query->where('is_active', true);
            })
            ->whereHas('courseCurriculum.course', function ($query) {
                $query->where('is_active', true);
            })
            ->latest()
            ->paginate(40);

        return inertia('CurriculumUnits/Index', [
            'curriculum_units' => $curriculum_units,
        ]);
    }

    public function create()
    {
        $curricula = CourseCurriculum::query()
            ->active()
            ->with(['course:id,name', 'curriculum:id,name'])
            ->whereHas('course', fn ($query) => $query->where('is_active', true))
            ->orderByDesc('id')
            ->get()
            ->map(function ($curriculum) {
                return [
                    'id' => $curriculum->id,
                    'name' => $curriculum->curriculum->name.' - '.$curriculum->course->name,
                ];
            });

        return inertia('CurriculumUnits/Create', [
            'curricula' => $curricula,
            'units' => Unit::orderBy('name')->get(['id', 'name', 'code']),
        ]);
    }

    public function store(Storecurriculum_unitRequest $request)
    {
        $error = $this->service->store($request->validated());

        if ($error) {
            return to_route('units.curriculum.create')->with('error', $error);
        }

        return to_route('units.curriculum.create')
            ->with('success', 'Curriculum unit created successfully.');
    }

    public function edit(CurriculumUnit $curriculum_unit)
    {
        $curriculum_unit->load([
            'unit',
            'courseCurriculum.course',
            'courseCurriculum.curriculum',
        ]);

        return inertia('CurriculumUnits/Edit', [
            'curriculum_unit' => $curriculum_unit,

            'curricula' => CourseCurriculum::query()
                ->active()
                ->with(['course:id,name', 'curriculum:id,name'])
                ->whereHas('course', fn ($q) => $q->where('is_active', true))
                ->orderByDesc('id')
                ->get()
                ->map(fn ($c) => [
                    'id' => $c->id,
                    'name' => $c->curriculum->name.' ('.$c->course->name.')',
                ]),

            'units' => Unit::query()
                ->orderBy('name')
                ->get(['id', 'name', 'code']),
        ]);
    }

    public function update(Updatecurriculum_unitRequest $request, CurriculumUnit $curriculum_unit)
    {
        $error = $this->service->update($curriculum_unit, $request->validated());

        if ($error) {
            return to_route('units.curriculum.edit', $curriculum_unit)
                ->with('error', $error);
        }

        return to_route('units.curriculum.edit', $curriculum_unit)
            ->with('success', 'Curriculum unit updated successfully.');
    }

    public function destroy(CurriculumUnit $curriculum_unit)
    {
        $this->service->delete($curriculum_unit);

        return to_route('units.curriculum.index')
            ->with('success', 'Curriculum unit deleted successfully.');
    }
}
