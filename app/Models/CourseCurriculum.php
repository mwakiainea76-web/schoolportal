<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class CourseCurriculum extends Model
{
    /** @use HasFactory<\Database\Factories\CurriculumFactory> */
    use HasFactory, SoftDeletes;

    protected $table = 'course_curriculum';

    protected $fillable = [
        'course_id',
        'curriculum_id',
        'is_active',
        'description',
        'created_by',
        'updated_by',
    ];

    protected $appends = ['name'];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function course()
    {
        return $this->belongsTo(Course::class);
    }

    public function curriculum()
    {
        return $this->belongsTo(Curriculum::class);
    }

    public function getNameAttribute(): string
    {
        return $this->curriculum?->name ?? '';
    }

    // Access department through course
    public function department()
    {
        return $this->hasOneThrough(
            Department::class,
            Course::class,
            'id',           // Foreign key on courses table
            'id',           // Foreign key on departments table
            'course_id',    // Local key on curricula table
            'department_id' // Local key on courses table
        );
    }

    public function curriculumUnits()
    {
        return $this->hasMany(CurriculumUnit::class, 'course_curriculum_id');
    }

    public function units()
    {
        return $this->belongsToMany(Unit::class, 'curriculum_units', 'course_curriculum_id', 'unit_id')
            ->withPivot('module_taught')
            ->withTimestamps();
    }
}
