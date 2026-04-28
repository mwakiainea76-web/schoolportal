<?php

namespace Database\Factories;

use App\Models\AcademicSession;
use App\Models\Curriculum;
use App\Models\Department;
use App\Models\FeeModel;
use App\Models\FeeTemplate;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<FeeModel>
 */
class FeeModelFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $scope = $this->faker->randomElement(['global', 'department', 'curriculum']);
        $validFrom = $this->faker->dateTimeBetween('-1 year', '+6 months');

        return [
            'fee_template_id' => FeeTemplate::factory(),
            'curricula_id' => $scope === 'curriculum' ? Curriculum::factory() : null,
            'academic_session_id' => AcademicSession::factory(),
            'department_id' => $scope === 'department' ? Department::factory() : null,
            'scope' => $scope,
            'priority' => $this->faker->randomElement(['60', '70', '80']),
            'valid_from' => $validFrom,
            'valid_until' => $this->faker->optional(0.7)->dateTimeBetween($validFrom, '+1 year'),
            'is_active' => $this->faker->boolean(80), // 80% chance of being active
            'sort_order' => $this->faker->numberBetween(0, 100),
        ];
    }

    /**
     * Indicate that the fee model is global.
     */
    public function global(): static
    {
        return $this->state(fn (array $attributes) => [
            'scope' => 'global',
            'department_id' => null,
            'curricula_id' => null,
        ]);
    }

    /**
     * Indicate that the fee model is for a department.
     */
    public function forDepartment(): static
    {
        return $this->state(fn (array $attributes) => [
            'scope' => 'department',
            'department_id' => Department::factory(),
            'curricula_id' => null,
        ]);
    }

    /**
     * Indicate that the fee model is for a curriculum.
     */
    public function forCurriculum(): static
    {
        return $this->state(fn (array $attributes) => [
            'scope' => 'curriculum',
            'curricula_id' => Curriculum::factory(),
            'department_id' => null,
        ]);
    }

    /**
     * Indicate that the fee model is active.
     */
    public function active(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_active' => true,
        ]);
    }

    /**
     * Indicate that the fee model is inactive.
     */
    public function inactive(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_active' => false,
        ]);
    }

    /**
     * Indicate that the fee model is currently valid.
     */
    public function valid(): static
    {
        return $this->state(function (array $attributes) {
            $validFrom = $this->faker->dateTimeBetween('-6 months', '-1 month');
            $validUntil = $this->faker->dateTimeBetween('+1 month', '+6 months');

            return [
                'valid_from' => $validFrom,
                'valid_until' => $validUntil,
            ];
        });
    }

    /**
     * Indicate that the fee model has expired.
     */
    public function expired(): static
    {
        return $this->state(function (array $attributes) {
            $validFrom = $this->faker->dateTimeBetween('-1 year', '-6 months');
            $validUntil = $this->faker->dateTimeBetween('-5 months', '-1 month');

            return [
                'valid_from' => $validFrom,
                'valid_until' => $validUntil,
            ];
        });
    }
}
