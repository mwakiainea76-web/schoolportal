<?php

namespace App\Http\Controllers;

use App\Filters\CurriculumFilter;
use App\Http\Requests\StoreCurriculumRequest;
use App\Http\Requests\UpdateCurriculumRequest;
use App\Models\Curriculum;
use App\Models\CurriculumMapping;
use App\Services\CurriculumService;
use Illuminate\Http\Request;

class CurriculumController extends Controller
{
    public function __construct(
        protected CurriculumService $service
    ) {}

    public function index()
    {
        return inertia('Curriculums/Index', [
            'summary' => $this->summary(),
            'examBodyBreakdown' => $this->examBodyBreakdown(),
            'recentCurricula' => $this->recentCurricula(),
        ]);
    }

    public function editIndex(CurriculumFilter $filter)
    {
        $filters = request()->only(['search', 'sort', 'direction']);

        $curricula = Curriculum::query()
            ->with('examBody:id,code,name')
            ->tap(fn ($query) => $filter->apply(
                $query,
                $filters
            ))
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return inertia('Curriculums/EditIndex', [
            'curricula' => $curricula,
            'filters' => (object) $filters,
            'curriculumOptions' => $this->curriculumOptions(),
        ]);
    }

    public function create()
    {
        return inertia('Curriculums/Create');
    }

    public function store(StoreCurriculumRequest $request)
    {
        $result = $this->service->store($request->validated());

        return redirect()
            ->route('curriculums.index')
            ->with($result['status'] ? 'success' : 'error', $result['message']);
    }

    public function show(Curriculum $curriculum)
    {
        $curriculum->load(['course.certificationLevel.examBody', 'examBody:id,code,name']);

        return inertia('Curriculums/Edit', [
            'curriculum' => $curriculum,
        ]);
    }

    public function edit(Curriculum $curriculum)
    {
        $curriculum->load(['examBody:id,code,name']);

        return inertia('Curriculums/Edit', [
            'curriculum' => $curriculum,
        ]);
    }

    public function update(UpdateCurriculumRequest $request, Curriculum $curriculum)
    {
        $result = $this->service->update($curriculum, $request->validated());

        return redirect()
            ->route('curriculums.edit', $curriculum)
            ->with($result['status'] ? 'success' : 'error', $result['message']);
    }

    public function destroy(Curriculum $curriculum)
    {
        $this->service->delete($curriculum);

        return back()->with('success', 'Curriculum deleted successfully.');
    }

    public function disable(Curriculum $curriculum)
    {
        $result = $this->service->disable($curriculum);

        return back()->with($result['status'] ? 'success' : 'error', $result['message']);
    }

    public function reactivate(Curriculum $curriculum)
    {
        $result = $this->service->reactivate($curriculum);

        return back()->with($result['status'] ? 'success' : 'error', $result['message']);
    }

    public function search(Request $request)
    {
        $q = $request->q;
        $courseId = $request->integer('course_id') ?: null;

        $curricula = Curriculum::query()
            ->when($courseId, function ($query) use ($courseId) {
                $query->whereHas('curriculumMappings', fn ($mappingQuery) => $mappingQuery->where('course_id', $courseId));
            })
            ->when($q, function ($query) use ($q) {
                $query->where(function ($searchQuery) use ($q) {
                    $searchQuery
                        ->where('name', 'like', "%{$q}%")
                        ->orWhere('description', 'like', "%{$q}%");
                });
            })
            ->orderBy('name')
            ->limit(10)
            ->get(['id', 'name']);

        return response()->json(
            $curricula->map(fn ($curriculum) => [
                'id' => $curriculum->id,
                'name' => $curriculum->name,
            ])
        );
    }

    protected function curriculumOptions()
    {
        return Curriculum::query()
            ->orderByDesc('id')
            ->get(['id', 'name'])
            ->map(fn (Curriculum $curriculum) => [
                'id' => $curriculum->id,
                'name' => $curriculum->name,
            ])
            ->values();
    }

    protected function summary(): array
    {
        return [
            'total' => Curriculum::query()->count(),
            'active' => Curriculum::query()->where('is_active', true)->count(),
            'disabled' => Curriculum::query()->where('is_active', false)->count(),
            'exam_bodies' => Curriculum::query()->whereNotNull('exam_body_id')->distinct('exam_body_id')->count('exam_body_id'),
            'mapped_courses' => CurriculumMapping::query()->count(),
            'unmapped' => Curriculum::query()->whereDoesntHave('curriculumMappings')->count(),
        ];
    }

    protected function recentCurricula()
    {
        return Curriculum::query()
            ->with('examBody:id,code,name')
            ->latest('updated_at')
            ->limit(5)
            ->get(['id', 'exam_body_id', 'name', 'is_active', 'created_at', 'updated_at'])
            ->map(fn (Curriculum $curriculum) => [
                'id' => $curriculum->id,
                'name' => $curriculum->name,
                'exam_body' => $curriculum->examBody?->code ?? $curriculum->examBody?->name,
                'is_active' => $curriculum->is_active,
                'updated_at' => $curriculum->updated_at?->toDateString(),
            ])
            ->values();
    }

    protected function examBodyBreakdown()
    {
        return Curriculum::query()
            ->with('examBody:id,code,name')
            ->selectRaw('exam_body_id, COUNT(*) as curricula_count')
            ->groupBy('exam_body_id')
            ->orderByDesc('curricula_count')
            ->limit(6)
            ->get()
            ->map(fn (Curriculum $curriculum) => [
                'id' => $curriculum->exam_body_id,
                'name' => $curriculum->examBody?->code ?? $curriculum->examBody?->name ?? 'Unassigned',
                'count' => (int) $curriculum->curricula_count,
            ])
            ->values();
    }
}
