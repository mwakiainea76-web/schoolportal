<?php

namespace Database\Factories;

use App\Models\Course;
use App\Models\Curriculum;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Curriculum>
 */
class CurriculumFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => $this->faker->sentence(2),
            'course_id' => Course::factory(),
            'description' => $this->faker->sentence,
            'is_active' => true,
            'start_date' => now(),
            'end_date' => now()->addMonths(6),
        ];
    }
}
