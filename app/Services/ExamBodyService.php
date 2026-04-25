<?php

namespace App\Services;

use App\Models\ExamBody;

class ExamBodyService
{
    public function create(array $data): ExamBody
    {
        return ExamBody::create($data);
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