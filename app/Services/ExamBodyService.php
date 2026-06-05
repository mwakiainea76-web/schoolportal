<?php

namespace App\Services;

use App\Models\Curriculum;
use App\Models\ExamBody;
use Illuminate\Support\Facades\DB;

class ExamBodyService
{
    public function create(array $data): ExamBody
    {
        return DB::transaction(function () use ($data) {
            $examBody = ExamBody::create($data);

            Curriculum::firstOrCreate(
                [
                    'exam_body_id' => $examBody->id,
                    'name' => trim($examBody->code.' Default'),
                ],
                [
                    'course_id' => null,
                    'is_active' => true,
                    'description' => 'Default curriculum for '.$examBody->name,
                    'start_date' => now()->toDateString(),
                    'end_date' => null,
                    'created_by' => auth()->id(),
                    'updated_by' => auth()->id(),
                ]
            );

            return $examBody;
        });
    }

    public function update(ExamBody $examBody, array $data): ExamBody
    {
        $examBody->update($data);
        return $examBody;
    }

    public function delete(ExamBody $examBody): array
    {
        if ($examBody->certificationLevels()->exists()) {
            return [
                'status' => false,
                'message' => 'Delete certification levels first',
            ];
        }

        $examBody->delete();

        return [
            'status' => true,
            'message' => 'Exam body deleted successfully',
        ];
    }

    public function search(?string $q)
    {
        return ExamBody::query()
            ->when($q, function ($query) use ($q) {
                $query->where('name', 'like', "{$q}%")
                      ->orWhere('code', 'like', "{$q}%");
            })
            ->orderBy('name')
            ->limit(10)
            ->get()
            ->map(fn ($b) => [
                'id' => $b->id,
                'name' => $b->code . ' - ' . $b->name,
            ]);
    }
}
