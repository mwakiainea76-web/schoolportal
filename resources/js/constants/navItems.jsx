import {
    LayoutDashboard,
    BarChart3,
    School,
    CalendarClock,
    GraduationCap,
    Landmark,
    UserCog,
    Settings,
    ArrowRightLeft,
    BookOpen,
    Building2,
    BookMarked,
    LayoutGrid,
    ShieldCheck,
    UserRound,
    UsersRound,
    Home,
    Presentation,
    ClipboardPenLine,
    Eye,
    Send,
} from "lucide-react";

/**
 * ICON MAPPING
 * High-quality iconography for a professional school portal.
 */
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
    finance: <Landmark className="w-5 h-5 shrink-0" />,
    hostel: <Home className="w-5 h-5 shrink-0" />,
    presentation: <Presentation className="w-5 h-5 shrink-0" />,
    grading: <ClipboardPenLine className="w-5 h-5 shrink-0" />,
    view: <Eye className="w-5 h-5 shrink-0" />,
    publish: <Send className="w-5 h-5 shrink-0" />,
};

/**
 * SHARED CONSTANTS
 * Centralized active-state tracking for complex routes.
 */
const ACADEMIC_ACTIVE = [
    "academic.years.index",
    "academic.years.create",
    "academic.years.edit",
    "academic.sessions.index",
    "academic.sessions.create",
    "academic.sessions.edit",
];

const COURSE_ACTIVE = [
    "courses.index",
    "courses.create",
    "courses.edit",
    "curriculums.index",
    "curriculums.create",
    "curriculums.edit",
    "curriculum-mappings.index",
    "curriculum-mappings.create",
    "curriculum-mappings.edit",
    "units.index",
    "units.create",
    "units.edit",
];

/**
 * STAFF NAVIGATION
 * Universal, resource-first naming that works regardless of specific role.
 */
export const STAFF_NAV_ITEMS = [
    // --- Academics ---
    {
        key: "academics",
        label: "Academics",
        icon: "academic",
        basePath: "/academic",
        permissions: ["academic.sessions.view"],
        children: [
            {
                routeName: "academic.timetables.index",
                fallback: "/academic/timetables",
                label: "Timetables",
                permission: "academic.sessions.view",
            },
            {
                routeName: "academic.marks.add.index",
                fallback: "/academic/marks/add",
                label: "Assessments",
                permission: "academic.sessions.view",
            },
            {
                routeName: "courses.index",
                fallback: "/courses",
                label: "Courses & Units",
                activeRouteNames: COURSE_ACTIVE,
            },
        ],
    },

    // --- Analytics ---
    {
        key: "analytics",
        label: "Analytics",
        icon: "reports",
        basePath: "/reports",
        permissions: ["students.view"],
        children: [
            {
                routeName: "reports.executive",
                fallback: "/reports/executive",
                label: "Reporting Dashboard",
                permission: "students.view",
            },
        ],
    },

    // --- Student Records ---
    {
        key: "students",
        label: "Students",
        icon: "students",
        basePath: "/students",
        permissions: ["students.view"],
        children: [
            {
                routeName: "students.index",
                fallback: "/students",
                label: "Student Registry",
            },
            {
                routeName: "students.create",
                fallback: "/students/create",
                label: "Admissions",
                permission: "students.create",
            },
            {
                routeName: "students.course-change.index",
                fallback: "/students/course-change",
                label: "Transfers",
            },
        ],
    },

    // --- Finance ---
    {
        key: "finance",
        label: "Finance",
        icon: "financeBilling",
        basePath: "/fees",
        permissions: ["billing.ledger.view"],
        children: [
            {
                key: "billing-ops",
                label: "Billing",
                children: [
                    { routeName: "billing.invoices.index", fallback: "/billing/invoices", label: "Invoices" },
                    { routeName: "billing.manual.index", fallback: "/billing/manual-operations", label: "Direct Billing" },
                    { routeName: "billing.ledger.index", fallback: "/billing/ledger", label: "Financial Ledger" },
                ],
            },
            {
                key: "fee-setup",
                label: "Fee Setup",
                children: [
                    { routeName: "fees.plans.index", fallback: "/fees/plans", label: "Fee Plans" },
                    { routeName: "fees.assignments.index", fallback: "/fees/assignments", label: "Fee Assignments" },
                ],
            },
        ],
    },

    // --- Operations ---
    {
        key: "operations",
        label: "Operations",
        icon: "academicOps",
        basePath: "/academic",
        permissions: ["academic.years.view", "students.view"],
        children: [
            {
                key: "calendar-group",
                label: "Academic Calendar",
                children: [
                    {
                        routeName: "academic.sessions.index",
                        fallback: "/academic/sessions",
                        label: "Sessions & Terms",
                        activeRouteNames: ACADEMIC_ACTIVE,
                    },
                    {
                        routeName: "academic.sessions.enrollments.index",
                        fallback: "/academic/sessions/enrollments",
                        label: "Enrollments",
                    },
                ],
            },
            {
                key: "facility-group",
                label: "Facilities",
                children: [
                    {
                        routeName: "lecture-rooms.index",
                        fallback: "/lecture-rooms",
                        label: "Lecture Rooms",
                    },
                    {
                        routeName: "hostels.index",
                        fallback: "/hostels",
                        label: "Hostels",
                    },
                ],
            },
        ],
    },

    // --- Institution ---
    {
        key: "institution",
        label: "Institution",
        icon: "academicSetup",
        basePath: "/departments",
        permissions: ["departments.view"],
        children: [
            {
                routeName: "departments.index",
                fallback: "/departments",
                label: "Departments",
            },
            {
                routeName: "exam.bodies.index",
                fallback: "/exam-bodies",
                label: "Exam Boards",
            },
        ],
    },

    // --- Human Resources ---
    {
        key: "staffing",
        label: "Staffing",
        icon: "staffAccess",
        basePath: "/staffs",
        permissions: ["staffs.view", "roles.view"],
        children: [
            {
                key: "staff-group",
                label: "Human Resources",
                children: [
                    { routeName: "staffs.index", fallback: "/staffs", label: "Staff Directory" },
                    { routeName: "staffs.create", fallback: "/staffs/create", label: "Onboarding" },
                ],
            },
            {
                key: "rbac-group",
                label: "Access Control",
                children: [
                    {
                        routeName: "roles.index",
                        fallback: "/roles",
                        label: "Roles & Permissions",
                        activeRouteNames: ["roles.index", "roles.create", "roles.edit", "permissions.index"],
                    },
                ],
            },
        ],
    },

    // --- System ---
    {
        key: "system",
        label: "System",
        icon: "settings",
        basePath: "/settings",
        permissions: ["roles.view"],
        children: [
            {
                routeName: "settings.performance.index",
                fallback: "/settings/performance",
                label: "Health Metrics",
            },
            {
                routeName: "settings.logs.index",
                fallback: "/settings/logs",
                label: "System Logs",
            },
            {
                routeName: "settings.security.index",
                fallback: "/settings/security",
                label: "Security Audit",
            },
        ],
    },
];

/**
 * STUDENT NAVIGATION
 * Universal naming for students to ensure consistency.
 */
export const STUDENT_NAV_ITEMS = [
    {
        key: "academics",
        label: "Academics",
        icon: "academic",
        basePath: "/student",
        children: [
            {
                routeName: "student.course-units.index",
                fallback: "/student/course-units",
                label: "Registered Units",
            },
            {
                routeName: "student.results.index",
                fallback: "/student/results",
                label: "Examination Results",
            },
        ],
    },
    {
        key: "finance",
        label: "Finance",
        icon: "finance",
        basePath: "/student/fee-statements",
        children: [
            {
                routeName: "student.fee-statements.index",
                fallback: "/student/fee-statements",
                label: "Fee Statements",
            },
        ],
    },
    {
        key: "account",
        label: "Account",
        icon: "users",
        basePath: "/profile",
        children: [
            {
                routeName: "profile.edit",
                fallback: "/profile",
                label: "Profile Settings",
            },
        ],
    },
];

export const NAV_ITEMS = STAFF_NAV_ITEMS;
