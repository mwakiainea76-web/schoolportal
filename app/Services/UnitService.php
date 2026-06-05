<?php

namespace App\Services;

use App\Models\Unit;

class UnitService
{
    public function store(array $data): Unit
    {
        return Unit::create($data);
    }

    public function update(Unit $unit, array $data): Unit
    {
        $unit->update($data);

        return $unit;
    }

    public function delete(Unit $unit): void
    {
        $unit->delete();
    }
}
