<?php

namespace Tests\Feature;

use App\Models\Staff;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class StaffStatusManagementTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        Role::create(['name' => 'admin']);
    }

    public function test_admin_can_open_change_staff_status_page(): void
    {
        $admin = User::factory()->create();
        $admin->assignRole('admin');

        $this->actingAs($admin)
            ->get(route('staffs.status.create'))
            ->assertOk();
    }

    public function test_admin_can_update_staff_status_by_staff_number_and_log_it(): void
    {
        $admin = User::factory()->create();
        $admin->assignRole('admin');

        $staff = Staff::factory()->create([
            'staff_number' => 'TVET/STAFF/001',
            'staff_status' => 'active',
        ]);

        $this->actingAs($admin)
            ->from(route('staffs.status.create'))
            ->post(route('staffs.status.store'), [
                'staff_number' => $staff->staff_number,
                'status' => 'onleave',
                'effective_date' => '2026-06-14',
                'reason' => 'Annual leave',
                'resume_date' => '2026-07-01',
            ])
            ->assertSessionHasNoErrors()
            ->assertRedirect(route('staffs.status.create'));

        $this->assertDatabaseHas('staffs', [
            'id' => $staff->id,
            'staff_status' => 'onleave',
        ]);

        $this->assertDatabaseHas('users', [
            'id' => $staff->user_id,
            'is_active' => false,
        ]);

        $this->assertDatabaseHas('staff_status_logs', [
            'staff_id' => $staff->id,
            'status' => 'onleave',
            'effective_date' => '2026-06-14 00:00:00',
            'reason' => 'Annual leave',
            'resume_date' => '2026-07-01 00:00:00',
            'recorded_by' => $admin->id,
        ]);
    }
}
