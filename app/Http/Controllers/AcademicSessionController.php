<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreAcademicSessionRequest;
use App\Http\Requests\UpdateAcademicSessionRequest;
use App\Models\AcademicSession;
use App\Models\AcademicYear;
use App\Services\AcademicSessionService;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class AcademicSessionController extends Controller
{
    public function __construct(
        protected AcademicSessionService $service
    ) {}

    public function index(Request $request)
    {
        $academicYears = $this->academicYearsList($request);
        $selectedAcademicYearId = $request->integer('academic_year_id')
            ?: $academicYears->first()?->id;
        $activeAcademicSessionId = AcademicSession::query()
            ->where('is_active', true)
            ->value('id');

        return inertia('AcademicSessions/Index', [
            'active_tab' => 'sessions',
            'academic_years' => $academicYears->values(),
            'selected_academic_year_id' => $selectedAcademicYearId ? (string) $selectedAcademicYearId : '',
            'active_academic_session_id' => $activeAcademicSessionId ? (string) $activeAcademicSessionId : '',
            'academic_sessions' => $this->academicSessionsList($request, $selectedAcademicYearId),
            'filters' => [
                'year_search' => $request->string('year_search')->toString(),
                'academic_year_id' => $selectedAcademicYearId ? (string) $selectedAcademicYearId : '',
                'session_search' => $request->string('session_search')->toString(),
            ],
        ]);
    }

    public function create()
    {
        $academic_year = AcademicYear::where('is_active', true)->first();
        $session_no = $academic_year
            ? AcademicSession::where('academic_year_id', $academic_year->id)->count() + 1
            : 1;

        return inertia('AcademicSessions/Create', [
            'academic_year' => $academic_year,
            'session_no' => $session_no,
            'prerequisite_error' => $academic_year
                ? null
                : 'Create and activate an academic year before creating an academic session.',
        ]);
    }

    public function store(StoreAcademicSessionRequest $request)
    {
        $error = $this->service->store($request->validated());

        if ($error) {
            return redirect()->back()->with('error', $error);
        }

        return redirect()->back()->with('success', 'Academic session created successfully.');
    }

    public function edit(AcademicSession $academicSession)
    {
        return inertia('AcademicSessions/Edit', [
            'academic_session' => $academicSession->load('academicYear'),
        ]);
    }

    public function update(UpdateAcademicSessionRequest $request, AcademicSession $academicSession)
    {
        $error = $this->service->update($academicSession, $request->validated());

        return redirect()->back()
            ->with($error ? 'error' : 'success', $error ?: 'Academic session updated successfully.');
    }

    public function updateStatus(Request $request, AcademicSession $academicSession)
    {
        $action = $request->validate([
            'action' => ['required', Rule::in(['start', 'end', 'reactivate'])],
        ])['action'];

        $error = match ($action) {
            'start' => $this->service->start($academicSession),
            'end' => tap(null, fn () => $this->service->end($academicSession)),
            'reactivate' => $this->service->reactivate($academicSession),
        };

        return redirect()->back()
            ->with($error ? 'error' : 'success', $error ?: 'Academic session updated successfully.');
    }

    public function destroy(AcademicSession $academicSession)
    {
        $this->service->delete($academicSession);

        return redirect()->back()->with('success', 'Academic session deleted successfully.');
    }

    public function search(Request $request)
    {
        return AcademicSession::active()
            ->where('session_No', 'like', '%'.$request->get('q').'%')
            ->orderBy('start_date', 'desc')
            ->get(['id', 'session_No as name']);
    }

    protected function academicYearsList(Request $request)
    {
        $search = $request->string('year_search')->toString();

        return AcademicYear::query()
            ->when($search !== '', function ($builder) use ($search) {
                $builder->where(function ($yearQuery) use ($search) {
                    $yearQuery
                        ->where('academic_year', 'like', "%{$search}%")
                        ->orWhere('label', 'like', "%{$search}%");
                });
            })
            ->orderByDesc('academic_year')
            ->get(['id', 'academic_year', 'label', 'is_active', 'start_date', 'end_date']);
    }

    protected function academicSessionsList(Request $request, ?int $academicYearId)
    {
        $search = $request->string('session_search')->toString();

        return AcademicSession::query()
            ->with('academicYear')
            ->when($academicYearId, fn ($builder) => $builder->where('academic_year_id', $academicYearId))
            ->when($search !== '', function ($builder) use ($search) {
                $builder->where(function ($sessionQuery) use ($search) {
                    $sessionQuery
                        ->where('session_No', 'like', "%{$search}%")
                        ->orWhereHas('academicYear', fn ($yearQuery) => $yearQuery->where('academic_year', 'like', "%{$search}%"));
                });
            })
            ->orderBy('session_No')
            ->get();
    }
}
