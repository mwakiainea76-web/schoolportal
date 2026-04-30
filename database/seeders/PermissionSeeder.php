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
            'units',
            'permissions',
            'roles',
            'users',
            'students',
            'staffs',
            'exam.bodies',
            'nextofkins',
            'fees',
            'payments',
            'exams',
            'certification.levels',
            'certifications',
            'enrollments',
            'grades',
            'curriculums',
            'courses.curriculum',
            'units.curriculum',
            'academic.years',
            'academic.sessions',
        ];

        // ✅ USE CONSISTENT NAMING WITH FRONTEND
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
