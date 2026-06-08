<?php

namespace Tests\Feature;

use App\Models\AcademicSession;
use App\Models\AcademicSessionEnrollment;
use App\Models\AcademicYear;
use App\Models\CourseEnrollment;
use App\Models\Department;
use App\Models\Student;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AcademicSessionEnrollmentFilterTest extends TestCase
{
    use RefreshDatabase;

    protected $user;

    protected function setUp(): void
    {
        parent::setUp();
        $this->user = User::factory()->create();
    }

    public function test_can_filter_academic_session_enrollments_by_admission_number()
    {
        $student1 = Student::factory()->create(['admission_number' => 'ADM001']);
        $student2 = Student::factory()->create(['admission_number' => 'ADM002']);

        $ce1 = CourseEnrollment::factory()->create(['student_id' => $student1->id]);
        $ce2 = CourseEnrollment::factory()->create(['student_id' => $student2->id]);

        AcademicSessionEnrollment::factory()->create(['course_enrollment_id' => $ce1->id]);
        AcademicSessionEnrollment::factory()->create(['course_enrollment_id' => $ce2->id]);

        $response = $this->actingAs($this->user)
            ->get(route('academic.sessions.enrollments.index', ['admission_number' => 'ADM001']));

        $response->assertStatus(200);
        $data = $response->viewData('page')['props']['enrollments']['data'];
        $this->assertCount(1, $data);
        $this->assertEquals('ADM001', $data[0]['admission_number']);
    }

    public function test_can_filter_academic_session_enrollments_by_department()
    {
        $dept1 = Department::factory()->create();
        $student1 = Student::factory()->create(['department_id' => $dept1->id]);
        $ce1 = CourseEnrollment::factory()->create(['student_id' => $student1->id]);
        AcademicSessionEnrollment::factory()->create(['course_enrollment_id' => $ce1->id]);

        $student2 = Student::factory()->create();
        $ce2 = CourseEnrollment::factory()->create(['student_id' => $student2->id]);
        AcademicSessionEnrollment::factory()->create(['course_enrollment_id' => $ce2->id]);

        $response = $this->actingAs($this->user)
            ->get(route('academic.sessions.enrollments.index', ['department_id' => $dept1->id]));

        $response->assertStatus(200);
        $data = $response->viewData('page')['props']['enrollments']['data'];
        $this->assertCount(1, $data);
        $this->assertEquals($student1->full_name, $data[0]['student_name']);
    }

    public function test_can_filter_academic_session_enrollments_by_year_of_study()
    {
        AcademicSessionEnrollment::factory()->create(['year_of_study' => 1]);
        AcademicSessionEnrollment::factory()->create(['year_of_study' => 2]);

        $response = $this->actingAs($this->user)
            ->get(route('academic.sessions.enrollments.index', ['year_of_study' => 2]));

        $response->assertStatus(200);
        $data = $response->viewData('page')['props']['enrollments']['data'];
        $this->assertCount(1, $data);
        $this->assertEquals(2, $data[0]['year_of_study']);
    }
}
