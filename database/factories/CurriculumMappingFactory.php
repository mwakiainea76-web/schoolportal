<?php

namespace Database\Factories;

use App\Models\CurriculumMapping;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<CurriculumMapping>
 */
class CurriculumMappingFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'course_id' => \App\Models\Course::factory(),
            'curriculum_id' => \App\Models\Curriculum::factory(),

        ];
    }
}

