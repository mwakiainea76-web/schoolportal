<?php

namespace App\Services;

use App\Models\ProgramVersionMapping;
use Illuminate\Support\Facades\DB;

class ProgramVersionMappingService
{
    public function create(array $data): array
    {
        $exists = ProgramVersionMapping::where('program_version_id', $data['program_version_id'])
            ->where('program_id', $data['program_id'])
            ->exists();

        if ($exists) {
            return [
                'status' => false,
                'message' => 'ProgramVersion already registered.',
            ];
        }

        DB::transaction(function () use ($data) {
            if ($data['is_active']) {
                ProgramVersionMapping::where('program_id', $data['program_id'])
                    ->where('is_active', true)
                    ->update([
                        'is_active' => false,
                        'updated_by' => auth()->id(),
                    ]);
            }

            ProgramVersionMapping::create([
                'program_id' => $data['program_id'],
                'program_version_id' => $data['program_version_id'],
                'is_active' => $data['is_active'],
                'description' => $data['description'] ?? null,
                'created_by' => auth()->id(),
                'updated_by' => auth()->id(),
            ]);
        });

        return [
            'status' => true,
            'message' => 'ProgramVersion created successfully.',
        ];
    }

    public function update(ProgramVersionMapping $programVersionMapping, array $data): void
    {
        DB::transaction(function () use ($programVersionMapping, $data) {
            if ($data['is_active']) {
                ProgramVersionMapping::where('program_id', $data['program_id'])
                    ->whereKeyNot($programVersionMapping->getKey())
                    ->where('is_active', true)
                    ->update([
                        'is_active' => false,
                        'updated_by' => auth()->id(),
                    ]);
            }

            $programVersionMapping->update([
                'program_id' => $data['program_id'],
                'program_version_id' => $data['program_version_id'],
                'is_active' => $data['is_active'],
                'description' => $data['description'] ?? null,
                'updated_by' => auth()->id(),
            ]);
        });
    }

    public function delete(ProgramVersionMapping $programVersionMapping): array
    {
        if ($programVersionMapping->units()->exists()) {
            return [
                'status' => false,
                'message' => 'Delete all program version units before deleting this program version mapping.',
            ];
        }

        $programVersionMapping->delete();

        return [
            'status' => true,
            'message' => 'Program version mapping deleted successfully.',
        ];
    }
}


