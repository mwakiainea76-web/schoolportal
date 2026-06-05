<?php

namespace App\Services;

use App\Models\Course;
use App\Models\CurriculumMapping;
use Illuminate\Support\Facades\DB;

class CurriculumMappingService
{
    public function create(array $data): array
    {
        $courses = $this->coursesForExamBody((int) $data['exam_body_id']);

        if ($courses->isEmpty()) {
            return [
                'status' => false,
                'message' => 'No courses found under the selected exam body.',
            ];
        }

        $saved = 0;

        DB::transaction(function () use ($data, $courses, &$saved) {
            foreach ($courses as $course) {
                $mapping = CurriculumMapping::firstOrNew([
                    'course_id' => $course->id,
                    'curriculum_id' => $data['curriculum_id'],
                ]);

                if (! $mapping->exists) {
                    $mapping->created_by = auth()->id();
                }

                $mapping->fill([
                    'is_active' => $mapping->exists ? $mapping->is_active : false,
                    'description' => $data['description'] ?? null,
                    'updated_by' => auth()->id(),
                ])->save();

                $saved++;
            }
        });

        return [
            'status' => true,
            'message' => "Course version assigned to {$saved} course(s) under the selected exam body.",
        ];
    }

    public function update(CurriculumMapping $curriculumMapping, array $data): array
    {
        $courses = $this->coursesForExamBody((int) $data['exam_body_id']);

        if ($courses->isEmpty()) {
            return [
                'status' => false,
                'message' => 'No courses found under the selected exam body.',
            ];
        }

        DB::transaction(function () use ($data, $courses) {
            foreach ($courses as $course) {
                $mapping = CurriculumMapping::firstOrNew([
                    'course_id' => $course->id,
                    'curriculum_id' => $data['curriculum_id'],
                ]);

                if (! $mapping->exists) {
                    $mapping->created_by = auth()->id();
                }

                $mapping->fill([
                    'is_active' => $mapping->exists ? $mapping->is_active : false,
                    'description' => $data['description'] ?? null,
                    'updated_by' => auth()->id(),
                ])->save();
            }
        });

        return [
            'status' => true,
            'message' => 'Course version mappings updated for the selected exam body.',
        ];
    }

    public function activate(CurriculumMapping $curriculumMapping): array
    {
        $curriculumMapping->update([
            'is_active' => true,
            'updated_by' => auth()->id(),
        ]);

        return [
            'status' => true,
            'message' => 'Curriculum mapping activated successfully.',
        ];
    }

    public function deactivate(CurriculumMapping $curriculumMapping): array
    {
        $curriculumMapping->update([
            'is_active' => false,
            'updated_by' => auth()->id(),
        ]);

        return [
            'status' => true,
            'message' => 'Curriculum mapping deactivated successfully.',
        ];
    }

    public function delete(CurriculumMapping $curriculumMapping): array
    {
        if ($curriculumMapping->units()->exists()) {
            return [
                'status' => false,
                'message' => 'Delete all curriculum units before deleting this curriculum mapping.',
            ];
        }

        $curriculumMapping->delete();

        return [
            'status' => true,
            'message' => 'Course version mapping deleted successfully.',
        ];
    }

    protected function coursesForExamBody(int $examBodyId)
    {
        return Course::query()
            ->whereHas('certificationLevel', function ($query) use ($examBodyId) {
                $query->where('exam_body_id', $examBodyId);
            })
            ->orderBy('name')
            ->get(['id']);
    }
}
