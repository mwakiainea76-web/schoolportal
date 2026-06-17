<?php

namespace App\Models;

use App\Traits\Auditable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class StaffLoanReduction extends Model
{
    use Auditable, HasFactory, SoftDeletes;

    protected string $auditModule = 'hr.loan_reductions';

    protected $fillable = [
        'staff_id',
        'loan_name',
        'principal_amount',
        'monthly_reduction',
        'start_date',
        'end_date',
        'status',
        'notes',
        'created_by',
    ];

    protected function casts(): array
    {
        return [
            'principal_amount' => 'decimal:2',
            'monthly_reduction' => 'decimal:2',
            'start_date' => 'date',
            'end_date' => 'date',
        ];
    }

    public function staff()
    {
        return $this->belongsTo(Staff::class);
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
