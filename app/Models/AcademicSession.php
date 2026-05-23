<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class AcademicSession extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'academic_sessions';

    protected $appends = ['display_name'];

    protected $fillable = [
        'academic_year_id',
        'session_No',
        'session_number',
        'label',
        'start_date',
        'end_date',
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
        return $this->academicYear
            ? ($this->academicYear->label ?? $this->academicYear->academic_year).' - Session '.($this->session_number ?? $this->session_No)
            : 'Session '.($this->session_number ?? $this->session_No);
    }

    public function feePlanAssignments()
    {
        return $this->hasMany(FeePlanAssignment::class, 'session_id');
    }
}
