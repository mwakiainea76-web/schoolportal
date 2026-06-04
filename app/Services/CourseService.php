<?php

namespace App\Services;

use App\Models\CertificationLevel;
use App\Models\Course;
use App\Models\CourseVersionMapping;
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

            $this->ensureCourseVersionMapping($course, (int) $data['course_version_id']);

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

            if (! empty($data['course_version_id'])) {
                $this->ensureCourseVersionMapping($course, (int) $data['course_version_id']);
            }
        });

        return $course;
    }

    public function delete(Course $course): array
    {
        $hasUnits = Unit::where('course_id', $course->id)->exists();

        if ($hasUnits) {
            return [
                'status' => false,
                'message' => 'To continue delete all units linked to this course first',
            ];
        }

        $course->delete();

        return [
            'status' => true,
            'message' => 'Course deleted successfully.',
        ];
    }

    public function search(?string $q)
    {
        return Course::query()
            ->with('certificationLevel:id,name')
            ->when($q, function ($query) use ($q) {
                $query->where(function ($sub) use ($q) {
                    $sub->where('name', 'like', "{$q}%")
                        ->orWhere('code', 'like', "{$q}%");
                });
            })
            ->orderBy('name', 'asc')
            ->limit(10)
            ->get(['id', 'name', 'code', 'certification_level_id'])
            ->map(fn ($course) => [
                'id' => $course->id,
                'name' => $course->display_name, // ✅ single source of truth
            ]);
    }

    protected function ensureCourseVersionMapping(Course $course, int $courseVersionId): CourseVersionMapping
    {
        return CourseVersionMapping::firstOrCreate(
            [
                'course_id' => $course->id,
                'course_version_id' => $courseVersionId,
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
