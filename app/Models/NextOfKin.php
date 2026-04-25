<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class NextOfKin extends Model
{
    /** @use HasFactory<\Database\Factories\NextOfKinFactory> */
    use HasFactory, SoftDeletes;

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
