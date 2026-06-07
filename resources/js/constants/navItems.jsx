import {
    ArrowRightLeft,
    BarChart3,
    BookMarked,
    BookOpen,
    Building2,
    CalendarClock,
    GraduationCap,
    Home,
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
        key: "timetable-workspace",
        label: "Timetable Workspace",
        icon: "academic",
        basePath: "/academic/timetables",
        permissions: ["academic.sessions.view"],
        children: [
            {
                routeName: "academic.timetables.index",
                fallback: "/academic/timetables",
                label: "Timetable Workspace",
                permission: "academic.sessions.view",
            },
        ],
    },
    {
        key: "marks-workspace",
        label: "Marks Workspace",
        icon: "academic",
        basePath: "/academic/marks",
        permissions: ["academic.sessions.view"],
        children: [
            {
                routeName: "academic.marks.add.index",
                fallback: "/academic/marks/add",
                label: "Marks Workspace",
                permission: "academic.sessions.view",
            },
        ],
    },
    {
        key: "hostel-workspace",
        label: "Hostel Workspace",
        icon: "hostel",
        basePath: "/hostels",
        permissions: ["hostels.view"],
        children: [
            {
                routeName: "hostels.index",
                fallback: "/hostels",
                label: "Hostel Workspace",
                permission: "hostels.view",
            },
        ],
    },

    // ----------------------------------------------------------------
    // MAIN SECTIONS
    // ----------------------------------------------------------------
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
            "curriculums.view",
            "curriculums.create",
            "courses.curriculum-mappings.view",
            "courses.curriculum-mappings.create",
            "students.view",
        ],
        children: [
            {
                key: "institution-structure",
                label: "Department Workspace",
                icon: "department",
                children: [
                    {
                        routeName: "departments.index",
                        fallback: "/departments",
                        label: "Department Workspace",
                        permission: "departments.view",
                        activeRouteNames: [
                            "departments.index",
                            "departments.create",
                            "departments.edit",
                        ],
                    },
                ],
            },
            {
                key: "course-workspace",
                label: "Course Workspace",
                icon: "courses",
                children: [
                    {
                        routeName: "courses.index",
                        fallback: "/courses",
                        label: "Course Workspace",
                        permission: "courses.view",
                        activeRouteNames: [
                            "courses.index",
                            "courses.create",
                            "courses.edit",
                            "curriculums.index",
                            "curriculums.create",
                            "curriculums.edit",
                            "courses.curriculum-mappings.index",
                            "courses.curriculum-mappings.create",
                            "courses.curriculum-mappings.edit",
                            "units.index",
                            "units.create",
                            "units.edit",
                        ],
                    },
                ],
            },
            {
                key: "exams-certifications",
                label: "Exam Workspace",
                icon: "book",
                children: [
                    {
                        routeName: "exam.bodies.index",
                        fallback: "/exam-bodies",
                        label: "Exam Workspace",
                        permission: "exam.bodies.view",
                        activeRouteNames: [
                            "exam.bodies.index",
                            "exam.bodies.create",
                            "exam.bodies.edit",
                            "certification-levels.index",
                            "certification-levels.create",
                            "certification-levels.edit",
                        ],
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
                        routeName: "academic.sessions.index",
                        fallback: "/academic/sessions",
                        label: "Academic Calendar",
                        permission: "academic.years.view",
                        activeRouteNames: [
                            "academic.years.index",
                            "academic.sessions.index",
                            "academic.years.create",
                            "academic.years.edit",
                            "academic.sessions.create",
                            "academic.sessions.edit",
                        ],
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
                        fallback:
                            "/billing/manual-operations/additional-invoice",
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
                label: "Access Workspace",
                icon: "roles",
                children: [
                    {
                        routeName: "roles.index",
                        fallback: "/roles",
                        label: "Access Workspace",
                        permission: "roles.view",
                        activeRouteNames: [
                            "roles.index",
                            "roles.create",
                            "roles.edit",
                            "permissions.index",
                            "permissions.create",
                            "permissions.edit",
                        ],
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
    hostel: <Home className="w-5 h-5 shrink-0" />,
};
