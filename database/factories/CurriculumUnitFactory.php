<?php

namespace Database\Factories;

use App\Models\CurriculumUnit;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<CurriculumUnit>
 */
class CurriculumUnitFactory extends Factory
{
    protected $model = CurriculumUnit::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'module_taught' => $this->faker->numberBetween(1, 10),
            'curriculum_id' => \App\Models\Curriculum::factory(),
            'unit_id' => \App\Models\Unit::factory(),

        ];
    }
}
