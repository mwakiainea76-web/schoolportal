<?php

namespace App\Http\Controllers;

use App\Http\Requests\ResetStaffPasswordRequest;
use App\Http\Requests\ResetStudentPasswordRequest;
use App\Models\Staff;
use App\Models\Student;
use Illuminate\Http\RedirectResponse;
use Illuminate\Validation\ValidationException;

class AdminPasswordResetController extends Controller
{
    public function createStaff()
    {
        return inertia('Staffs/ResetPassword');
    }

    public function storeStaff(ResetStaffPasswordRequest $request): RedirectResponse
    {
        $staffNumber = $request->validated('staff_number');

        $staff = Staff::query()
            ->with('user')
            ->where('staff_number', $staffNumber)
            ->first();

        if (! $staff?->user) {
            throw ValidationException::withMessages([
                'staff_number' => 'No staff account was found with that staff number.',
            ]);
        }

        $staff->user->update([
            'password' => $request->validated('password'),
        ]);

        return back()->with('success', "Password updated for {$staff->staff_number}.");
    }

    public function createStudent()
    {
        return inertia('students/ResetPassword');
    }

    public function storeStudent(ResetStudentPasswordRequest $request): RedirectResponse
    {
        $admissionNumber = $request->validated('admission_number');

        $student = Student::query()
            ->with('user')
            ->where('admission_number', $admissionNumber)
            ->first();

        if (! $student?->user) {
            throw ValidationException::withMessages([
                'admission_number' => 'No student account was found with that admission number.',
            ]);
        }

        $student->user->update([
            'password' => $request->validated('password'),
        ]);

        return back()->with('success', "Password updated for {$student->admission_number}.");
    }
}
