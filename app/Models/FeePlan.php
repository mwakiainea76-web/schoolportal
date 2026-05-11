<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class FeePlan extends Model
{
    /** @use HasFactory<\Database\Factories\FeePlanFactory> */
    use HasFactory,SoftDeletes;

    protected $fillable = [
        'name',
        'version',
        'is_active',
        'created_by',
    ];

    public function createdBy()
    {
        return $this->belongsTo(Staff::class, 'created_by');
    }

    public function feePlanItems()
    {
        return $this->hasMany(FeePlanItem::class);
    }
}
