<?php

namespace App\Repositories\FeeManagement\Contracts;

use App\Models\CourseVersion;
use Illuminate\Database\Eloquent\Collection;

interface CourseVersionRepositoryInterface
{
    public function findActiveById(int $id): ?CourseVersion;

    public function activeByDepartmentAndCertificationLevel(int $departmentId, int $certificationLevelId): Collection;
}
