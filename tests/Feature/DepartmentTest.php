<?php

use App\Models\Course;
use App\Models\Department;
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
it('can create a department', function () {

    $data = [
        'name' => 'Information Technology',
        'code' => 'IT001',
        'description' => 'IT Department',
    ];

    $response = $this->post(
        route('departments.store'),
        $data
    );

    $response->assertStatus(302)
        ->assertSessionHas('success');

    $this->assertDatabaseHas('departments', [
        'name' => 'Information Technology',
        'code' => 'IT001',
    ]);
});

/*
|--------------------------------------------------------------------------
| INDEX
|--------------------------------------------------------------------------
*/
it('can view departments list', function () {

    Department::factory()->count(3)->create();

    $response = $this->get(route('departments.index'));

    $response->assertStatus(200);
});

/*
|--------------------------------------------------------------------------
| UPDATE
|--------------------------------------------------------------------------
*/
it('can update a department', function () {

    $department = Department::factory()->create();

    $response = $this->put(
        route('departments.update', $department),
        [
            'name' => 'Updated Department',
            'code' => 'UPD001',
            'description' => 'Updated description',
        ]
    );

    $response->assertStatus(302)
        ->assertSessionHas('success');

    $this->assertDatabaseHas('departments', [
        'id' => $department->id,
        'name' => 'Updated Department',
        'code' => 'UPD001',
    ]);
});

/*
|--------------------------------------------------------------------------
| SOFT DELETE (NO COURSE LINK)
|--------------------------------------------------------------------------
*/
it('can soft delete a department when no courses are linked', function () {

    $department = Department::factory()->create();

    $response = $this->delete(
        route('departments.destroy', $department)
    );

    $response->assertStatus(302)
        ->assertSessionHas('success');

    $this->assertSoftDeleted('departments', [
        'id' => $department->id,
    ]);
});

/*
|--------------------------------------------------------------------------
| PREVENT DELETE WHEN COURSES EXIST
|--------------------------------------------------------------------------
*/
it('prevents deleting a department when courses exist', function () {

    $department = Department::factory()->create();

    Course::factory()->create([
        'department_id' => $department->id,
    ]);

    $response = $this->delete(
        route('departments.destroy', $department)
    );

    $response->assertStatus(302)
        ->assertSessionHas('error');

    $this->assertDatabaseHas('departments', [
        'id' => $department->id,
    ]);

    expect($department->fresh()->deleted_at)->toBeNull();
});

/*
|--------------------------------------------------------------------------
| VALIDATION
|--------------------------------------------------------------------------
*/
it('requires fields when creating department', function () {

    $response = $this->post(route('departments.store'), []);

    $response->assertStatus(302)
        ->assertSessionHasErrors([
            'name',
            'code',
        ]);
});
