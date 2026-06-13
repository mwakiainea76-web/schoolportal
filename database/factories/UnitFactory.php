<?php

namespace Database\Factories;

use App\Models\Unit;
use App\Models\CurriculumMapping;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Unit>
 */
class UnitFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'curriculum_mapping_id' => CurriculumMapping::factory(),
            'code' => $this->faker->unique()->bothify('UNIT-####'),
            'name' => $this->faker->sentence(3),
            'credit_factor' => $this->faker->numberBetween(1, 10),
            'training_hours' => $this->faker->numberBetween(10, 100),
            'description' => $this->faker->paragraph,
            'scope' => $this->faker->randomElement(['basic', 'common', 'core']),
            'module_taught' => $this->faker->numberBetween(1, 6),
        ];
    }
}
