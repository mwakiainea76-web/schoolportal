<?php

namespace App\Repositories\FeeManagement\Contracts;

use App\Models\ProgramVersion;
use Illuminate\Database\Eloquent\Collection;

interface ProgramVersionRepositoryInterface
{
    public function findActiveById(int $id): ?ProgramVersion;

    public function activeByDepartmentAndCertificationLevel(int $departmentId, int $certificationLevelId): Collection;
}

