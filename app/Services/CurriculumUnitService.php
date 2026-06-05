<?php

namespace App\Services;

use App\Models\CurriculumUnit;
use App\Models\CurriculumMapping;

class CurriculumUnitService
{
    public function store(array $data): ?string
    {
        $mapping = CurriculumMapping::query()
            ->whereKey($data['curriculum_mapping_id'])
            ->where('curriculum_id', $data['curriculum_id'])
            ->first();

        if (! $mapping) {
            return 'Selected course does not belong to the selected curriculum.';
        }

        $exists = CurriculumUnit::where('curriculum_id', $data['curriculum_id'])
            ->where('unit_id', $data['unit_id'])
            ->exists();

        if ($exists) {
            return 'Unit already added to this curriculum.';
        }

        CurriculumUnit::create([
            'curriculum_id' => $data['curriculum_id'],
            'curriculum_mapping_id' => $data['curriculum_mapping_id'],
            'unit_id' => $data['unit_id'],
            'module_taught' => $data['module_taught'],
            'module' => $data['module'] ?? $data['module_taught'],
            'semester' => $data['semester'] ?? null,
            'is_compulsory' => $data['is_compulsory'] ?? true,
            'sort_order' => $data['sort_order'] ?? 0,
        ]);

        return null;
    }

    public function update(CurriculumUnit $curriculumUnit, array $data): ?string
    {
        $mapping = CurriculumMapping::query()
            ->whereKey($data['curriculum_mapping_id'])
            ->where('curriculum_id', $data['curriculum_id'])
            ->first();

        if (! $mapping) {
            return 'Selected course does not belong to the selected curriculum.';
        }

        $exists = CurriculumUnit::where('curriculum_id', $data['curriculum_id'])
            ->where('unit_id', $data['unit_id'])
            ->where('id', '!=', $curriculumUnit->id)
            ->exists();

        if ($exists) {
            return 'Unit already added to this curriculum.';
        }

        $curriculumUnit->update([
            'curriculum_id' => $data['curriculum_id'],
            'curriculum_mapping_id' => $data['curriculum_mapping_id'],
            'unit_id' => $data['unit_id'],
            'module_taught' => $data['module_taught'],
            'module' => $data['module'] ?? $data['module_taught'],
            'semester' => $data['semester'] ?? null,
            'is_compulsory' => $data['is_compulsory'] ?? true,
            'sort_order' => $data['sort_order'] ?? 0,
        ]);

        return null;
    }

    public function delete(CurriculumUnit $curriculumUnit): void
    {
        $curriculumUnit->delete();
    }
}
