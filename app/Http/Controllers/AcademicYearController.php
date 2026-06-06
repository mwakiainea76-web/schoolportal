<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreAcademicYearRequest;
use App\Http\Requests\UpdateAcademicYearRequest;
use App\Models\AcademicYear;
use App\Services\AcademicYearService;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class AcademicYearController extends Controller
{
    public function __construct(
        protected AcademicYearService $service
    ) {}

    public function index(Request $request)
    {
        return redirect()->route('academic.sessions.index');
    }

    public function create()
    {
        return inertia('AcademicYears/Create');
    }

    public function store(StoreAcademicYearRequest $request)
    {

        $error = $this->service->store($request->validated());
        if ($error) {
            return redirect()->back()->with('error', $error);
        }

        return redirect()->back()->with('success', 'Academic year created successfully.');
    }

    public function edit(AcademicYear $academic_year)
    {
        return inertia('AcademicYears/Edit', [
            'academic_year' => $academic_year,
        ]);
    }

    public function update(UpdateAcademicYearRequest $request, AcademicYear $academicYear)
    {

        $error = $this->service->update($academicYear, $request->validated());

        if ($error) {
            return redirect()->back()->with('error', $error);
        }

        return redirect()->back()->with('success', 'Academic year updated successfully.');
    }

    public function updateStatus(Request $request, AcademicYear $academicYear)
    {
        $action = $request->validate([
            'action' => ['required', Rule::in(['start', 'end', 'reactivate'])],
        ])['action'];

        $error = match ($action) {
            'start' => $this->service->start($academicYear),
            'end' => tap(null, fn () => $this->service->end($academicYear)),
            'reactivate' => $this->service->reactivate($academicYear),
        };

        return redirect()
            ->back()
            ->with($error ? 'error' : 'success', $error ?: 'Academic year updated successfully.');
    }

    public function destroy(AcademicYear $academicYear)
    {
        $this->service->delete($academicYear);

        return redirect()->back()->with('success', 'Academic year deleted successfully.');
    }

    public function search(Request $request)
    {
        $limit = min(max($request->integer('limit', 10), 1), 25);
        $query = trim((string) $request->query('q', ''));

        $years = AcademicYear::query()
            ->when($query !== '', function ($builder) use ($query) {
                $builder->where(function ($yearQuery) use ($query) {
                    $yearQuery
                        ->where('label', 'like', "%{$query}%")
                        ->orWhere('academic_year', 'like', "%{$query}%");
                });
            })
            ->orderByDesc('academic_year')
            ->limit($limit)
            ->get(['id', 'label', 'academic_year'])
            ->map(fn (AcademicYear $year) => [
                'id' => (string) $year->id,
                'name' => $year->label ?: $year->academic_year,
            ])
            ->values();

        return response()->json($years);
    }

}
