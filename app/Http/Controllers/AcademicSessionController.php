<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreAcademicSessionRequest;
use App\Http\Requests\UpdateAcademicSessionRequest;
use App\Models\AcademicSession;
use App\Models\AcademicYear;
use App\Services\AcademicSessionService;

class AcademicSessionController extends Controller
{
    public function __construct(
        protected AcademicSessionService $service
    ) {}

    public function index()
    {
        return inertia('AcademicSessions/Index', [
            'academic_sessions' => AcademicSession::latest()
                ->with('academicYear')
                ->paginate(10),
        ]);
    }

    public function create()
    {
        return inertia('AcademicSessions/Create', [
            'academic_years' => AcademicYear::latest()
                ->where('is_active', true)
                ->get(),
        ]);
    }

    public function store(StoreAcademicSessionRequest $request)
    {
        $error = $this->service->store($request->validated());

        if ($error) {
            return redirect()
                ->route('academic.sessions.create')
                ->with('error', $error);
        }

        return redirect()
            ->route('academic.sessions.create')
            ->with('success', 'Academic session created successfully.');
    }

    public function edit(AcademicSession $academicSession)
    {
        return inertia('AcademicSessions/Edit', [
            'academic_session' => $academicSession->load('academicYear'),
        ]);
    }

    public function update(UpdateAcademicSessionRequest $request, AcademicSession $academicSession)
    {
        $this->service->update($academicSession, $request->validated());

        return redirect()
            ->route('academic.sessions.edit', $academicSession)
            ->with('success', 'Academic session updated successfully.');
    }

    public function destroy(AcademicSession $academicSession)
    {
        $this->service->delete($academicSession);

        return redirect()
            ->route('academic.sessions.index')
            ->with('success', 'Academic session deleted successfully.');
    }
}
