<?php

namespace App\Services;

use App\Models\Course;
use App\Models\Unit;

class CourseService
{
    public function create(array $data): Course
    {
        return Course::create([
            'code' => $data['code'],
            'name' => $data['name'],
            'description' => $data['description'] ?? null,
            'initials' => $data['initials'],
            'is_active' => $data['is_active'],
            'duration_in_months' => $data['duration_in_months'],
            'certification_level_id' => $data['certification_level_id'],
            'department_id' => $data['department_id'],
        ]);
    }

    public function update(Course $course, array $data): Course
    {
        $course->update([
            'code' => $data['code'],
            'name' => $data['name'],
            'description' => $data['description'] ?? null,
            'initials' => $data['initials'],
            'is_active' => $data['is_active'],
            'duration_in_months' => $data['duration_in_months'],
            'certification_level_id' => $data['certification_level_id'],
            'department_id' => $data['department_id'],
        ]);

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
}
