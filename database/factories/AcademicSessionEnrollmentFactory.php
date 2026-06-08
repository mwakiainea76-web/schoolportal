<?php

namespace Database\Factories;

use App\Models\AcademicSession;
use App\Models\AcademicSessionEnrollment;
use App\Models\CourseEnrollment;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<AcademicSessionEnrollment>
 */
class AcademicSessionEnrollmentFactory extends Factory
{
    protected $model = AcademicSessionEnrollment::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'course_enrollment_id' => CourseEnrollment::factory(),
            'academic_session_id' => AcademicSession::factory(),
            'year_of_study' => 1,
            'module' => 1,
            'status' => 'active',
        ];
    }
}
