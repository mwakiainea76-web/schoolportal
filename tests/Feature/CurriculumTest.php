<?php

use App\Models\Course;
use App\Models\Curriculum;
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
it('can create a curriculum', function () {

    $course = Course::factory()->create();

    $data = [
        'name' => 'CBET Curriculum',
        'course_id' => $course->id,
        'description' => 'ICT Curriculum',
        'is_active' => true,
    ];

    $response = $this->post(
        route('course-curriculum.store'),
        $data
    );

    $response->assertStatus(302)
        ->assertSessionHas('success');

    $this->assertDatabaseHas('curricula', [
        'name' => 'CBET Curriculum',
        'course_id' => $course->id,
    ]);
});

/*
|--------------------------------------------------------------------------
| INDEX
|--------------------------------------------------------------------------
*/
it('can view curriculum list', function () {

    Curriculum::factory()->count(3)->create();

    $response = $this->get(route('course-curriculum.index'));

    $response->assertStatus(200);
});

/*
|--------------------------------------------------------------------------
| UPDATE
|--------------------------------------------------------------------------
*/
it('can update a curriculum', function () {

    $course = Course::factory()->create();

    $curriculum = Curriculum::factory()->create([
        'course_id' => $course->id,
    ]);

    $response = $this->put(
        route('course-curriculum.update', $curriculum),
        [
            'name' => 'Updated Curriculum',
            'course_id' => $course->id,
            'description' => 'Updated description',
            'is_active' => false,
            'start_date' => '2026-02-01',
            'end_date' => '2026-10-01',
        ]
    );

    $response->assertStatus(302)
        ->assertSessionHas('success');

    $this->assertDatabaseHas('curricula', [
        'id' => $curriculum->id,
        'name' => 'Updated Curriculum',
    ]);
});

/*
|--------------------------------------------------------------------------
| SOFT DELETE
|--------------------------------------------------------------------------
*/
it('can soft delete a curriculum', function () {

    $curriculum = Curriculum::factory()->create();

    $response = $this->delete(
        route('course-curriculum.destroy', $curriculum)
    );

    $response->assertStatus(302)
        ->assertSessionHas('success');

    $this->assertSoftDeleted('curricula', [
        'id' => $curriculum->id,
    ]);
});

/*
|--------------------------------------------------------------------------
| VALIDATION (CREATE)
|--------------------------------------------------------------------------
*/
it('requires fields when creating a curriculum', function () {

    $response = $this->post(
        route('course-curriculum.store'),
        []
    );

    $response->assertStatus(302)
        ->assertSessionHasErrors([
            'name',
            'course_id',
            'is_active',
        ]);
});

/*
|--------------------------------------------------------------------------
| VALIDATION (UPDATE)
|--------------------------------------------------------------------------
*/
it('requires fields when updating a curriculum', function () {

    $curriculum = Curriculum::factory()->create();

    $response = $this->put(
        route('course-curriculum.update', $curriculum),
        []
    );

    $response->assertStatus(302)
        ->assertSessionHasErrors([
            'name',
            'course_id',
            'is_active',
            'start_date',
            'end_date',
        ]);
});

/*
|--------------------------------------------------------------------------
| DUPLICATE PREVENTION
|--------------------------------------------------------------------------
*/
it('prevents duplicate curriculum for same course', function () {

    $course = Course::factory()->create();

    Curriculum::factory()->create([
        'name' => 'ICT Curriculum',
        'course_id' => $course->id,
        'is_active' => true,
    ]);

    $response = $this->post(
        route('course-curriculum.store'),
        [
            'name' => 'ICT Curriculum',
            'course_id' => $course->id,
            'is_active' => true,
        ]
    );

    $response->assertStatus(302)
        ->assertSessionHas('error');
});

/*
|--------------------------------------------------------------------------
| SEARCH
|--------------------------------------------------------------------------
*/
it('can search curriculums by name', function () {

    Curriculum::factory()->create([
        'name' => 'ICT Curriculum',
    ]);

    Curriculum::factory()->create([
        'name' => 'Electrical Curriculum',
    ]);

    $response = $this->get(route('course-curriculum.search', [
        'q' => 'ICT',
    ]));

    $response->assertStatus(200)
        ->assertJsonFragment([
            'name' => 'ICT Curriculum',
        ])
        ->assertJsonMissing([
            'name' => 'Electrical Curriculum',
        ]);
});

it('prevents deleting a curriculum when it has linked units', function () {

    $course = \App\Models\Course::factory()->create();

    $curriculum = \App\Models\Curriculum::factory()->create([
        'course_id' => $course->id,
    ]);

    $unit = \App\Models\Unit::factory()->create();

    // attach via pivot table (IMPORTANT: belongsToMany)
    $curriculum->units()->attach($unit->id, [
        'module_taught' => 1,
    ]);

    $response = $this->delete(
        route('course-curriculum.destroy', $curriculum)
    );

    $response->assertStatus(302)
        ->assertSessionHas('error');

    // MUST still exist (soft delete should NOT happen)
    $this->assertDatabaseHas('curricula', [
        'id' => $curriculum->id,
        'deleted_at' => null,
    ]);

    expect($curriculum->fresh()->deleted_at)->toBeNull();
});
