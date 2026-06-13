<?php

use App\Models\Course;
use App\Models\Curriculum;
use App\Models\ExamBody;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function () {
    $user = User::factory()->create();
    $this->actingAs($user);
});

it('can create a curriculum', function () {
    $examBody = ExamBody::factory()->create();
    $course = Course::factory()->create();

    $response = $this->post(route('curriculums.store'), [
        'name' => 'CBET Curriculum',
        'course_id' => $course->id,
        'exam_body_code' => $examBody->code,
        'description' => 'ICT Curriculum',
    ]);

    $response->assertStatus(302)
        ->assertSessionHas('success');

    $this->assertDatabaseHas('curricula', [
        'name' => 'CBET Curriculum',
        'course_id' => $course->id,
        'exam_body_id' => $examBody->id,
    ]);
});

it('can view curriculum list', function () {
    Curriculum::factory()->count(3)->create();

    $response = $this->get(route('curriculums.index'));

    $response->assertStatus(200);
});

it('can update a curriculum', function () {
    $examBody = ExamBody::factory()->create();
    $course = Course::factory()->create();
    $curriculum = Curriculum::factory()->create([
        'course_id' => $course->id,
        'exam_body_id' => $examBody->id,
        'created_by' => auth()->id(),
    ]);

    $response = $this->put(route('curriculums.update', $curriculum), [
        'name' => 'Updated Curriculum',
        'course_id' => $course->id,
        'exam_body_code' => $examBody->code,
        'description' => 'Updated description',
    ]);

    $response->assertStatus(302)
        ->assertSessionHas('success');

    $this->assertDatabaseHas('curricula', [
        'id' => $curriculum->id,
        'name' => 'Updated Curriculum',
    ]);
});

it('can soft delete a curriculum', function () {
    $curriculum = Curriculum::factory()->create();

    $response = $this->delete(route('curriculums.destroy', $curriculum));

    $response->assertStatus(302)
        ->assertSessionHas('success');

    $this->assertSoftDeleted('curricula', [
        'id' => $curriculum->id,
    ]);
});

it('requires fields when creating a curriculum', function () {
    $response = $this->post(route('curriculums.store'), []);

    $response->assertStatus(302)
        ->assertSessionHasErrors([
            'name',
            'exam_body_code',
        ]);
});

it('requires fields when updating a curriculum', function () {
    $curriculum = Curriculum::factory()->create();

    $response = $this->put(route('curriculums.update', $curriculum), []);

    $response->assertStatus(302)
        ->assertSessionHasErrors([
            'name',
            'exam_body_code',
        ]);
});

it('prevents duplicate curriculum names', function () {
    $examBody = ExamBody::factory()->create();

    Curriculum::factory()->create([
        'name' => 'ICT Curriculum',
        'exam_body_id' => $examBody->id,
        'created_by' => auth()->id(),
    ]);

    $response = $this->post(route('curriculums.store'), [
        'name' => 'ICT Curriculum',
        'exam_body_code' => $examBody->code,
    ]);

    $response->assertStatus(302)
        ->assertSessionHasErrors(['name']);
});

it('can search curriculums by name', function () {
    Curriculum::factory()->create([
        'name' => 'ICT Curriculum',
    ]);

    Curriculum::factory()->create([
        'name' => 'Electrical Curriculum',
    ]);

    $response = $this->get(route('curriculums.search', [
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

it('can disable and reactivate a curriculum', function () {
    $curriculum = Curriculum::factory()->create([
        'is_active' => true,
    ]);

    $disableResponse = $this->patch(route('curriculums.disable', $curriculum));
    $disableResponse->assertStatus(302)->assertSessionHas('success');

    expect((bool) $curriculum->fresh()->is_active)->toBeFalse();

    $reactivateResponse = $this->patch(route('curriculums.reactivate', $curriculum));
    $reactivateResponse->assertStatus(302)->assertSessionHas('success');

    expect((bool) $curriculum->fresh()->is_active)->toBeTrue();
});
