<?php

namespace Database\Seeders;

use App\Models\AcademicSession;
use App\Models\AcademicSessionEnrollment;
use App\Models\AcademicTimetable;
use App\Models\AcademicYear;
use App\Models\Approval;
use App\Models\CertificationLevel;
use App\Models\Course;
use App\Models\CourseEnrollment;
use App\Models\Curriculum;
use App\Models\CurriculumMapping;
use App\Models\Department;
use App\Models\ExamBody;
use App\Models\FeeAssignment;
use App\Models\FeeComponent;
use App\Models\FeePlan;
use App\Models\FeePlanItem;
use App\Models\Hostel;
use App\Models\HostelAllocation;
use App\Models\HostelBed;
use App\Models\HostelRoom;
use App\Models\LectureRoom;
use App\Models\NextOfKin;
use App\Models\Staff;
use App\Models\Student;
use App\Models\StudentUnitRegistration;
use App\Models\Unit;
use App\Models\User;
use App\Services\BillingService;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Spatie\Permission\Models\Role;

class KenyaTvetDemoSeeder extends Seeder
{
    public function run(): void
    {
        DB::transaction(function () {
            $roles = app(DemoRoleSeeder::class)->seed();
            $examBodies = $this->seedExamBodies();
            $levels = $this->seedCertificationLevels($examBodies);
            $departments = $this->seedDepartments();
            $users = app(DemoStaffSeeder::class)->seed($roles);
            $calendar = app(DemoAcademicCalendarSeeder::class)->seed();
            $versions = $this->seedCurriculums($users['admin']);
            $courses = $this->seedCourses($departments, $levels);
            $mappings = $this->seedCourseMappings($courses, $versions, $users['admin']);
            $this->seedUnitsAndMappings($mappings);
            $lectureRooms = $this->seedLectureRooms($departments);
            $this->seedHostels();
            app(DemoTimetableSeeder::class)->seed($users, $lectureRooms, $mappings, $calendar['active_session']);
            $students = $this->seedStudents($roles['student'], $mappings);
            $feePlans = $this->seedFeePlans($users['bursar_user'], $users['bursar_staff']);
            $this->seedLegacyFeeAssignments($feePlans, $mappings, $calendar['active_year'], $users['bursar_staff']);
            $this->seedModernFeePlanAssignments($feePlans, $versions['active'], $calendar['active_year'], $calendar['active_session'], $users['bursar_user']);
            $sessionEnrollments = $this->seedAcademicSessionEnrollments($students, $calendar['active_session']);
            $this->seedBillingData($sessionEnrollments, $users['bursar_staff'], $feePlans['level4'], $feePlans['level5'], $feePlans['level6']);
            $this->seedHostelAllocations($sessionEnrollments, $users['bursar_staff']);
            $this->seedApprovalsSample($users['bursar_staff']);
        });
    }

    protected function seedRoles(): array
    {
        return [
            'admin' => Role::firstOrCreate(['name' => 'admin', 'guard_name' => 'web']),
            'student' => Role::firstOrCreate(['name' => 'student', 'guard_name' => 'web']),
            'bursar' => Role::firstOrCreate(['name' => 'bursar', 'guard_name' => 'web']),
            'registrar' => Role::firstOrCreate(['name' => 'registrar', 'guard_name' => 'web']),
            'hod' => Role::firstOrCreate(['name' => 'hod', 'guard_name' => 'web']),
        ];
    }

    protected function seedUsersAndStaff(array $roles): array
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

        foreach ([$admin, $registrarUser, $bursarUser, $hodUser] as $user) {
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
                'highest_qualification' => 'Masters in Education Administration',
                'specialization' => 'Institutional Leadership',
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
                'salary' => 98000,
                'hired_date' => '2024-03-04',
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
                'salary' => 110000,
                'hired_date' => '2022-07-11',
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
                'highest_qualification' => 'Bachelor of Science in IT',
                'specialization' => 'Networking and Systems',
                'kra_pin' => 'A001000004X',
                'nhif_number' => 'NHIF000004',
                'nssf_number' => 'NSSF000004',
                'staff_status' => 'active',
            ]
        );

        $admin->forceFill(['login_id' => 'TVET/STAFF/001'])->save();
        $registrarUser->forceFill(['login_id' => 'TVET/STAFF/002'])->save();
        $bursarUser->forceFill(['login_id' => 'TVET/STAFF/003'])->save();
        $hodUser->forceFill(['login_id' => 'TVET/STAFF/004'])->save();

        return [
            'admin' => $admin,
            'bursar_user' => $bursarUser,
            'bursar_staff' => $bursarStaff,
            'registrar_user' => $registrarUser,
            'registrar_staff' => $registrarStaff,
            'admin_staff' => $adminStaff,
            'hod_staff' => $hodStaff,
        ];
    }

    protected function seedExamBodies(): array
    {
        return [
            'cdacc' => ExamBody::firstOrCreate(
                ['code' => 'CDACC'],
                [
                    'name' => 'Curriculum Development, Assessment and Certification Council',
                    'description' => 'Kenyan TVET assessment body for competency based curricula.',
                ]
            ),
            'knec' => ExamBody::firstOrCreate(
                ['code' => 'KNEC'],
                [
                    'name' => 'Kenya National Examinations Council',
                    'description' => 'National examinations and certification body in Kenya.',
                ]
            ),
        ];
    }

    protected function seedCertificationLevels(array $examBodies): array
    {
        return [
            'artisan4' => CertificationLevel::firstOrCreate(
                ['code' => 'ART-L4'],
                [
                    'exam_body_id' => $examBodies['cdacc']->id,
                    'entry_grade' => 'D',
                    'modules' => 3,
                    'duration_in_months' => 12,
                    'name' => 'Artisan Certificate Level 4',
                    'description' => 'Level 4 artisan training aligned to Kenyan TVET CBC pathways.',
                ]
            ),
            'craft5' => CertificationLevel::firstOrCreate(
                ['code' => 'CRT-L5'],
                [
                    'exam_body_id' => $examBodies['cdacc']->id,
                    'entry_grade' => 'D+',
                    'modules' => 5,
                    'duration_in_months' => 20,
                    'name' => 'Craft Certificate Level 5',
                    'description' => 'Level 5 craft certificate for technical and vocational training.',
                ]
            ),
            'diploma6' => CertificationLevel::firstOrCreate(
                ['code' => 'DIP-L6'],
                [
                    'exam_body_id' => $examBodies['knec']->id,
                    'entry_grade' => 'C-',
                    'modules' => 6,
                    'duration_in_months' => 24,
                    'name' => 'Diploma Level 6',
                    'description' => 'Diploma level occupational training for Kenyan TVET institutions.',
                ]
            ),
        ];
    }

    protected function seedDepartments(): array
    {
        return [
            'ict' => Department::firstOrCreate(
                ['code' => 'ICT'],
                [
                    'name' => 'ICT and Informatics',
                    'description' => 'Information communication technology and informatics coursemes.',
                ]
            ),
            'electrical' => Department::firstOrCreate(
                ['code' => 'EEE'],
                [
                    'name' => 'Electrical and Electronics Engineering',
                    'description' => 'Electrical installation, electronics, and renewable energy training.',
                ]
            ),
            'building' => Department::firstOrCreate(
                ['code' => 'BCE'],
                [
                    'name' => 'Building and Civil Engineering',
                    'description' => 'Construction, plumbing, and civil works skills development.',
                ]
            ),
            'hospitality' => Department::firstOrCreate(
                ['code' => 'HIM'],
                [
                    'name' => 'Hospitality and Institutional Management',
                    'description' => 'Hospitality, food production, accommodation, and service operations.',
                ]
            ),
            'business' => Department::firstOrCreate(
                ['code' => 'BUS'],
                [
                    'name' => 'Business and Entrepreneurship',
                    'description' => 'Business management, supply chain, and entrepreneurship coursemes.',
                ]
            ),
        ];
    }

    protected function seedAcademicCalendar(): array
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

    protected function seedCurriculums(User $admin): array
    {
        $cycle2 = Curriculum::firstOrCreate(
            ['name' => 'Cycle 2'],
            [
                'description' => 'Archived TVET cycle for historical cohorts.',
                'start_date' => '2025-01-01',
                'end_date' => '2025-08-31',
                'is_active' => false,
                'created_by' => $admin->id,
                'updated_by' => $admin->id,
            ]
        );

        $cycle3 = Curriculum::firstOrCreate(
            ['name' => 'Cycle 3'],
            [
                'description' => 'Recently completed intake cycle.',
                'start_date' => '2025-09-01',
                'end_date' => '2025-12-20',
                'is_active' => false,
                'created_by' => $admin->id,
                'updated_by' => $admin->id,
            ]
        );

        $cycle4 = Curriculum::firstOrCreate(
            ['name' => 'Cycle 4'],
            [
                'description' => 'Current active TVET courseme version.',
                'start_date' => '2026-01-05',
                'end_date' => null,
                'is_active' => true,
                'created_by' => $admin->id,
                'updated_by' => $admin->id,
            ]
        );

        return [
            'old_1' => $cycle2,
            'old_2' => $cycle3,
            'active' => $cycle4,
        ];
    }

    protected function seedCourses(array $departments, array $levels): array
    {
        return [
            'ict_l4' => Course::firstOrCreate(
                ['code' => 'TVET-ICT-L4'],
                [
                    'name' => 'ICT Technician Level 4',
                    'description' => 'Foundational ICT support, networking, and computer maintenance.',
                    'initials' => 'ICT4',
                    'duration_in_months' => $levels['artisan4']->duration_in_months,
                    'certification_level_id' => $levels['artisan4']->id,
                    'department_id' => $departments['ict']->id,
                ]
            ),
            'electrical_l4' => Course::firstOrCreate(
                ['code' => 'TVET-ELECT-L4'],
                [
                    'name' => 'Electrical Installation Technician Level 4',
                    'description' => 'Domestic and industrial electrical installation training.',
                    'initials' => 'EIT4',
                    'duration_in_months' => $levels['artisan4']->duration_in_months,
                    'certification_level_id' => $levels['artisan4']->id,
                    'department_id' => $departments['electrical']->id,
                ]
            ),
            'plumbing_l4' => Course::firstOrCreate(
                ['code' => 'TVET-PLUMB-L4'],
                [
                    'name' => 'Plumbing Technician Level 4',
                    'description' => 'Water systems, drainage, and sanitation plumbing skills.',
                    'initials' => 'PLB4',
                    'duration_in_months' => $levels['artisan4']->duration_in_months,
                    'certification_level_id' => $levels['artisan4']->id,
                    'department_id' => $departments['building']->id,
                ]
            ),
            'hospitality_l5' => Course::firstOrCreate(
                ['code' => 'TVET-HOSP-L5'],
                [
                    'name' => 'Food and Beverage Production Level 5',
                    'description' => 'Kitchen operations, bakery, service, and hospitality production.',
                    'initials' => 'FBP5',
                    'duration_in_months' => $levels['craft5']->duration_in_months,
                    'certification_level_id' => $levels['craft5']->id,
                    'department_id' => $departments['hospitality']->id,
                ]
            ),
            'supply_chain_l6' => Course::firstOrCreate(
                ['code' => 'TVET-SCM-L6'],
                [
                    'name' => 'Supply Chain Management Level 6',
                    'description' => 'Procurement, stores, inventory, and logistics operations.',
                    'initials' => 'SCM6',
                    'duration_in_months' => $levels['diploma6']->duration_in_months,
                    'certification_level_id' => $levels['diploma6']->id,
                    'department_id' => $departments['business']->id,
                ]
            ),
        ];
    }

    protected function seedCourseMappings(array $courses, array $versions, User $admin): array
    {
        $mappings = [];

        foreach ($courses as $key => $course) {
            $mapping = CurriculumMapping::firstOrCreate(
                [
                    'course_id' => $course->id,
                    'curriculum_id' => $versions['active']->id,
                ],
                [
                    'is_active' => true,
                    'description' => 'Current active mapping for '.$course->name,
                    'created_by' => $admin->id,
                    'updated_by' => $admin->id,
                ]
            );

            $mappings[$key] = $mapping;
        }

        foreach (['ict_l4', 'electrical_l4'] as $legacyKey) {
            CurriculumMapping::firstOrCreate(
                [
                    'course_id' => $courses[$legacyKey]->id,
                    'curriculum_id' => $versions['old_2']->id,
                ],
                [
                    'is_active' => false,
                    'description' => 'Historical archived mapping for reporting.',
                    'created_by' => $admin->id,
                    'updated_by' => $admin->id,
                ]
            );
        }

        return $mappings;
    }

    protected function seedUnitsAndMappings(array $mappings): void
    {
        $unitBlueprints = [
            'COM101' => ['Communication Skills', 3, 45, 'Communication for TVET learners'],
            'ENT101' => ['Entrepreneurship Education', 2, 30, 'Enterprise and self-employment skills'],
            'LFS101' => ['Life Skills Education', 2, 30, 'Personal development and life skills'],
            'ICT101' => ['Computer Essentials', 3, 60, 'Computer operations and office productivity'],
            'ICT102' => ['Computer Repair and Maintenance', 4, 75, 'Troubleshooting and maintenance of computer systems'],
            'ICT103' => ['Web Development Fundamentals', 4, 75, 'HTML, CSS and website development basics'],
            'ICT104' => ['Database Systems', 4, 60, 'Introduction to data handling and relational databases'],
            'ICT105' => ['Networking Essentials', 4, 75, 'LAN setup, routing and basic network support'],
            'ICT106' => ['Industrial Attachment Preparation', 2, 30, 'Work readiness and attachment skills'],
            'ELE101' => ['Engineering Mathematics', 3, 45, 'Math for electrical and technical trades'],
            'ELE102' => ['Workshop Technology', 3, 45, 'Tools, instruments and workshop practice'],
            'ELE103' => ['Electrical Installation Principles', 4, 75, 'Electrical wiring and installation techniques'],
            'ELE104' => ['Solar PV Basics', 4, 60, 'Foundations of solar photovoltaic systems'],
            'ELE105' => ['Electrical Drawing', 3, 45, 'Electrical schematics and interpretation'],
            'ELE106' => ['Motor Control and Protection', 4, 75, 'Motors, starters and electrical protection'],
            'ELE107' => ['Testing and Inspection', 3, 45, 'Testing electrical installations for compliance'],
            'PLB101' => ['Plumbing Tools and Safety', 3, 45, 'Safe use of plumbing tools and workshop safety'],
            'PLB102' => ['Engineering Science for Plumbing', 3, 45, 'Applied science for plumbing practice'],
            'PLB103' => ['Water Supply Systems', 4, 75, 'Design and installation of water systems'],
            'PLB104' => ['Drainage Systems', 4, 75, 'Drainage, waste and vent systems'],
            'PLB105' => ['Welding Basics', 3, 45, 'Joining and fabrication basics'],
            'PLB106' => ['Sanitation Technology', 4, 60, 'Sanitation installations and hygiene systems'],
            'PLB107' => ['Estimating and Costing', 2, 30, 'Material estimation and job costing'],
            'HOS101' => ['Occupational Safety and Hygiene', 2, 30, 'Food safety and workplace hygiene'],
            'HOS102' => ['Food Production Basics', 4, 75, 'Kitchen production skills and practicals'],
            'HOS103' => ['Customer Care', 2, 30, 'Service etiquette and customer handling'],
            'HOS104' => ['Pastry and Bakery', 4, 75, 'Pastry production and bakery operations'],
            'HOS105' => ['Food Service Operations', 4, 60, 'Restaurant and service area operations'],
            'HOS106' => ['Menu Planning and Costing', 3, 45, 'Menu design, costing and kitchen planning'],
            'HOS107' => ['Housekeeping Basics', 3, 45, 'Housekeeping and accommodation support'],
            'BUS101' => ['Business Mathematics', 3, 45, 'Math applications in commerce and logistics'],
            'BUS102' => ['ICT Applications in Business', 3, 45, 'Business software and digital records'],
            'BUS103' => ['Procurement Principles', 4, 60, 'Procurement cycle and sourcing basics'],
            'BUS104' => ['Warehousing Operations', 4, 60, 'Warehouse organization and inventory control'],
            'BUS105' => ['Logistics Management', 4, 60, 'Transport and distribution fundamentals'],
            'BUS106' => ['Storekeeping Practice', 3, 45, 'Store records and stock handling'],
            'BUS107' => ['Customer Relations', 2, 30, 'Professional communication with clients and suppliers'],
        ];

        $moduleMap = [
            'ict_l4' => [
                1 => ['ICT101', 'COM101', 'ENT101'],
                2 => ['ICT103', 'ICT104', 'ICT102'],
                3 => ['ICT105', 'ICT106', 'LFS101'],
            ],
            'electrical_l4' => [
                1 => ['ELE101', 'ELE102', 'COM101'],
                2 => ['ELE103', 'ELE104', 'ELE105'],
                3 => ['ELE106', 'ELE107', 'ENT101'],
            ],
            'plumbing_l4' => [
                1 => ['PLB101', 'PLB102', 'COM101'],
                2 => ['PLB103', 'PLB104', 'PLB105'],
                3 => ['PLB106', 'PLB107', 'ENT101'],
            ],
            'hospitality_l5' => [
                1 => ['HOS102', 'COM101', 'HOS101'],
                2 => ['HOS104', 'HOS105', 'HOS103'],
                3 => ['HOS106', 'HOS107', 'ENT101'],
            ],
            'supply_chain_l6' => [
                1 => ['COM101', 'BUS101', 'BUS102'],
                2 => ['BUS103', 'BUS104', 'ENT101'],
                3 => ['BUS105', 'BUS106', 'BUS107'],
            ],
        ];

        foreach ($moduleMap as $mappingKey => $modules) {
            foreach ($modules as $module => $unitCodes) {
                foreach ($unitCodes as $unitCode) {
                    $blueprint = $unitBlueprints[$unitCode];
                    Unit::firstOrCreate(
                        [
                            'curriculum_mapping_id' => $mappings[$mappingKey]->id,
                            'code' => $unitCode,
                        ],
                        [
                            'name' => $blueprint[0],
                            'credit_factor' => $blueprint[1],
                            'training_hours' => $blueprint[2],
                            'description' => $blueprint[3],
                            'module_taught' => $module,
                        ]
                    );
                }
            }
        }
    }

    protected function seedStudents(Role $studentRole, array $mappings): array
    {
        $students = [];

        $studentRows = [
            [
                'email' => 'mwakiainea98@gmail.com',
                'first_name' => 'Kevin',
                'last_name' => 'Mwangi',
                'phone' => '0710002001',
                'dob' => '2005-04-18',
                'county' => 'Nyeri',
                'address' => 'Kamakwa, Nyeri',
                'gender' => 'male',
                'religion' => 'Christian',
                'admission_number' => 'TVET/2026/ICT/001',
                'previous_school' => 'Kagumo High School',
                'course_key' => 'ict_l4',
            ],
            [
                'email' => 'faith.chebet@student.tvetdemo.ke',
                'first_name' => 'Faith',
                'last_name' => 'Chebet',
                'phone' => '0710002002',
                'dob' => '2004-11-02',
                'county' => 'Uasin Gishu',
                'address' => 'Eldoret, Uasin Gishu',
                'gender' => 'female',
                'religion' => 'Christian',
                'admission_number' => 'TVET/2026/ELE/002',
                'previous_school' => 'Hill School Eldoret',
                'course_key' => 'electrical_l4',
            ],
            [
                'email' => 'brian.otieno@student.tvetdemo.ke',
                'first_name' => 'Brian',
                'last_name' => 'Otieno',
                'phone' => '0710002003',
                'dob' => '2003-08-27',
                'county' => 'Kisumu',
                'address' => 'Manyatta, Kisumu',
                'gender' => 'male',
                'religion' => 'Christian',
                'admission_number' => 'TVET/2026/PLB/003',
                'previous_school' => 'Onjiko Boys High School',
                'course_key' => 'plumbing_l4',
            ],
            [
                'email' => 'sharon.njeri@student.tvetdemo.ke',
                'first_name' => 'Sharon',
                'last_name' => 'Njeri',
                'phone' => '0710002004',
                'dob' => '2004-05-14',
                'county' => 'Kiambu',
                'address' => 'Thika, Kiambu',
                'gender' => 'female',
                'religion' => 'Christian',
                'admission_number' => 'TVET/2026/HOS/004',
                'previous_school' => 'Mary Leakey Girls School',
                'course_key' => 'hospitality_l5',
            ],
            [
                'email' => 'derrick.mutua@student.tvetdemo.ke',
                'first_name' => 'Derrick',
                'last_name' => 'Mutua',
                'phone' => '0710002005',
                'dob' => '2002-12-01',
                'county' => 'Makueni',
                'address' => 'Wote, Makueni',
                'gender' => 'male',
                'religion' => 'Christian',
                'admission_number' => 'TVET/2026/SCM/005',
                'previous_school' => 'Kitondo Secondary School',
                'course_key' => 'supply_chain_l6',
            ],
        ];

        foreach ($studentRows as $row) {
            $user = User::firstOrCreate(
                ['email' => $row['email']],
                [
                    'login_id' => $row['admission_number'],
                    'password' => \Hash::make('Password@123'),
                    'is_active' => true,
                    'email_verified_at' => now(),
                ]
            );
            $user->syncRoles([$studentRole->name]);

            $student = Student::updateOrCreate(
                ['admission_number' => $row['admission_number']],
                [
                    'user_id' => $user->id,
                    'first_name' => $row['first_name'],
                    'last_name' => $row['last_name'],
                    'other_name' => '',
                    'email' => $row['email'],
                    'phone_number' => $row['phone'],
                    'date_of_birth' => $row['dob'],
                    'county' => $row['county'],
                    'address' => $row['address'],
                    'gender' => $row['gender'],
                    'religion' => $row['religion'],
                    'admission_number' => $row['admission_number'],
                    'current_module' => '1',
                    'previous_school' => $row['previous_school'],
                    'fee_discount_percentage' => 0,
                    'enrollment_status' => 'active',
                ]
            );

            NextOfKin::firstOrCreate(
                ['user_id' => $user->id],
                [
                    'first_name' => 'Mary',
                    'last_name' => $row['last_name'],
                    'relationship' => 'Parent',
                    'phone_number' => '0723000000',
                    'alternate_phone_number' => '0733000000',
                    'email' => strtolower($row['last_name']).'.guardian@tvetdemo.ke',
                ]
            );

            $courseEnrollment = CourseEnrollment::firstOrCreate([
                'student_id' => $student->id,
                'curriculum_mapping_id' => $mappings[$row['course_key']]->id,
            ]);

            $students[$row['admission_number']] = [
                'user' => $user,
                'student' => $student,
                'course_enrollment' => $courseEnrollment,
                'mapping' => $mappings[$row['course_key']],
            ];
        }

        return $students;
    }

    protected function seedLectureRooms(array $departments): array
    {
        return [
            'ict_lab_1' => LectureRoom::firstOrCreate(
                ['code' => 'ICT-LAB-1'],
                [
                    'department_id' => $departments['ict']->id,
                    'name' => 'ICT Lab 1',
                    'capacity' => 40,
                    'location' => 'ICT Block Ground Floor',
                    'description' => 'Computer laboratory for software, networking, and common theory sessions.',
                    'is_active' => true,
                ]
            ),
            'business_hall' => LectureRoom::firstOrCreate(
                ['code' => 'BUS-HALL-1'],
                [
                    'department_id' => $departments['business']->id,
                    'name' => 'Business Lecture Hall',
                    'capacity' => 120,
                    'location' => 'Business Block First Floor',
                    'description' => 'Large hall for shared theory classes and departmental forums.',
                    'is_active' => true,
                ]
            ),
            'hospitality_demo' => LectureRoom::firstOrCreate(
                ['code' => 'HOS-DEMO-1'],
                [
                    'department_id' => $departments['hospitality']->id,
                    'name' => 'Hospitality Demonstration Room',
                    'capacity' => 35,
                    'location' => 'Hospitality Wing',
                    'description' => 'Demo room for food production and service practical orientation.',
                    'is_active' => true,
                ]
            ),
        ];
    }

    protected function seedTimetableData(array $users, array $lectureRooms, array $mappings): void
    {
        $ictTrainer = $users['hod_staff'];

        $ictMainUnit = Unit::query()
            ->where('curriculum_mapping_id', $mappings['ict_l4']->id)
            ->where('code', 'ICT101')
            ->first();

        $ictSharedTheoryUnit = Unit::query()
            ->where('curriculum_mapping_id', $mappings['ict_l4']->id)
            ->where('code', 'COM101')
            ->first();

        if (! $ictMainUnit || ! $ictSharedTheoryUnit) {
            return;
        }

        $mondaySession = AcademicTimetable::firstOrCreate(
            [
                'department_id' => $ictTrainer->department_id,
                'trainer_staff_id' => $ictTrainer->id,
                'lecture_room_id' => $lectureRooms['ict_lab_1']->id,
                'day_of_week' => 'monday',
                'start_time' => '08:00:00',
                'end_time' => '10:00:00',
            ],
            [
                'curriculum_unit_id' => $ictMainUnit->id,
                'created_by' => $ictTrainer->id,
                'updated_by' => $ictTrainer->id,
            ]
        );
        $mondaySession->curriculumUnits()->syncWithoutDetaching([
            $ictMainUnit->id,
            $ictSharedTheoryUnit->id,
        ]);

        $wednesdaySession = AcademicTimetable::firstOrCreate(
            [
                'department_id' => $ictTrainer->department_id,
                'trainer_staff_id' => $ictTrainer->id,
                'lecture_room_id' => $lectureRooms['ict_lab_1']->id,
                'day_of_week' => 'wednesday',
                'start_time' => '11:00:00',
                'end_time' => '13:00:00',
            ],
            [
                'curriculum_unit_id' => $ictMainUnit->id,
                'created_by' => $ictTrainer->id,
                'updated_by' => $ictTrainer->id,
            ]
        );
        $wednesdaySession->curriculumUnits()->syncWithoutDetaching([
            $ictMainUnit->id,
        ]);
    }

    protected function seedHostels(): array
    {
        $sunrise = Hostel::firstOrCreate(
            ['code' => 'SUN-HSTL'],
            [
                'name' => 'Sunrise Hostel',
                'session_fee_amount' => 18000,
                'gender' => 'male',
                'location' => 'North Boarding Wing',
                'description' => 'Male hostel serving level 4 and level 5 boarders.',
                'is_active' => true,
            ]
        );

        $sunriseRooms = [
            ['name' => 'Sunrise Block A - Room 1', 'code' => 'SUN-A1', 'floor' => 'Ground Floor', 'bed_count' => 4],
            ['name' => 'Sunrise Block A - Room 2', 'code' => 'SUN-A2', 'floor' => 'Ground Floor', 'bed_count' => 4],
        ];

        foreach ($sunriseRooms as $room) {
            $hostelRoom = HostelRoom::firstOrCreate(
                ['code' => $room['code']],
                [
                    'hostel_id' => $sunrise->id,
                    'name' => $room['name'],
                    'floor' => $room['floor'],
                    'bed_count' => $room['bed_count'],
                    'is_active' => true,
                ]
            );

            $this->seedHostelBeds($hostelRoom, $room['bed_count']);
        }

        $starlight = Hostel::firstOrCreate(
            ['code' => 'STR-HSTL'],
            [
                'name' => 'Starlight Hostel',
                'session_fee_amount' => 19500,
                'gender' => 'female',
                'location' => 'East Boarding Wing',
                'description' => 'Female hostel close to hospitality and business blocks.',
                'is_active' => true,
            ]
        );

        $starlightRooms = [
            ['name' => 'Starlight Block B - Room 1', 'code' => 'STR-B1', 'floor' => 'First Floor', 'bed_count' => 3],
            ['name' => 'Starlight Block B - Room 2', 'code' => 'STR-B2', 'floor' => 'First Floor', 'bed_count' => 3],
        ];

        foreach ($starlightRooms as $room) {
            $hostelRoom = HostelRoom::firstOrCreate(
                ['code' => $room['code']],
                [
                    'hostel_id' => $starlight->id,
                    'name' => $room['name'],
                    'floor' => $room['floor'],
                    'bed_count' => $room['bed_count'],
                    'is_active' => true,
                ]
            );

            $this->seedHostelBeds($hostelRoom, $room['bed_count']);
        }

        return [
            'sunrise' => $sunrise->fresh('rooms.beds'),
            'starlight' => $starlight->fresh('rooms.beds'),
        ];
    }

    protected function seedFeePlans(User $bursarUser, Staff $bursarStaff): array
    {
        $plans = [
            'level4' => [
                'name' => 'TVET Level 4 Day Scholar Plan',
                'version' => '2026.1',
                'items' => [
                    ['name' => 'Tuition Fee', 'amount' => 18000],
                    ['name' => 'Practical Materials', 'amount' => 3500],
                    ['name' => 'Student ID and Administration', 'amount' => 500],
                    ['name' => 'Activity Fee', 'amount' => 2000],
                ],
            ],
            'level5' => [
                'name' => 'TVET Level 5 Hospitality Plan',
                'version' => '2026.1',
                'items' => [
                    ['name' => 'Tuition Fee', 'amount' => 22000],
                    ['name' => 'Kitchen Practical Materials', 'amount' => 6000],
                    ['name' => 'Student ID and Administration', 'amount' => 500],
                    ['name' => 'Activity Fee', 'amount' => 2500],
                ],
            ],
            'level6' => [
                'name' => 'TVET Diploma Day Scholar Plan',
                'version' => '2026.1',
                'items' => [
                    ['name' => 'Tuition Fee', 'amount' => 26000],
                    ['name' => 'Logistics Lab and Fieldwork', 'amount' => 4500],
                    ['name' => 'Student ID and Administration', 'amount' => 500],
                    ['name' => 'Activity Fee', 'amount' => 2500],
                ],
            ],
        ];

        $created = [];

        foreach ($plans as $key => $planData) {
            $plan = FeePlan::firstOrCreate(
                ['name' => $planData['name']],
                [
                    'plan_type' => 'original',
                    'status' => 'published',
                    'version' => $planData['version'],
                    'is_active' => true,
                    'approval_status' => 'approved',
                    'created_by' => $bursarUser->id,
                    'approved_by' => $bursarStaff->id,
                    'approved_at' => now(),
                ]
            );

            foreach ($planData['items'] as $index => $item) {
                FeePlanItem::firstOrCreate(
                    ['fee_plan_id' => $plan->id, 'name' => $item['name']],
                    ['amount' => $item['amount']]
                );

                FeeComponent::firstOrCreate(
                    ['fee_plan_id' => $plan->id, 'name' => $item['name']],
                    [
                        'amount' => $item['amount'],
                        'is_optional' => false,
                        'display_order' => $index + 1,
                    ]
                );
            }

            $created[$key] = $plan;
        }

        return $created;
    }

    protected function seedLegacyFeeAssignments(array $feePlans, array $mappings, AcademicYear $activeYear, Staff $bursarStaff): void
    {
        $mappingToPlan = [
            'ict_l4' => $feePlans['level4'],
            'electrical_l4' => $feePlans['level4'],
            'plumbing_l4' => $feePlans['level4'],
            'hospitality_l5' => $feePlans['level5'],
            'supply_chain_l6' => $feePlans['level6'],
        ];

        foreach ($mappingToPlan as $mappingKey => $plan) {
            FeeAssignment::updateOrCreate(
                [
                    'academic_year_id' => $activeYear->id,
                    'curriculum_mapping_id' => $mappings[$mappingKey]->id,
                    'year_of_study' => 1,
                    'session_number' => 1,
                ],
                [
                    'fee_plan_id' => $plan->id,
                    'created_by' => $bursarStaff->id,
                    'valid_from' => '2026-01-05',
                    'valid_to' => null,
                    'is_active' => true,
                    'approval_status' => 'approved',
                    'approved_by' => $bursarStaff->id,
                    'approved_at' => now(),
                ]
            );
        }
    }

    protected function seedModernFeePlanAssignments(array $feePlans, Curriculum $activeVersion, AcademicYear $activeYear, AcademicSession $activeSession, User $bursarUser): void
    {
        $plan = $feePlans['level4'];
        $components = $plan->feeComponents()->orderBy('display_order')->get();

        DB::table('fee_plan_assignments')->insertOrIgnore([
            'id' => (string) Str::uuid(),
            'fee_plan_id' => $plan->id,
            'curriculum_id' => $activeVersion->id,
            'academic_year_id' => $activeYear->id,
            'session_id' => $activeSession->id,
            'plan_type_context' => 'original',
            'revises_assignment_id' => null,
            'amount_snapshot' => json_encode([
                'total' => (float) $components->sum('amount'),
                'components' => $components->map(fn (FeeComponent $component) => [
                    'name' => $component->name,
                    'amount' => (float) $component->amount,
                ])->values()->all(),
            ]),
            'assigned_by' => $bursarUser->id,
            'assigned_at' => now(),
            'status' => 'active',
            'cancellation_reason' => null,
            'cancelled_by' => null,
            'cancelled_at' => null,
            'created_at' => now(),
            'updated_at' => now(),
            'deleted_at' => null,
        ]);
    }

    protected function seedAcademicSessionEnrollments(array $students, AcademicSession $activeSession): array
    {
        $enrollments = [];

        foreach ($students as $registration => $record) {
            $enrollment = AcademicSessionEnrollment::firstOrCreate(
                [
                    'course_enrollment_id' => $record['course_enrollment']->id,
                    'academic_session_id' => $activeSession->id,
                ],
                [
                    'module' => 1,
                    'year_of_study' => 1,
                    'session_number' => 1,
                    'status' => 'active',
                ]
            );

            // Create unit registrations for module 1
            $units = Unit::query()
                ->where('curriculum_mapping_id', $record['mapping']->id)
                ->where('module_taught', 1)
                ->get();

            foreach ($units as $unit) {
                StudentUnitRegistration::firstOrCreate([
                    'academic_session_enrollment_id' => $enrollment->id,
                    'curriculum_unit_id' => $unit->id,
                ]);
            }

            $enrollments[$registration] = $enrollment->fresh(['academicSession', 'courseEnrollment.curriculumMapping.course', 'courseEnrollment.curriculumMapping.curriculum']);
        }

        return $enrollments;
    }

    protected function seedBillingData(array $sessionEnrollments, Staff $bursarStaff, FeePlan $level4, FeePlan $level5, FeePlan $level6): void
    {
        /** @var BillingService $billing */
        $billing = app(BillingService::class);

        foreach ($sessionEnrollments as $registration => $enrollment) {
            $billing->createInvoiceForEnrollment(
                $enrollment,
                $bursarStaff->id,
                '2026-01-10',
                '2026-02-10'
            );
        }

        $kevinInvoice = $this->invoiceFor($sessionEnrollments['TVET/2026/ICT/001']->id);
        $faithInvoice = $this->invoiceFor($sessionEnrollments['TVET/2026/ELE/002']->id);
        $brianInvoice = $this->invoiceFor($sessionEnrollments['TVET/2026/PLB/003']->id);
        $sharonInvoice = $this->invoiceFor($sessionEnrollments['TVET/2026/HOS/004']->id);
        $derrickInvoice = $this->invoiceFor($sessionEnrollments['TVET/2026/SCM/005']->id);

        $billing->recordPayment($kevinInvoice, 12000, 'M-Pesa', $bursarStaff->id, 'QK34M8P1', '2026-01-15');
        $billing->recordPayment($faithInvoice, 8000, 'Bank', $bursarStaff->id, 'KCB/TVET/0091', '2026-01-18');
        $billing->recordPayment($derrickInvoice, (float) $derrickInvoice->amount_due + 1500, 'M-Pesa', $bursarStaff->id, 'QK89N1D7', '2026-01-20');

        $billing->applyAdjustment($faithInvoice, 'bursary', 5000, $bursarStaff->id, 'County bursary support posted.', '2026-01-19');
        $billing->applyAdjustment($sharonInvoice, 'helb', 7000, $bursarStaff->id, 'HELB TVET support received.', '2026-01-22');
        $billing->applyAdjustment($brianInvoice, 'penalty', 1500, $bursarStaff->id, 'Late registration penalty.', '2026-01-25');
        $billing->applyAdjustment(
            $derrickInvoice,
            'refund',
            1500,
            $bursarStaff->id,
            'Cash refund issued after final overpayment reconciliation.',
            '2026-02-01'
        );
        $billing->applyAdjustment(
            $faithInvoice,
            'reversal',
            1500,
            $bursarStaff->id,
            'Reversal of duplicated manual charge.',
            '2026-02-03'
        );
    }

    protected function seedHostelAllocations(array $sessionEnrollments, Staff $bursarStaff): void
    {
        /** @var BillingService $billing */
        $billing = app(BillingService::class);

        $kevinEnrollment = $sessionEnrollments['TVET/2026/ICT/001'] ?? null;
        $sharonEnrollment = $sessionEnrollments['TVET/2026/HOS/004'] ?? null;

        if ($kevinEnrollment) {
            $room = HostelRoom::query()->where('code', 'SUN-A1')->first();
            $bed = HostelBed::query()->where('hostel_room_id', $room?->id)->where('bed_number', 1)->first();

            if ($room && $bed) {
                $invoice = $billing->createManualInvoice(
                    $kevinEnrollment,
                    18000,
                    $bursarStaff->id,
                    'Hostel accommodation - Sunrise Hostel - Sunrise Block A - Room 1 - SUN-A1-BED-01',
                    '2026-01-10',
                    '2026-01-10',
                    BillingService::NOTE_HOSTEL,
                    'seed-hostel-invoice-'.$kevinEnrollment->id,
                    'hostel'
                );
                $billing->recordPayment($invoice, 18000, 'M-Pesa', $bursarStaff->id, 'HOSTEL-KEVIN-001', '2026-01-11');

                HostelAllocation::updateOrCreate(
                    [
                        'academic_session_enrollment_id' => $kevinEnrollment->id,
                        'academic_session_id' => $kevinEnrollment->academic_session_id,
                    ],
                    [
                        'student_id' => $kevinEnrollment->student_id,
                        'hostel_id' => $room->hostel_id,
                        'hostel_room_id' => $room->id,
                        'hostel_bed_id' => $bed->id,
                        'student_invoice_id' => $invoice->id,
                        'hostel_fee_amount' => 18000,
                        'allocated_on' => '2026-01-12',
                        'status' => 'active',
                        'notes' => 'Demo boarding allocation after confirmed full hostel payment.',
                        'created_by' => $bursarStaff->id,
                        'updated_by' => $bursarStaff->id,
                    ]
                );
            }
        }

        if ($sharonEnrollment) {
            $room = HostelRoom::query()->where('code', 'STR-B1')->first();
            $bed = HostelBed::query()->where('hostel_room_id', $room?->id)->where('bed_number', 1)->first();

            if ($room && $bed) {
                $invoice = $billing->createManualInvoice(
                    $sharonEnrollment,
                    19500,
                    $bursarStaff->id,
                    'Hostel accommodation - Starlight Hostel - Starlight Block B - Room 1 - STR-B1-BED-01',
                    '2026-01-12',
                    '2026-01-12',
                    BillingService::NOTE_HOSTEL,
                    'seed-hostel-invoice-'.$sharonEnrollment->id,
                    'hostel'
                );
                $billing->recordPayment($invoice, 19500, 'Bank', $bursarStaff->id, 'HOSTEL-SHARON-001', '2026-01-13');

                HostelAllocation::updateOrCreate(
                    [
                        'academic_session_enrollment_id' => $sharonEnrollment->id,
                        'academic_session_id' => $sharonEnrollment->academic_session_id,
                    ],
                    [
                        'student_id' => $sharonEnrollment->student_id,
                        'hostel_id' => $room->hostel_id,
                        'hostel_room_id' => $room->id,
                        'hostel_bed_id' => $bed->id,
                        'student_invoice_id' => $invoice->id,
                        'hostel_fee_amount' => 19500,
                        'allocated_on' => '2026-01-14',
                        'status' => 'active',
                        'notes' => 'Demo hostel allocation after confirmed full hostel payment.',
                        'created_by' => $bursarStaff->id,
                        'updated_by' => $bursarStaff->id,
                    ]
                );
            }
        }
    }

    protected function seedApprovalsSample(Staff $bursarStaff): void
    {
        Approval::firstOrCreate(
            [
                'approvable_type' => 'App\\Models\\StudentInvoice',
                'approvable_id' => 1,
                'type' => 'invoice_write_off',
            ],
            [
                'status' => 'pending',
                'notes' => 'Sample write-off request awaiting admin review.',
                'requested_by' => $bursarStaff->id,
                'approved_by' => null,
                'approved_at' => null,
            ]
        );
    }

    protected function invoiceFor(int $enrollmentId)
    {
        return \App\Models\StudentInvoice::query()
            ->where('enrollment_id', $enrollmentId)
            ->latest()
            ->firstOrFail();
    }

    protected function userData(
        string $firstName,
        string $lastName,
        string $phone,
        string $dob,
        string $county,
        string $address,
        string $gender,
        string $religion,
        string $password
    ): array {
        return [
            'is_active' => true,
            'email_verified_at' => now(),
            'password' => $password,
        ];
    }

    protected function seedHostelBeds(HostelRoom $room, int $bedCount): void
    {
        for ($bedNumber = 1; $bedNumber <= $bedCount; $bedNumber++) {
            HostelBed::firstOrCreate(
                [
                    'hostel_room_id' => $room->id,
                    'bed_number' => $bedNumber,
                ],
                [
                    'label' => $room->code.'-BED-'.str_pad((string) $bedNumber, 2, '0', STR_PAD_LEFT),
                    'is_active' => true,
                ]
            );
        }
    }
}
