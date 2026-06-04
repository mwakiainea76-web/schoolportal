import {
    ArrowRightLeft,
    BarChart3,
    BookMarked,
    BookOpen,
    Building2,
    CalendarClock,
    GraduationCap,
    Landmark,
    LayoutDashboard,
    LayoutGrid,
    School,
    Settings,
    ShieldCheck,
    UserCog,
    UserRound,
    UsersRound,
    Wallet,
} from "lucide-react";

export const STAFF_NAV_ITEMS = [
    {
        key: "reports",
        label: "Analytics & Reports",
        icon: "reports",
        basePath: "/reports",
        permissions: ["students.view"],
        children: [
            {
                routeName: "reports.executive",
                fallback: "/reports/executive",
                label: "Executive Reports",
                permission: "students.view",
            },
 
        ],
    },
    {
        key: "academic-setup",
        label: "Academic Setup",
        icon: "academicSetup",
        basePath: "/courses",
        permissions: [
            "departments.view",
            "departments.create",
            "exam.bodies.view",
            "exam.bodies.create",
            "certification.levels.view",
            "certification.levels.create",
            "courses.view",
            "courses.create",
            "course-versions.view",
            "course-versions.create",
            "courses.course-version-mappings.view",
            "courses.course-version-mappings.create",
            "units.view",
            "units.create",
            "units.course-version-units.view",
            "units.course-version-units.create",
            "students.view",
        ],
        children: [
            {
                key: "institution-structure",
                label: "Institution Structure",
                icon: "department",
                children: [
                    {
                        routeName: "departments.index",
                        fallback: "/departments",
                        label: "Departments",
                        permission: "departments.view",
                    },
                    {
                        routeName: "departments.create",
                        fallback: "/departments/create",
                        label: "Add Department",
                        permission: "departments.create",
                    },
                ],
            },
            {
                key: "course-catalog",
                label: "Course Catalog",
                icon: "courses",
                children: [
                    {
                        routeName: "course-versions.index",
                        fallback: "/course-versions",
                        label: "Course Versions",
                        permission: "course-versions.view",
                    },
                    {
                        routeName: "course-versions.create",
                        fallback: "/course-versions/create",
                        label: "Add Course Version",
                        permission: "course-versions.create",
                    },
                    {
                        routeName: "courses.index",
                        fallback: "/courses",
                        label: "Courses",
                        permission: "courses.view",
                    },
                    {
                        routeName: "courses.create",
                        fallback: "/courses/create",
                        label: "Add Course",
                        permission: "courses.create",
                    },
                    {
                        routeName: "courses.course-version-mappings.index",
                        fallback: "/courses/course-versions",
                        label: "Course Version Mapping",
                        permission: "courses.course-version-mappings.view",
                    },
                    {
                        routeName: "courses.course-version-mappings.create",
                        fallback: "/courses/course-versions/create",
                        label: "Add Course Version Mapping",
                        permission: "courses.course-version-mappings.create",
                    },
                    {
                        routeName: "courses.enrollments.index",
                        fallback: "/courses/enrollments",
                        label: "Course Enrollments",
                        permission: "students.view",
                    },
                ],
            },
            {
                key: "unit-catalog",
                label: "Unit Catalog",
                icon: "grid",
                children: [
                    {
                        routeName: "units.index",
                        fallback: "/units",
                        label: "Units",
                        permission: "units.view",
                    },
                    {
                        routeName: "units.create",
                        fallback: "/units/create",
                        label: "Add Unit",
                        permission: "units.create",
                    },
                    {
                        routeName: "units.course-version-units.index",
                        fallback: "/units/course-version-units",
                        label: "Course Version Units",
                        permission: "units.course-version-units.view",
                    },
                    {
                        routeName: "units.course-version-units.create",
                        fallback: "/units/course-version-units/create",
                        label: "Add Course Version Unit",
                        permission: "units.course-version-units.create",
                    },
                ],
            },
            {
                key: "exams-certifications",
                label: "Exams & Certifications",
                icon: "book",
                children: [
                    {
                        routeName: "exam.bodies.index",
                        fallback: "/exam-bodies",
                        label: "Exam Bodies",
                        permission: "exam.bodies.view",
                    },
                    {
                        routeName: "exam.bodies.create",
                        fallback: "/exam-bodies/create",
                        label: "Add Exam Body",
                        permission: "exam.bodies.create",
                    },
                    {
                        routeName: "certification-levels.index",
                        fallback: "/exam-bodies/certification-levels",
                        label: "Certification Levels",
                        permission: "certification.levels.view",
                    },
                    {
                        routeName: "certification-levels.create",
                        fallback: "/exam-bodies/certification-levels/create",
                        label: "Add Certification Level",
                        permission: "certification.levels.create",
                    },
                ],
            },
        ],
    },
    {
        key: "academic-operations",
        label: "Academic Operations",
        icon: "academicOps",
        basePath: "/academic",
        permissions: [
            "academic.years.view",
            "academic.years.create",
            "academic.sessions.view",
            "academic.sessions.create",
            "students.view",
        ],
        children: [
            {
                key: "calendar",
                label: "Academic Calendar",
                icon: "academic",
                children: [
                    {
                        routeName: "academic.years.index",
                        fallback: "/academic/years",
                        label: "Academic Years",
                        permission: "academic.years.view",
                    },
                    {
                        routeName: "academic.years.create",
                        fallback: "/academic/years/create",
                        label: "Add Academic Year",
                        permission: "academic.years.create",
                    },
                    {
                        routeName: "academic.sessions.index",
                        fallback: "/academic/sessions",
                        label: "Academic Sessions",
                        permission: "academic.sessions.view",
                    },
                    {
                        routeName: "academic.sessions.create",
                        fallback: "/academic/sessions/create",
                        label: "Add Academic Session",
                        permission: "academic.sessions.create",
                    },
                ],
            },
            {
                key: "class-planning",
                label: "Class Planning",
                icon: "academicOps",
                children: [
                    {
                        routeName: "academic.timetables.index",
                        fallback: "/academic/timetables",
                        label: "Class Timetable",
                        permission: "academic.sessions.view",
                    },
                    {
                        routeName: "academic.timetables.create",
                        fallback: "/academic/timetables/create",
                        label: "Add Timetable Session",
                        permission: "academic.sessions.create",
                    },
                    {
                        routeName: "academic.timetables.hod.create",
                        fallback: "/academic/timetables/create/hod",
                        label: "Add HOD Timetable",
                        permission: "academic.sessions.create",
                    },
                    {
                        routeName: "lecture-rooms.index",
                        fallback: "/lecture-rooms",
                        label: "Lecture Rooms",
                        permission: "academic.sessions.view",
                    },
                    {
                        routeName: "lecture-rooms.create",
                        fallback: "/lecture-rooms/create",
                        label: "Add Lecture Room",
                        permission: "academic.sessions.create",
                    },
                    {
                        routeName: "academic.sessions.enrollments.index",
                        fallback: "/academic/sessions/enrollments",
                        label: "Session Enrollments",
                        permission: "students.view",
                    },
                    {
                        routeName: "academic.sessions.enrollments.create",
                        fallback: "/academic/sessions/enrollments/create",
                        label: "Add Session Enrollment",
                        permission: "students.view",
                    },
                ],
            },
        ],
    },
    {
        key: "student-management",
        label: "Student Management",
        icon: "students",
        basePath: "/students",
        permissions: ["students.view", "students.create"],
        children: [
            {
                key: "student-records",
                label: "Student Records",
                icon: "students",
                children: [
                    {
                        routeName: "students.index",
                        fallback: "/students",
                        label: "Student List",
                        permission: "students.view",
                    },
                    {
                        routeName: "students.create",
                        fallback: "/students/create",
                        label: "Add Student",
                        permission: "students.create",
                    },
                ],
            },
            {
                key: "student-transfers",
                label: "Transfers",
                icon: "transfer",
                children: [
                    {
                        routeName: "students.course-change.index",
                        fallback: "/students/course-change",
                        label: "Course Transfer",
                        permission: "students.view",
                    },
                ],
            },
            {
                key: "student-residence",
                label: "Residence",
                icon: "users",
                children: [
                    {
                        routeName: "hostels.index",
                        fallback: "/hostels",
                        label: "Hostels",
                        permission: "students.view",
                    },
                    {
                        routeName: "hostels.create",
                        fallback: "/hostels/create",
                        label: "Add Hostel",
                        permission: "students.view",
                    },
                    {
                        routeName: "hostel-allocations.index",
                        fallback: "/hostel-allocations",
                        label: "Hostel Allocations",
                        permission: "students.view",
                    },
                    {
                        routeName: "hostel-allocations.create",
                        fallback: "/hostel-allocations/create",
                        label: "Add Hostel Allocation",
                        permission: "students.view",
                    },
                ],
            },
        ],
    },
    {
        key: "finance-billing",
        label: "Finance & Billing",
        icon: "financeBilling",
        basePath: "/fees",
        permissions: ["students.view", "fees.create", "billing.ledger.view"],
        children: [
            {
                key: "fee-setup",
                label: "Fee Setup",
                icon: "finance",
                children: [
                    {
                        routeName: "fees.plans.index",
                        fallback: "/fees/plans",
                        label: "Fee Plans",
                        permission: "students.view",
                    },
                    {
                        routeName: "fees.plans.create",
                        fallback: "/fees/plans/create",
                        label: "Add Fee Plan",
                        permission: "fees.create",
                    },
                    {
                        routeName: "fees.plans.items.index",
                        fallback: "/fees/plans/items",
                        label: "Fee Plan Items",
                        permission: "students.view",
                    },
                    {
                        routeName: "fees.plans.items.create",
                        fallback: "/fees/plans/items/create",
                        label: "Add Fee Plan Item",
                        permission: "fees.create",
                    },
                    {
                        routeName: "fees.assignments.index",
                        fallback: "/fees/assignments",
                        label: "Fee Assignments",
                        permission: "students.view",
                    },
                    {
                        routeName: "fees.assignments.create",
                        fallback: "/fees/assignments/create",
                        label: "Add Fee Assignment",
                        permission: "fees.create",
                    },
                ],
            },
            {
                key: "billing-operations",
                label: "Billing Operations",
                icon: "financeBilling",
                children: [
                    {
                        routeName: "billing.invoices.index",
                        fallback: "/billing/invoices",
                        label: "Invoices",
                        permission: "students.view",
                    },
                    {
                        routeName: "billing.invoices.create",
                        fallback: "/billing/invoices/create",
                        label: "Add Invoice",
                        permission: "students.view",
                    },
                    {
                        routeName: "billing.manual.index",
                        fallback: "/billing/manual-operations",
                        label: "Manual Billing",
                        permission: "students.view",
                    },
                    {
                        routeName: "billing.manual.invoices.create",
                        fallback: "/billing/manual-operations/additional-invoice",
                        label: "Add Additional Invoice",
                        permission: "students.view",
                    },
                    {
                        routeName: "billing.manual.payments.create",
                        fallback: "/billing/manual-operations/record-payment",
                        label: "Add Payment",
                        permission: "students.view",
                    },
                    {
                        routeName: "billing.manual.penalties.create",
                        fallback: "/billing/manual-operations/post-penalty",
                        label: "Add Penalty",
                        permission: "students.view",
                    },
                    {
                        routeName: "billing.manual.adjustments.create",
                        fallback: "/billing/manual-operations/apply-adjustment",
                        label: "Add Adjustment",
                        permission: "students.view",
                    },
                    {
                        routeName: "billing.ledger.index",
                        fallback: "/billing/ledger",
                        label: "Financial Ledger",
                        permission: "billing.ledger.view",
                    },
                ],
            },
        ],
    },
    {
        key: "staff-access",
        label: "Staff & Access",
        icon: "staffAccess",
        basePath: "/staffs",
        permissions: [
            "staffs.view",
            "staffs.create",
            "roles.view",
            "roles.create",
            "permissions.view",
            "permissions.create",
        ],
        children: [
            {
                key: "staff-records",
                label: "Staff Records",
                icon: "staff",
                children: [
                    {
                        routeName: "staffs.index",
                        fallback: "/staffs",
                        label: "Staff List",
                        permission: "staffs.view",
                    },
                    {
                        routeName: "staffs.create",
                        fallback: "/staffs/create",
                        label: "Add Staff",
                        permission: "staffs.create",
                    },
                ],
            },
            {
                key: "access-control",
                label: "Access Control",
                icon: "roles",
                children: [
                    {
                        routeName: "roles.index",
                        fallback: "/roles",
                        label: "Roles",
                        permission: "roles.view",
                    },
                    {
                        routeName: "roles.create",
                        fallback: "/roles/create",
                        label: "Add Role",
                        permission: "roles.create",
                    },
                    {
                        routeName: "permissions.index",
                        fallback: "/permissions",
                        label: "Permissions",
                        permission: "permissions.view",
                    },
                    {
                        routeName: "permissions.create",
                        fallback: "/permissions/create",
                        label: "Add Permission",
                        permission: "permissions.create",
                    },
                ],
            },
        ],
    },
    {
        key: "settings",
        label: "System Administration",
        icon: "settings",
        basePath: "/settings",
        permissions: ["roles.view"],
        children: [
            {
                key: "monitoring",
                label: "Monitoring & Logs",
                icon: "settings",
                children: [
                    {
                        routeName: "settings.performance.index",
                        fallback: "/settings/performance",
                        label: "App Performance",
                        permission: "roles.view",
                    },
                    {
                        routeName: "settings.logs.index",
                        fallback: "/settings/logs",
                        label: "Log Files",
                        permission: "roles.view",
                    },
                    {
                        routeName: "settings.user-monitor.index",
                        fallback: "/settings/user-monitor",
                        label: "User Monitor",
                        permission: "roles.view",
                    },
                    {
                        routeName: "settings.security.index",
                        fallback: "/settings/security",
                        label: "Security Monitor",
                        permission: "roles.view",
                    },
                ],
            },
            {
                key: "integrations",
                label: "Integrations",
                icon: "grid",
                children: [],
            },
        ],
    },
];

export const STUDENT_NAV_ITEMS = [
    {
        key: "student-academics",
        label: "My Academics",
        icon: "academic",
        basePath: "/student/course-units",
        children: [
            {
                key: "student-learning",
                label: "Academic Records",
                icon: "book",
                children: [
                    {
                        routeName: "student.course-units.index",
                        fallback: "/student/course-units",
                        label: "View Registered Units",
                        activeRouteNames: ["student.course-units.index"],
                    },
                    {
                        routeName: "student.results.index",
                        fallback: "/student/results",
                        label: "View Results",
                        activeRouteNames: ["student.results.index"],
                    },
                ],
            },
        ],
    },
    {
        key: "student-finance",
        label: "My Finance",
        icon: "finance",
        basePath: "/student/fee-statements",
        children: [
            {
                key: "student-billing",
                label: "Statements",
                icon: "financeBilling",
                children: [
                    {
                        routeName: "student.fee-statements.index",
                        fallback: "/student/fee-statements",
                        label: "View Statement",
                        activeRouteNames: [
                            "student.fee-statements.index",
                            "student.fee-statements.show",
                        ],
                    },
                ],
            },
        ],
    },
    {
        key: "student-account",
        label: "My Account",
        icon: "students",
        basePath: "/profile",
        children: [
            {
                key: "student-profile",
                label: "Profile",
                icon: "users",
                children: [
                    {
                        routeName: "profile.edit",
                        fallback: "/profile",
                        label: "Profile Settings",
                        activeRouteNames: ["profile.edit"],
                    },
                ],
            },
        ],
    },
];

export const NAV_ITEMS = STAFF_NAV_ITEMS;

export const ICONS = {
    dashboard: <LayoutDashboard className="w-5 h-5 shrink-0" />,
    reports: <BarChart3 className="w-5 h-5 shrink-0" />,
    academicSetup: <School className="w-5 h-5 shrink-0" />,
    academicOps: <CalendarClock className="w-5 h-5 shrink-0" />,
    academic: <CalendarClock className="w-5 h-5 shrink-0" />,
    students: <GraduationCap className="w-5 h-5 shrink-0" />,
    financeBilling: <Landmark className="w-5 h-5 shrink-0" />,
    staffAccess: <UserCog className="w-5 h-5 shrink-0" />,
    settings: <Settings className="w-5 h-5 shrink-0" />,
    transfer: <ArrowRightLeft className="w-5 h-5 shrink-0" />,
    book: <BookOpen className="w-5 h-5 shrink-0" />,
    department: <Building2 className="w-5 h-5 shrink-0" />,
    courses: <BookMarked className="w-5 h-5 shrink-0" />,
    grid: <LayoutGrid className="w-5 h-5 shrink-0" />,
    roles: <ShieldCheck className="w-5 h-5 shrink-0" />,
    staff: <UserRound className="w-5 h-5 shrink-0" />,
    users: <UsersRound className="w-5 h-5 shrink-0" />,
    finance: <Wallet className="w-5 h-5 shrink-0" />,
};
