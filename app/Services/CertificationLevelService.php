<?php

namespace App\Services;

use App\Models\CertificationLevel;
use App\Models\Program;

class CertificationLevelService
{
    public function create(array $data): CertificationLevel
    {
        $data['duration_in_months'] = $this->durationFromModules($data['modules']);

        return CertificationLevel::create($data);
    }

    public function update(CertificationLevel $level, array $data): CertificationLevel
    {
        $data['duration_in_months'] = $this->durationFromModules($data['modules']);

        $level->update($data);

        Program::where('certification_level_id', $level->id)
            ->update(['duration_in_months' => $data['duration_in_months']]);

        return $level;
    }

    public function delete(CertificationLevel $level): array
    {
        $hasPrograms = Program::where('certification_level_id', $level->id)->exists();

        if ($hasPrograms) {
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
                $query->where(function ($searchQuery) use ($q) {
                    $searchQuery->where('name', 'like', "{$q}%")
                        ->orWhere('code', 'like', "{$q}%");
                });
            })
            ->orderBy('name', 'asc')
            ->limit(10)
            ->get()
            ->map(fn ($l) => [
                'id' => $l->id,
                'name' => $l->name,
                'modules' => $l->modules,
                'duration_in_months' => $l->duration_in_months,
            ]);
    }

    private function durationFromModules(int|string $modules): int
    {
        return max((int) $modules, 1) * 4;
    }
}
