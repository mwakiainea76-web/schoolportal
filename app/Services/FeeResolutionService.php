<?php

namespace App\Services;

use App\Models\FeeModel;
use App\Models\Enrollment;
use App\Models\AcademicSession;

class FeeResolutionService
{
    /**
     * Resolve the most specific fee model for a given enrollment using the scope hierarchy:
     * curriculum > department > global
     *
     * @param Enrollment $enrollment
     * @param AcademicSession $academicSession
     * @return FeeModel|null
     */
    public function resolveFeeModel(Enrollment $enrollment, AcademicSession $academicSession): ?FeeModel
    {
        // Get curriculum and department from enrollment
        $curriculum = $enrollment->curriculum;
        $department = $curriculum?->department;

        // 1. Try curriculum-specific model (highest priority)
        if ($curriculum) {
            $feeModel = FeeModel::where('scope', 'curriculum')
                ->where('curricula_id', $curriculum->id)
                ->where('academic_session_id', $academicSession->id)
                ->active()
                ->validForDate()
                ->orderBy('priority', 'desc')
                ->first();

            if ($feeModel) {
                return $feeModel;
            }
        }

        // 2. Try department-specific model (medium priority)
        if ($department) {
            $feeModel = FeeModel::where('scope', 'department')
                ->where('department_id', $department->id)
                ->where('academic_session_id', $academicSession->id)
                ->active()
                ->validForDate()
                ->orderBy('priority', 'desc')
                ->first();

            if ($feeModel) {
                return $feeModel;
            }
        }

        // 3. Fall back to global model (lowest priority)
        $feeModel = FeeModel::where('scope', 'global')
            ->where('academic_session_id', $academicSession->id)
            ->active()
            ->validForDate()
            ->orderBy('priority', 'desc')
            ->first();

        return $feeModel;
    }

    /**
     * Resolve fee model without requiring academic session (uses current or default session)
     *
     * @param Enrollment $enrollment
     * @return FeeModel|null
     */
    public function resolveFeeModelForEnrollment(Enrollment $enrollment): ?FeeModel
    {
        $academicSession = $enrollment->academicSession;

        if (!$academicSession) {
            // Try to get the current/default academic session
            $academicSession = \App\Models\AcademicSession::active()->first();
        }

        if (!$academicSession) {
            return null;
        }

        return $this->resolveFeeModel($enrollment, $academicSession);
    }

    /**
     * Check if a more specific fee model exists in the hierarchy
     * Returns the scope hierarchy path for debugging/logging
     *
     * @param Enrollment $enrollment
     * @param AcademicSession $academicSession
     * @return array ['resolved_model' => FeeModel|null, 'hierarchy_path' => string]
     */
    public function resolveFeeModelWithPath(Enrollment $enrollment, AcademicSession $academicSession): array
    {
        $curriculum = $enrollment->curriculum;
        $department = $curriculum?->department;
        $path = [];

        // 1. Check curriculum-specific
        if ($curriculum) {
            $feeModel = FeeModel::where('scope', 'curriculum')
                ->where('curricula_id', $curriculum->id)
                ->where('academic_session_id', $academicSession->id)
                ->active()
                ->validForDate()
                ->orderBy('priority', 'desc')
                ->first();

            $path[] = "curriculum:{$curriculum->id}";

            if ($feeModel) {
                return [
                    'resolved_model' => $feeModel,
                    'hierarchy_path' => implode(' → ', $path),
                ];
            }
        }

        // 2. Check department-specific
        if ($department) {
            $feeModel = FeeModel::where('scope', 'department')
                ->where('department_id', $department->id)
                ->where('academic_session_id', $academicSession->id)
                ->active()
                ->validForDate()
                ->orderBy('priority', 'desc')
                ->first();

            $path[] = "department:{$department->id}";

            if ($feeModel) {
                return [
                    'resolved_model' => $feeModel,
                    'hierarchy_path' => implode(' → ', $path),
                ];
            }
        }

        // 3. Fall back to global
        $feeModel = FeeModel::where('scope', 'global')
            ->where('academic_session_id', $academicSession->id)
            ->active()
            ->validForDate()
            ->orderBy('priority', 'desc')
            ->first();

        $path[] = 'global';

        return [
            'resolved_model' => $feeModel,
            'hierarchy_path' => implode(' → ', $path),
        ];
    }
}
