<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable
{
    use HasFactory, HasRoles, Notifiable, SoftDeletes;

    protected $fillable = [
        'email',
        'login_id',
        'password',
        'role',
        'is_active',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    public function student()
    {
        return $this->hasOne(Student::class);
    }

    public function staff()
    {
        return $this->hasOne(Staff::class);
    }

    public function nextOfKin()
    {
        return $this->hasMany(NextOfKin::class, 'user_id');
    }

    // ----------------------------------------------------------------
    // Resolve the profile model — student takes priority,
    // falls back to staff (covers admin, hod, teacher, etc.)
    // Never touches the DB; only reads already-loaded relations.
    // ----------------------------------------------------------------

    private function profile(): mixed
    {
        if ($this->relationLoaded('student')) {
            $student = $this->getRelation('student');
            if ($student !== null) {
                return $student;
            }
        }

        if ($this->relationLoaded('staff')) {
            return $this->getRelation('staff');
        }

        return null;
    }

    public function getFirstNameAttribute(): ?string
    {
        return $this->profile()?->first_name;
    }

    public function getLastNameAttribute(): ?string
    {
        return $this->profile()?->last_name;
    }

    public function getOtherNameAttribute(): ?string
    {
        return $this->profile()?->other_name;
    }

    public function getFullNameAttribute(): ?string
    {
        return $this->profile()?->full_name;
    }

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }
}
