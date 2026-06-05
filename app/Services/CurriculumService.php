<?php

namespace App\Services;

use App\Models\ExamBody;
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
            Curriculum::create([
                'course_id' => $data['course_id'] ?? null,
                'exam_body_id' => $this->resolveExamBodyId($data['exam_body_code']),
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
            $curriculum->update([
                'course_id' => $data['course_id'] ?? $curriculum->course_id,
                'exam_body_id' => $this->resolveExamBodyId($data['exam_body_code']),
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

    protected function resolveExamBodyId(string $examBodyCode): ?int
    {
        return ExamBody::query()
            ->where('code', $examBodyCode)
            ->value('id');
    }
}
