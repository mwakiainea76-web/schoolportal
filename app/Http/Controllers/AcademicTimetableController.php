<?php

namespace App\Http\Controllers;

use App\Models\AcademicSession;
use App\Http\Requests\StoreAcademicTimetableRequest;
use App\Http\Requests\StoreHodAcademicTimetableRequest;
use App\Http\Requests\UpdateAcademicTimetableRequest;
use App\Models\AcademicTimetable;
use App\Models\Department;
use App\Models\LectureRoom;
use App\Models\CurriculumMapping;
use App\Models\Unit;
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
        $selectedCurriculumMappingId = $request->integer('curriculum_mapping_id') ?: null;
        $selectedModuleNumber = $request->integer('module_number') ?: null;
        $adminClassFiltersReady = (bool) ($selectedDepartmentId && $selectedCurriculumMappingId && $selectedModuleNumber);
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

        if ($shouldLoadTimetable && $request->filled('curriculum_unit_id')) {
            $curriculumUnitId = $request->integer('curriculum_unit_id');
            $query->whereHas('curriculumUnits', function ($builder) use ($curriculumUnitId) {
                $builder->where('units.id', $curriculumUnitId);
            });
        }

        if ($shouldLoadTimetable && $selectedCurriculumMappingId) {
            $query->whereHas('curriculumUnits', function ($builder) use ($selectedCurriculumMappingId) {
                $builder->where('units.curriculum_mapping_id', $selectedCurriculumMappingId);
            });
        }

        if ($shouldLoadTimetable && $selectedModuleNumber) {
            $query->whereHas('curriculumUnits', function ($builder) use ($selectedModuleNumber) {
                $builder->where('units.module_taught', $selectedModuleNumber);
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
                'curriculum_unit_id' => $request->filled('curriculum_unit_id') ? (string) $request->integer('curriculum_unit_id') : '',
                'curriculum_mapping_id' => $selectedCurriculumMappingId ? (string) $selectedCurriculumMappingId : '',
                'module_number' => $selectedModuleNumber ? (string) $selectedModuleNumber : '',
                'day_of_week' => $request->string('day_of_week')->toString(),
            ],
            'session_options' => $supportsAcademicSessions ? $this->sessionOptions() : [],
            'departments' => $this->departmentOptions(),
            'trainers' => $this->trainerOptions($selectedDepartmentId),
            'curriculum_units' => $this->curriculumUnitOptions($selectedDepartmentId),
            'course_options' => $selectedDepartmentId ? $this->hodcourseOptions((int) $selectedDepartmentId, $selectedCurriculumMappingId) : [],
            'module_options' => ($selectedDepartmentId && $selectedCurriculumMappingId)
                ? $this->hodModuleOptions((int) $selectedDepartmentId, $selectedCurriculumMappingId)
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
            'curriculum_units' => $this->curriculumUnitOptions(),
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

        $selectedCurriculumMappingId = $request->integer('curriculum_mapping_id') ?: null;
        $selectedModuleNumber = $request->integer('module_number') ?: null;

        return inertia('Academic/Timetables/CreateHod', [
            'department' => [
                'id' => (string) $department->id,
                'name' => $department->name,
            ],
            'course_options' => $this->hodcourseOptions((int) $department->id, $selectedCurriculumMappingId),
            'modules' => $this->hodModuleOptions((int) $department->id, $selectedCurriculumMappingId),
            'available_units' => $this->hodAvailableUnitOptions(
                (int) $department->id,
                $selectedCurriculumMappingId,
                $selectedModuleNumber
            ),
            'trainers' => $this->trainerOptions((int) $department->id),
            'lecture_rooms' => $this->lectureRoomOptions((int) $department->id),
            'days' => $this->dayOptions(),
            'filters' => [
                'curriculum_mapping_id' => $selectedCurriculumMappingId ? (string) $selectedCurriculumMappingId : '',
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
            'curriculum_mapping_id' => $validated['curriculum_mapping_id'],
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
            CurriculumMapping::query()
                ->with([
                    'course:id,name,department_id',
                    'curriculum:id,name,is_active',
                ])
                ->where('is_active', true)
                ->whereHas('course', fn ($courseQuery) => $courseQuery->where('department_id', $departmentId))
                ->whereHas('curriculum', fn ($curriculumQuery) => $curriculumQuery->where('is_active', true))
                ->whereHas('units')
                ->when($query !== '', function ($builder) use ($query) {
                    $builder->where(function ($mappingQuery) use ($query) {
                        $mappingQuery
                            ->whereHas('course', fn ($courseQuery) => $courseQuery
                                ->where('name', 'like', "%{$query}%")
                                ->orWhere('code', 'like', "%{$query}%"))
                            ->orWhereHas('curriculum', fn ($curriculumQuery) => $curriculumQuery
                                ->where('name', 'like', "%{$query}%"));
                    });
                })
                ->latest('curriculum_mappings.id')
                ->limit($limit)
                ->get(['id', 'course_id', 'curriculum_id'])
                ->map(fn (CurriculumMapping $mapping) => [
                    'id' => (string) $mapping->id,
                    'name' => trim(($mapping->curriculum?->name ?? '').' - '.($mapping->course?->name ?? ''), ' -'),
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
            CurriculumMapping::query()
                ->with([
                    'course:id,name,department_id',
                    'curriculum:id,name,is_active',
                ])
                ->where('is_active', true)
                ->whereHas('course', fn ($courseQuery) => $courseQuery->where('department_id', $departmentId))
                ->whereHas('curriculum', fn ($curriculumQuery) => $curriculumQuery->where('is_active', true))
                ->whereHas('units')
                ->when($query !== '', function ($builder) use ($query) {
                    $builder->where(function ($mappingQuery) use ($query) {
                        $mappingQuery
                            ->whereHas('course', fn ($courseQuery) => $courseQuery
                                ->where('name', 'like', "%{$query}%")
                                ->orWhere('code', 'like', "%{$query}%"))
                            ->orWhereHas('curriculum', fn ($curriculumQuery) => $curriculumQuery
                                ->where('name', 'like', "%{$query}%"));
                    });
                })
                ->latest('curriculum_mappings.id')
                ->limit($limit)
                ->get(['id', 'course_id', 'curriculum_id'])
                ->map(fn (CurriculumMapping $mapping) => [
                    'id' => (string) $mapping->id,
                    'name' => trim(($mapping->curriculum?->name ?? '').' - '.($mapping->course?->name ?? ''), ' -'),
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
            'curriculumUnit:id,name,code',
            'curriculumUnits:id,name,code',
            'curriculumUnits.curriculumMapping.course:id,name,department_id',
            'curriculumUnits.curriculumMapping.curriculum:id,name',
            'curriculumUnit.curriculumMapping.course:id,name,department_id',
            'curriculumUnit.curriculumMapping.curriculum:id,name',
        ]);

        return inertia('Academic/Timetables/Edit', [
            'timetable' => $this->transformTimetable($timetable),
            'departments' => $this->departmentOptions(),
            'trainers' => $this->trainerOptions(),
            'lecture_rooms' => $this->lectureRoomOptions(),
            'curriculum_units' => $this->curriculumUnitOptions(),
            'days' => $this->dayOptions(),
        ]);
    }

    public function update(UpdateAcademicTimetableRequest $request, AcademicTimetable $timetable)
    {
        $validated = $request->validated();

        $timetable->update([
            'department_id' => $validated['department_id'],
            'curriculum_unit_id' => $validated['curriculum_unit_ids'][0],
            'trainer_staff_id' => $validated['trainer_staff_id'],
            'lecture_room_id' => $validated['lecture_room_id'],
            'day_of_week' => $validated['day_of_week'],
            'start_time' => $validated['start_time'],
            'end_time' => $validated['end_time'],
            'updated_by' => $request->user()?->staff?->id,
        ]);
        $timetable->curriculumUnits()->sync($validated['curriculum_unit_ids']);

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
            'curriculumUnit:id,name,code',
            'curriculumUnits:id,name,code',
            'curriculumUnits.curriculumMapping.course:id,name,department_id',
            'curriculumUnits.curriculumMapping.curriculum:id,name',
            'curriculumUnit.curriculumMapping.course:id,name,department_id',
            'curriculumUnit.curriculumMapping.curriculum:id,name',
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
            'curriculum_unit_id' => (string) $entry->curriculum_unit_id,
            'curriculum_unit_ids' => $entry->curriculumUnits->pluck('id')->map(fn ($id) => (string) $id)->values()->all(),
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
            'unit_name' => $entry->curriculumUnit?->name,
            'unit_code' => $entry->curriculumUnit?->code,
            'module_taught' => $entry->curriculumUnit?->module_taught,
            'course_name' => $entry->curriculumUnit?->curriculumMapping?->course?->name,
            'curriculum_name' => $entry->curriculumUnit?->curriculumMapping?->curriculum?->name,
            'merged_units' => $entry->curriculumUnits
                ->map(fn (Unit $unit) => [
                    'id' => (string) $unit->id,
                    'name' => $unit->name,
                    'code' => $unit->code,
                    'course_name' => $unit->curriculumMapping?->course?->name,
                    'curriculum_name' => $unit->curriculumMapping?->curriculum?->name,
                    'module_taught' => $unit->module_taught,
                    'display_name' => ($unit->curriculumMapping?->curriculum?->name ?? '').
                        ' / '.
                        ($unit->curriculumMapping?->course?->name ?? '').
                        ' / Module '.
                        ($unit->module_taught ?? '').
                        ' / '.
                        ($unit->code ?? '').
                        ' - '.
                        ($unit->name ?? ''),
                ])
                ->values()
                ->all(),
            'curriculum_unit_name' => trim(
                ($entry->curriculumUnit?->curriculumMapping?->curriculum?->name ?? '').
                ' / '.
                ($entry->curriculumUnit?->curriculumMapping?->course?->name ?? '').
                ' / Module '.
                ($entry->curriculumUnit?->module_taught ?? '').
                ' / '.
                ($entry->curriculumUnit?->code ?? '').
                ' - '.
                ($entry->curriculumUnit?->name ?? '')
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

    protected function curriculumUnitOptions(?int $departmentId = null): array
    {
        return Unit::query()
            ->with([
                'curriculumMapping.course:id,name,department_id',
                'curriculumMapping.curriculum:id,name',
            ])
            ->when($departmentId, function ($query, $departmentId) {
                $query->whereHas('curriculumMapping.course', fn ($courseQuery) => $courseQuery->where('department_id', $departmentId));
            })
            ->get()
            ->map(fn (Unit $unit) => [
                'id' => (string) $unit->id,
                'name' => ($unit->curriculumMapping?->curriculum?->name ?? 'No Version').
                    ' / '.
                    ($unit->curriculumMapping?->course?->name ?? 'No Course').
                    ' / Module '.
                    ($unit->module_taught ?? '').
                    ' / '.
                    ($unit->code ?? '').
                    ' - '.
                    ($unit->name ?? 'No Unit'),
                'department_id' => (string) ($unit->curriculumMapping?->course?->department_id ?? ''),
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

    protected function hodcourseOptions(int $departmentId, ?int $selectedCurriculumMappingId = null): array
    {
        $defaultcourses = CurriculumMapping::query()
            ->with([
                'course:id,name,department_id',
                'curriculum:id,name,is_active',
            ])
            ->where('is_active', true)
            ->whereHas('course', fn ($courseQuery) => $courseQuery->where('department_id', $departmentId))
            ->whereHas('curriculum', fn ($curriculumQuery) => $curriculumQuery->where('is_active', true))
            ->whereHas('units')
            ->latest('curriculum_mappings.id')
            ->limit(4)
            ->get(['id', 'course_id', 'curriculum_id']);

        if (
            $selectedCurriculumMappingId
            && ! $defaultcourses->contains(fn (CurriculumMapping $mapping) => (int) $mapping->id === $selectedCurriculumMappingId)
        ) {
            $selectedcourse = CurriculumMapping::query()
                ->with([
                    'course:id,name,department_id',
                    'curriculum:id,name,is_active',
                ])
                ->where('is_active', true)
                ->whereHas('course', fn ($courseQuery) => $courseQuery->where('department_id', $departmentId))
                ->whereHas('curriculum', fn ($curriculumQuery) => $curriculumQuery->where('is_active', true))
                ->whereHas('units')
                ->where('id', $selectedCurriculumMappingId)
                ->first(['id', 'course_id', 'curriculum_id']);

            if ($selectedcourse) {
                $defaultcourses->prepend($selectedcourse);
            }
        }

        return $defaultcourses
            ->unique('id')
            ->map(fn (CurriculumMapping $mapping) => [
                'id' => (string) $mapping->id,
                'name' => trim(($mapping->curriculum?->name ?? '').' - '.($mapping->course?->name ?? ''), ' -'),
            ])
            ->values()
            ->all();
    }

    protected function hodModuleOptions(int $departmentId, ?int $curriculumMappingId): array
    {
        if (! $curriculumMappingId) {
            return [];
        }

        return Unit::query()
            ->select('units.module_taught')
            ->join('curriculum_mappings', 'curriculum_mappings.id', '=', 'units.curriculum_mapping_id')
            ->join('courses', 'courses.id', '=', 'curriculum_mappings.course_id')
            ->join('curricula', 'curricula.id', '=', 'curriculum_mappings.curriculum_id')
            ->where('courses.department_id', $departmentId)
            ->where('curriculum_mappings.id', $curriculumMappingId)
            ->where('curriculum_mappings.is_active', true)
            ->where('curricula.is_active', true)
            ->distinct()
            ->orderBy('units.module_taught')
            ->pluck('units.module_taught')
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
        ?int $curriculumMappingId,
        ?int $moduleNumber
    ): array {
        if (! $curriculumMappingId || ! $moduleNumber) {
            return [];
        }

        $currentSessionId = $this->supportsAcademicSessionScoping()
            ? $this->currentAcademicSession()?->id
            : null;

        return Unit::query()
            ->with([
                'curriculumMapping.course:id,name,department_id',
                'curriculumMapping.curriculum:id,name,is_active',
            ])
            ->whereDoesntHave('timetableSessions', function ($query) use ($currentSessionId) {
                if ($currentSessionId) {
                    $query->where('academic_timetables.academic_session_id', $currentSessionId);
                }
            })
            ->where('module_taught', $moduleNumber)
            ->whereHas('curriculumMapping', function ($query) use ($departmentId, $curriculumMappingId) {
                $query
                    ->where('is_active', true)
                    ->where('id', $curriculumMappingId)
                    ->whereHas('course', fn ($courseQuery) => $courseQuery->where('department_id', $departmentId))
                    ->whereHas('curriculum', fn ($curriculumQuery) => $curriculumQuery->where('is_active', true));
            })
            ->get()
            ->map(fn (Unit $unit) => [
                'id' => (string) $unit->id,
                'name' => ($unit->curriculumMapping?->curriculum?->name ?? 'No Version').
                    ' / '.
                    ($unit->curriculumMapping?->course?->name ?? 'No Course').
                    ' / Module '.
                    ($unit->module_taught ?? '').
                    ' / '.
                    ($unit->code ?? '').
                    ' - '.
                    ($unit->name ?? 'No Unit'),
            ])
            ->sortBy('name')
            ->values()
            ->all();
    }

    protected function persistTimetableSessions(array $validated, ?int $actorStaffId, int $academicSessionId): void
    {
        DB::transaction(function () use ($validated, $actorStaffId, $academicSessionId) {
            $curriculumUnitIds = collect($validated['curriculum_unit_ids'])
                ->map(fn ($id) => (int) $id)
                ->values();
            $primaryCurriculumUnitId = $curriculumUnitIds->first();

            foreach ($validated['sessions'] as $session) {
                $timetable = AcademicTimetable::create([
                    'department_id' => $validated['department_id'],
                    'academic_session_id' => $academicSessionId,
                    'curriculum_unit_id' => $primaryCurriculumUnitId,
                    'trainer_staff_id' => $validated['trainer_staff_id'],
                    'lecture_room_id' => $validated['lecture_room_id'],
                    'day_of_week' => $session['day_of_week'],
                    'start_time' => $session['start_time'],
                    'end_time' => $session['end_time'],
                    'created_by' => $actorStaffId,
                    'updated_by' => $actorStaffId,
                ]);

                $timetable->curriculumUnits()->sync($curriculumUnitIds->all());
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
