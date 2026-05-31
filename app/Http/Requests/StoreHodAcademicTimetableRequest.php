<?php

namespace App\Http\Requests;

use App\Models\AcademicTimetable;
use App\Models\LectureRoom;
use App\Models\ProgramVersionUnit;
use App\Models\Staff;

class StoreHodAcademicTimetableRequest extends StoreAcademicTimetableRequest
{
    protected array $allowedStudySlots = [
        '08:00|10:00',
        '11:00|13:00',
        '14:00|16:00',
    ];

    public function authorize(): bool
    {
        return (bool) $this->user()?->hasRole('hod');
    }

    public function rules(): array
    {
        return array_merge(parent::rules(), [
            'program_version_mapping_id' => ['required', 'exists:program_version_mappings,id'],
            'module_number' => ['required', 'integer', 'min:1'],
        ]);
    }

    public function withValidator($validator): void
    {
        parent::withValidator($validator);

        $validator->after(function ($validator) {
            if ($validator->errors()->isNotEmpty()) {
                return;
            }

            $staff = $this->user()?->staff;
            $staffDepartmentId = (int) ($staff?->department_id ?? 0);
            $departmentId = (int) $this->integer('department_id');
            $trainerId = (int) $this->integer('trainer_staff_id');
            $lectureRoomId = (int) $this->integer('lecture_room_id');
            $academicSessionId = $this->resolveCurrentAcademicSessionId();
            $programVersionMappingId = (int) $this->integer('program_version_mapping_id');
            $moduleNumber = (int) $this->integer('module_number');
            $programVersionUnitIds = collect($this->input('program_version_unit_ids', []))
                ->map(fn ($id) => (int) $id)
                ->filter()
                ->values();

            if (! $staffDepartmentId) {
                $validator->errors()->add('department_id', 'Your staff profile is not linked to a department.');

                return;
            }

            if ($departmentId !== $staffDepartmentId) {
                $validator->errors()->add('department_id', 'You can only create timetable sessions for your own department.');
            }

            if (! $academicSessionId) {
                $validator->errors()->add('department_id', 'No active academic session is available for timetable allocation.');

                return;
            }

            $trainer = Staff::query()->find($trainerId);
            if (! $trainer || (int) $trainer->department_id !== $staffDepartmentId) {
                $validator->errors()->add('trainer_staff_id', 'Selected trainer must belong to your department.');
            }

            $lectureRoom = LectureRoom::query()->find($lectureRoomId);
            if (! $lectureRoom || (int) $lectureRoom->department_id !== $staffDepartmentId) {
                $validator->errors()->add('lecture_room_id', 'Selected lecture room must belong to your department.');
            }

            $programVersionUnits = ProgramVersionUnit::query()
                ->with([
                    'programVersionMapping.program:id,department_id',
                    'programVersionMapping.programVersion:id,is_active',
                ])
                ->withCount([
                    'timetableSessions as scoped_timetable_sessions_count' => function ($query) use ($academicSessionId) {
                        if ($academicSessionId) {
                            $query->where('academic_timetables.academic_session_id', $academicSessionId);
                        }
                    },
                ])
                ->whereIn('id', $programVersionUnitIds)
                ->get()
                ->keyBy('id');

            foreach ($programVersionUnitIds as $programVersionUnitId) {
                $programVersionUnit = $programVersionUnits->get($programVersionUnitId);

                if (! $programVersionUnit) {
                    $validator->errors()->add('program_version_unit_ids', 'One or more selected curriculum units could not be found.');

                    break;
                }

                $mapping = $programVersionUnit->programVersionMapping;
                $program = $mapping?->program;
                $programVersion = $mapping?->programVersion;

                if (
                    (int) ($program?->department_id ?? 0) !== $staffDepartmentId
                    || (int) ($mapping?->id ?? 0) !== $programVersionMappingId
                    || (int) ($programVersionUnit->module_taught ?? 0) !== $moduleNumber
                    || ! $mapping?->is_active
                    || ! $programVersion?->is_active
                ) {
                    $validator->errors()->add('program_version_unit_ids', 'Selected curriculum units must match your department, chosen versioned course, and selected module.');

                    break;
                }

                if ((int) $programVersionUnit->scoped_timetable_sessions_count > 0) {
                    $validator->errors()->add('program_version_unit_ids', 'One or more selected curriculum units have already been assigned to a timetable.');

                    break;
                }
            }

            $submittedSessions = $this->submittedSessions();
            $existingConflicts = $this->relevantTimetableConflicts($academicSessionId, $submittedSessions);
            $seenSessions = [];

            foreach ($submittedSessions as $session) {
                if (! in_array("{$session['start']}|{$session['end']}", $this->allowedStudySlots, true)) {
                    $validator->errors()->add(
                        "sessions.{$session['index']}.start_time",
                        "Session {$session['row']} must use one of the planned study slots: 08:00-10:00, 11:00-13:00, or 14:00-16:00."
                    );

                    continue;
                }

                if (in_array($session['signature'], $seenSessions, true)) {
                    $validator->errors()->add("sessions.{$session['index']}.start_time", "Session {$session['row']} duplicates another session in this submission.");
                }
                $seenSessions[] = $session['signature'];

                $classOverlap = $this->overlappingConflictsFor($existingConflicts, $session)
                    ->filter(fn (AcademicTimetable $timetable) => (int) $timetable->department_id === $departmentId)
                    ->contains(function (AcademicTimetable $timetable) use ($programVersionMappingId, $moduleNumber) {
                        return $timetable->programVersionUnits->contains(function ($unit) use ($programVersionMappingId, $moduleNumber) {
                            return (int) $unit->program_version_mapping_id === $programVersionMappingId
                                && (int) $unit->module_taught === $moduleNumber;
                        });
                    });

                if ($classOverlap) {
                    $validator->errors()->add(
                        "sessions.{$session['index']}.start_time",
                        "Session {$session['row']} conflicts with another unit already allocated to this class in the selected time slot."
                    );
                }
            }
        });
    }
}
