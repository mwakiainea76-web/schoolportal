<?php

use App\Jobs\WriteAuditLogJob;
use App\Models\AuditLog;
use App\Models\Curriculum;
use App\Models\ExamBody;
use App\Models\Student;
use App\Models\User;
use App\Services\AuditService;
use App\Traits\Auditable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Support\Facades\File;
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

it('keeps every writable application model auditable except audit logs themselves', function () {
    $exceptions = [
        'App\\Models\\AuditLog',
    ];

    $modelClasses = collect(File::files(app_path('Models')))
        ->map(fn ($file) => 'App\\Models\\'.$file->getFilenameWithoutExtension())
        ->filter(fn ($class) => class_exists($class))
        ->filter(fn ($class) => is_subclass_of($class, Model::class) || is_subclass_of($class, Authenticatable::class))
        ->reject(fn ($class) => in_array($class, $exceptions, true))
        ->values();

    expect($modelClasses)->not->toBeEmpty();

    foreach ($modelClasses as $class) {
        expect(array_key_exists(Auditable::class, class_uses_recursive($class)))
            ->toBeTrue("{$class} must use the Auditable trait.");
    }
});

it('boots every audited model without requiring soft delete events', function () {
    $exceptions = [
        'App\\Models\\AuditLog',
    ];

    $modelClasses = collect(File::files(app_path('Models')))
        ->map(fn ($file) => 'App\\Models\\'.$file->getFilenameWithoutExtension())
        ->filter(fn ($class) => class_exists($class))
        ->filter(fn ($class) => is_subclass_of($class, Model::class) || is_subclass_of($class, Authenticatable::class))
        ->reject(fn ($class) => in_array($class, $exceptions, true))
        ->values();

    foreach ($modelClasses as $class) {
        expect(fn () => new $class)->not->toThrow(Throwable::class);
    }
});

it('resolves audit labels without reading missing attributes in strict mode', function () {
    $curriculum = new Curriculum([
        'name' => 'Business Curriculum',
    ]);

    expect($curriculum->auditLabel())->toBe('Business Curriculum');
});

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
    expect(data_get($log->metadata, 'platform'))->toBe('web');
    expect(data_get($log->metadata, 'request'))->toBeNull();
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
    expect($createdLog->old_values)->toBeNull();
    expect($createdLog->new_values)->toBeNull();

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
    expect(data_get($updatedLog->metadata, 'automatic'))->toBeNull();

    $response = $this->actingAs($admin)->getJson('/api/audit-logs/'.$updatedLog->id);

    $response
        ->assertOk()
        ->assertJsonPath('data.action_label', 'Updated')
        ->assertJsonPath('data.platform', 'Web')
        ->assertJsonPath('data.entity_record_label', 'Student')
        ->assertJsonPath('data.event_description', "System updated a Student record (ID: {$student->id}).")
        ->assertJsonPath('data.change_summary.0', "Changed First Name from 'Jane' to 'Janet'");
});

it('does not store noisy automatic payloads for create delete and restore events', function () {
    $admin = createAuditAdmin();
    $this->actingAs($admin);

    $examBody = ExamBody::query()->create([
        'code' => 'TVETA',
        'name' => 'TVETA',
        'description' => 'Created setup data',
    ]);

    $createdLog = AuditLog::query()
        ->where('action', 'exam_body_created')
        ->where('entity_id', $examBody->id)
        ->latest('id')
        ->first();

    expect($createdLog)->not->toBeNull();
    expect($createdLog->old_values)->toBeNull();
    expect($createdLog->new_values)->toBeNull();

    $examBody->delete();

    $deletedLog = AuditLog::query()
        ->where('action', 'exam_body_deleted')
        ->where('entity_id', $examBody->id)
        ->latest('id')
        ->first();

    expect($deletedLog)->not->toBeNull();
    expect($deletedLog->old_values)->toBeNull();
    expect($deletedLog->new_values)->toBeNull();

    $examBody->restore();

    $restoredLog = AuditLog::query()
        ->where('action', 'exam_body_restored')
        ->where('entity_id', $examBody->id)
        ->latest('id')
        ->first();

    expect($restoredLog)->not->toBeNull();
    expect($restoredLog->old_values)->toBeNull();
    expect($restoredLog->new_values)->toBeNull();
});

it('automatically audits core admin setup records', function () {
    $admin = createAuditAdmin();
    $this->actingAs($admin);

    $examBody = ExamBody::query()->create([
        'code' => 'KNEC-T',
        'name' => 'KNEC Test',
        'description' => 'Initial setup',
    ]);

    $examBody->update([
        'description' => 'Updated setup',
    ]);

    $updatedLog = AuditLog::query()
        ->where('action', 'exam_body_updated')
        ->where('entity_id', $examBody->id)
        ->latest('id')
        ->first();

    expect($updatedLog)->not->toBeNull();
    expect($updatedLog->module)->toBe('exam_bodies');
    expect($updatedLog->old_values)->toMatchArray([
        'description' => 'Initial setup',
    ]);
    expect($updatedLog->new_values)->toMatchArray([
        'description' => 'Updated setup',
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
