<?php

namespace App\Models;

use App\Traits\Auditable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Complaint extends Model
{
    use Auditable, HasFactory, SoftDeletes;

    protected string $auditModule = 'complaints';

    protected $fillable = [
        'student_id',
        'subject',
        'description',
        'status',
        'escalated_to',
        'escalated_at',
        'admin_notes',
        'resolved_at',
    ];

    protected $casts = [
        'escalated_at' => 'datetime',
        'resolved_at' => 'datetime',
    ];

    public function student()
    {
        return $this->belongsTo(Student::class);
    }

    public function escalatedTo()
    {
        return $this->belongsTo(Staff::class, 'escalated_to');
    }
}
