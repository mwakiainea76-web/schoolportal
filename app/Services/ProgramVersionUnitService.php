<?php

namespace App\Services;

use App\Models\ProgramVersionUnit;

class ProgramVersionUnitService
{
    public function store(array $data): ?string
    {
        $exists = ProgramVersionUnit::where('program_version_mapping_id', $data['program_version_mapping_id'])
            ->where('unit_id', $data['unit_id'])
            ->exists();

        if ($exists) {
            return 'Unit already added to this program version mapping.';
        }

        ProgramVersionUnit::create([
            'program_version_mapping_id' => $data['program_version_mapping_id'],
            'unit_id' => $data['unit_id'],
            'module_taught' => $data['module_taught'],
        ]);

        return null;
    }

    public function update(ProgramVersionUnit $curriculumUnit, array $data): ?string
    {
        $exists = ProgramVersionUnit::where('program_version_mapping_id', $data['program_version_mapping_id'])
            ->where('unit_id', $data['unit_id'])
            ->where('id', '!=', $curriculumUnit->id)
            ->exists();

        if ($exists) {
            return 'Unit already added to this program version mapping.';
        }

        $curriculumUnit->update([
            'program_version_mapping_id' => $data['program_version_mapping_id'],
            'unit_id' => $data['unit_id'],
            'module_taught' => $data['module_taught'],
        ]);

        return null;
    }

    public function delete(ProgramVersionUnit $curriculumUnit): void
    {
        $curriculumUnit->delete();
    }
}

