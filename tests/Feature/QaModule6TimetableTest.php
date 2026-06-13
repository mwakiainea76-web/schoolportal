<?php

use App\Models\User;
use App\Models\Staff;
use App\Models\Department;
use App\Models\Course;
use App\Models\CurriculumMapping;
use App\Models\AcademicSession;
use App\Models\LectureRoom;
use App\Models\AcademicTimetable;
use App\Models\Unit;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Spatie\Permission\Models\Role;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->withoutMiddleware();
    Role::create(['name' => 'admin']);
    Role::create(['name' => 'hod']);
    Role::create(['name' => 'trainer']);
    
    $this->admin = User::factory()->create();
    $this->admin->assignRole('admin');
    
    $this->hodUser = User::factory()->create();
    $this->hodUser->assignRole('hod');
    $this->department = Department::factory()->create();
    $this->hodStaff = Staff::factory()->create([
        'user_id' => $this->hodUser->id,
        'department_id' => $this->department->id
    ]);
});

it('allows admin to access the timetable create page', function () {
    $response = $this->actingAs($this->admin)->get(route('academic.timetables.create'));
    $response->assertStatus(200);
});

it('allows HOD to access the HOD-specific timetable create page', function () {
    $response = $this->actingAs($this->hodUser)->get(route('academic.timetables.hod.create'));
    $response->assertStatus(200);
});

it('prevents overlapping timetable entries for the same room and time', function () {
    $session = AcademicSession::factory()->create(['is_active' => true]);
    $department = Department::factory()->create();
    $room = LectureRoom::factory()->create(['department_id' => $department->id]);
    $trainer = Staff::factory()->create(['department_id' => $department->id]);
    $mapping = CurriculumMapping::factory()->create();
    $unit1 = Unit::factory()->create([
        'curriculum_mapping_id' => $mapping->id,
        'module_taught' => 1,
    ]);
    $unit2 = Unit::factory()->create([
        'curriculum_mapping_id' => $mapping->id,
        'module_taught' => 1,
    ]);
    
    // Create first entry
    AcademicTimetable::create([
        'academic_session_id' => $session->id,
        'department_id' => $department->id,
        'lecture_room_id' => $room->id,
        'trainer_staff_id' => $trainer->id,
        'curriculum_unit_id' => $unit1->id,
        'day_of_week' => 'monday',
        'start_time' => '08:00',
        'end_time' => '10:00',
    ]);
    
    // Attempt to create second entry in the same room at the same time
    $data = [
        'department_id' => $department->id,
        'curriculum_mapping_id' => $mapping->id,
        'module_number' => 1,
        'trainer_staff_id' => Staff::factory()->create(['department_id' => $department->id])->id,
        'lecture_room_id' => $room->id,
        'curriculum_unit_ids' => [$unit2->id],
        'sessions' => [
            ['day_of_week' => 'monday', 'start_time' => '09:00', 'end_time' => '11:00'],
        ],
    ];
    
    $response = $this->actingAs($this->admin)->post(route('academic.timetables.store'), $data);
    
    $response->assertSessionHasErrors(['sessions.0.start_time']);
});

it('merges timetable entries when room, trainer, and time match', function () {
    $session = AcademicSession::factory()->create(['is_active' => true]);
    $department = Department::factory()->create();
    $room = LectureRoom::factory()->create(['department_id' => $department->id]);
    $trainer = Staff::factory()->create(['department_id' => $department->id]);
    
    $course = Course::factory()->create(['department_id' => $department->id]);
    $mapping = CurriculumMapping::factory()->create(['course_id' => $course->id]);
    
    $unit1 = Unit::factory()->create([
        'curriculum_mapping_id' => $mapping->id,
        'module_taught' => 1,
    ]);
    $unit2 = Unit::factory()->create([
        'curriculum_mapping_id' => $mapping->id,
        'module_taught' => 1,
    ]);
    
    $data = [
        'department_id' => $department->id,
        'curriculum_mapping_id' => $mapping->id,
        'module_number' => 1,
        'trainer_staff_id' => $trainer->id,
        'lecture_room_id' => $room->id,
        'curriculum_unit_ids' => [$unit1->id, $unit2->id],
        'sessions' => [
            ['day_of_week' => 'tuesday', 'start_time' => '10:00', 'end_time' => '12:00'],
        ],
    ];
    
    $response = $this->actingAs($this->admin)->post(route('academic.timetables.store'), $data);
    
    $response->assertRedirect(route('academic.timetables.index', ['department_id' => $department->id]));
    $timetable = AcademicTimetable::first();
    expect($timetable->curriculumUnits)->toHaveCount(2);
});
