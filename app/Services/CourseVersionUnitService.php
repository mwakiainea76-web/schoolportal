<?php

namespace App\Services;

use App\Models\CourseVersionUnit;
use App\Models\CourseVersionMapping;

class CourseVersionUnitService
{
    public function store(array $data): ?string
    {
        $mapping = CourseVersionMapping::query()
            ->whereKey($data['course_version_mapping_id'])
            ->where('course_version_id', $data['course_version_id'])
            ->first();

        if (! $mapping) {
            return 'Selected course does not belong to the selected curriculum.';
        }

        $exists = CourseVersionUnit::where('course_version_id', $data['course_version_id'])
            ->where('unit_id', $data['unit_id'])
            ->exists();

        if ($exists) {
            return 'Unit already added to this curriculum.';
        }

        CourseVersionUnit::create([
            'course_version_id' => $data['course_version_id'],
            'course_version_mapping_id' => $data['course_version_mapping_id'],
            'unit_id' => $data['unit_id'],
            'module_taught' => $data['module_taught'],
            'module' => $data['module'] ?? $data['module_taught'],
            'semester' => $data['semester'] ?? null,
            'is_compulsory' => $data['is_compulsory'] ?? true,
            'sort_order' => $data['sort_order'] ?? 0,
        ]);

        return null;
    }

    public function update(CourseVersionUnit $curriculumUnit, array $data): ?string
    {
        $mapping = CourseVersionMapping::query()
            ->whereKey($data['course_version_mapping_id'])
            ->where('course_version_id', $data['course_version_id'])
            ->first();

        if (! $mapping) {
            return 'Selected course does not belong to the selected curriculum.';
        }

        $exists = CourseVersionUnit::where('course_version_id', $data['course_version_id'])
            ->where('unit_id', $data['unit_id'])
            ->where('id', '!=', $curriculumUnit->id)
            ->exists();

        if ($exists) {
            return 'Unit already added to this curriculum.';
        }

        $curriculumUnit->update([
            'course_version_id' => $data['course_version_id'],
            'course_version_mapping_id' => $data['course_version_mapping_id'],
            'unit_id' => $data['unit_id'],
            'module_taught' => $data['module_taught'],
            'module' => $data['module'] ?? $data['module_taught'],
            'semester' => $data['semester'] ?? null,
            'is_compulsory' => $data['is_compulsory'] ?? true,
            'sort_order' => $data['sort_order'] ?? 0,
        ]);

        return null;
    }

    public function delete(CourseVersionUnit $curriculumUnit): void
    {
        $curriculumUnit->delete();
    }
}
