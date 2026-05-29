<?php

namespace App\Http\Controllers;

use App\Models\AcademicSession;
use App\Models\LedgerTransaction;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Symfony\Component\HttpKernel\Exception\HttpException;

class LedgerTransactionController extends Controller
{
    public function index(Request $request)
    {
        $this->ensureBillingStaff($request);

        $allowedSorts = ['transaction_date', 'type', 'debit', 'credit', 'created_at', 'id'];
        $sort = in_array($request->query('sort'), $allowedSorts, true)
            ? $request->query('sort')
            : 'transaction_date';
        $direction = $request->query('direction') === 'asc' ? 'asc' : 'desc';

        $baseQuery = LedgerTransaction::query()
            ->with([
                'student.user',
                'invoice:id,invoice_number',
                'academicSession.academicYear',
                'createdBy.user',
            ])
            ->when($request->search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('reference', 'like', "%{$search}%")
                        ->orWhere('description', 'like', "%{$search}%")
                        ->orWhere('type', 'like', "%{$search}%")
                        ->orWhereHas('invoice', fn ($invoice) => $invoice->where('invoice_number', 'like', "%{$search}%"))
                        ->orWhereHas('student', function ($student) use ($search) {
                            $student->where('registration_number', 'like', "%{$search}%")
                                ->orWhereHas('user', function ($user) use ($search) {
                                    $user->where('first_name', 'like', "%{$search}%")
                                        ->orWhere('last_name', 'like', "%{$search}%");
                                });
                        });
                });
            })
            ->when($request->type, fn ($query, $type) => $query->where('type', $type))
            ->when($request->academic_session_id, fn ($query, $sessionId) => $query->where('academic_session_id', $sessionId));

        $summary = (clone $baseQuery)
            ->toBase()
            ->selectRaw('COALESCE(SUM(debit), 0) as debit_total, COALESCE(SUM(credit), 0) as credit_total')
            ->first();

        $query = (clone $baseQuery)
            ->select([
                'id',
                'student_id',
                'student_invoice_id',
                'academic_session_id',
                'type',
                'debit',
                'credit',
                'reference',
                'description',
                'transaction_date',
                'created_by',
            ])
            ->with([
                'student.user',
                'invoice:id,invoice_number',
                'academicSession.academicYear',
                'createdBy.user',
            ]);

        $transactions = $query
            ->orderBy($sort, $direction)
            ->paginate(20)
            ->withQueryString()
            ->through(fn (LedgerTransaction $transaction) => [
                'id' => $transaction->id,
                'transaction_date' => optional($transaction->transaction_date)->toDateString(),
                'student' => trim(
                    ($transaction->student?->user?->first_name ?? '').' '.
                    ($transaction->student?->user?->last_name ?? '')
                ),
                'registration_number' => $transaction->student?->registration_number,
                'type' => $transaction->type,
                'reference' => $transaction->reference ?: $transaction->invoice?->invoice_number,
                'session' => $transaction->academicSession?->display_name,
                'debit' => (float) $transaction->debit,
                'credit' => (float) $transaction->credit,
                'net' => $transaction->net_amount,
                'description' => $transaction->description,
                'created_by' => trim(
                    ($transaction->createdBy?->user?->first_name ?? '').' '.
                    ($transaction->createdBy?->user?->last_name ?? '')
                ),
            ]);

        return Inertia::render('Billing/LedgerIndex', [
            'transactions' => $transactions,
            'filters' => $request->only(['search', 'type', 'academic_session_id']),
            'types' => [
                'invoice',
                'payment',
                'bursary',
                'helb',
                'discount',
                'penalty',
                'hostel',
                'adjustment',
                'refund',
                'reversal',
            ],
            'sessions' => AcademicSession::query()
                ->with('academicYear')
                ->orderByDesc('id')
                ->get()
                ->map(fn (AcademicSession $session) => [
                    'id' => $session->id,
                    'name' => $session->display_name,
                ]),
            'summary' => [
                'debit_total' => (float) ($summary->debit_total ?? 0),
                'credit_total' => (float) ($summary->credit_total ?? 0),
                'net_total' => (float) (($summary->debit_total ?? 0) - ($summary->credit_total ?? 0)),
            ],
        ]);
    }

    protected function ensureBillingStaff(Request $request): int
    {
        $staffId = $request->user()?->staff?->id;

        if (! $staffId) {
            throw new HttpException(403, 'A staff billing account is required to access billing ledgers.');
        }

        return (int) $staffId;
    }
}
