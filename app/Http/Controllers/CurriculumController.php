<?php

namespace App\Http\Controllers;

use App\Filters\CurriculumFilter;
use App\Http\Requests\StoreCurriculumRequest;
use App\Http\Requests\UpdateCurriculumRequest;
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
        $curricula = Curriculum::query()
            ->tap(fn ($query) => $filter->apply(
                $query,
                request()->only(['search', 'sort', 'direction'])
            ))
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return inertia('Curriculum/Index', [
            'curricula' => $curricula,
        ]);
    }

    public function create()
    {
        return inertia('Curriculum/Create');
    }

    public function store(StoreCurriculumRequest $request)
    {
        $result = $this->service->store($request->validated());

        return redirect()
            ->route('curriculum.index')
            ->with($result['status'] ? 'success' : 'error', $result['message']);
    }

    public function show(Curriculum $curriculum)
    {
        return inertia('Curriculum/Edit', [
            'curriculum' => $curriculum,
        ]);
    }

    public function edit(Curriculum $curriculum)
    {
        return inertia('Curriculum/Edit', [
            'curriculum' => $curriculum,
        ]);
    }

    public function update(UpdateCurriculumRequest $request, Curriculum $curriculum)
    {
        $result = $this->service->update($curriculum, $request->validated());

        return redirect()
            ->route('curriculum.edit', $curriculum)
            ->with($result['status'] ? 'success' : 'error', $result['message']);
    }

    public function destroy(Curriculum $curriculum)
    {
        $this->service->delete($curriculum);

        return redirect()
            ->route('curriculum.index')
            ->with('success', 'Curriculum deleted successfully.');
    }

    public function search(Request $request)
    {
        $q = $request->q;

        $curricula = Curriculum::query()
            ->when($q, function ($query) use ($q) {
                $query->where('name', 'like', "%{$q}%")
                    ->orWhere('description', 'like', "%{$q}%");
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
}
