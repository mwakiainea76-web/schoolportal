<?php

namespace App\Http\Controllers\Api\FeeManagement;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\FeeManagement\StoreFeeComponentRequest;
use App\Http\Requests\Api\FeeManagement\UpdateFeeComponentRequest;
use App\Services\FeeManagement\FeeComponentService;
use App\Support\ApiResponse;

class FeeComponentController extends Controller
{
    public function __construct(protected FeeComponentService $components) {}

    public function store(StoreFeeComponentRequest $request, int $id)
    {
        return ApiResponse::success([
            'data' => $this->components->create($id, $request->validated()),
        ], 201);
    }

    public function update(UpdateFeeComponentRequest $request, int $id, string $cid)
    {
        return ApiResponse::success([
            'data' => $this->components->update($id, $cid, $request->validated()),
        ]);
    }

    public function destroy(int $id, string $cid)
    {
        $this->components->delete($id, $cid);

        return ApiResponse::success([
            'message' => 'Fee component removed successfully.',
        ]);
    }
}
