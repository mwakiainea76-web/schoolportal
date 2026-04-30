<?php

namespace App\Services;

use App\Models\Curriculum;
use Illuminate\Support\Facades\DB;

class CurriculumService
{
    public function store(array $data): array
    {
        $exists = Curriculum::where('name', $data['name'])->exists();

        if ($exists) {
            return [
                'status' => false,
                'message' => 'Curriculum already exists.',
            ];
        }

        DB::transaction(function () use ($data) {
            if ($data['is_active']) {
                Curriculum::where('is_active', true)
                    ->update([
                        'is_active' => false,
                        'updated_by' => auth()->id(),
                    ]);
            }

            Curriculum::create([
                'name' => $data['name'],
                'is_active' => $data['is_active'],
                'description' => $data['description'] ?? null,
                'start_date' => $data['start_date'],
                'end_date' => $data['end_date'] ?? null,
                'created_by' => auth()->id(),
                'updated_by' => auth()->id(),
            ]);
        });

        return [
            'status' => true,
            'message' => 'Curriculum created successfully.',
        ];
    }

    public function update(Curriculum $curriculum, array $data): array
    {
        $exists = Curriculum::where('name', $data['name'])
            ->whereKeyNot($curriculum->getKey())
            ->exists();

        if ($exists) {
            return [
                'status' => false,
                'message' => 'Curriculum already exists.',
            ];
        }

        DB::transaction(function () use ($curriculum, $data) {
            if ($data['is_active']) {
                Curriculum::whereKeyNot($curriculum->getKey())
                    ->where('is_active', true)
                    ->update([
                        'is_active' => false,
                        'updated_by' => auth()->id(),
                    ]);
            }

            $curriculum->update([
                'name' => $data['name'],
                'is_active' => $data['is_active'],
                'description' => $data['description'] ?? null,
                'start_date' => $data['start_date'],
                'end_date' => $data['end_date'] ?? null,
                'updated_by' => auth()->id(),
            ]);
        });

        return [
            'status' => true,
            'message' => 'Curriculum updated successfully.',
        ];
    }

    public function delete(Curriculum $curriculum): void
    {
        $curriculum->delete();
    }
}
