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

        /*
        |--------------------------------------------------------------------------
        | ADMIN USER
        |--------------------------------------------------------------------------
        */

        $admin = User::updateOrCreate(
            ['email' => 'admin@system.com'],
            [
                'first_name' => 'System',
                'last_name' => 'Admin',
                'other_name' => '',
                'login_id' => 'ST12/0023/19',
                'phone_number' => '0700000000',
                'date_of_birth' => '1990-01-01',
                'county' => 'Nairobi',
                'address' => 'Head Office',
                'gender' => 'male',
                'profile_photo' => null,
                'religion' => 'N/A',
                'password' => Hash::make('@123Password'),
                'email_verified_at' => now(),
                'is_active' => true,
            ]
        );

        // Assign role
        if (! $admin->hasRole('admin')) {
            $admin->assignRole($adminRole);
        }

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

        Department::updateOrCreate(
            [
                'name' => 'Huma resourse ',
                'code' => '0023/19 ',
            ]
        );
        Staff::updateOrCreate(
            ['user_id' => $admin->id],
            [
                'employment_type' => 'Permanent ',
                'staff_number' => 'ST12/0023/19',
                'salary' => 100000,
                'department_id' => 1,
                'hired_date' => now(),
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
