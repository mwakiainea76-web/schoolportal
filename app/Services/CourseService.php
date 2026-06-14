<?php

namespace App\Services;

use App\Models\CertificationLevel;
use App\Models\Course;
use App\Models\CurriculumMapping;
use App\Models\Unit;
use Illuminate\Support\Facades\DB;

class CourseService
{
    public function create(array $data): Course
    {
        $certificationLevel = CertificationLevel::findOrFail($data['certification_level_id']);

        return DB::transaction(function () use ($data, $certificationLevel) {
            $course = Course::create([
                'code' => $data['code'],
                'name' => $data['name'],
                'description' => $data['description'] ?? null,
                'initials' => $data['initials'],
                'duration_in_months' => $certificationLevel->duration_in_months,
                'certification_level_id' => $data['certification_level_id'],
                'department_id' => $data['department_id'],
            ]);

            $this->ensureCurriculumMapping($course, (int) $data['curriculum_id']);

            return $course;
        });
    }

    public function update(Course $course, array $data): Course
    {
        $certificationLevel = CertificationLevel::findOrFail($data['certification_level_id']);

        DB::transaction(function () use ($course, $data, $certificationLevel) {
            $course->update([
                'code' => $data['code'],
                'name' => $data['name'],
                'description' => $data['description'] ?? null,
                'initials' => $data['initials'],
                'duration_in_months' => $certificationLevel->duration_in_months,
                'certification_level_id' => $data['certification_level_id'],
                'department_id' => $data['department_id'],
            ]);

            $this->ensureCurriculumMapping($course, (int) $data['curriculum_id']);
        });

        return $course;
    }

    public function delete(Course $course): array
    {
        if (Unit::where('course_id', $course->id)->exists()) {
            return [
                'status' => false,
                'message' => 'Delete all units linked to this course first.',
            ];
        }

        $course->delete();

        return [
            'status' => true,
            'message' => 'Course deleted successfully.',
        ];
    }

    // -------------------------------------------------------------------------
    // Internals
    // -------------------------------------------------------------------------

    private function ensureCurriculumMapping(Course $course, int $curriculumId): CurriculumMapping
    {
        return CurriculumMapping::firstOrCreate(
            [
                'course_id' => $course->id,
                'curriculum_id' => $curriculumId,
            ],
            [
                'is_active' => true,
                'description' => $course->description,
                'created_by' => auth()->id(),
                'updated_by' => auth()->id(),
            ]
        );
    }
}
