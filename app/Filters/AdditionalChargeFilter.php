<?php
namespace App\Filters;

use Illuminate\Database\Eloquent\Builder;

class AdditionalChargeFilter
{
    public function apply(Builder $query, array $filters): Builder
    {
        return $query
            ->when($filters['search'] ?? null, fn ($q, $search) => $this->search($q, $search))
            ->when($filters['frequency'] ?? null, fn ($q, $frequency) => $this->frequency($q, $frequency))
            ->when($filters['fee_model'] ?? null, fn ($q, $feeModelId) => $this->feeModel($q, $feeModelId))
            ->when($filters['min_amount'] ?? null, fn ($q, $minAmount) => $this->minAmount($q, $minAmount))
            ->when($filters['max_amount'] ?? null, fn ($q, $maxAmount) => $this->maxAmount($q, $maxAmount))
            ->when($filters['sort'] ?? null, fn ($q) => $this->sort($q, $filters));
    }

    // ---------------- SEARCH ----------------
    protected function search(Builder $query, string $search): void
    {
        $query->where(function ($q) use ($search) {
            $q->where('name', 'like', "%{$search}%")
              ->orWhere('description', 'like', "%{$search}%");
        });
    }

    // ---------------- FREQUENCY FILTER ----------------
    protected function frequency(Builder $query, string $frequency): void
    {
        $query->where('frequency', $frequency);
    }

    // ---------------- FEE MODEL FILTER ----------------
    protected function feeModel(Builder $query, int $feeModelId): void
    {
        $query->where('fee_model_id', $feeModelId);
    }

    // ---------------- AMOUNT FILTERS ----------------
    protected function minAmount(Builder $query, float $minAmount): void
    {
        $query->where('amount', '>=', $minAmount);
    }

    protected function maxAmount(Builder $query, float $maxAmount): void
    {
        $query->where('amount', '<=', $maxAmount);
    }

    // ---------------- SORT ----------------
    protected function sort(Builder $query, array $filters): void
    {
        $field = $filters['sort'] ?? 'created_at';
        $direction = $filters['direction'] ?? 'desc';

        // Handle special sort fields
        if ($field === 'fee_model_name') {
            $query->join('fee_models', 'additional_charges.fee_model_id', '=', 'fee_models.id')
                  ->join('fee_templates', 'fee_models.fee_template_id', '=', 'fee_templates.id')
                  ->orderBy('fee_templates.name', $direction)
                  ->select('additional_charges.*');
        } else {
            $query->orderBy($field, $direction);
        }
    }
}