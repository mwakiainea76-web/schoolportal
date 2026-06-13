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
    Clock,
    DoorOpen,
} from "lucide-react";

/**
 * ICON MAPPING
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
    timetable: <Clock className="w-5 h-5 shrink-0" />,
    lectureRoom: <DoorOpen className="w-5 h-5 shrink-0" />,
};

/**
 * SHARED CONSTANTS
 */
const ACADEMIC_ACTIVE = [
    "academic.years.index",
    "academic.years.create",
    "academic.years.edit",
    "academic.sessions.index",
    "academic.sessions.create",
    "academic.sessions.edit",
    "academic.sessions.enrollments.index",
    "academic.sessions.enrollments.create",
    "academic.sessions.enrollments.edit",
];

/**
 * STAFF NAVIGATION
 */
export const STAFF_NAV_ITEMS = [

    // --- Courses & Units (standalone) ---
    {
        key: "courses",
        label: "Courses & Units",
        icon: "courses",
        basePath: "/courses",
        permissions: ["courses.view"],
        roles: ["hod"],
        children: [
              {
                key: "curriculums-group",
                label: "Curriculums",
                exceptRoles: ["hod"],
                children: [
                    {
                        routeName: "curriculums.index",
                        fallback: "/curriculums",
                        label: "All Curriculums",
                    },
                    {
                        routeName: "curriculums.create",
                        fallback: "/curriculums/create",
                        label: "Add Curriculum",
                    },
                 
                ],
            },
            {
                key: "courses-group",
                label: "Courses",
                children: [
                    {
                        routeName: "courses.index",
                        fallback: "/courses",
                        label: "All Courses",
                    },
                    {
                        routeName: "courses.enrollments.index",
                        fallback: "/courses/enrollments",
                        label: "Course Enrollments",
                    },
                    {
                        routeName: "courses.create",
                        fallback: "/courses/create",
                        label: "Add Course",
                        exceptRoles: ["hod"],
                    },
                       {
                        routeName: "courses.curriculum-mappings.index",
                        fallback: "/courses/curriculum-mappings",
                        label: "Curriculum Mapping",
                        exceptRoles: ["hod"],
                    },
                    {
                        routeName: "courses.curriculum-mappings.create",
                        fallback: "/courses/curriculum-mappings/create",
                        label: "Add Mapping",
                        exceptRoles: ["hod"],
                    },
                ],
            },
          
            {
                key: "units-group",
                label: "Units",
                children: [
                    {
                        routeName: "units.index",
                        fallback: "/units",
                        label: "All Units",
                    },
                    {
                        routeName: "units.create",
                        fallback: "/units/create",
                        label: "Add Unit",
                        exceptRoles: ["hod"],
                    },
                ],
            },
        ],
    },

    // --- Timetables (standalone) ---
    {
        key: "timetables",
        label: "Timetables",
        icon: "timetable",
        basePath: "/academic/timetables",
        permissions: ["academic.sessions.view"],
        roles: ["hod"],
        children: [
            {
                routeName: "academic.timetables.index",
                fallback: "/academic/timetables",
                label: "View Timetables",
            },
            {
                routeName: "academic.timetables.hod.create",
                fallback: "/academic/timetables/create/hod",
                label: "Add Timetable",
                roles: ["hod"],
            },
            {
                routeName: "academic.timetables.create",
                fallback: "/academic/timetables/create",
                label: "Add Timetable",
                exceptRoles: ["hod"],
            },
        ],
    },

    // --- Assessments (standalone) ---
    {
        key: "assessments",
        label: "Assessments",
        icon: "grading",
        basePath: "/academic/marks",
        permissions: ["academic.sessions.view"],
        roles: ["hod"],
        children: [
            {
                routeName: "academic.marks.view.index",
                fallback: "/academic/marks/view",
                label: "View Marks",
            },
            {
                routeName: "academic.marks.add.index",
                fallback: "/academic/marks/add",
                label: "Add Marks",
            },
            {
                routeName: "academic.marks.marksheet.index",
                fallback: "/academic/marks/marksheet",
                label: "Marksheet",
            },
            {
                routeName: "academic.marks.publish.index",
                fallback: "/academic/marks/publish",
                label: "Publish Marks",
            },
        ],
    },

    // --- Hostels (standalone) ---
    {
        key: "hostels",
        label: "Hostels",
        icon: "hostel",
        basePath: "/hostels",
        permissions: ["hostels.view"],
        children: [
            {
                key: "hostel-management",
                label: "Hostel Management",
                children: [
                    {
                        routeName: "hostels.index",
                        fallback: "/hostels",
                        label: "View Hostels",
                    },
                    {
                        routeName: "hostels.create",
                        fallback: "/hostels/create",
                        label: "Add Hostel",
                    },
                ],
            },
            {
                key: "hostel-allocations",
                label: "Allocations",
                children: [
                    {
                        routeName: "hostel-allocations.index",
                        fallback: "/hostel-allocations",
                        label: "View Allocations",
                    },
                    {
                        routeName: "hostel-allocations.create",
                        fallback: "/hostel-allocations/create",
                        label: "Add Allocation",
                    },
                ],
            },
        ],
    },

    // --- Lecture Rooms (standalone) ---
    {
        key: "lecture-rooms",
        label: "Lecture Rooms",
        icon: "lectureRoom",
        basePath: "/lecture-rooms",
        permissions: ["lecture-rooms.view"],
        children: [
            {
                routeName: "lecture-rooms.index",
                fallback: "/lecture-rooms",
                label: "View Rooms",
            },
            {
                routeName: "lecture-rooms.create",
                fallback: "/lecture-rooms/create",
                label: "Add Room",
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
            },
        ],
    },

    // --- Students ---
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
                routeName: "students.password-reset.create",
                fallback: "/students/reset-password",
                label: "Reset Password",
                roles: ["admin"],
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
        roles: ["bursar"],
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
                        label: "Academic Years & Sessions",
                        activeRouteNames: ACADEMIC_ACTIVE,
                    },
                    {
                        routeName: "academic.sessions.enrollments.index",
                        fallback: "/academic/sessions/enrollments",
                        label: "Enrollments",
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
                key: "departments-group",
                label: "Departments",
                children: [
                    {
                        routeName: "departments.index",
                        fallback: "/departments",
                        label: "View Departments",
                    },
                    {
                        routeName: "departments.create",
                        fallback: "/departments/create",
                        label: "Add Department",
                    },
                ],
            },
            {
                routeName: "exam.bodies.index",
                fallback: "/exam-bodies",
                label: "Exam Boards",
            },
        ],
    },

    // --- Staffing ---
    {
        key: "staffing",
        label: "Staffing",
        icon: "staffAccess",
        basePath: "/staffs",
        permissions: ["staffs.view"],
        roles: ["hod"],
        children: [
            { routeName: "staffs.index", fallback: "/staffs", label: "Staff Directory" },
            {
                routeName: "staffs.create",
                fallback: "/staffs/create",
                label: "Onboarding",
                exceptRoles: ["hod"],
            },
            {
                routeName: "staffs.password-reset.create",
                fallback: "/staffs/reset-password",
                label: "Reset Password",
                roles: ["admin"],
            },
        ],
    },
  // --- Access Control (standalone) ---
    {
        key: "access-control",
        label: "Access Control",
        icon: "roles",
        basePath: "/roles",
        permissions: ["roles.view"],
        children: [
            {
                key: "rbac-roles",
                label: "Roles",
                children: [
                    {
                        routeName: "roles.index",
                        fallback: "/roles",
                        label: "All Roles",
                    },
                    {
                        routeName: "roles.create",
                        fallback: "/roles/create",
                        label: "Add Role",
                    },
                ],
            },
            {
                key: "rbac-permissions",
                label: "Permissions",
                children: [
                    {
                        routeName: "permissions.index",
                        fallback: "/permissions",
                        label: "All Permissions",
                    },
                    {
                        routeName: "permissions.create",
                        fallback: "/permissions/create",
                        label: "Add Permission",
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

/**
 * STUDENT NAVIGATION
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
                label: "All Units",
            },
            {
                routeName: "student.registered-units.index",
                fallback: "/student/registered-units",
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
