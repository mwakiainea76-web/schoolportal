<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Staff;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class StaffLookupController extends Controller
{
    public function hods(Request $request): JsonResponse
    {
        $q = trim((string) $request->query('q', ''));

        $staffs = Staff::query()
            ->with('user:id,first_name,last_name,email')
            ->where('staff_status', 'active')
            ->when($q !== '', function ($query) use ($q) {
                $query->where(function ($searchQuery) use ($q) {
                    $searchQuery
                        ->where('staff_number', 'like', "%{$q}%")
                        ->orWhere('designation', 'like', "%{$q}%")
                        ->orWhereHas('user', function ($userQuery) use ($q) {
                            $userQuery
                                ->where('first_name', 'like', "%{$q}%")
                                ->orWhere('last_name', 'like', "%{$q}%")
                                ->orWhere('email', 'like', "%{$q}%");
                        });
                });
            })
            ->orderByDesc('id')
            ->limit(10)
            ->get(['id', 'user_id', 'staff_number', 'designation'])
            ->map(fn (Staff $staff) => [
                'id' => $staff->id,
                'name' => collect([
                    trim(($staff->user?->first_name ?? '').' '.($staff->user?->last_name ?? '')),
                    $staff->staff_number,
                    $staff->designation,
                ])->filter()->implode(' - '),
            ]);

        return response()->json($staffs);
    }
}
