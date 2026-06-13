<?php

namespace Database\Factories;

use App\Models\AcademicTimetable;
use App\Models\AcademicSession;
use App\Models\LectureRoom;
use App\Models\Staff;
use App\Models\Department;
use Illuminate\Database\Eloquent\Factories\Factory;

class AcademicTimetableFactory extends Factory
{
    protected $model = AcademicTimetable::class;

    public function definition(): array
    {
        return [
            'department_id' => Department::factory(),
            'academic_session_id' => AcademicSession::factory(),
            'trainer_staff_id' => Staff::factory(),
            'lecture_room_id' => LectureRoom::factory(),
            'day_of_week' => $this->faker->randomElement(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']),
            'start_time' => '08:00',
            'end_time' => '10:00',
        ];
    }
}
