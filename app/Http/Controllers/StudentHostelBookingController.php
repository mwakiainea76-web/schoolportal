<?php

namespace App\Http\Controllers;

use App\Models\AcademicSession;
use App\Models\AcademicSessionEnrollment;
use App\Models\Hostel;
use App\Models\HostelAllocation;
use App\Models\StudentInvoice;
use App\Services\BillingService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;

class StudentHostelBookingController extends Controller
{
    public function __construct(
        protected BillingService $billingService
    ) {}

    public function index(Request $request)
    {
        $student = $request->user()?->student;
        abort_unless($student, 403);

        $activeSession = AcademicSession::query()
            ->with('academicYear:id,academic_year')
            ->where('is_active', true)
            ->latest('id')
            ->first();

        $enrollment = $activeSession
            ? $this->activeEnrollmentForStudent((int) $student->id, (int) $activeSession->id)
            : null;

        $existingAllocation = $enrollment
            ? HostelAllocation::query()
                ->with(['hostel:id,name,code', 'room:id,name,code', 'bed:id,label', 'invoice:id,invoice_number,balance_due,status'])
                ->where('academic_session_enrollment_id', $enrollment->id)
                ->where('academic_session_id', $enrollment->academic_session_id)
                ->latest('id')
                ->first()
            : null;

        $existingInvoice = $enrollment
            ? $this->existingHostelInvoice((int) $student->id, (int) $enrollment->academic_session_id)
            : null;

        return inertia('StudentHostelBooking/Index', [
            'activeSession' => $activeSession ? [
                'id' => (string) $activeSession->id,
                'name' => $activeSession->display_name,
            ] : null,
            'enrollment' => $enrollment ? [
                'id' => (string) $enrollment->id,
                'status' => $enrollment->status,
                'module' => $enrollment->module,
                'year_of_study' => $enrollment->year_of_study,
            ] : null,
            'eligibility' => [
                'can_book' => (bool) ($activeSession && $enrollment && ! $existingAllocation && ! $existingInvoice),
                'message' => $this->eligibilityMessage($activeSession, $enrollment, $existingAllocation, $existingInvoice),
            ],
            'hostels' => $enrollment && ! $existingAllocation && ! $existingInvoice
                ? $this->hostelOptions((int) $activeSession->id, $student->gender)
                : [],
            'existingInvoice' => $existingInvoice,
            'allocation' => $existingAllocation ? [
                'hostel' => trim(($existingAllocation->hostel?->code ? $existingAllocation->hostel->code.' - ' : '').($existingAllocation->hostel?->name ?? 'Hostel')),
                'room' => $existingAllocation->room?->name,
                'bed' => $existingAllocation->bed?->label,
                'status' => $existingAllocation->status,
                'invoice_number' => $existingAllocation->invoice?->invoice_number,
                'invoice_balance_due' => $existingAllocation->invoice ? (float) $existingAllocation->invoice->balance_due : null,
            ] : null,
        ]);
    }

    public function store(Request $request)
    {
        $student = $request->user()?->student;
        abort_unless($student, 403);

        $validated = $request->validate([
            'hostel_id' => [
                'required',
                'integer',
                Rule::exists('hostels', 'id')->where(fn ($query) => $query->where('is_active', true)),
            ],
        ]);

        $activeSession = AcademicSession::query()
            ->where('is_active', true)
            ->latest('id')
            ->first();

        if (! $activeSession) {
            throw ValidationException::withMessages([
                'hostel_id' => 'No active academic session is available for hostel booking.',
            ]);
        }

        $enrollment = $this->activeEnrollmentForStudent((int) $student->id, (int) $activeSession->id);

        if (! $enrollment) {
            throw ValidationException::withMessages([
                'hostel_id' => 'Register for the active academic session before booking hostel accommodation.',
            ]);
        }

        $existingInvoice = $this->existingHostelInvoice((int) $student->id, (int) $enrollment->academic_session_id);

        if ($existingInvoice) {
            return to_route('student.hostel-booking.index')
                ->with('success', "Hostel invoice {$existingInvoice['invoice_number']} is already ready for payment.");
        }

        $hostel = Hostel::query()
            ->where('is_active', true)
            ->findOrFail((int) $validated['hostel_id']);

        if (! $this->hostelMatchesStudentGender($hostel, $student->gender)) {
            throw ValidationException::withMessages([
                'hostel_id' => 'The selected hostel is not available for your gender.',
            ]);
        }

        if ((float) $hostel->session_fee_amount <= 0) {
            throw ValidationException::withMessages([
                'hostel_id' => 'The selected hostel does not have a valid session fee configured.',
            ]);
        }

        $hasVacancy = $this->hostelVacancy((int) $hostel->id, (int) $activeSession->id) > 0;

        if (! $hasVacancy) {
            throw ValidationException::withMessages([
                'hostel_id' => 'The selected hostel currently has no available bed for this session.',
            ]);
        }

        $alreadyAllocated = HostelAllocation::query()
            ->where('academic_session_enrollment_id', $enrollment->id)
            ->where('academic_session_id', $enrollment->academic_session_id)
            ->exists();

        if ($alreadyAllocated) {
            throw ValidationException::withMessages([
                'hostel_id' => 'You already have a hostel allocation for this session.',
            ]);
        }

        $invoice = $this->billingService->createHostelInvoiceForEnrollment(
            $enrollment,
            $hostel
        );

        return to_route('student.hostel-booking.index')
            ->with('success', "Hostel booking request received. Invoice {$invoice->invoice_number} is ready for payment.");
    }

    protected function activeEnrollmentForStudent(int $studentId, int $academicSessionId): ?AcademicSessionEnrollment
    {
        return AcademicSessionEnrollment::query()
            ->with('academicSession.academicYear:id,academic_year')
            ->where('academic_session_id', $academicSessionId)
            ->where('status', 'active')
            ->whereHas('courseEnrollment', fn ($query) => $query->where('student_id', $studentId))
            ->latest('id')
            ->first();
    }

    protected function eligibilityMessage(?AcademicSession $activeSession, ?AcademicSessionEnrollment $enrollment, ?HostelAllocation $allocation, ?array $existingInvoice): string
    {
        if (! $activeSession) {
            return 'No active academic session is available.';
        }

        if (! $enrollment) {
            return 'Register for the active academic session before booking hostel accommodation.';
        }

        if ($allocation) {
            return 'You already have a hostel allocation for this session.';
        }

        if ($existingInvoice) {
            return 'Your hostel booking invoice is already ready for payment.';
        }

        return 'Select a hostel to generate your hostel accommodation invoice.';
    }

    protected function hostelOptions(int $academicSessionId, ?string $studentGender): array
    {
        return Hostel::query()
            ->where('is_active', true)
            ->withCount([
                'rooms as active_rooms_count' => fn ($query) => $query->where('is_active', true),
            ])
            ->orderBy('name')
            ->get()
            ->filter(fn (Hostel $hostel) => $this->hostelMatchesStudentGender($hostel, $studentGender))
            ->map(function (Hostel $hostel) use ($academicSessionId) {
                $activeBeds = DB::table('hostel_beds')
                    ->join('hostel_rooms', 'hostel_rooms.id', '=', 'hostel_beds.hostel_room_id')
                    ->where('hostel_rooms.hostel_id', $hostel->id)
                    ->where('hostel_rooms.is_active', true)
                    ->whereNull('hostel_rooms.deleted_at')
                    ->where('hostel_beds.is_active', true)
                    ->whereNull('hostel_beds.deleted_at')
                    ->count('hostel_beds.id');

                $occupiedBeds = DB::table('hostel_allocations')
                    ->where('hostel_id', $hostel->id)
                    ->where('academic_session_id', $academicSessionId)
                    ->where('status', 'active')
                    ->distinct()
                    ->count('hostel_bed_id');

                return [
                    'id' => (string) $hostel->id,
                    'name' => $hostel->name,
                    'code' => $hostel->code,
                    'gender' => $hostel->gender,
                    'location' => $hostel->location,
                    'description' => $hostel->description,
                    'session_fee_amount' => (float) $hostel->session_fee_amount,
                    'active_rooms_count' => (int) $hostel->active_rooms_count,
                    'active_beds_count' => (int) $activeBeds,
                    'occupied_beds_count' => (int) $occupiedBeds,
                    'available_beds_count' => max(0, (int) $activeBeds - (int) $occupiedBeds),
                ];
            })
            ->filter(fn (array $hostel) => $hostel['available_beds_count'] > 0)
            ->values()
            ->all();
    }

    protected function existingHostelInvoice(int $studentId, int $academicSessionId): ?array
    {
        $invoice = StudentInvoice::query()
            ->where('student_id', $studentId)
            ->where('academic_session_id', $academicSessionId)
            ->where('invoice_type', 'hostel')
            ->notRejected()
            ->latest('id')
            ->first();

        if (! $invoice) {
            return null;
        }

        return [
            'id' => (string) $invoice->id,
            'invoice_number' => $invoice->invoice_number,
            'status' => $invoice->status,
            'amount_due' => (float) $invoice->amount_due,
            'paid_amount' => (float) $invoice->paid_amount,
            'balance_due' => (float) $invoice->balance_due,
            'due_date' => optional($invoice->due_date)->toDateString(),
        ];
    }

    protected function hostelVacancy(int $hostelId, int $academicSessionId): int
    {
        $activeBeds = DB::table('hostel_beds')
            ->join('hostel_rooms', 'hostel_rooms.id', '=', 'hostel_beds.hostel_room_id')
            ->where('hostel_rooms.hostel_id', $hostelId)
            ->where('hostel_rooms.is_active', true)
            ->whereNull('hostel_rooms.deleted_at')
            ->where('hostel_beds.is_active', true)
            ->whereNull('hostel_beds.deleted_at')
            ->count('hostel_beds.id');

        $occupiedBeds = DB::table('hostel_allocations')
            ->where('hostel_id', $hostelId)
            ->where('academic_session_id', $academicSessionId)
            ->where('status', 'active')
            ->distinct()
            ->count('hostel_bed_id');

        return max(0, (int) $activeBeds - (int) $occupiedBeds);
    }

    protected function hostelMatchesStudentGender(Hostel $hostel, ?string $studentGender): bool
    {
        $hostelGender = strtolower(trim((string) $hostel->gender));

        if ($hostelGender === '' || in_array($hostelGender, ['mixed', 'all', 'any'], true)) {
            return true;
        }

        return $hostelGender === strtolower(trim((string) $studentGender));
    }
}
