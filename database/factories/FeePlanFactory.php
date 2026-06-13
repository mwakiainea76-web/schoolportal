<?php

namespace Database\Factories;

use App\Models\FeePlan;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<FeePlan>
 */
class FeePlanFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => $this->faker->sentence(3),
            'version' => 'v1',
            'is_active' => true,
            'created_by' => \App\Models\User::factory(),
        ];
    }
}
