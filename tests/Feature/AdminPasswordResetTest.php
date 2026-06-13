<?php

namespace Tests\Feature;

use App\Models\Staff;
use App\Models\Student;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class AdminPasswordResetTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        Role::create(['name' => 'admin']);
        Role::create(['name' => 'hod']);
        Role::create(['name' => 'student']);
    }

    public function test_admin_can_view_staff_password_reset_page(): void
    {
        $admin = User::factory()->create();
        $admin->assignRole('admin');

        $this->actingAs($admin)
            ->get(route('staffs.password-reset.create'))
            ->assertOk();
    }

    public function test_admin_can_reset_staff_password_by_staff_number(): void
    {
        $admin = User::factory()->create();
        $admin->assignRole('admin');

        $staff = Staff::factory()->create([
            'staff_number' => 'TVET/STAFF/001',
        ]);

        $oldHash = $staff->user->password;

        $this->actingAs($admin)
            ->post(route('staffs.password-reset.store'), [
                'staff_number' => 'TVET/STAFF/001',
                'password' => 'NewSecure123',
                'password_confirmation' => 'NewSecure123',
            ])
            ->assertSessionHasNoErrors()
            ->assertSessionHas('success');

        $staff->user->refresh();

        $this->assertNotSame($oldHash, $staff->user->password);
        $this->assertTrue(Hash::check('NewSecure123', $staff->user->password));
    }

    public function test_admin_can_reset_student_password_by_admission_number(): void
    {
        $admin = User::factory()->create();
        $admin->assignRole('admin');

        $student = Student::factory()->create([
            'admission_number' => 'TVET/2026/001',
        ]);

        $oldHash = $student->user->password;

        $this->actingAs($admin)
            ->post(route('students.password-reset.store'), [
                'admission_number' => 'TVET/2026/001',
                'password' => 'StudentPass123',
                'password_confirmation' => 'StudentPass123',
            ])
            ->assertSessionHasNoErrors()
            ->assertSessionHas('success');

        $student->user->refresh();

        $this->assertNotSame($oldHash, $student->user->password);
        $this->assertTrue(Hash::check('StudentPass123', $student->user->password));
    }

    public function test_non_admin_cannot_access_admin_password_reset_pages(): void
    {
        $hod = User::factory()->create();
        $hod->assignRole('hod');

        $this->actingAs($hod)
            ->get(route('staffs.password-reset.create'))
            ->assertForbidden();

        $this->actingAs($hod)
            ->get(route('students.password-reset.create'))
            ->assertForbidden();
    }

    public function test_reset_requires_existing_identifier(): void
    {
        $admin = User::factory()->create();
        $admin->assignRole('admin');

        $this->actingAs($admin)
            ->from(route('students.password-reset.create'))
            ->post(route('students.password-reset.store'), [
                'admission_number' => 'UNKNOWN/001',
                'password' => 'StudentPass123',
                'password_confirmation' => 'StudentPass123',
            ])
            ->assertSessionHasErrors('admission_number')
            ->assertRedirect(route('students.password-reset.create'));
    }
}
