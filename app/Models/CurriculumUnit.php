<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CurriculumUnit extends Model
{
    /** @use HasFactory<\Database\Factories\CurriculumUnitFactory> */
    use HasFactory;

    protected $table = 'curriculum_units';

    protected $fillable = [
        'module_taught',
        'curriculum_id',
        'unit_id',
    ];

    public function curriculum()
    {
        return $this->belongsTo(Curriculum::class);
    }

    public function unit()
    {
        return $this->belongsTo(Unit::class);
    }
}
