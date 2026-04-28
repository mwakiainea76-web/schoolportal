<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class FeeModel extends Model
{
    /** @use HasFactory<\Database\Factories\FeeModelFactory> */
    use HasFactory, SoftDeletes;

    protected $table = 'fee_models';

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
        'sort_order',
    ];

    protected $casts = [
        'valid_from' => 'date',
        'valid_until' => 'date',
        'is_active' => 'boolean',
        'sort_order' => 'integer',
    ];

    protected $appends = [
        'display_name',
        'is_valid',
    ];

    // ---------------- RELATIONSHIPS ----------------

    public function template()
    {
        return $this->belongsTo(FeeTemplate::class, 'fee_template_id');
    }

    public function department()
    {
        return $this->belongsTo(Department::class);
    }

    public function curriculum()
    {
        return $this->belongsTo(Curriculum::class, 'curricula_id');
    }

    public function academicSession()
    {
        return $this->belongsTo(AcademicSession::class);
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function updater()
    {
        return $this->belongsTo(User::class, 'updated_by');
    }

    public function additionalCharges()
    {
        return $this->hasMany(AdditionalCharge::class);
    }

    // ---------------- SCOPES ----------------

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeGlobal($query)
    {
        return $query->where('scope', 'global');
    }

    public function scopeForDepartment($query, $departmentId)
    {
        return $query->where('scope', 'department')
            ->where('department_id', $departmentId);
    }

    public function scopeForCurriculum($query, $curriculumId)
    {
        return $query->where('scope', 'curriculum')
            ->where('curricula_id', $curriculumId);
    }

    public function scopeValidForDate($query, $date = null)
    {
        $date = $date ?? now()->toDateString();

        return $query->where('valid_from', '<=', $date)
            ->where(function ($q) use ($date) {
                $q->where('valid_until', '>=', $date)
                    ->orWhereNull('valid_until');
            });
    }

    public function scopeOrdered($query)
    {
        return $query->orderBy('priority', 'desc')
            ->orderBy('sort_order', 'asc')
            ->orderBy('created_at', 'desc');
    }

    // ---------------- ACCESSORS & MUTATORS ----------------

    public function getDisplayNameAttribute(): string
    {
        $name = $this->template ? $this->template->name : 'Unknown Template';

        switch ($this->scope) {
            case 'global':
                return $name.' (Global)';
            case 'department':
                $deptName = $this->department ? $this->department->name : 'Unknown Department';

                return $name.' ('.$deptName.')';
            case 'curriculum':
                $curriculumName = $this->curriculum ? $this->curriculum->name : 'Unknown Curriculum';

                return $name.' ('.$curriculumName.')';
            default:
                return $name;
        }
    }

    public function getIsValidAttribute(): bool
    {
        $today = now()->toDateString();

        return $this->valid_from <= $today &&
               ($this->valid_until >= $today || is_null($this->valid_until));
    }

    // ---------------- HELPER METHODS ----------------

    public function isGlobal(): bool
    {
        return $this->scope === 'global';
    }

    public function isForDepartment(): bool
    {
        return $this->scope === 'department';
    }

    public function isForCurriculum(): bool
    {
        return $this->scope === 'curriculum';
    }
}
