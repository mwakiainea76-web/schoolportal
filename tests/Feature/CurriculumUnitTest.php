<?php

use App\Models\CurriculumMapping;
use App\Models\Unit;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function () {
    $user = User::factory()->create();
    $this->actingAs($user);
});

it('can create a curriculum unit', function () {
    $mapping = CurriculumMapping::factory()->create([
        'created_by' => auth()->id(),
    ]);

    $response = $this->post(route('units.store'), [
        'curriculum_mapping_id' => $mapping->id,
        'code' => 'COM101',
        'name' => 'Communication Skills',
        'credit_factor' => 3,
        'training_hours' => 45,
        'description' => 'Foundation communication unit',
        'scope' => 'common',
        'module_taught' => 1,
    ]);

    $response->assertStatus(302)
        ->assertSessionHas('success');

    $this->assertDatabaseHas('units', [
        'curriculum_mapping_id' => $mapping->id,
        'code' => 'COM101',
        'name' => 'Communication Skills',
        'scope' => 'common',
        'module_taught' => 1,
    ]);
});

it('can list curriculum units', function () {
    Unit::factory()->count(3)->create();

    $response = $this->get(route('units.index'));

    $response->assertStatus(200);
});

it('prevents duplicate curriculum unit entry within the same mapping', function () {
    $mapping = CurriculumMapping::factory()->create([
        'created_by' => auth()->id(),
    ]);

    Unit::factory()->create([
        'curriculum_mapping_id' => $mapping->id,
        'code' => 'COM101',
    ]);

    $response = $this->post(route('units.store'), [
        'curriculum_mapping_id' => $mapping->id,
        'code' => 'COM101',
        'name' => 'Communication Skills',
        'credit_factor' => 3,
        'training_hours' => 45,
        'description' => 'Duplicate unit code',
        'scope' => 'common',
        'module_taught' => 2,
    ]);

    $response->assertStatus(302)
        ->assertSessionHasErrors(['code']);
});

it('requires fields when creating curriculum unit', function () {
    $response = $this->post(route('units.store'), []);

    $response->assertStatus(302)
        ->assertSessionHasErrors([
            'curriculum_mapping_id',
            'code',
            'name',
            'credit_factor',
            'training_hours',
            'scope',
            'module_taught',
        ]);
});
