<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Penalty extends Model
{
    /** @use HasFactory<\Database\Factories\PenaltyFactory> */
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'student_invoice_id',
        'penalty_type',
        'amount',
        'trigger',
        'raised_by',
        'raised_at',
        'notes',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'raised_at' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    // ---------------- RELATIONSHIPS ----------------

    public function invoice()
    {
        return $this->belongsTo(StudentInvoices::class, 'student_invoice_id');
    }

    public function raisedBy()
    {
        return $this->belongsTo(User::class, 'raised_by');
    }
}
