<?php

namespace App\Services;

use App\Models\CurriculumUnit;

class CurriculumUnitService
{
    public function store(array $data): ?string
    {
        $exists = CurriculumUnit::where('course_curriculum_id', $data['course_curriculum_id'])
            ->where('unit_id', $data['unit_id'])
            ->exists();

        if ($exists) {
            return 'Unit already added to this curriculum';
        }

        CurriculumUnit::create([
            'course_curriculum_id' => $data['course_curriculum_id'],
            'unit_id' => $data['unit_id'],
            'module_taught' => $data['module_taught'],
        ]);

        return null;
    }

    public function update(CurriculumUnit $curriculumUnit, array $data): ?string
    {
        $exists = CurriculumUnit::where('course_curriculum_id', $data['course_curriculum_id'])
            ->where('unit_id', $data['unit_id'])
            ->where('id', '!=', $curriculumUnit->id)
            ->exists();

        if ($exists) {
            return 'Unit already added to this curriculum';
        }

        $curriculumUnit->update([
            'course_curriculum_id' => $data['course_curriculum_id'],
            'unit_id' => $data['unit_id'],
            'module_taught' => $data['module_taught'],
        ]);

        return null;
    }

    public function delete(CurriculumUnit $curriculumUnit): void
    {
        $curriculumUnit->delete();
    }
}
