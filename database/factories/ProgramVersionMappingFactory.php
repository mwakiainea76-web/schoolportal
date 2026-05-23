<?php

namespace Database\Factories;

use App\Models\ProgramVersionMapping;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<ProgramVersionMapping>
 */
class ProgramVersionMappingFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'course_id' => \App\Models\Program::factory(),
            'curriculum_id' => \App\Models\ProgramVersion::factory(),

        ];
    }
}

