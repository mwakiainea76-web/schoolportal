<?php

namespace App\Http\Controllers;

use App\Filters\CourseVersionMappingFilter;
use App\Http\Requests\StoreCourseVersionMappingRequest;
use App\Http\Requests\UpdateCourseVersionMappingRequest;
use App\Models\ExamBody;
use App\Models\CourseVersionMapping;
use App\Models\CourseVersion;
use App\Services\CourseVersionMappingService;
use Illuminate\Http\Request;

class CourseVersionMappingController extends Controller
{
    public function __construct(
        protected CourseVersionMappingService $service
    ) {}

    public function index(CourseVersionMappingFilter $filter)
    {
        $courseVersionMappings = CourseVersionMapping::query()
            ->tap(fn ($query) => $filter->apply(
                $query,
                request()->only(['search', 'sort', 'direction'])
            ))
            ->latest()
            ->with(['course.certificationLevel.examBody', 'courseVersion'])
            ->paginate(10)
            ->withQueryString();

        return inertia('CourseVersionMappings/Index', [
            'courseVersionMappings' => $courseVersionMappings,
        ]);
    }

    public function create()
    {
        return inertia('CourseVersionMappings/Create');
    }

    public function store(StoreCourseVersionMappingRequest $request)
    {
        $result = $this->service->create($request->validated());

        return redirect()
            ->route('courses.course-version-mappings.index')
            ->with($result['status'] ? 'success' : 'error', $result['message']);
    }

    public function edit(CourseVersionMapping $courseVersionMapping)
    {
        $courseVersionMapping->load([
            'course:id,name,certification_level_id',
            'course.certificationLevel:id,name,exam_body_id',
            'course.certificationLevel.examBody:id,code,name',
            'courseVersion:id,name',
        ]);

        return inertia('CourseVersionMappings/Edit', [
            'courseVersionMapping' => $courseVersionMapping,
        ]);
    }

    public function update(UpdateCourseVersionMappingRequest $request, CourseVersionMapping $courseVersionMapping)
    {
        $result = $this->service->update($courseVersionMapping, $request->validated());

        return redirect()
            ->route('courses.course-version-mappings.index')
            ->with($result['status'] ? 'success' : 'error', $result['message']);
    }

    public function destroy(CourseVersionMapping $courseVersionMapping)
    {
        $result = $this->service->delete($courseVersionMapping);

        return redirect()
            ->route('courses.course-version-mappings.index')
            ->with($result['status'] ? 'success' : 'error', $result['message']);
    }

    public function search(Request $request)
    {
        $q = $request->q;

        $courseVersions = CourseVersion::query()
            ->when($q, function ($query) use ($q) {
                $query->where('name', 'like', "{$q}%");
            })
            ->orderBy('name', 'asc')
            ->limit(10)
            ->get(['id', 'name']);

        return response()->json(
            $courseVersions->map(fn ($courseVersion) => [
                'id' => $courseVersion->id,
                'name' => $courseVersion->name,
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
