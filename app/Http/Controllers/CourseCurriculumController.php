<?php

namespace App\Http\Controllers;

use App\Filters\CourseCurriculumFilter;
use App\Http\Requests\StoreCourseCurriculumRequest;
use App\Http\Requests\UpdateCourseCurriculumRequest;
use App\Models\Course;
use App\Models\CourseCurriculum;
use App\Models\Curriculum;
use App\Services\CourseCurriculumService;
use Illuminate\Http\Request;

class CourseCurriculumController extends Controller
{
    public function __construct(
        protected CourseCurriculumService $service
    ) {}

    public function index(CourseCurriculumFilter $filter)
    {
        $curriculums = CourseCurriculum::query()
            ->tap(fn ($query) => $filter->apply(
                $query,
                request()->only(['search', 'sort', 'direction'])
            ))
            ->latest()
            ->with(['course', 'curriculum'])
            ->paginate(10)
            ->withQueryString();

        return inertia('CourseCurriculum/Index', [
            'curriculum' => $curriculums,
        ]);
    }

    public function create()
    {
        $curriculums = Curriculum::query()
            ->active()
            ->orderBy('name', 'asc')
            ->limit(20)
            ->get(['id', 'name']);
        $courses = Course::query()
            ->active()
            ->with('certificationLevel:id,name')
            ->orderBy('name')
            ->limit(20)
            ->get(['id', 'code', 'name', 'certification_level_id'])
            ->map(fn ($course) => [
                'id' => $course->id,
                'name' => $course->display_name,
            ]);

        return inertia('CourseCurriculum/Create', [
            'courses' => $courses,
            'curriculums' => $curriculums,

        ]);
    }

    public function store(StoreCourseCurriculumRequest $request)
    {
        $result = $this->service->create($request->validated());

        return redirect()
            ->route('courses.curriculum.index')
            ->with($result['status'] ? 'success' : 'error', $result['message']);
    }

    public function edit(CourseCurriculum $curriculum)
    {
        $curriculum->load(['course:id,name', 'curriculum:id,name']);

        return inertia('CourseCurriculum/Edit', [
            'curriculum' => $curriculum,
            'courses' => Course::query()
                ->active()
                ->with('certificationLevel:id,name')
                ->orderBy('name')
                ->limit(20)
                ->get(['id', 'code', 'name', 'certification_level_id'])
                ->map(fn ($course) => [
                    'id' => $course->id,
                    'name' => $course->display_name,
                ]),
            'curriculums' => Curriculum::query()
                ->active()
                ->orderBy('name')
                ->limit(20)
                ->get(['id', 'name']),
        ]);
    }

    public function update(UpdateCourseCurriculumRequest $request, CourseCurriculum $curriculum)
    {
        $this->service->update($curriculum, $request->validated());

        return redirect()
            ->route('courses.curriculum.edit', $curriculum->id)
            ->with('success', 'Curriculum updated successfully.');
    }

    public function destroy(CourseCurriculum $curriculum)
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
            ->active()
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

        $courses = Course::query()
            ->active()
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
            ->map(fn ($course) => [
                'id' => $course->id,
                'name' => $course->display_name,
            ]);

        return response()->json($courses);
    }
}
