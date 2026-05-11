import {
    LayoutDashboard,
    BookOpen,
    GraduationCap,
    Building2,
    BookMarked,
    LayoutGrid,
    CalendarRange,
    ShieldCheck,
    UserRound,
    Users,
    Wallet,
} from "lucide-react";

export const NAV_ITEMS = [
    {
        key: "departments",
        label: "Departments",
        icon: "department",
        basePath: "/departments",
        permissions: ["departments.view"],
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
        key: "exam-bodies",
        label: "Exam Bodies",
        icon: "book",
        basePath: "/exam-bodies",
        permissions: ["exam.bodies.view"],
        children: [
            {
                routeName: "exam-bodies.index",
                fallback: "/exam-bodies",
                label: "Exam Bodies",
                permission: "exam.bodies.view",
            },
            {
                routeName: "/exam-bodies/certification-levels.index",
                fallback: "/exam-bodies/certification-levels",
                label: "Certification Levels",
                permission: "certification.levels.view",
            },
        ],
    },
    {
        key: "courses",
        label: "Courses",
        icon: "courses",
        basePath: "/courses",
        permissions: ["courses.view"],
        children: [
            {
                routeName: "courses.index",
                fallback: "/courses",
                label: "Courses",
                permission: "courses.view",
            },
            {
                routeName: "curriculum.index",
                fallback: "/curriculum",
                label: "Curriculum",
                permission: "courses.curriculum.view",
            },
            {
                routeName: "courses.curriculum.index",
                fallback: "/courses/curriculum",
                label: "Course Curriculum",
                permission: "courses.curriculum.view",
            },
            {
                routeName: "course.enrollments.index",
                fallback: "/courses/enrollments",
                label: "Course Enrollments",
                permission: "students.view",
            },
        ],
    },
    {
        key: "units",
        label: "Units",
        icon: "grid",
        basePath: "/units",
        permissions: ["units.view", "units.view-registered"],
        children: [
            {
                routeName: "units.index",
                fallback: "/units",
                label: "Units",
                permission: "units.view",
            },
            {
                routeName: "units.curriculum.index",
                fallback: "/units/curriculum",
                label: "Curriculum Units",
                permission: "units.curriculum.view",
            },
        ],
    },
    {
        key: "academic-year",
        label: "Academic Calendar",
        icon: "academic",
        basePath: "/academic/",
        permissions: ["academic.years.view", "academic.sessions.view"],
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
            {
                routeName: "academic/sessions/enrollments.index",
                fallback: "/academic/sessions/enrollments",
                label: "Session Enrollments",
                permission: "students.view",
            },
        ],
    },
    {
        key: "fee",
        label: "Finance",
        icon: "finance",
        basePath: "/fees/",
        permissions: ["students.view"],
        children: [
            {
                routeName: "fees.plans.index",
                fallback: "/fees/plans",
                label: "Fee plans",
                permission: "students.view",
            },
            {
                routeName: "fees.plans.items.index",
                fallback: "/fees/plans/items",
                label: "Fee plans items",
                permission: "students.view",
            },
            {
                routeName: "fees.assignments.index",
                fallback: "/fees/assignments",
                label: "Fee assignments ",
                permission: "students.view",
            },
        ],
    },
    {
        key: "billing",
        label: "Billing",
        icon: "finance",
        basePath: "/biling/",
        permissions: ["students.view"],
        children: [
            {
                routeName: "billing.invoices.index",
                fallback: "/billing/invoices",
                label: "Bill invoices",
                permission: "students.view",
            },
            {
                routeName: "billing.bulk.operations",
                fallback: "/billing/bulk-operations",
                label: "Bulk Operations",
                permission: "students.view",
            },
            {
                routeName: "billing.invoices.create",
                fallback: "/billing/invoices/create",
                label: "Create invoice",
                permission: "students.view",
            },
        ],
    },

    {
        key: "staffs",
        label: "Staffs",
        icon: "staff",
        basePath: "/staffs",
        permissions: ["staffs.view"],
        children: [
            {
                routeName: "staffs.index",
                fallback: "/staffs",
                label: "Staffs",
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
        key: "students",
        label: "Students",
        icon: "students",
        basePath: "/students",
        permissions: ["students.view"],
        children: [
            {
                routeName: "students.index",
                fallback: "/students",
                label: "Students",
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
        key: "roles",
        label: "Roles & Permissions",
        icon: "roles",
        basePath: "/roles",
        permissions: ["roles.view"],
        children: [
            {
                routeName: "roles.index",
                fallback: "/roles",
                label: "Roles",
                permission: "roles.view",
            },
            {
                routeName: "permissions.index",
                fallback: "/permissions",
                label: "Permissions",
                permission: "permissions.view",
            },
        ],
    },
];

export const ICONS = {
    dashboard: <LayoutDashboard className="w-5 h-5 shrink-0" />,
    book: <BookOpen className="w-5 h-5 shrink-0" />, // Exam Bodies
    department: <Building2 className="w-5 h-5 shrink-0" />, // Departments
    courses: <BookMarked className="w-5 h-5 shrink-0" />, // Courses (was FileText)
    grid: <LayoutGrid className="w-5 h-5 shrink-0" />, // Units (was Grid2X2)
    academic: <CalendarRange className="w-5 h-5 shrink-0" />, // Academic Calendar (was CalendarDays)
    roles: <ShieldCheck className="w-5 h-5 shrink-0" />, // Roles & Permissions
    staff: <UserRound className="w-5 h-5 shrink-0" />, // Staffs (was generic User)
    students: <GraduationCap className="w-5 h-5 shrink-0" />, // Students — distinct from staff
    finance: <Wallet className="w-5 h-5 shrink-0" />, // Finance (was User — wrong!)
};
