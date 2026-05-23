<?php

namespace App\Http\Controllers;

use App\Models\AcademicSessionEnrollment;
use App\Models\AcademicSession;
use App\Models\AcademicYear;
use App\Models\Department;
use App\Models\Program;
use App\Models\ProgramVersion;
use App\Models\StudentInvoice;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function redirect(Request $request): RedirectResponse
    {
        $user = $request->user();

        if ($user?->hasRole('student')) {
            return redirect()->route('student.dashboard');
        }

        return redirect()->route('staff.dashboard');
    }

    public function studentDashboard(Request $request): Response
    {
        $user = $request->user();
        $student = $user?->student?->load([
            'programEnrollment.programVersionMapping.program',
            'programEnrollment.programVersionMapping.programVersion',
        ]);

        $programEnrollment = $student?->programEnrollment;
        $programVersionMapping = $programEnrollment?->programVersionMapping;
        $latestSessionEnrollment = $programEnrollment
            ? AcademicSessionEnrollment::query()
                ->with('academicSession.academicYear')
                ->where('program_enrollment_id', $programEnrollment->id)
                ->latest()
                ->first()
            : null;

        $invoices = $student
            ? StudentInvoice::query()
                ->with(['academicSession.academicYear'])
                ->where('student_id', $student->id)
                ->latest()
                ->limit(5)
                ->get()
            : collect();

        $totalDue = (float) $invoices->sum('amount_due');
        $totalPaid = (float) $invoices->sum('paid_amount');
        $outstandingBalance = (float) $invoices->sum('balance_due');
        $nextInvoice = $invoices
            ->whereIn('status', ['issued', 'partial', 'draft'])
            ->sortBy('due_date')
            ->first();

        return Inertia::render('Dashboard', [
            'dashboard' => [
                'type' => 'student',
                'student' => $student ? [
                    'registration_number' => $student->registration_number,
                    'status' => $student->student_status,
                    'current_module' => $student->current_module,
                    'fee_discount_percentage' => $student->fee_discount_percentage,
                    'admission_date' => optional($student->admission_date)->toDateString(),
                ] : null,
                'program' => [
                    'name' => $programVersionMapping?->program?->name,
                    'version' => $programVersionMapping?->programVersion?->name,
                ],
                'latest_session' => $latestSessionEnrollment ? [
                    'session' => $latestSessionEnrollment->academicSession?->display_name,
                    'year_of_study' => $latestSessionEnrollment->year_of_study,
                    'module' => $latestSessionEnrollment->module,
                    'status' => $latestSessionEnrollment->status,
                ] : null,
                'active_session' => AcademicSession::with('academicYear')
                    ->where('is_active', true)
                    ->first()?->display_name,
                'finance' => [
                    'total_due' => round($totalDue, 2),
                    'total_paid' => round($totalPaid, 2),
                    'outstanding_balance' => round($outstandingBalance, 2),
                    'next_invoice_due_date' => optional($nextInvoice?->due_date)->toDateString(),
                    'next_invoice_status' => $nextInvoice?->status,
                ],
                'recent_invoices' => $invoices->map(fn (StudentInvoice $invoice) => [
                    'id' => $invoice->id,
                    'invoice_number' => $invoice->invoice_number,
                    'status' => $invoice->status,
                    'amount_due' => (float) $invoice->amount_due,
                    'paid_amount' => (float) $invoice->paid_amount,
                    'balance_due' => (float) $invoice->balance_due,
                    'due_date' => optional($invoice->due_date)->toDateString(),
                    'session' => $invoice->academicSession?->display_name,
                ])->values(),
            ],
        ]);
    }

    public function staffDashboard(): Response
    {
        return Inertia::render('Dashboard', [
            'dashboard' => [
                'type' => 'staff',
                'stats' => [
                    [
                        'label' => 'Programs',
                        'value' => Program::query()->count(),
                    ],
                    [
                        'label' => 'Program Versions',
                        'value' => ProgramVersion::query()->count(),
                    ],
                    [
                        'label' => 'Departments',
                        'value' => Department::query()->count(),
                    ],
                    [
                        'label' => 'Academic Years',
                        'value' => AcademicYear::query()->count(),
                    ],
                ],
            ],
        ]);
    }
}
