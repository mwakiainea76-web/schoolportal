<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class AdditionalCharge extends Model
{
    /** @use HasFactory<\Database\Factories\AdditionalChargeFactory> */
    use HasFactory, SoftDeletes;

    protected $table = 'additional_charges';

    protected $fillable = [
        'fee_model_id',
        'name',
        'amount',
        'frequency',
        'description',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'fee_model_id' => 'integer',
    ];

    protected $appends = [
        'display_name',
    ];

    // ---------------- RELATIONSHIPS ----------------

    public function feeModel()
    {
        return $this->belongsTo(FeeModel::class);
    }

    // ---------------- SCOPES ----------------

    public function scopeByFrequency($query, $frequency)
    {
        return $query->where('frequency', $frequency);
    }

    public function scopeAdmission($query)
    {
        return $query->where('frequency', 'admission');
    }

    public function scopeSession($query)
    {
        return $query->where('frequency', 'session');
    }

    public function scopeYearly($query)
    {
        return $query->where('frequency', 'year');
    }

    public function scopeOrdered($query)
    {
        return $query->orderBy('name');
    }

    // ---------------- ACCESSORS & MUTATORS ----------------

    public function getDisplayNameAttribute(): string
    {
        return $this->name.' ('.ucfirst($this->frequency).' - ₦'.number_format($this->amount, 2).')';
    }

    // ---------------- HELPER METHODS ----------------

    public function isAdmission(): bool
    {
        return $this->frequency === 'admission';
    }

    public function isSession(): bool
    {
        return $this->frequency === 'session';
    }

    public function isYearly(): bool
    {
        return $this->frequency === 'year';
    }
}
