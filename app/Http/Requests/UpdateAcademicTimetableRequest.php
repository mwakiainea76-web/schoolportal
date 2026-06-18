<?php

namespace App\Http\Requests;

use App\Models\AcademicTimetable;
use App\Models\Unit;
use App\Models\Staff;
use App\Models\LectureRoom;
use Illuminate\Foundation\Http\FormRequest;

class UpdateAcademicTimetableRequest extends FormRequest
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
            'curriculum_unit_ids' => ['required', 'array', 'min:1'],
            'curriculum_unit_ids.*' => ['required', 'distinct', 'exists:units,id'],
            'day_of_week' => ['required', 'in:monday,tuesday,wednesday,thursday,friday,saturday,sunday'],
            'start_time' => ['required', 'date_format:H:i'],
            'end_time' => ['required', 'date_format:H:i'],
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
            $curriculumUnitIds = collect($this->input('curriculum_unit_ids', []))
                ->map(fn ($id) => (int) $id)
                ->filter()
                ->values()
                ->all();
            $day = $this->string('day_of_week')->toString();
            $start = $this->string('start_time')->toString();
            $end = $this->string('end_time')->toString();
            $currentId = $this->route('timetable')?->id;

            if ($end <= $start) {
                $validator->errors()->add('end_time', 'End time must be later than start time.');
            }

            $trainer = Staff::query()->find($trainerId);
            if (! $trainer || (int) $trainer->department_id !== $departmentId) {
                $validator->errors()->add('trainer_staff_id', 'Selected trainer must belong to the chosen department.');
            }

            $lectureRoom = LectureRoom::query()->find($lectureRoomId);
            if (! $lectureRoom || (int) $lectureRoom->department_id !== $departmentId) {
                $validator->errors()->add('lecture_room_id', 'Selected lecture room must belong to the chosen department.');
            }

            $curriculumUnits = Unit::query()
                ->with('curriculumMapping.course:id,department_id')
                ->whereIn('id', $curriculumUnitIds)
                ->get()
                ->keyBy('id');

            foreach ($curriculumUnitIds as $curriculumUnitId) {
                $curriculumUnit = $curriculumUnits->get($curriculumUnitId);
                if (! $curriculumUnit || (int) $curriculumUnit->curriculumMapping?->course?->department_id !== $departmentId) {
                    $validator->errors()->add('curriculum_unit_ids', 'Every selected curriculum unit must belong to the chosen department.');
                    break;
                }
            }

            $trainerOverlap = AcademicTimetable::query()
                ->where('trainer_staff_id', $trainerId)
                ->where('day_of_week', $day)
                ->where('start_time', '<', $end)
                ->where('end_time', '>', $start)
                ->where('id', '!=', $currentId)
                ->exists();

            if ($trainerOverlap) {
                $validator->errors()->add('start_time', 'This trainer is already booked during the selected time.');
            }

            $roomOverlap = AcademicTimetable::query()
                ->where('lecture_room_id', $lectureRoomId)
                ->where('day_of_week', $day)
                ->where('start_time', '<', $end)
                ->where('end_time', '>', $start)
                ->where('id', '!=', $currentId)
                ->exists();

            if ($roomOverlap) {
                $validator->errors()->add('start_time', 'This lecture room is already booked during the selected time.');
            }

            $unitOverlap = AcademicTimetable::query()
                ->whereHas('curriculumUnits', function ($query) use ($curriculumUnitIds) {
                    $query->whereIn('units.id', $curriculumUnitIds);
                })
                ->where('day_of_week', $day)
                ->where('start_time', '<', $end)
                ->where('end_time', '>', $start)
                ->where('id', '!=', $currentId)
                ->exists();

            if ($unitOverlap) {
                $validator->errors()->add('start_time', 'One of the selected curriculum units is already scheduled during the selected time.');
            }
        });
    }
}
