<?php

namespace App\Models;

use App\Traits\Auditable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PaymentAllocation extends Model
{
    use Auditable, HasFactory;

    protected string $auditModule = 'payment_allocations';

    protected $table = 'payment_allocations';

    protected $fillable = [
        'payment_id',
        'student_invoice_id',
        'amount',
        'allocated_at',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'allocated_at' => 'date',
    ];

    public function payment()
    {
        return $this->belongsTo(Payment::class);
    }

    public function invoice()
    {
        return $this->belongsTo(StudentInvoice::class, 'student_invoice_id');
    }
}
