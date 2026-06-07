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
        $staffData = [
            [
                'email' => 'admin@tvetdemo.ke',
                'first_name' => 'Martin',
                'last_name' => 'Njoroge',
                'staff_number' => 'TVET/STAFF/001',
                'phone' => '0701001001',
                'dob' => '1988-06-14',
                'county' => 'Nairobi',
                'address' => 'Westlands, Nairobi',
                'gender' => 'male',
                'religion' => 'Catholic',
                'role' => $roles['admin']->name,
                'designation' => 'Principal',
                'national_id' => '20100001',
                'salary' => 145000,
                'hired_date' => '2023-01-10',
                'dept_code' => 'BUS',
            ],
            [
                'email' => 'registrar@tvetdemo.ke',
                'first_name' => 'Linet',
                'last_name' => 'Wambui',
                'staff_number' => 'TVET/STAFF/002',
                'phone' => '0701001002',
                'dob' => '1991-02-11',
                'county' => 'Kiambu',
                'address' => 'Ruiru, Kiambu',
                'gender' => 'female',
                'religion' => 'Christian',
                'role' => $roles['registrar']->name,
                'designation' => 'Registrar',
                'national_id' => '20100002',
                'salary' => 118000,
                'hired_date' => '2023-03-14',
                'dept_code' => 'BUS',
            ],
            [
                'email' => 'bursar@tvetdemo.ke',
                'first_name' => 'Peter',
                'last_name' => 'Mutiso',
                'staff_number' => 'TVET/STAFF/003',
                'phone' => '0701001003',
                'dob' => '1986-09-03',
                'county' => 'Machakos',
                'address' => 'Machakos Town',
                'gender' => 'male',
                'religion' => 'Christian',
                'role' => $roles['bursar']->name,
                'designation' => 'Bursar',
                'national_id' => '20100003',
                'salary' => 112000,
                'hired_date' => '2023-05-19',
                'dept_code' => 'BUS',
            ],
            [
                'email' => 'hod.ict@tvetdemo.ke',
                'first_name' => 'Mercy',
                'last_name' => 'Achieng',
                'staff_number' => 'TVET/STAFF/004',
                'phone' => '0701001004',
                'dob' => '1989-12-21',
                'county' => 'Kisumu',
                'address' => 'Milimani, Kisumu',
                'gender' => 'female',
                'religion' => 'Christian',
                'role' => $roles['hod']->name,
                'designation' => 'Head of Department',
                'national_id' => '20100004',
                'salary' => 120000,
                'hired_date' => '2023-09-18',
                'dept_code' => 'ICT',
            ],
            [
                'email' => 'trainer.ict@tvetdemo.ke',
                'first_name' => 'Brian',
                'last_name' => 'Otieno',
                'staff_number' => 'TVET/STAFF/005',
                'phone' => '0701001005',
                'dob' => '1992-04-10',
                'county' => 'Kisumu',
                'address' => 'Migosi, Kisumu',
                'gender' => 'male',
                'religion' => 'Christian',
                'role' => $roles['trainer']->name,
                'designation' => 'Trainer',
                'national_id' => '20100005',
                'salary' => 98000,
                'hired_date' => '2024-01-15',
                'dept_code' => 'ICT',
            ],
        ];

        $results = [];
        $departments = Department::pluck('id', 'code');

        foreach ($staffData as $data) {
            $user = User::updateOrCreate(
                ['email' => $data['email']],
                [
                    'login_id' => $data['staff_number'],
                    'password' => \Hash::make('Password@123'),
                    'is_active' => true,
                    'email_verified_at' => now(),
                ]
            );
            $user->syncRoles([$data['role']]);

            $staff = Staff::updateOrCreate(
                ['user_id' => $user->id],
                [
                    'first_name' => $data['first_name'],
                    'last_name' => $data['last_name'],
                    'other_name' => '',
                    'email' => $data['email'],
                    'phone_number' => $data['phone'],
                    'date_of_birth' => $data['dob'],
                    'county' => $data['county'],
                    'address' => $data['address'],
                    'gender' => $data['gender'],
                    'religion' => $data['religion'],
                    'department_id' => $departments[$data['dept_code']] ?? $departments->first(),
                    'designation' => $data['designation'],
                    'staff_number' => $data['staff_number'],
                    'national_id_number' => $data['national_id'],
                    'salary' => $data['salary'],
                    'hired_date' => $data['hired_date'],
                    'employment_type' => 'Permanent',
                    'staff_status' => 'active',
                    'kra_pin' => 'A' . rand(100000000, 999999999) . 'X',
                    'nhif_number' => rand(10000000, 99999999),
                    'nssf_number' => rand(10000000, 99999999),
                ]
            );

            NextOfKin::firstOrCreate(
                ['user_id' => $user->id],
                [
                    'first_name' => 'Grace',
                    'last_name' => $user->staff->last_name,
                    'relationship' => 'Sibling',
                    'phone_number' => '0712000000',
                    'alternate_phone_number' => '0722000000',
                    'email' => strtolower($user->staff->last_name).'.kin@tvetdemo.ke',
                ]
            );

            $results[strtolower($data['designation'])] = $staff;
            $results[strtolower($data['designation']) . '_user'] = $user;
        }

        return [
            'admin' => $results['principal_user'],
            'bursar_user' => $results['bursar_user'],
            'bursar_staff' => $results['bursar'],
            'registrar_user' => $results['registrar_user'],
            'registrar_staff' => $results['registrar'],
            'admin_staff' => $results['principal'],
            'hod_user' => $results['head of department_user'],
            'hod_staff' => $results['head of department'],
            'trainer_user' => $results['trainer_user'],
            'trainer_staff' => $results['trainer'],
        ];
    }

    protected function userData(
        string $firstName,
        string $lastName,
        string $loginId,
        string $phoneNumber,
        string $dateOfBirth,
        string $county,
        string $address,
        string $gender,
        string $religion,
        string $password
    ): array {
        return [
            'login_id' => $loginId,
            'is_active' => true,
            'email_verified_at' => now(),
            'password' => $password,
        ];
    }
}
