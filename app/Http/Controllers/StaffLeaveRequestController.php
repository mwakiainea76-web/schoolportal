<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreStaffLeaveRequest;
use App\Models\Staff;
use App\Models\StaffLeaveRequest;
use Carbon\Carbon;
use Illuminate\Http\Request;

class StaffLeaveRequestController extends Controller
{
    public function index(Request $request)
    {
        $staff = $request->user()?->staff;
        abort_unless($staff, 403);

        return inertia('HR/LeaveRequests/Index', [
            'leaveRequests' => $this->leaveRequestsFor($request),
            'canViewAllRequests' => $request->user()->hasRole('admin'),
        ]);
    }

    public function create(Request $request)
    {
        $staff = $request->user()?->staff;
        abort_unless($staff, 403);

        return inertia('HR/LeaveRequests/Create', [
            'staffOptions' => [$this->staffOption($staff)],
        ]);
    }

    public function store(StoreStaffLeaveRequest $request)
    {
        $staff = Staff::query()
            ->where('staff_number', $request->staff_number)
            ->firstOrFail();

        abort_if(
            ! $request->user()->hasRole('admin') && (int) $staff->id !== (int) $request->user()->staff?->id,
            403
        );

        $startDate = Carbon::parse($request->start_date)->startOfDay();
        $endDate = Carbon::parse($request->end_date)->startOfDay();

        StaffLeaveRequest::create([
            'staff_id' => $staff->id,
            'leave_type' => $request->leave_type,
            'start_date' => $startDate->toDateString(),
            'end_date' => $endDate->toDateString(),
            'total_days' => $startDate->diffInDays($endDate) + 1,
            'reason' => $request->reason,
            'status' => 'pending',
        ]);

        return redirect()
            ->route('hr.leave-requests.index')
            ->with('success', 'Leave request submitted successfully.');
    }

    private function leaveRequestsFor(Request $request)
    {
        $staff = $request->user()->staff;

        $requests = StaffLeaveRequest::query()
            ->with([
                'staff:id,department_id,staff_number,first_name,last_name,other_name,designation',
                'staff.department:id,name',
                'reviewer:id,staff_number,first_name,last_name,other_name',
            ])
            ->when(! $request->user()->hasRole('admin'), fn ($query) => $query->where('staff_id', $staff->id))
            ->latest('id')
            ->paginate(10)
            ->withQueryString();

        return $requests->through(fn (StaffLeaveRequest $leaveRequest) => [
            'id' => $leaveRequest->id,
            'leave_type' => $leaveRequest->leave_type,
            'start_date' => $leaveRequest->start_date?->toDateString(),
            'end_date' => $leaveRequest->end_date?->toDateString(),
            'total_days' => $leaveRequest->total_days,
            'reason' => $leaveRequest->reason,
            'status' => $leaveRequest->status,
            'created_at' => $leaveRequest->created_at?->format('Y-m-d H:i'),
            'staff' => $leaveRequest->staff ? [
                'staff_number' => $leaveRequest->staff->staff_number,
                'name' => $leaveRequest->staff->full_name,
                'designation' => $leaveRequest->staff->designation,
                'department' => $leaveRequest->staff->department?->name,
            ] : null,
            'reviewer' => $leaveRequest->reviewer ? [
                'staff_number' => $leaveRequest->reviewer->staff_number,
                'name' => $leaveRequest->reviewer->full_name,
            ] : null,
        ]);
    }

    private function staffOption(Staff $staff): array
    {
        return [
            'id' => $staff->staff_number,
            'staff_id' => $staff->id,
            'staff_number' => $staff->staff_number,
            'name' => collect([
                $staff->full_name,
                $staff->staff_number,
                $staff->designation,
            ])->filter()->implode(' - '),
            'email' => $staff->email,
        ];
    }
}
