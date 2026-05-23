<?php

namespace App\Http\Controllers\Api\FeeManagement;

use App\Exceptions\ApiException;
use App\Http\Controllers\Controller;
use App\Http\Requests\Api\FeeManagement\StoreFeePlanRequest;
use App\Http\Requests\Api\FeeManagement\UpdateFeePlanRequest;
use App\Services\FeeManagement\FeeAssignmentService;
use App\Services\FeeManagement\FeePlanService;
use App\Support\ApiResponse;
use Illuminate\Http\Request;

class FeePlanController extends Controller
{
    public function __construct(
        protected FeePlanService $plans,
        protected FeeAssignmentService $assignments
    ) {}

    public function index(Request $request)
    {
        return ApiResponse::success([
            'data' => $this->plans->list($request->query('status')),
        ]);
    }

    public function store(StoreFeePlanRequest $request)
    {
        $createdBy = auth()->id();

        if (! $createdBy) {
            throw new ApiException('SERVER_ERROR', 'An authenticated user is required to create fee plans.', 401);
        }

        return ApiResponse::success([
            'data' => $this->plans->create($request->validated(), $createdBy),
        ], 201);
    }

    public function show(int $id)
    {
        return ApiResponse::success([
            'data' => $this->plans->details($id),
        ]);
    }

    public function update(UpdateFeePlanRequest $request, int $id)
    {
        return ApiResponse::success([
            'data' => $this->plans->update($id, $request->validated()),
        ]);
    }

    public function publish(int $id)
    {
        return ApiResponse::success([
            'data' => $this->plans->publish($id),
        ]);
    }

    public function archive(int $id)
    {
        return ApiResponse::success([
            'data' => $this->plans->archive($id),
        ]);
    }

    public function destroy(int $id)
    {
        $this->plans->delete($id);

        return ApiResponse::success([
            'message' => 'Fee plan deleted successfully.',
        ]);
    }

    public function assignments(int $id)
    {
        return ApiResponse::success([
            'data' => $this->assignments->assignmentsForPlan($id),
        ]);
    }

    public function reusePreview(int $id)
    {
        return ApiResponse::success([
            'data' => $this->plans->reusePreview($id),
        ]);
    }
}
