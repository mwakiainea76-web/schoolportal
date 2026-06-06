<?php

namespace App\Services;

use App\Models\AcademicYear;

class AcademicYearService
{
    public function store(array $data)
    {
        return AcademicYear::create([
            'academic_year' => $data['academic_year'],
            'label' => $data['academic_year'],
            'start_date' => null,
            'end_date' => null,
            'is_active' => false,
        ]);

    }

    /**
     * Returns error message string OR null if successful
     */
    public function update(AcademicYear $academicYear, array $data): ?string
    {
        $academicYear->update([
            'academic_year' => $data['academic_year'],
            'label' => $data['academic_year'],
        ]);

        return null;
    }

    public function start(AcademicYear $academicYear): ?string
    {
        if ($this->hasAnotherActiveYear($academicYear)) {
            return 'You can only start an academic year after ending the previous active one.';
        }

        $academicYear->update([
            'is_active' => true,
            'start_date' => $academicYear->start_date ?? now(),
            'end_date' => null,
        ]);

        return null;
    }

    public function end(AcademicYear $academicYear): void
    {
        $academicYear->update([
            'is_active' => false,
            'start_date' => $academicYear->start_date ?? now(),
            'end_date' => now(),
        ]);
    }

    public function reactivate(AcademicYear $academicYear): ?string
    {
        if ($this->hasAnotherActiveYear($academicYear)) {
            return 'You can only reactivate an academic year after ending the current active one.';
        }

        $academicYear->update([
            'is_active' => true,
            'start_date' => $academicYear->start_date ?? now(),
            'end_date' => null,
        ]);

        return null;
    }

    public function delete(AcademicYear $academicYear): void
    {
        $academicYear->delete();
    }

    protected function hasAnotherActiveYear(AcademicYear $academicYear): bool
    {
        return AcademicYear::query()
            ->where('is_active', true)
            ->whereKeyNot($academicYear->getKey())
            ->exists();
    }
}
