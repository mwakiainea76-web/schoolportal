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
    Wallet,
} from "lucide-react";

export const NAV_ITEMS = [
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
                label: "Executive",
                permission: "students.view",
            },
        ],
    },
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
        label: "Exams & Certifications",
        icon: "book",
        basePath: "/exam-bodies",
        permissions: ["exam.bodies.view", "certification.levels.view"],
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
    {
        key: "programs",
        label: "Programs",
        icon: "programs",
        basePath: "/programs",
        permissions: ["programs.view"],
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
                routeName: "units.program-version-units.index",
                fallback: "/units/program-version-units",
                label: "Program Version Units",
                permission: "units.program-version-units.view",
            },
        ],
    },
    {
        key: "academic-year",
        label: "Academic Calendar",
        icon: "academic",
        basePath: "/academic/",
        permissions: ["academic.years.view", "academic.sessions.view", "grades.view"],
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
            {
                routeName: "academic.marks.index",
                fallback: "/academic/marks",
                label: "Marks Entry",
                permission: "grades.view",
            },
            {
                routeName: "academic.marks.marksheet.index",
                fallback: "/academic/marks/marksheet",
                label: "Unit Marksheet",
                permission: "grades.view",
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
        basePath: "/billing/",
        permissions: ["students.view"],
        children: [
            {
                routeName: "billing.invoices.index",
                fallback: "/billing/invoices",
                label: "Bill invoices",
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
    reports: <LayoutDashboard className="w-5 h-5 shrink-0" />,
    book: <BookOpen className="w-5 h-5 shrink-0" />, // Exam Bodies
    department: <Building2 className="w-5 h-5 shrink-0" />, // Departments
    programs: <BookMarked className="w-5 h-5 shrink-0" />, // Programs (was FileText)
    grid: <LayoutGrid className="w-5 h-5 shrink-0" />, // Units (was Grid2X2)
    academic: <CalendarRange className="w-5 h-5 shrink-0" />, // Academic Calendar (was CalendarDays)
    roles: <ShieldCheck className="w-5 h-5 shrink-0" />, // Roles & Permissions
    staff: <UserRound className="w-5 h-5 shrink-0" />, // Staffs (was generic User)
    students: <GraduationCap className="w-5 h-5 shrink-0" />, // Students — distinct from staff
    finance: <Wallet className="w-5 h-5 shrink-0" />, // Finance (was User — wrong!)
};
