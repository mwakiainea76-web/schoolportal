<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class StudentInvoices extends Model
{
    /** @use HasFactory<\Database\Factories\StudentInvoicesFactory> */
    use HasFactory, SoftDeletes;

    protected $table = 'student_invoices';

    protected $fillable = [
        'enrollment_id',
        'fee_model_id',
        'gross_amount',
        'adjusted_amount',
        'credit_balance',
        'overpayment_action',
        'status',
        'due_date',
    ];

    protected $casts = [
        'gross_amount' => 'decimal:2',
        'adjusted_amount' => 'decimal:2',
        'credit_balance' => 'decimal:2',
        'due_date' => 'date',
        'status' => 'string',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    protected $appends = [
        'total_paid',
        'balance_remaining',
        'status',
        'is_overdue',
    ];

    // ---------------- RELATIONSHIPS ----------------

    public function enrollment()
    {
        return $this->belongsTo(Enrollment::class);
    }

    public function feeModel()
    {
        return $this->belongsTo(FeeModel::class);
    }

    public function payments()
    {
        return $this->hasMany(Payment::class, 'student_invoice_id');
    }

    public function adjustments()
    {
        return $this->hasMany(FeeAdjustment::class, 'student_invoice_id')->orderBy('created_at', 'asc');
    }

    public function penalties()
    {
        return $this->hasMany(Penalty::class, 'student_invoice_id');
    }

    // Helper relation to get student through enrollment
    public function student()
    {
        return $this->hasOneThrough(
            Student::class,
            Enrollment::class,
            'id',
            'id',
            'enrollment_id',
            'student_id'
        );
    }

    // ---------------- SCOPES ----------------

    public function scopeActive($query)
    {
        return $query->whereNull('deleted_at');
    }

    public function scopeByStatus($query, $status)
    {
        return $query->where(function ($q) use ($status) {
            if ($status === 'paid') {
                $q->whereRaw('(SELECT COALESCE(SUM(amount), 0) FROM payments WHERE student_invoice_id = student_invoices.id AND deleted_at IS NULL) >= adjusted_amount');
            } elseif ($status === 'partial') {
                $q->whereRaw('(SELECT COALESCE(SUM(amount), 0) FROM payments WHERE student_invoice_id = student_invoices.id AND deleted_at IS NULL) > 0')
                  ->whereRaw('(SELECT COALESCE(SUM(amount), 0) FROM payments WHERE student_invoice_id = student_invoices.id AND deleted_at IS NULL) < adjusted_amount');
            } elseif ($status === 'overpaid') {
                $q->whereRaw('(SELECT COALESCE(SUM(amount), 0) FROM payments WHERE student_invoice_id = student_invoices.id AND deleted_at IS NULL) > adjusted_amount');
            } elseif ($status === 'unpaid') {
                $q->whereRaw('(SELECT COALESCE(SUM(amount), 0) FROM payments WHERE student_invoice_id = student_invoices.id AND deleted_at IS NULL) = 0');
            }
        });
    }

    public function scopeOverdue($query)
    {
        return $query->where('due_date', '<', now()->toDateString())
                     ->whereRaw('(SELECT COALESCE(SUM(amount), 0) FROM payments WHERE student_invoice_id = student_invoices.id AND deleted_at IS NULL) < adjusted_amount');
    }

    public function scopeForEnrollment($query, $enrollmentId)
    {
        return $query->where('enrollment_id', $enrollmentId);
    }

    public function scopeOrdered($query)
    {
        return $query->orderBy('created_at', 'desc');
    }

    // ---------------- ACCESSORS & MUTATORS ----------------

    public function getTotalPaidAttribute()
    {
        return $this->payments()
            ->sum('amount_paid') ?? 0;
    }

    public function getBalanceRemainingAttribute()
    {
        return max(0, (float)$this->adjusted_amount - (float)$this->total_paid);
    }

    public function getStatusAttribute()
    {
        $totalPaid = (float)$this->total_paid;
        $adjustedAmount = (float)$this->adjusted_amount;

        if ($totalPaid == 0) {
            return 'unpaid';
        } elseif ($totalPaid < $adjustedAmount) {
            return 'partial';
        } elseif ($totalPaid == $adjustedAmount) {
            return 'paid';
        } else {
            return 'overpaid';
        }
    }

    public function getIsOverdueAttribute()
    {
        if (!$this->due_date) {
            return false;
        }

        return $this->due_date < now()->toDateString() && $this->status !== 'paid';
    }

    /**
     * Recalculate the adjusted amount based on fee adjustments.
     */
    public function calculateAdjustedAmount(): float
    {
        $gross = (float)$this->gross_amount;
        $totalPercentageAdjustment = 0;
        $totalFixedAdjustment = 0;
        $totalPenalties = 0;

        foreach ($this->adjustments as $adjustment) {
            if ($adjustment->type === 'percentage') {
                // Percentage adjustments apply to gross_amount first
                $totalPercentageAdjustment += ($gross * (float)$adjustment->value) / 100;
            } else {
                // Fixed adjustments are applied after
                $totalFixedAdjustment += (float)$adjustment->value;
            }
        }

        foreach ($this->penalties as $penalty) {
            $totalPenalties += (float)$penalty->amount;
        }

        return $gross + $totalPercentageAdjustment + $totalFixedAdjustment + $totalPenalties;
    }

    /**
     * Update the cached adjusted_amount field.
     */
    public function syncAdjustedAmount(): void
    {
        $this->update([
            'adjusted_amount' => $this->calculateAdjustedAmount()
        ]);
    }

    // ---------------- HELPER METHODS ----------------

    public function isPaid(): bool
    {
        return $this->status === 'paid';
    }

    public function isPartiallyPaid(): bool
    {
        return $this->status === 'partial';
    }

    public function isOverpaid(): bool
    {
        return $this->status === 'overpaid';
    }

    public function isUnpaid(): bool
    {
        return $this->status === 'unpaid';
    }

    public function getStatusBadgeClass(): string
    {
        return match($this->status) {
            'paid' => 'bg-green-100 text-green-800',
            'partial' => 'bg-yellow-100 text-yellow-800',
            'overpaid' => 'bg-blue-100 text-blue-800',
            'unpaid' => 'bg-red-100 text-red-800',
            default => 'bg-gray-100 text-gray-800',
        };
    }

    public function addPayment($amount, $paymentMethod, $reference = null, $notes = null)
    {
        return $this->payments()->create([
            'amount' => $amount,
            'payment_method' => $paymentMethod,
            'reference' => $reference,
            'notes' => $notes,
        ]);
    }
}
