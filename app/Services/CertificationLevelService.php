<?php

namespace App\Services;

use App\Models\CertificationLevel;
use App\Models\Course;

class CertificationLevelService
{
    public function create(array $data): CertificationLevel
    {
        return CertificationLevel::create($data);
    }

    public function update(CertificationLevel $level, array $data): CertificationLevel
    {
        $level->update($data);
        return $level;
    }

    public function delete(CertificationLevel $level): array
    {
        $hasCourses = Course::where('certification_level_id', $level->id)->exists();

        if ($hasCourses) {
            return [
                'status' => false,
                'message' => 'To continue delete all courses linked to this certification level first',
            ];
        }

        $level->delete();

        return [
            'status' => true,
            'message' => 'Certification level deleted successfully.',
        ];
    }

    public function search(?string $q, ?int $examBodyId)
    {
        return CertificationLevel::query()
            ->when($examBodyId, function ($query) use ($examBodyId) {
                $query->where('exam_body_id', $examBodyId);
            })
            ->when($q, function ($query) use ($q) {
                $query->where('name', 'like', "{$q}%")
                      ->orWhere('code', 'like', "{$q}%");
            })
            ->orderBy('name', 'asc')
            ->limit(10)
            ->get()
            ->map(fn ($l) => [
                'id' => $l->id,
                'name' => $l->name,
            ]);
    }
}