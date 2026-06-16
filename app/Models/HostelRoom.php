<?php

namespace App\Models;

use App\Traits\Auditable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class HostelRoom extends Model
{
    use Auditable, HasFactory, SoftDeletes;

    protected string $auditModule = 'hostel_rooms';

    protected $fillable = [
        'hostel_id',
        'name',
        'code',
        'floor',
        'bed_count',
        'is_active',
    ];

    protected $casts = [
        'bed_count' => 'integer',
        'is_active' => 'boolean',
    ];

    public function hostel()
    {
        return $this->belongsTo(Hostel::class);
    }

    public function beds()
    {
        return $this->hasMany(HostelBed::class);
    }
}
