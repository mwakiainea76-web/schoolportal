<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class AcademicSession extends Model
{
    /** @use HasFactory<\Database\Factories\AcademicSessionFactory> */
    use HasFactory,SoftDeletes;

    protected $table = 'academic_sessions';

    protected $appends = ['display_name'];

    protected $fillable = [
        'academic_year_id',
        'session_No',
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
            ? $this->academicYear->academic_year.' - Session '.$this->session_No
            : 'Session '.$this->session_No;
    }
}
