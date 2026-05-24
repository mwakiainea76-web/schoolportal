<?php


namespace App\Filters;

use Illuminate\Database\Eloquent\Builder;

class CertificationLevelFilter
{
    protected array $allowedSorts = [
        'id' => 'id',
        'code' => 'code',
        'name' => 'name',
        'description' => 'description',
        'updated' => 'updated_at',
        'entry_grade' => 'entry_grade',
        'created' => 'created_at',
    ];

    public function apply(Builder $query, array $filters): Builder
    {
        return $query
            ->when($filters['exam_body_id'] ?? null, fn ($q, $examBodyId) => $q->where('exam_body_id', $examBodyId))
            ->when($filters['search'] ?? null, fn ($q, $search) => $this->search($q, $search))
            ->when($filters['sort'] ?? null, fn ($q, $sort) => $this->sort($q, $sort, $filters['direction'] ?? 'desc'));
    }

    protected function search(Builder $query, string $search): void
    {
        $query->where(function ($q) use ($search) {
            $q->where('code', 'like', "%{$search}%")
              ->orWhere('name', 'like', "%{$search}%");
        });
    }

    protected function sort(Builder $query, string $sort, string $direction): void
    {
        $direction = in_array($direction, ['asc', 'desc']) ? $direction : 'desc';

        $column = $this->allowedSorts[$sort] ?? 'created_at';

        $query->orderBy($column, $direction);
    }
}
