<?php

namespace App\Models;

use App\Traits\Auditable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class LoginAccountHistory extends Model
{
    use Auditable, HasFactory;

    protected string $auditModule = 'login_account_histories';

    protected array $auditExclude = [
        'deactivated_by',
    ];

    protected $fillable = [
        'student_id',
        'user_id',
        'course_change_log_id',
        'login_id',
        'email',
        'status',
        'deactivated_at',
        'deactivated_by',
        'context',
    ];

    protected $casts = [
        'deactivated_at' => 'datetime',
        'context' => 'array',
    ];

    public function student(): BelongsTo
    {
        return $this->belongsTo(Student::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function courseChangeLog(): BelongsTo
    {
        return $this->belongsTo(CourseChangeLog::class);
    }
}
