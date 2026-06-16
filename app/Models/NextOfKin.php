<?php

namespace App\Models;

use App\Traits\Auditable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class NextOfKin extends Model
{
    /** @use HasFactory<\Database\Factories\NextOfKinFactory> */
    use Auditable, HasFactory, SoftDeletes;

    protected string $auditModule = 'next_of_kin';

    protected $fillable = [
        'first_name',
        'last_name',
        'other_name',
        'relationship',
        'phone_number',
        'email',
        'user_id',
        'alternate_phone_number',
        'county',
    ];
}
