<?php

namespace App\Services;

use App\Models\AcademicSession;

class AcademicSessionService
{
    public function store(array $data): ?string
    {

        AcademicSession::create([
            'session_No' => $data['session_No'],
            'is_active' => false,
            'academic_year_id' => $data['academic_year_id'],
        ]);

        return null;
    }

    public function update(AcademicSession $session, array $data)
    {

        $active = AcademicSession::where('is_active', true)
            ->where('id', '!=', $session->id)
            ->first();

        if ($active) {
            return back()->withInput()->withErrors([
                'session_No' => 'You can only have one active session at a time.',
            ]);
        }
        $session->update([
            'session_No' => $data['session_No'],
            'start_date' => $data['is_active'] ? now() : null,
            'end_date' => $data['close_session'] ? now() : null,
            'is_active' => $data['close_session'] ? false : $data['is_active'],
            'academic_year_id' => $data['academic_year_id'],
        ]);
    }

    public function delete(AcademicSession $session): void
    {
        $session->delete();
    }
}
