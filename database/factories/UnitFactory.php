<?php

namespace Database\Factories;

use App\Models\Unit;
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
           'code' => $this->faker->unique()->lexify('UNIT???'),
            'name' => $this->faker->word,
            'credit_factor' => $this->faker->numberBetween(1, 10),
            'training_hours' => $this->faker->numberBetween(100, 400),
            'description' => $this->faker->sentence,
        ];
    }
}
