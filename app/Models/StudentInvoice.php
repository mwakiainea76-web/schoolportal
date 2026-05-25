<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class StudentInvoice extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'student_invoices';

    protected $fillable = [
        'invoice_number',
        'student_id',
        'enrollment_id',
        'fee_assignment_id',
        'invoice_type',
        'academic_session_id',
        'status',
        'issue_date',
        'due_date',
        'amount_due',
        'paid_amount',
        'balance_due',
        'idempotency_key',
        'notes',
        'created_by',
    ];

    protected $casts = [
        'issue_date' => 'date',
        'due_date' => 'date',
        'amount_due' => 'decimal:2',
        'paid_amount' => 'decimal:2',
        'balance_due' => 'decimal:2',
    ];

    public function student()
    {
        return $this->belongsTo(Student::class);
    }

    public function enrollment()
    {
        return $this->belongsTo(AcademicSessionEnrollment::class, 'enrollment_id');
    }

    public function feeAssignment()
    {
        return $this->belongsTo(FeeAssignment::class, 'fee_assignment_id');
    }

    public function items()
    {
        return $this->hasMany(InvoiceItem::class, 'student_invoice_id');
    }

    public function payments()
    {
        return $this->hasMany(Payment::class, 'student_invoice_id');
    }

    public function paymentAllocations()
    {
        return $this->hasMany(PaymentAllocation::class, 'student_invoice_id');
    }

    public function adjustments()
    {
        return $this->hasMany(FeeAdjustment::class, 'student_invoice_id');
    }

    public function academicSession()
    {
        return $this->belongsTo(AcademicSession::class, 'academic_session_id');
    }

    public function ledgerTransactions()
    {
        return $this->hasMany(LedgerTransaction::class, 'student_invoice_id');
    }

    public function hostelAllocation()
    {
        return $this->hasOne(HostelAllocation::class, 'student_invoice_id');
    }

    public function recalculateTotals(): self
    {
        $itemsTotal = $this->items()->sum('total_amount');
        $adjustmentsTotal = $this->adjustments()->get()->sum(fn ($adjustment) => $adjustment->signedAmount());

        $amountDue = $itemsTotal + $adjustmentsTotal;
        $paidAmount = $this->paymentAllocations()->sum('amount');
        $balanceDue = $amountDue - $paidAmount;

        $this->update([
            'amount_due' => $amountDue,
            'paid_amount' => $paidAmount,
            'balance_due' => $balanceDue,
        ]);

        $this->refreshStatus();

        return $this;
    }

    public function refreshStatus(): self
    {
        if ($this->amount_due <= 0 || $this->balance_due <= 0) {
            $status = 'paid';
        } elseif ($this->paid_amount > 0 && $this->paid_amount < $this->amount_due) {
            $status = 'partial';
        } elseif ($this->issue_date && $this->due_date) {
            $status = 'issued';
        } else {
            $status = 'draft';
        }

        if ($this->status !== $status) {
            $this->update(['status' => $status]);
        }

        return $this;
    }

    public static function generateInvoiceNumber(): string
    {
        return 'INV-'.now()->format('Ymd').'-'.strtoupper(bin2hex(random_bytes(4)));
    }

    public function scopeByStatus($query, string $status)
    {
        return $query->where('status', $status);
    }
}
