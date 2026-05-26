<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Program extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'programs';

    protected $appends = ['display_name'];

    protected $fillable = [
        'code',
        'name',
        'description',
        'duration_in_months',
        'initials',
        'certification_level_id',
        'department_id',
    ];

    public function department()
    {
        return $this->belongsTo(Department::class);
    }

    public function certificationLevel()
    {
        return $this->belongsTo(CertificationLevel::class);
    }

    public function programVersionMappings()
    {
        return $this->hasMany(ProgramVersionMapping::class);
    }

    public function curriculum()
    {
        return $this->hasOneThrough(
            ProgramVersion::class,
            ProgramVersionMapping::class,
            'program_id',
            'id',
            'id',
            'program_version_id'
        )->where('program_version_mappings.is_active', true);
    }

    public function programVersions()
    {
        return $this->belongsToMany(ProgramVersion::class, 'program_version_mappings')
            ->withPivot(['is_active', 'description', 'created_by', 'updated_by'])
            ->withTimestamps();
    }

    public function getDisplayNameAttribute(): string
    {
        $certificationLevel = $this->relationLoaded('certificationLevel')
            ? $this->getRelation('certificationLevel')
            : null;

        return trim($this->name.' - '.($certificationLevel?->name ?? ''), ' -');
    }
}



