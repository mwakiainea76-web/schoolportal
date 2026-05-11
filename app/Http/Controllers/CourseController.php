<?php

namespace App\Http\Controllers;

use App\Filters\CourseFilter;
use App\Http\Requests\StoreCourseRequest;
use App\Http\Requests\UpdateCourseRequest;
use App\Models\CertificationLevel;
use App\Models\Course;
use App\Models\Curriculum;
use App\Models\Department;
use App\Services\CourseService;
use Illuminate\Http\Request;

class CourseController extends Controller
{
    protected $service;

    public function __construct(CourseService $service)
    {
        $this->service = $service;
    }

    public function index(CourseFilter $filter)
    {
        $courses = Course::query()
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
            ->through(fn ($course) => [
                'id' => $course->id,
                'name' => $course->display_name,
                'code' => $course->code,
                'department' => $course->department?->name,
                'curriculum' => $course->curriculum?->name,
            ]);

        return inertia('Courses/Index', [
            'courses' => $courses,
        ]);
    }

    public function create()
    {
        return inertia('Courses/Create', [
            'certification_levels' => CertificationLevel::with('examBody')->get(),
            'departments' => Department::all(),
            'curriculums' => Curriculum::all(),
        ]);
    }

    public function store(StoreCourseRequest $request)
    {
        $this->service->create($request->validated());

        return redirect()
            ->route('courses.create')
            ->with('success', 'Course created successfully.');
    }

    public function edit(Course $course)
    {
        return inertia('Courses/Edit', [
            'certification_levels' => CertificationLevel::with('examBody')->get(),
            'departments' => Department::select('id', 'name')->limit(20)->get(),
            'curriculums' => Curriculum::select('id', 'name')
                ->limit(20)
                ->get(),
            'course' => $course,
        ]);
    }

    public function update(UpdateCourseRequest $request, Course $course)
    {
        $this->service->update($course, $request->validated());

        return redirect()
            ->route('courses.edit', $course->id)
            ->with('success', 'Course updated successfully.');
    }

    public function destroy(Course $course)
    {
        $result = $this->service->delete($course);

        if (! $result['status']) {
            return redirect()
                ->route('courses.index')
                ->with('error', $result['message']);
        }

        return redirect()
            ->route('courses.index')
            ->with('success', $result['message']);
    }

    public function search(Request $request)
    {
        return response()->json(
            $this->service->search($request->q)
        );
    }
}
