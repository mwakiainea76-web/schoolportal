<?php

namespace App\Http\Controllers;

use App\Filters\ProgramVersionFilter;
use App\Http\Requests\StoreProgramVersionRequest;
use App\Http\Requests\UpdateProgramVersionRequest;
use App\Models\ProgramVersion;
use App\Services\ProgramVersionService;
use Illuminate\Http\Request;

class ProgramVersionController extends Controller
{
    public function __construct(
        protected ProgramVersionService $service
    ) {}

    public function index(ProgramVersionFilter $filter)
    {
        $curricula = ProgramVersion::query()
            ->tap(fn ($query) => $filter->apply(
                $query,
                request()->only(['search', 'sort', 'direction'])
            ))
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return inertia('ProgramVersions/Index', [
            'curricula' => $curricula,
        ]);
    }

    public function create()
    {
        return inertia('ProgramVersions/Create');
    }

    public function store(StoreProgramVersionRequest $request)
    {
        $result = $this->service->store($request->validated());

        return redirect()
            ->route('program-versions.index')
            ->with($result['status'] ? 'success' : 'error', $result['message']);
    }

    public function show(ProgramVersion $curriculum)
    {
        return inertia('ProgramVersions/Edit', [
            'curriculum' => $curriculum,
        ]);
    }

    public function edit(ProgramVersion $curriculum)
    {
        return inertia('ProgramVersions/Edit', [
            'curriculum' => $curriculum,
        ]);
    }

    public function update(UpdateProgramVersionRequest $request, ProgramVersion $curriculum)
    {
        $result = $this->service->update($curriculum, $request->validated());

        return redirect()
            ->route('program-versions.edit', $curriculum)
            ->with($result['status'] ? 'success' : 'error', $result['message']);
    }

    public function destroy(ProgramVersion $curriculum)
    {
        $this->service->delete($curriculum);

        return redirect()
            ->route('program-versions.index')
            ->with('success', 'ProgramVersion deleted successfully.');
    }

    public function search(Request $request)
    {
        $q = $request->q;

        $curricula = ProgramVersion::query()
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


