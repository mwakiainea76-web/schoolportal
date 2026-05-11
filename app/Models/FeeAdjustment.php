<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FeeAdjustment extends Model
{
    use HasFactory;

    protected $table = 'fee_adjustments';

    protected $fillable = [
        'student_invoice_id',
        'type',
        'amount',
        'description',
        'applied_at',
        'created_by',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'applied_at' => 'date',
    ];

    public function invoice()
    {
        return $this->belongsTo(StudentInvoice::class, 'student_invoice_id');
    }

    public function createdBy()
    {
        return $this->belongsTo(Staff::class, 'created_by');
    }

    public function signedAmount(): float
    {
        return in_array($this->type, ['discount', 'waiver']) ? -1 * (float) $this->amount : (float) $this->amount;
    }
}
