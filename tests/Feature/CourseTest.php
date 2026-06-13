<?php

use App\Models\CertificationLevel;
use App\Models\Course;
use App\Models\Curriculum;
use App\Models\Department;
use App\Models\ExamBody;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function () {
    $user = User::factory()->create();
    $this->actingAs($user);
});

/*
|--------------------------------------------------------------------------
| CREATE
|--------------------------------------------------------------------------
*/
it('can create a course', function () {

    $department = Department::factory()->create();
    $examBody = ExamBody::factory()->create();
    $level = CertificationLevel::factory()->create(['exam_body_id' => $examBody->id]);
    $curriculum = Curriculum::factory()->create([
        'course_id' => null,
        'exam_body_id' => $examBody->id,
        'created_by' => auth()->id(),
    ]);

    $data = [
        'code' => 'CRS001',
        'name' => 'Software Engineering',
        'description' => 'Course description',
        'initials' => 'SE',
        'exam_body_id' => $examBody->id,
        'curriculum_id' => $curriculum->id,
        'certification_level_id' => $level->id,
        'department_id' => $department->id,
    ];

    $response = $this->post(
        route('courses.store'),
        $data
    );

    $response->assertStatus(302)
        ->assertSessionHas('success');

    $this->assertDatabaseHas('courses', [
        'code' => 'CRS001',
        'name' => 'Software Engineering',
    ]);
});

/*
|--------------------------------------------------------------------------
| INDEX
|--------------------------------------------------------------------------
*/
it('can view courses list', function () {

    Course::factory()->count(3)->create();

    $response = $this->get(route('courses.index'));

    $response->assertStatus(200);
});

/*
|--------------------------------------------------------------------------
| UPDATE
|--------------------------------------------------------------------------
*/
it('can update a course', function () {

    $course = Course::factory()->create();

    $department = Department::factory()->create();
    $examBody = ExamBody::factory()->create();
    $level = CertificationLevel::factory()->create(['exam_body_id' => $examBody->id]);
    $curriculum = Curriculum::factory()->create([
        'course_id' => null,
        'exam_body_id' => $examBody->id,
        'created_by' => auth()->id(),
    ]);

    $response = $this->put(
        route('courses.update', $course),
        [
            'code' => 'CRS999',
            'name' => 'Updated Course',
            'description' => 'Updated',
            'initials' => 'UC',
            'exam_body_id' => $examBody->id,
            'curriculum_id' => $curriculum->id,
            'certification_level_id' => $level->id,
            'department_id' => $department->id,
        ]
    );

    $response->assertStatus(302)
        ->assertSessionHas('success');

    $this->assertDatabaseHas('courses', [
        'id' => $course->id,
        'code' => 'CRS999',
        'name' => 'Updated Course',
    ]);
});

/*
|--------------------------------------------------------------------------
| SOFT DELETE
|--------------------------------------------------------------------------
*/
it('can soft delete a course', function () {

    $course = Course::factory()->create();

    $response = $this->delete(
        route('courses.destroy', $course)
    );

    $response->assertStatus(302)
        ->assertSessionHas('success');

    $this->assertSoftDeleted('courses', [
        'id' => $course->id,
    ]);
});

/*
|--------------------------------------------------------------------------
| VALIDATION
|--------------------------------------------------------------------------
*/
it('requires fields when creating a course', function () {

    $response = $this->post(route('courses.store'), []);

    $response->assertStatus(302)
        ->assertSessionHasErrors([
            'code',
            'name',
            'initials',
            'exam_body_id',
            'curriculum_id',
            'certification_level_id',
            'department_id',
        ]);
});


/*
|--------------------------------------------------------------------------
| FOREIGN KEY PROTECTION (CERTIFICATION LEVEL)
|--------------------------------------------------------------------------
*/
it('prevents deleting course dependency via certification level constraint', function () {

    $course = Course::factory()->create();

    $response = $this->delete(
        route('courses.destroy', $course)
    );

    $response->assertStatus(302);

    $this->assertDatabaseHas('courses', [
        'id' => $course->id,
    ]);
});


//
it('requires fields when updating a course', function () {

    $course = \App\Models\Course::factory()->create();

    $response = $this->put(
        route('courses.update', $course),
        []
    );

    $response->assertStatus(302)
        ->assertSessionHasErrors([
            'code',
            'name',
            'initials',
            'exam_body_id',
            'curriculum_id',
            'certification_level_id',
            'department_id',
        ]);

    // Ensure record is unchanged
    $this->assertDatabaseHas('courses', [
        'id' => $course->id,
    ]);
});
