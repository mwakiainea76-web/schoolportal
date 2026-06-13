<?php

use App\Models\Department;
use App\Models\FeePlan;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->withoutMiddleware();
    $user = User::factory()->create();
    $department = Department::factory()->create();

    $user->staff()->create([
        'department_id' => $department->id,
        'first_name' => 'Finance',
        'last_name' => 'Officer',
        'staff_number' => 'STF/FEE/001',
        'gender' => 'male',
        'phone_number' => '0712345678',
        'date_of_birth' => '1990-01-01',
        'county' => 'Nairobi',
        'address' => '123 Street',
        'religion' => 'Christian',
        'highest_qualification' => 'Degree',
        'hired_date' => '2020-01-01',
        'employment_type' => 'fulltime',
        'designation' => 'Bursar',
    ]);

    $this->actingAs($user);
});

it('can create a fee plan', function () {
    $response = $this->post(route('fees.plans.store'), [
        'name' => '2026 Main Plan',
        'version' => 'v1',
        'is_active' => true,
    ]);

    $response->assertStatus(302)
        ->assertSessionHas('success');

    $this->assertDatabaseHas('fee_plans', [
        'name' => '2026 Main Plan',
        'version' => 'v1',
        'is_active' => true,
    ]);
});

it('can view fee plans list', function () {
    FeePlan::query()->create([
        'name' => 'Plan A',
        'version' => 'v1',
        'is_active' => true,
        'created_by' => auth()->id(),
    ]);

    FeePlan::query()->create([
        'name' => 'Plan B',
        'version' => 'v1',
        'is_active' => false,
        'created_by' => auth()->id(),
    ]);

    $response = $this->get(route('fees.plans.index'));

    $response->assertStatus(200);
});

it('can update a fee plan', function () {
    $feePlan = FeePlan::query()->create([
        'name' => 'Plan A',
        'version' => 'v1',
        'is_active' => true,
        'created_by' => auth()->id(),
    ]);

    $response = $this->put(route('fees.plans.update', $feePlan), [
        'name' => 'Plan A Updated',
        'version' => 'v2',
        'is_active' => false,
    ]);

    $response->assertStatus(302)
        ->assertSessionHas('success');

    $this->assertDatabaseHas('fee_plans', [
        'id' => $feePlan->id,
        'name' => 'Plan A Updated',
        'version' => 'v2',
        'is_active' => false,
    ]);
});

it('can delete a fee plan', function () {
    $feePlan = FeePlan::query()->create([
        'name' => 'Plan A',
        'version' => 'v1',
        'is_active' => true,
        'created_by' => auth()->id(),
    ]);

    $response = $this->delete(route('fees.plans.destroy', $feePlan));

    $response->assertStatus(302)
        ->assertSessionHas('success');

    $this->assertSoftDeleted('fee_plans', [
        'id' => $feePlan->id,
    ]);
});

it('validates required fee plan fields', function () {
    $response = $this->post(route('fees.plans.store'), []);

    $response->assertStatus(302)
        ->assertSessionHasErrors([
            'name',
            'version',
            'is_active',
        ]);
});

it('prevents duplicate fee plan name and version combinations', function () {
    FeePlan::query()->create([
        'name' => 'Plan A',
        'version' => 'v1',
        'is_active' => true,
        'created_by' => auth()->id(),
    ]);

    $response = $this->post(route('fees.plans.store'), [
        'name' => 'Plan A',
        'version' => 'v1',
        'is_active' => true,
    ]);

    $response->assertStatus(302)
        ->assertSessionHasErrors(['name']);
});

it('can search fee plans by name', function () {
    FeePlan::query()->create([
        'name' => 'Tuition Plan',
        'version' => 'v1',
        'is_active' => true,
        'created_by' => auth()->id(),
    ]);

    FeePlan::query()->create([
        'name' => 'Hostel Plan',
        'version' => 'v1',
        'is_active' => true,
        'created_by' => auth()->id(),
    ]);

    $response = $this->get(route('fees.plans.search', ['q' => 'Tuition']));

    $response->assertStatus(200)
        ->assertJsonFragment([
            'name' => 'Tuition Plan',
        ])
        ->assertJsonMissing([
            'name' => 'Hostel Plan',
        ]);
});
