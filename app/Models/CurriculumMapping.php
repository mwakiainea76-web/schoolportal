<?php

namespace App\Models;

use App\Traits\Auditable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class CurriculumMapping extends Model
{
    /** @use HasFactory<\Database\Factories\CurriculumMappingFactory> */
    use Auditable, HasFactory, SoftDeletes;

    protected string $auditModule = 'curriculum_mappings';

    protected array $auditExclude = [
        'created_by',
        'updated_by',
    ];

    protected $table = 'curriculum_mappings';

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
        if (! $this->relationLoaded('curriculum')) {
            return '';
        }

        return $this->getRelation('curriculum')?->name ?? '';
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

    public function units()
    {
        return $this->hasMany(Unit::class, 'curriculum_mapping_id');
    }

    public function outgoingTransfers()
    {
        return $this->hasMany(CurriculumTransfer::class, 'from_curriculum_mapping_id');
    }

    public function incomingTransfers()
    {
        return $this->hasMany(CurriculumTransfer::class, 'to_curriculum_mapping_id');
    }
}
