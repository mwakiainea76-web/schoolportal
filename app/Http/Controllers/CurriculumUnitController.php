<?php

namespace App\Http\Controllers;

use App\Http\Requests\Storecurriculum_unitRequest;
use App\Http\Requests\Updatecurriculum_unitRequest;
use App\Models\Curriculum;
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
            'curriculum.course',
        ])
            ->whereHas('curriculum.course', function ($query) {
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
        $curricula = Curriculum::query()
            ->whereHas('course', function ($query) {
                $query->where('is_active', true);
            })
            ->with('course')
            ->orderBy('name')
            ->get(['id', 'name', 'course_id'])
            ->map(function ($curriculum) {
                return [
                    'id' => $curriculum->id,
                    'name' => $curriculum->name.' - '.$curriculum->course->name.'',
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
            'curriculum.course',
        ]);

        return inertia('CurriculumUnits/Edit', [
            'curriculum_unit' => $curriculum_unit,

            'curricula' => Curriculum::query()
                ->whereHas('course', fn ($q) => $q->where('is_active', true))
                ->with('course')
                ->orderBy('name')
                ->get(['id', 'name', 'course_id'])
                ->map(fn ($c) => [
                    'id' => $c->id,
                    'name' => $c->name.' ('.$c->course->name.')',
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
