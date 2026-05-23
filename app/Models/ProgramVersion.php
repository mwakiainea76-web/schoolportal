<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ProgramVersion extends Model
{
    use SoftDeletes;

    protected $table = 'program_versions';

    protected $fillable = [
        'name',
        'description',
        'start_date',
        'end_date',
        'is_active',
        'created_by',
        'updated_by',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'start_date' => 'date',
        'end_date' => 'date',
    ];

    public function createdBy()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function updatedBy()
    {
        return $this->belongsTo(User::class, 'updated_by');
    }

    public function programVersionMappings()
    {
        return $this->hasMany(ProgramVersionMapping::class);
    }

    public function activeProgramVersionMapping()
    {
        return $this->hasOne(ProgramVersionMapping::class)->where('is_active', true);
    }

    public function program()
    {
        return $this->hasOneThrough(
            Program::class,
            ProgramVersionMapping::class,
            'program_version_id',
            'id',
            'id',
            'program_id'
        )->where('program_version_mappings.is_active', true);
    }

    public function programs()
    {
        return $this->belongsToMany(Program::class, 'program_version_mappings')
            ->withPivot(['is_active', 'description', 'created_by', 'updated_by'])
            ->withTimestamps();
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function feePlanAssignments()
    {
        return $this->hasMany(FeePlanAssignment::class);
    }
}


