<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class StudentCredit extends Model
{
    /** @use HasFactory<\Database\Factories\StudentCreditFactory> */
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'student_id',
        'source_invoice_id',
        'applied_invoice_id',
        'amount',
        'status',
        'applied_at',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'applied_at' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    // ---------------- RELATIONSHIPS ----------------

    public function student()
    {
        return $this->belongsTo(Student::class);
    }

    public function sourceInvoice()
    {
        return $this->belongsTo(StudentInvoices::class, 'source_invoice_id');
    }

    public function appliedInvoice()
    {
        return $this->belongsTo(StudentInvoices::class, 'applied_invoice_id');
    }

    // ---------------- SCOPES ----------------

    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    public function scopeApplied($query)
    {
        return $query->where('status', 'applied');
    }
}
