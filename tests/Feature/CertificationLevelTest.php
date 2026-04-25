<?php

use App\Models\CertificationLevel;
use App\Models\Course;
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
it('can create a certification level', function () {

    $examBody = ExamBody::factory()->create();
    $data = [
        'name' => 'Diploma',
        'code' => 'DIP001',
        'exam_body_id' => $examBody->id,
        'entry_grade' => 'C',
        'description' => 'Diploma level',
    ];

    $response = $this->post(
        route('certification-levels.store'),
        $data
    );

    $response->assertStatus(302)
        ->assertSessionHas('success');

    $this->assertDatabaseHas('certification_levels', [
        'name' => 'Diploma',
        'code' => 'DIP001',
        'description' => 'Diploma level',
        'entry_grade' => 'C',
        'exam_body_id' => $examBody->id,
    ]);
});

/*
|--------------------------------------------------------------------------
| INDEX
|--------------------------------------------------------------------------
*/
it('can view certification levels list', function () {

    CertificationLevel::factory()->count(3)->create();

    $response = $this->get(
        route('certification-levels.index')
    );

    $response->assertStatus(200);
});

/*
|--------------------------------------------------------------------------
| SHOW
|--------------------------------------------------------------------------
*/
// it('can view a certification level', function () {

//     $level = CertificationLevel::factory()->create();

//     $response = $this->get(
//         route('certification-levels.show', $level)
//     );

//     $response->assertStatus(200);
// });

/*
|--------------------------------------------------------------------------
| UPDATE
|--------------------------------------------------------------------------
*/
it('can update a certification level', function () {

    $examBody = ExamBody::factory()->create();

    $level = CertificationLevel::factory()->create([
        'exam_body_id' => $examBody->id,
    ]);

    $response = $this->put(
        route('certification-levels.update', $level),
        [
            'name' => 'Advanced Diploma',
            'code' => 'ADP001',
            'exam_body_id' => $examBody->id,
            'description' => 'Updated',
            'entry_grade' => 'B',
        ]
    );

    $response->assertStatus(302)
        ->assertSessionHas('success');

    $this->assertDatabaseHas('certification_levels', [
        'id' => $level->id,
        'name' => 'Advanced Diploma',
        'code' => 'ADP001',
        'description' => 'Updated',
        'entry_grade' => 'B',
    ]);
});

/*
|--------------------------------------------------------------------------
| DELETE (Soft Delete)
|--------------------------------------------------------------------------
*/
it('can soft delete a certification level', function () {

    $level = CertificationLevel::factory()->create();

    $response = $this->delete(
        route('certification-levels.destroy', $level)
    );

    $response->assertStatus(302)
        ->assertSessionHas('success');

    $this->assertSoftDeleted('certification_levels', [
        'id' => $level->id,
    ]);
});

/*
|--------------------------------------------------------------------------
| VALIDATION
|--------------------------------------------------------------------------
*/
it('required fields when creating', function () {

    $response = $this->post(
        route('certification-levels.store'),
        []
    );

    $response->assertStatus(302)
        ->assertSessionHasErrors([
            'name',
            'code',
            'exam_body_id',
        ]);
});

it('required fields when updating', function () {

    $level = CertificationLevel::factory()->create();

    $response = $this->put(
        route('certification-levels.update', $level),
        []
    );

    $response->assertStatus(302)
        ->assertSessionHasErrors([
            'name',
            'code',
            'exam_body_id',
            'entry_grade',
        ]);
});
/*
|--------------------------------------------------------------------------
| SEARCH
|--------------------------------------------------------------------------
*/
it('searches certification levels', function () {

    CertificationLevel::factory()->create([
        'name' => 'Diploma',
        'code' => 'DIP001',
    ]);

    CertificationLevel::factory()->create([
        'name' => 'Certificate',
        'code' => 'CERT001',
    ]);

    $response = $this->get(
        route('certification-levels.search', [
            'q' => 'Dip',
        ])
    );

    $response->assertStatus(200);
});

it('prevents deleting a certification level when linked to a course', function () {

    $examBody = ExamBody::factory()->create();

    $level = CertificationLevel::factory()->create([
        'exam_body_id' => $examBody->id,
    ]);

    Course::factory()->create([
        'certification_level_id' => $level->id,
    ]);

    $response = $this->delete(
        route('certification-levels.destroy', $level)
    );

    $response->assertStatus(302)
        ->assertSessionHas('error');

    // Must still exist (not deleted at all)
    $this->assertDatabaseHas('certification_levels', [
        'id' => $level->id,
    ]);

    // Critical soft delete assertion
    expect($level->fresh()->deleted_at)->toBeNull();
});
