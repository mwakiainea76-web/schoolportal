<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ProgramVersionMapping extends Model
{
    /** @use HasFactory<\Database\Factories\ProgramVersionFactory> */
    use HasFactory, SoftDeletes;

    protected $table = 'program_version_mappings';

    protected $fillable = [
        'program_id',
        'program_version_id',
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

    public function program()
    {
        return $this->belongsTo(Program::class);
    }

    public function course()
    {
        return $this->program();
    }

    public function programVersion()
    {
        return $this->belongsTo(ProgramVersion::class);
    }

    public function curriculum()
    {
        return $this->programVersion();
    }

    public function getNameAttribute(): string
    {
        if (! $this->relationLoaded('programVersion')) {
            return '';
        }

        return $this->getRelation('programVersion')?->name ?? '';
    }

    // Access department through program
    public function department()
    {
        return $this->hasOneThrough(
            Department::class,
            Program::class,
            'id',           // Foreign key on programs table
            'id',           // Foreign key on departments table
            'program_id',   // Local key on mappings table
            'department_id' // Local key on programs table
        );
    }

    public function programVersionUnits()
    {
        return $this->hasMany(ProgramVersionUnit::class, 'program_version_mapping_id');
    }

    public function units()
    {
        return $this->belongsToMany(Unit::class, 'program_version_units', 'program_version_mapping_id', 'unit_id')
            ->withPivot('module_taught')
            ->withTimestamps();
    }
}
