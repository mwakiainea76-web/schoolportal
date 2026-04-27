<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class FeeComponent extends Model
{
    /** @use HasFactory<\Database\Factories\FeeComponentFactory> */
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'fee_template_id',
        'name',
        'type',
        'amount',
        'frequency',
        'is_optional',
        'sort_order',
    ];

    protected $casts = [
        'amount' => 'string',
    ];

    public function template()
    {
        return $this->belongsTo(FeeTemplate::class, 'fee_template_id');
    }
}
