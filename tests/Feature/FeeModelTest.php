<?php

use App\Models\AcademicSession;
use App\Models\Curriculum;
use App\Models\Department;
use App\Models\FeeModel;
use App\Models\FeeTemplate;
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
it('can create a fee model', function () {
    $feeTemplate = FeeTemplate::factory()->create();
    $department = Department::factory()->create();
    $curriculum = Curriculum::factory()->create();
    $academicSession = AcademicSession::factory()->create();

    $data = [
        'fee_template_id' => $feeTemplate->id,
        'scope' => 'department',
        'priority' => '70',
        'department_id' => $department->id,
        'curricula_id' => null,
        'academic_session_id' => $academicSession->id,
        'valid_from' => '2024-01-01',
        'valid_until' => '2024-12-31',
        'is_active' => true,
    ];

    $response = $this->post(
        route('fees.models.store'),
        $data
    );

    $response->assertStatus(302)
        ->assertSessionHas('success');

    $this->assertDatabaseHas('fee_models', [
        'fee_template_id' => $feeTemplate->id,
        'scope' => 'department',
        'priority' => '70',
        'department_id' => $department->id,
        'is_active' => true,
    ]);
});

it('can create a global fee model', function () {
    $feeTemplate = FeeTemplate::factory()->create();
    $academicSession = AcademicSession::factory()->create();

    $data = [
        'fee_template_id' => $feeTemplate->id,
        'scope' => 'global',
        'priority' => '60',
        'department_id' => null,
        'curricula_id' => null,
        'academic_session_id' => $academicSession->id,
        'valid_from' => '2024-01-01',
        'valid_until' => null,
        'is_active' => true,
    ];

    $response = $this->post(
        route('fees.models.store'),
        $data
    );

    $response->assertStatus(302)
        ->assertSessionHas('success');

    $this->assertDatabaseHas('fee_models', [
        'fee_template_id' => $feeTemplate->id,
        'scope' => 'global',
        'priority' => '60',
        'department_id' => null,
        'curricula_id' => null,
        'is_active' => true,
    ]);
});

/*
|--------------------------------------------------------------------------
| INDEX
|--------------------------------------------------------------------------
*/
it('can view fee models list', function () {
    FeeModel::factory()->count(3)->create();

    $response = $this->get(route('fees.models.index'));

    $response->assertStatus(200)
        ->assertInertia(fn ($page) => $page
            ->has('feeModels.data', 3)
        );
});

/*
|--------------------------------------------------------------------------
| UPDATE
|--------------------------------------------------------------------------
*/
it('can update a fee model', function () {
    $feeModel = FeeModel::factory()->create();
    $newTemplate = FeeTemplate::factory()->create();

    $data = [
        'fee_template_id' => $newTemplate->id,
        'scope' => 'global',
        'priority' => '80',
        'department_id' => null,
        'curricula_id' => null,
        'academic_session_id' => $feeModel->academic_session_id,
        'valid_from' => '2024-06-01',
        'valid_until' => '2025-05-31',
        'is_active' => false,
    ];

    $response = $this->put(
        route('fees.models.update', $feeModel),
        $data
    );

    $response->assertStatus(302)
        ->assertSessionHas('success');

    $feeModel->refresh();

    expect($feeModel->fee_template_id)->toBe($newTemplate->id);
    expect($feeModel->scope)->toBe('global');
    expect($feeModel->priority)->toBe('80');
    expect($feeModel->is_active)->toBe(false);
});

/*
|--------------------------------------------------------------------------
| DELETE
|--------------------------------------------------------------------------
*/
it('can delete a fee model', function () {
    $feeModel = FeeModel::factory()->create();

    $response = $this->delete(
        route('fees.models.destroy', $feeModel)
    );

    $response->assertStatus(302)
        ->assertSessionHas('success');

    $this->assertSoftDeleted($feeModel);
});

/*
|--------------------------------------------------------------------------
| VALIDATION
|--------------------------------------------------------------------------
*/
it('validates required fields', function () {
    $data = [
        // Missing required fields
    ];

    $response = $this->post(
        route('fees.models.store'),
        $data
    );

    $response->assertStatus(302)
        ->assertSessionHasErrors([
            'fee_template_id',
            'scope',
            'priority',
            'valid_from',
            'is_active',
        ]);
});

it('validates scope values', function () {
    $feeTemplate = FeeTemplate::factory()->create();
    $academicSession = AcademicSession::factory()->create();

    $data = [
        'fee_template_id' => $feeTemplate->id,
        'scope' => 'invalid_scope',
        'priority' => '70',
        'academic_session_id' => $academicSession->id,
        'valid_from' => '2024-01-01',
        'is_active' => true,
    ];

    $response = $this->post(
        route('fees.models.store'),
        $data
    );

    $response->assertStatus(302)
        ->assertSessionHasErrors('scope');
});

it('validates priority values', function () {
    $feeTemplate = FeeTemplate::factory()->create();
    $academicSession = AcademicSession::factory()->create();

    $data = [
        'fee_template_id' => $feeTemplate->id,
        'scope' => 'global',
        'priority' => '90', // Invalid priority
        'academic_session_id' => $academicSession->id,
        'valid_from' => '2024-01-01',
        'is_active' => true,
    ];

    $response = $this->post(
        route('fees.models.store'),
        $data
    );

    $response->assertStatus(302)
        ->assertSessionHasErrors('priority');
});

it('validates valid_until is after valid_from', function () {
    $feeTemplate = FeeTemplate::factory()->create();
    $academicSession = AcademicSession::factory()->create();

    $data = [
        'fee_template_id' => $feeTemplate->id,
        'scope' => 'global',
        'priority' => '70',
        'academic_session_id' => $academicSession->id,
        'valid_from' => '2024-12-31',
        'valid_until' => '2024-01-01', // Before valid_from
        'is_active' => true,
    ];

    $response = $this->post(
        route('fees.models.store'),
        $data
    );

    $response->assertStatus(302)
        ->assertSessionHasErrors('valid_until');
});

/*
|--------------------------------------------------------------------------
| SCOPES
|--------------------------------------------------------------------------
*/
it('can filter active fee models', function () {
    FeeModel::factory()->count(2)->active()->create();
    FeeModel::factory()->count(3)->inactive()->create();

    $response = $this->get(route('fees.models.index', ['status' => 'active']));

    $response->assertStatus(200)
        ->assertInertia(fn ($page) => $page
            ->has('feeModels.data', 2)
        );
});

it('can filter by scope', function () {
    FeeModel::factory()->count(2)->global()->create();
    FeeModel::factory()->count(3)->forDepartment()->create();

    $response = $this->get(route('fees.models.index', ['scope' => 'global']));

    $response->assertStatus(200)
        ->assertInertia(fn ($page) => $page
            ->has('feeModels.data', 2)
        );
});

it('can filter valid fee models', function () {
    FeeModel::factory()->count(2)->valid()->create();
    FeeModel::factory()->count(3)->expired()->create();

    $response = $this->get(route('fees.models.index', ['valid' => 'valid']));

    $response->assertStatus(200)
        ->assertInertia(fn ($page) => $page
            ->has('feeModels.data', 2)
        );
});

/*
|--------------------------------------------------------------------------
| MODEL METHODS
|--------------------------------------------------------------------------
*/
it('has correct display name for global scope', function () {
    $feeTemplate = FeeTemplate::factory()->create(['name' => 'Tuition Fee']);
    $feeModel = FeeModel::factory()->global()->create(['fee_template_id' => $feeTemplate->id]);

    expect($feeModel->display_name)->toBe('Tuition Fee (Global)');
});

it('has correct display name for department scope', function () {
    $feeTemplate = FeeTemplate::factory()->create(['name' => 'Lab Fee']);
    $department = Department::factory()->create(['name' => 'Computer Science']);
    $feeModel = FeeModel::factory()->forDepartment()->create([
        'fee_template_id' => $feeTemplate->id,
        'department_id' => $department->id,
    ]);

    expect($feeModel->display_name)->toBe('Lab Fee (Computer Science)');
});

it('can determine if fee model is valid', function () {
    $validModel = FeeModel::factory()->valid()->create();
    $expiredModel = FeeModel::factory()->expired()->create();

    expect($validModel->is_valid)->toBe(true);
    expect($expiredModel->is_valid)->toBe(false);
});

it('can determine scope type', function () {
    $globalModel = FeeModel::factory()->global()->create();
    $departmentModel = FeeModel::factory()->forDepartment()->create();
    $curriculumModel = FeeModel::factory()->forCurriculum()->create();

    expect($globalModel->isGlobal())->toBe(true);
    expect($globalModel->isForDepartment())->toBe(false);
    expect($globalModel->isForCurriculum())->toBe(false);

    expect($departmentModel->isGlobal())->toBe(false);
    expect($departmentModel->isForDepartment())->toBe(true);
    expect($departmentModel->isForCurriculum())->toBe(false);

    expect($curriculumModel->isGlobal())->toBe(false);
    expect($curriculumModel->isForDepartment())->toBe(false);
    expect($curriculumModel->isForCurriculum())->toBe(true);
});