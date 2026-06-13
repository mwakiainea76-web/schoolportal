<?php

use App\Models\User;
use Illuminate\Support\Facades\File;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Spatie\Permission\Models\Role;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->withoutMiddleware();
    Role::create(['name' => 'admin']);
    $this->admin = User::factory()->create();
    $this->admin->assignRole('admin');
    $this->actingAs($this->admin);
    
    // Create a mock log file
    $this->logPath = storage_path('logs/test-qa.log');
    File::put($this->logPath, "[2026-06-13 10:00:00] local.INFO: Test log entry 1\n[2026-06-13 10:05:00] local.ERROR: Test error entry 2\n");
});

afterEach(function () {
    if (File::exists($this->logPath)) {
        File::delete($this->logPath);
    }
});

it('loads the log file list correctly', function () {
    $response = $this->get(route('settings.logs.index'));
    
    $response->assertStatus(200)
        ->assertInertia(fn ($page) => $page
            ->has('files')
            ->where('files.0.name', 'test-qa.log') // It's sorted by updated_at desc, so it should be first
        );
});

it('displays log entries from a selected file', function () {
    $response = $this->get(route('settings.logs.index', ['file' => 'test-qa.log']));
    
    $response->assertStatus(200)
        ->assertInertia(fn ($page) => $page
            ->has('log.entries.data', 2)
            ->where('log.entries.data.1.message', 'Test log entry 1') // Reversed order
            ->where('log.entries.data.0.message', 'Test error entry 2')
        );
});

it('filters log entries by level', function () {
    $response = $this->get(route('settings.logs.index', ['file' => 'test-qa.log', 'level' => 'error']));
    
    $response->assertStatus(200)
        ->assertInertia(fn ($page) => $page
            ->has('log.entries.data', 1)
            ->where('log.entries.data.0.level', 'error')
        );
});

it('filters log entries by search term', function () {
    $response = $this->get(route('settings.logs.index', ['file' => 'test-qa.log', 'search' => 'error']));
    
    $response->assertStatus(200)
        ->assertInertia(fn ($page) => $page
            ->has('log.entries.data', 1)
            ->where('log.entries.data.0.message', 'Test error entry 2')
        );
});

it('can clear a log file', function () {
    $response = $this->post(route('settings.logs.clear'), ['file' => 'test-qa.log']);
    
    $response->assertStatus(302);
    expect(File::get($this->logPath))->toBeEmpty();
});
