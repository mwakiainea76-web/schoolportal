<?php

namespace Database\Seeders;

use App\Models\AcademicSession;
use App\Models\AcademicYear;
use Illuminate\Database\Seeder;

class DemoAcademicCalendarSeeder extends Seeder
{
    public function seed(): array
    {
        $previousYear = AcademicYear::firstOrCreate(
            ['label' => '2025/2026'],
            [
                'academic_year' => '2025/2026',
                'start_date' => '2025-01-06',
                'end_date' => '2025-12-05',
                'is_active' => false,
            ]
        );

        $activeYear = AcademicYear::firstOrCreate(
            ['label' => '2026/2027'],
            [
                'academic_year' => '2026/2027',
                'start_date' => '2026-01-05',
                'end_date' => null,
                'is_active' => true,
            ]
        );

        foreach ([
            ['year' => $previousYear, 'no' => 1, 'label' => 'January-April 2025', 'start' => '2025-01-06', 'end' => '2025-04-18', 'active' => false],
            ['year' => $previousYear, 'no' => 2, 'label' => 'May-August 2025', 'start' => '2025-05-05', 'end' => '2025-08-22', 'active' => false],
            ['year' => $previousYear, 'no' => 3, 'label' => 'September-December 2025', 'start' => '2025-09-01', 'end' => '2025-12-05', 'active' => false],
        ] as $row) {
            AcademicSession::firstOrCreate(
                ['academic_year_id' => $row['year']->id, 'session_number' => $row['no']],
                [
                    'session_No' => $row['no'],
                    'label' => $row['label'],
                    'start_date' => $row['start'],
                    'end_date' => $row['end'],
                    'is_active' => $row['active'],
                ]
            );
        }

        $activeSession = null;
        foreach ([
            ['no' => 1, 'label' => 'January-April 2026', 'start' => '2026-01-05', 'end' => null, 'active' => true],
            ['no' => 2, 'label' => 'May-August 2026', 'start' => null, 'end' => null, 'active' => false],
            ['no' => 3, 'label' => 'September-December 2026', 'start' => null, 'end' => null, 'active' => false],
        ] as $row) {
            $session = AcademicSession::firstOrCreate(
                ['academic_year_id' => $activeYear->id, 'session_number' => $row['no']],
                [
                    'session_No' => $row['no'],
                    'label' => $row['label'],
                    'start_date' => $row['start'],
                    'end_date' => $row['end'],
                    'is_active' => $row['active'],
                ]
            );

            if ($row['active']) {
                $activeSession = $session;
            }
        }

        return [
            'previous_year' => $previousYear,
            'active_year' => $activeYear,
            'active_session' => $activeSession,
        ];
    }
}
