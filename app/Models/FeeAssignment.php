<?php

namespace App\Models;

use App\Services\FeeAssignmentService;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class FeeAssignment extends Model
{
    /** @use HasFactory<\Database\Factories\FeeAssignmentFactory> */
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'fee_plan_id',
        'academic_year_id',
        'course_curriculum_id',
        'year_of_study',
        'session_number',
        'created_by',
        'valid_from',
        'valid_to',
        'is_active',
        'approval_status',
    ];

    protected $casts = [
        'year_of_study' => 'integer',
        'session_number' => 'integer',
        'is_active' => 'boolean',
        'approval_status' => 'string',
    ];

    public function resolve($query)
    {
        return (new FeeAssignmentService)->resolveQuery($query);
    }

    public function feePlan()
    {
        return $this->belongsTo(FeePlan::class);
    }

    public function academicSession()
    {
        return $this->belongsTo(AcademicSession::class);
    }

    public function courseCurriculum()
    {
        return $this->belongsTo(CourseCurriculum::class);
    }

    public function createdBy()
    {
        return $this->belongsTo(Staff::class, 'created_by');
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }
}
