<?php

namespace App\Services;

use App\Models\Curriculum;

class CurriculumService
{
    public function create(array $data): array
    {
        $exists = Curriculum::where('name', $data['name'])
            ->where('course_id', $data['course_id'])
            ->exists();

        if ($exists) {
            return [
                'status' => false,
                'message' => 'Curriculum already registered.'
            ];
        }

        Curriculum::create([
            'name' => $data['name'],
            'is_active' => $data['is_active'],
            'course_id' => $data['course_id'],
            'description' => $data['description'] ?? null,
            'start_date' => $data['start_date'] ?? null,
            'end_date' => $data['end_date'] ?? null,
        ]);

        return [
            'status' => true,
            'message' => 'Curriculum created successfully.'
        ];
    }

    public function update(Curriculum $curriculum, array $data): void
    {
        $curriculum->update([
            'start_date' => $data['start_date'] ?? null,
            'is_active' => $data['is_active'],
            'description' => $data['description'],
            'name' => $data['name'],
            'course_id' => $data['course_id'],
            'end_date' => $data['end_date'] ?? null,
        ]);
    }

    public function delete(Curriculum $curriculum): array
    {
        if ($curriculum->units()->exists()) {
            return [
                'status' => false,
                'message' => 'Delete all curriculum units before deleting this curriculum.'
            ];
        }

        $curriculum->delete();

        return [
            'status' => true,
            'message' => 'Curriculum deleted successfully.'
        ];
    }
}