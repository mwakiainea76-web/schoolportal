<?php

use App\Models\User;
use App\Models\Course;
use App\Models\Curriculum;
use App\Models\CurriculumMapping;
use App\Models\Unit;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Spatie\Permission\Models\Role;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->withoutMiddleware();
    Role::create(['name' => 'admin']);
    $this->admin = User::factory()->create();
    $this->admin->assignRole('admin');
    $this->actingAs($this->admin);
});

it('verifies removed fields are not in the units table', function () {
    $unit = Unit::factory()->create();
    
    $columns = Schema::getColumnListing('units');
    
    expect($columns)->not->toContain('semester');
    expect($columns)->not->toContain('module_slot');
    expect($columns)->not->toContain('sort_order');
    expect($columns)->not->toContain('compulsory');
});

it('can create a unit with scope and module_taught', function () {
    $mapping = CurriculumMapping::factory()->create();
    
    $data = [
        'code' => 'UNIT-QA-001',
        'name' => 'QA Testing Unit',
        'credit_factor' => 10,
        'training_hours' => 60,
        'scope' => 'core',
        'curriculum_mapping_id' => $mapping->id,
        'module_taught' => 1,
    ];

    $response = $this->post(route('units.store'), $data);

    $response->assertStatus(302);
    $this->assertDatabaseHas('units', [
        'code' => 'UNIT-QA-001',
        'scope' => 'core',
        'module_taught' => 1,
    ]);
});

it('filters units correctly by curriculum mapping', function () {
    $mapping1 = CurriculumMapping::factory()->create();
    $mapping2 = CurriculumMapping::factory()->create();
    
    Unit::factory()->create(['curriculum_mapping_id' => $mapping1->id, 'name' => 'Unit 1']);
    Unit::factory()->create(['curriculum_mapping_id' => $mapping2->id, 'name' => 'Unit 2']);
    
    $response = $this->get(route('units.index', ['curriculum_mapping_id' => $mapping1->id]));
    
    $response->assertStatus(200)
        ->assertInertia(fn ($page) => $page
            ->has('units.data', 1)
            ->where('units.data.0.name', 'Unit 1')
        );
});
