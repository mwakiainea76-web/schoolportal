<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Curriculum extends Model
{
    /** @use HasFactory<\Database\Factories\CurriculumFactory> */
    use HasFactory,SoftDeletes;

    protected $table = 'curricula';

    protected $fillable = [
        'name',
        'description',
        'course_id',
        'is_active',
        'description',
        'start_date',
        'end_date',
    ];

    public function course()
    {
        return $this->belongsTo(Course::class);
    }

    public function curriculumUnits()
    {
        return $this->hasMany(curriculum_unit::class);
    }

    public function units()
    {
        return $this->belongsToMany(Unit::class, 'curriculum_units', 'curriculum_id', 'unit_id')
            ->withPivot('module_taught')
            ->withTimestamps();
    }

    
}
