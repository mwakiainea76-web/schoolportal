<?php

namespace App\Http\Requests;

use App\Models\AcademicSession;
use App\Models\AcademicTimetable;
use App\Models\CourseVersionUnit;
use App\Models\Staff;
use App\Models\LectureRoom;
use Illuminate\Database\Eloquent\Collection as EloquentCollection;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Schema;

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
            'course_version_unit_ids' => ['required', 'array', 'min:1'],
            'course_version_unit_ids.*' => ['required', 'distinct', 'exists:course_version_units,id'],
            'sessions' => ['required', 'array', 'min:1'],
            'sessions.*.day_of_week' => ['required', 'in:monday,tuesday,wednesday,thursday,friday,saturday,sunday'],
            'sessions.*.start_time' => ['required', 'date_format:H:i'],
            'sessions.*.end_time' => ['required', 'date_format:H:i'],
        ];
    }

    public function withValidator($validator): void
    {
        $validator->after(function ($validator) {
            $this->validateBaseTimetableSubmission($validator);
        });
    }

    protected function validateBaseTimetableSubmission($validator): void
    {
        if ($validator->errors()->isNotEmpty()) {
            return;
        }

        $departmentId = (int) $this->integer('department_id');
        $trainerId = (int) $this->integer('trainer_staff_id');
        $lectureRoomId = (int) $this->integer('lecture_room_id');
        $academicSessionId = $this->resolveCurrentAcademicSessionId();
        $courseVersionUnitIds = collect($this->input('course_version_unit_ids', []))
            ->map(fn ($id) => (int) $id)
            ->filter()
            ->values();

        if (! $academicSessionId) {
            $validator->errors()->add('department_id', 'No active academic session is available for timetable allocation.');

            return;
        }

        $trainer = Staff::query()->find($trainerId);
        if (! $trainer || (int) $trainer->department_id !== $departmentId) {
            $validator->errors()->add('trainer_staff_id', 'Selected trainer must belong to the chosen department.');
        }

        $lectureRoom = LectureRoom::query()->find($lectureRoomId);
        if (! $lectureRoom || (int) $lectureRoom->department_id !== $departmentId) {
            $validator->errors()->add('lecture_room_id', 'Selected lecture room must belong to the chosen department.');
        }

        $courseVersionUnits = CourseVersionUnit::query()
            ->with('courseVersionMapping.course:id,department_id')
            ->whereIn('id', $courseVersionUnitIds)
            ->get()
            ->keyBy('id');

        foreach ($courseVersionUnitIds as $courseVersionUnitId) {
            $courseVersionUnit = $courseVersionUnits->get($courseVersionUnitId);
            if (! $courseVersionUnit || (int) $courseVersionUnit->courseVersionMapping?->program?->department_id !== $departmentId) {
                $validator->errors()->add('course_version_unit_ids', 'Every selected curriculum unit must belong to the chosen department.');
                break;
            }
        }

        $submittedSessions = $this->submittedSessions();
        $existingConflicts = $this->relevantTimetableConflicts($academicSessionId, $submittedSessions);
        $seenSessions = [];

        foreach ($submittedSessions as $session) {
            $row = $session['row'];
            $signature = $session['signature'];

            if ($session['end'] <= $session['start']) {
                $validator->errors()->add("sessions.{$session['index']}.end_time", "Session {$row} end time must be later than start time.");
                continue;
            }

            if (in_array($signature, $seenSessions, true)) {
                $validator->errors()->add("sessions.{$session['index']}.start_time", "Session {$row} duplicates another session in this submission.");
            }
            $seenSessions[] = $signature;

            $overlappingSessions = $this->overlappingConflictsFor($existingConflicts, $session);

            if ($overlappingSessions->contains(fn (AcademicTimetable $timetable) => (int) $timetable->trainer_staff_id === $trainerId)) {
                $validator->errors()->add("sessions.{$session['index']}.start_time", "Session {$row} overlaps with another timetable slot already assigned to this trainer.");
            }

            if ($overlappingSessions->contains(fn (AcademicTimetable $timetable) => (int) $timetable->lecture_room_id === $lectureRoomId)) {
                $validator->errors()->add("sessions.{$session['index']}.start_time", "Session {$row} overlaps with another timetable slot already assigned to this lecture room.");
            }

            if ($overlappingSessions->contains(function (AcademicTimetable $timetable) use ($courseVersionUnitIds) {
                return $timetable->courseVersionUnits
                    ->pluck('id')
                    ->map(fn ($id) => (int) $id)
                    ->intersect($courseVersionUnitIds)
                    ->isNotEmpty();
            })) {
                $validator->errors()->add("sessions.{$session['index']}.start_time", "Session {$row} overlaps with another timetable slot already assigned to one of the selected curriculum units.");
            }
        }
    }

    protected function resolveCurrentAcademicSessionId(): ?int
    {
        if (! Schema::hasColumn('academic_timetables', 'academic_session_id')) {
            return null;
        }

        return AcademicSession::query()
            ->active()
            ->orderByDesc('id')
            ->value('id');
    }

    protected function submittedSessions(): Collection
    {
        return collect($this->input('sessions', []))
            ->map(fn ($session, $index) => [
                'index' => $index,
                'row' => $index + 1,
                'day' => $session['day_of_week'] ?? null,
                'start' => $session['start_time'] ?? null,
                'end' => $session['end_time'] ?? null,
                'signature' => ($session['day_of_week'] ?? '').'|'.($session['start_time'] ?? '').'|'.($session['end_time'] ?? ''),
            ])
            ->filter(fn ($session) => $session['day'] && $session['start'] && $session['end'])
            ->values();
    }

    protected function relevantTimetableConflicts(int $academicSessionId, Collection $submittedSessions): EloquentCollection
    {
        if ($submittedSessions->isEmpty()) {
            return new EloquentCollection();
        }

        $days = $submittedSessions->pluck('day')->unique()->values();
        $latestEnd = $submittedSessions->max('end');

        return AcademicTimetable::query()
            ->select([
                'id',
                'department_id',
                'trainer_staff_id',
                'lecture_room_id',
                'day_of_week',
                'start_time',
                'end_time',
            ])
            ->with('courseVersionUnits:id,course_version_mapping_id,module_taught')
            ->where('academic_session_id', $academicSessionId)
            ->whereIn('day_of_week', $days)
            ->where('start_time', '<', $latestEnd)
            ->get();
    }

    protected function overlappingConflictsFor(EloquentCollection $existingConflicts, array $session): EloquentCollection
    {
        return $existingConflicts
            ->filter(fn (AcademicTimetable $timetable) => $timetable->day_of_week === $session['day'])
            ->filter(fn (AcademicTimetable $timetable) => (string) $timetable->start_time < $session['end'])
            ->filter(fn (AcademicTimetable $timetable) => (string) $timetable->end_time > $session['start'])
            ->values();
    }
}
