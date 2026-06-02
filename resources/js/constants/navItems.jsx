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
        basePath: "/programs",
        permissions: [
            "departments.view",
            "exam.bodies.view",
            "certification.levels.view",
            "programs.view",
            "program-versions.view",
            "programs.program-version-mappings.view",
            "units.view",
            "units.program-version-units.view",
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
                ],
            },
            {
                key: "program-catalog",
                label: "Program Catalog",
                icon: "programs",
                children: [
                    {
                        routeName: "programs.index",
                        fallback: "/programs",
                        label: "Programs",
                        permission: "programs.view",
                    },
                    {
                        routeName: "program-versions.index",
                        fallback: "/program-versions",
                        label: "Program Versions",
                        permission: "program-versions.view",
                    },
                    {
                        routeName: "programs.program-version-mappings.index",
                        fallback: "/programs/program-versions",
                        label: "Program Version Mapping",
                        permission: "programs.program-version-mappings.view",
                    },
                    {
                        routeName: "programs.enrollments.index",
                        fallback: "/programs/enrollments",
                        label: "Program Enrollments",
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
                        routeName: "units.program-version-units.index",
                        fallback: "/units/program-version-units",
                        label: "Program Version Units",
                        permission: "units.program-version-units.view",
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
                        routeName: "certification-levels.index",
                        fallback: "/exam-bodies/certification-levels",
                        label: "Certification Levels",
                        permission: "certification.levels.view",
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
            "academic.sessions.view",
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
                        routeName: "academic.sessions.index",
                        fallback: "/academic/sessions",
                        label: "Academic Sessions",
                        permission: "academic.sessions.view",
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
                        routeName: "lecture-rooms.index",
                        fallback: "/lecture-rooms",
                        label: "Lecture Rooms",
                        permission: "academic.sessions.view",
                    },
                    {
                        routeName: "academic.sessions.enrollments.index",
                        fallback: "/academic/sessions/enrollments",
                        label: "Session Enrollments",
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
                        label: "Program Transfer",
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
                        routeName: "hostel-allocations.index",
                        fallback: "/hostel-allocations",
                        label: "Hostel Allocations",
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
        permissions: ["students.view", "billing.ledger.view"],
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
                        routeName: "fees.plans.items.index",
                        fallback: "/fees/plans/items",
                        label: "Fee Plan Items",
                        permission: "students.view",
                    },
                    {
                        routeName: "fees.assignments.index",
                        fallback: "/fees/assignments",
                        label: "Fee Assignments",
                        permission: "students.view",
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
                        routeName: "billing.manual.index",
                        fallback: "/billing/manual-operations",
                        label: "Manual Billing",
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
            "permissions.view",
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
                routeName: "roles.index",
                fallback: "/roles",
                activeRouteNames: ["permissions.index"],
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
        basePath: "/student/program-units",
        children: [
            {
                key: "student-learning",
                label: "Academic Records",
                icon: "book",
                children: [
                    {
                        routeName: "student.program-units.index",
                        fallback: "/student/program-units",
                        label: "View Registered Units",
                        activeRouteNames: ["student.program-units.index"],
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
    programs: <BookMarked className="w-5 h-5 shrink-0" />,
    grid: <LayoutGrid className="w-5 h-5 shrink-0" />,
    roles: <ShieldCheck className="w-5 h-5 shrink-0" />,
    staff: <UserRound className="w-5 h-5 shrink-0" />,
    users: <UsersRound className="w-5 h-5 shrink-0" />,
    finance: <Wallet className="w-5 h-5 shrink-0" />,
};
