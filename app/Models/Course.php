<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Course extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'courses';

    protected $appends = ['display_name'];

    protected $fillable = [
        'code',
        'name',
        'description',
        'duration_in_months',
        'initials',
        'is_active',
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

    public function curriculum()
    {
        return $this->belongsTo(Curriculum::class);
    }

    public function getDisplayNameAttribute(): string
    {
        return $this->name.' - '.
            optional($this->certificationLevel)->name;
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    //     protected static function booted()
    // {
    //     static::addGlobalScope('active', function ($query) {
    //         $query->where('is_active', true);
    //     });
    // }
}
