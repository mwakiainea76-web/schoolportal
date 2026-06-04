<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreCourseVersionUnitRequest;
use App\Http\Requests\UpdateCourseVersionUnitRequest;
use App\Models\CourseVersion;
use App\Models\CourseVersionMapping;
use App\Models\CourseVersionUnit;
use App\Services\CourseVersionUnitService;
use App\Services\StudentAcademicContextService;
use Illuminate\Http\Request;

class CourseVersionUnitController extends Controller
{
    public function __construct(
        protected CourseVersionUnitService $service,
        protected StudentAcademicContextService $studentAcademicContextService
    ) {}

    public function index(Request $request)
    {
        $filters = [
            'course_version_id' => (string) ($request->integer('course_version_id') ?: ''),
            'course_version_mapping_id' => (string) ($request->integer('course_version_mapping_id') ?: ''),
        ];
        $sortField = $request->string('sort')->toString();
        $sortDirection = $request->string('direction')->toString() === 'asc' ? 'asc' : 'desc';
        $allowedSorts = ['created_at', 'course_version_mapping_id', 'module_taught'];

        if (! in_array($sortField, $allowedSorts, true)) {
            $sortField = 'created_at';
        }

        $curriculum_units = CourseVersionUnit::with([
            'unit',
            'courseVersion.course',
            'courseVersionMapping.course',
            'courseVersionMapping.courseVersion',
        ])
            ->when($filters['course_version_id'] !== '', function ($query) use ($filters) {
                $query->where('course_version_id', $filters['course_version_id']);
            })
            ->when($filters['course_version_mapping_id'] !== '', function ($query) use ($filters) {
                $query->where('course_version_mapping_id', $filters['course_version_mapping_id']);
            })
            ->where(function ($query) {
                $query->whereHas('courseVersion', fn ($versionQuery) => $versionQuery->where('is_active', true))
                    ->orWhereHas('courseVersionMapping', fn ($mappingQuery) => $mappingQuery->where('is_active', true));
            })
            ->orderBy($sortField, $sortDirection)
            ->paginate(40)
            ->withQueryString();

        $selectedCourseVersion = $filters['course_version_id'] !== ''
            ? CourseVersion::query()->find($filters['course_version_id'], ['id', 'name'])
            : null;

        $selectedMapping = $filters['course_version_mapping_id'] !== ''
            ? CourseVersionMapping::query()
                ->with([
                    'course:id,name,code,certification_level_id',
                    'courseVersion:id,name',
                    'course.certificationLevel:id,name',
                ])
                ->find($filters['course_version_mapping_id'])
            : null;

        return inertia('CourseVersionUnits/Index', [
            'curriculum_units' => $curriculum_units,
            'filters' => $filters,
            'selected_course_version' => $selectedCourseVersion
                ? ['id' => $selectedCourseVersion->id, 'name' => $selectedCourseVersion->name]
                : null,
            'selected_course_version_mapping' => $selectedMapping
                ? [
                    'id' => $selectedMapping->id,
                    'name' => collect([
                        $selectedMapping->courseVersion?->name,
                        $selectedMapping->course?->display_name ?? $selectedMapping->course?->name,
                        $selectedMapping->course?->certificationLevel?->name,
                    ])->filter()->implode(' - '),
                ]
                : null,
        ]);
    }

    public function studentIndex(Request $request)
    {
        $student = $request->user()?->student;
        $courseEnrollment = $this->studentAcademicContextService->currentCourseEnrollmentForStudent($student);

        $units = $courseEnrollment
            ? CourseVersionUnit::query()
                ->with('unit:id,code,name,credit_factor,training_hours')
                ->when(
                    $courseEnrollment->course_version_id,
                    fn ($query) => $query->where('course_version_id', $courseEnrollment->course_version_id),
                    fn ($query) => $query->where('course_version_mapping_id', $courseEnrollment->course_version_mapping_id)
                )
                ->orderBy('module_taught')
                ->orderBy('id')
                ->get()
            : collect();

        return inertia('CourseVersionUnits/StudentIndex', [
            'course' => $courseEnrollment ? [
                'name' => $courseEnrollment->course?->name
                    ?? $courseEnrollment->courseVersionMapping?->course?->name,
                'version' => $courseEnrollment->courseVersion?->name
                    ?? $courseEnrollment->courseVersionMapping?->courseVersion?->name,
            ] : null,
            'units_by_module' => $units
                ->groupBy('module_taught')
                ->map(fn ($moduleUnits, $module) => [
                    'module' => (int) $module,
                    'units' => $moduleUnits->map(fn (CourseVersionUnit $courseVersionUnit) => [
                        'id' => $courseVersionUnit->id,
                        'code' => $courseVersionUnit->unit?->code,
                        'name' => $courseVersionUnit->unit?->name,
                        'credit_factor' => $courseVersionUnit->unit?->credit_factor,
                        'training_hours' => $courseVersionUnit->unit?->training_hours,
                    ])->values(),
                ])
                ->sortBy('module')
                ->values(),
        ]);
    }

    public function create()
    {
        return inertia('CourseVersionUnits/Create');
    }

    public function store(StoreCourseVersionUnitRequest $request)
    {
        $error = $this->service->store($request->validated());

        if ($error) {
            return to_route('units.course-version-units.create')->with('error', $error);
        }

        return to_route('units.course-version-units.create')
            ->with('success', 'CourseVersion unit created successfully.');
    }

    public function edit(CourseVersionUnit $curriculum_unit)
    {
        $curriculum_unit->load([
            'unit',
            'courseVersion.course',
            'courseVersionMapping.course',
            'courseVersionMapping.courseVersion',
        ]);

        return inertia('CourseVersionUnits/Edit', [
            'curriculum_unit' => $curriculum_unit,
        ]);
    }

    public function update(UpdateCourseVersionUnitRequest $request, CourseVersionUnit $curriculum_unit)
    {
        $error = $this->service->update($curriculum_unit, $request->validated());

        if ($error) {
            return to_route('units.course-version-units.edit', $curriculum_unit)
                ->with('error', $error);
        }

        return to_route('units.course-version-units.edit', $curriculum_unit)
            ->with('success', 'CourseVersion unit updated successfully.');
    }

    public function destroy(CourseVersionUnit $curriculum_unit)
    {
        $this->service->delete($curriculum_unit);

        return to_route('units.course-version-units.index')
            ->with('success', 'CourseVersion unit deleted successfully.');
    }
}
