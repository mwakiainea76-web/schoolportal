<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class FeeTemplate extends Model
{
    /** @use HasFactory<\Database\Factories\FeeTemplateFactory> */
    use HasFactory, SoftDeletes;

    protected $table = 'fee_templates'; // fee_templates

    protected $fillable = [
        'name',
        'description',
        'is_active',
        'is_reusable',
    ];

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }
}
