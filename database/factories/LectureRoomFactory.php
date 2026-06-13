<?php

namespace Database\Factories;

use App\Models\LectureRoom;
use App\Models\Department;
use Illuminate\Database\Eloquent\Factories\Factory;

class LectureRoomFactory extends Factory
{
    protected $model = LectureRoom::class;

    public function definition(): array
    {
        return [
            'department_id' => Department::factory(),
            'name' => 'Room ' . $this->faker->unique()->numberBetween(100, 999),
            'code' => $this->faker->unique()->bothify('LR-###'),
            'capacity' => $this->faker->numberBetween(20, 100),
            'location' => $this->faker->sentence(2),
            'is_active' => true,
        ];
    }
}
