<?php

namespace Database\Factories;

use App\Models\Staff;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Staff>
 */
class StaffFactory extends Factory
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
            'date_of_birth' => fake()->date('Y-m-d', '-25 years'),
            'county' => fake()->city(),
            'address' => fake()->address(),
            'gender' => fake()->randomElement(['male', 'female']),
            'religion' => fake()->randomElement(['Christian', 'Muslim', 'Hindu', 'Other']),
            'is_pwd' => false,
            'designation' => fake()->jobTitle(),
            'staff_number' => 'STAFF/' . fake()->unique()->numerify('####/##'),
            'national_id_number' => fake()->unique()->numerify('########'),
            'salary' => fake()->randomFloat(2, 30000, 150000),
            'hired_date' => fake()->date(),
            'employment_type' => fake()->randomElement(['Permanent', 'Contract', 'Part-time']),
            'highest_qualification' => fake()->randomElement(['PhD', 'Masters', 'Bachelors', 'Diploma']),
            'specialization' => fake()->word(),
            'kra_pin' => 'A' . fake()->numerify('#########') . 'X',
            'nhif_number' => fake()->numerify('########'),
            'nssf_number' => fake()->numerify('########'),
            'staff_status' => 'active',
        ];
    }
}
