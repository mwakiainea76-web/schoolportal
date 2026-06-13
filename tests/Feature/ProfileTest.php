<?php

namespace Tests\Feature;

use App\Models\Department;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProfileTest extends TestCase
{
    use RefreshDatabase;

    public function test_profile_page_is_displayed(): void
    {
        $user = User::factory()->create();

        $response = $this
            ->actingAs($user)
            ->get('/profile');

        $response->assertOk();
    }

    public function test_profile_information_is_read_only_for_the_user(): void
    {
        $user = User::factory()->create();
        $department = Department::factory()->create();
        $user->staff()->create([
            'first_name' => 'Old',
            'last_name' => 'Name',
            'department_id' => $department->id,
            'staff_number' => 'STF001',
            'gender' => 'male',
            'phone_number' => '0712345678',
            'date_of_birth' => '1990-01-01',
            'county' => 'Nairobi',
            'address' => '123 Street',
            'religion' => 'Christian',
            'highest_qualification' => 'Degree',
            'hired_date' => '2020-01-01',
            'employment_type' => 'fulltime',
            'designation' => 'Lecturer',
        ]);

        $response = $this
            ->actingAs($user)
            ->patch('/profile', [
                'first_name' => 'Test',
                'last_name' => 'User',
                'email' => 'test@example.com',
            ]);

        $response->assertStatus(403);

        $user->refresh();
        $staff = $user->staff()->first();

        $this->assertSame('Old', $staff?->first_name);
        $this->assertSame('Name', $staff?->last_name);
        $this->assertNotSame('test@example.com', $user->email);
    }

    public function test_email_verification_status_remains_unchanged_when_profile_edit_is_blocked(): void
    {
        $user = User::factory()->create();
        $department = Department::factory()->create();
        $user->staff()->create([
            'first_name' => 'Test',
            'last_name' => 'User',
            'department_id' => $department->id,
            'staff_number' => 'STF001',
            'gender' => 'male',
            'phone_number' => '0712345678',
            'date_of_birth' => '1990-01-01',
            'county' => 'Nairobi',
            'address' => '123 Street',
            'religion' => 'Christian',
            'highest_qualification' => 'Degree',
            'hired_date' => '2020-01-01',
            'employment_type' => 'fulltime',
            'designation' => 'Lecturer',
        ]);

        $response = $this
            ->actingAs($user)
            ->patch('/profile', [
                'first_name' => 'Test',
                'last_name' => 'User',
                'email' => $user->email,
            ]);

        $response->assertStatus(403);

        $this->assertNotNull($user->refresh()->email_verified_at);
    }

    public function test_user_can_delete_their_account(): void
    {
        $user = User::factory()->create();

        $response = $this
            ->actingAs($user)
            ->delete('/profile', [
                'password' => '@123Password',
            ]);

        $response
            ->assertSessionHasNoErrors()
            ->assertRedirect('/');

        $this->assertGuest();
        $this->assertSoftDeleted('users', [
            'id' => $user->id,
        ]);
    }

    public function test_correct_password_must_be_provided_to_delete_account(): void
    {
        $user = User::factory()->create();

        $response = $this
            ->actingAs($user)
            ->from('/profile')
            ->delete('/profile', [
                'password' => 'wrong-password',
            ]);

        $response
            ->assertSessionHasErrors('password')
            ->assertRedirect('/profile');

        $this->assertNotNull($user->fresh());
    }
}
