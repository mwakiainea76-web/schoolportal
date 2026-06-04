<?php

namespace App\Services;

use App\Models\ExamBody;
use App\Models\CourseVersion;
use Illuminate\Support\Facades\DB;

class CourseVersionService
{
    public function store(array $data): array
    {
        $exists = CourseVersion::where('name', $data['name'])->exists();

        if ($exists) {
            return [
                'status' => false,
                'message' => 'CourseVersion already exists.',
            ];
        }

        DB::transaction(function () use ($data) {
            CourseVersion::create([
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
            'message' => 'CourseVersion created successfully.',
        ];
    }

    public function update(CourseVersion $curriculum, array $data): array
    {
        $exists = CourseVersion::where('name', $data['name'])
            ->whereKeyNot($curriculum->getKey())
            ->exists();

        if ($exists) {
            return [
                'status' => false,
                'message' => 'CourseVersion already exists.',
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
            'message' => 'CourseVersion updated successfully.',
        ];
    }

    public function delete(CourseVersion $curriculum): void
    {
        $curriculum->delete();
    }

    protected function resolveExamBodyId(string $examBodyCode): ?int
    {
        return ExamBody::query()
            ->where('code', $examBodyCode)
            ->value('id');
    }
}
