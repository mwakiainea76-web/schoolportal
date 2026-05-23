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
        $isActive = ($data['year_state'] ?? null) === 'start';

        if ($academicYear->end_date && $isActive) {
            return 'This academic year is closed and cannot be reactivated.';
        }

        if ($isActive) {
            $exists = AcademicYear::where('is_active', true)
                ->whereKeyNot($academicYear->getKey())
                ->exists();

            if ($exists) {
                return 'Disable any  active academic year to continue  ';
            }
        }

        $academicYear->update([
            'academic_year' => $data['academic_year'],
            'label' => $data['academic_year'],
            'start_date' => $isActive ? ($academicYear->start_date ?? now()) : $academicYear->start_date,
            'end_date' => $isActive ? null : now(),
            'is_active' => $isActive,
        ]);

        return null;
    }

    public function delete(AcademicYear $academicYear): void
    {
        $academicYear->delete();
    }
}
