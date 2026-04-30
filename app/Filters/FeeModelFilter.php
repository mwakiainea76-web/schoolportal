<?php
namespace App\Filters;

use Illuminate\Database\Eloquent\Builder;

class FeeModelFilter
{
    public function apply(Builder $query, array $filters): Builder
    {
        return $query
            ->when($filters['search'] ?? null, fn ($q, $search) => $this->search($q, $search))
            ->when($filters['status'] ?? null, fn ($q, $status) => $this->status($q, $status))
            ->when($filters['scope'] ?? null, fn ($q, $scope) => $this->scope($q, $scope))
            ->when($filters['priority'] ?? null, fn ($q, $priority) => $this->priority($q, $priority))
            ->when($filters['template'] ?? null, fn ($q, $templateId) => $this->template($q, $templateId))
            ->when($filters['department'] ?? null, fn ($q, $departmentId) => $this->department($q, $departmentId))
            ->when($filters['curriculum'] ?? null, fn ($q, $curriculumId) => $this->curriculum($q, $curriculumId))
            ->when($filters['academic_session'] ?? null, fn ($q, $sessionId) => $this->academicSession($q, $sessionId))
            ->when($filters['valid'] ?? null, fn ($q, $valid) => $this->valid($q, $valid))
            ->when($filters['sort'] ?? null, fn ($q) => $this->sort($q, $filters));
    }

    // ---------------- SEARCH ----------------
    protected function search(Builder $query, string $search): void
    {
        $query->whereHas('template', function ($q) use ($search) {
            $q->where('name', 'like', "%{$search}%")
              ->orWhere('description', 'like', "%{$search}%");
        });
    }

    // ---------------- STATUS FILTER ----------------
    protected function status(Builder $query, string $status): void
    {
        if ($status === 'active') {
            $query->where('is_active', true);
        }

        if ($status === 'inactive') {
            $query->where('is_active', false);
        }
    }

    // ---------------- SCOPE FILTER ----------------
    protected function scope(Builder $query, string $scope): void
    {
        $query->where('scope', $scope);
    }

    // ---------------- PRIORITY FILTER ----------------
    protected function priority(Builder $query, string $priority): void
    {
        $query->where('priority', $priority);
    }

    // ---------------- TEMPLATE FILTER ----------------
    protected function template(Builder $query, int $templateId): void
    {
        $query->where('fee_template_id', $templateId);
    }

    // ---------------- DEPARTMENT FILTER ----------------
    protected function department(Builder $query, int $departmentId): void
    {
        $query->where('department_id', $departmentId);
    }

    // ---------------- CURRICULUM FILTER ----------------
    protected function curriculum(Builder $query, int $curriculumId): void
    {
        $query->where('course_curriculum_id', $curriculumId);
    }

    // ---------------- ACADEMIC SESSION FILTER ----------------
    protected function academicSession(Builder $query, int $sessionId): void
    {
        $query->where('academic_session_id', $sessionId);
    }

    // ---------------- VALID FILTER ----------------
    protected function valid(Builder $query, string $valid): void
    {
        $today = now()->toDateString();

        if ($valid === 'valid') {
            $query->where('valid_from', '<=', $today)
                  ->where(function ($q) use ($today) {
                      $q->where('valid_until', '>=', $today)
                        ->orWhereNull('valid_until');
                  });
        }

        if ($valid === 'expired') {
            $query->where('valid_until', '<', $today);
        }

        if ($valid === 'upcoming') {
            $query->where('valid_from', '>', $today);
        }
    }

    // ---------------- SORT ----------------
    protected function sort(Builder $query, array $filters): void
    {
        $field = $filters['sort'] ?? 'created_at';
        $direction = $filters['direction'] ?? 'desc';

        // Handle special sort fields
        if ($field === 'template_name') {
            $query->join('fee_templates', 'fee_models.fee_template_id', '=', 'fee_templates.id')
                  ->orderBy('fee_templates.name', $direction)
                  ->select('fee_models.*');
        } elseif ($field === 'department_name') {
            $query->leftJoin('departments', 'fee_models.department_id', '=', 'departments.id')
                  ->orderBy('departments.name', $direction)
                  ->select('fee_models.*');
        } elseif ($field === 'curriculum_name') {
            $query->leftJoin('course_curriculum', 'fee_models.course_curriculum_id', '=', 'course_curriculum.id')
                  ->leftJoin('curriculum', 'course_curriculum.curriculum_id', '=', 'curriculum.id')
                  ->orderBy('curriculum.name', $direction)
                  ->select('fee_models.*');
        } else {
            $query->orderBy($field, $direction);
        }
    }
}
