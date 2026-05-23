<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class LedgerTransaction extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'ledger_transactions';

    protected $fillable = [
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
    ];

    protected $casts = [
        'debit' => 'decimal:2',
        'credit' => 'decimal:2',
        'transaction_date' => 'date',
    ];

    public function student()
    {
        return $this->belongsTo(Student::class);
    }

    public function invoice()
    {
        return $this->belongsTo(StudentInvoice::class, 'student_invoice_id');
    }

    public function academicSession()
    {
        return $this->belongsTo(AcademicSession::class, 'academic_session_id');
    }

    public function createdBy()
    {
        return $this->belongsTo(Staff::class, 'created_by');
    }

    public function getNetAmountAttribute(): float
    {
        return (float) $this->debit - (float) $this->credit;
    }
}
