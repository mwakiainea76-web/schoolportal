<?php

namespace Tests\Feature;

use App\Models\AcademicSession;
use App\Models\AcademicSessionEnrollment;
use App\Models\AcademicYear;
use App\Models\Course;
use App\Models\CourseEnrollment;
use App\Models\CurriculumMapping;
use App\Models\Department;
use App\Models\Student;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CourseEnrollmentFilterTest extends TestCase
{
    use RefreshDatabase;

    protected $user;

    protected function setUp(): void
    {
        parent::setUp();
        $this->user = User::factory()->create();
    }

    public function test_can_filter_enrollments_by_admission_number()
    {
        $student1 = Student::factory()->create(['admission_number' => 'ADM001']);
        $student2 = Student::factory()->create(['admission_number' => 'ADM002']);

        CourseEnrollment::factory()->create(['student_id' => $student1->id]);
        CourseEnrollment::factory()->create(['student_id' => $student2->id]);

        $response = $this->actingAs($this->user)
            ->get(route('courses.enrollments.index', ['admission_number' => 'ADM001']));

        $response->assertStatus(200);
        $data = $response->viewData('page')['props']['courseEnrollments']['data'];
        $this->assertCount(1, $data);
        $this->assertEquals('ADM001', $data[0]['admission_number']);
    }

    public function test_can_filter_enrollments_by_department()
    {
        $dept1 = Department::factory()->create();
        $dept2 = Department::factory()->create();
        $course1 = Course::factory()->create(['department_id' => $dept1->id]);
        $course2 = Course::factory()->create(['department_id' => $dept2->id]);
        $mapping1 = CurriculumMapping::factory()->create(['course_id' => $course1->id]);
        $mapping2 = CurriculumMapping::factory()->create(['course_id' => $course2->id]);

        $student1 = Student::factory()->create();
        $student2 = Student::factory()->create();

        CourseEnrollment::factory()->create([
            'student_id' => $student1->id,
            'course_id' => $course1->id,
            'curriculum_mapping_id' => $mapping1->id,
        ]);
        CourseEnrollment::factory()->create([
            'student_id' => $student2->id,
            'course_id' => $course2->id,
            'curriculum_mapping_id' => $mapping2->id,
        ]);

        $response = $this->actingAs($this->user)
            ->get(route('courses.enrollments.index', ['department_id' => $dept1->id]));

        $response->assertStatus(200);
        $data = $response->viewData('page')['props']['courseEnrollments']['data'];
        $this->assertCount(1, $data);
        $this->assertEquals($student1->full_name, $data[0]['student_name']);
    }

    public function test_can_filter_enrollments_by_year_of_study()
    {
        $year1 = AcademicYear::factory()->create();
        $session1 = AcademicSession::factory()->create(['academic_year_id' => $year1->id, 'session_No' => 1]);
        $session2 = AcademicSession::factory()->create(['academic_year_id' => $year1->id, 'session_No' => 4]); // Year 2

        $enrollment1 = CourseEnrollment::factory()->create();
        $enrollment2 = CourseEnrollment::factory()->create();

        AcademicSessionEnrollment::factory()->create([
            'course_enrollment_id' => $enrollment1->id,
            'academic_session_id' => $session1->id,
            'year_of_study' => 1
        ]);

        AcademicSessionEnrollment::factory()->create([
            'course_enrollment_id' => $enrollment2->id,
            'academic_session_id' => $session2->id,
            'year_of_study' => 2
        ]);

        $response = $this->actingAs($this->user)
            ->get(route('courses.enrollments.index', ['year_of_study' => 2]));

        $response->assertStatus(200);
        $data = $response->viewData('page')['props']['courseEnrollments']['data'];
        $this->assertCount(1, $data);
        $this->assertEquals(2, $data[0]['year_of_study']);
    }
}
