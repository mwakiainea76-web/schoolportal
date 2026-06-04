<?php

namespace App\Http\Controllers\Api\FeeManagement;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\FeeManagement\AssignFeePlanRequest;
use App\Http\Requests\Api\FeeManagement\BulkAssignFeePlanRequest;
use App\Http\Requests\Api\FeeManagement\CancelAssignmentRequest;
use App\Services\FeeManagement\FeeAssignmentService;
use App\Support\ApiResponse;

class FeeAssignmentController extends Controller
{
    public function __construct(protected FeeAssignmentService $assignments) {}

    public function assign(AssignFeePlanRequest $request, int $id)
    {
        return ApiResponse::success([
            'data' => $this->assignments->assign($id, $request->validated(), auth()->id()),
        ], 201);
    }

    public function bulkAssign(BulkAssignFeePlanRequest $request, int $id)
    {
        return ApiResponse::success([
            'data' => $this->assignments->bulkAssign($id, $request->validated(), auth()->id()),
        ], 201);
    }

    public function curriculumAssignments(int $id)
    {
        return ApiResponse::success([
            'data' => $this->assignments->assignmentsForCourseVersion($id),
        ]);
    }

    public function cancel(CancelAssignmentRequest $request, string $id)
    {
        return ApiResponse::success([
            'data' => $this->assignments->cancel($id, $request->validated()['reason'], auth()->id()),
        ]);
    }

    public function unassignedCurricula(int $id, int $sid)
    {
        return ApiResponse::success([
            'data' => $this->assignments->unassignedCurricula($id, $sid),
        ]);
    }
}

