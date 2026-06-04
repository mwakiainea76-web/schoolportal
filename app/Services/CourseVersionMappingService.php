<?php

namespace App\Services;

use App\Models\Course;
use App\Models\CourseVersionMapping;
use Illuminate\Support\Facades\DB;

class CourseVersionMappingService
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
                $mapping = CourseVersionMapping::firstOrNew([
                    'course_id' => $course->id,
                    'course_version_id' => $data['course_version_id'],
                ]);

                if (! $mapping->exists) {
                    $mapping->created_by = auth()->id();
                }

                $mapping->fill([
                    'is_active' => $data['is_active'],
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

    public function update(CourseVersionMapping $courseVersionMapping, array $data): array
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
                $mapping = CourseVersionMapping::firstOrNew([
                    'course_id' => $course->id,
                    'course_version_id' => $data['course_version_id'],
                ]);

                if (! $mapping->exists) {
                    $mapping->created_by = auth()->id();
                }

                $mapping->fill([
                    'is_active' => $data['is_active'],
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

    public function delete(CourseVersionMapping $courseVersionMapping): array
    {
        if ($courseVersionMapping->units()->exists()) {
            return [
                'status' => false,
                'message' => 'Delete all course version units before deleting this course version mapping.',
            ];
        }

        $courseVersionMapping->delete();

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
