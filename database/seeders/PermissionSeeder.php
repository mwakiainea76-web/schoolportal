<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

class PermissionSeeder extends Seeder
{
    public function run(): void
    {
        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        $modules = [
            'departments',
            'courses',
            'curriculums',
            'courses.curriculum-mappings',
            'units',
            'units.curriculum-units',
            'permissions',
            'roles',
            'users',
            'students',
            'staffs',
            'exam.bodies',
            'nextofkins',
            'fees',
            'payments',
            'billing.ledger',
            'exams',
            'certification.levels',
            'certifications',
            'enrollments',
            'grades',
            'academic.years',
            'academic.sessions',
        ];

        $actions = ['view', 'create', 'edit', 'delete'];

        $permissions = [];

        foreach ($modules as $module) {
            foreach ($actions as $action) {
                $permissions[] = Permission::firstOrCreate([
                    'name' => "{$module}.{$action}",
                    'guard_name' => 'web',
                ]);
            }
        }

        $admin = Role::firstOrCreate([
            'name' => 'admin',
            'guard_name' => 'web',
        ]);

        $admin->syncPermissions($permissions);
    }
}
