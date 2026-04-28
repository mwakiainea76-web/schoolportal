<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class FeeAdjustment extends Model
{
    /** @use HasFactory<\Database\Factories\FeeAdjustmentFactory> */
    use HasFactory, SoftDeletes;

    protected $table = 'fee_adjustments';

    protected $fillable = [
        'student_invoice_id',
        'scope',
        'scope_ref',
        'type',
        'value',
        'reason',
        'approved_by',
    ];

    protected $casts = [
        'value' => 'decimal:2',
        'scope_ref' => 'integer',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    // ---------------- RELATIONSHIPS ----------------

    public function invoice()
    {
        return $this->belongsTo(StudentInvoices::class, 'student_invoice_id');
    }

    public function approver()
    {
        return $this->belongsTo(User::class, 'approved_by');
    }

    // ---------------- SCOPES ----------------

    public function scopePercentage($query)
    {
        return $query->where('type', 'percentage');
    }

    public function scopeFixed($query)
    {
        return $query->where('type', 'fixed');
    }

    // ---------------- HELPER METHODS ----------------

    public function calculateAdjustment($grossAmount): float
    {
        if ($this->type === 'percentage') {
            return ($grossAmount * (float)$this->value) / 100;
        }

        return (float)$this->value;
    }
}
