<?php

namespace App\Http\Controllers;

use App\Models\CourseEnrollment;

class CourseEnrollmentController extends Controller
{
    public function index()
    {
        $courseEnrollments = CourseEnrollment::with([
            'student.user',
            'courseVersionMapping.course',
            'courseVersionMapping.courseVersion',
        ])
            ->latest()
            ->paginate(20)
            ->withQueryString();

        return inertia('CourseEnrollments/Index', compact('courseEnrollments'));
    }
}

