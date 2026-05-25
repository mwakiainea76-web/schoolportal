<?php

namespace App\Http\Requests;

use App\Models\AcademicTimetable;
use App\Models\ProgramVersionUnit;
use App\Models\Staff;
use App\Models\LectureRoom;
use Illuminate\Foundation\Http\FormRequest;

class StoreAcademicTimetableRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'department_id' => ['required', 'exists:departments,id'],
            'trainer_staff_id' => ['required', 'exists:staffs,id'],
            'lecture_room_id' => ['required', 'exists:lecture_rooms,id'],
            'program_version_unit_ids' => ['required', 'array', 'min:1'],
            'program_version_unit_ids.*' => ['required', 'distinct', 'exists:program_version_units,id'],
            'sessions' => ['required', 'array', 'min:1'],
            'sessions.*.day_of_week' => ['required', 'in:monday,tuesday,wednesday,thursday,friday,saturday,sunday'],
            'sessions.*.start_time' => ['required', 'date_format:H:i'],
            'sessions.*.end_time' => ['required', 'date_format:H:i'],
        ];
    }

    public function withValidator($validator): void
    {
        $validator->after(function ($validator) {
            if ($validator->errors()->isNotEmpty()) {
                return;
            }

            $departmentId = (int) $this->integer('department_id');
            $trainerId = (int) $this->integer('trainer_staff_id');
            $lectureRoomId = (int) $this->integer('lecture_room_id');
            $programVersionUnitIds = collect($this->input('program_version_unit_ids', []))
                ->map(fn ($id) => (int) $id)
                ->filter()
                ->values();

            $trainer = Staff::query()->find($trainerId);
            if (! $trainer || (int) $trainer->department_id !== $departmentId) {
                $validator->errors()->add('trainer_staff_id', 'Selected trainer must belong to the chosen department.');
            }

            $lectureRoom = LectureRoom::query()->find($lectureRoomId);
            if (! $lectureRoom || (int) $lectureRoom->department_id !== $departmentId) {
                $validator->errors()->add('lecture_room_id', 'Selected lecture room must belong to the chosen department.');
            }

            $programVersionUnits = ProgramVersionUnit::query()
                ->with('programVersionMapping.program:id,department_id')
                ->whereIn('id', $programVersionUnitIds)
                ->get()
                ->keyBy('id');

            foreach ($programVersionUnitIds as $programVersionUnitId) {
                $programVersionUnit = $programVersionUnits->get($programVersionUnitId);
                if (! $programVersionUnit || (int) $programVersionUnit->programVersionMapping?->program?->department_id !== $departmentId) {
                    $validator->errors()->add('program_version_unit_ids', 'Every selected curriculum unit must belong to the chosen department.');
                    break;
                }
            }

            $seenSessions = [];

            foreach ($this->input('sessions', []) as $index => $session) {
                $row = $index + 1;
                $day = $session['day_of_week'] ?? null;
                $start = $session['start_time'] ?? null;
                $end = $session['end_time'] ?? null;

                if (! $day || ! $start || ! $end) {
                    continue;
                }

                if ($end <= $start) {
                    $validator->errors()->add("sessions.$index.end_time", "Session {$row} end time must be later than start time.");
                    continue;
                }

                $signature = "{$day}|{$start}|{$end}";
                if (in_array($signature, $seenSessions, true)) {
                    $validator->errors()->add("sessions.$index.start_time", "Session {$row} duplicates another session in this submission.");
                }
                $seenSessions[] = $signature;

                $trainerOverlap = AcademicTimetable::query()
                    ->where('trainer_staff_id', $trainerId)
                    ->where('day_of_week', $day)
                    ->where('start_time', '<', $end)
                    ->where('end_time', '>', $start)
                    ->exists();

                if ($trainerOverlap) {
                    $validator->errors()->add("sessions.$index.start_time", "Session {$row} overlaps with another timetable slot already assigned to this trainer.");
                }

                $roomOverlap = AcademicTimetable::query()
                    ->where('lecture_room_id', $lectureRoomId)
                    ->where('day_of_week', $day)
                    ->where('start_time', '<', $end)
                    ->where('end_time', '>', $start)
                    ->exists();

                if ($roomOverlap) {
                    $validator->errors()->add("sessions.$index.start_time", "Session {$row} overlaps with another timetable slot already assigned to this lecture room.");
                }

                $unitOverlap = AcademicTimetable::query()
                    ->whereHas('programVersionUnits', function ($query) use ($programVersionUnitIds) {
                        $query->whereIn('program_version_units.id', $programVersionUnitIds);
                    })
                    ->where('day_of_week', $day)
                    ->where('start_time', '<', $end)
                    ->where('end_time', '>', $start)
                    ->exists();

                if ($unitOverlap) {
                    $validator->errors()->add("sessions.$index.start_time", "Session {$row} overlaps with another timetable slot already assigned to one of the selected curriculum units.");
                }
            }
        });
    }
}
