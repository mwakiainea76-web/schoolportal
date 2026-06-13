<?php

use App\Models\User;
use App\Models\Staff;
use App\Models\Department;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Spatie\Permission\Models\Role;

uses(RefreshDatabase::class);

beforeEach(function () {
    // Setup roles
    Role::create(['name' => 'admin']);
    Role::create(['name' => 'hod']);
    Role::create(['name' => 'trainer']);
    Role::create(['name' => 'bursar']);
    Role::create(['name' => 'student']);
});

it('allows each role to login and lands on its own independent dashboard', function (string $role) {
    $user = User::factory()->create(['email' => "$role@example.com"]);
    $user->assignRole($role);
    
    // Create staff profile for non-students
    if ($role !== 'student') {
        Staff::factory()->create([
            'user_id' => $user->id,
            'first_name' => ucfirst($role),
            'last_name' => 'User',
        ]);
    } else {
        \App\Models\Student::factory()->create([
            'user_id' => $user->id,
            'first_name' => 'Student',
            'last_name' => 'User',
            'admission_number' => 'STU/001',
        ]);
    }

    $response = $this->actingAs($user)->get(route('dashboard'));

    $response->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('Dashboard')
            ->where('dashboard.type', $role === 'student' ? 'student' : $role)
        );
})->with(['admin', 'hod', 'trainer', 'bursar', 'student']);

it('returns proper 403 or redirect for unauthorized routes', function () {
    $user = User::factory()->create();
    $user->assignRole('student');
    
    // Attempt to access admin logs
    $response = $this->actingAs($user)->get(route('settings.logs.index'));
    
    // Based on RedirectStudentsFromAdmin middleware, it should be 403
    $response->assertStatus(403);
});

it('allows admin to access all staff routes', function () {
    $user = User::factory()->create();
    $user->assignRole('admin');
    
    $department = Department::factory()->create();
    Staff::factory()->create(['user_id' => $user->id, 'department_id' => $department->id]);

    $response = $this->actingAs($user)->get(route('settings.logs.index'));
    $response->assertOk();
});

it('restricts bursar from academic settings', function () {
    $user = User::factory()->create();
    $user->assignRole('bursar');
    
    $department = Department::factory()->create();
    Staff::factory()->create(['user_id' => $user->id, 'department_id' => $department->id]);

    // Bursar should NOT have admin role, so they can't access settings.logs
    $response = $this->actingAs($user)->get(route('settings.logs.index'));
    $response->assertStatus(403);
});
