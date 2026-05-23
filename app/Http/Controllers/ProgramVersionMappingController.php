<?php

namespace App\Http\Controllers;

use App\Filters\ProgramVersionMappingFilter;
use App\Http\Requests\StoreProgramVersionMappingRequest;
use App\Http\Requests\UpdateProgramVersionMappingRequest;
use App\Models\Program;
use App\Models\ProgramVersionMapping;
use App\Models\ProgramVersion;
use App\Services\ProgramVersionMappingService;
use Illuminate\Http\Request;

class ProgramVersionMappingController extends Controller
{
    public function __construct(
        protected ProgramVersionMappingService $service
    ) {}

    public function index(ProgramVersionMappingFilter $filter)
    {
        $programVersionMappings = ProgramVersionMapping::query()
            ->tap(fn ($query) => $filter->apply(
                $query,
                request()->only(['search', 'sort', 'direction'])
            ))
            ->latest()
            ->with(['program', 'programVersion'])
            ->paginate(10)
            ->withQueryString();

        return inertia('ProgramVersionMappings/Index', [
            'programVersionMappings' => $programVersionMappings,
        ]);
    }

    public function create()
    {
        $programVersions = ProgramVersion::query()
            ->active()
            ->orderBy('name', 'asc')
            ->limit(20)
            ->get(['id', 'name']);
        $programs = Program::query()
            ->with('certificationLevel:id,name')
            ->orderBy('name')
            ->limit(20)
            ->get(['id', 'code', 'name', 'certification_level_id'])
            ->map(fn ($program) => [
                'id' => $program->id,
                'name' => $program->display_name,
            ]);

        return inertia('ProgramVersionMappings/Create', [
            'programs' => $programs,
            'program_versions' => $programVersions,

        ]);
    }

    public function store(StoreProgramVersionMappingRequest $request)
    {
        $result = $this->service->create($request->validated());

        return redirect()
            ->route('programs.program-version-mappings.index')
            ->with($result['status'] ? 'success' : 'error', $result['message']);
    }

    public function edit(ProgramVersionMapping $programVersionMapping)
    {
        $programVersionMapping->load(['program:id,name', 'programVersion:id,name']);

        return inertia('ProgramVersionMappings/Edit', [
            'programVersionMapping' => $programVersionMapping,
            'programs' => Program::query()
                ->with('certificationLevel:id,name')
                ->orderBy('name')
                ->limit(20)
                ->get(['id', 'code', 'name', 'certification_level_id'])
                ->map(fn ($program) => [
                    'id' => $program->id,
                    'name' => $program->display_name,
                ]),
            'program_versions' => ProgramVersion::query()
                ->active()
                ->orderBy('name')
                ->limit(20)
                ->get(['id', 'name']),
        ]);
    }

    public function update(UpdateProgramVersionMappingRequest $request, ProgramVersionMapping $programVersionMapping)
    {
        $this->service->update($programVersionMapping, $request->validated());

        return redirect()
            ->route('programs.program-version-mappings.edit', $programVersionMapping->id)
            ->with('success', 'Program version mapping updated successfully.');
    }

    public function destroy(ProgramVersionMapping $programVersionMapping)
    {
        $result = $this->service->delete($programVersionMapping);

        return redirect()
            ->route('programs.program-version-mappings.index')
            ->with($result['status'] ? 'success' : 'error', $result['message']);
    }

    public function search(Request $request)
    {
        $q = $request->q;

        $programVersions = ProgramVersion::query()
            ->active()
            ->when($q, function ($query) use ($q) {
                $query->where('name', 'like', "{$q}%");
            })
            ->orderBy('name', 'asc')
            ->limit(10)
            ->get(['id', 'name']);

        return response()->json(
            $programVersions->map(fn ($programVersion) => [
                'id' => $programVersion->id,
                'name' => $programVersion->name,
            ])
        );
    }

    public function programSearch(Request $request)
    {
        $q = $request->q;

        $programs = Program::query()
            ->with('certificationLevel:id,name')
            ->when($q, function ($query) use ($q) {
                $query->where(function ($sub) use ($q) {
                    $sub->where('name', 'like', "%{$q}%")
                        ->orWhere('code', 'like', "%{$q}%");
                });
            })
            ->orderBy('name')
            ->limit(10)
            ->get(['id', 'name', 'code', 'certification_level_id'])
            ->map(fn ($program) => [
                'id' => $program->id,
                'name' => $program->display_name,
            ]);

        return response()->json($programs);
    }
}


