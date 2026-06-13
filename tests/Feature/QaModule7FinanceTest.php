<?php

use App\Models\User;
use App\Models\Student;
use App\Models\StudentInvoice;
use App\Models\InvoiceItem;
use App\Models\Payment;
use App\Models\FeeAdjustment;
use App\Models\Staff;
use App\Models\Department;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Spatie\Permission\Models\Role;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->withoutMiddleware();
    Role::create(['name' => 'admin']);
    Role::create(['name' => 'bursar']);
    
    $this->admin = User::factory()->create();
    $this->admin->assignRole('admin');
    
    $this->bursarUser = User::factory()->create();
    $this->bursarUser->assignRole('bursar');
    $this->department = Department::factory()->create();
    $this->bursarStaff = Staff::factory()->create([
        'user_id' => $this->bursarUser->id,
        'department_id' => $this->department->id
    ]);
    
    $this->student = Student::factory()->create();
    $this->actingAs($this->bursarUser);
});

it('can post a student charge', function () {
    $this->student->update(['admission_number' => 'ADM-QA-001']);
    
    $session = \App\Models\AcademicSession::factory()->create(['is_active' => true]);
    $courseEnrollment = $this->student->courseEnrollment()->create([
        'course_id' => \App\Models\Course::factory()->create()->id,
        'curriculum_id' => \App\Models\Curriculum::factory()->create()->id,
        'exam_body_id' => \App\Models\ExamBody::factory()->create()->id,
        'curriculum_mapping_id' => \App\Models\CurriculumMapping::factory()->create()->id,
        'enrollment_date' => now()->toDateString(),
        'intake_year' => now()->year,
        'intake_period' => 'Jan',
        'status' => 'active',
    ]);
    
    \App\Models\AcademicSessionEnrollment::factory()->create([
        'course_enrollment_id' => $courseEnrollment->id,
        'academic_session_id' => $session->id,
        'status' => 'active',
    ]);

    $data = [
        'admission_number' => 'ADM-QA-001',
        'invoice_kind' => 'standard_invoice',
        'description' => 'Tuition Fee 2026',
        'amount' => 50000,
        'issue_date' => now()->toDateString(),
        'due_date' => now()->addMonth()->toDateString(),
    ];

    $response = $this->post(route('billing.manual.invoices.store'), $data);

    $response->assertStatus(302);
    $this->assertDatabaseHas('student_invoices', [
        'student_id' => $this->student->id,
        'amount_due' => 50000,
    ]);
});

it('can record a payment', function () {
    $this->student->update(['admission_number' => 'ADM-QA-002']);
    
    // Payment recordStudentPayment might need a student profile and an enrollment for allocation
    $session = \App\Models\AcademicSession::factory()->create(['is_active' => true]);
    $courseEnrollment = $this->student->courseEnrollment()->create([
        'course_id' => \App\Models\Course::factory()->create()->id,
        'curriculum_id' => \App\Models\Curriculum::factory()->create()->id,
        'exam_body_id' => \App\Models\ExamBody::factory()->create()->id,
        'curriculum_mapping_id' => \App\Models\CurriculumMapping::factory()->create()->id,
        'enrollment_date' => now()->toDateString(),
        'intake_year' => now()->year,
        'intake_period' => 'Jan',
        'status' => 'active',
    ]);
    \App\Models\AcademicSessionEnrollment::factory()->create([
        'course_enrollment_id' => $courseEnrollment->id,
        'academic_session_id' => $session->id,
    ]);

    $data = [
        'admission_number' => 'ADM-QA-002',
        'amount' => 20000,
        'method' => 'cash',
        'reference' => 'REF123',
        'payment_date' => now()->toDateString(),
        'notes' => 'Test payment',
    ];

    $response = $this->post(route('billing.manual.payments.store'), $data);

    $response->assertStatus(302);
    $this->assertDatabaseHas('payments', [
        'student_id' => $this->student->id,
        'amount' => 20000,
    ]);
});

it('can apply a student charge adjustment', function () {
    $this->student->update(['admission_number' => 'ADM-QA-003']);
    $session = \App\Models\AcademicSession::factory()->create(['is_active' => true]);
    $courseEnrollment = $this->student->courseEnrollment()->create([
        'course_id' => \App\Models\Course::factory()->create()->id,
        'curriculum_id' => \App\Models\Curriculum::factory()->create()->id,
        'exam_body_id' => \App\Models\ExamBody::factory()->create()->id,
        'curriculum_mapping_id' => \App\Models\CurriculumMapping::factory()->create()->id,
        'enrollment_date' => now()->toDateString(),
        'intake_year' => now()->year,
        'intake_period' => 'Jan',
        'status' => 'active',
    ]);
    $enrollment = \App\Models\AcademicSessionEnrollment::factory()->create([
        'course_enrollment_id' => $courseEnrollment->id,
        'academic_session_id' => $session->id,
        'status' => 'active',
    ]);
    
    $invoice = StudentInvoice::create([
        'student_id' => $this->student->id,
        'enrollment_id' => $enrollment->id,
        'academic_session_id' => $session->id,
        'amount_due' => 50000,
        'balance_due' => 50000,
        'invoice_number' => 'INV-QA-003',
        'invoice_type' => 'fees',
        'issue_date' => now()->toDateString(),
        'due_date' => now()->toDateString(),
        'created_by' => $this->bursarStaff->id,
    ]);

    $data = [
        'admission_number' => 'ADM-QA-003',
        'type' => 'waiver',
        'amount' => 5000,
        'description' => 'Scholarship',
        'applied_at' => now()->toDateString(),
    ];

    $response = $this->post(route('billing.manual.adjustments.store'), $data);

    $response->assertStatus(302);
    $this->assertDatabaseHas('fee_adjustments', [
        'student_invoice_id' => $invoice->id,
        'amount' => 5000,
        'type' => 'waiver',
    ]);
});

it('can post a penalty', function () {
    $this->student->update(['admission_number' => 'ADM-QA-004']);
    $session = \App\Models\AcademicSession::factory()->create(['is_active' => true]);
    $courseEnrollment = $this->student->courseEnrollment()->create([
        'course_id' => \App\Models\Course::factory()->create()->id,
        'curriculum_id' => \App\Models\Curriculum::factory()->create()->id,
        'exam_body_id' => \App\Models\ExamBody::factory()->create()->id,
        'curriculum_mapping_id' => \App\Models\CurriculumMapping::factory()->create()->id,
        'enrollment_date' => now()->toDateString(),
        'intake_year' => now()->year,
        'intake_period' => 'Jan',
        'status' => 'active',
    ]);
    $enrollment = \App\Models\AcademicSessionEnrollment::factory()->create([
        'course_enrollment_id' => $courseEnrollment->id,
        'academic_session_id' => $session->id,
        'status' => 'active',
    ]);

    $invoice = StudentInvoice::create([
        'student_id' => $this->student->id,
        'enrollment_id' => $enrollment->id,
        'academic_session_id' => $session->id,
        'amount_due' => 50000,
        'balance_due' => 50000,
        'invoice_number' => 'INV-QA-004',
        'invoice_type' => 'fees',
        'issue_date' => now()->toDateString(),
        'due_date' => now()->toDateString(),
        'created_by' => $this->bursarStaff->id,
    ]);

    $data = [
        'admission_number' => 'ADM-QA-004',
        'amount' => 1000,
        'description' => 'Late Payment Penalty',
        'applied_at' => now()->toDateString(),
    ];

    $response = $this->post(route('billing.manual.penalties.store'), $data);

    $response->assertStatus(302);
    $this->assertDatabaseHas('fee_adjustments', [
        'student_invoice_id' => $invoice->id,
        'amount' => 1000,
        'type' => 'penalty',
    ]);
});
