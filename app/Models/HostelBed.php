<?php

namespace App\Models;

use App\Traits\Auditable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class HostelBed extends Model
{
    use Auditable, HasFactory, SoftDeletes;

    protected string $auditModule = 'hostel_beds';

    protected $fillable = [
        'hostel_room_id',
        'bed_number',
        'label',
        'is_active',
    ];

    protected $casts = [
        'bed_number' => 'integer',
        'is_active' => 'boolean',
    ];

    public function room()
    {
        return $this->belongsTo(HostelRoom::class, 'hostel_room_id');
    }

    public function allocations()
    {
        return $this->hasMany(HostelAllocation::class, 'hostel_bed_id');
    }
}
