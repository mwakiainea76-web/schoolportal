<?php

namespace Tests\Feature;

use App\Models\AcademicSession;
use App\Models\AcademicSessionEnrollment;
use App\Models\AcademicYear;
use App\Models\CourseEnrollment;
use App\Models\FeeAssignment;
use App\Models\FeePlan;
use App\Models\Staff;
use App\Models\Student;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class ManualAcademicSessionEnrollmentTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        Role::create(['name' => 'admin']);
        Role::create(['name' => 'student']);
    }

    public function test_admin_can_open_manual_student_session_enrollment_page(): void
    {
        $admin = User::factory()->create();
        $admin->assignRole('admin');

        $academicYear = AcademicYear::factory()->create();
        AcademicSession::factory()->create([
            'academic_year_id' => $academicYear->id,
            'session_No' => 1,
            'session_number' => 1,
            'is_active' => true,
        ]);

        $this->actingAs($admin)
            ->get(route('students.session-enrollment.create'))
            ->assertOk();
    }

    public function test_manual_session_enrollment_derives_year_and_session_from_module_number(): void
    {
        $admin = User::factory()->create();
        $admin->assignRole('admin');

        $student = Student::factory()->create([
            'admission_number' => 'TVET/2026/001',
            'current_module' => '1',
        ]);

        $courseEnrollment = CourseEnrollment::factory()->create([
            'student_id' => $student->id,
        ]);

        $academicYear = AcademicYear::factory()->create();
        $activeSession = AcademicSession::factory()->create([
            'academic_year_id' => $academicYear->id,
            'session_No' => 1,
            'session_number' => 1,
            'is_active' => true,
        ]);
        $staff = Staff::factory()->create();
        $feePlan = FeePlan::query()->create([
            'name' => 'Manual Session Test Plan',
            'plan_type' => 'original',
            'status' => 'draft',
            'version' => 'original',
            'is_active' => true,
            'created_by' => $admin->id,
        ]);
        FeeAssignment::query()->create([
            'fee_plan_id' => $feePlan->id,
            'academic_year_id' => $academicYear->id,
            'curriculum_mapping_id' => $courseEnrollment->curriculum_mapping_id,
            'year_of_study' => 2,
            'session_number' => 1,
            'created_by' => $staff->id,
            'valid_from' => now()->subDay()->toDateString(),
            'valid_to' => null,
            'is_active' => true,
            'approval_status' => 'approved',
        ]);

        $this->actingAs($admin)
            ->post(route('students.session-enrollment.store'), [
                'admission_number' => $student->admission_number,
                'active_session_id' => $activeSession->id,
                'module_number' => 4,
            ])
            ->assertSessionHasNoErrors();

        $enrollment = AcademicSessionEnrollment::query()
            ->where('course_enrollment_id', $courseEnrollment->id)
            ->where('academic_session_id', $activeSession->id)
            ->latest('id')
            ->first();

        $this->assertNotNull($enrollment);
        $this->assertSame(4, $enrollment->module);
        $this->assertSame(2, $enrollment->year_of_study);
        $this->assertSame(1, $enrollment->session_number);
        $this->assertSame('4', $student->fresh()->current_module);
    }

    public function test_manual_session_enrollment_rejects_module_that_does_not_match_active_session(): void
    {
        $admin = User::factory()->create();
        $admin->assignRole('admin');

        $student = Student::factory()->create([
            'admission_number' => 'TVET/2026/001',
        ]);

        CourseEnrollment::factory()->create([
            'student_id' => $student->id,
        ]);

        $academicYear = AcademicYear::factory()->create();
        $activeSession = AcademicSession::factory()->create([
            'academic_year_id' => $academicYear->id,
            'session_No' => 2,
            'session_number' => 2,
            'is_active' => true,
        ]);

        $this->actingAs($admin)
            ->from(route('students.session-enrollment.create'))
            ->post(route('students.session-enrollment.store'), [
                'admission_number' => $student->admission_number,
                'active_session_id' => $activeSession->id,
                'module_number' => 4,
            ])
            ->assertSessionHasErrors()
            ->assertRedirect(route('students.session-enrollment.create'));

        $this->assertDatabaseMissing('academic_session_enrollments', [
            'course_enrollment_id' => CourseEnrollment::query()->where('student_id', $student->id)->value('id'),
            'academic_session_id' => $activeSession->id,
        ]);
    }

    public function test_student_self_registration_uses_current_module_progression(): void
    {
        $student = Student::factory()->create([
            'admission_number' => 'TVET/2026/009',
            'current_module' => '4',
        ]);
        $student->user->assignRole('student');

        $courseEnrollment = CourseEnrollment::factory()->create([
            'student_id' => $student->id,
        ]);

        $academicYear = AcademicYear::factory()->create();
        $activeSession = AcademicSession::factory()->create([
            'academic_year_id' => $academicYear->id,
            'session_No' => 1,
            'session_number' => 1,
            'is_active' => true,
        ]);
        $staff = Staff::factory()->create();
        $feePlan = FeePlan::query()->create([
            'name' => 'Student Self Registration Test Plan',
            'plan_type' => 'original',
            'status' => 'draft',
            'version' => 'original',
            'is_active' => true,
            'created_by' => $student->user->id,
        ]);
        FeeAssignment::query()->create([
            'fee_plan_id' => $feePlan->id,
            'academic_year_id' => $academicYear->id,
            'curriculum_mapping_id' => $courseEnrollment->curriculum_mapping_id,
            'year_of_study' => 2,
            'session_number' => 1,
            'created_by' => $staff->id,
            'valid_from' => now()->subDay()->toDateString(),
            'valid_to' => null,
            'is_active' => true,
            'approval_status' => 'approved',
        ]);

        $this->actingAs($student->user)
            ->post(route('student.dashboard.register-session'))
            ->assertSessionHasNoErrors();

        $enrollment = AcademicSessionEnrollment::query()
            ->where('course_enrollment_id', $courseEnrollment->id)
            ->where('academic_session_id', $activeSession->id)
            ->latest('id')
            ->first();

        $this->assertNotNull($enrollment);
        $this->assertSame(4, $enrollment->module);
        $this->assertSame(2, $enrollment->year_of_study);
        $this->assertSame(1, $enrollment->session_number);
    }

    public function test_admin_can_open_change_student_status_page(): void
    {
        $admin = User::factory()->create();
        $admin->assignRole('admin');

        $this->actingAs($admin)
            ->get(route('students.session-enrollment-status.create'))
            ->assertOk();
    }

    public function test_admin_can_update_student_status_by_admission_number_and_log_it(): void
    {
        $admin = User::factory()->create();
        $admin->assignRole('admin');

        $student = Student::factory()->create([
            'admission_number' => 'TVET/2026/011',
            'enrollment_status' => 'active',
        ]);

        $this->actingAs($admin)
            ->from(route('students.session-enrollment-status.create'))
            ->post(route('students.session-enrollment-status.store'), [
                'admission_number' => $student->admission_number,
                'status' => 'deferred',
                'effective_date' => '2026-06-13',
                'reason' => 'Medical leave',
                'resume_date' => '2026-07-01',
            ])
            ->assertSessionHasNoErrors()
            ->assertRedirect(route('students.session-enrollment-status.create'));

        $this->assertDatabaseHas('students', [
            'id' => $student->id,
            'enrollment_status' => 'deferred',
        ]);

        $this->assertDatabaseHas('users', [
            'id' => $student->user_id,
            'is_active' => false,
        ]);

        $this->assertDatabaseHas('student_status_logs', [
            'student_id' => $student->id,
            'status' => 'deferred',
            'effective_date' => '2026-06-13 00:00:00',
            'reason' => 'Medical leave',
            'resume_date' => '2026-07-01 00:00:00',
            'recorded_by' => $admin->id,
        ]);
    }
}
