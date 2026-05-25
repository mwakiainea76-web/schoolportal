<?php

namespace Tests\Unit;

use App\Models\AcademicSession;
use App\Models\AcademicSessionEnrollment;
use App\Models\AcademicYear;
use App\Models\FeeAdjustment;
use App\Models\InvoiceItem;
use App\Models\LedgerTransaction;
use App\Models\Payment;
use App\Models\PaymentAllocation;
use App\Models\Program;
use App\Models\ProgramEnrollment;
use App\Models\ProgramVersion;
use App\Models\ProgramVersionMapping;
use App\Models\Student;
use App\Models\StudentInvoice;
use App\Models\User;
use App\Services\BillingService;
use App\Services\BillingStatementService;
use Illuminate\Database\Eloquent\Collection as EloquentCollection;
use Tests\TestCase;

class BillingStatementServiceTest extends TestCase
{
    public function test_it_builds_a_statement_row_from_session_invoices(): void
    {
        $service = new BillingStatementService();
        $session = $this->makeSession();

        $olderInvoice = $this->makeInvoice(
            id: 11,
            session: $session,
            invoiceNumber: 'INV-001',
            issueDate: '2026-01-10',
            dueDate: '2026-01-20',
            items: [$this->makeItem(6000)],
            allocations: [$this->makeAllocation(2000, '2026-01-11', 'bank', 'BNK-1')],
            ledgerEntries: [
                $this->makeLedgerEntry(101, '2026-01-10', 'invoice', 6000, 0),
                $this->makeLedgerEntry(102, '2026-01-11', 'payment', 0, 2000),
            ],
        );

        $newerInvoice = $this->makeInvoice(
            id: 12,
            session: $session,
            invoiceNumber: 'INV-002',
            issueDate: '2026-02-05',
            dueDate: '2026-02-15',
            items: [$this->makeItem(4000)],
            ledgerEntries: [
                $this->makeLedgerEntry(103, '2026-02-05', 'invoice', 4000, 0),
            ],
        );

        $row = $service->buildStatementRow(new EloquentCollection([$olderInvoice, $newerInvoice]));

        $this->assertSame(12, $row['id']);
        $this->assertSame('STATEMENT-7', $row['statement_reference']);
        $this->assertSame('2026/2027 - Session 1', $row['session']);
        $this->assertSame('2026-01-10', $row['issue_date']);
        $this->assertSame('2026-02-15', $row['due_date']);
        $this->assertSame(10000.0, $row['amount_due']);
        $this->assertSame(2000.0, $row['paid_amount']);
        $this->assertSame(8000.0, $row['balance_due']);
        $this->assertSame('partial', $row['status']);
        $this->assertSame(2, $row['invoice_count']);
        $this->assertSame(3, $row['transaction_count']);
    }

    public function test_it_builds_a_full_student_statement_with_running_balance(): void
    {
        $service = new BillingStatementService();
        $student = $this->makeStudent();
        $session = $this->makeSession();
        $programEnrollment = $this->makeProgramEnrollment();
        $enrollment = new AcademicSessionEnrollment();
        $enrollment->setRelation('programEnrollment', $programEnrollment);

        $invoice = $this->makeInvoice(
            id: 21,
            student: $student,
            enrollment: $enrollment,
            session: $session,
            invoiceNumber: 'INV-021',
            issueDate: '2026-03-01',
            dueDate: '2026-03-15',
            items: [
                $this->makeItem(7000, 'Tuition Fee'),
                $this->makeItem(500, 'Activity Fee'),
            ],
            adjustments: [
                $this->makeAdjustment('bursary', 1500, 'County bursary', '2026-03-03'),
            ],
            allocations: [
                $this->makeAllocation(2000, '2026-03-04', 'mpesa', 'MPESA-1'),
            ],
            ledgerEntries: [
                $this->makeLedgerEntry(201, '2026-03-01', 'invoice', 7500, 0, 'INV-021', 'Invoice issued'),
                $this->makeLedgerEntry(202, '2026-03-03', 'bursary', 0, 1500, null, 'County bursary'),
                $this->makeLedgerEntry(203, '2026-03-04', 'payment', 0, 2000, 'MPESA-1', 'Payment allocated'),
            ],
        );

        $statement = $service->buildStudentStatement($invoice, new EloquentCollection([$invoice]), $programEnrollment);

        $this->assertSame('STATEMENT-7', $statement['statement_reference']);
        $this->assertSame('Alice Example', $statement['student']['name']);
        $this->assertSame('REG/001', $statement['student']['registration_number']);
        $this->assertSame('Business Management', $statement['program']['name']);
        $this->assertSame('May 2026 Cohort', $statement['program']['version']);
        $this->assertSame('2026/2027 - Session 1', $statement['session']);
        $this->assertSame(7500.0, $statement['totals']['amount_due']);
        $this->assertSame(3500.0, $statement['totals']['paid_amount']);
        $this->assertSame(4000.0, $statement['totals']['balance_due']);
        $this->assertSame('partial', $statement['status']);
        $this->assertCount(3, $statement['entries']);
        $this->assertSame(7500.0, $statement['entries'][0]['running_balance']);
        $this->assertSame(6000.0, $statement['entries'][1]['running_balance']);
        $this->assertSame(4000.0, $statement['entries'][2]['running_balance']);
        $this->assertCount(2, $statement['items']);
        $this->assertSame('Tuition Fee', $statement['items'][0]['description']);
        $this->assertSame('BURSARY', $service->buildSessionSummary(new EloquentCollection([$invoice]))['adjustments'][0]['display_type']);
    }

    public function test_it_decorates_invoice_with_negative_balance_and_opening_balance_label(): void
    {
        $service = new BillingStatementService();
        $session = $this->makeSession();

        $invoice = $this->makeInvoice(
            id: 31,
            session: $session,
            invoiceNumber: 'INV-031',
            issueDate: '2026-04-01',
            dueDate: '2026-04-15',
            invoiceType: 'fees',
            notes: BillingService::NOTE_CARRY_FORWARD,
            items: [$this->makeItem(1000, 'Opening balance brought forward')],
            allocations: [$this->makeAllocation(1500, '2026-04-02', 'bank', 'BNK-31')],
        );

        $decorated = $service->decorateInvoice($invoice);

        $this->assertSame(-500.0, (float) $decorated->balance_due);
        $this->assertSame('paid', $decorated->status);
        $this->assertSame(
            'INVOICE ADJUSTMENT - OPENING BALANCE',
            $decorated->display_type_label
        );
    }

    private function makeInvoice(
        int $id,
        ?Student $student = null,
        ?AcademicSessionEnrollment $enrollment = null,
        ?AcademicSession $session = null,
        string $invoiceNumber = 'INV-001',
        string $issueDate = '2026-01-01',
        string $dueDate = '2026-01-31',
        string $invoiceType = 'default_fees',
        ?string $notes = null,
        array $items = [],
        array $adjustments = [],
        array $allocations = [],
        array $ledgerEntries = [],
    ): StudentInvoice {
        $invoice = new StudentInvoice([
            'invoice_number' => $invoiceNumber,
            'issue_date' => $issueDate,
            'due_date' => $dueDate,
            'invoice_type' => $invoiceType,
            'notes' => $notes,
            'status' => 'issued',
            'academic_session_id' => $session?->id,
        ]);
        $invoice->id = $id;

        if ($student) {
            $invoice->setRelation('student', $student);
        }

        if ($enrollment) {
            $invoice->setRelation('enrollment', $enrollment);
        }

        if ($session) {
            $invoice->setRelation('academicSession', $session);
        }

        $invoice->setRelation('items', new EloquentCollection($items));
        $invoice->setRelation('adjustments', new EloquentCollection($adjustments));
        $invoice->setRelation('paymentAllocations', new EloquentCollection($allocations));
        $invoice->setRelation('ledgerTransactions', new EloquentCollection($ledgerEntries));

        return $invoice;
    }

    private function makeItem(float $amount, string $description = 'Fee Item'): InvoiceItem
    {
        return new InvoiceItem([
            'description' => $description,
            'quantity' => 1,
            'unit_amount' => $amount,
            'total_amount' => $amount,
        ]);
    }

    private function makeAdjustment(string $type, float $amount, string $description, string $appliedAt): FeeAdjustment
    {
        return new FeeAdjustment([
            'type' => $type,
            'amount' => $amount,
            'description' => $description,
            'applied_at' => $appliedAt,
        ]);
    }

    private function makeAllocation(float $amount, string $paymentDate, string $method, string $reference): PaymentAllocation
    {
        $payment = new Payment([
            'amount' => $amount,
            'payment_date' => $paymentDate,
            'method' => $method,
            'reference' => $reference,
        ]);

        $allocation = new PaymentAllocation([
            'amount' => $amount,
            'allocated_at' => $paymentDate,
        ]);
        $allocation->id = random_int(1000, 9999);
        $allocation->setRelation('payment', $payment);

        return $allocation;
    }

    private function makeLedgerEntry(
        int $id,
        string $date,
        string $type,
        float $debit,
        float $credit,
        ?string $reference = null,
        ?string $description = null
    ): LedgerTransaction {
        $entry = new LedgerTransaction([
            'transaction_date' => $date,
            'type' => $type,
            'debit' => $debit,
            'credit' => $credit,
            'reference' => $reference,
            'description' => $description,
        ]);
        $entry->id = $id;

        return $entry;
    }

    private function makeStudent(): Student
    {
        $user = new User([
            'first_name' => 'Alice',
            'last_name' => 'Example',
        ]);

        $student = new Student([
            'registration_number' => 'REG/001',
            'admission_date' => '2026-01-05',
        ]);
        $student->setRelation('user', $user);

        return $student;
    }

    private function makeSession(): AcademicSession
    {
        $year = new AcademicYear([
            'academic_year' => '2026/2027',
        ]);

        $session = new AcademicSession([
            'session_number' => 1,
        ]);
        $session->id = 7;
        $session->setRelation('academicYear', $year);

        return $session;
    }

    private function makeProgramEnrollment(): ProgramEnrollment
    {
        $program = new Program(['name' => 'Business Management']);
        $programVersion = new ProgramVersion(['name' => 'May 2026 Cohort']);
        $mapping = new ProgramVersionMapping();
        $mapping->setRelation('program', $program);
        $mapping->setRelation('programVersion', $programVersion);

        $programEnrollment = new ProgramEnrollment();
        $programEnrollment->setRelation('programVersionMapping', $mapping);

        return $programEnrollment;
    }
}
