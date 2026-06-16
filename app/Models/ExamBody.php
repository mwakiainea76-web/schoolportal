<?php

namespace App\Models;

use App\Traits\Auditable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ExamBody extends Model
{
    use Auditable, HasFactory,SoftDeletes;

    protected string $auditModule = 'exam_bodies';

    protected $table = 'exam_bodies';

    protected $fillable = [
        'code',
        'name',
        'description',
    ];

    public function certificationLevels()
    {
        return $this->hasMany(CertificationLevel::class, 'exam_body_id');
    }
    

    public function courses()
    {
        return $this->hasMany(Course::class, 'exam_body_id');
    }
}
