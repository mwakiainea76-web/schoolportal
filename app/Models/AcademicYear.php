<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class AcademicYear extends Model
{
    /** @use HasFactory<\Database\Factories\AcademicYearFactory> */
    use HasFactory, SoftDeletes;

    protected $table = 'academic_years';

    protected $appends = ['name']; // This ensures 'name' is included in the JSON

    public function getNameAttribute()
    {
        return $this->academic_year;
    }

    protected $fillable = [
        'academic_year',
        'start_date',
        'end_date',
        'is_active',
    ];

    public function academicSessions()
    {
        return $this->hasMany(AcademicSession::class, 'academic_year');
    }
}
