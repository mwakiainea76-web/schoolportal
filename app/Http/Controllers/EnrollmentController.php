<?php

namespace App\Http\Controllers;

use App\Models\Enrollment;
use App\Filters\EnrollmentFilter;
use App\Http\Requests\StoreEnrollmentRequest;
use App\Http\Requests\UpdateEnrollmentRequest;
use Illuminate\Http\Request;

class EnrollmentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request, EnrollmentFilter $filter)
    {
        $enrollments = $filter
            ->apply(
                Enrollment::with([
                    'student.user',
                    'courseEnrollment.courseProgramVersion.course',
                    'courseEnrollment.courseProgramVersion.curriculum',
                    'academicSession',
                ]),
                $request->all()
            )
            ->latest()
            ->paginate(20)
            ->withQueryString();

        return inertia('AcademicSessionEnrollments/Index', compact('enrollments'));
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreEnrollmentRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Enrollment $enrollment)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Enrollment $enrollment)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateEnrollmentRequest $request, Enrollment $enrollment)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Enrollment $enrollment)
    {
        //
    }

    /**
     * Search for enrollments.
     */
    public function search(Request $request)
    {
        $q = $request->get('q');

        return Enrollment::with(['student.user', 'academicSession'])
            ->whereHas('student.user', function ($query) use ($q) {
                $query->where('first_name', 'like', "%{$q}%")
                      ->orWhere('last_name', 'like', "%{$q}%");
            })
            ->orWhereHas('student', function ($query) use ($q) {
                $query->where('registration_number', 'like', "%{$q}%");
            })
            ->limit(10)
            ->get()
            ->map(fn ($e) => [
                'id' => $e->id,
                'name' => ($e->student->user->first_name ?? '') . ' ' . ($e->student->user->last_name ?? '') . ' (' . ($e->student->registration_number ?? 'N/A') . ')' . ($e->academicSession ? ' - '.$e->academicSession->name : ''),
            ]);
    }
}

