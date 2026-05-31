<?php

namespace Database\Seeders;

use App\Models\Department;
use App\Models\NextOfKin;
use App\Models\Staff;
use App\Models\User;
use Illuminate\Database\Seeder;

class DemoStaffSeeder extends Seeder
{
    public function seed(array $roles): array
    {
        $admin = User::firstOrCreate(
            ['email' => 'admin@tvetdemo.ke'],
            $this->userData('Martin', 'Njoroge', '0701001001', '1988-06-14', 'Nairobi', 'Westlands, Nairobi', 'male', 'Catholic', 'Password@123')
        );
        $admin->syncRoles([$roles['admin']->name]);

        $registrarUser = User::firstOrCreate(
            ['email' => 'registrar@tvetdemo.ke'],
            $this->userData('Linet', 'Wambui', '0701001002', '1991-02-11', 'Kiambu', 'Ruiru, Kiambu', 'female', 'Christian', 'Password@123')
        );
        $registrarUser->syncRoles([$roles['registrar']->name]);

        $bursarUser = User::firstOrCreate(
            ['email' => 'bursar@tvetdemo.ke'],
            $this->userData('Peter', 'Mutiso', '0701001003', '1986-09-03', 'Machakos', 'Machakos Town', 'male', 'Christian', 'Password@123')
        );
        $bursarUser->syncRoles([$roles['bursar']->name]);

        $hodUser = User::firstOrCreate(
            ['email' => 'hod.ict@tvetdemo.ke'],
            $this->userData('Mercy', 'Achieng', '0701001004', '1989-12-21', 'Kisumu', 'Milimani, Kisumu', 'female', 'Christian', 'Password@123')
        );
        $hodUser->syncRoles([$roles['hod']->name]);

        $trainerUser = User::firstOrCreate(
            ['email' => 'trainer.ict@tvetdemo.ke'],
            $this->userData('Brian', 'Otieno', '0701001005', '1992-04-10', 'Kisumu', 'Migosi, Kisumu', 'male', 'Christian', 'Password@123')
        );
        $trainerUser->syncRoles([$roles['trainer']->name]);

        foreach ([$admin, $registrarUser, $bursarUser, $hodUser, $trainerUser] as $user) {
            NextOfKin::firstOrCreate(
                ['user_id' => $user->id],
                [
                    'first_name' => 'Grace',
                    'last_name' => $user->last_name,
                    'relationship' => 'Sibling',
                    'phone_number' => '0712000000',
                    'alternate_phone_number' => '0722000000',
                    'email' => strtolower($user->last_name).'.kin@tvetdemo.ke',
                ]
            );
        }

        $departments = Department::pluck('id', 'code');

        $adminStaff = Staff::firstOrCreate(
            ['user_id' => $admin->id],
            [
                'department_id' => $departments['BUS'] ?? $departments->first(),
                'designation' => 'Principal',
                'staff_number' => 'TVET/STAFF/001',
                'national_id_number' => '20100001',
                'salary' => 145000,
                'hired_date' => '2023-01-10',
                'employment_type' => 'Permanent',
                'highest_qualification' => 'Masters in Education Management',
                'specialization' => 'Institutional Management',
                'kra_pin' => 'A001000001X',
                'nhif_number' => 'NHIF000001',
                'nssf_number' => 'NSSF000001',
                'staff_status' => 'active',
            ]
        );

        $registrarStaff = Staff::firstOrCreate(
            ['user_id' => $registrarUser->id],
            [
                'department_id' => $departments['BUS'] ?? $departments->first(),
                'designation' => 'Registrar',
                'staff_number' => 'TVET/STAFF/002',
                'national_id_number' => '20100002',
                'salary' => 118000,
                'hired_date' => '2023-03-14',
                'employment_type' => 'Permanent',
                'highest_qualification' => 'Bachelor of Education',
                'specialization' => 'Academic Administration',
                'kra_pin' => 'A001000002X',
                'nhif_number' => 'NHIF000002',
                'nssf_number' => 'NSSF000002',
                'staff_status' => 'active',
            ]
        );

        $bursarStaff = Staff::firstOrCreate(
            ['user_id' => $bursarUser->id],
            [
                'department_id' => $departments['BUS'] ?? $departments->first(),
                'designation' => 'Bursar',
                'staff_number' => 'TVET/STAFF/003',
                'national_id_number' => '20100003',
                'salary' => 112000,
                'hired_date' => '2023-05-19',
                'employment_type' => 'Permanent',
                'highest_qualification' => 'Bachelor of Commerce',
                'specialization' => 'Finance',
                'kra_pin' => 'A001000003X',
                'nhif_number' => 'NHIF000003',
                'nssf_number' => 'NSSF000003',
                'staff_status' => 'active',
            ]
        );

        $hodStaff = Staff::firstOrCreate(
            ['user_id' => $hodUser->id],
            [
                'department_id' => $departments['ICT'] ?? $departments->first(),
                'designation' => 'Head of Department',
                'staff_number' => 'TVET/STAFF/004',
                'national_id_number' => '20100004',
                'salary' => 120000,
                'hired_date' => '2023-09-18',
                'employment_type' => 'Contract',
                'highest_qualification' => 'Masters in Information Technology',
                'specialization' => 'Networking and Systems',
                'kra_pin' => 'A001000004X',
                'nhif_number' => 'NHIF000004',
                'nssf_number' => 'NSSF000004',
                'staff_status' => 'active',
            ]
        );

        $trainerStaff = Staff::firstOrCreate(
            ['user_id' => $trainerUser->id],
            [
                'department_id' => $departments['ICT'] ?? $departments->first(),
                'designation' => 'Trainer',
                'staff_number' => 'TVET/STAFF/005',
                'national_id_number' => '20100005',
                'salary' => 98000,
                'hired_date' => '2024-01-15',
                'employment_type' => 'Permanent',
                'highest_qualification' => 'Bachelor of Science in Computer Science',
                'specialization' => 'Software Development',
                'kra_pin' => 'A001000005X',
                'nhif_number' => 'NHIF000005',
                'nssf_number' => 'NSSF000005',
                'staff_status' => 'active',
            ]
        );

        $admin->forceFill(['login_id' => 'TVET/STAFF/001'])->save();
        $registrarUser->forceFill(['login_id' => 'TVET/STAFF/002'])->save();
        $bursarUser->forceFill(['login_id' => 'TVET/STAFF/003'])->save();
        $hodUser->forceFill(['login_id' => 'TVET/STAFF/004'])->save();
        $trainerUser->forceFill(['login_id' => 'TVET/STAFF/005'])->save();

        return [
            'admin' => $admin,
            'bursar_user' => $bursarUser,
            'bursar_staff' => $bursarStaff,
            'registrar_user' => $registrarUser,
            'registrar_staff' => $registrarStaff,
            'admin_staff' => $adminStaff,
            'hod_user' => $hodUser,
            'hod_staff' => $hodStaff,
            'trainer_user' => $trainerUser,
            'trainer_staff' => $trainerStaff,
        ];
    }

    protected function userData(
        string $firstName,
        string $lastName,
        string $phoneNumber,
        string $dateOfBirth,
        string $county,
        string $address,
        string $gender,
        string $religion,
        string $password
    ): array {
        return [
            'first_name' => $firstName,
            'last_name' => $lastName,
            'other_name' => '',
            'login_id' => '',
            'phone_number' => $phoneNumber,
            'date_of_birth' => $dateOfBirth,
            'county' => $county,
            'address' => $address,
            'gender' => $gender,
            'religion' => $religion,
            'is_pwd' => false,
            'disability_type' => null,
            'medical_condition' => null,
            'is_active' => 'true',
            'email_verified_at' => now(),
            'password' => $password,
        ];
    }
}
