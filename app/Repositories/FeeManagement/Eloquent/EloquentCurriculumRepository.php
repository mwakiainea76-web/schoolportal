<?php

namespace App\Repositories\FeeManagement\Eloquent;

use App\Models\ProgramVersion;
use App\Repositories\FeeManagement\Contracts\ProgramVersionRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

class EloquentProgramVersionRepository implements ProgramVersionRepositoryInterface
{
    public function findActiveById(int $id): ?ProgramVersion
    {
        return ProgramVersion::query()->active()->find($id);
    }

    public function activeByDepartmentAndCertificationLevel(int $departmentId, int $certificationLevelId): Collection
    {
        return ProgramVersion::query()
            ->active()
            ->whereHas('courseCurricula', function ($query) use ($departmentId, $certificationLevelId) {
                $query->where('is_active', true)
                    ->whereHas('course', function ($courseQuery) use ($departmentId, $certificationLevelId) {
                        $courseQuery->where('department_id', $departmentId)
                            ->where('certification_level_id', $certificationLevelId);
                    });
            })
            ->orderBy('name')
            ->get();
    }
}

