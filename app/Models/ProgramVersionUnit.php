<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProgramVersionUnit extends Model
{
    /** @use HasFactory<\Database\Factories\ProgramVersionUnitFactory> */
    use HasFactory;

    protected $table = 'program_version_units';

    protected $fillable = [
        'module_taught',
        'program_version_mapping_id',
        'unit_id',
    ];

    public function programVersionMapping()
    {
        return $this->belongsTo(ProgramVersionMapping::class);
    }

    public function unit()
    {
        return $this->belongsTo(Unit::class);
    }
}

