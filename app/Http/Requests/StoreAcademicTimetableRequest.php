<?php

namespace App\Http\Requests;

use App\Models\AcademicSession;
use App\Models\AcademicTimetable;
use App\Models\Unit;
use App\Models\Staff;
use App\Models\LectureRoom;
use Illuminate\Database\Eloquent\Collection as EloquentCollection;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Arr;
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
            'curriculum_mapping_id' => ['required', 'exists:curriculum_mappings,id'],
            'module_number' => ['required', 'integer', 'min:1'],
            'trainer_staff_id' => ['required', 'exists:staffs,id'],
            'lecture_room_id' => ['required', 'exists:lecture_rooms,id'],
            'curriculum_unit_ids' => ['required', 'array', 'min:1'],
            'curriculum_unit_ids.*' => ['required', 'distinct', 'exists:units,id'],
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
        $curriculumMappingId = (int) $this->integer('curriculum_mapping_id');
        $moduleNumber = (int) $this->integer('module_number');
        $trainerId = (int) $this->integer('trainer_staff_id');
        $lectureRoomId = (int) $this->integer('lecture_room_id');
        $academicSessionId = $this->resolveCurrentAcademicSessionId();
        $curriculumUnitIds = collect($this->input('curriculum_unit_ids', []))
            ->map(fn ($id) => (int) $id)
            ->filter()
            ->values();

        if (! $academicSessionId) {
            $validator->errors()->add('department_id', 'No active academic session is available for timetable allocation.');

            return;
        }

        $trainer = Staff::query()->find($trainerId);
        if (! $trainer) {
            $validator->errors()->add('trainer_staff_id', 'Selected trainer could not be found.');
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
            if (
                ! $curriculumUnit
                || (int) $curriculumUnit->curriculumMapping?->course?->department_id !== $departmentId
                || (int) ($curriculumUnit->curriculum_mapping_id ?? 0) !== $curriculumMappingId
                || (int) ($curriculumUnit->module_taught ?? 0) !== $moduleNumber
            ) {
                $validator->errors()->add('curriculum_unit_ids', 'Every selected curriculum unit must belong to the chosen department, selected course version mapping, and selected module.');
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
            $mergeableSlots = $overlappingSessions->filter(
                fn (AcademicTimetable $timetable) => $this->canMergeIntoOccupiedSlot(
                    $timetable,
                    $trainerId,
                    $lectureRoomId,
                    $session
                )
            );
            $conflictingTrainerSlots = $overlappingSessions
                ->filter(fn (AcademicTimetable $timetable) => (int) $timetable->trainer_staff_id === $trainerId)
                ->reject(fn (AcademicTimetable $timetable) => $mergeableSlots->contains(fn (AcademicTimetable $mergeableTimetable) => (int) $mergeableTimetable->id === (int) $timetable->id));
            $conflictingLectureRoomSlots = $overlappingSessions
                ->filter(fn (AcademicTimetable $timetable) => (int) $timetable->lecture_room_id === $lectureRoomId)
                ->reject(fn (AcademicTimetable $timetable) => $mergeableSlots->contains(fn (AcademicTimetable $mergeableTimetable) => (int) $mergeableTimetable->id === (int) $timetable->id));
            $conflictingCurriculumUnitSlots = $overlappingSessions
                ->filter(function (AcademicTimetable $timetable) use ($curriculumUnitIds) {
                    return $timetable->curriculumUnits
                        ->pluck('id')
                        ->map(fn ($id) => (int) $id)
                        ->intersect($curriculumUnitIds)
                        ->isNotEmpty();
                });

            if ($conflictingTrainerSlots->isNotEmpty()) {
                $validator->errors()->add("sessions.{$session['index']}.start_time", "Session {$row} overlaps with another timetable slot already assigned to this trainer.");
            }

            if ($conflictingLectureRoomSlots->isNotEmpty()) {
                $validator->errors()->add("sessions.{$session['index']}.start_time", "Session {$row} overlaps with another timetable slot already assigned to this lecture room.");
            }

            if ($conflictingCurriculumUnitSlots->isNotEmpty()) {
                $validator->errors()->add("sessions.{$session['index']}.start_time", "Session {$row} overlaps with another timetable slot already assigned to one of the selected curriculum units.");
            }

            if ($overlappingSessions->isNotEmpty() && $mergeableSlots->isEmpty()) {
                $occupiedExactSlot = $overlappingSessions->contains(fn (AcademicTimetable $timetable) => $this->isExactSlotMatch(
                    $timetable,
                    $trainerId,
                    $lectureRoomId,
                    $session
                ));

                if ($occupiedExactSlot) {
                    $validator->errors()->add(
                        "sessions.{$session['index']}.start_time",
                        "Session {$row} already exists in that room, with that trainer, at that same time. A shared slot is only allowed when every selected session matches that occupied slot exactly."
                    );
                }
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
            ->with('curriculumUnits:id,curriculum_mapping_id,module_taught')
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

    protected function canMergeIntoOccupiedSlot(
        AcademicTimetable $timetable,
        int $trainerId,
        int $lectureRoomId,
        array $session
    ): bool {
        return $this->isExactSlotMatch($timetable, $trainerId, $lectureRoomId, $session);
    }

    protected function isExactSlotMatch(
        AcademicTimetable $timetable,
        int $trainerId,
        int $lectureRoomId,
        array $session
    ): bool {
        return (int) $timetable->trainer_staff_id === $trainerId
            && (int) $timetable->lecture_room_id === $lectureRoomId
            && (string) $timetable->day_of_week === (string) Arr::get($session, 'day')
            && substr((string) $timetable->start_time, 0, 5) === (string) Arr::get($session, 'start')
            && substr((string) $timetable->end_time, 0, 5) === (string) Arr::get($session, 'end');
    }
}
