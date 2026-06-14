<?php

namespace App\Services;

use App\Models\Curriculum;
use Illuminate\Support\Facades\DB;

class CurriculumService
{
    public function store(array $data): array
    {
        $exists = Curriculum::where(['exam_body_id' => $data['exam_body_id'], 'name' => $data['name']])->exists();

        if ($exists) {
            return [
                'status' => false,
                'message' => 'Curriculum already exists.',
            ];
        }

        DB::transaction(function () use ($data) {
            Curriculum::create([
                'exam_body_id' => $data['exam_body_id'],
                'name' => $data['name'],
                'is_active' => true,
                'description' => $data['description'] ?? null,
                'start_date' => now()->toDateString(),
                'end_date' => null,
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
        $exists = Curriculum::where(['exam_body_id' => $data['exam_body_id'], 'name' => $data['name']])
            ->whereKeyNot($curriculum->getKey())
            ->exists();

        if ($exists) {
            return [
                'status' => false,
                'message' => 'Curriculum already exists.',
            ];
        }

        DB::transaction(function () use ($curriculum, $data) {
            $curriculum->update([
                'exam_body_id' => $data['exam_body_id'],
                'name' => $data['name'],
                'is_active' => $curriculum->is_active,
                'description' => $data['description'] ?? null,
                'start_date' => $curriculum->start_date,
                'end_date' => $curriculum->end_date,
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

    public function disable(Curriculum $curriculum): array
    {
        $curriculum->update([
            'is_active' => false,
            'end_date' => $curriculum->end_date ?? now()->toDateString(),
            'updated_by' => auth()->id(),
        ]);

        return [
            'status' => true,
            'message' => 'Curriculum disabled successfully.',
        ];
    }

    public function reactivate(Curriculum $curriculum): array
    {
        $curriculum->update([
            'is_active' => true,
            'end_date' => null,
            'updated_by' => auth()->id(),
        ]);

        return [
            'status' => true,
            'message' => 'Curriculum reactivated successfully.',
        ];
    }
}
