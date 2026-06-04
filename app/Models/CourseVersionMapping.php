<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class CourseVersionMapping extends Model
{
    /** @use HasFactory<\Database\Factories\CourseVersionFactory> */
    use HasFactory, SoftDeletes;

    protected $table = 'course_version_mappings';

    protected $fillable = [
        'course_id',
        'course_version_id',
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

    public function courseAlias()
    {
        return $this->course();
    }

    public function courseVersion()
    {
        return $this->belongsTo(CourseVersion::class);
    }

    public function curriculum()
    {
        return $this->courseVersion();
    }

    public function getNameAttribute(): string
    {
        if (! $this->relationLoaded('courseVersion')) {
            return '';
        }

        return $this->getRelation('courseVersion')?->name ?? '';
    }

    // Access department through course
    public function department()
    {
        return $this->hasOneThrough(
            Department::class,
            Course::class,
            'id',           // Foreign key on courses table
            'id',           // Foreign key on departments table
            'course_id',   // Local key on mappings table
            'department_id' // Local key on courses table
        );
    }

    public function courseVersionUnits()
    {
        return $this->hasMany(CourseVersionUnit::class, 'course_version_mapping_id');
    }

    public function units()
    {
        return $this->belongsToMany(Unit::class, 'course_version_units', 'course_version_mapping_id', 'unit_id')
            ->withPivot('module_taught')
            ->withTimestamps();
    }

    public function outgoingTransfers()
    {
        return $this->hasMany(CourseVersionTransfer::class, 'from_course_version_mapping_id');
    }

    public function incomingTransfers()
    {
        return $this->hasMany(CourseVersionTransfer::class, 'to_course_version_mapping_id');
    }
}
