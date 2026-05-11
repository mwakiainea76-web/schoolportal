<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class FeePlanItem extends Model
{
    /** @use HasFactory<\Database\Factories\FeePlanItemFactory> */
    use HasFactory,SoftDeletes;

    protected $fillable = [
        'fee_plan_id',
        'name',
        'amount',
    ];

    public function feePlan()
    {
        return $this->belongsTo(FeePlan::class);
    }
}
