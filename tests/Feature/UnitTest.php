<?php

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
it('can create a unit', function () {

    $data = [
        'code' => 'UNIT001',
        'name' => 'Networking Fundamentals',
        'description' => 'Basic networking unit',
        'credit_factor' => 3,
        'training_hours' => 120,
    ];

    $response = $this->post(
        route('units.store'),
        $data
    );

    $response->assertStatus(302)
        ->assertSessionHas('success');

    $this->assertDatabaseHas('units', [
        'code' => 'UNIT001',
        'name' => 'Networking Fundamentals',
    ]);
});

/*
|--------------------------------------------------------------------------
| INDEX
|--------------------------------------------------------------------------
*/
it('can view units list', function () {

    Unit::factory()->count(3)->create();

    $response = $this->get(route('units.index'));

    $response->assertStatus(200);
});

/*
|--------------------------------------------------------------------------
| SHOW
|--------------------------------------------------------------------------
*/
// it('can view a unit', function () {

//     $unit = Unit::factory()->create();

//     $response = $this->get(route('units.show', $unit));

//     $response->assertStatus(200);
// });

/*
|--------------------------------------------------------------------------
| EDIT (by code search)
|--------------------------------------------------------------------------
*/
it('can load unit for editing by code', function () {

    $unit = Unit::factory()->create([
        'code' => 'UNIT123',
    ]);

    $response = $this->get(route('units.edit', 'UNIT123'));

    $response->assertStatus(200)
        ->assertInertia(fn ($page) => $page->has('unit')
            ->where('search_term', 'UNIT123')
        );
});

/*
|--------------------------------------------------------------------------
| UPDATE
|--------------------------------------------------------------------------
*/
it('can update a unit', function () {

    $unit = Unit::factory()->create();

    $response = $this->put(
        route('units.update', $unit),
        [
            'code' => 'UNIT999',
            'name' => 'Updated Unit',
            'description' => 'Updated description',
            'credit_factor' => 5,
            'training_hours' => 200,
        ]
    );

    $response->assertStatus(302)
        ->assertSessionHas('success');

    $this->assertDatabaseHas('units', [
        'id' => $unit->id,
        'code' => 'UNIT999',
        'name' => 'Updated Unit',
    ]);
});

/*
|--------------------------------------------------------------------------
| DELETE
|--------------------------------------------------------------------------
*/
it('can soft delete a unit', function () {

    $unit = \App\Models\Unit::factory()->create();

    $response = $this->delete(
        route('units.destroy', $unit)
    );

    $response->assertStatus(302)
        ->assertSessionHas('success');

    //  correct soft delete assertion
    $this->assertSoftDeleted('units', [
        'id' => $unit->id,
    ]);
});

/*
|--------------------------------------------------------------------------
| VALIDATION (CREATE)
|--------------------------------------------------------------------------
*/
it('requires fields when creating a unit', function () {

    $response = $this->post(route('units.store'), []);

    $response->assertStatus(302)
        ->assertSessionHasErrors([
            'code',
            'name',
            'credit_factor',
            'training_hours',
        ]);
});

/*
|--------------------------------------------------------------------------
| VALIDATION (UPDATE)
|--------------------------------------------------------------------------
*/
it('requires fields when updating a unit', function () {

    $unit = Unit::factory()->create();

    $response = $this->put(
        route('units.update', $unit),
        []
    );

    $response->assertStatus(302)
        ->assertSessionHasErrors([
            'code',
            'name',
            'credit_factor',
            'training_hours',
        ]);
});

/*
|--------------------------------------------------------------------------
| SEARCH
|--------------------------------------------------------------------------
*/
it('can search units by name or code', function () {

    Unit::factory()->create([
        'name' => 'Networking Basics',
        'code' => 'NET101',
    ]);

    Unit::factory()->create([
        'name' => 'Database Systems',
        'code' => 'DB101',
    ]);

    $response = $this->get(route('units.search', [
        'q' => 'Net',
    ]));

    $response->assertStatus(200)
        ->assertJsonFragment([
            'name' => 'NET101 - Networking Basics',
        ])
        ->assertJsonMissing([
            'name' => 'DB101 - Database Systems',
        ]);
});
