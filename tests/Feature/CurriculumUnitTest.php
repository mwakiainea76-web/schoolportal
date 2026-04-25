<?php

use App\Models\Course;
use App\Models\Curriculum;
use App\Models\CurriculumUnit;
use App\Models\Unit;
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
it('can create a curriculum unit', function () {

    $course = Course::factory()->create();
    $curriculum = Curriculum::factory()->create([
        'course_id' => $course->id,
    ]);

    $unit = Unit::factory()->create();

    $data = [
        'curriculum_id' => $curriculum->id,
        'unit_id' => $unit->id,
        'module_taught' => 1,
    ];

    $response = $this->post(
        route('units-curriculum.store'),
        $data
    );

    $response->assertStatus(302)
        ->assertSessionHas('success');

    $this->assertDatabaseHas('curriculum_units', [
        'curriculum_id' => $curriculum->id,
        'unit_id' => $unit->id,
        'module_taught' => 1,
    ]);
});

/*
|--------------------------------------------------------------------------
| INDEX
|--------------------------------------------------------------------------
*/
it('can list curriculum units', function () {

    $course = Course::factory()->create(['is_active' => true]);

    $curriculum = Curriculum::factory()->create([
        'course_id' => $course->id,
    ]);

    $unit = Unit::factory()->create();

    CurriculumUnit::factory()->create([
        'curriculum_id' => $curriculum->id,
        'unit_id' => $unit->id,
    ]);

    $response = $this->get(route('units-curriculum.index'));

    $response->assertStatus(200);
});

/*
|--------------------------------------------------------------------------
| DUPLICATE PREVENTION
|--------------------------------------------------------------------------
*/
it('prevents duplicate curriculum unit entry', function () {

    $course = Course::factory()->create();

    $curriculum = Curriculum::factory()->create([
        'course_id' => $course->id,
    ]);

    $unit = Unit::factory()->create();

    CurriculumUnit::factory()->create([
        'curriculum_id' => $curriculum->id,
        'unit_id' => $unit->id,
    ]);

    $response = $this->post(route('units-curriculum.store'), [
        'curriculum_id' => $curriculum->id,
        'unit_id' => $unit->id,
        'module_taught' => 2,
    ]);

    $response->assertStatus(302)
        ->assertSessionHas('error');
});

/*
|--------------------------------------------------------------------------
| VALIDATION
|--------------------------------------------------------------------------
*/
it('requires fields when creating curriculum unit', function () {

    $response = $this->post(route('units-curriculum.store'), []);

    $response->assertStatus(302)
        ->assertSessionHasErrors([
            'curriculum_id',
            'unit_id',
            'module_taught',
        ]);
});

/*
|--------------------------------------------------------------------------
| RELATION INTEGRITY (cascade delete)
|--------------------------------------------------------------------------
*/

