<?php

namespace App\Models;

use App\Traits\Auditable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    use Auditable, HasFactory;

    protected string $auditModule = 'payments';

    protected array $auditExclude = [
        'created_by',
    ];

    protected $table = 'payments';

    protected $fillable = [
        'student_invoice_id',
        'student_id',
        'amount',
        'payment_date',
        'method',
        'reference',
        'status',
        'idempotency_key',
        'created_by',
        'notes',
    ];

    protected $casts = [
        'payment_date' => 'date',
        'amount' => 'decimal:2',
    ];

    public function invoice()
    {
        return $this->belongsTo(StudentInvoice::class, 'student_invoice_id');
    }

    public function student()
    {
        return $this->belongsTo(Student::class);
    }

    public function allocations()
    {
        return $this->hasMany(PaymentAllocation::class);
    }

    public function createdBy()
    {
        return $this->belongsTo(Staff::class, 'created_by');
    }

    public function getAllocatedTotalAttribute(): float
    {
        return (float) $this->allocations()->sum('amount');
    }

    public function getUnallocatedAmountAttribute(): float
    {
        return max(0, (float) $this->amount - $this->allocated_total);
    }
}
