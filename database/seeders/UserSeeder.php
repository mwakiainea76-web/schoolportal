<?php

namespace Database\Seeders;

use App\Models\Department;
use App\Models\NextOfKin;
use App\Models\Staff;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // ✅ Clear permission cache
        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        // ✅ Ensure roles exist
        $adminRole = Role::firstOrCreate([
            'name' => 'admin',
            'guard_name' => 'web',
        ]);
        Role::firstOrCreate([
            'name' => 'trainer',
            'guard_name' => 'web',
        ]);

        /*
        |--------------------------------------------------------------------------
        | ADMIN USER
        |--------------------------------------------------------------------------
        */

        $admin = User::updateOrCreate(
            ['email' => 'admin@system.com'],
            [
                'login_id' => 'ST12/0023/19',
                'password' => Hash::make('@123Password'),
                'email_verified_at' => now(),
                'is_active' => true,
            ]
        );

        // Assign role
        if (! $admin->hasRole('admin')) {
            $admin->assignRole($adminRole);
        }

        $dept = Department::updateOrCreate(
            [
                'code' => '0023/19 ',
            ],
            [
                'name' => 'Human Resource',
                'description' => 'Human Resource Department',
            ]
        );

        Staff::updateOrCreate(
            ['user_id' => $admin->id],
            [
                'first_name' => 'System',
                'last_name' => 'Admin',
                'other_name' => '',
                'email' => 'admin@system.com',
                'phone_number' => '0700000000',
                'date_of_birth' => '1990-01-01',
                'county' => 'Nairobi',
                'address' => 'Head Office',
                'gender' => 'male',
                'religion' => 'N/A',
                'employment_type' => 'Permanent ',
                'staff_number' => 'ST12/0023/19',
                'salary' => 100000,
                'department_id' => $dept->id,
                'hired_date' => now(),
                'designation' => 'System Administrator',
                'national_id_number' => '00000000',
                'kra_pin' => 'A000000000X',
                'nhif_number' => '00000000',
                'nssf_number' => '00000000',
                'staff_status' => 'active',
            ]
        );

        // Attach next of kin
        NextOfKin::updateOrCreate(
            ['user_id' => $admin->id],
            [
                'first_name' => 'Jane ',
                'last_name' => ' Admin',
                'relationship' => 'Spouse',
                'phone_number' => '0711111111',
                'alternate_phone_number' => '0722222222',
                'email' => 'jane.admin@example.com',
            ]
        );

        /*
        |--------------------------------------------------------------------------
        | YOU CAN ADD MORE USERS HERE
        |--------------------------------------------------------------------------
        */

        // Example: staff, student, etc (later)
    }
}
