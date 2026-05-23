<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class AcademicYear extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'academic_years';

    protected $appends = ['name'];

    public function getNameAttribute()
    {
        return $this->label ?? $this->academic_year;
    }

    protected $fillable = [
        'academic_year',
        'label',
        'start_date',
        'end_date',
        'is_active',
    ];

    public function academicSessions()
    {
        return $this->hasMany(AcademicSession::class, 'academic_year_id');
    }

    public function feePlanAssignments()
    {
        return $this->hasMany(FeePlanAssignment::class);
    }
}
