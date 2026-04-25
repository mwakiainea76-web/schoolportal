<?php

namespace App\Services;

use App\Models\AcademicSession;

class AcademicSessionService
{
    public function store(array $data): ?string
    {
        $exists = AcademicSession::where('session_No', $data['session_No'])
            ->where('academic_year_id', $data['academic_year_id'])
            ->exists();

        if ($exists) {
            return 'Session already exists';
        }

        AcademicSession::create([
            'session_No' => $data['session_No'],
            'start_date' => $data['start_date'],
            'end_date' => $data['end_date'],
            'is_active' => false,
            'academic_year_id' => $data['academic_year_id'],
        ]);

        return null;
    }

    public function update(AcademicSession $session, array $data): void
    {
        $session->update([
            'session_No' => $data['session_No'],
            'start_date' => $data['start_date'],
            'end_date' => $data['end_date'],
            'is_active' => $data['is_active'] ?? $session->is_active,
            'academic_year_id' => $data['academic_year_id'],
        ]);
    }

    public function delete(AcademicSession $session): void
    {
        $session->delete();
    }
}
