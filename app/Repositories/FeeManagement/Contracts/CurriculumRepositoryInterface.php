<?php

namespace App\Repositories\FeeManagement\Contracts;

use App\Models\Curriculum;
use Illuminate\Database\Eloquent\Collection;

interface CurriculumRepositoryInterface
{
    public function findActiveById(int $id): ?Curriculum;

    public function activeByDepartmentAndCertificationLevel(int $departmentId, int $certificationLevelId): Collection;
}
