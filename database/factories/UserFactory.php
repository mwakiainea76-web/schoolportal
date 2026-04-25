<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

/**
 * @extends Factory<User>
 */
class UserFactory extends Factory
{
    /**
     * The current password being used by the factory.
     */
    protected static ?string $password;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [

            'first_name' => fake()->firstName(),
            'last_name' => fake()->lastName(),
            'other_name' => fake()->optional()->firstName(),
            'phone_number' => fake()->phoneNumber(),
            'date_of_birth' => fake()->date(),
            'county' => fake()->state(),
            'address' => fake()->address(),
            'gender' => fake()->randomElement(['male', 'female']),
            'profile_photo' => null,
            'religion' => fake()->randomElement(['Christian', 'Muslim', 'N/A']),
            'email' => fake()->unique()->safeEmail(),
            'email_verified_at' => now(),
            'is_pwd' => false,
            'disability_type' => null,
            'medical_condition' => null,
            'is_active' => true,
            'password' => static::$password ??= Hash::make('@123Password'),
            'remember_token' => Str::random(10),

        ];
    }

    /**
     * Indicate that the model's email address should be unverified.
     */
    public function unverified(): static
    {
        return $this->state(fn (array $attributes) => [
            'email_verified_at' => null,
        ]);
    }
}
