<?php

namespace App\Services\Analytics;

use App\Models\AcademicSession;
use App\Models\HostelBed;
use App\Models\StudentInvoice;
use App\Services\Analytics\Concerns\BuildsAnalyticsFilters;
use Illuminate\Support\Facades\DB;

class HostelAnalyticsService
{
    use BuildsAnalyticsFilters;

    public function summary(array $filters = []): array
    {
        $filters = $this->normalizeFilters($filters);
        $activeSession = AcademicSession::query()
            ->with('academicYear')
            ->where('is_active', true)
            ->latest('start_date')
            ->latest('id')
            ->first();

        $includedInvoiceStatuses = ['issued', 'partial', 'paid'];
        $activeBedsQuery = HostelBed::query()
            ->join('hostel_rooms', 'hostel_rooms.id', '=', 'hostel_beds.hostel_room_id')
            ->join('hostels', 'hostels.id', '=', 'hostel_rooms.hostel_id')
            ->whereNull('hostel_beds.deleted_at')
            ->whereNull('hostel_rooms.deleted_at')
            ->whereNull('hostels.deleted_at')
            ->where('hostel_beds.is_active', true)
            ->where('hostel_rooms.is_active', true)
            ->where('hostels.is_active', true);

        $allocationBase = DB::table('hostel_allocations')
            ->join('students', 'students.id', '=', 'hostel_allocations.student_id')
            ->whereNull('students.deleted_at')
            ->where('hostel_allocations.status', 'active')
            ->when($activeSession, fn ($query) => $query->where('hostel_allocations.academic_session_id', $activeSession->id));

        $hostelInvoiceBase = StudentInvoice::query()
            ->where('invoice_type', 'hostel')
            ->whereIn('status', $includedInvoiceStatuses)
            ->where('approval_status', '!=', 'rejected')
            ->when($activeSession, fn ($query) => $query->where('academic_session_id', $activeSession->id));

        $activeBeds = (clone $activeBedsQuery)->count();
        $occupiedBeds = (clone $allocationBase)->distinct()->count('hostel_allocations.hostel_bed_id');
        $allocatedStudents = (clone $allocationBase)->distinct()->count('hostel_allocations.student_id');
        $hostelBilledStudents = (clone $hostelInvoiceBase)->distinct()->count('student_id');
        $hostelRevenueInvoiced = (clone $hostelInvoiceBase)->sum('amount_due');
        $hostelRevenueCollected = DB::table('payment_allocations')
            ->join('payments', 'payments.id', '=', 'payment_allocations.payment_id')
            ->join('student_invoices', 'student_invoices.id', '=', 'payment_allocations.student_invoice_id')
            ->where('payments.status', 'completed')
            ->where('student_invoices.invoice_type', 'hostel')
            ->whereIn('student_invoices.status', $includedInvoiceStatuses)
            ->where('student_invoices.approval_status', '!=', 'rejected')
            ->when($activeSession, fn ($query) => $query->where('student_invoices.academic_session_id', $activeSession->id))
            ->sum('payment_allocations.amount');

        $occupancyRate = $activeBeds > 0
            ? round(($occupiedBeds / $activeBeds) * 100, 2)
            : 0.0;

        $occupancyByHostel = DB::table('hostels')
            ->leftJoin('hostel_rooms', function ($join) {
                $join->on('hostel_rooms.hostel_id', '=', 'hostels.id')
                    ->whereNull('hostel_rooms.deleted_at')
                    ->where('hostel_rooms.is_active', true);
            })
            ->leftJoin('hostel_beds', function ($join) {
                $join->on('hostel_beds.hostel_room_id', '=', 'hostel_rooms.id')
                    ->whereNull('hostel_beds.deleted_at')
                    ->where('hostel_beds.is_active', true);
            })
            ->leftJoin('hostel_allocations', function ($join) use ($activeSession) {
                $join->on('hostel_allocations.hostel_bed_id', '=', 'hostel_beds.id')
                    ->where('hostel_allocations.status', '=', 'active');

                if ($activeSession) {
                    $join->where('hostel_allocations.academic_session_id', '=', $activeSession->id);
                }
            })
            ->whereNull('hostels.deleted_at')
            ->where('hostels.is_active', true)
            ->select('hostels.id', 'hostels.name')
            ->selectRaw('COUNT(DISTINCT hostel_beds.id) as active_beds')
            ->selectRaw('COUNT(DISTINCT hostel_allocations.hostel_bed_id) as occupied_beds')
            ->groupBy('hostels.id', 'hostels.name')
            ->orderBy('hostels.name')
            ->get()
            ->map(function ($row) {
                $activeBeds = (int) $row->active_beds;
                $occupiedBeds = (int) $row->occupied_beds;

                return [
                    'hostel_id' => (int) $row->id,
                    'hostel_name' => $row->name,
                    'active_beds' => $activeBeds,
                    'occupied_beds' => $occupiedBeds,
                    'available_beds' => max($activeBeds - $occupiedBeds, 0),
                    'occupancy_rate' => $activeBeds > 0
                        ? round(($occupiedBeds / $activeBeds) * 100, 2)
                        : 0.0,
                ];
            })
            ->all();

        $occupancyByRoom = DB::table('hostel_rooms')
            ->join('hostels', 'hostels.id', '=', 'hostel_rooms.hostel_id')
            ->leftJoin('hostel_beds', function ($join) {
                $join->on('hostel_beds.hostel_room_id', '=', 'hostel_rooms.id')
                    ->whereNull('hostel_beds.deleted_at')
                    ->where('hostel_beds.is_active', true);
            })
            ->leftJoin('hostel_allocations', function ($join) use ($activeSession) {
                $join->on('hostel_allocations.hostel_bed_id', '=', 'hostel_beds.id')
                    ->where('hostel_allocations.status', '=', 'active');

                if ($activeSession) {
                    $join->where('hostel_allocations.academic_session_id', '=', $activeSession->id);
                }
            })
            ->whereNull('hostel_rooms.deleted_at')
            ->whereNull('hostels.deleted_at')
            ->where('hostel_rooms.is_active', true)
            ->where('hostels.is_active', true)
            ->select('hostel_rooms.id', 'hostel_rooms.name', 'hostels.name as hostel_name')
            ->selectRaw('COUNT(DISTINCT hostel_beds.id) as active_beds')
            ->selectRaw('COUNT(DISTINCT hostel_allocations.hostel_bed_id) as occupied_beds')
            ->groupBy('hostel_rooms.id', 'hostel_rooms.name', 'hostels.name')
            ->orderBy('hostels.name')
            ->orderBy('hostel_rooms.name')
            ->limit(10)
            ->get()
            ->map(function ($row) {
                $activeBeds = (int) $row->active_beds;
                $occupiedBeds = (int) $row->occupied_beds;

                return [
                    'room_id' => (int) $row->id,
                    'room_name' => $row->name,
                    'hostel_name' => $row->hostel_name,
                    'active_beds' => $activeBeds,
                    'occupied_beds' => $occupiedBeds,
                    'available_beds' => max($activeBeds - $occupiedBeds, 0),
                    'occupancy_rate' => $activeBeds > 0
                        ? round(($occupiedBeds / $activeBeds) * 100, 2)
                        : 0.0,
                ];
            })
            ->all();

        $duplicateAllocations = DB::table('hostel_allocations')
            ->join('students', 'students.id', '=', 'hostel_allocations.student_id')
            ->whereNull('students.deleted_at')
            ->where('hostel_allocations.status', 'active')
            ->when($activeSession, fn ($query) => $query->where('hostel_allocations.academic_session_id', $activeSession->id))
            ->groupBy(
                'hostel_allocations.student_id',
                'hostel_allocations.academic_session_id',
                'students.admission_number',
                'students.first_name',
                'students.last_name'
            )
            ->select(
                'hostel_allocations.student_id',
                'hostel_allocations.academic_session_id',
                'students.admission_number',
                'students.first_name',
                'students.last_name'
            )
            ->selectRaw('COUNT(*) as allocation_count')
            ->havingRaw('COUNT(*) > 1')
            ->orderByDesc('allocation_count')
            ->limit(10)
            ->get()
            ->map(fn ($row) => [
                'student_id' => (int) $row->student_id,
                'admission_number' => $row->admission_number,
                'student_name' => "{$row->first_name} {$row->last_name}",
                'allocation_count' => (int) $row->allocation_count,
            ])
            ->all();

        $roomsOverCapacity = DB::table('hostel_allocations')
            ->join('hostel_rooms', 'hostel_rooms.id', '=', 'hostel_allocations.hostel_room_id')
            ->join('hostels', 'hostels.id', '=', 'hostel_rooms.hostel_id')
            ->whereNull('hostel_rooms.deleted_at')
            ->whereNull('hostels.deleted_at')
            ->where('hostel_allocations.status', 'active')
            ->when($activeSession, fn ($query) => $query->where('hostel_allocations.academic_session_id', $activeSession->id))
            ->groupBy('hostel_rooms.id', 'hostel_rooms.name', 'hostel_rooms.bed_count', 'hostels.name')
            ->select(
                'hostel_rooms.id',
                'hostel_rooms.name',
                'hostel_rooms.bed_count',
                'hostels.name as hostel_name'
            )
            ->selectRaw('COUNT(*) as allocation_count')
            ->havingRaw('COUNT(*) > hostel_rooms.bed_count')
            ->orderByDesc('allocation_count')
            ->limit(10)
            ->get()
            ->map(fn ($row) => [
                'room_id' => (int) $row->id,
                'room_name' => $row->name,
                'hostel_name' => $row->hostel_name,
                'bed_count' => (int) $row->bed_count,
                'allocation_count' => (int) $row->allocation_count,
            ])
            ->all();

        $billedButNotAllocatedBase = StudentInvoice::query()
            ->join('students', 'students.id', '=', 'student_invoices.student_id')
            ->leftJoin('hostel_allocations', 'hostel_allocations.student_invoice_id', '=', 'student_invoices.id')
            ->whereNull('students.deleted_at')
            ->where('student_invoices.invoice_type', 'hostel')
            ->whereIn('student_invoices.status', $includedInvoiceStatuses)
            ->where('student_invoices.approval_status', '!=', 'rejected')
            ->whereNull('hostel_allocations.id')
            ->when($activeSession, fn ($query) => $query->where('student_invoices.academic_session_id', $activeSession->id));

        $billedButNotAllocatedCount = (clone $billedButNotAllocatedBase)->count();

        $billedButNotAllocated = (clone $billedButNotAllocatedBase)
            ->select(
                'student_invoices.id',
                'student_invoices.invoice_number',
                'student_invoices.amount_due',
                'student_invoices.balance_due',
                'students.admission_number',
                'students.first_name',
                'students.last_name'
            )
            ->orderByDesc('student_invoices.issue_date')
            ->limit(10)
            ->get()
            ->map(fn ($row) => [
                'invoice_id' => (int) $row->id,
                'invoice_number' => $row->invoice_number,
                'admission_number' => $row->admission_number,
                'student_name' => "{$row->first_name} {$row->last_name}",
                'amount_due' => round((float) $row->amount_due, 2),
                'balance_due' => round((float) $row->balance_due, 2),
            ])
            ->all();

        $allocatedButNotBilledBase = DB::table('hostel_allocations')
            ->join('students', 'students.id', '=', 'hostel_allocations.student_id')
            ->join('hostels', 'hostels.id', '=', 'hostel_allocations.hostel_id')
            ->leftJoin('student_invoices', 'student_invoices.id', '=', 'hostel_allocations.student_invoice_id')
            ->whereNull('students.deleted_at')
            ->where('hostel_allocations.status', 'active')
            ->when($activeSession, fn ($query) => $query->where('hostel_allocations.academic_session_id', $activeSession->id))
            ->where(function ($query) {
                $query->whereNull('student_invoices.id')
                    ->orWhere('student_invoices.invoice_type', '!=', 'hostel')
                    ->orWhere('student_invoices.approval_status', '=', 'rejected');
            });

        $allocatedButNotBilledCount = (clone $allocatedButNotBilledBase)->count();

        $allocatedButNotBilled = (clone $allocatedButNotBilledBase)
            ->select(
                'hostel_allocations.id',
                'students.admission_number',
                'students.first_name',
                'students.last_name',
                'hostels.name as hostel_name',
                'hostel_allocations.hostel_fee_amount'
            )
            ->orderByDesc('hostel_allocations.allocated_on')
            ->limit(10)
            ->get()
            ->map(fn ($row) => [
                'allocation_id' => (int) $row->id,
                'admission_number' => $row->admission_number,
                'student_name' => "{$row->first_name} {$row->last_name}",
                'hostel_name' => $row->hostel_name,
                'hostel_fee_amount' => round((float) $row->hostel_fee_amount, 2),
            ])
            ->all();

        $inactiveStudentsWithActiveAllocation = DB::table('hostel_allocations')
            ->join('students', 'students.id', '=', 'hostel_allocations.student_id')
            ->join('hostels', 'hostels.id', '=', 'hostel_allocations.hostel_id')
            ->whereNull('students.deleted_at')
            ->where('hostel_allocations.status', 'active')
            ->where('students.enrollment_status', '!=', 'active')
            ->when($activeSession, fn ($query) => $query->where('hostel_allocations.academic_session_id', $activeSession->id))
            ->select(
                'hostel_allocations.id',
                'students.admission_number',
                'students.enrollment_status',
                'students.first_name',
                'students.last_name',
                'hostels.name as hostel_name'
            )
            ->orderBy('students.enrollment_status')
            ->limit(10)
            ->get()
            ->map(fn ($row) => [
                'allocation_id' => (int) $row->id,
                'admission_number' => $row->admission_number,
                'student_name' => "{$row->first_name} {$row->last_name}",
                'student_status' => $row->enrollment_status,
                'hostel_name' => $row->hostel_name,
            ])
            ->all();

        return [
            'filters' => $filters,
            'active_session' => $activeSession
                ? [
                    'id' => $activeSession->id,
                    'label' => $activeSession->display_name,
                ]
                : null,
            'metrics' => [
                'occupancy_rate' => $occupancyRate,
                'active_beds' => (int) $activeBeds,
                'occupied_beds' => (int) $occupiedBeds,
                'available_beds' => max((int) $activeBeds - (int) $occupiedBeds, 0),
                'allocated_students' => (int) $allocatedStudents,
                'hostel_billed_students' => (int) $hostelBilledStudents,
                'hostel_revenue_invoiced' => round((float) $hostelRevenueInvoiced, 2),
                'hostel_revenue_collected' => round((float) $hostelRevenueCollected, 2),
                'billed_but_not_allocated_count' => (int) $billedButNotAllocatedCount,
                'allocated_but_not_billed_count' => (int) $allocatedButNotBilledCount,
            ],
            'breakdowns' => [
                'occupancy_by_hostel' => $occupancyByHostel,
                'occupancy_by_room' => $occupancyByRoom,
            ],
            'exceptions' => [
                'duplicate_allocations' => $duplicateAllocations,
                'rooms_over_capacity' => $roomsOverCapacity,
                'billed_but_not_allocated' => $billedButNotAllocated,
                'allocated_but_not_billed' => $allocatedButNotBilled,
                'inactive_students_with_active_allocation' => $inactiveStudentsWithActiveAllocation,
            ],
            'policy' => [
                'included_invoice_statuses' => $includedInvoiceStatuses,
                'excluded_approval_statuses' => ['rejected'],
            ],
        ];
    }
}
