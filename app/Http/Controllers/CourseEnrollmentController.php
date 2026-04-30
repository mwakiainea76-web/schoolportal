<?php

namespace App\Http\Controllers;

use App\Models\CourseEnrollment;

class CourseEnrollmentController extends Controller
{
    public function index()
    {
        $courseEnrollments = CourseEnrollment::with([
            'student.user',
            'courseCurriculum.course',
            'courseCurriculum.curriculum',
        ])
            ->latest()
            ->paginate(20)
            ->withQueryString();

        return inertia('CourseEnrollments/Index', compact('courseEnrollments'));
    }
}
