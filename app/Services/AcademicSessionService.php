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
        $session->session_No = (int) $data['session_No'];
        $session->session_number = (int) $data['session_No'];
        $session->academic_year_id = $data['academic_year_id'];
        $session->save();

        return null;
    }

    public function start(AcademicSession $session): ?string
    {
        if ($this->hasAnotherActiveSession($session)) {
            return 'You can only start a session after ending the previous active one.';
        }

        $session->update([
            'is_active' => true,
            'start_date' => $session->start_date ?? now(),
            'end_date' => null,
        ]);

        return null;
    }

    public function end(AcademicSession $session): void
    {
        $session->update([
            'is_active' => false,
            'start_date' => $session->start_date ?? now(),
            'end_date' => now(),
        ]);
    }

    public function reactivate(AcademicSession $session): ?string
    {
        if ($this->hasAnotherActiveSession($session)) {
            return 'You can only reactivate a session after ending the current active one.';
        }

        $session->update([
            'is_active' => true,
            'start_date' => $session->start_date ?? now(),
            'end_date' => null,
        ]);

        return null;
    }

    public function delete(AcademicSession $session): void
    {
        $session->delete();
    }

    protected function hasAnotherActiveSession(AcademicSession $session): bool
    {
        return AcademicSession::query()
            ->where('is_active', true)
            ->whereKeyNot($session->getKey())
            ->exists();
    }
}
