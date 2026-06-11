<?php

namespace Database\Factories;

use App\Models\AcademicSession;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<AcademicSession>
 */
class AcademicSessionFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $sessionNo = $this->faker->unique()->randomNumber(2);
        $isActive = $this->faker->boolean(20);

        return [
            'academic_year_id' => \App\Models\AcademicYear::factory(),
            'session_No' => $sessionNo,
            'session_number' => $sessionNo,
            'label' => 'Session ' . $sessionNo,
            'start_date' => $this->faker->date(),
            'end_date' => $this->faker->date(),
            'status' => $isActive ? 'ongoing' : 'upcoming',
            'is_active' => $isActive, // 20% chance of being current
        ];
    }
}
