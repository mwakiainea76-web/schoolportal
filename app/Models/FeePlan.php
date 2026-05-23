<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class FeePlan extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'name',
        'plan_type',
        'status',
        'version',
        'is_active',
        'created_by',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public function createdBy()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function feePlanItems()
    {
        return $this->hasMany(FeePlanItem::class);
    }

    public function feeComponents()
    {
        return $this->hasMany(FeeComponent::class)->orderBy('display_order')->orderBy('name');
    }

    public function assignments()
    {
        return $this->hasMany(FeePlanAssignment::class);
    }
}
