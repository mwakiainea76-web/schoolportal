<?php

namespace App\Http\Controllers;

use App\Filters\CourseVersionFilter;
use App\Http\Requests\StoreCourseVersionRequest;
use App\Http\Requests\UpdateCourseVersionRequest;
use App\Models\CourseVersion;
use App\Services\CourseVersionService;
use Illuminate\Http\Request;

class CourseVersionController extends Controller
{
    public function __construct(
        protected CourseVersionService $service
    ) {}

    public function index(CourseVersionFilter $filter)
    {
        $curricula = CourseVersion::query()
            ->tap(fn ($query) => $filter->apply(
                $query,
                request()->only(['search', 'sort', 'direction'])
            ))
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return inertia('CourseVersions/Index', [
            'curricula' => $curricula,
            'course_versions' => $this->courseVersionOptions(),
        ]);
    }

    public function create()
    {
        return inertia('CourseVersions/Create');
    }

    public function store(StoreCourseVersionRequest $request)
    {
        $result = $this->service->store($request->validated());

        return redirect()
            ->route('course-versions.index')
            ->with($result['status'] ? 'success' : 'error', $result['message']);
    }

    public function show(CourseVersion $curriculum)
    {
        $curriculum->load('course.certificationLevel.examBody');

        return inertia('CourseVersions/Edit', [
            'curriculum' => $curriculum,
        ]);
    }

    public function edit(CourseVersion $curriculum)
    {
        $curriculum->load('course.certificationLevel.examBody');

        return inertia('CourseVersions/Edit', [
            'curriculum' => $curriculum,
        ]);
    }

    public function update(UpdateCourseVersionRequest $request, CourseVersion $curriculum)
    {
        $result = $this->service->update($curriculum, $request->validated());

        return redirect()
            ->route('course-versions.edit', $curriculum)
            ->with($result['status'] ? 'success' : 'error', $result['message']);
    }

    public function destroy(CourseVersion $curriculum)
    {
        $this->service->delete($curriculum);

        return redirect()
            ->route('course-versions.index')
            ->with('success', 'CourseVersion deleted successfully.');
    }

    public function search(Request $request)
    {
        $q = $request->q;

        $curricula = CourseVersion::query()
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

    protected function courseVersionOptions()
    {
        return CourseVersion::query()
            ->orderByDesc('id')
            ->get(['id', 'name'])
            ->map(fn (CourseVersion $courseVersion) => [
                'id' => $courseVersion->id,
                'name' => $courseVersion->name,
            ])
            ->values();
    }
}
