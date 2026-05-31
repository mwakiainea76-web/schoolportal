<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;

class DemoRoleSeeder extends Seeder
{
    public function seed(): array
    {
        return [
            'admin' => Role::firstOrCreate(['name' => 'admin', 'guard_name' => 'web']),
            'student' => Role::firstOrCreate(['name' => 'student', 'guard_name' => 'web']),
            'bursar' => Role::firstOrCreate(['name' => 'bursar', 'guard_name' => 'web']),
            'registrar' => Role::firstOrCreate(['name' => 'registrar', 'guard_name' => 'web']),
            'hod' => Role::firstOrCreate(['name' => 'hod', 'guard_name' => 'web']),
            'trainer' => Role::firstOrCreate(['name' => 'trainer', 'guard_name' => 'web']),
        ];
    }
}
