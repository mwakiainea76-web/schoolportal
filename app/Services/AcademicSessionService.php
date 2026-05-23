<?php

namespace App\Services;

use App\Models\AcademicSession;

class AcademicSessionService
{
    public function store(array $data): ?string
    {
        $session = new AcademicSession();
        $session->session_No = (int) $data['session_No'];
        $session->session_number = (int) $data['session_No'];
        $session->label = $data['label'] ?? null;
        $session->is_active = false;
        $session->academic_year_id = $data['academic_year_id'];
        $session->save();

        return null;
    }

    public function update(AcademicSession $session, array $data)
    {
        $isActive = (bool) ($data['is_active'] ?? false);
        $closeSession = (bool) ($data['close_session'] ?? false);

        $active = AcademicSession::where('is_active', true)
            ->where('id', '!=', $session->id)
            ->first();

        if ($active && $isActive) {
            return back()->withInput()->withErrors([
                'session_No' => 'You can only have one active session at a time.',
            ]);
        }
        $session->session_No = (int) $data['session_No'];
        $session->session_number = (int) $data['session_No'];
        $session->start_date = $isActive ? now() : null;
        $session->end_date = $closeSession ? now() : null;
        $session->is_active = $closeSession ? false : $isActive;
        $session->academic_year_id = $data['academic_year_id'];
        $session->save();
    }

    public function delete(AcademicSession $session): void
    {
        $session->delete();
    }
}
