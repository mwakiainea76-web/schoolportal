<?php

namespace App\Http\Controllers;

use App\Models\AcademicSessionEnrollment;
use App\Models\Student;
use Illuminate\Http\Request;

class FeesController extends Controller
{
 public function statement(Request $request)
{
    $student  = null;
    $sessions = [];
    $grandTotalDebit  = 0;
    $grandTotalCredit = 0;
    $grandBalance     = 0;

    if ($request->filled('registration_number')) {

        $student = Student::with('user')
            ->where('registration_number', $request->registration_number)
            ->first();

        if (! $student) {
            return back()->withInput()->withErrors([
                'registration_number' => "No student found with registration number '{$request->registration_number}'.",
            ]);
        }

        $enrollments = AcademicSessionEnrollment::with([
            'academicSession.academicYear',
            'courseEnrollment.courseCurriculum.course.department',
            'courseEnrollment.courseCurriculum.curriculum',
            'invoices.feeAdjustments',
            'invoices.payments',
            'invoices.penalties',
        ])
        ->whereHas('courseEnrollment', fn($q) => $q->where('student_id', $student->id))
        ->orderBy('created_at')
        ->get();

        $sessions = $enrollments->map(function ($enrollment) {
            $sessionLabel = $enrollment->academicSession
                ? "{$enrollment->academicSession->academicYear->academic_year} - Session {$enrollment->academicSession->session_No}"
                : 'N/A';

            $transactions = collect();

            foreach ($enrollment->invoices as $invoice) {

                // 1. Invoice — always a debit
                $transactions->push([
                    'date'        => $invoice->created_at->format('d/m/Y'),
                    'ref'         => 'INV-' . str_pad($invoice->id, 6, '0', STR_PAD_LEFT),
                    'description' => 'STANDARD INVOICE',
                    'type'        => 'invoice',
                    'debit'       => $invoice->gross_amount,
                    'credit'      => 0,
                    'sort_at'     => $invoice->created_at->timestamp,
                ]);

                // 2. Fee adjustments — positive value = debit (charge more), negative = credit (discount)
                foreach ($invoice->feeAdjustments as $adj) {
                    $isDebit = $adj->value > 0;
                    $transactions->push([
                        'date'        => $adj->created_at->format('d/m/Y'),
                        'ref'         => 'ADJ-' . str_pad($adj->id, 6, '0', STR_PAD_LEFT),
                        'description' => 'INVOICE ADJUSTMENT' . ($adj->reason ? ' - ' . strtoupper($adj->reason) : ''),
                        'type'        => 'adjustment',
                        'debit'       => $isDebit ? abs($adj->value) : 0,
                        'credit'      => $isDebit ? 0 : abs($adj->value),
                        'sort_at'     => $adj->created_at->timestamp,
                    ]);
                }

                // 3. Payments — always a credit
                foreach ($invoice->payments as $payment) {
                    $method = match($payment->method) {
                        'mpesa'         => 'M-PESA PAYMENT',
                        'bank_transfer' => 'BANK TRANSFER',
                        'cash'          => 'CASH PAYMENT',
                        default         => 'PAYMENT',
                    };
                    $description = $method . ($payment->reference ? ' - REF: ' . strtoupper($payment->reference) : '');
                    $transactions->push([
                        'date'        => $payment->paid_at
                            ? \Carbon\Carbon::parse($payment->paid_at)->format('d/m/Y')
                            : $payment->created_at->format('d/m/Y'),
                        'ref'         => $payment->reference
                            ? strtoupper($payment->reference)
                            : 'PAY-' . str_pad($payment->id, 6, '0', STR_PAD_LEFT),
                        'description' => $description,
                        'type'        => 'payment',
                        'debit'       => 0,
                        'credit'      => $payment->amount_paid,
                        'sort_at'     => $payment->paid_at
                            ? \Carbon\Carbon::parse($payment->paid_at)->timestamp
                            : $payment->created_at->timestamp,
                    ]);
                }

                // 4. Penalties — always a debit
                foreach ($invoice->penalties as $penalty) {
                    $penaltyLabel = match($penalty->penalty_type) {
                        'lost_library_card' => 'PENALTY - LOST LIBRARY CARD',
                        'lost_id'           => 'PENALTY - LOST ID CARD',
                        'lost_book'         => 'PENALTY - LOST BOOK',
                        'late_payment'      => 'PENALTY - LATE PAYMENT',
                        default             => 'PENALTY - ' . strtoupper($penalty->penalty_type),
                    };
                    $transactions->push([
                        'date'        => \Carbon\Carbon::parse($penalty->raised_at)->format('d/m/Y'),
                        'ref'         => 'PEN-' . str_pad($penalty->id, 6, '0', STR_PAD_LEFT),
                        'description' => $penaltyLabel . ($penalty->notes ? ' (' . $penalty->notes . ')' : ''),
                        'type'        => 'penalty',
                        'debit'       => $penalty->amount,
                        'credit'      => 0,
                        'sort_at'     => \Carbon\Carbon::parse($penalty->raised_at)->timestamp,
                    ]);
                }
            }

            // Sort all transactions chronologically
            $running = 0;
            $rows = $transactions->sortBy('sort_at')->values()->map(function ($t) use (&$running) {
                $running = round($running + $t['debit'] - $t['credit'], 2);
                return [
                    'date'        => $t['date'],
                    'ref'         => $t['ref'],
                    'description' => $t['description'],
                    'type'        => $t['type'],
                    'debit'       => $t['debit'],
                    'credit'      => $t['credit'],
                    'balance'     => $running,
                ];
            });

            $sessionDebit  = $rows->sum('debit');
            $sessionCredit = $rows->sum('credit');

            return [
                'session'         => $sessionLabel,
                'module'          => $enrollment->module,
                'transactions'    => $rows->values(),
                'total_debit'     => $sessionDebit,
                'total_credit'    => $sessionCredit,
                'closing_balance' => $running,
            ];
        });

        $grandTotalDebit  = round($sessions->sum('total_debit'), 2);
        $grandTotalCredit = round($sessions->sum('total_credit'), 2);
        $grandBalance     = round($grandTotalDebit - $grandTotalCredit, 2);

        $student = [
            'name'                => trim(($student->user->first_name ?? '') . ' ' . ($student->user->last_name ?? '')),
            'registration_number' => $student->registration_number,
            'program'             => $enrollments->first()?->courseEnrollment?->courseCurriculum?->course?->name ?? 'N/A',
            'curriculum'          => $enrollments->first()?->courseEnrollment?->courseCurriculum?->curriculum?->name ?? 'N/A',
            'department'          => $enrollments->first()?->courseEnrollment?->courseCurriculum?->course?->department?->name ?? 'N/A',
        ];
    }

    return inertia('Fees/Index', [
        'student'            => $student,
        'sessions'           => $sessions,
        'grand_total_debit'  => $grandTotalDebit,
        'grand_total_credit' => $grandTotalCredit,
        'grand_balance'      => $grandBalance,
        'searched'           => $request->filled('registration_number'),
        'filters'            => ['registration_number' => $request->registration_number ?? ''],
    ]);
}
}
