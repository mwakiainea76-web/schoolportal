<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreAcademicYearRequest;
use App\Http\Requests\UpdateAcademicYearRequest;
use App\Models\AcademicYear;
use App\Services\AcademicYearService;

class AcademicYearController extends Controller
{
    public function __construct(
        protected AcademicYearService $service
    ) {}

    public function index()
    {
        return inertia('AcademicYears/Index', [
            'academic_years' => AcademicYear::latest()->paginate(10),
        ]);
    }

    public function create()
    {
        return inertia('AcademicYears/Create');
    }

    public function store(StoreAcademicYearRequest $request)
    {

        $error = $this->service->store($request->validated());
        if ($error) {
            return redirect()
                ->route('academic.years.create')
                ->with('error', $error);
        }

        return redirect()
            ->route('academic.years.create')
            ->with('success', 'Academic year created successfully.');
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
            return redirect()
                ->route('academic.years.edit', $academicYear->id)
                ->with('error', $error);
        }

        return redirect()
            ->route('academic.years.edit', $academicYear->id)
            ->with('success', 'Academic year updated successfully.');
    }

    public function destroy(AcademicYear $academicYear)
    {
        $this->service->delete($academicYear);

        return redirect()
            ->route('academic.years.index')
            ->with('success', 'Academic year deleted successfully.');
    }
}
