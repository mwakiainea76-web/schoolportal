<?php

namespace Database\Factories;

use App\Models\CertificationLevel;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<CertificationLevel>
 */
class CertificationLevelFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'exam_body_id' => \App\Models\ExamBody::factory(),
            'code' => $this->faker->unique()->lexify('CL???'),
            'name' => $this->faker->word,
            'description' => $this->faker->sentence,
            'entry_grade' => $this->faker->randomElement(['A', 'B', 'C', 'D', 'E']),
        ];
    }
}
