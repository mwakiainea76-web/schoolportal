<?php

namespace App\Services;

use App\Models\ProgramVersion;
use Illuminate\Support\Facades\DB;

class ProgramVersionService
{
    public function store(array $data): array
    {
        $exists = ProgramVersion::where('name', $data['name'])->exists();

        if ($exists) {
            return [
                'status' => false,
                'message' => 'ProgramVersion already exists.',
            ];
        }

        DB::transaction(function () use ($data) {
            $isActive = (bool) ($data['is_active'] ?? false);

            if ($isActive) {
                ProgramVersion::where('is_active', true)
                    ->update([
                        'is_active' => false,
                        'updated_by' => auth()->id(),
                    ]);
            }

            ProgramVersion::create([
                'name' => $data['name'],
                'is_active' => $isActive,
                'description' => $data['description'] ?? null,
                'start_date' => $data['start_date'] ?? null,
                'end_date' => $data['end_date'] ?? null,
                'created_by' => auth()->id(),
                'updated_by' => auth()->id(),
            ]);
        });

        return [
            'status' => true,
            'message' => 'ProgramVersion created successfully.',
        ];
    }

    public function update(ProgramVersion $curriculum, array $data): array
    {
        $exists = ProgramVersion::where('name', $data['name'])
            ->whereKeyNot($curriculum->getKey())
            ->exists();

        if ($exists) {
            return [
                'status' => false,
                'message' => 'ProgramVersion already exists.',
            ];
        }

        if ($curriculum->end_date && ($data['version_state'] ?? null) === 'start') {
            return [
                'status' => false,
                'message' => 'This program version is closed and cannot be reactivated.',
            ];
        }

        DB::transaction(function () use ($curriculum, $data) {
            $versionState = $data['version_state'] ?? ($curriculum->is_active ? 'start' : 'end');
            $isActive = $versionState === 'start';
            $startDate = $curriculum->start_date;
            $endDate = $curriculum->end_date;

            if ($isActive) {
                $startDate = $startDate ?: now()->toDateString();
                $endDate = null;
            } else {
                $endDate = now()->toDateString();
            }

            if ($isActive) {
                ProgramVersion::whereKeyNot($curriculum->getKey())
                    ->where('is_active', true)
                    ->update([
                        'is_active' => false,
                        'updated_by' => auth()->id(),
                    ]);
            }

            $curriculum->update([
                'name' => $data['name'],
                'is_active' => $isActive,
                'description' => $data['description'] ?? null,
                'start_date' => $startDate,
                'end_date' => $endDate,
                'updated_by' => auth()->id(),
            ]);
        });

        return [
            'status' => true,
            'message' => 'ProgramVersion updated successfully.',
        ];
    }

    public function delete(ProgramVersion $curriculum): void
    {
        $curriculum->delete();
    }
}

