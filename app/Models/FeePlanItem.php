<?php

namespace App\Models;

use App\Traits\Auditable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class FeePlanItem extends Model
{
    /** @use HasFactory<\Database\Factories\FeePlanItemFactory> */
    use Auditable, HasFactory,SoftDeletes;

    protected string $auditModule = 'fee_plan_items';

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
