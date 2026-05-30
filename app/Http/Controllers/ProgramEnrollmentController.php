<?php

namespace App\Http\Controllers;

use App\Models\ProgramEnrollment;

class ProgramEnrollmentController extends Controller
{
    public function index()
    {
        $courseEnrollments = ProgramEnrollment::with([
            'student.user',
            'programVersionMapping.program',
            'programVersionMapping.programVersion',
        ])
            ->latest()
            ->paginate(20)
            ->withQueryString();

        return inertia('ProgramEnrollments/Index', compact('courseEnrollments'));
    }
}

