<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Refund extends Model
{
    /** @use HasFactory<\Database\Factories\RefundFactory> */
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'student_invoice_id',
        'amount',
        'reason',
        'method',
        'status',
        'raised_by',
        'processed_by',
        'raised_at',
        'processed_at',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'raised_at' => 'datetime',
        'processed_at' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    // ---------------- RELATIONSHIPS ----------------

    public function invoice()
    {
        return $this->belongsTo(StudentInvoices::class, 'student_invoice_id');
    }

    public function raisedByUser()
    {
        return $this->belongsTo(User::class, 'raised_by');
    }

    public function processedByUser()
    {
        return $this->belongsTo(User::class, 'processed_by');
    }
}
