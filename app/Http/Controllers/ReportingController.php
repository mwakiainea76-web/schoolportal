<?php

namespace App\Http\Controllers;

use App\Models\AcademicSession;
use App\Services\ReportingService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Inertia\Inertia;

class ReportingController extends Controller
{
    protected ReportingService $reportingService;

    public function __construct(ReportingService $reportingService)
    {
        $this->reportingService = $reportingService;
    }

    public function index()
    {
        $sessions = AcademicSession::with('academicYear')
            ->get()
            ->map(fn ($session) => [
                'id' => $session->id,
                'name' => $session->display_name,
            ]);

        return Inertia::render('Reports/Index', [
            'academicSessions' => $sessions,
        ]);
    }

    public function outstandingBalance(Request $request): JsonResponse
    {
        $data = $this->reportingService->getOutstandingBalanceBySession($request->academic_session_id);
        return response()->json($data);
    }

    public function overdueByDepartment(Request $request): JsonResponse
    {
        $data = $this->reportingService->getOverdueByDepartment($request->department_id);
        return response()->json($data);
    }

    public function collectionPerformance(Request $request): JsonResponse
    {
        $data = $this->reportingService->getCollectionPerformance(
            $request->start_date,
            $request->end_date
        );
        return response()->json($data);
    }

    public function feePlanUsage(Request $request): JsonResponse
    {
        $data = $this->reportingService->getFeePlanUsage(
            $request->academic_session_id,
            $request->year_of_study,
            $request->session_number,
        );
        return response()->json($data);
    }
}
