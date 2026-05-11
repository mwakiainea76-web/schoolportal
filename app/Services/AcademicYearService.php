<?php

namespace App\Services;

use App\Models\AcademicYear;

class AcademicYearService
{
    public function store(array $data)
    {

        $exists = AcademicYear::where('is_active', true)
            ->exists();

        if ($exists) {
            return 'Disable any  active academic year to continue  ';
        }

        return AcademicYear::create([
            'academic_year' => $data['academic_year'],
            'start_date' => now(),
            'is_active' => true,
        ]);

    }

    /**
     * Returns error message string OR null if successful
     */
    public function update(AcademicYear $academicYear, array $data): ?string
    {
        if ($data['is_active']) {
            $exists = AcademicYear::where('is_active', true)
                ->exists();

            if ($exists) {
                return 'Disable any  active academic year to continue  ';
            }
        }
        $academicYear->update([
            'academic_year' => $data['academic_year'],
            'end_date' => $data['is_active'] ? null : now(),
            'is_active' => $data['is_active'],
        ]);

        return null;
    }

    public function delete(AcademicYear $academicYear): void
    {
        $academicYear->delete();
    }
}
