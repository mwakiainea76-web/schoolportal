<?php

namespace App\Repositories\FeeManagement\Eloquent;

use App\Models\Curriculum;
use App\Repositories\FeeManagement\Contracts\CurriculumRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

class EloquentCurriculumRepository implements CurriculumRepositoryInterface
{
    public function findActiveById(int $id): ?Curriculum
    {
        return Curriculum::query()->active()->find($id);
    }

    public function activeByDepartmentAndCertificationLevel(int $departmentId, int $certificationLevelId): Collection
    {
        return Curriculum::query()
            ->active()
            ->whereHas('curriculumMappings', function ($query) use ($departmentId, $certificationLevelId) {
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
