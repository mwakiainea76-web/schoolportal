<?php

use App\Models\User;
use App\Models\Staff;
use App\Models\Student;
use App\Models\Department;
use App\Models\Course;
use App\Models\Curriculum;
use App\Models\CurriculumMapping;
use App\Models\AcademicSession;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Spatie\Permission\Models\Role;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->withoutMiddleware();
    Role::create(['name' => 'admin']);
    Role::create(['name' => 'student']);
    Role::create(['name' => 'Lecturer']);
    $this->admin = User::factory()->create();
    $this->admin->assignRole('admin');
    $this->actingAs($this->admin);
});

it('can onboard a new staff member', function () {
    $department = Department::factory()->create();
    
    $data = [
        'first_name' => 'Jane',
        'last_name' => 'Doe',
        'email' => 'jane.doe@example.com',
        'phone_number' => '0711223344',
        'date_of_birth' => '1985-05-15',
        'gender' => 'female',
        'county' => 'Nairobi',
        'address' => '123 Staff Street',
        'religion' => 'Christian',
        'department_id' => $department->id,
        'role_name' => 'Lecturer',
        'designation' => 'Lecturer',
        'national_id_number' => '12345678',
        'hired_date' => '2026-06-01',
        'employment_type' => 'Permanent',
        'highest_qualification' => 'Masters',
        'specialization' => 'Computer Science',
        'kin_first_name' => 'KinJane',
        'kin_last_name' => 'Doe',
        'kin_relationship' => 'Sister',
        'kin_phone' => '0711000000',
    ];

    $response = $this->post(route('staffs.store'), $data);

    $response->assertStatus(302);
    $this->assertDatabaseHas('staffs', [
        'email' => 'jane.doe@example.com',
    ]);
});

it('can admit a new student', function () {
    $department = Department::factory()->create();
    $examBody = \App\Models\ExamBody::factory()->create();
    $course = Course::factory()->create([
        'department_id' => $department->id,
        'certification_level_id' => \App\Models\CertificationLevel::factory()->create(['exam_body_id' => $examBody->id])->id,
    ]);
    $curriculum = Curriculum::factory()->create(['exam_body_id' => $examBody->id]);
    $mapping = CurriculumMapping::factory()->create([
        'course_id' => $course->id,
        'curriculum_id' => $curriculum->id,
    ]);
    $session = AcademicSession::factory()->create();

    $data = [
        'first_name' => 'John',
        'last_name' => 'Smith',
        'email' => 'john.smith@example.com',
        'phone_number' => '0722334455',
        'date_of_birth' => '2005-10-20',
        'gender' => 'male',
        'county' => 'Mombasa',
        'address' => '456 Student Ave',
        'religion' => 'Muslim',
        'previous_school' => 'High School',
        'course_id' => $course->id,
        'exam_body_id' => $examBody->id,
        'curriculum_id' => $curriculum->id,
        'curriculum_mapping_id' => $mapping->id,
        'academic_session_id' => $session->id,
        'current_module' => '1',
        'kin_first_name' => 'KinJohn',
        'kin_last_name' => 'Smith',
        'kin_relationship' => 'Father',
        'kin_phone' => '0722000000',
    ];

    $response = $this->post(route('students.store'), $data);

    $response->assertStatus(302);
    $this->assertDatabaseHas('students', [
        'email' => 'john.smith@example.com',
    ]);
    
    $student = Student::where('email', 'john.smith@example.com')->first();
    $this->assertDatabaseHas('course_enrollments', [
        'student_id' => $student->id,
        'course_id' => $course->id,
        'curriculum_mapping_id' => $mapping->id,
    ]);
});

it('validates required fields for staff onboarding', function () {
    $response = $this->post(route('staffs.store'), []);
    $response->assertSessionHasErrors(['first_name', 'last_name', 'email', 'role_name']);
});

it('validates required fields for student admission', function () {
    $response = $this->post(route('students.store'), []);
    $response->assertSessionHasErrors(['first_name', 'last_name', 'email', 'course_id']);
});
