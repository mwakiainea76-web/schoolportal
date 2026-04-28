<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class FeeModel extends Model
{
    /** @use HasFactory<\Database\Factories\FeeModelFactory> */
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'scope',
        'priority',
        'fee_template_id',
        'department_id',
        'curricula_id',
        'valid_from',
        'valid_until',
        'academic_session_id',
        'is_active',
        'created_by',
        'updated_by',
    ];

    public function template()
    {
        return $this->belongsTo(FeeTemplate::class, 'template_fee_id');
    }

    public function department()
    {
        return $this->belongsTo(Department::class, 'department_id');
    }

    public function curriculum()
    {
        return $this->belongsTo(Curriculum::class, 'curriculum_id');
    }
}
