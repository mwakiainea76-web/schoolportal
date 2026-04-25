<?php

namespace App\Services;

use App\Models\Unit;

class UnitService
{
    public function store(array $data): Unit
    {
        return Unit::create([
            'code' => $data['code'],
            'name' => $data['name'],
            'description' => $data['description'],
            'credit_factor' => $data['credit_factor'],
            'training_hours' => $data['training_hours'],
        ]);
    }

    public function update(Unit $unit, array $data): Unit
    {
        $unit->update([
            'code' => $data['code'],
            'name' => $data['name'],
            'description' => $data['description'],
            'credit_factor' => $data['credit_factor'],
            'training_hours' => $data['training_hours'],
        ]);

        return $unit;
    }

    public function delete(Unit $unit): void
    {
        $unit->delete();
    }
}
