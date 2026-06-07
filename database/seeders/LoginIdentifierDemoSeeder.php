<?php

namespace Database\Seeders;

use App\Models\Staff;
use App\Models\Student;
use App\Models\User;
use Illuminate\Database\Seeder;

class LoginIdentifierDemoSeeder extends Seeder
{
    public function run(): void
    {
        User::query()
            ->whereHas('staff')
            ->with('staff')
            ->get()
            ->each(function (User $user): void {
                $staffNumber = trim((string) $user->staff?->staff_number);

                if ($staffNumber !== '') {
                    $user->forceFill(['login_id' => $staffNumber])->save();
                }
            });

        User::query()
            ->whereHas('student')
            ->with('student')
            ->get()
            ->each(function (User $user): void {
                $admissionNumber = trim((string) $user->student?->admission_number);

                if ($admissionNumber !== '') {
                    $user->forceFill(['login_id' => $admissionNumber])->save();
                }
            });

        if ($this->command) {
            $staffExamples = Staff::query()
                ->with('user')
                ->whereHas('user', fn ($query) => $query->whereNotNull('login_id'))
                ->orderBy('staff_number')
                ->limit(3)
                ->get();

            $studentExamples = Student::query()
                ->with('user')
                ->whereHas('user', fn ($query) => $query->whereNotNull('login_id'))
                ->orderBy('admission_number')
                ->limit(3)
                ->get();

            $this->command->info('Login identifier demo accounts ready:');

            foreach ($staffExamples as $staff) {
                $this->command->line(sprintf(
                    'STAFF  | %s | password: %s',
                    $staff->staff_number,
                    'Password@123'
                ));
            }

            foreach ($studentExamples as $student) {
                $this->command->line(sprintf(
                    'STUDENT| %s | password: %s',
                    $student->admission_number,
                    'Password@123'
                ));
            }
        }
    }
}
