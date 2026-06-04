<?php

namespace App\Http\Controllers;

use App\Models\AcademicSession;
use App\Http\Requests\StoreAcademicTimetableRequest;
use App\Http\Requests\StoreHodAcademicTimetableRequest;
use App\Http\Requests\UpdateAcademicTimetableRequest;
use App\Models\AcademicTimetable;
use App\Models\Department;
use App\Models\LectureRoom;
use App\Models\CourseVersionMapping;
use App\Models\CourseVersionUnit;
use App\Models\Staff;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class AcademicTimetableController extends Controller
{
    protected array $dayOrder = [
        'monday',
        'tuesday',
        'wednesday',
        'thursday',
        'friday',
        'saturday',
        'sunday',
    ];

    public function index(Request $request)
    {
        $currentDepartmentId = $request->user()?->staff?->department_id;
        $isHod = (bool) $request->user()?->hasRole('hod');
        $isTrainer = (bool) $request->user()?->hasRole('trainer');
        $isTrainerOnly = $isTrainer && ! $isHod && ! $request->user()?->hasRole('admin');
        $currentTrainerStaffId = $request->user()?->staff?->id;
        $supportsAcademicSessions = $this->supportsAcademicSessionScoping();
        $currentSession = $supportsAcademicSessions ? $this->currentAcademicSession() : null;
        $selectedAcademicSessionId = $supportsAcademicSessions && $request->filled('academic_session_id')
            ? $request->integer('academic_session_id')
            : $currentSession?->id;
        $selectedDepartmentId = ($isHod || $isTrainerOnly)
            ? $currentDepartmentId
            : ($request->filled('department_id') ? $request->integer('department_id') : null);
        $selectedTrainerStaffId = $isTrainerOnly
            ? $currentTrainerStaffId
            : ($request->integer('trainer_staff_id') ?: null);
        $selectedCourseVersionMappingId = $request->integer('course_version_mapping_id') ?: null;
        $selectedModuleNumber = $request->integer('module_number') ?: null;
        $adminClassFiltersReady = (bool) ($selectedDepartmentId && $selectedCourseVersionMappingId && $selectedModuleNumber);
        $adminTrainerFiltersReady = (bool) ($selectedDepartmentId && $selectedTrainerStaffId);
        $shouldLoadTimetable = ($isHod || $isTrainerOnly)
            ? (bool) ($selectedDepartmentId && $selectedAcademicSessionId)
            : (bool) ($selectedAcademicSessionId && ($adminClassFiltersReady || $adminTrainerFiltersReady));

        $query = $this->baseQuery();

        if ($supportsAcademicSessions && $selectedAcademicSessionId) {
            $query->where('academic_session_id', $selectedAcademicSessionId);
        }

        if ($shouldLoadTimetable && $selectedDepartmentId) {
            $query->where('department_id', $selectedDepartmentId);
        }

        if ($shouldLoadTimetable && $selectedTrainerStaffId) {
            $query->where('trainer_staff_id', $selectedTrainerStaffId);
        }

        if ($shouldLoadTimetable && $request->filled('course_version_unit_id')) {
            $courseVersionUnitId = $request->integer('course_version_unit_id');
            $query->whereHas('courseVersionUnits', function ($builder) use ($courseVersionUnitId) {
                $builder->where('course_version_units.id', $courseVersionUnitId);
            });
        }

        if ($shouldLoadTimetable && $selectedCourseVersionMappingId) {
            $query->whereHas('courseVersionUnits', function ($builder) use ($selectedCourseVersionMappingId) {
                $builder->where('course_version_units.course_version_mapping_id', $selectedCourseVersionMappingId);
            });
        }

        if ($shouldLoadTimetable && $selectedModuleNumber) {
            $query->whereHas('courseVersionUnits', function ($builder) use ($selectedModuleNumber) {
                $builder->where('course_version_units.module_taught', $selectedModuleNumber);
            });
        }

        if ($shouldLoadTimetable && $request->filled('day_of_week')) {
            $query->where('day_of_week', $request->string('day_of_week')->toString());
        }

        $boardEntries = $shouldLoadTimetable
            ? (clone $query)
                ->orderByRaw($this->dayOrderCaseSql())
                ->orderBy('start_time')
                ->get()
            : collect();

        $boardRows = collect($this->dayOrder)->map(function (string $day) use ($boardEntries) {
            $daySessions = $boardEntries
                ->where('day_of_week', $day)
                ->sortBy('start_time')
                ->map(fn (AcademicTimetable $entry) => $this->transformTimetable($entry))
                ->values();

            return [
                'day' => $day,
                'label' => ucfirst($day),
                'sessions' => $daySessions,
            ];
        })->values();

        $lessonColumns = $boardRows
            ->flatMap(fn ($row) => $row['sessions'])
            ->map(fn ($session) => [
                'key' => $session['start_time'].'-'.$session['end_time'],
                'start_time' => $session['start_time'],
                'end_time' => $session['end_time'],
                'label' => $session['time_range'],
            ])
            ->unique('key')
            ->sortBy(fn ($lesson) => $lesson['start_time'].'-'.$lesson['end_time'])
            ->values();

        $weeklyGrid = $boardRows->map(function ($row) use ($lessonColumns) {
            $sessionGroups = collect($row['sessions'])->groupBy(
                fn ($session) => $session['start_time'].'-'.$session['end_time']
            );

            return [
                'day' => $row['day'],
                'label' => $row['label'],
                'lessons' => $lessonColumns->map(fn ($lesson) => [
                    'key' => $lesson['key'],
                    'sessions' => $sessionGroups->get($lesson['key'], collect())->values(),
                ])->values(),
            ];
        })->values();

        return inertia('Academic/Timetables/Index', [
            'weekly_board' => $boardRows,
            'weekly_grid' => $weeklyGrid,
            'lesson_columns' => $lessonColumns,
            'filters' => [
                'academic_session_id' => $supportsAcademicSessions && $selectedAcademicSessionId ? (string) $selectedAcademicSessionId : '',
                'department_id' => $selectedDepartmentId ? (string) $selectedDepartmentId : '',
                'trainer_staff_id' => $selectedTrainerStaffId ? (string) $selectedTrainerStaffId : '',
                'course_version_unit_id' => $request->filled('course_version_unit_id') ? (string) $request->integer('course_version_unit_id') : '',
                'course_version_mapping_id' => $selectedCourseVersionMappingId ? (string) $selectedCourseVersionMappingId : '',
                'module_number' => $selectedModuleNumber ? (string) $selectedModuleNumber : '',
                'day_of_week' => $request->string('day_of_week')->toString(),
            ],
            'session_options' => $supportsAcademicSessions ? $this->sessionOptions() : [],
            'departments' => $this->departmentOptions(),
            'trainers' => $this->trainerOptions($selectedDepartmentId),
            'course_version_units' => $this->courseVersionUnitOptions($selectedDepartmentId),
            'course_options' => $selectedDepartmentId ? $this->hodcourseOptions((int) $selectedDepartmentId, $selectedCourseVersionMappingId) : [],
            'module_options' => ($selectedDepartmentId && $selectedCourseVersionMappingId)
                ? $this->hodModuleOptions((int) $selectedDepartmentId, $selectedCourseVersionMappingId)
                : [],
            'days' => $this->dayOptions(),
            'current_department_id' => $currentDepartmentId ? (string) $currentDepartmentId : '',
            'is_hod' => $isHod,
            'is_trainer' => $isTrainerOnly,
            'should_load_timetable' => $shouldLoadTimetable,
            'current_session_note' => ! $supportsAcademicSessions
                ? 'Timetable session scoping is not available yet in this database. Run the latest migration to enable academic-session filtering.'
                : ($selectedAcademicSessionId
                ? ($currentSession && (int) $selectedAcademicSessionId === (int) $currentSession->id
                    ? 'Showing timetable for the current running session: '.$currentSession->display_name.'.'
                    : 'Showing timetable for the selected academic session.')
                : 'No academic session is available, so timetable results cannot load yet.'),
        ]);
    }

    public function create(Request $request)
    {
        $currentDepartmentId = $request->user()?->staff?->department_id;
        $selectedDepartmentId = $request->integer('department_id') ?: $currentDepartmentId;

        return inertia('Academic/Timetables/Create', [
            'departments' => $this->departmentOptions(),
            'trainers' => $this->trainerOptions(),
            'lecture_rooms' => $this->lectureRoomOptions(),
            'course_version_units' => $this->courseVersionUnitOptions(),
            'days' => $this->dayOptions(),
            'current_department_id' => $currentDepartmentId ? (string) $currentDepartmentId : '',
            'selected_department_id' => $selectedDepartmentId ? (string) $selectedDepartmentId : '',
        ]);
    }

    public function store(StoreAcademicTimetableRequest $request)
    {
        $validated = $request->validated();
        $actorStaffId = $request->user()?->staff?->id;

        abort_unless($this->supportsAcademicSessionScoping(), 500, 'The timetable session migration has not been run yet.');
        $currentSession = $this->currentAcademicSession();

        abort_unless($currentSession, 422, 'No active academic session is available for timetable allocation.');

        $this->persistTimetableSessions($validated, $actorStaffId, $currentSession->id);

        return to_route('academic.timetables.index', [
            'department_id' => $validated['department_id'],
        ])->with('success', 'Timetable sessions created successfully.');
    }

    public function createHod(Request $request)
    {
        abort_unless($request->user()?->hasRole('hod'), 403);

        $department = $request->user()?->staff?->department;
        abort_unless($department, 403, 'Your staff profile is not linked to a department.');

        $selectedCourseVersionMappingId = $request->integer('course_version_mapping_id') ?: null;
        $selectedModuleNumber = $request->integer('module_number') ?: null;

        return inertia('Academic/Timetables/CreateHod', [
            'department' => [
                'id' => (string) $department->id,
                'name' => $department->name,
            ],
            'course_options' => $this->hodcourseOptions((int) $department->id, $selectedCourseVersionMappingId),
            'modules' => $this->hodModuleOptions((int) $department->id, $selectedCourseVersionMappingId),
            'available_units' => $this->hodAvailableUnitOptions(
                (int) $department->id,
                $selectedCourseVersionMappingId,
                $selectedModuleNumber
            ),
            'trainers' => $this->trainerOptions((int) $department->id),
            'lecture_rooms' => $this->lectureRoomOptions((int) $department->id),
            'days' => $this->dayOptions(),
            'filters' => [
                'course_version_mapping_id' => $selectedCourseVersionMappingId ? (string) $selectedCourseVersionMappingId : '',
                'module_number' => $selectedModuleNumber ? (string) $selectedModuleNumber : '',
            ],
        ]);
    }

    public function storeHod(StoreHodAcademicTimetableRequest $request)
    {
        $validated = $request->validated();
        $actorStaffId = $request->user()?->staff?->id;

        abort_unless($this->supportsAcademicSessionScoping(), 500, 'The timetable session migration has not been run yet.');
        $currentSession = $this->currentAcademicSession();

        abort_unless($currentSession, 422, 'No active academic session is available for timetable allocation.');

        $this->persistTimetableSessions($validated, $actorStaffId, $currentSession->id);

        return to_route('academic.timetables.hod.create', [
            'course_version_mapping_id' => $validated['course_version_mapping_id'],
            'module_number' => $validated['module_number'],
        ])->with('success', 'Timetable sessions created successfully.');
    }

    public function searchHodcourses(Request $request)
    {
        abort_unless($request->user()?->hasRole('hod'), 403);

        $departmentId = (int) ($request->user()?->staff?->department_id ?? 0);
        abort_unless($departmentId > 0, 403, 'Your staff profile is not linked to a department.');

        $limit = min(max($request->integer('limit', 4), 1), 25);
        $query = trim((string) $request->query('q', ''));

        return response()->json(
            CourseVersionMapping::query()
                ->with([
                    'course:id,name,department_id',
                    'courseVersion:id,name,is_active',
                ])
                ->where('is_active', true)
                ->whereHas('course', fn ($courseQuery) => $courseQuery->where('department_id', $departmentId))
                ->whereHas('courseVersion', fn ($courseVersionQuery) => $courseVersionQuery->where('is_active', true))
                ->whereHas('courseVersionUnits')
                ->when($query !== '', function ($builder) use ($query) {
                    $builder->where(function ($mappingQuery) use ($query) {
                        $mappingQuery
                            ->whereHas('course', fn ($courseQuery) => $courseQuery
                                ->where('name', 'like', "%{$query}%")
                                ->orWhere('code', 'like', "%{$query}%"))
                            ->orWhereHas('courseVersion', fn ($courseVersionQuery) => $courseVersionQuery
                                ->where('name', 'like', "%{$query}%"));
                    });
                })
                ->latest('course_version_mappings.id')
                ->limit($limit)
                ->get(['id', 'course_id', 'course_version_id'])
                ->map(fn (CourseVersionMapping $mapping) => [
                    'id' => (string) $mapping->id,
                    'name' => trim(($mapping->courseVersion?->name ?? '').' - '.($mapping->course?->name ?? ''), ' -'),
                ])
                ->values()
        );
    }

    public function searchcourseMappings(Request $request)
    {
        $departmentId = $request->integer('department_id')
            ?: (int) ($request->user()?->hasRole('hod') ? ($request->user()?->staff?->department_id ?? 0) : 0);

        abort_unless($departmentId > 0, 422, 'A department must be selected before searching versioned courses.');

        $limit = min(max($request->integer('limit', 4), 1), 25);
        $query = trim((string) $request->query('q', ''));

        return response()->json(
            CourseVersionMapping::query()
                ->with([
                    'course:id,name,department_id',
                    'courseVersion:id,name,is_active',
                ])
                ->where('is_active', true)
                ->whereHas('course', fn ($courseQuery) => $courseQuery->where('department_id', $departmentId))
                ->whereHas('courseVersion', fn ($courseVersionQuery) => $courseVersionQuery->where('is_active', true))
                ->whereHas('courseVersionUnits')
                ->when($query !== '', function ($builder) use ($query) {
                    $builder->where(function ($mappingQuery) use ($query) {
                        $mappingQuery
                            ->whereHas('course', fn ($courseQuery) => $courseQuery
                                ->where('name', 'like', "%{$query}%")
                                ->orWhere('code', 'like', "%{$query}%"))
                            ->orWhereHas('courseVersion', fn ($courseVersionQuery) => $courseVersionQuery
                                ->where('name', 'like', "%{$query}%"));
                    });
                })
                ->latest('course_version_mappings.id')
                ->limit($limit)
                ->get(['id', 'course_id', 'course_version_id'])
                ->map(fn (CourseVersionMapping $mapping) => [
                    'id' => (string) $mapping->id,
                    'name' => trim(($mapping->courseVersion?->name ?? '').' - '.($mapping->course?->name ?? ''), ' -'),
                ])
                ->values()
        );
    }

    public function edit(AcademicTimetable $timetable)
    {
        $timetable->load([
            'department:id,name',
            'trainer.user:id,first_name,last_name',
            'lectureRoom:id,name,code,department_id',
            'courseVersionUnit.unit:id,name,code',
            'courseVersionUnits.unit:id,name,code',
            'courseVersionUnits.courseVersionMapping.course:id,name,department_id',
            'courseVersionUnits.courseVersionMapping.courseVersion:id,name',
            'courseVersionUnit.courseVersionMapping.course:id,name,department_id',
            'courseVersionUnit.courseVersionMapping.courseVersion:id,name',
        ]);

        return inertia('Academic/Timetables/Edit', [
            'timetable' => $this->transformTimetable($timetable),
            'departments' => $this->departmentOptions(),
            'trainers' => $this->trainerOptions(),
            'lecture_rooms' => $this->lectureRoomOptions(),
            'course_version_units' => $this->courseVersionUnitOptions(),
            'days' => $this->dayOptions(),
        ]);
    }

    public function update(UpdateAcademicTimetableRequest $request, AcademicTimetable $timetable)
    {
        $validated = $request->validated();

        $timetable->update([
            'department_id' => $validated['department_id'],
            'course_version_unit_id' => $validated['course_version_unit_ids'][0],
            'trainer_staff_id' => $validated['trainer_staff_id'],
            'lecture_room_id' => $validated['lecture_room_id'],
            'day_of_week' => $validated['day_of_week'],
            'start_time' => $validated['start_time'],
            'end_time' => $validated['end_time'],
            'updated_by' => $request->user()?->staff?->id,
        ]);
        $timetable->courseVersionUnits()->sync($validated['course_version_unit_ids']);

        return to_route('academic.timetables.index', [
            'department_id' => $validated['department_id'],
        ])->with('success', 'Timetable session updated successfully.');
    }

    public function destroy(AcademicTimetable $timetable)
    {
        $departmentId = $timetable->department_id;
        $timetable->delete();

        return to_route('academic.timetables.index', [
            'department_id' => $departmentId,
        ])->with('success', 'Timetable session removed successfully.');
    }

    protected function baseQuery()
    {
        return AcademicTimetable::query()->with([
            'academicSession:id,academic_year_id,session_number,session_No,label,is_active',
            'department:id,name',
            'trainer.user:id,first_name,last_name',
            'lectureRoom:id,name,code,department_id',
            'courseVersionUnit.unit:id,name,code',
            'courseVersionUnits.unit:id,name,code',
            'courseVersionUnits.courseVersionMapping.course:id,name,department_id',
            'courseVersionUnits.courseVersionMapping.courseVersion:id,name',
            'courseVersionUnit.courseVersionMapping.course:id,name,department_id',
            'courseVersionUnit.courseVersionMapping.courseVersion:id,name',
        ]);
    }

    protected function transformTimetable(AcademicTimetable $entry): array
    {
        return [
            'id' => $entry->id,
            'department_id' => (string) $entry->department_id,
            'department_name' => $entry->department?->name,
            'academic_session_id' => $entry->academic_session_id ? (string) $entry->academic_session_id : '',
            'academic_session_name' => $entry->academicSession?->display_name,
            'course_version_unit_id' => (string) $entry->course_version_unit_id,
            'course_version_unit_ids' => $entry->courseVersionUnits->pluck('id')->map(fn ($id) => (string) $id)->values()->all(),
            'trainer_staff_id' => (string) $entry->trainer_staff_id,
            'trainer_name' => trim(($entry->trainer?->user?->last_name ?? '').' '.($entry->trainer?->user?->first_name ?? '')),
            'trainer_staff_number' => $entry->trainer?->staff_number,
            'lecture_room_id' => $entry->lecture_room_id ? (string) $entry->lecture_room_id : '',
            'lecture_room_name' => $entry->lectureRoom?->name,
            'lecture_room_code' => $entry->lectureRoom?->code,
            'day_of_week' => $entry->day_of_week,
            'day_label' => ucfirst($entry->day_of_week),
            'start_time' => substr((string) $entry->start_time, 0, 5),
            'end_time' => substr((string) $entry->end_time, 0, 5),
            'time_range' => substr((string) $entry->start_time, 0, 5).' - '.substr((string) $entry->end_time, 0, 5),
            'unit_name' => $entry->courseVersionUnit?->unit?->name,
            'unit_code' => $entry->courseVersionUnit?->unit?->code,
            'module_taught' => $entry->courseVersionUnit?->module_taught,
            'course_name' => $entry->courseVersionUnit?->courseVersionMapping?->course?->name,
            'course_version_name' => $entry->courseVersionUnit?->courseVersionMapping?->courseVersion?->name,
            'merged_units' => $entry->courseVersionUnits
                ->map(fn (CourseVersionUnit $unit) => [
                    'id' => (string) $unit->id,
                    'name' => $unit->unit?->name,
                    'code' => $unit->unit?->code,
                    'course_name' => $unit->courseVersionMapping?->course?->name,
                    'course_version_name' => $unit->courseVersionMapping?->courseVersion?->name,
                    'module_taught' => $unit->module_taught,
                    'display_name' => ($unit->courseVersionMapping?->courseVersion?->name ?? '').
                        ' / '.
                        ($unit->courseVersionMapping?->course?->name ?? '').
                        ' / Module '.
                        ($unit->module_taught ?? '').
                        ' / '.
                        ($unit->unit?->code ?? '').
                        ' - '.
                        ($unit->unit?->name ?? ''),
                ])
                ->values()
                ->all(),
            'curriculum_unit_name' => trim(
                ($entry->courseVersionUnit?->courseVersionMapping?->courseVersion?->name ?? '').
                ' / '.
                ($entry->courseVersionUnit?->courseVersionMapping?->course?->name ?? '').
                ' / Module '.
                ($entry->courseVersionUnit?->module_taught ?? '').
                ' / '.
                ($entry->courseVersionUnit?->unit?->code ?? '').
                ' - '.
                ($entry->courseVersionUnit?->unit?->name ?? '')
            ),
        ];
    }

    protected function departmentOptions(): array
    {
        return Department::query()
            ->orderBy('name')
            ->get(['id', 'name'])
            ->map(fn (Department $department) => [
                'id' => (string) $department->id,
                'name' => $department->name,
            ])
            ->values()
            ->all();
    }

    protected function trainerOptions(?int $departmentId = null): array
    {
        return Staff::query()
            ->with('user:id,first_name,last_name')
            ->when($departmentId, fn ($query) => $query->where('department_id', $departmentId))
            ->where('staff_status', 'active')
            ->get()
            ->sortBy(fn (Staff $staff) => trim(($staff->user?->last_name ?? '').' '.($staff->user?->first_name ?? '')))
            ->map(fn (Staff $staff) => [
                'id' => (string) $staff->id,
                'name' => trim(($staff->user?->last_name ?? '').' '.($staff->user?->first_name ?? '')).' ('.$staff->staff_number.')',
                'department_id' => (string) $staff->department_id,
            ])
            ->values()
            ->all();
    }

    protected function courseVersionUnitOptions(?int $departmentId = null): array
    {
        return CourseVersionUnit::query()
            ->with([
                'unit:id,name,code',
                'courseVersionMapping.course:id,name,department_id',
                'courseVersionMapping.courseVersion:id,name',
            ])
            ->when($departmentId, function ($query, $departmentId) {
                $query->whereHas('courseVersionMapping.course', fn ($courseQuery) => $courseQuery->where('department_id', $departmentId));
            })
            ->get()
            ->map(fn (CourseVersionUnit $unit) => [
                'id' => (string) $unit->id,
                'name' => ($unit->courseVersionMapping?->courseVersion?->name ?? 'No Version').
                    ' / '.
                    ($unit->courseVersionMapping?->course?->name ?? 'No Course').
                    ' / Module '.
                    ($unit->module_taught ?? '').
                    ' / '.
                    ($unit->unit?->code ?? '').
                    ' - '.
                    ($unit->unit?->name ?? 'No Unit'),
                'department_id' => (string) ($unit->courseVersionMapping?->course?->department_id ?? ''),
            ])
            ->sortBy('name')
            ->values()
            ->all();
    }

    protected function lectureRoomOptions(?int $departmentId = null): array
    {
        return LectureRoom::query()
            ->when($departmentId, fn ($query) => $query->where('department_id', $departmentId))
            ->where('is_active', true)
            ->orderBy('name')
            ->get()
            ->map(fn (LectureRoom $room) => [
                'id' => (string) $room->id,
                'name' => trim($room->code.' - '.$room->name.($room->capacity ? ' (Cap '.$room->capacity.')' : '')),
                'department_id' => (string) $room->department_id,
            ])
            ->values()
            ->all();
    }

    protected function dayOptions(): array
    {
        return collect($this->dayOrder)
            ->map(fn (string $day) => [
                'id' => $day,
                'name' => ucfirst($day),
            ])
            ->values()
            ->all();
    }

    protected function dayOrderCaseSql(): string
    {
        $cases = collect($this->dayOrder)
            ->map(fn (string $day, int $index) => "WHEN '{$day}' THEN {$index}")
            ->implode(' ');

        return "CASE day_of_week {$cases} ELSE 99 END";
    }

    protected function hodcourseOptions(int $departmentId, ?int $selectedCourseVersionMappingId = null): array
    {
        $defaultcourses = CourseVersionMapping::query()
            ->with([
                'course:id,name,department_id',
                'courseVersion:id,name,is_active',
            ])
            ->where('is_active', true)
            ->whereHas('course', fn ($courseQuery) => $courseQuery->where('department_id', $departmentId))
            ->whereHas('courseVersion', fn ($courseVersionQuery) => $courseVersionQuery->where('is_active', true))
            ->whereHas('courseVersionUnits')
            ->latest('course_version_mappings.id')
            ->limit(4)
            ->get(['id', 'course_id', 'course_version_id']);

        if (
            $selectedCourseVersionMappingId
            && ! $defaultcourses->contains(fn (CourseVersionMapping $mapping) => (int) $mapping->id === $selectedCourseVersionMappingId)
        ) {
            $selectedcourse = CourseVersionMapping::query()
                ->with([
                    'course:id,name,department_id',
                    'courseVersion:id,name,is_active',
                ])
                ->where('is_active', true)
                ->whereHas('course', fn ($courseQuery) => $courseQuery->where('department_id', $departmentId))
                ->whereHas('courseVersion', fn ($courseVersionQuery) => $courseVersionQuery->where('is_active', true))
                ->whereHas('courseVersionUnits')
                ->where('id', $selectedCourseVersionMappingId)
                ->first(['id', 'course_id', 'course_version_id']);

            if ($selectedcourse) {
                $defaultcourses->prepend($selectedcourse);
            }
        }

        return $defaultcourses
            ->unique('id')
            ->map(fn (CourseVersionMapping $mapping) => [
                'id' => (string) $mapping->id,
                'name' => trim(($mapping->courseVersion?->name ?? '').' - '.($mapping->course?->name ?? ''), ' -'),
            ])
            ->values()
            ->all();
    }

    protected function hodModuleOptions(int $departmentId, ?int $courseVersionMappingId): array
    {
        if (! $courseVersionMappingId) {
            return [];
        }

        return CourseVersionUnit::query()
            ->select('course_version_units.module_taught')
            ->join('course_version_mappings', 'course_version_mappings.id', '=', 'course_version_units.course_version_mapping_id')
            ->join('courses', 'courses.id', '=', 'course_version_mappings.course_id')
            ->join('course_versions', 'course_versions.id', '=', 'course_version_mappings.course_version_id')
            ->where('courses.department_id', $departmentId)
            ->where('course_version_mappings.id', $courseVersionMappingId)
            ->where('course_version_mappings.is_active', true)
            ->where('course_versions.is_active', true)
            ->distinct()
            ->orderBy('course_version_units.module_taught')
            ->pluck('course_version_units.module_taught')
            ->filter()
            ->map(fn ($moduleNumber) => [
                'id' => (string) (int) $moduleNumber,
                'name' => 'Module '.(int) $moduleNumber,
            ])
            ->values()
            ->all();
    }

    protected function hodAvailableUnitOptions(
        int $departmentId,
        ?int $courseVersionMappingId,
        ?int $moduleNumber
    ): array {
        if (! $courseVersionMappingId || ! $moduleNumber) {
            return [];
        }

        $currentSessionId = $this->supportsAcademicSessionScoping()
            ? $this->currentAcademicSession()?->id
            : null;

        return CourseVersionUnit::query()
            ->with([
                'unit:id,name,code',
                'courseVersionMapping.course:id,name,department_id',
                'courseVersionMapping.courseVersion:id,name,is_active',
            ])
            ->whereDoesntHave('timetableSessions', function ($query) use ($currentSessionId) {
                if ($currentSessionId) {
                    $query->where('academic_timetables.academic_session_id', $currentSessionId);
                }
            })
            ->where('module_taught', $moduleNumber)
            ->whereHas('courseVersionMapping', function ($query) use ($departmentId, $courseVersionMappingId) {
                $query
                    ->where('is_active', true)
                    ->where('id', $courseVersionMappingId)
                    ->whereHas('course', fn ($courseQuery) => $courseQuery->where('department_id', $departmentId))
                    ->whereHas('courseVersion', fn ($courseVersionQuery) => $courseVersionQuery->where('is_active', true));
            })
            ->get()
            ->map(fn (CourseVersionUnit $unit) => [
                'id' => (string) $unit->id,
                'name' => ($unit->courseVersionMapping?->courseVersion?->name ?? 'No Version').
                    ' / '.
                    ($unit->courseVersionMapping?->course?->name ?? 'No Course').
                    ' / Module '.
                    ($unit->module_taught ?? '').
                    ' / '.
                    ($unit->unit?->code ?? '').
                    ' - '.
                    ($unit->unit?->name ?? 'No Unit'),
            ])
            ->sortBy('name')
            ->values()
            ->all();
    }

    protected function persistTimetableSessions(array $validated, ?int $actorStaffId, int $academicSessionId): void
    {
        DB::transaction(function () use ($validated, $actorStaffId, $academicSessionId) {
            $courseVersionUnitIds = collect($validated['course_version_unit_ids'])
                ->map(fn ($id) => (int) $id)
                ->values();
            $primaryCourseVersionUnitId = $courseVersionUnitIds->first();

            foreach ($validated['sessions'] as $session) {
                $timetable = AcademicTimetable::create([
                    'department_id' => $validated['department_id'],
                    'academic_session_id' => $academicSessionId,
                    'course_version_unit_id' => $primaryCourseVersionUnitId,
                    'trainer_staff_id' => $validated['trainer_staff_id'],
                    'lecture_room_id' => $validated['lecture_room_id'],
                    'day_of_week' => $session['day_of_week'],
                    'start_time' => $session['start_time'],
                    'end_time' => $session['end_time'],
                    'created_by' => $actorStaffId,
                    'updated_by' => $actorStaffId,
                ]);

                $timetable->courseVersionUnits()->sync($courseVersionUnitIds->all());
            }
        });
    }

    protected function currentAcademicSession(): ?AcademicSession
    {
        return AcademicSession::query()
            ->with('academicYear:id,label,academic_year')
            ->active()
            ->orderByDesc('id')
            ->first();
    }

    protected function supportsAcademicSessionScoping(): bool
    {
        return Schema::hasColumn('academic_timetables', 'academic_session_id');
    }

    protected function sessionOptions(): array
    {
        return AcademicSession::query()
            ->with('academicYear:id,label,academic_year')
            ->orderByDesc('id')
            ->get()
            ->map(fn (AcademicSession $session) => [
                'id' => (string) $session->id,
                'name' => $session->display_name,
                'is_active' => (bool) $session->is_active,
            ])
            ->values()
            ->all();
    }
}
