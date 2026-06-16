<?php

namespace App\Models;

use App\Traits\Auditable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class AcademicSession extends Model
{
    use Auditable, HasFactory, SoftDeletes;

    protected string $auditModule = 'academic_sessions';

    protected $table = 'academic_sessions';

    protected $appends = ['display_name'];

    protected $fillable = [
        'academic_year_id',
        'session_No',
        'session_number',
        'label',
        'start_date',
        'end_date',
        'status',
        'is_active',
    ];


    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function academicYear()
    {
        return $this->belongsTo(AcademicYear::class);
    }

    public function getDisplayNameAttribute()
    {
        $academicYear = $this->relationLoaded('academicYear')
            ? $this->getRelation('academicYear')
            : null;

        return $academicYear
            ? ($academicYear->label ?? $academicYear->academic_year).' - Session '.($this->session_number ?? $this->session_No)
            : 'Session '.($this->session_number ?? $this->session_No);
    }

    public function feePlanAssignments()
    {
        return $this->hasMany(FeePlanAssignment::class, 'session_id');
    }

    public function ledgerTransactions()
    {
        return $this->hasMany(LedgerTransaction::class, 'academic_session_id');
    }
}
