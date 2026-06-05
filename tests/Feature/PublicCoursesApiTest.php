<?php

use App\Models\CertificationLevel;
use App\Models\Department;
use App\Models\ExamBody;
use App\Models\Course;
use App\Models\Curriculum;
use App\Models\CurriculumMapping;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

it('returns courses offered for the active program version with certification levels attached', function () {
    $user = User::factory()->create();
    $department = Department::factory()->create();
    $examBody = ExamBody::factory()->create();

    $diploma = CertificationLevel::query()->create([
        'exam_body_id' => $examBody->id,
        'code' => 'DIP',
        'name' => 'Diploma',
        'description' => 'Diploma level',
        'entry_grade' => 'C',
    ]);

    $certificate = CertificationLevel::query()->create([
        'exam_body_id' => $examBody->id,
        'code' => 'CERT',
        'name' => 'Certificate',
        'description' => 'Certificate level',
        'entry_grade' => 'D',
    ]);

    $activeVersion = Curriculum::query()->create([
        'name' => 'September 2026 Intake',
        'description' => 'Active intake',
        'is_active' => true,
        'start_date' => '2026-09-01',
        'end_date' => '2027-08-31',
        'created_by' => $user->id,
    ]);

    $inactiveVersion = Curriculum::query()->create([
        'name' => 'Archived Intake',
        'description' => 'Inactive intake',
        'is_active' => false,
        'start_date' => '2025-01-01',
        'end_date' => '2025-12-31',
        'created_by' => $user->id,
    ]);

    $ictTechnician = Course::query()->create([
        'code' => 'ICT001',
        'name' => 'ICT technician',
        'description' => 'ICT program',
        'initials' => 'ICT',
        'duration_in_months' => 24,
        'certification_level_id' => $diploma->id,
        'department_id' => $department->id,
    ]);

    $electrical = Course::query()->create([
        'code' => 'ELE001',
        'name' => 'Electrical Installation',
        'description' => 'Electrical program',
        'initials' => 'ELEC',
        'duration_in_months' => 12,
        'certification_level_id' => $certificate->id,
        'department_id' => $department->id,
    ]);

    CurriculumMapping::query()->create([
        'program_id' => $ictTechnician->id,
        'curriculum_id' => $activeVersion->id,
        'is_active' => true,
        'description' => 'Currently offered',
        'created_by' => $user->id,
    ]);

    CurriculumMapping::query()->create([
        'program_id' => $electrical->id,
        'curriculum_id' => $inactiveVersion->id,
        'is_active' => true,
        'description' => 'Should not be returned',
        'created_by' => $user->id,
    ]);

    $response = $this->getJson('/api/public/courses-offered');

    $response->assertOk()
        ->assertJsonPath('success', true)
        ->assertJsonPath('data.active_program_version.name', 'September 2026 Intake')
        ->assertJsonCount(1, 'data.courses')
        ->assertJsonFragment([
            'code' => 'ICT001',
            'course_name' => 'ICT technician',
            'certification_level' => 'Diploma',
            'display_name' => 'ICT technician - Diploma',
            'program_version_name' => 'September 2026 Intake',
        ])
        ->assertJsonMissing([
            'code' => 'ELE001',
        ]);
});
