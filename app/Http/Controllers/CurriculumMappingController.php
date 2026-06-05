<?php

namespace App\Http\Controllers;

use App\Filters\CurriculumMappingFilter;
use App\Http\Requests\StoreCurriculumMappingRequest;
use App\Http\Requests\UpdateCurriculumMappingRequest;
use App\Models\ExamBody;
use App\Models\CurriculumMapping;
use App\Models\Curriculum;
use App\Services\CurriculumMappingService;
use Illuminate\Http\Request;

class CurriculumMappingController extends Controller
{
    public function __construct(
        protected CurriculumMappingService $service
    ) {}

    public function index(CurriculumMappingFilter $filter)
    {
        $curriculumMappings = CurriculumMapping::query()
            ->tap(fn ($query) => $filter->apply(
                $query,
                request()->only(['search', 'sort', 'direction'])
            ))
            ->latest()
            ->with(['course.certificationLevel.examBody', 'curriculum'])
            ->paginate(10)
            ->withQueryString();

        return inertia('CurriculumMappings/Index', [
            'curriculumMappings' => $curriculumMappings,
        ]);
    }

    public function create()
    {
        return inertia('CurriculumMappings/Create');
    }

    public function store(StoreCurriculumMappingRequest $request)
    {
        $result = $this->service->create($request->validated());

        return redirect()
            ->route('courses.curriculum-mappings.index')
            ->with($result['status'] ? 'success' : 'error', $result['message']);
    }

    public function edit(CurriculumMapping $curriculumMapping)
    {
        $curriculumMapping->load([
            'course:id,name,certification_level_id',
            'course.certificationLevel:id,name,exam_body_id',
            'course.certificationLevel.examBody:id,code,name',
            'curriculum:id,name',
        ]);

        return inertia('CurriculumMappings/Edit', [
            'curriculumMapping' => $curriculumMapping,
        ]);
    }

    public function update(UpdateCurriculumMappingRequest $request, CurriculumMapping $curriculumMapping)
    {
        $result = $this->service->update($curriculumMapping, $request->validated());

        return redirect()
            ->route('courses.curriculum-mappings.index')
            ->with($result['status'] ? 'success' : 'error', $result['message']);
    }

    public function activate(CurriculumMapping $curriculumMapping)
    {
        $result = $this->service->activate($curriculumMapping);

        return redirect()
            ->route('courses.curriculum-mappings.index')
            ->with($result['status'] ? 'success' : 'error', $result['message']);
    }

    public function deactivate(CurriculumMapping $curriculumMapping)
    {
        $result = $this->service->deactivate($curriculumMapping);

        return redirect()
            ->route('courses.curriculum-mappings.index')
            ->with($result['status'] ? 'success' : 'error', $result['message']);
    }

    public function destroy(CurriculumMapping $curriculumMapping)
    {
        $result = $this->service->delete($curriculumMapping);

        return redirect()
            ->route('courses.curriculum-mappings.index')
            ->with($result['status'] ? 'success' : 'error', $result['message']);
    }

    public function search(Request $request)
    {
        $q = $request->q;

        $curriculums = Curriculum::query()
            ->when($q, function ($query) use ($q) {
                $query->where('name', 'like', "{$q}%");
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

    public function courseSearch(Request $request)
    {
        $q = $request->q;

        $examBodies = ExamBody::query()
            ->when($q, function ($query) use ($q) {
                $query->where(function ($sub) use ($q) {
                    $sub->where('name', 'like', "%{$q}%")
                        ->orWhere('code', 'like', "%{$q}%");
                });
            })
            ->orderBy('code')
            ->limit(10)
            ->get(['id', 'name', 'code'])
            ->map(fn ($examBody) => [
                'id' => $examBody->id,
                'name' => trim($examBody->code.' - '.$examBody->name, ' -'),
            ]);

        return response()->json($examBodies);
    }

}
