<?php

namespace App\Repositories\FeeManagement\Eloquent;

use App\Models\CourseVersion;
use App\Repositories\FeeManagement\Contracts\CourseVersionRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

class EloquentCourseVersionRepository implements CourseVersionRepositoryInterface
{
    public function findActiveById(int $id): ?CourseVersion
    {
        return CourseVersion::query()->active()->find($id);
    }

    public function activeByDepartmentAndCertificationLevel(int $departmentId, int $certificationLevelId): Collection
    {
        return CourseVersion::query()
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
