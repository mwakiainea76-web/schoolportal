<?php

namespace App\Services;

use App\Models\FeeAssignment;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Builder;

class FeeAssignmentService
{
    /**
     * Resolve the active fee assignment for a student enrollment.
     * 
     * Uses curriculum mapping-based model:
     * - curriculum_mapping_id
     * - year_of_study
     * - session_number
     * - academic_year_id
     *
     * @param int $academicYearId The academic year
     * @param int|null $curriculumMappingId The curriculum mapping
     * @param int|null $yearOfStudy The year of study
     * @param int|null $sessionNumber The session number within the year
     * @param string|null $effectiveDate The date to check validity (defaults to today)
     * @return FeeAssignment|null The matching fee assignment or null
     */
    public function resolveActiveAssignment(
        int $academicYearId,
        ?int $curriculumMappingId = null,
        ?int $yearOfStudy = null,
        ?int $sessionNumber = null,
        ?string $effectiveDate = null
    ): ?FeeAssignment {
        if (! $curriculumMappingId || ! $yearOfStudy || ! $sessionNumber) {
            return null;
        }

        $effectiveDate = $effectiveDate ? Carbon::parse($effectiveDate)->toDateString() : now()->toDateString();

        return FeeAssignment::query()
            ->where('curriculum_mapping_id', $curriculumMappingId)
            ->where('year_of_study', $yearOfStudy)
            ->where('session_number', $sessionNumber)
            ->where('academic_year_id', $academicYearId)
            ->where('valid_from', '<=', $effectiveDate)
            ->where(function (Builder $query) use ($effectiveDate) {
                $query->whereNull('valid_to')
                    ->orWhere('valid_to', '>=', $effectiveDate);
            })
            ->orderByDesc('created_at')
            ->first();
    }

    /**
     * Resolve a query to get the most recent active curriculum mapping assignment.
     * Used by the model for backward compatibility.
     *
     * @param Builder $query The query builder
     * @return FeeAssignment|null The most recent assignment or null
     */
    public function resolveQuery(Builder $query): ?FeeAssignment
    {
        return $query
            ->whereNotNull('curriculum_mapping_id')
            ->orderBy('created_at', 'desc')
            ->first();
    }
}

