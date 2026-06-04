import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import axios from "axios";
import { usePage, Link, router, createInertiaApp } from "@inertiajs/react";
import { useState, useRef, useEffect, createContext, useContext } from "react";
import { Wallet, UsersRound, UserRound, ShieldCheck, LayoutGrid, BookMarked, Building2, BookOpen, ArrowRightLeft, Settings, UserCog, Landmark, GraduationCap, CalendarClock, School, BarChart3, LayoutDashboard, ChevronLeft } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import { createRoot } from "react-dom/client";
window.axios = axios;
window.axios.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";
function useRbac() {
  const { props } = usePage();
  const permissions = props.auth?.permissions ?? [];
  const roles = props.auth?.roles ?? [];
  const normalizedRoles = roles.map((role) => String(role).toLowerCase());
  const can = (perm) => permissions.includes(perm);
  const cannot = (perm) => !permissions.includes(perm);
  const hasRole = (role) => normalizedRoles.includes(String(role).toLowerCase());
  return { permissions, roles, can, cannot, hasRole };
}
function NavLink({ href, label, active, onClick }) {
  return /* @__PURE__ */ jsxs(
    Link,
    {
      href,
      onClick,
      className: `flex min-h-9 items-center gap-3 px-4 pl-12 text-sm leading-5 transition ${active ? "text-emerald-400 font-semibold" : "text-zinc-500 hover:text-zinc-200"}`,
      children: [
        /* @__PURE__ */ jsx(
          "span",
          {
            className: `h-1.5 w-1.5 shrink-0 rounded-full transition ${active ? "bg-emerald-500" : "bg-zinc-700"}`
          }
        ),
        /* @__PURE__ */ jsx("span", { className: "truncate", children: label })
      ]
    }
  );
}
const STAFF_NAV_ITEMS = [
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
        permission: "students.view"
      }
    ]
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
      "students.view"
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
            permission: "departments.view"
          },
          {
            routeName: "departments.create",
            fallback: "/departments/create",
            label: "Add Department",
            permission: "departments.create"
          }
        ]
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
            permission: "course-versions.view"
          },
          {
            routeName: "course-versions.create",
            fallback: "/course-versions/create",
            label: "Add Course Version",
            permission: "course-versions.create"
          },
          {
            routeName: "courses.index",
            fallback: "/courses",
            label: "Courses",
            permission: "courses.view"
          },
          {
            routeName: "courses.create",
            fallback: "/courses/create",
            label: "Add Course",
            permission: "courses.create"
          },
          {
            routeName: "courses.course-version-mappings.index",
            fallback: "/courses/course-versions",
            label: "Course Version Mapping",
            permission: "courses.course-version-mappings.view"
          },
          {
            routeName: "courses.course-version-mappings.create",
            fallback: "/courses/course-versions/create",
            label: "Add Course Version Mapping",
            permission: "courses.course-version-mappings.create"
          },
          {
            routeName: "courses.enrollments.index",
            fallback: "/courses/enrollments",
            label: "Course Enrollments",
            permission: "students.view"
          }
        ]
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
            permission: "units.view"
          },
          {
            routeName: "units.create",
            fallback: "/units/create",
            label: "Add Unit",
            permission: "units.create"
          },
          {
            routeName: "units.course-version-units.index",
            fallback: "/units/course-version-units",
            label: "Course Version Units",
            permission: "units.course-version-units.view"
          },
          {
            routeName: "units.course-version-units.create",
            fallback: "/units/course-version-units/create",
            label: "Add Course Version Unit",
            permission: "units.course-version-units.create"
          }
        ]
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
            permission: "exam.bodies.view"
          },
          {
            routeName: "exam.bodies.create",
            fallback: "/exam-bodies/create",
            label: "Add Exam Body",
            permission: "exam.bodies.create"
          },
          {
            routeName: "certification-levels.index",
            fallback: "/exam-bodies/certification-levels",
            label: "Certification Levels",
            permission: "certification.levels.view"
          },
          {
            routeName: "certification-levels.create",
            fallback: "/exam-bodies/certification-levels/create",
            label: "Add Certification Level",
            permission: "certification.levels.create"
          }
        ]
      }
    ]
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
      "students.view"
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
            permission: "academic.years.view"
          },
          {
            routeName: "academic.years.create",
            fallback: "/academic/years/create",
            label: "Add Academic Year",
            permission: "academic.years.create"
          },
          {
            routeName: "academic.sessions.index",
            fallback: "/academic/sessions",
            label: "Academic Sessions",
            permission: "academic.sessions.view"
          },
          {
            routeName: "academic.sessions.create",
            fallback: "/academic/sessions/create",
            label: "Add Academic Session",
            permission: "academic.sessions.create"
          }
        ]
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
            permission: "academic.sessions.view"
          },
          {
            routeName: "academic.timetables.create",
            fallback: "/academic/timetables/create",
            label: "Add Timetable Session",
            permission: "academic.sessions.create"
          },
          {
            routeName: "academic.timetables.hod.create",
            fallback: "/academic/timetables/create/hod",
            label: "Add HOD Timetable",
            permission: "academic.sessions.create"
          },
          {
            routeName: "lecture-rooms.index",
            fallback: "/lecture-rooms",
            label: "Lecture Rooms",
            permission: "academic.sessions.view"
          },
          {
            routeName: "lecture-rooms.create",
            fallback: "/lecture-rooms/create",
            label: "Add Lecture Room",
            permission: "academic.sessions.create"
          },
          {
            routeName: "academic.sessions.enrollments.index",
            fallback: "/academic/sessions/enrollments",
            label: "Session Enrollments",
            permission: "students.view"
          },
          {
            routeName: "academic.sessions.enrollments.create",
            fallback: "/academic/sessions/enrollments/create",
            label: "Add Session Enrollment",
            permission: "students.view"
          }
        ]
      }
    ]
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
            permission: "students.view"
          },
          {
            routeName: "students.create",
            fallback: "/students/create",
            label: "Add Student",
            permission: "students.create"
          }
        ]
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
            permission: "students.view"
          }
        ]
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
            permission: "students.view"
          },
          {
            routeName: "hostels.create",
            fallback: "/hostels/create",
            label: "Add Hostel",
            permission: "students.view"
          },
          {
            routeName: "hostel-allocations.index",
            fallback: "/hostel-allocations",
            label: "Hostel Allocations",
            permission: "students.view"
          },
          {
            routeName: "hostel-allocations.create",
            fallback: "/hostel-allocations/create",
            label: "Add Hostel Allocation",
            permission: "students.view"
          }
        ]
      }
    ]
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
            permission: "students.view"
          },
          {
            routeName: "fees.plans.create",
            fallback: "/fees/plans/create",
            label: "Add Fee Plan",
            permission: "fees.create"
          },
          {
            routeName: "fees.plans.items.index",
            fallback: "/fees/plans/items",
            label: "Fee Plan Items",
            permission: "students.view"
          },
          {
            routeName: "fees.plans.items.create",
            fallback: "/fees/plans/items/create",
            label: "Add Fee Plan Item",
            permission: "fees.create"
          },
          {
            routeName: "fees.assignments.index",
            fallback: "/fees/assignments",
            label: "Fee Assignments",
            permission: "students.view"
          },
          {
            routeName: "fees.assignments.create",
            fallback: "/fees/assignments/create",
            label: "Add Fee Assignment",
            permission: "fees.create"
          }
        ]
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
            permission: "students.view"
          },
          {
            routeName: "billing.invoices.create",
            fallback: "/billing/invoices/create",
            label: "Add Invoice",
            permission: "students.view"
          },
          {
            routeName: "billing.manual.index",
            fallback: "/billing/manual-operations",
            label: "Manual Billing",
            permission: "students.view"
          },
          {
            routeName: "billing.manual.invoices.create",
            fallback: "/billing/manual-operations/additional-invoice",
            label: "Add Additional Invoice",
            permission: "students.view"
          },
          {
            routeName: "billing.manual.payments.create",
            fallback: "/billing/manual-operations/record-payment",
            label: "Add Payment",
            permission: "students.view"
          },
          {
            routeName: "billing.manual.penalties.create",
            fallback: "/billing/manual-operations/post-penalty",
            label: "Add Penalty",
            permission: "students.view"
          },
          {
            routeName: "billing.manual.adjustments.create",
            fallback: "/billing/manual-operations/apply-adjustment",
            label: "Add Adjustment",
            permission: "students.view"
          },
          {
            routeName: "billing.ledger.index",
            fallback: "/billing/ledger",
            label: "Financial Ledger",
            permission: "billing.ledger.view"
          }
        ]
      }
    ]
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
      "permissions.create"
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
            permission: "staffs.view"
          },
          {
            routeName: "staffs.create",
            fallback: "/staffs/create",
            label: "Add Staff",
            permission: "staffs.create"
          }
        ]
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
            permission: "roles.view"
          },
          {
            routeName: "roles.create",
            fallback: "/roles/create",
            label: "Add Role",
            permission: "roles.create"
          },
          {
            routeName: "permissions.index",
            fallback: "/permissions",
            label: "Permissions",
            permission: "permissions.view"
          },
          {
            routeName: "permissions.create",
            fallback: "/permissions/create",
            label: "Add Permission",
            permission: "permissions.create"
          }
        ]
      }
    ]
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
            permission: "roles.view"
          },
          {
            routeName: "settings.logs.index",
            fallback: "/settings/logs",
            label: "Log Files",
            permission: "roles.view"
          },
          {
            routeName: "settings.user-monitor.index",
            fallback: "/settings/user-monitor",
            label: "User Monitor",
            permission: "roles.view"
          },
          {
            routeName: "settings.security.index",
            fallback: "/settings/security",
            label: "Security Monitor",
            permission: "roles.view"
          }
        ]
      },
      {
        key: "integrations",
        label: "Integrations",
        icon: "grid",
        children: []
      }
    ]
  }
];
const STUDENT_NAV_ITEMS = [
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
            activeRouteNames: ["student.course-units.index"]
          },
          {
            routeName: "student.results.index",
            fallback: "/student/results",
            label: "View Results",
            activeRouteNames: ["student.results.index"]
          }
        ]
      }
    ]
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
              "student.fee-statements.show"
            ]
          }
        ]
      }
    ]
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
            activeRouteNames: ["profile.edit"]
          }
        ]
      }
    ]
  }
];
const ICONS = {
  dashboard: /* @__PURE__ */ jsx(LayoutDashboard, { className: "w-5 h-5 shrink-0" }),
  reports: /* @__PURE__ */ jsx(BarChart3, { className: "w-5 h-5 shrink-0" }),
  academicSetup: /* @__PURE__ */ jsx(School, { className: "w-5 h-5 shrink-0" }),
  academicOps: /* @__PURE__ */ jsx(CalendarClock, { className: "w-5 h-5 shrink-0" }),
  academic: /* @__PURE__ */ jsx(CalendarClock, { className: "w-5 h-5 shrink-0" }),
  students: /* @__PURE__ */ jsx(GraduationCap, { className: "w-5 h-5 shrink-0" }),
  financeBilling: /* @__PURE__ */ jsx(Landmark, { className: "w-5 h-5 shrink-0" }),
  staffAccess: /* @__PURE__ */ jsx(UserCog, { className: "w-5 h-5 shrink-0" }),
  settings: /* @__PURE__ */ jsx(Settings, { className: "w-5 h-5 shrink-0" }),
  transfer: /* @__PURE__ */ jsx(ArrowRightLeft, { className: "w-5 h-5 shrink-0" }),
  book: /* @__PURE__ */ jsx(BookOpen, { className: "w-5 h-5 shrink-0" }),
  department: /* @__PURE__ */ jsx(Building2, { className: "w-5 h-5 shrink-0" }),
  courses: /* @__PURE__ */ jsx(BookMarked, { className: "w-5 h-5 shrink-0" }),
  grid: /* @__PURE__ */ jsx(LayoutGrid, { className: "w-5 h-5 shrink-0" }),
  roles: /* @__PURE__ */ jsx(ShieldCheck, { className: "w-5 h-5 shrink-0" }),
  staff: /* @__PURE__ */ jsx(UserRound, { className: "w-5 h-5 shrink-0" }),
  users: /* @__PURE__ */ jsx(UsersRound, { className: "w-5 h-5 shrink-0" }),
  finance: /* @__PURE__ */ jsx(Wallet, { className: "w-5 h-5 shrink-0" })
};
const safeRoute = (name, fallback) => route().has(name) ? route(name) : fallback;
const isRouteCurrent = (name, fallback, url, activeRouteNames = []) => {
  const routeNames = [name, ...activeRouteNames].filter(Boolean);
  if (routeNames.some((routeName) => route().has(routeName) && route().current(routeName))) {
    return true;
  }
  return url === fallback;
};
const filterChildren = (children, can) => children.map((child) => {
  if (!child.children) {
    return child;
  }
  return {
    ...child,
    children: filterChildren(child.children, can)
  };
}).filter((child) => {
  if (child.children) {
    return child.children.length > 0;
  }
  return !child.permission || can(child.permission);
});
const filterNav = (items, can) => items.map((item) => ({
  ...item,
  children: filterChildren(item.children, can)
})).filter(
  (item) => item.children.length > 0 && (!item.permissions || item.permissions.some((p) => can(p)))
);
const SIDEBAR_SCROLL_KEY = "sidebar-scroll-top";
function Sidebar({
  collapsed,
  setCollapsed,
  mobileOpen,
  setMobileOpen
}) {
  const { url } = usePage();
  const { can, hasRole } = useRbac();
  const dashboardRouteName = hasRole("student") ? "student.dashboard" : hasRole("trainer") && !hasRole("admin") && !hasRole("hod") ? "trainer.dashboard" : "admin.dashboard";
  const dashboardFallback = hasRole("student") ? "/student/dashboard" : hasRole("trainer") && !hasRole("admin") && !hasRole("hod") ? "/trainer/dashboard" : "/admin/dashboard";
  const dashboardLabel = hasRole("student") ? "Student Dashboard" : hasRole("trainer") && !hasRole("admin") && !hasRole("hod") ? "Trainer Dashboard" : "Admin Dashboard";
  const navItems = hasRole("student") ? STUDENT_NAV_ITEMS : STAFF_NAV_ITEMS;
  const visibleNav = filterNav(navItems, can);
  const marksQuickLinks = [
    ...hasRole("admin") ? [
      {
        label: "Staff Marks",
        routeName: "academic.marks.index",
        fallback: "/academic/marks"
      }
    ] : [],
    ...hasRole("admin") || hasRole("hod") ? [
      {
        label: "HOD Marks",
        routeName: "academic.marks.publish.index",
        fallback: "/academic/marks/publish"
      }
    ] : [],
    ...hasRole("trainer") ? [
      {
        label: "Grade Students",
        routeName: "academic.marks.index",
        fallback: "/academic/marks"
      }
    ] : [],
    ...hasRole("trainer") ? [
      {
        label: "Unit Marksheet",
        routeName: "academic.marks.marksheet.index",
        fallback: "/academic/marks/marksheet"
      }
    ] : []
  ];
  const timetableQuickLinks = [
    ...hasRole("hod") ? [
      {
        label: "Create Timetable",
        routeName: "academic.timetables.hod.create",
        fallback: "/academic/timetables/create/hod"
      },
      {
        label: "View Timetable",
        routeName: "academic.timetables.index",
        fallback: "/academic/timetables"
      }
    ] : [],
    ...hasRole("trainer") ? [
      {
        label: "My Timetable",
        routeName: "academic.timetables.index",
        fallback: "/academic/timetables"
      }
    ] : []
  ];
  const quickSections = [
    ...timetableQuickLinks.length ? [
      {
        key: "timetable-workspace",
        label: "Timetable Workspace",
        icon: "academic",
        basePath: "/academic/timetables",
        children: timetableQuickLinks
      }
    ] : [],
    ...!hasRole("student") && marksQuickLinks.length ? [
      {
        key: "marks-workspace",
        label: "Marks Workspace",
        icon: "academic",
        basePath: "/academic/marks",
        children: marksQuickLinks
      }
    ] : []
  ];
  const isChildActive = (child) => {
    if (child.children) {
      return child.children.some(isChildActive);
    }
    return isRouteCurrent(
      child.routeName,
      child.fallback,
      url,
      child.activeRouteNames
    );
  };
  const isSectionActive = ({ basePath, children }) => url.startsWith(basePath) || children.some(isChildActive);
  const getActiveKey = () => [...quickSections, ...visibleNav].find(isSectionActive)?.key ?? null;
  const [openMenu, setOpenMenu] = useState(getActiveKey);
  const navRef = useRef(null);
  useEffect(() => {
    const active = getActiveKey();
    if (active) setOpenMenu(active);
  }, [url]);
  useEffect(() => {
    if (!navRef.current || typeof window === "undefined") {
      return;
    }
    const storedScrollTop = window.sessionStorage.getItem(
      SIDEBAR_SCROLL_KEY
    );
    if (storedScrollTop !== null) {
      navRef.current.scrollTop = Number(storedScrollTop);
    }
  }, [url, collapsed, mobileOpen]);
  const closeMobile = () => mobileOpen && setMobileOpen(false);
  const preserveSidebarScroll = () => {
    if (!navRef.current || typeof window === "undefined") {
      return;
    }
    window.sessionStorage.setItem(
      SIDEBAR_SCROLL_KEY,
      String(navRef.current.scrollTop)
    );
  };
  const handleSidebarLinkClick = () => {
    preserveSidebarScroll();
    closeMobile();
  };
  const toggleMenu = (key) => setOpenMenu((prev) => prev === key ? null : key);
  const isDashboardActive = isRouteCurrent("dashboard", "/dashboard", url) || isRouteCurrent(dashboardRouteName, dashboardFallback, url);
  const renderNestedSection = ({ key, label, icon, basePath, children }) => {
    const isOpen = openMenu === key;
    const parentActive = isSectionActive({ basePath, children });
    const isSingle = children.length === 1 && !children[0].children;
    if (isSingle) {
      const { routeName, fallback } = children[0];
      return /* @__PURE__ */ jsx("div", { className: "border-b border-white/5", children: /* @__PURE__ */ jsxs(
        Link,
        {
          href: safeRoute(routeName, fallback),
          onClick: handleSidebarLinkClick,
          title: collapsed ? label : void 0,
          className: `flex min-h-12 w-full items-center gap-3 px-4 text-sm transition ${parentActive ? "bg-emerald-500 text-white" : "text-zinc-400 hover:bg-white/5 hover:text-white"}`,
          children: [
            ICONS[icon],
            !collapsed && /* @__PURE__ */ jsx("span", { className: "truncate", children: label })
          ]
        }
      ) }, key);
    }
    return /* @__PURE__ */ jsxs("div", { className: "border-b border-white/5", children: [
      /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: () => toggleMenu(key),
          title: collapsed ? label : void 0,
          className: `flex min-h-12 w-full items-center justify-between gap-3 px-4 text-sm transition ${parentActive ? "bg-emerald-500 text-white" : "text-zinc-400 hover:bg-white/5 hover:text-white"}`,
          children: [
            /* @__PURE__ */ jsxs("div", { className: "flex min-w-0 items-center gap-3", children: [
              ICONS[icon],
              !collapsed && /* @__PURE__ */ jsx("span", { className: "truncate", children: label })
            ] }),
            !collapsed && /* @__PURE__ */ jsx(
              ChevronLeft,
              {
                className: `w-4 h-4 transition-transform duration-300 ${isOpen ? "-rotate-90" : "rotate-0"}`
              }
            )
          ]
        }
      ),
      /* @__PURE__ */ jsx(
        "div",
        {
          className: `overflow-hidden transition-all duration-300 ${isOpen && !collapsed ? "max-h-[80rem] opacity-100" : "max-h-0 opacity-0"}`,
          children: children.map((child) => {
            if (child.children) {
              return /* @__PURE__ */ jsxs("div", { className: "py-2", children: [
                /* @__PURE__ */ jsxs("p", { className: "flex min-h-6 items-center gap-2 px-4 pl-8 pr-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-zinc-500 [&_svg]:h-3.5 [&_svg]:w-3.5 [&_svg]:shrink-0", children: [
                  child.icon ? ICONS[child.icon] : null,
                  /* @__PURE__ */ jsx("span", { className: "truncate", children: child.label })
                ] }),
                child.children.map(
                  ({ routeName: routeName2, fallback: fallback2, label: childLabel2, activeRouteNames }) => /* @__PURE__ */ jsx(
                    NavLink,
                    {
                      href: safeRoute(routeName2, fallback2),
                      label: childLabel2,
                      active: isRouteCurrent(
                        routeName2,
                        fallback2,
                        url,
                        activeRouteNames
                      ),
                      onClick: handleSidebarLinkClick
                    },
                    routeName2
                  )
                )
              ] }, child.key ?? child.label);
            }
            const { routeName, fallback, label: childLabel } = child;
            return /* @__PURE__ */ jsx(
              NavLink,
              {
                href: safeRoute(routeName, fallback),
                label: childLabel,
                active: isRouteCurrent(
                  routeName,
                  fallback,
                  url,
                  child.activeRouteNames
                ),
                onClick: handleSidebarLinkClick
              },
              routeName
            );
          })
        }
      )
    ] }, key);
  };
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(
      "div",
      {
        className: `fixed inset-0 bg-black/40 z-40 transition lg:hidden ${mobileOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`,
        onClick: () => setMobileOpen(false)
      }
    ),
    /* @__PURE__ */ jsxs(
      "aside",
      {
        className: `fixed lg:static inset-y-0 left-0 z-50 flex flex-col bg-[#1b263b] transform transition duration-300  h-screen overflow-hidden  ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"} ${collapsed ? "w-20" : "w-64"}`,
        children: [
          /* @__PURE__ */ jsx("div", { className: "h-20 flex items-center px-5 border-b border-white/5", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsx("div", { className: "min-w-[32px] h-[32px] bg-emerald-500 rounded-lg flex items-center justify-center text-black", children: /* @__PURE__ */ jsx(
              "svg",
              {
                className: "w-4 h-4",
                fill: "currentColor",
                viewBox: "0 0 20 20",
                children: /* @__PURE__ */ jsx("path", { d: "M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3z" })
              }
            ) }),
            !collapsed && /* @__PURE__ */ jsx("span", { className: "font-bold text-white uppercase", children: "Apex" })
          ] }) }),
          /* @__PURE__ */ jsxs(
            "nav",
            {
              ref: navRef,
              onScroll: preserveSidebarScroll,
              className: "flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]",
              children: [
                /* @__PURE__ */ jsx("div", { className: "border-b border-white/5", children: /* @__PURE__ */ jsxs(
                  Link,
                  {
                    href: safeRoute(
                      dashboardRouteName,
                      dashboardFallback
                    ),
                    onClick: handleSidebarLinkClick,
                    title: collapsed ? dashboardLabel : void 0,
                    className: `flex min-h-12 items-center gap-3 px-4 transition ${isDashboardActive ? "bg-emerald-500 text-white" : "text-zinc-400 hover:bg-white/5 hover:text-white"}`,
                    children: [
                      ICONS.dashboard,
                      !collapsed && /* @__PURE__ */ jsx("span", { className: "truncate", children: dashboardLabel })
                    ]
                  }
                ) }),
                quickSections.map(renderNestedSection),
                visibleNav.map(renderNestedSection)
              ]
            }
          ),
          /* @__PURE__ */ jsx("div", { className: "p-3 border-t border-white/5" })
        ]
      }
    )
  ] });
}
const AuthenticatedLayoutContext = createContext(null);
function AuthenticatedLayout({ header, children }) {
  const parentLayout = useContext(AuthenticatedLayoutContext);
  const { flash } = usePage().props;
  const user = usePage().props.auth.user;
  const [open, setOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [pageHeader, setPageHeader] = useState(header ?? null);
  const isLoggingOutRef = useRef(false);
  const logoutSyncSentRef = useRef(false);
  useEffect(() => {
    if (!parentLayout) {
      setPageHeader(header ?? null);
    }
  }, [header, parentLayout]);
  useEffect(() => {
    if (!parentLayout) {
      return void 0;
    }
    parentLayout.setPageHeader(header ?? null);
    return () => {
      parentLayout.setPageHeader(null);
    };
  }, [header, parentLayout]);
  if (parentLayout) {
    return /* @__PURE__ */ jsx(Fragment, { children });
  }
  const logoutRoute = route("logout");
  const loginRoute = route("login");
  const sessionOwnerStorageKey = "auth.sessionOwner";
  const sessionHeartbeatStorageKey = "auth.sessionHeartbeat";
  const sessionHeartbeatIntervalMs = 15e3;
  const getTabStorageKey = () => `auth.activeTabs.${user?.id ?? "guest"}`;
  const getTabIdStorageKey = () => `auth.tabId.${user?.id ?? "guest"}`;
  const readActiveTabs = (storageKey) => {
    try {
      const payload = window.localStorage.getItem(storageKey);
      const parsed = payload ? JSON.parse(payload) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  };
  const writeActiveTabs = (storageKey, tabs) => {
    if (tabs.length === 0) {
      window.localStorage.removeItem(storageKey);
      return;
    }
    window.localStorage.setItem(storageKey, JSON.stringify(tabs));
  };
  const getCsrfToken = () => document.querySelector('meta[name="csrf-token"]')?.content ?? "";
  const notifyLogout = () => {
    if (logoutSyncSentRef.current) {
      return;
    }
    logoutSyncSentRef.current = true;
    window.localStorage.removeItem(sessionOwnerStorageKey);
    window.localStorage.removeItem(sessionHeartbeatStorageKey);
    window.localStorage.setItem(
      "auth.logoutSync",
      JSON.stringify({
        userId: user?.id ?? null,
        at: Date.now()
      })
    );
  };
  const submitBackgroundLogout = () => {
    const csrfToken = getCsrfToken();
    if (!csrfToken) {
      return;
    }
    const body = new FormData();
    body.append("_token", csrfToken);
    if (navigator.sendBeacon) {
      navigator.sendBeacon(logoutRoute, body);
      return;
    }
    fetch(logoutRoute, {
      method: "POST",
      body,
      credentials: "same-origin",
      keepalive: true
    }).catch(() => {
    });
  };
  const removeCurrentTab = ({ logoutIfLast = false } = {}) => {
    if (!user?.id) {
      return;
    }
    const storageKey = getTabStorageKey();
    const tabIdStorageKey = getTabIdStorageKey();
    const tabId = window.sessionStorage.getItem(tabIdStorageKey);
    if (!tabId) {
      return;
    }
    const remainingTabs = readActiveTabs(storageKey).filter(
      (activeTabId) => activeTabId !== tabId
    );
    writeActiveTabs(storageKey, remainingTabs);
    window.sessionStorage.removeItem(tabIdStorageKey);
    if (logoutIfLast && remainingTabs.length === 0 && !isLoggingOutRef.current) {
      notifyLogout();
      submitBackgroundLogout();
    }
  };
  const logout = () => {
    if (isLoggingOutRef.current) {
      return;
    }
    isLoggingOutRef.current = true;
    setIsLoggingOut(true);
    removeCurrentTab();
    notifyLogout();
    router.post(
      logoutRoute,
      {},
      {
        onFinish: () => {
          setIsLoggingOut(false);
        }
      }
    );
  };
  const writeSessionOwner = () => {
    if (!user?.id) {
      return;
    }
    window.localStorage.setItem(
      sessionOwnerStorageKey,
      JSON.stringify({
        userId: user.id,
        name: `${user.first_name ?? ""} ${user.last_name ?? ""}`.trim(),
        email: user.email ?? "",
        at: Date.now()
      })
    );
    window.localStorage.setItem(
      sessionHeartbeatStorageKey,
      String(Date.now())
    );
  };
  useEffect(() => {
    if (flash?.success) {
      toast.success(flash.success);
    }
    if (flash?.error) {
      toast.error(flash.error);
    }
  }, [flash]);
  useEffect(() => {
    if (!user?.id) {
      return void 0;
    }
    const storageKey = getTabStorageKey();
    const tabIdStorageKey = getTabIdStorageKey();
    const existingTabId = window.sessionStorage.getItem(tabIdStorageKey);
    const tabId = existingTabId ?? `${user.id}-${Date.now()}-${Math.random()}`;
    const activeTabs = readActiveTabs(storageKey);
    if (!existingTabId) {
      window.sessionStorage.setItem(tabIdStorageKey, tabId);
    }
    if (!activeTabs.includes(tabId)) {
      writeActiveTabs(storageKey, [...activeTabs, tabId]);
    }
    writeSessionOwner();
    const heartbeatInterval = window.setInterval(() => {
      writeSessionOwner();
    }, sessionHeartbeatIntervalMs);
    const handlePageHide = () => {
      removeCurrentTab({ logoutIfLast: true });
    };
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        writeSessionOwner();
      }
    };
    const handleStorage = (event) => {
      if (event.key !== "auth.logoutSync" || !event.newValue) {
        return;
      }
      try {
        const payload = JSON.parse(event.newValue);
        if (payload.userId === user.id) {
          removeCurrentTab();
          window.location.assign(loginRoute);
        }
      } catch {
        window.location.assign(loginRoute);
      }
    };
    window.addEventListener("pagehide", handlePageHide);
    window.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("storage", handleStorage);
    return () => {
      window.clearInterval(heartbeatInterval);
      window.removeEventListener("pagehide", handlePageHide);
      window.removeEventListener(
        "visibilitychange",
        handleVisibilityChange
      );
      window.removeEventListener("storage", handleStorage);
    };
  }, [loginRoute, sessionHeartbeatIntervalMs, user?.id]);
  return /* @__PURE__ */ jsx(AuthenticatedLayoutContext.Provider, { value: { setPageHeader }, children: /* @__PURE__ */ jsxs("div", { className: "flex min-h-screen bg-[#F8F9FA] text-zinc-900", children: [
    /* @__PURE__ */ jsx(
      Sidebar,
      {
        collapsed,
        setCollapsed,
        mobileOpen,
        setMobileOpen
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "flex-1 flex flex-col h-screen overflow-hidden", children: [
      /* @__PURE__ */ jsxs("header", { className: "w-full h-20 shrink-0 bg-white border-b border-zinc-200 flex items-center px-6 sticky top-0 z-20", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => setMobileOpen(true),
            className: "p-2.5 mr-4 rounded-xl hover:bg-zinc-50 text-zinc-400 transition-all hover:text-emerald-600 active:scale-95 lg:hidden",
            children: /* @__PURE__ */ jsx(
              "svg",
              {
                className: "w-6 h-6",
                fill: "none",
                stroke: "currentColor",
                viewBox: "0 0 24 24",
                strokeWidth: "2.5",
                children: /* @__PURE__ */ jsx(
                  "path",
                  {
                    strokeLinecap: "round",
                    strokeLinejoin: "round",
                    d: "M4 6h16M4 12h16M4 18h16"
                  }
                )
              }
            )
          }
        ),
        /* @__PURE__ */ jsxs("div", { className: "ml-auto flex items-center gap-6 relative", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-lg text-xs font-bold border border-emerald-100", children: [
            /* @__PURE__ */ jsxs("span", { className: "relative flex h-2 w-2", children: [
              /* @__PURE__ */ jsx("span", { className: "animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" }),
              /* @__PURE__ */ jsx("span", { className: "relative inline-flex rounded-full h-2 w-2 bg-emerald-500" })
            ] }),
            "Live Updates"
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => setOpen(!open),
                className: "flex items-center gap-3 pl-4 border-l border-zinc-200",
                children: /* @__PURE__ */ jsx("div", { className: "w-9 h-9 rounded-full bg-emerald-500 text-white flex items-center justify-center text-sm font-bold", children: user?.last_name?.charAt(0) })
              }
            ),
            open && /* @__PURE__ */ jsxs("div", { className: "absolute right-0 mt-2 w-52 bg-white border border-zinc-200 rounded-xl shadow-lg overflow-hidden z-50", children: [
              /* @__PURE__ */ jsxs("div", { className: "px-4 py-3 border-b border-zinc-100", children: [
                /* @__PURE__ */ jsxs("p", { className: "text-sm font-semibold text-zinc-800 truncate", children: [
                  user?.last_name,
                  " ",
                  user?.first_name
                ] }),
                /* @__PURE__ */ jsx("p", { className: "text-xs text-zinc-500 truncate", children: user?.email })
              ] }),
              /* @__PURE__ */ jsx("div", { className: "p-1", children: /* @__PURE__ */ jsxs(
                "button",
                {
                  onClick: logout,
                  disabled: isLoggingOut,
                  className: "w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition",
                  children: [
                    /* @__PURE__ */ jsx(
                      "svg",
                      {
                        className: "w-4 h-4",
                        fill: "none",
                        stroke: "currentColor",
                        strokeWidth: "2",
                        viewBox: "0 0 24 24",
                        children: /* @__PURE__ */ jsx(
                          "path",
                          {
                            strokeLinecap: "round",
                            strokeLinejoin: "round",
                            d: "M17 16l4-4m0 0l-4-4m4 4H7"
                          }
                        )
                      }
                    ),
                    isLoggingOut ? "Logging out..." : "Logout"
                  ]
                }
              ) })
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsx("main", { className: "flex-1 overflow-y-auto mb-8 w-full", children: /* @__PURE__ */ jsxs("div", { className: "px-10 pt-4", children: [
        pageHeader && /* @__PURE__ */ jsx("div", { className: "mb-8", children: pageHeader }),
        children
      ] }) }),
      /* @__PURE__ */ jsx(
        ToastContainer,
        {
          position: "top-right",
          autoClose: 5e3,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "light"
        }
      )
    ] })
  ] }) });
}
const withAuthenticatedLayout = (layoutProps = {}) => (page) => /* @__PURE__ */ jsx(AuthenticatedLayout, { ...layoutProps, children: page });
async function resolvePageComponent(path, pages) {
  for (const p of Array.isArray(path) ? path : [path]) {
    const page = pages[p];
    if (typeof page === "undefined") {
      continue;
    }
    return typeof page === "function" ? page() : page;
  }
  throw new Error(`Page not found: ${path}`);
}
const appName = "Laravel";
createInertiaApp({
  title: (title) => `${title} - ${appName}`,
  resolve: (name) => resolvePageComponent(
    `./Pages/${name}.jsx`,
    /* @__PURE__ */ Object.assign({ "./Pages/Academic/Exams.jsx": () => import("./assets/Exams-B1m8nPBN.js"), "./Pages/Academic/Schedules.jsx": () => import("./assets/Schedules-dezb1yBk.js"), "./Pages/Academic/Timetables/Create.jsx": () => import("./assets/Create-T42auL8e.js"), "./Pages/Academic/Timetables/CreateHod.jsx": () => import("./assets/CreateHod-Dex4Pk-B.js"), "./Pages/Academic/Timetables/Edit.jsx": () => import("./assets/Edit-GSOzp60m.js"), "./Pages/Academic/Timetables/Index.jsx": () => import("./assets/Index-BV8SaWar.js"), "./Pages/AcademicSessionEnrollments/Create.jsx": () => import("./assets/Create-BCmpV9bR.js"), "./Pages/AcademicSessionEnrollments/Edit.jsx": () => import("./assets/Edit-DrMik-k4.js"), "./Pages/AcademicSessionEnrollments/Index.jsx": () => import("./assets/Index-Cmj7ycGq.js"), "./Pages/AcademicSessions/Create.jsx": () => import("./assets/Create-ukL_Dqqs.js"), "./Pages/AcademicSessions/Edit.jsx": () => import("./assets/Edit-DhK3Ulye.js"), "./Pages/AcademicSessions/Index.jsx": () => import("./assets/Index-Jqo9-tvx.js"), "./Pages/AcademicYears/Create.jsx": () => import("./assets/Create-Ch8SMVNZ.js"), "./Pages/AcademicYears/Edit.jsx": () => import("./assets/Edit-D-Qt62Uk.js"), "./Pages/AcademicYears/Index.jsx": () => import("./assets/Index-DB4SRLhh.js"), "./Pages/Auth/ConfirmPassword.jsx": () => import("./assets/ConfirmPassword-1ZGPxF5n.js"), "./Pages/Auth/ForgotPassword.jsx": () => import("./assets/ForgotPassword-wdpr9QK9.js"), "./Pages/Auth/Login.jsx": () => import("./assets/Login-CTvY0kss.js"), "./Pages/Auth/Register.jsx": () => import("./assets/Register-BybKZBmQ.js"), "./Pages/Auth/ResetPassword.jsx": () => import("./assets/ResetPassword-pobg1EMW.js"), "./Pages/Auth/VerifyEmail.jsx": () => import("./assets/VerifyEmail-BH-rQcLd.js"), "./Pages/Billing/BulkOperations.jsx": () => import("./assets/BulkOperations-QMj9YLW4.js"), "./Pages/Billing/InvoiceCreate.jsx": () => import("./assets/InvoiceCreate-CKqDoIJw.js"), "./Pages/Billing/InvoiceIndex.jsx": () => import("./assets/InvoiceIndex-m5GZOBt5.js"), "./Pages/Billing/InvoiceShow.jsx": () => import("./assets/InvoiceShow-DwKeE6Uh.js"), "./Pages/Billing/LedgerIndex.jsx": () => import("./assets/LedgerIndex--C8ZWjqS.js"), "./Pages/Billing/ManualOperations/ActionCard.jsx": () => import("./assets/ActionCard-BqjP59Fa.js"), "./Pages/Billing/ManualOperations/AdditionalInvoice.jsx": () => import("./assets/AdditionalInvoice-DKhbB1tc.js"), "./Pages/Billing/ManualOperations/AdditionalInvoiceForm.jsx": () => import("./assets/AdditionalInvoiceForm-DiHfGv3A.js"), "./Pages/Billing/ManualOperations/ApplyAdjustment.jsx": () => import("./assets/ApplyAdjustment-n9-bXE3Y.js"), "./Pages/Billing/ManualOperations/ApplyAdjustmentForm.jsx": () => import("./assets/ApplyAdjustmentForm--k9NWWrx.js"), "./Pages/Billing/ManualOperations/Fields.jsx": () => import("./assets/Fields-CKoWvqxo.js"), "./Pages/Billing/ManualOperations/FormScaffold.jsx": () => import("./assets/FormScaffold-pJj3vvjR.js"), "./Pages/Billing/ManualOperations/Index.jsx": () => import("./assets/Index-0kDLJb9F.js"), "./Pages/Billing/ManualOperations/PostPenalty.jsx": () => import("./assets/PostPenalty-DwOyG7t2.js"), "./Pages/Billing/ManualOperations/PostPenaltyForm.jsx": () => import("./assets/PostPenaltyForm-EsMiyZ33.js"), "./Pages/Billing/ManualOperations/RecordPayment.jsx": () => import("./assets/RecordPayment-DfPMnhH1.js"), "./Pages/Billing/ManualOperations/RecordPaymentForm.jsx": () => import("./assets/RecordPaymentForm-B5ZnjX-E.js"), "./Pages/Billing/StudentStatements/Index.jsx": () => import("./assets/Index-_VEkGCeO.js"), "./Pages/Billing/StudentStatements/Show.jsx": () => import("./assets/Show-B6ltZWor.js"), "./Pages/CertificationLevels/Create.jsx": () => import("./assets/Create-Cq39Bsiw.js"), "./Pages/CertificationLevels/Edit.jsx": () => import("./assets/Edit-CNtHERpV.js"), "./Pages/CertificationLevels/Index.jsx": () => import("./assets/Index-BvURJCp6.js"), "./Pages/CourseEnrollments/Index.jsx": () => import("./assets/Index-CnDm9pfa.js"), "./Pages/CourseVersionMappings/Create.jsx": () => import("./assets/Create-5dDkM8vi.js"), "./Pages/CourseVersionMappings/Edit.jsx": () => import("./assets/Edit-BLlEhkn3.js"), "./Pages/CourseVersionMappings/Index.jsx": () => import("./assets/Index-D90AfQt2.js"), "./Pages/CourseVersionUnits/Create.jsx": () => import("./assets/Create-CoAJSdTv.js"), "./Pages/CourseVersionUnits/Edit.jsx": () => import("./assets/Edit-lOZnUacq.js"), "./Pages/CourseVersionUnits/Index.jsx": () => import("./assets/Index-Dhs3JbAU.js"), "./Pages/CourseVersionUnits/StudentIndex.jsx": () => import("./assets/StudentIndex-DEz0AkPS.js"), "./Pages/CourseVersions/Create.jsx": () => import("./assets/Create-BR4VQngc.js"), "./Pages/CourseVersions/Edit.jsx": () => import("./assets/Edit-qfWnul8I.js"), "./Pages/CourseVersions/Index.jsx": () => import("./assets/Index-CQ_dLlP3.js"), "./Pages/Courses/Create.jsx": () => import("./assets/Create-BjB6XcxG.js"), "./Pages/Courses/Edit.jsx": () => import("./assets/Edit-B7dJSGhm.js"), "./Pages/Courses/Index.jsx": () => import("./assets/Index-DZ6pR0Bs.js"), "./Pages/Courses/Reports.jsx": () => import("./assets/AssignRole-DvSMr2cA.js").then((n) => n.R), "./Pages/Dashboard.jsx": () => import("./assets/Dashboard-BZCDNBOI.js"), "./Pages/Dashboard/AdminDashboard.jsx": () => import("./assets/AdminDashboard-BHc0zbdp.js"), "./Pages/Dashboard/StudentDashboard.jsx": () => import("./assets/StudentDashboard-BHc0zbdp.js"), "./Pages/Dashboard/TrainerDashboard.jsx": () => import("./assets/TrainerDashboard-BuNEBn27.js"), "./Pages/Departments/Create.jsx": () => import("./assets/Create-j2FjZyPz.js"), "./Pages/Departments/Edit.jsx": () => import("./assets/Edit-COqaWPYg.js"), "./Pages/Departments/Index.jsx": () => import("./assets/Index-CvnXWTCF.js"), "./Pages/Error.jsx": () => import("./assets/Error-DR4jYpLA.js"), "./Pages/ExamBodies/Create.jsx": () => import("./assets/Create-FTTa6Wdi.js"), "./Pages/ExamBodies/Edit.jsx": () => import("./assets/Edit-wKjrIYKD.js"), "./Pages/ExamBodies/Index.jsx": () => import("./assets/Index-B8I9UADB.js"), "./Pages/ExamBodies/Reports.jsx": () => import("./assets/Reports-ChPBgaDh.js"), "./Pages/ExamBodies/Workspace.jsx": () => import("./assets/Workspace-mhPWz6j8.js"), "./Pages/Fees/FeeAssignments/BulkAssign.jsx": () => import("./assets/BulkAssign-D9PUESLf.js"), "./Pages/Fees/FeeAssignments/BulkPreview.jsx": () => import("./assets/BulkPreview-CMFKO_CH.js"), "./Pages/Fees/FeeAssignments/Create.jsx": () => import("./assets/Create-Bpa3-qe9.js"), "./Pages/Fees/FeeAssignments/Edit.jsx": () => import("./assets/Edit-BTpa0DM2.js"), "./Pages/Fees/FeeAssignments/Index.jsx": () => import("./assets/Index-EvD-XH0Q.js"), "./Pages/Fees/FeePlanItems/Create.jsx": () => import("./assets/Create-JxbJYoAO.js"), "./Pages/Fees/FeePlanItems/Edit.jsx": () => import("./assets/Edit-B_Jdv06A.js"), "./Pages/Fees/FeePlanItems/EditModal.jsx": () => import("./assets/EditModal-CQT9p4iR.js"), "./Pages/Fees/FeePlanItems/Index.jsx": () => import("./assets/Index-CFk2hv68.js"), "./Pages/Fees/FeePlans/Create.jsx": () => import("./assets/Create-vPp1ifbI.js"), "./Pages/Fees/FeePlans/Edit.jsx": () => import("./assets/Edit-DL3oIb0O.js"), "./Pages/Fees/FeePlans/Index.jsx": () => import("./assets/Index-ZguRCOZV.js"), "./Pages/Grades/Index.jsx": () => import("./assets/Index-BR4BUztg.js"), "./Pages/Grades/Marksheet.jsx": () => import("./assets/Marksheet-B4wn0mwb.js"), "./Pages/Grades/Publish.jsx": () => import("./assets/Publish-DaK0Abq7.js"), "./Pages/Grades/StudentResults.jsx": () => import("./assets/StudentResults-Bn_UEpEp.js"), "./Pages/Home.jsx": () => import("./assets/Home-Cucyz_fC.js"), "./Pages/HostelAllocations/Create.jsx": () => import("./assets/Create-Do-HHZNC.js"), "./Pages/HostelAllocations/Edit.jsx": () => import("./assets/Edit-0uIAvLiW.js"), "./Pages/HostelAllocations/Form.jsx": () => import("./assets/Form-DulB3vP7.js"), "./Pages/HostelAllocations/Index.jsx": () => import("./assets/Index-BFAZgcCe.js"), "./Pages/Hostels/Create.jsx": () => import("./assets/Create-Bz5z_FUs.js"), "./Pages/Hostels/Edit.jsx": () => import("./assets/Edit-CLAMWadh.js"), "./Pages/Hostels/Form.jsx": () => import("./assets/Form-CHozdKvX.js"), "./Pages/Hostels/Index.jsx": () => import("./assets/Index--2Mzrke-.js"), "./Pages/LectureRooms/Create.jsx": () => import("./assets/Create-DfBoEaHt.js"), "./Pages/LectureRooms/Edit.jsx": () => import("./assets/Edit-BMsTwwjs.js"), "./Pages/LectureRooms/Index.jsx": () => import("./assets/Index-4m4aaXfW.js"), "./Pages/Permissions/Create.jsx": () => import("./assets/Create-C-DUp2aL.js"), "./Pages/Permissions/Edit.jsx": () => import("./assets/Edit-O8boCzgR.js"), "./Pages/Permissions/Index.jsx": () => import("./assets/Index-COgpo6RV.js"), "./Pages/Profile/Edit.jsx": () => import("./assets/Edit-D1GLSxeE.js"), "./Pages/Profile/Partials/DeleteUserForm.jsx": () => import("./assets/DeleteUserForm-CCDeHVdY.js"), "./Pages/Profile/Partials/UpdatePasswordForm.jsx": () => import("./assets/UpdatePasswordForm-DG2MrccK.js"), "./Pages/Profile/Partials/UpdateProfileInformationForm.jsx": () => import("./assets/UpdateProfileInformationForm-nHAZAOXH.js"), "./Pages/Reports/Index.jsx": () => import("./assets/Index-VtvngmSd.js"), "./Pages/Roles/AssignRole.jsx": () => import("./assets/AssignRole-DvSMr2cA.js").then((n) => n.A), "./Pages/Roles/Create.jsx": () => import("./assets/Create-C31OTo5z.js"), "./Pages/Roles/Edit.jsx": () => import("./assets/Edit-CTKAplPK.js"), "./Pages/Roles/EditPermissions.jsx": () => import("./assets/EditPermissions-BSflAzLn.js"), "./Pages/Roles/Index.jsx": () => import("./assets/Index-Bgs5LRmk.js"), "./Pages/Settings/LogViewer.jsx": () => import("./assets/LogViewer-BLuGIVGy.js"), "./Pages/Settings/PerformanceDashboard.jsx": () => import("./assets/PerformanceDashboard-9GG_bptN.js"), "./Pages/Settings/SecurityMonitoring.jsx": () => import("./assets/SecurityMonitoring-BZlUF7xa.js"), "./Pages/Settings/UserMonitor.jsx": () => import("./assets/UserMonitor-LToLyFmU.js"), "./Pages/Staff/Dashboard.jsx": () => import("./assets/Dashboard-DrsYoyuP.js"), "./Pages/Staffs/Create.jsx": () => import("./assets/Create-Cu9Qx-3S.js"), "./Pages/Staffs/Edit.jsx": () => import("./assets/Edit-DBJLLddM.js"), "./Pages/Staffs/Forms/EmploymentDetails.jsx": () => import("./assets/EmploymentDetails-DUdUghJS.js"), "./Pages/Staffs/Forms/KinDetails.jsx": () => import("./assets/KinDetails-CWBx3Arp.js"), "./Pages/Staffs/Forms/PersonalDetails.jsx": () => import("./assets/PersonalDetails-BjXfDzu7.js"), "./Pages/Staffs/Index.jsx": () => import("./assets/Index-D39pYyHp.js"), "./Pages/Units/Create.jsx": () => import("./assets/Create-Dl7g0MTd.js"), "./Pages/Units/Edit.jsx": () => import("./assets/Edit-DuEO53Ei.js"), "./Pages/Units/Index.jsx": () => import("./assets/Index-2qQKHqOW.js"), "./Pages/students/CourseChange.jsx": () => import("./assets/CourseChange-CecwQRFY.js"), "./Pages/students/Create.jsx": () => import("./assets/Create-CdGogR7R.js"), "./Pages/students/Edit.jsx": () => import("./assets/Edit-6pBcqcQn.js"), "./Pages/students/Index.jsx": () => import("./assets/Index-CDs_PafS.js") })
  ).then((module) => {
    const page = module.default;
    if (!page.layout && shouldUseAuthenticatedLayout(name)) {
      page.layout = withAuthenticatedLayout();
    }
    return module;
  }),
  setup({ el, App, props }) {
    const root = createRoot(el);
    root.render(/* @__PURE__ */ jsx(App, { ...props }));
  },
  progress: {
    color: "#4B5563"
  }
});
function shouldUseAuthenticatedLayout(name) {
  return !name.startsWith("Auth/");
}
export {
  AuthenticatedLayout as A,
  useRbac as u
};
