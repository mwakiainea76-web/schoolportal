<?php

use App\Jobs\WriteAuditLogJob;
use App\Models\AuditLog;
use App\Models\Student;
use App\Models\User;
use App\Services\AuditService;
use Illuminate\Support\Facades\Config;
use Spatie\Permission\Models\Role;

uses(\Illuminate\Foundation\Testing\RefreshDatabase::class);

beforeEach(function () {
    Config::set('audit.queue.sync_in_tests', true);
});

function createAuditAdmin(): User
{
    $role = Role::firstOrCreate([
        'name' => 'admin',
        'guard_name' => 'web',
    ]);

    $user = User::factory()->create();
    $user->assignRole($role);

    return $user;
}

it('redacts sensitive fields and stores only meaningful diffs', function () {
    $admin = createAuditAdmin();
    $student = Student::factory()->create();

    $this->actingAs($admin);

    AuditService::log([
        'module' => 'students',
        'action' => 'student_updated',
        'entity' => $student,
        'old_values' => [
            'first_name' => 'Anne',
            'password' => 'old-secret',
        ],
        'new_values' => [
            'first_name' => 'Annie',
            'password' => 'new-secret',
        ],
        'high_risk' => true,
    ]);

    $log = AuditLog::query()->latest('id')->first();

    expect($log)->not->toBeNull();
    expect($log->module)->toBe('students');
    expect($log->action)->toBe('student_updated');
    expect($log->entity_type)->toBe('student');
    expect($log->entity_id)->toBe($student->id);
    expect($log->old_values)->toBe([
        'first_name' => 'Anne',
    ]);
    expect($log->new_values)->toBe([
        'first_name' => 'Annie',
    ]);
    expect(data_get($log->metadata, 'high_risk'))->toBeTrue();
});

it('writes audit logs through the queue job', function () {
    $payload = [
        'module' => 'finance',
        'action' => 'payment_recorded',
        'entity_type' => 'payment',
        'entity_id' => 55,
        'entity_label' => 'Payment #55',
        'metadata' => ['high_risk' => true],
        'created_at' => now(),
    ];

    (new WriteAuditLogJob($payload))->handle();

    $this->assertDatabaseHas('audit_logs', [
        'module' => 'finance',
        'action' => 'payment_recorded',
        'entity_type' => 'payment',
        'entity_id' => 55,
    ]);
});

it('automatically audits student create and update events with the auditable trait', function () {
    $admin = createAuditAdmin();
    $this->actingAs($admin);

    $student = Student::factory()->create([
        'first_name' => 'Jane',
        'last_name' => 'Doe',
    ]);

    $createdLog = AuditLog::query()
        ->where('action', 'student_created')
        ->where('entity_id', $student->id)
        ->first();

    expect($createdLog)->not->toBeNull();

    $student->update([
        'first_name' => 'Janet',
    ]);

    $updatedLog = AuditLog::query()
        ->where('action', 'student_updated')
        ->where('entity_id', $student->id)
        ->latest('id')
        ->first();

    expect($updatedLog)->not->toBeNull();
    expect($updatedLog->old_values)->toMatchArray([
        'first_name' => 'Jane',
    ]);
    expect($updatedLog->new_values)->toMatchArray([
        'first_name' => 'Janet',
    ]);
});

it('allows admin to access the audit log api and blocks regular users', function () {
    $admin = createAuditAdmin();
    $studentUser = User::factory()->create();
    $studentRole = Role::firstOrCreate([
        'name' => 'student',
        'guard_name' => 'web',
    ]);
    $studentUser->assignRole($studentRole);

    AuditLog::query()->create([
        'module' => 'authentication',
        'action' => 'login_success',
        'entity_type' => 'user',
        'entity_id' => $admin->id,
        'entity_label' => $admin->email,
        'created_at' => now(),
    ]);

    $this->actingAs($admin)
        ->getJson('/api/audit-logs')
        ->assertOk()
        ->assertJsonPath('data.0.action', 'login_success');

    $this->actingAs($studentUser)
        ->getJson('/api/audit-logs')
        ->assertForbidden();
});

it('exports audit logs as csv for authorized users', function () {
    $admin = createAuditAdmin();

    AuditLog::query()->create([
        'module' => 'finance',
        'action' => 'invoice_created',
        'entity_type' => 'student_invoice',
        'entity_id' => 99,
        'entity_label' => 'INV-001',
        'created_at' => now(),
    ]);

    $response = $this->actingAs($admin)->get('/api/audit-logs/export');

    $response->assertOk();
    expect($response->headers->get('content-type'))->toContain('text/csv');
});
