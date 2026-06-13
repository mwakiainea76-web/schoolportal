<?php

namespace Database\Factories;

use App\Models\AcademicYear;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<AcademicYear>
 */
class AcademicYearFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $year = $this->faker->unique()->year;
        $academicYear = $year . '/' . ($year + 1);
        $isActive = false;

        return [
            'academic_year' => $academicYear,
            'label' => 'Academic Year ' . $academicYear,
            'start_date' => $this->faker->date(),
            'end_date' => $this->faker->date(),
            'status' => $isActive ? 'ongoing' : 'upcoming',
            'is_active' => $isActive, // 20% chance of being active
        ];
    }
}
