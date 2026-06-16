<?php

namespace App\Models;

use App\Traits\Auditable;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class FeeComponent extends Model
{
    use Auditable, HasFactory, HasUuids, SoftDeletes;

    protected string $auditModule = 'fee_components';

    protected $fillable = [
        'fee_plan_id',
        'name',
        'amount',
        'is_optional',
        'display_order',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'is_optional' => 'boolean',
        'display_order' => 'integer',
    ];

    public function feePlan()
    {
        return $this->belongsTo(FeePlan::class);
    }
}
