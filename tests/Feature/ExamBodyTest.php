<?php

use App\Models\CertificationLevel;
use App\Models\ExamBody;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

/*
|--------------------------------------------------------------------------
| AUTH SETUP
|--------------------------------------------------------------------------
*/
beforeEach(function () {
    $user = User::factory()->create();
    $this->actingAs($user);
});

/*
|--------------------------------------------------------------------------
| CREATE
|--------------------------------------------------------------------------
*/
it('can create an exam body', function () {

    $data = [
        'name' => 'KNEC',
        'code' => 'KNEC001',
        'description' => 'Kenya National Examinations Council',
    ];

    $response = $this->post(route('exam-bodies.store'), $data);

    $response->assertStatus(302)
        ->assertSessionHas('success', 'Exam body created successfully');

    $this->assertDatabaseHas('exam_bodies', [
        'name' => 'KNEC',
        'code' => 'KNEC001',
        'description' => 'Kenya National Examinations Council',

    ]);
});

/*
|--------------------------------------------------------------------------
| INDEX
|--------------------------------------------------------------------------
*/
it('can view exam bodies list', function () {

    ExamBody::factory()->count(3)->create();

    $response = $this->get(route('exam-bodies.index'));

    $response->assertStatus(200);
});

/*
|--------------------------------------------------------------------------
| SHOW
|--------------------------------------------------------------------------
*/
// it('can view a single exam body', function () {

//     $examBody = ExamBody::factory()->create();

//     $response = $this->get(route('exam-bodies.show', $examBody));

//     $response->assertStatus(200);
// });

/*
|--------------------------------------------------------------------------
| UPDATE
|--------------------------------------------------------------------------
*/
it('can update an exam body', function () {

    $examBody = ExamBody::factory()->create();

    $data = [
        'name' => 'Updated Body',
        'code' => 'UPD001',
        'description' => 'Updated description',
    ];

    $response = $this->put(route('exam-bodies.update', $examBody), $data);

    $response->assertStatus(302)
        ->assertSessionHas('success', 'Exam body updated successfully');

    $this->assertDatabaseHas('exam_bodies', [
        'id' => $examBody->id,
        'name' => 'Updated Body',
        'code' => 'UPD001',
        'description' => 'Updated description',
    ]);
});

/*
|--------------------------------------------------------------------------
| DELETE
|--------------------------------------------------------------------------
*/
it('can delete an exam body only if no certification levels are linked', function () {

    $examBody = ExamBody::factory()->create();

    $response = $this->delete(route('exam-bodies.destroy', $examBody));

    $response->assertStatus(302)
        ->assertSessionHas('success', 'Exam body deleted successfully');

    // Correct for soft deletes
    $this->assertSoftDeleted('exam_bodies', [
        'id' => $examBody->id,
    ]);
});

it('prevents deleting an exam body when certification levels exist', function () {

    $examBody = ExamBody::factory()->create();

    CertificationLevel::create([
        'exam_body_id' => $examBody->id,
        'name' => 'Level 6',
        'code' => 'L6',
        'description' => 'Certification Level 6',
        'entry_grade' => 'B',
    ]);

    $response = $this->delete(route('exam-bodies.destroy', $examBody));

    $response->assertStatus(302);

    $response->assertSessionHas('error');

    $this->assertDatabaseHas('exam_bodies', [
        'id' => $examBody->id,
        'deleted_at' => null,
    ]);
});
/*
|--------------------------------------------------------------------------
| VALIDATION
|--------------------------------------------------------------------------
*/
it('requires name and code when creating', function () {

    $response = $this->post(route('exam-bodies.store'), [
        'name' => '',
        'code' => '',
        'description' => 'Testing validation',
    ]);

    $response->assertStatus(302)
        ->assertSessionHasErrors(['name', 'code']);
});

it('requires name and code when updating', function () {

    $examBody = ExamBody::factory()->create();

    $response = $this->put(route('exam-bodies.update', $examBody), [
        'name' => '',
        'code' => '',
    ]);

    $response->assertStatus(302)
        ->assertSessionHasErrors(['name', 'code']);
});

it('enforces unique code when creating', function () {

    ExamBody::factory()->create(['code' => 'DUP001']);

    $response = $this->post(route('exam-bodies.store'), [
        'name' => 'Duplicate Code Body',
        'code' => 'DUP001',
        'description' => 'Testing duplicate code',
    ]);

    $response->assertStatus(302)
        ->assertSessionHasErrors(['code']);
});

it('enforces unique code when updating', function () {

    $examBody1 = ExamBody::factory()->create(['code' => 'DUP001']);
    $examBody2 = ExamBody::factory()->create(['code' => 'DUP002']);

    $response = $this->put(route('exam-bodies.update', $examBody2), [
        'name' => 'Updated Name',
        'code' => 'DUP001',
        'description' => 'Testing duplicate code on update',
    ]);

    $response->assertStatus(302)
        ->assertSessionHasErrors(['code']);
});

it('searches exam bodies by name and code', function () {

    ExamBody::factory()->create([
        'name' => 'Kenya National Examinations Council',
        'code' => 'KNEC001',
    ]);

    ExamBody::factory()->create([
        'name' => 'Cambridge International Examinations',
        'code' => 'CIE001',
    ]);

    $response = $this->get(
        route('exam-bodies.search', ['q' => 'Kenya'])
    );

    $response->assertStatus(200)
        ->assertJsonFragment([
            'name' => 'KNEC001 - Kenya National Examinations Council',
        ])
        ->assertJsonMissing([
            'name' => 'CIE001 - Cambridge International Examinations',
        ]);
});
