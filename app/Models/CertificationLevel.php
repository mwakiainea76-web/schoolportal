<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class CertificationLevel extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'exam_body_id',
        'code',
        'name',
        'description',
        'entry_grade',
    ];

    public function examBody()
    {
        return $this->belongsTo(ExamBody::class, 'exam_body_id');
    }

    public function courses()
    {
        return $this->hasMany(Program::class, 'certification_level_id');
    }

    //
}

