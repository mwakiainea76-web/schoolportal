<?php

namespace App\Services\Analytics;

use App\Models\AcademicSession;
use App\Models\AcademicSessionEnrollment;
use App\Models\AcademicTimetable;
use App\Models\LectureRoom;
use App\Models\Unit;
use App\Models\Student;
use App\Services\Analytics\Concerns\BuildsAnalyticsFilters;
use Illuminate\Support\Facades\DB;

class AcademicAnalyticsService
{
    use BuildsAnalyticsFilters;

    public function summary(array $filters = []): array
    {
        $filters = $this->normalizeFilters($filters);
        $activeSession = AcademicSession::query()
            ->with('academicYear')
            ->where('is_active', true)
            ->latest('start_date')
            ->latest('id')
            ->first();

        $eligibleStudents = Student::query()
            ->where('student_status', 'active')
            ->whereExists(function ($query) {
                $query->selectRaw('1')
                    ->from('course_enrollments')
                    ->whereColumn('course_enrollments.student_id', 'students.id')
                    ->whereNull('course_enrollments.deleted_at');
            })
            ->count();

        $registeredStudents = $activeSession
            ? DB::table('academic_session_enrollments')
                ->join('course_enrollments', 'course_enrollments.id', '=', 'academic_session_enrollments.course_enrollment_id')
                ->join('students', 'students.id', '=', 'course_enrollments.student_id')
                ->whereNull('academic_session_enrollments.deleted_at')
                ->whereNull('course_enrollments.deleted_at')
                ->whereNull('students.deleted_at')
                ->where('students.student_status', 'active')
                ->where('academic_session_enrollments.academic_session_id', $activeSession->id)
                ->distinct()
                ->count('students.id')
            : 0;

        $sessionRegistrationRate = $eligibleStudents > 0
            ? round(($registeredStudents / $eligibleStudents) * 100, 2)
            : 0.0;

        $studentsNotRegistered = $activeSession
            ? Student::query()
                ->join('users', 'users.id', '=', 'students.user_id')
                ->whereNull('students.deleted_at')
                ->whereNull('users.deleted_at')
                ->where('students.student_status', 'active')
                ->whereExists(function ($query) {
                    $query->selectRaw('1')
                        ->from('course_enrollments')
                        ->whereColumn('course_enrollments.student_id', 'students.id')
                        ->whereNull('course_enrollments.deleted_at');
                })
                ->whereNotExists(function ($query) use ($activeSession) {
                    $query->selectRaw('1')
                        ->from('course_enrollments')
                        ->join('academic_session_enrollments', 'academic_session_enrollments.course_enrollment_id', '=', 'course_enrollments.id')
                        ->whereColumn('course_enrollments.student_id', 'students.id')
                        ->whereNull('course_enrollments.deleted_at')
                        ->whereNull('academic_session_enrollments.deleted_at')
                        ->where('academic_session_enrollments.academic_session_id', $activeSession->id);
                })
                ->select('students.id', 'students.registration_number', 'students.current_module', 'users.first_name', 'users.last_name')
                ->orderBy('users.last_name')
                ->orderBy('users.first_name')
                ->limit(10)
                ->get()
                ->map(fn ($row) => [
                    'student_id' => (int) $row->id,
                    'registration_number' => $row->registration_number,
                    'student_name' => trim($row->first_name.' '.$row->last_name),
                    'current_module' => $row->current_module,
                ])
                ->all()
            : [];

        $studentCountsByModule = Student::query()
            ->select('current_module')
            ->selectRaw('COUNT(*) as total')
            ->whereNull('deleted_at')
            ->where('student_status', 'active')
            ->groupBy('current_module')
            ->orderBy('current_module')
            ->get()
            ->map(fn ($row) => [
                'module' => (string) $row->current_module,
                'total' => (int) $row->total,
            ])
            ->all();

        $studentCountsByYear = AcademicSessionEnrollment::query()
            ->select('year_of_study')
            ->selectRaw('COUNT(DISTINCT course_enrollments.student_id) as total')
            ->join('course_enrollments', 'course_enrollments.id', '=', 'academic_session_enrollments.course_enrollment_id')
            ->whereNull('academic_session_enrollments.deleted_at')
            ->whereNull('course_enrollments.deleted_at')
            ->when($activeSession, fn ($query) => $query->where('academic_session_enrollments.academic_session_id', $activeSession->id))
            ->groupBy('year_of_study')
            ->orderBy('year_of_study')
            ->get()
            ->map(fn ($row) => [
                'year_of_study' => (int) $row->year_of_study,
                'total' => (int) $row->total,
            ])
            ->all();

        $mappedUnitsCount = Unit::query()->count();
        $unitsWithTimetableCount = DB::table('academic_timetable_curriculum_unit')
            ->distinct()
            ->count('curriculum_unit_id');
        $timetableCompletionRate = $mappedUnitsCount > 0
            ? round(($unitsWithTimetableCount / $mappedUnitsCount) * 100, 2)
            : 0.0;

        $lecturerLoad = DB::table('academic_timetables')
            ->join('staffs', 'staffs.id', '=', 'academic_timetables.trainer_staff_id')
            ->join('users', 'users.id', '=', 'staffs.user_id')
            ->whereNull('academic_timetables.deleted_at')
            ->select('staffs.id', 'staffs.staff_number', 'users.first_name', 'users.last_name')
            ->selectRaw('COUNT(academic_timetables.id) as session_count')
            ->groupBy('staffs.id', 'staffs.staff_number', 'users.first_name', 'users.last_name')
            ->orderByDesc('session_count')
            ->limit(10)
            ->get()
            ->map(fn ($row) => [
                'staff_id' => (int) $row->id,
                'staff_number' => $row->staff_number,
                'trainer_name' => trim($row->first_name.' '.$row->last_name),
                'session_count' => (int) $row->session_count,
            ])
            ->all();

        $roomUtilization = LectureRoom::query()
            ->leftJoin('academic_timetables', function ($join) {
                $join->on('academic_timetables.lecture_room_id', '=', 'lecture_rooms.id')
                    ->whereNull('academic_timetables.deleted_at');
            })
            ->whereNull('lecture_rooms.deleted_at')
            ->where('lecture_rooms.is_active', true)
            ->select('lecture_rooms.id', 'lecture_rooms.name', 'lecture_rooms.code')
            ->selectRaw('COUNT(academic_timetables.id) as session_count')
            ->groupBy('lecture_rooms.id', 'lecture_rooms.name', 'lecture_rooms.code')
            ->orderByDesc('session_count')
            ->limit(10)
            ->get()
            ->map(fn ($row) => [
                'room_id' => (int) $row->id,
                'room_name' => trim(($row->code ? $row->code.' - ' : '').$row->name),
                'session_count' => (int) $row->session_count,
            ])
            ->all();

        $unitsWithoutTimetable = Unit::query()
            ->leftJoin('academic_timetable_curriculum_unit', 'academic_timetable_curriculum_unit.curriculum_unit_id', '=', 'units.id')
            ->join('curriculum_mappings', 'curriculum_mappings.id', '=', 'units.curriculum_mapping_id')
            ->join('courses', 'courses.id', '=', 'curriculum_mappings.course_id')
            ->join('curricula', 'curricula.id', '=', 'curriculum_mappings.curriculum_id')
            ->whereNull('academic_timetable_curriculum_unit.curriculum_unit_id')
            ->select(
                'units.id',
                'units.module_taught',
                'units.code as unit_code',
                'units.name as unit_name',
                'courses.name as course_name',
                'curricula.name as version_name'
            )
            ->orderBy('courses.name')
            ->orderBy('units.module_taught')
            ->limit(10)
            ->get()
            ->map(fn ($row) => [
                'curriculum_unit_id' => (int) $row->id,
                'course_name' => $row->course_name,
                'version_name' => $row->version_name,
                'module_taught' => (int) $row->module_taught,
                'unit_code' => $row->unit_code,
                'unit_name' => $row->unit_name,
            ])
            ->all();

        $lecturerClashes = $this->buildTimetableClashes('trainer_staff_id', 'staff');
        $roomClashes = $this->buildTimetableClashes('lecture_room_id', 'room');

        return [
            'filters' => $filters,
            'active_session' => $activeSession
                ? [
                    'id' => $activeSession->id,
                    'label' => $activeSession->display_name,
                ]
                : null,
            'metrics' => [
                'eligible_students' => (int) $eligibleStudents,
                'registered_students' => (int) $registeredStudents,
                'session_registration_rate' => $sessionRegistrationRate,
                'students_not_registered_count' => count($studentsNotRegistered),
                'mapped_units_count' => (int) $mappedUnitsCount,
                'units_with_timetable_count' => (int) $unitsWithTimetableCount,
                'timetable_completion_rate' => $timetableCompletionRate,
                'lecturer_clash_count' => count($lecturerClashes),
                'room_clash_count' => count($roomClashes),
            ],
            'breakdowns' => [
                'students_by_module' => $studentCountsByModule,
                'students_by_year' => $studentCountsByYear,
                'lecturer_load' => $lecturerLoad,
                'room_utilization' => $roomUtilization,
            ],
            'exceptions' => [
                'students_not_registered' => $studentsNotRegistered,
                'units_without_timetable' => $unitsWithoutTimetable,
                'lecturer_clashes' => $lecturerClashes,
                'room_clashes' => $roomClashes,
            ],
        ];
    }

    protected function buildTimetableClashes(string $dimension, string $type): array
    {
        $clashes = [];
        $previousEntry = null;

        foreach (AcademicTimetable::query()
            ->whereNull('deleted_at')
            ->whereNotNull($dimension)
            ->select('id', $dimension, 'day_of_week', 'start_time', 'end_time')
            ->orderBy($dimension)
            ->orderBy('day_of_week')
            ->orderBy('start_time')
            ->cursor() as $entry) {
            if ($previousEntry !== null) {
                $sameEntity = $previousEntry->{$dimension} === $entry->{$dimension};
                $sameDay = $previousEntry->day_of_week === $entry->day_of_week;

                if ($sameEntity && $sameDay && $previousEntry->end_time > $entry->start_time) {
                    $clashes[] = [
                        'type' => $type,
                        'entity_id' => (int) $entry->{$dimension},
                        'day_of_week' => $entry->day_of_week,
                        'first_timetable_id' => (int) $previousEntry->id,
                        'second_timetable_id' => (int) $entry->id,
                        'first_time_range' => substr((string) $previousEntry->start_time, 0, 5).' - '.substr((string) $previousEntry->end_time, 0, 5),
                        'second_time_range' => substr((string) $entry->start_time, 0, 5).' - '.substr((string) $entry->end_time, 0, 5),
                    ];

                    if (count($clashes) >= 10) {
                        break;
                    }
                }
            }

            $previousEntry = $entry;
        }

        return $clashes;
    }
}
