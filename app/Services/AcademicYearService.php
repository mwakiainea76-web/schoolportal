<?php

namespace App\Services;

use App\Models\AcademicYear;

class AcademicYearService
{
    public function store(array $data): AcademicYear
    {
        return AcademicYear::create([
            'academic_year' => $data['academic_year'],
            'start_date' => $data['start_date'],
            'end_date' => $data['end_date'],
            'is_active' => false,
        ]);
    }

    /**
     * Returns error message string OR null if successful
     */
    public function update(AcademicYear $academicYear, array $data): ?string
    {
        if (!empty($data['is_active'])) {
            $activeExists = AcademicYear::where('is_active', true)
                ->where('id', '!=', $academicYear->id)
                ->first();

            if ($activeExists) {
                return $activeExists->academic_year . ' academic year is still active, disable it first to continue.';
            }
        }

        $academicYear->update([
            'academic_year' => $data['academic_year'],
            'start_date' => $data['start_date'],
            'end_date' => $data['end_date'],
            'is_active' => !empty($data['is_active']),
        ]);

        return null;
    }

    public function delete(AcademicYear $academicYear): void
    {
        $academicYear->delete();
    }
}