<?php

namespace App\Services;

use App\Models\CourseCurriculum;
use Illuminate\Support\Facades\DB;

class CourseCurriculumService
{
    public function create(array $data): array
    {
        $exists = CourseCurriculum::where('curriculum_id', $data['curriculum_id'])
            ->where('course_id', $data['course_id'])
            ->exists();

        if ($exists) {
            return [
                'status' => false,
                'message' => 'Curriculum already registered.',
            ];
        }

        DB::transaction(function () use ($data) {
            if ($data['is_active']) {
                CourseCurriculum::where('course_id', $data['course_id'])
                    ->where('is_active', true)
                    ->update([
                        'is_active' => false,
                        'updated_by' => auth()->id(),
                    ]);
            }

            CourseCurriculum::create([
                'course_id' => $data['course_id'],
                'curriculum_id' => $data['curriculum_id'],
                'is_active' => $data['is_active'],
                'description' => $data['description'] ?? null,
                'created_by' => auth()->id(),
                'updated_by' => auth()->id(),
            ]);
        });

        return [
            'status' => true,
            'message' => 'Curriculum created successfully.',
        ];
    }

    public function update(CourseCurriculum $curriculum, array $data): void
    {
        DB::transaction(function () use ($curriculum, $data) {
            if ($data['is_active']) {
                CourseCurriculum::where('course_id', $data['course_id'])
                    ->whereKeyNot($curriculum->getKey())
                    ->where('is_active', true)
                    ->update([
                        'is_active' => false,
                        'updated_by' => auth()->id(),
                    ]);
            }

            $curriculum->update([
                'course_id' => $data['course_id'],
                'curriculum_id' => $data['curriculum_id'],
                'is_active' => $data['is_active'],
                'description' => $data['description'] ?? null,
                'updated_by' => auth()->id(),
            ]);
        });
    }

    public function delete(CourseCurriculum $curriculum): array
    {
        if ($curriculum->units()->exists()) {
            return [
                'status' => false,
                'message' => 'Delete all curriculum units before deleting this curriculum.',
            ];
        }

        $curriculum->delete();

        return [
            'status' => true,
            'message' => 'Curriculum deleted successfully.',
        ];
    }
}
