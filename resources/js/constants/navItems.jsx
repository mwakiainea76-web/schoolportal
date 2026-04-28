import {
    LayoutDashboard,
    BookOpen,
    Award,
    Building2,
    FileText,
    Grid2X2,
    CalendarDays,
    ShieldCheck,
    User,
} from "lucide-react";

export const NAV_ITEMS = [
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
        key: "courses",
        label: "Courses",
        icon: "file",
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
                routeName: "courses.curriculum.index",
                fallback: "/courses/curriculum",
                label: "Course Curriculum",
                permission: "courses.curriculum.view",
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
    {
        key: "staffs",
        label: "Staffs",
        icon: "user",
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
        icon: "user",
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
        key: "fee",
        label: "Finance",
        icon: "user",
        basePath: "/fees",
        permissions: ["students.view"],
        children: [
            {
                routeName: "fees.templates.index",
                fallback: "/fees/templates",
                label: "Fee template",
                permission: "students.view",
            },
            {
                routeName: "fees.components.index",
                fallback: "/fees/components",
                label: "Fee component",
                permission: "students.create",
            },
            {
                routeName: "fees.models.index",
                fallback: "/fees/models",
                label: "Fee model",
                permission: "students.create",
            },
        ],
    },
];

export const ICONS = {
    dashboard: <LayoutDashboard className="w-5 h-5 shrink-0" />,
    book: <BookOpen className="w-5 h-5 shrink-0" />,
    certificate: <Award className="w-5 h-5 shrink-0" />,
    department: <Building2 className="w-5 h-5 shrink-0" />,
    file: <FileText className="w-5 h-5 shrink-0" />,
    grid: <Grid2X2 className="w-5 h-5 shrink-0" />,
    academic: <CalendarDays className="w-5 h-5 shrink-0" />,
    roles: <ShieldCheck className="w-5 h-5 shrink-0" />,
    user: <User className="w-5 h-5 shrink-0" />,
};
