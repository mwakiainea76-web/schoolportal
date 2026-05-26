<?php

namespace App\Http\Controllers;

use App\Models\AcademicSession;
use App\Services\Analytics\AcademicAnalyticsService;
use App\Services\Analytics\AdmissionsAnalyticsService;
use App\Services\Analytics\AnalyticsSnapshotReadService;
use App\Services\Analytics\DataQualityAnalyticsService;
use App\Services\Analytics\ExecutiveAnalyticsService;
use App\Services\Analytics\FinanceAnalyticsService;
use App\Services\Analytics\HostelAnalyticsService;
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
        return $this->renderAnalyticsPage(
            'all',
            'Reports Dashboard',
            'A consolidated analytics workspace across finance, academics, admissions, hostels, and data quality.',
        );
    }

    public function executive()
    {
        return $this->renderAnalyticsPage(
            'executive',
            'Executive Analytics',
            'Cross-functional institutional performance metrics for leadership review.',
        );
    }

    public function finance()
    {
        return $this->renderAnalyticsPage(
            'finance',
            'Finance Analytics',
            'Billing health, collections, debt exposure, and revenue-focused operational queues.',
        );
    }

    public function academic()
    {
        return $this->renderAnalyticsPage(
            'academic',
            'Academic Analytics',
            'Registration, timetable delivery, clashes, and academic operations monitoring.',
        );
    }

    public function admissions()
    {
        return $this->renderAnalyticsPage(
            'admissions',
            'Admissions Analytics',
            'Intake trends, demographic breakdowns, and onboarding completion visibility.',
        );
    }

    public function hostel()
    {
        return $this->renderAnalyticsPage(
            'hostel',
            'Hostel Analytics',
            'Occupancy, allocation linkage, and accommodation exception monitoring.',
        );
    }

    public function dataQuality()
    {
        return $this->renderAnalyticsPage(
            'data-quality',
            'Data Quality Analytics',
            'Integrity signals, anomalous records, and runtime health affecting reporting trust.',
        );
    }

    public function snapshots()
    {
        return $this->renderAnalyticsPage(
            'snapshots',
            'Snapshot Trends',
            'Historical analytics trends sourced from daily snapshot tables.',
        );
    }

    protected function renderAnalyticsPage(string $section, string $title, string $description)
    {
        $sessions = AcademicSession::with('academicYear')
            ->get()
            ->map(fn ($session) => [
                'id' => $session->id,
                'name' => $session->display_name,
            ]);

        return Inertia::render('Reports/Index', [
            'academicSessions' => $sessions,
            'activeSection' => $section,
            'pageTitle' => $title,
            'pageDescription' => $description,
        ]);
    }

    public function executiveSummary(Request $request, ExecutiveAnalyticsService $executiveAnalyticsService): JsonResponse
    {
        return response()->json(
            $executiveAnalyticsService->summary($request->all())
        );
    }

    public function financeSummary(Request $request, FinanceAnalyticsService $financeAnalyticsService): JsonResponse
    {
        return response()->json(
            $financeAnalyticsService->summary($request->all())
        );
    }

    public function academicSummary(Request $request, AcademicAnalyticsService $academicAnalyticsService): JsonResponse
    {
        return response()->json(
            $academicAnalyticsService->summary($request->all())
        );
    }

    public function admissionsSummary(Request $request, AdmissionsAnalyticsService $admissionsAnalyticsService): JsonResponse
    {
        return response()->json(
            $admissionsAnalyticsService->summary($request->all())
        );
    }

    public function hostelSummary(Request $request, HostelAnalyticsService $hostelAnalyticsService): JsonResponse
    {
        return response()->json(
            $hostelAnalyticsService->summary($request->all())
        );
    }

    public function dataQualitySummary(Request $request, DataQualityAnalyticsService $dataQualityAnalyticsService): JsonResponse
    {
        return response()->json(
            $dataQualityAnalyticsService->summary($request->all())
        );
    }

    public function snapshotTrends(Request $request, AnalyticsSnapshotReadService $analyticsSnapshotReadService): JsonResponse
    {
        return response()->json(
            $analyticsSnapshotReadService->trendSummary((int) $request->integer('days', 30))
        );
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
