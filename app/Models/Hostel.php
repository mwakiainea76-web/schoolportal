<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Hostel extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'name',
        'code',
        'session_fee_amount',
        'gender',
        'location',
        'description',
        'is_active',
    ];

    protected $casts = [
        'session_fee_amount' => 'decimal:2',
        'is_active' => 'boolean',
    ];

    public function rooms()
    {
        return $this->hasMany(HostelRoom::class);
    }

    public function allocations()
    {
        return $this->hasMany(HostelAllocation::class);
    }
}
