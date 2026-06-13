<?php

namespace Tests\Feature;

use App\Models\AcademicSession;
use App\Models\AcademicSessionEnrollment;
use App\Models\AcademicYear;
use App\Models\CourseEnrollment;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AcademicSessionEnrollmentModelRuleTest extends TestCase
{
    use RefreshDatabase;

    public function test_model_derives_year_of_study_and_session_number_from_module(): void
    {
        $courseEnrollment = CourseEnrollment::factory()->create();
        $academicYear = AcademicYear::factory()->create();
        $academicSession = AcademicSession::factory()->create([
            'academic_year_id' => $academicYear->id,
            'session_No' => 1,
            'session_number' => 1,
        ]);

        $enrollment = AcademicSessionEnrollment::query()->create([
            'course_enrollment_id' => $courseEnrollment->id,
            'academic_session_id' => $academicSession->id,
            'module' => 4,
            'status' => 'active',
        ]);

        $this->assertSame(2, $enrollment->year_of_study);
        $this->assertSame(1, $enrollment->session_number);
    }
}
