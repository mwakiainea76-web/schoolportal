<?php

namespace App\Http\Controllers;

use App\Filters\CurriculumFilter;
use App\Http\Requests\StoreCurriculumRequest;
use App\Http\Requests\UpdateCurriculumRequest;
use App\Models\Course;
use App\Models\Curriculum;
use App\Services\CurriculumService;
use Illuminate\Http\Request;

class CurriculumController extends Controller
{
    public function __construct(
        protected CurriculumService $service
    ) {}

    public function index(CurriculumFilter $filter)
    {
        $curriculums = Curriculum::query()
            ->tap(fn ($query) => $filter->apply(
                $query,
                request()->only(['search', 'sort', 'direction'])
            ))
            ->latest()
            ->with(['course'])
            ->paginate(10)
            ->withQueryString();

        return inertia('Curriculum/Index', [
            'curriculum' => $curriculums,
        ]);
    }

    public function create()
    {

        return inertia('Curriculum/Create', [
            'courses' => Course::select('id', 'name')
                ->where('is_active', true)
                ->orderBy('name')
                ->get()
                ->values(),
        ]);
    }

    public function store(StoreCurriculumRequest $request)
    {
        $result = $this->service->create($request->validated());

        return redirect()
            ->route('courses.curriculum.index')
            ->with($result['status'] ? 'success' : 'error', $result['message']);
    }

    public function edit(Curriculum $curriculum)
    {
        return inertia('Curriculum/Edit', [
            'curriculum' => $curriculum,

            'courses' => Course::query()
                ->with('certificationLevel:id,name')
                ->orderBy('name')
                ->limit(20)
                ->get(['id', 'code', 'name', 'certification_level_id'])
                ->map(fn ($course) => [
                    'id' => $course->id,
                    'name' => $course->display_name,
                ]),
        ]);
    }

    public function update(UpdateCurriculumRequest $request, Curriculum $curriculum)
    {
        $this->service->update($curriculum, $request->validated());

        return redirect()
            ->route('courses.curriculum.edit', $curriculum->name)
            ->with('success', 'Curriculum updated successfully.');
    }

    public function destroy(Curriculum $curriculum)
    {
        $result = $this->service->delete($curriculum);

        return redirect()
            ->route('courses.curriculum.index')
            ->with($result['status'] ? 'success' : 'error', $result['message']);
    }

    public function search(Request $request)
    {
        $q = $request->q;

        $curriculums = Curriculum::query()
            ->when($q, function ($query) use ($q) {
                $query->where('name', 'like', "{$q}%")
                    ->where('is_active', 1);
            })
            ->orderBy('name', 'asc')
            ->limit(10)
            ->get(['id', 'name']);

        return response()->json(
            $curriculums->map(fn ($curriculum) => [
                'id' => $curriculum->id,
                'name' => $curriculum->name,
            ])
        );
    }
}
