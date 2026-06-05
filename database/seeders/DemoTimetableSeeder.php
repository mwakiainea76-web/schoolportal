<?php

namespace Database\Seeders;

use App\Models\AcademicSession;
use App\Models\AcademicTimetable;
use App\Models\CurriculumUnit;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Schema;

class DemoTimetableSeeder extends Seeder
{
    public function seed(array $users, array $lectureRooms, array $mappings, ?AcademicSession $activeSession): void
    {
        $ictTrainer = $users['trainer_staff'] ?? $users['hod_staff'] ?? null;

        if (! $ictTrainer) {
            return;
        }

        $ictMainUnit = CurriculumUnit::query()
            ->where('curriculum_mapping_id', $mappings['ict_l4']->id)
            ->whereHas('unit', fn ($query) => $query->where('code', 'ICT101'))
            ->first();

        $ictSharedTheoryUnit = CurriculumUnit::query()
            ->where('curriculum_mapping_id', $mappings['ict_l4']->id)
            ->whereHas('unit', fn ($query) => $query->where('code', 'COM101'))
            ->first();

        if (! $ictMainUnit || ! $ictSharedTheoryUnit) {
            return;
        }

        $supportsAcademicSessions = Schema::hasColumn('academic_timetables', 'academic_session_id');
        $sessionId = $supportsAcademicSessions ? $activeSession?->id : null;

        $mondaySession = AcademicTimetable::firstOrCreate(
            $this->timetableIdentity(
                $ictTrainer->department_id,
                $ictTrainer->id,
                $lectureRooms['ict_lab_1']->id,
                'monday',
                '08:00:00',
                '10:00:00',
                $sessionId
            ),
            $this->timetableDefaults($ictMainUnit->id, $ictTrainer->id, $sessionId)
        );
        $mondaySession->curriculumUnits()->syncWithoutDetaching([
            $ictMainUnit->id,
            $ictSharedTheoryUnit->id,
        ]);

        $wednesdaySession = AcademicTimetable::firstOrCreate(
            $this->timetableIdentity(
                $ictTrainer->department_id,
                $ictTrainer->id,
                $lectureRooms['ict_lab_1']->id,
                'wednesday',
                '11:00:00',
                '13:00:00',
                $sessionId
            ),
            $this->timetableDefaults($ictMainUnit->id, $ictTrainer->id, $sessionId)
        );
        $wednesdaySession->curriculumUnits()->syncWithoutDetaching([
            $ictMainUnit->id,
        ]);
    }

    protected function timetableIdentity(
        int $departmentId,
        int $trainerStaffId,
        int $lectureRoomId,
        string $dayOfWeek,
        string $startTime,
        string $endTime,
        ?int $academicSessionId
    ): array {
        $identity = [
            'department_id' => $departmentId,
            'trainer_staff_id' => $trainerStaffId,
            'lecture_room_id' => $lectureRoomId,
            'day_of_week' => $dayOfWeek,
            'start_time' => $startTime,
            'end_time' => $endTime,
        ];

        if ($academicSessionId) {
            $identity['academic_session_id'] = $academicSessionId;
        }

        return $identity;
    }

    protected function timetableDefaults(int $curriculumUnitId, int $actorStaffId, ?int $academicSessionId): array
    {
        $defaults = [
            'curriculum_unit_id' => $curriculumUnitId,
            'created_by' => $actorStaffId,
            'updated_by' => $actorStaffId,
        ];

        if ($academicSessionId) {
            $defaults['academic_session_id'] = $academicSessionId;
        }

        return $defaults;
    }
}
