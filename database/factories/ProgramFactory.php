<?php

namespace Database\Factories;

use App\Models\CertificationLevel;
use App\Models\Program;
use App\Models\Department;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Program>
 */
class ProgramFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $certificationLevel = CertificationLevel::factory()->state([
            'modules' => 3,
            'duration_in_months' => 12,
        ]);

        return [
            'code' => $this->faker->unique()->lexify('CRS???'),
            'name' => $this->faker->word,
            'description' => $this->faker->sentence,
            'duration_in_months' => 12,
            'initials' => $this->faker->unique()->lexify('CRS???'),
            'is_active' => $this->faker->boolean(20), // 20% chance of being active
            'certification_level_id' => $certificationLevel,
            'department_id' => Department::factory(),
        ];
    }
}
