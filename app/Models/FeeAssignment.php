<?php

namespace App\Models;

use App\Services\FeeAssignmentService;
use App\Traits\Auditable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class FeeAssignment extends Model
{
    /** @use HasFactory<\Database\Factories\FeeAssignmentFactory> */
    use Auditable, HasFactory, SoftDeletes;

    protected string $auditModule = 'fee_assignments';

    protected array $auditExclude = [
        'created_by',
    ];

    protected $fillable = [
        'fee_plan_id',
        'academic_year_id',
        'curriculum_mapping_id',
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

    public function academicYear()
    {
        return $this->belongsTo(AcademicYear::class, 'academic_year_id');
    }

    public function curriculumMapping()
    {
        return $this->belongsTo(CurriculumMapping::class, 'curriculum_mapping_id');
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
