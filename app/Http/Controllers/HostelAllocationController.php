<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreHostelAllocationRequest;
use App\Http\Requests\UpdateHostelAllocationRequest;
use App\Models\AcademicSession;
use App\Models\AcademicSessionEnrollment;
use App\Models\Hostel;
use App\Models\HostelAllocation;
use App\Models\HostelBed;
use App\Models\HostelRoom;
use App\Models\StudentInvoice;
use App\Services\BillingService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class HostelAllocationController extends Controller
{
    public function index(Request $request)
    {
        $query = HostelAllocation::query()
            ->with([
                'student.user:id,first_name,last_name',
                'academicSession.academicYear:id,academic_year',
                'hostel:id,name,code',
                'room:id,name,code',
                'bed:id,label',
                'invoice:id,invoice_number,balance_due',
            ])
            ->when($request->filled('search'), function ($builder) use ($request) {
                $term = $request->string('search')->toString();
                $builder->where(function ($query) use ($term) {
                    $query->whereHas('student', function ($studentQuery) use ($term) {
                        $studentQuery
                            ->where('registration_number', 'like', "%{$term}%")
                            ->orWhereHas('user', function ($userQuery) use ($term) {
                                $userQuery
                                    ->where('first_name', 'like', "%{$term}%")
                                    ->orWhere('last_name', 'like', "%{$term}%");
                            });
                    })
                        ->orWhereHas('hostel', fn ($hostelQuery) => $hostelQuery->where('name', 'like', "%{$term}%"))
                        ->orWhereHas('room', fn ($roomQuery) => $roomQuery->where('name', 'like', "%{$term}%"))
                        ->orWhereHas('bed', fn ($bedQuery) => $bedQuery->where('label', 'like', "%{$term}%"));
                });
            })
            ->when($request->filled('status'), fn ($builder) => $builder->where('status', $request->string('status')->toString()))
            ->when($request->filled('hostel_id'), fn ($builder) => $builder->where('hostel_id', $request->integer('hostel_id')))
            ->when($request->filled('academic_session_id'), fn ($builder) => $builder->where('academic_session_id', $request->integer('academic_session_id')));

        $allocations = $query
            ->latest('allocated_on')
            ->latest('id')
            ->paginate(15)
            ->withQueryString();

        $allocations->through(fn (HostelAllocation $allocation) => $this->transformAllocation($allocation));

        return inertia('HostelAllocations/Index', [
            'allocations' => $allocations,
            'filters' => [
                'search' => $request->string('search')->toString(),
                'status' => $request->string('status')->toString(),
                'hostel_id' => $request->filled('hostel_id') ? (string) $request->integer('hostel_id') : '',
                'academic_session_id' => $request->filled('academic_session_id') ? (string) $request->integer('academic_session_id') : '',
            ],
            'hostels' => $this->hostelOptions(),
            'sessions' => $this->sessionOptions(),
        ]);
    }

    public function create()
    {
        return inertia('HostelAllocations/Create', [
            'enrollments' => $this->enrollmentOptions(),
            'hostels' => $this->hostelOptions(),
            'rooms' => $this->roomOptions(),
            'beds' => $this->bedOptions(),
        ]);
    }

    public function store(StoreHostelAllocationRequest $request)
    {
        $actorStaffId = $this->resolveActorStaffId($request);
        $validated = $request->validated();
        $enrollment = $this->resolveEligibleEnrollment((int) $validated['academic_session_enrollment_id']);
        [$hostel, $room, $bed] = $this->resolveHostelChain(
            (int) $validated['hostel_id'],
            (int) $validated['hostel_room_id'],
            (int) $validated['hostel_bed_id']
        );

        $this->assertBedAvailability($bed, $enrollment->academic_session_id);
        $this->assertStudentDoesNotAlreadyHaveAllocation($enrollment);
        $settledInvoice = $this->resolveSettledHostelInvoice($enrollment, $hostel);

        DB::transaction(function () use ($validated, $enrollment, $hostel, $room, $bed, $actorStaffId, $settledInvoice) {
            $allocation = HostelAllocation::create([
                'academic_session_enrollment_id' => $enrollment->id,
                'student_id' => $enrollment->student_id,
                'academic_session_id' => $enrollment->academic_session_id,
                'hostel_id' => $hostel->id,
                'hostel_room_id' => $room->id,
                'hostel_bed_id' => $bed->id,
                'student_invoice_id' => $settledInvoice->id,
                'hostel_fee_amount' => (float) $hostel->session_fee_amount,
                'allocated_on' => $validated['allocated_on'],
                'status' => $validated['status'] ?? 'active',
                'notes' => $validated['notes'] ?? null,
                'created_by' => $actorStaffId,
                'updated_by' => $actorStaffId,
            ]);

            $this->syncLinkedInvoiceDescription($allocation->fresh(['hostel', 'room', 'bed', 'invoice.items']));
        });

        return to_route('hostel-allocations.index')->with('success', 'Hostel bed allocated successfully after confirming full hostel payment.');
    }

    public function edit(HostelAllocation $hostel_allocation)
    {
        $hostel_allocation->load([
            'student.user:id,first_name,last_name',
            'academicSession.academicYear:id,academic_year',
            'hostel:id,name,code',
            'room:id,name,code',
            'bed:id,label',
            'invoice:id,invoice_number,balance_due',
        ]);

        return inertia('HostelAllocations/Edit', [
            'allocation' => $this->transformAllocation($hostel_allocation),
            'enrollments' => $this->enrollmentOptions(),
            'hostels' => $this->hostelOptions(),
            'rooms' => $this->roomOptions(),
            'beds' => $this->bedOptions(),
        ]);
    }

    public function update(UpdateHostelAllocationRequest $request, HostelAllocation $hostel_allocation)
    {
        $actorStaffId = $this->resolveActorStaffId($request);
        $validated = $request->validated();
        $enrollment = $this->resolveEligibleEnrollment((int) $validated['academic_session_enrollment_id']);
        [$hostel, $room, $bed] = $this->resolveHostelChain(
            (int) $validated['hostel_id'],
            (int) $validated['hostel_room_id'],
            (int) $validated['hostel_bed_id']
        );

        $this->assertBedAvailability($bed, $enrollment->academic_session_id, $hostel_allocation->id);
        $this->assertStudentDoesNotAlreadyHaveAllocation($enrollment, $hostel_allocation->id);
        $settledInvoice = $this->resolveSettledHostelInvoice($enrollment, $hostel, $hostel_allocation);

        DB::transaction(function () use ($hostel_allocation, $validated, $enrollment, $hostel, $room, $bed, $actorStaffId, $settledInvoice) {
            $hostel_allocation->update([
                'academic_session_enrollment_id' => $enrollment->id,
                'student_id' => $enrollment->student_id,
                'academic_session_id' => $enrollment->academic_session_id,
                'hostel_id' => $hostel->id,
                'hostel_room_id' => $room->id,
                'hostel_bed_id' => $bed->id,
                'student_invoice_id' => $settledInvoice->id,
                'allocated_on' => $validated['allocated_on'],
                'status' => $validated['status'],
                'notes' => $validated['notes'] ?? null,
                'updated_by' => $actorStaffId,
            ]);

            $this->syncLinkedInvoiceDescription($hostel_allocation->fresh(['hostel', 'room', 'bed', 'invoice.items']));
        });

        return to_route('hostel-allocations.index')->with('success', 'Hostel allocation updated successfully.');
    }

    protected function resolveActorStaffId(Request $request): int
    {
        $staffId = $request->user()?->staff?->id;

        if (! $staffId) {
            abort(403, 'A staff account is required to manage hostel allocations.');
        }

        return (int) $staffId;
    }

    protected function resolveEligibleEnrollment(int $enrollmentId): AcademicSessionEnrollment
    {
        $enrollment = AcademicSessionEnrollment::query()
            ->with(['student.user', 'academicSession.academicYear'])
            ->findOrFail($enrollmentId);

        if ($enrollment->status !== 'active') {
            throw ValidationException::withMessages([
                'academic_session_enrollment_id' => 'Only active session enrollments can receive a hostel bed.',
            ]);
        }

        if (! $enrollment->student_id) {
            throw ValidationException::withMessages([
                'academic_session_enrollment_id' => 'This session enrollment is not linked to a student account.',
            ]);
        }

        return $enrollment;
    }

    protected function resolveHostelChain(int $hostelId, int $roomId, int $bedId): array
    {
        $hostel = Hostel::query()->where('is_active', true)->findOrFail($hostelId);
        $room = HostelRoom::query()->where('hostel_id', $hostel->id)->where('is_active', true)->findOrFail($roomId);
        $bed = HostelBed::query()->where('hostel_room_id', $room->id)->where('is_active', true)->findOrFail($bedId);

        return [$hostel, $room, $bed];
    }

    protected function assertBedAvailability(HostelBed $bed, int $academicSessionId, ?int $ignoreAllocationId = null): void
    {
        $isOccupied = HostelAllocation::query()
            ->where('hostel_bed_id', $bed->id)
            ->where('academic_session_id', $academicSessionId)
            ->when($ignoreAllocationId, fn ($query) => $query->where('id', '!=', $ignoreAllocationId))
            ->exists();

        if ($isOccupied) {
            throw ValidationException::withMessages([
                'hostel_bed_id' => 'That bed is already allocated in the selected academic session.',
            ]);
        }
    }

    protected function assertStudentDoesNotAlreadyHaveAllocation(AcademicSessionEnrollment $enrollment, ?int $ignoreAllocationId = null): void
    {
        $exists = HostelAllocation::query()
            ->where('academic_session_enrollment_id', $enrollment->id)
            ->where('academic_session_id', $enrollment->academic_session_id)
            ->when($ignoreAllocationId, fn ($query) => $query->where('id', '!=', $ignoreAllocationId))
            ->exists();

        if ($exists) {
            throw ValidationException::withMessages([
                'academic_session_enrollment_id' => 'This student already has a hostel allocation for the selected session.',
            ]);
        }
    }

    protected function resolveSettledHostelInvoice(
        AcademicSessionEnrollment $enrollment,
        Hostel $hostel,
        ?HostelAllocation $currentAllocation = null
    ): StudentInvoice {
        $invoice = StudentInvoice::query()
            ->with(['hostelAllocation', 'items'])
            ->where('student_id', $enrollment->student_id)
            ->where('academic_session_id', $enrollment->academic_session_id)
            ->where('invoice_type', 'hostel')
            ->where('status', 'paid')
            ->where('amount_due', '>=', (float) $hostel->session_fee_amount)
            ->where(function ($query) use ($hostel) {
                $query
                    ->where('notes', BillingService::NOTE_HOSTEL)
                    ->orWhereHas('items', function ($itemQuery) use ($hostel) {
                        $itemQuery->where('description', 'like', '%'.$hostel->name.'%');
                    });
            })
            ->when(
                $currentAllocation,
                fn ($query) => $query->where(function ($nested) use ($currentAllocation) {
                    $nested
                        ->whereDoesntHave('hostelAllocation')
                        ->orWhereHas('hostelAllocation', fn ($allocationQuery) => $allocationQuery->where('id', $currentAllocation->id));
                }),
                fn ($query) => $query->whereDoesntHave('hostelAllocation')
            )
            ->latest('issue_date')
            ->latest('id')
            ->first();

        if (! $invoice) {
            throw ValidationException::withMessages([
                'academic_session_enrollment_id' => 'Hostel allocation is blocked until the student has a fully paid hostel invoice for this session. Generate the hostel invoice first, receive full payment, then assign the room.',
            ]);
        }

        return $invoice;
    }

    protected function syncLinkedInvoiceDescription(HostelAllocation $allocation): void
    {
        if (! $allocation->invoice) {
            return;
        }

        $item = $allocation->invoice->items()->first();

        if (! $item) {
            return;
        }

        $item->update([
            'description' => $this->hostelInvoiceDescription($allocation),
        ]);
    }

    protected function hostelInvoiceDescription(HostelAllocation $allocation): string
    {
        return trim(collect([
            'Hostel accommodation',
            $allocation->hostel?->name,
            $allocation->room?->name,
            $allocation->bed?->label,
        ])->filter()->implode(' - '));
    }

    protected function transformAllocation(HostelAllocation $allocation): array
    {
        return [
            'id' => $allocation->id,
            'academic_session_enrollment_id' => (string) $allocation->academic_session_enrollment_id,
            'student_name' => trim(($allocation->student?->user?->first_name ?? '').' '.($allocation->student?->user?->last_name ?? '')),
            'registration_number' => $allocation->student?->registration_number,
            'academic_session_id' => (string) $allocation->academic_session_id,
            'session_name' => $allocation->academicSession?->display_name,
            'hostel_id' => (string) $allocation->hostel_id,
            'hostel_name' => $allocation->hostel?->name,
            'hostel_room_id' => (string) $allocation->hostel_room_id,
            'room_name' => $allocation->room?->name,
            'hostel_bed_id' => (string) $allocation->hostel_bed_id,
            'bed_label' => $allocation->bed?->label,
            'hostel_fee_amount' => (float) $allocation->hostel_fee_amount,
            'allocated_on' => optional($allocation->allocated_on)->toDateString(),
            'status' => $allocation->status,
            'notes' => $allocation->notes,
            'invoice_number' => $allocation->invoice?->invoice_number,
            'invoice_balance_due' => $allocation->invoice ? (float) $allocation->invoice->balance_due : null,
        ];
    }

    protected function enrollmentOptions(): array
    {
        return AcademicSessionEnrollment::query()
            ->with([
                'student.user:id,first_name,last_name',
                'academicSession.academicYear:id,academic_year',
            ])
            ->where('status', 'active')
            ->latest('id')
            ->get()
            ->map(fn (AcademicSessionEnrollment $enrollment) => [
                'id' => (string) $enrollment->id,
                'name' => trim(($enrollment->student?->user?->first_name ?? '').' '.($enrollment->student?->user?->last_name ?? '')).' ('.($enrollment->student?->registration_number ?? 'N/A').') - '.($enrollment->academicSession?->display_name ?? 'No Session'),
                'academic_session_id' => (string) $enrollment->academic_session_id,
                'student_id' => (string) $enrollment->student_id,
            ])
            ->values()
            ->all();
    }

    protected function hostelOptions(): array
    {
        return Hostel::query()
            ->where('is_active', true)
            ->orderBy('name')
            ->get()
            ->map(fn (Hostel $hostel) => [
                'id' => (string) $hostel->id,
                'name' => $hostel->code.' - '.$hostel->name.' (Ksh '.number_format((float) $hostel->session_fee_amount, 2).')',
                'session_fee_amount' => (float) $hostel->session_fee_amount,
            ])
            ->values()
            ->all();
    }

    protected function roomOptions(): array
    {
        return HostelRoom::query()
            ->with('hostel:id,name')
            ->where('is_active', true)
            ->orderBy('name')
            ->get()
            ->map(fn (HostelRoom $room) => [
                'id' => (string) $room->id,
                'name' => $room->code.' - '.$room->name,
                'hostel_id' => (string) $room->hostel_id,
            ])
            ->values()
            ->all();
    }

    protected function bedOptions(): array
    {
        return HostelBed::query()
            ->with('room:id,hostel_id')
            ->where('is_active', true)
            ->orderBy('label')
            ->get()
            ->map(fn (HostelBed $bed) => [
                'id' => (string) $bed->id,
                'name' => $bed->label,
                'hostel_id' => (string) ($bed->room?->hostel_id ?? ''),
                'hostel_room_id' => (string) $bed->hostel_room_id,
            ])
            ->values()
            ->all();
    }

    protected function sessionOptions(): array
    {
        return AcademicSession::query()
            ->with('academicYear:id,academic_year')
            ->orderByDesc('id')
            ->get()
            ->map(fn (AcademicSession $session) => [
                'id' => (string) $session->id,
                'name' => $session->display_name,
            ])
            ->values()
            ->all();
    }
}
