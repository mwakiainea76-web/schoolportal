<?php

namespace Database\Factories;

use App\Models\Department;
use App\Models\User;
use App\Models\Student;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Student>
 */
class StudentFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'department_id' => Department::factory(),
            'first_name' => fake()->firstName(),
            'last_name' => fake()->lastName(),
            'other_name' => fake()->optional()->firstName(),
            'email' => fake()->unique()->safeEmail(),
            'phone_number' => fake()->phoneNumber(),
            'date_of_birth' => fake()->date('Y-m-d', '-18 years'),
            'county' => fake()->city(),
            'address' => fake()->address(),
            'gender' => fake()->randomElement(['male', 'female']),
            'religion' => fake()->randomElement(['Christian', 'Muslim', 'Hindu', 'Other']),
            'is_pwd' => false,
            'admission_number' => 'TVET/' . fake()->unique()->numerify('####/##'),
            'current_module' => (string) fake()->numberBetween(1, 6),
            'previous_school' => fake()->company() . ' High School',
            'fee_discount_percentage' => 0,
            'enrollment_status' => 'active',
        ];
    }
}
