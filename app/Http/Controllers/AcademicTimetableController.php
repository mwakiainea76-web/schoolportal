<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreAcademicTimetableRequest;
use App\Http\Requests\UpdateAcademicTimetableRequest;
use App\Models\AcademicTimetable;
use App\Models\Department;
use App\Models\LectureRoom;
use App\Models\ProgramVersionUnit;
use App\Models\Staff;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

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
        $selectedDepartmentId = $request->integer('department_id') ?: $currentDepartmentId;

        $query = $this->baseQuery();

        if ($selectedDepartmentId) {
            $query->where('department_id', $selectedDepartmentId);
        }

        if ($request->filled('trainer_staff_id')) {
            $query->where('trainer_staff_id', $request->integer('trainer_staff_id'));
        }

        if ($request->filled('program_version_unit_id')) {
            $programVersionUnitId = $request->integer('program_version_unit_id');
            $query->whereHas('programVersionUnits', function ($builder) use ($programVersionUnitId) {
                $builder->where('program_version_units.id', $programVersionUnitId);
            });
        }

        if ($request->filled('day_of_week')) {
            $query->where('day_of_week', $request->string('day_of_week')->toString());
        }

        if ($request->filled('lecture_room_id')) {
            $query->where('lecture_room_id', $request->integer('lecture_room_id'));
        }

        $boardEntries = (clone $query)
            ->orderByRaw($this->dayOrderCaseSql())
            ->orderBy('start_time')
            ->get();

        $timetables = $query
            ->orderByRaw($this->dayOrderCaseSql())
            ->orderBy('start_time')
            ->paginate(20)
            ->withQueryString();

        $timetables->setCollection(
            $timetables->getCollection()->map(fn (AcademicTimetable $entry) => $this->transformTimetable($entry))
        );

        return inertia('Academic/Timetables/Index', [
            'timetables' => $timetables,
            'weekly_board' => collect($this->dayOrder)->map(fn (string $day) => [
                'day' => $day,
                'label' => ucfirst($day),
                'sessions' => $boardEntries
                    ->where('day_of_week', $day)
                    ->sortBy('start_time')
                    ->map(fn (AcademicTimetable $entry) => $this->transformTimetable($entry))
                    ->values(),
            ])->values(),
            'filters' => [
                'department_id' => $selectedDepartmentId ? (string) $selectedDepartmentId : '',
                'trainer_staff_id' => $request->filled('trainer_staff_id') ? (string) $request->integer('trainer_staff_id') : '',
                'program_version_unit_id' => $request->filled('program_version_unit_id') ? (string) $request->integer('program_version_unit_id') : '',
                'lecture_room_id' => $request->filled('lecture_room_id') ? (string) $request->integer('lecture_room_id') : '',
                'day_of_week' => $request->string('day_of_week')->toString(),
            ],
            'departments' => $this->departmentOptions(),
            'trainers' => $this->trainerOptions($selectedDepartmentId),
            'lecture_rooms' => $this->lectureRoomOptions($selectedDepartmentId),
            'program_version_units' => $this->programVersionUnitOptions($selectedDepartmentId),
            'days' => $this->dayOptions(),
            'current_department_id' => $currentDepartmentId ? (string) $currentDepartmentId : '',
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
            'program_version_units' => $this->programVersionUnitOptions(),
            'days' => $this->dayOptions(),
            'current_department_id' => $currentDepartmentId ? (string) $currentDepartmentId : '',
            'selected_department_id' => $selectedDepartmentId ? (string) $selectedDepartmentId : '',
        ]);
    }

    public function store(StoreAcademicTimetableRequest $request)
    {
        $validated = $request->validated();
        $actorStaffId = $request->user()?->staff?->id;

        DB::transaction(function () use ($validated, $actorStaffId) {
            $programVersionUnitIds = collect($validated['program_version_unit_ids'])
                ->map(fn ($id) => (int) $id)
                ->values();
            $primaryProgramVersionUnitId = $programVersionUnitIds->first();

            foreach ($validated['sessions'] as $session) {
                $timetable = AcademicTimetable::create([
                    'department_id' => $validated['department_id'],
                    'program_version_unit_id' => $primaryProgramVersionUnitId,
                    'trainer_staff_id' => $validated['trainer_staff_id'],
                    'lecture_room_id' => $validated['lecture_room_id'],
                    'day_of_week' => $session['day_of_week'],
                    'start_time' => $session['start_time'],
                    'end_time' => $session['end_time'],
                    'created_by' => $actorStaffId,
                    'updated_by' => $actorStaffId,
                ]);

                $timetable->programVersionUnits()->sync($programVersionUnitIds->all());
            }
        });

        return to_route('academic.timetables.index', [
            'department_id' => $validated['department_id'],
        ])->with('success', 'Timetable sessions created successfully.');
    }

    public function edit(AcademicTimetable $timetable)
    {
        $timetable->load([
            'department:id,name',
            'trainer.user:id,first_name,last_name',
            'lectureRoom:id,name,code,department_id',
            'programVersionUnit.unit:id,name,code',
            'programVersionUnits.unit:id,name,code',
            'programVersionUnits.programVersionMapping.program:id,name,department_id',
            'programVersionUnits.programVersionMapping.programVersion:id,name',
            'programVersionUnit.programVersionMapping.program:id,name,department_id',
            'programVersionUnit.programVersionMapping.programVersion:id,name',
        ]);

        return inertia('Academic/Timetables/Edit', [
            'timetable' => $this->transformTimetable($timetable),
            'departments' => $this->departmentOptions(),
            'trainers' => $this->trainerOptions(),
            'lecture_rooms' => $this->lectureRoomOptions(),
            'program_version_units' => $this->programVersionUnitOptions(),
            'days' => $this->dayOptions(),
        ]);
    }

    public function update(UpdateAcademicTimetableRequest $request, AcademicTimetable $timetable)
    {
        $validated = $request->validated();

        $timetable->update([
            'department_id' => $validated['department_id'],
            'program_version_unit_id' => $validated['program_version_unit_ids'][0],
            'trainer_staff_id' => $validated['trainer_staff_id'],
            'lecture_room_id' => $validated['lecture_room_id'],
            'day_of_week' => $validated['day_of_week'],
            'start_time' => $validated['start_time'],
            'end_time' => $validated['end_time'],
            'updated_by' => $request->user()?->staff?->id,
        ]);
        $timetable->programVersionUnits()->sync($validated['program_version_unit_ids']);

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
            'department:id,name',
            'trainer.user:id,first_name,last_name',
            'lectureRoom:id,name,code,department_id',
            'programVersionUnit.unit:id,name,code',
            'programVersionUnits.unit:id,name,code',
            'programVersionUnits.programVersionMapping.program:id,name,department_id',
            'programVersionUnits.programVersionMapping.programVersion:id,name',
            'programVersionUnit.programVersionMapping.program:id,name,department_id',
            'programVersionUnit.programVersionMapping.programVersion:id,name',
        ]);
    }

    protected function transformTimetable(AcademicTimetable $entry): array
    {
        return [
            'id' => $entry->id,
            'department_id' => (string) $entry->department_id,
            'department_name' => $entry->department?->name,
            'program_version_unit_id' => (string) $entry->program_version_unit_id,
            'program_version_unit_ids' => $entry->programVersionUnits->pluck('id')->map(fn ($id) => (string) $id)->values()->all(),
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
            'unit_name' => $entry->programVersionUnit?->unit?->name,
            'unit_code' => $entry->programVersionUnit?->unit?->code,
            'module_taught' => $entry->programVersionUnit?->module_taught,
            'program_name' => $entry->programVersionUnit?->programVersionMapping?->program?->name,
            'program_version_name' => $entry->programVersionUnit?->programVersionMapping?->programVersion?->name,
            'merged_units' => $entry->programVersionUnits
                ->map(fn (ProgramVersionUnit $unit) => [
                    'id' => (string) $unit->id,
                    'name' => $unit->unit?->name,
                    'code' => $unit->unit?->code,
                    'program_name' => $unit->programVersionMapping?->program?->name,
                    'program_version_name' => $unit->programVersionMapping?->programVersion?->name,
                    'module_taught' => $unit->module_taught,
                    'display_name' => ($unit->programVersionMapping?->programVersion?->name ?? '').
                        ' / '.
                        ($unit->programVersionMapping?->program?->name ?? '').
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
                ($entry->programVersionUnit?->programVersionMapping?->programVersion?->name ?? '').
                ' / '.
                ($entry->programVersionUnit?->programVersionMapping?->program?->name ?? '').
                ' / Module '.
                ($entry->programVersionUnit?->module_taught ?? '').
                ' / '.
                ($entry->programVersionUnit?->unit?->code ?? '').
                ' - '.
                ($entry->programVersionUnit?->unit?->name ?? '')
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

    protected function programVersionUnitOptions(?int $departmentId = null): array
    {
        return ProgramVersionUnit::query()
            ->with([
                'unit:id,name,code',
                'programVersionMapping.program:id,name,department_id',
                'programVersionMapping.programVersion:id,name',
            ])
            ->when($departmentId, function ($query, $departmentId) {
                $query->whereHas('programVersionMapping.program', fn ($programQuery) => $programQuery->where('department_id', $departmentId));
            })
            ->get()
            ->map(fn (ProgramVersionUnit $unit) => [
                'id' => (string) $unit->id,
                'name' => ($unit->programVersionMapping?->programVersion?->name ?? 'No Version').
                    ' / '.
                    ($unit->programVersionMapping?->program?->name ?? 'No Program').
                    ' / Module '.
                    ($unit->module_taught ?? '').
                    ' / '.
                    ($unit->unit?->code ?? '').
                    ' - '.
                    ($unit->unit?->name ?? 'No Unit'),
                'department_id' => (string) ($unit->programVersionMapping?->program?->department_id ?? ''),
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
}
