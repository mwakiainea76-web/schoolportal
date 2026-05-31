<?php

namespace App\Http\Controllers;

use App\Filters\ProgramFilter;
use App\Http\Requests\StoreProgramRequest;
use App\Http\Requests\UpdateProgramRequest;
use App\Models\CertificationLevel;
use App\Models\Program;
use App\Models\ProgramVersion;
use App\Models\Department;
use App\Services\ProgramService;
use Illuminate\Http\Request;

class ProgramController extends Controller
{
    protected $service;

    public function __construct(ProgramService $service)
    {
        $this->service = $service;
    }

    public function index(ProgramFilter $filter)
    {
        $programs = Program::query()
            ->with([
                'certificationLevel:id,name',
                'department:id,name',
                'curriculum',
            ])
            ->tap(fn ($query) => $filter->apply(
                $query,
                request()->only(['search', 'sort', 'direction'])
            ))
            ->latest('created_at')
            ->paginate(10)
            ->withQueryString()
            ->through(fn ($program) => [
                'id' => $program->id,
                'name' => $program->display_name,
                'code' => $program->code,
                'certification_level' => $program->certificationLevel?->name,
                'department' => $program->department?->name,
                'curriculum' => $program->curriculum?->name,
                'created_at' => $program->created_at,
            ]);

        return inertia('Programs/Index', [
            'programs' => $programs,
        ]);
    }

    public function create()
    {
        return inertia('Programs/Create', [
            'certification_levels' => CertificationLevel::with('examBody')->get(),
            'departments' => Department::all(),
            'program_versions' => ProgramVersion::all(),
        ]);
    }

    public function store(StoreProgramRequest $request)
    {
        $this->service->create($request->validated());

        return redirect()
            ->route('programs.create')
            ->with('success', 'Program created successfully.');
    }

    public function edit(Program $program)
    {
        return inertia('Programs/Edit', [
            'certification_levels' => CertificationLevel::with('examBody')->get(),
            'departments' => Department::select('id', 'name')->limit(20)->get(),
            'program_versions' => ProgramVersion::select('id', 'name')
                ->limit(20)
                ->get(),
            'program' => $program,
        ]);
    }

    public function update(UpdateProgramRequest $request, Program $program)
    {
        $this->service->update($program, $request->validated());

        return redirect()
            ->route('programs.edit', $program->id)
            ->with('success', 'Program updated successfully.');
    }

    public function destroy(Program $program)
    {
        $result = $this->service->delete($program);

        if (! $result['status']) {
            return redirect()
                ->route('programs.index')
                ->with('error', $result['message']);
        }

        return redirect()
            ->route('programs.index')
            ->with('success', $result['message']);
    }

    public function search(Request $request)
    {
        $limit = min(max((int) $request->integer('limit', 10), 1), 25);
        $departmentId = $request->integer('department_id') ?: null;
        $query = trim((string) $request->query('q', ''));
        $versionedOnly = $request->boolean('versioned_only');
        $plainName = $request->boolean('plain_name');

        $programs = Program::query()
            ->with('certificationLevel:id,name')
            ->when($departmentId, fn ($builder) => $builder->where('department_id', $departmentId))
            ->when($versionedOnly, function ($builder) {
                $builder->whereHas('programVersionMappings', function ($mappingQuery) {
                    $mappingQuery
                        ->where('is_active', true)
                        ->whereHas('programVersion', fn ($programVersionQuery) => $programVersionQuery->where('is_active', true))
                        ->whereHas('programVersionUnits');
                });
            })
            ->when($query !== '', function ($builder) use ($query) {
                $builder->where(function ($searchQuery) use ($query) {
                    $searchQuery
                        ->where('name', 'like', "%{$query}%")
                        ->orWhere('code', 'like', "%{$query}%");
                });
            })
            ->orderBy('name')
            ->limit($limit)
            ->get(['id', 'name', 'code', 'certification_level_id'])
            ->map(fn (Program $program) => [
                'id' => (string) $program->id,
                'name' => $plainName ? $program->name : $program->display_name,
            ])
            ->values();

        return response()->json($programs);
    }
}


