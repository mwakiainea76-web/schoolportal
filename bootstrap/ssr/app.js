import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import axios from "axios";
import { createRoot } from "react-dom/client";
import { usePage, Link, router, createInertiaApp } from "@inertiajs/react";
import { useState, useRef, useEffect, createContext, useContext } from "react";
import { DoorOpen, Clock, Send, Eye, ClipboardPenLine, Presentation, Home, Landmark, UsersRound, UserRound, ShieldCheck, LayoutGrid, BookMarked, Building2, BookOpen, ArrowRightLeft, Settings, UserCog, GraduationCap, CalendarClock, School, BarChart3, LayoutDashboard, ChevronLeft } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
window.axios = axios;
window.axios.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";
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
function NavLink({ href, label, active, onClick, depth = 0 }) {
  const paddingClass = depth > 0 ? "pl-16" : "pl-12";
  return /* @__PURE__ */ jsxs(
    Link,
    {
      href,
      onClick,
      className: `flex min-h-9 items-center gap-3 px-4 ${paddingClass} text-sm leading-5 transition ${active ? "text-emerald-400 font-semibold" : "text-zinc-500 hover:text-zinc-200"}`,
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
  finance: /* @__PURE__ */ jsx(Landmark, { className: "w-5 h-5 shrink-0" }),
  hostel: /* @__PURE__ */ jsx(Home, { className: "w-5 h-5 shrink-0" }),
  presentation: /* @__PURE__ */ jsx(Presentation, { className: "w-5 h-5 shrink-0" }),
  grading: /* @__PURE__ */ jsx(ClipboardPenLine, { className: "w-5 h-5 shrink-0" }),
  view: /* @__PURE__ */ jsx(Eye, { className: "w-5 h-5 shrink-0" }),
  publish: /* @__PURE__ */ jsx(Send, { className: "w-5 h-5 shrink-0" }),
  timetable: /* @__PURE__ */ jsx(Clock, { className: "w-5 h-5 shrink-0" }),
  lectureRoom: /* @__PURE__ */ jsx(DoorOpen, { className: "w-5 h-5 shrink-0" })
};
const ACADEMIC_ACTIVE = [
  "academic.years.index",
  "academic.years.create",
  "academic.years.edit",
  "academic.sessions.index",
  "academic.sessions.create",
  "academic.sessions.edit",
  "academic.sessions.enrollments.index",
  "academic.sessions.enrollments.create",
  "academic.sessions.enrollments.edit"
];
const STAFF_NAV_ITEMS = [
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
            label: "All Curriculums"
          },
          {
            routeName: "curriculums.create",
            fallback: "/curriculums/create",
            label: "Add Curriculum"
          }
        ]
      },
      {
        key: "courses-group",
        label: "Courses",
        children: [
          {
            routeName: "courses.index",
            fallback: "/courses",
            label: "All Courses"
          },
          {
            routeName: "courses.enrollments.index",
            fallback: "/courses/enrollments",
            label: "Course Enrollments"
          },
          {
            routeName: "courses.create",
            fallback: "/courses/create",
            label: "Add Course",
            exceptRoles: ["hod"]
          },
          {
            routeName: "courses.curriculum-mappings.index",
            fallback: "/courses/curriculum-mappings",
            label: "Curriculum Mapping",
            exceptRoles: ["hod"]
          },
          {
            routeName: "courses.curriculum-mappings.create",
            fallback: "/courses/curriculum-mappings/create",
            label: "Add Mapping",
            exceptRoles: ["hod"]
          }
        ]
      },
      {
        key: "units-group",
        label: "Units",
        children: [
          {
            routeName: "units.index",
            fallback: "/units",
            label: "All Units"
          },
          {
            routeName: "units.create",
            fallback: "/units/create",
            label: "Add Unit",
            exceptRoles: ["hod"]
          }
        ]
      }
    ]
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
        label: "View Timetables"
      },
      {
        routeName: "academic.timetables.hod.create",
        fallback: "/academic/timetables/create/hod",
        label: "Add Timetable",
        roles: ["hod"]
      },
      {
        routeName: "academic.timetables.create",
        fallback: "/academic/timetables/create",
        label: "Add Timetable",
        exceptRoles: ["hod"]
      }
    ]
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
        label: "View Marks"
      },
      {
        routeName: "academic.marks.add.index",
        fallback: "/academic/marks/add",
        label: "Add Marks"
      },
      {
        routeName: "academic.marks.marksheet.index",
        fallback: "/academic/marks/marksheet",
        label: "Marksheet"
      },
      {
        routeName: "academic.marks.publish.index",
        fallback: "/academic/marks/publish",
        label: "Publish Marks"
      }
    ]
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
            label: "View Hostels"
          },
          {
            routeName: "hostels.create",
            fallback: "/hostels/create",
            label: "Add Hostel"
          }
        ]
      },
      {
        key: "hostel-allocations",
        label: "Allocations",
        children: [
          {
            routeName: "hostel-allocations.index",
            fallback: "/hostel-allocations",
            label: "View Allocations"
          },
          {
            routeName: "hostel-allocations.create",
            fallback: "/hostel-allocations/create",
            label: "Add Allocation"
          }
        ]
      }
    ]
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
        label: "View Rooms"
      },
      {
        routeName: "lecture-rooms.create",
        fallback: "/lecture-rooms/create",
        label: "Add Room"
      }
    ]
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
        label: "Reporting Dashboard"
      }
    ]
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
        label: "Student Registry"
      },
      {
        routeName: "students.create",
        fallback: "/students/create",
        label: "Admissions",
        permission: "students.create"
      },
      {
        routeName: "students.password-reset.create",
        fallback: "/students/reset-password",
        label: "Reset Password",
        roles: ["admin"]
      },
      {
        routeName: "students.course-change.index",
        fallback: "/students/course-change",
        label: "Transfers"
      }
    ]
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
          { routeName: "billing.ledger.index", fallback: "/billing/ledger", label: "Financial Ledger" }
        ]
      },
      {
        key: "fee-setup",
        label: "Fee Setup",
        children: [
          { routeName: "fees.plans.index", fallback: "/fees/plans", label: "Fee Plans" },
          { routeName: "fees.assignments.index", fallback: "/fees/assignments", label: "Fee Assignments" }
        ]
      }
    ]
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
            activeRouteNames: ACADEMIC_ACTIVE
          },
          {
            routeName: "academic.sessions.enrollments.index",
            fallback: "/academic/sessions/enrollments",
            label: "Enrollments"
          }
        ]
      }
    ]
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
            label: "View Departments"
          },
          {
            routeName: "departments.create",
            fallback: "/departments/create",
            label: "Add Department"
          }
        ]
      },
      {
        routeName: "exam.bodies.index",
        fallback: "/exam-bodies",
        label: "Exam Boards"
      }
    ]
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
        exceptRoles: ["hod"]
      },
      {
        routeName: "staffs.password-reset.create",
        fallback: "/staffs/reset-password",
        label: "Reset Password",
        roles: ["admin"]
      }
    ]
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
            label: "All Roles"
          },
          {
            routeName: "roles.create",
            fallback: "/roles/create",
            label: "Add Role"
          }
        ]
      },
      {
        key: "rbac-permissions",
        label: "Permissions",
        children: [
          {
            routeName: "permissions.index",
            fallback: "/permissions",
            label: "All Permissions"
          },
          {
            routeName: "permissions.create",
            fallback: "/permissions/create",
            label: "Add Permission"
          }
        ]
      }
    ]
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
        label: "Health Metrics"
      },
      {
        routeName: "settings.logs.index",
        fallback: "/settings/logs",
        label: "System Logs"
      },
      {
        routeName: "settings.security.index",
        fallback: "/settings/security",
        label: "Security Audit"
      }
    ]
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
        label: "Profile Settings"
      }
    ]
  }
];
const STUDENT_NAV_ITEMS = [
  {
    key: "academics",
    label: "Academics",
    icon: "academic",
    basePath: "/student",
    children: [
      {
        routeName: "student.course-units.index",
        fallback: "/student/course-units",
        label: "All Units"
      },
      {
        routeName: "student.registered-units.index",
        fallback: "/student/registered-units",
        label: "Registered Units"
      },
      {
        routeName: "student.results.index",
        fallback: "/student/results",
        label: "Examination Results"
      }
    ]
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
        label: "Fee Statements"
      }
    ]
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
        label: "Profile Settings"
      }
    ]
  }
];
const safeRoute = (name, fallback) => route().has(name) ? route(name) : fallback;
const isRouteCurrent = (name, fallback, url, activeRouteNames = []) => {
  const routeNames = [name, ...activeRouteNames].filter(Boolean);
  if (routeNames.some((routeName) => route().has(routeName) && route().current(routeName))) {
    return true;
  }
  return url === fallback;
};
const roleAllowed = (item, hasRole) => {
  if (hasRole("admin")) {
    return true;
  }
  if (item.roles?.length && !item.roles.some((role) => hasRole(role))) {
    return false;
  }
  if (item.exceptRoles?.some((role) => hasRole(role))) {
    return false;
  }
  return true;
};
const filterChildren = (children, can, hasRole) => children.map((child) => {
  if (!child.children) {
    return child;
  }
  return {
    ...child,
    children: filterChildren(child.children, can, hasRole)
  };
}).filter((child) => {
  if (!roleAllowed(child, hasRole)) {
    return false;
  }
  if (child.children) {
    return child.children.length > 0;
  }
  return !child.permission || can(child.permission);
});
const filterNav = (items, can, hasRole) => items.map((item) => ({
  ...item,
  children: filterChildren(item.children, can, hasRole)
})).filter(
  (item) => item.children.length > 0 && roleAllowed(item, hasRole) && (!item.permissions || item.permissions.some((p) => can(p)) || item.roles?.some((role) => hasRole(role)))
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
  const dashboardRouteName = "dashboard";
  const dashboardFallback = "/dashboard";
  const dashboardLabel = hasRole("student") ? "Student Dashboard" : hasRole("bursar") && !hasRole("admin") ? "Bursar Dashboard" : hasRole("hod") && !hasRole("admin") ? "HOD Dashboard" : hasRole("trainer") && !hasRole("admin") && !hasRole("hod") ? "Trainer Dashboard" : hasRole("admin") ? "Admin Dashboard" : "Staff Dashboard";
  const navItems = hasRole("student") ? STUDENT_NAV_ITEMS : STAFF_NAV_ITEMS;
  const visibleNav = filterNav(navItems, can, hasRole);
  const isChildActive = (child) => {
    if (child.children) return child.children.some(isChildActive);
    return isRouteCurrent(
      child.routeName,
      child.fallback,
      url,
      child.activeRouteNames
    );
  };
  const isSectionActive = ({ basePath, children }) => url.startsWith(basePath) || children.some(isChildActive);
  const getActiveKey = () => visibleNav.find(isSectionActive)?.key ?? null;
  const [openMenu, setOpenMenu] = useState(getActiveKey);
  const navRef = useRef(null);
  useEffect(() => {
    const active = getActiveKey();
    if (active) setOpenMenu(active);
  }, [url]);
  useEffect(() => {
    if (!navRef.current || typeof window === "undefined") return;
    const storedScrollTop = window.sessionStorage.getItem(SIDEBAR_SCROLL_KEY);
    if (storedScrollTop !== null)
      navRef.current.scrollTop = Number(storedScrollTop);
  }, [url, collapsed, mobileOpen]);
  const closeMobile = () => mobileOpen && setMobileOpen(false);
  const preserveSidebarScroll = () => {
    if (!navRef.current || typeof window === "undefined") return;
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
  const renderSidebarChildren = (items, depth = 0) => items.map((child) => {
    if (child.children) {
      const headingIndent = depth > 0 ? "pl-12" : "pl-8";
      return /* @__PURE__ */ jsxs("div", { className: "py-2", children: [
        /* @__PURE__ */ jsxs(
          "p",
          {
            className: `flex min-h-6 items-center gap-2 px-4 ${headingIndent} pr-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-zinc-500 [&_svg]:h-3.5 [&_svg]:w-3.5 [&_svg]:shrink-0`,
            children: [
              child.icon ? ICONS[child.icon] : null,
              /* @__PURE__ */ jsx("span", { className: "truncate", children: child.label })
            ]
          }
        ),
        renderSidebarChildren(child.children, depth + 1)
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
        depth: Math.max(0, depth - 1),
        onClick: handleSidebarLinkClick
      },
      routeName
    );
  });
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
          children: renderSidebarChildren(children)
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
        className: `fixed lg:static inset-y-0 left-0 z-50 flex flex-col bg-[#1b263b] transform transition duration-300 h-screen overflow-hidden ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"} ${collapsed ? "w-20" : "w-64"}`,
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
function Navbar({
  open,
  setOpen,
  user,
  logout,
  isLoggingOut,
  setMobileOpen
}) {
  return /* @__PURE__ */ jsxs("header", { className: "w-full h-14 shrink-0 bg-white border-b border-zinc-200 flex items-center px-6 sticky top-0 z-20", children: [
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
  ] });
}
function useAuthTabs(user) {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const isLoggingOutRef = useRef(false);
  const logoutSyncSentRef = useRef(false);
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
  }, [loginRoute, user?.id]);
  return {
    logout,
    isLoggingOut
  };
}
const AuthenticatedLayoutContext = createContext(null);
function AuthenticatedLayout({ header, children }) {
  const parentLayout = useContext(AuthenticatedLayoutContext);
  const { flash } = usePage().props;
  const user = usePage().props.auth.user;
  const [open, setOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [pageHeader, setPageHeader] = useState(header ?? null);
  const { logout, isLoggingOut } = useAuthTabs(user);
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
  useEffect(() => {
    if (flash?.success) {
      toast.success(flash.success);
    }
    if (flash?.error) {
      toast.error(flash.error);
    }
  }, [flash]);
  if (parentLayout) {
    return /* @__PURE__ */ jsx(Fragment, { children });
  }
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
      /* @__PURE__ */ jsx(
        Navbar,
        {
          open,
          setOpen,
          user,
          logout,
          isLoggingOut,
          setMobileOpen
        }
      ),
      /* @__PURE__ */ jsx("main", { className: "flex-1 overflow-y-auto mb-8 w-full", children: /* @__PURE__ */ jsxs("div", { className: "px-10 pt-2", children: [
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
function ApplicationLogo(props) {
  return /* @__PURE__ */ jsx(
    "svg",
    {
      ...props,
      viewBox: "0 0 316 316",
      xmlns: "http://www.w3.org/2000/svg",
      children: /* @__PURE__ */ jsx("path", { d: "M305.8 81.125C305.77 80.995 305.69 80.885 305.65 80.755C305.56 80.525 305.49 80.285 305.37 80.075C305.29 79.935 305.17 79.815 305.07 79.685C304.94 79.515 304.83 79.325 304.68 79.175C304.55 79.045 304.39 78.955 304.25 78.845C304.09 78.715 303.95 78.575 303.77 78.475L251.32 48.275C249.97 47.495 248.31 47.495 246.96 48.275L194.51 78.475C194.33 78.575 194.19 78.725 194.03 78.845C193.89 78.955 193.73 79.045 193.6 79.175C193.45 79.325 193.34 79.515 193.21 79.685C193.11 79.815 192.99 79.935 192.91 80.075C192.79 80.285 192.71 80.525 192.63 80.755C192.58 80.875 192.51 80.995 192.48 81.125C192.38 81.495 192.33 81.875 192.33 82.265V139.625L148.62 164.795V52.575C148.62 52.185 148.57 51.805 148.47 51.435C148.44 51.305 148.36 51.195 148.32 51.065C148.23 50.835 148.16 50.595 148.04 50.385C147.96 50.245 147.84 50.125 147.74 49.995C147.61 49.825 147.5 49.635 147.35 49.485C147.22 49.355 147.06 49.265 146.92 49.155C146.76 49.025 146.62 48.885 146.44 48.785L93.99 18.585C92.64 17.805 90.98 17.805 89.63 18.585L37.18 48.785C37 48.885 36.86 49.035 36.7 49.155C36.56 49.265 36.4 49.355 36.27 49.485C36.12 49.635 36.01 49.825 35.88 49.995C35.78 50.125 35.66 50.245 35.58 50.385C35.46 50.595 35.38 50.835 35.3 51.065C35.25 51.185 35.18 51.305 35.15 51.435C35.05 51.805 35 52.185 35 52.575V232.235C35 233.795 35.84 235.245 37.19 236.025L142.1 296.425C142.33 296.555 142.58 296.635 142.82 296.725C142.93 296.765 143.04 296.835 143.16 296.865C143.53 296.965 143.9 297.015 144.28 297.015C144.66 297.015 145.03 296.965 145.4 296.865C145.5 296.835 145.59 296.775 145.69 296.745C145.95 296.655 146.21 296.565 146.45 296.435L251.36 236.035C252.72 235.255 253.55 233.815 253.55 232.245V174.885L303.81 145.945C305.17 145.165 306 143.725 306 142.155V82.265C305.95 81.875 305.89 81.495 305.8 81.125ZM144.2 227.205L100.57 202.515L146.39 176.135L196.66 147.195L240.33 172.335L208.29 190.625L144.2 227.205ZM244.75 114.995V164.795L226.39 154.225L201.03 139.625V89.825L219.39 100.395L244.75 114.995ZM249.12 57.105L292.81 82.265L249.12 107.425L205.43 82.265L249.12 57.105ZM114.49 184.425L96.13 194.995V85.305L121.49 70.705L139.85 60.135V169.815L114.49 184.425ZM91.76 27.425L135.45 52.585L91.76 77.745L48.07 52.585L91.76 27.425ZM43.67 60.135L62.03 70.705L87.39 85.305V202.545V202.555V202.565C87.39 202.735 87.44 202.895 87.46 203.055C87.49 203.265 87.49 203.485 87.55 203.695V203.705C87.6 203.875 87.69 204.035 87.76 204.195C87.84 204.375 87.89 204.575 87.99 204.745C87.99 204.745 87.99 204.755 88 204.755C88.09 204.905 88.22 205.035 88.33 205.175C88.45 205.335 88.55 205.495 88.69 205.635L88.7 205.645C88.82 205.765 88.98 205.855 89.12 205.965C89.28 206.085 89.42 206.225 89.59 206.325C89.6 206.325 89.6 206.325 89.61 206.335C89.62 206.335 89.62 206.345 89.63 206.345L139.87 234.775V285.065L43.67 229.705V60.135ZM244.75 229.705L148.58 285.075V234.775L219.8 194.115L244.75 179.875V229.705ZM297.2 139.625L253.49 164.795V114.995L278.85 100.395L297.21 89.825V139.625H297.2Z" })
    }
  );
}
function GuestLayout({ children, fullWidth = false }) {
  if (fullWidth) {
    return /* @__PURE__ */ jsx("div", { className: "min-h-screen bg-stone-100", children });
  }
  return /* @__PURE__ */ jsx("div", { className: "min-h-screen bg-stone-100", children: /* @__PURE__ */ jsxs("div", { className: "flex min-h-screen flex-col items-center pt-6 sm:justify-center sm:pt-0", children: [
    /* @__PURE__ */ jsx("div", { className: "mb-6", children: /* @__PURE__ */ jsx(Link, { href: "/", children: /* @__PURE__ */ jsx(ApplicationLogo, { className: "h-20 w-20 fill-current text-gray-500" }) }) }),
    /* @__PURE__ */ jsx("div", { className: "w-full overflow-hidden bg-white px-6 py-8 shadow-[0_24px_60px_rgba(15,23,42,0.12)] ring-1 ring-zinc-100 sm:max-w-md sm:rounded-[2rem]", children })
  ] }) });
}
createInertiaApp({
  resolve: async (name) => {
    const page = await resolvePageComponent(
      `./Pages/${name}.jsx`,
      /* @__PURE__ */ Object.assign({ "./Pages/Academic/Exams.jsx": () => import("./assets/Exams-BmE6O6Uw.js"), "./Pages/Academic/Schedules.jsx": () => import("./assets/Schedules-iGUJMrTn.js"), "./Pages/Academic/Timetables/Create.jsx": () => import("./assets/Create-BE6LD4SI.js"), "./Pages/Academic/Timetables/CreateHod.jsx": () => import("./assets/CreateHod-DO1NzHui.js"), "./Pages/Academic/Timetables/Edit.jsx": () => import("./assets/Edit-CqXGJeuY.js"), "./Pages/Academic/Timetables/Index.jsx": () => import("./assets/Index-Bl98yYw5.js"), "./Pages/AcademicSessionEnrollments/Create.jsx": () => import("./assets/Create-RVsrwSNP.js"), "./Pages/AcademicSessionEnrollments/Edit.jsx": () => import("./assets/Edit-tEt2x9bb.js"), "./Pages/AcademicSessionEnrollments/Index.jsx": () => import("./assets/Index-BjxBAMC0.js"), "./Pages/AcademicSessions/Create.jsx": () => import("./assets/Create-CXbfGxYY.js"), "./Pages/AcademicSessions/Edit.jsx": () => import("./assets/Edit-CQ41snrP.js"), "./Pages/AcademicSessions/Index.jsx": () => import("./assets/Index-D7uGNaII.js"), "./Pages/AcademicYears/Create.jsx": () => import("./assets/Create-Ba9diuG5.js"), "./Pages/AcademicYears/Edit.jsx": () => import("./assets/Edit-CF4ztwkK.js"), "./Pages/AcademicYears/Index.jsx": () => import("./assets/Index-_9Hblr5i.js"), "./Pages/Auth/ConfirmPassword.jsx": () => import("./assets/ConfirmPassword-DFboMMJZ.js"), "./Pages/Auth/ForgotPassword.jsx": () => import("./assets/ForgotPassword-CeJQbQUS.js"), "./Pages/Auth/Login.jsx": () => import("./assets/Login-BBMI-MpV.js"), "./Pages/Auth/Register.jsx": () => import("./assets/Register-a9wNU5mE.js"), "./Pages/Auth/ResetPassword.jsx": () => import("./assets/ResetPassword-xnC8nx0r.js"), "./Pages/Auth/VerifyEmail.jsx": () => import("./assets/VerifyEmail-j-RF3ZYH.js"), "./Pages/Billing/BulkOperations.jsx": () => import("./assets/BulkOperations-50eNhThE.js"), "./Pages/Billing/InvoiceCreate.jsx": () => import("./assets/InvoiceCreate-CCxlzWOZ.js"), "./Pages/Billing/InvoiceIndex.jsx": () => import("./assets/InvoiceIndex-BdGQ8uGD.js"), "./Pages/Billing/InvoiceShow.jsx": () => import("./assets/InvoiceShow-BDNbvR3c.js"), "./Pages/Billing/LedgerIndex.jsx": () => import("./assets/LedgerIndex-BBnuG0G_.js"), "./Pages/Billing/ManualOperations/ActionCard.jsx": () => import("./assets/ActionCard-BqjP59Fa.js"), "./Pages/Billing/ManualOperations/AdditionalInvoice.jsx": () => import("./assets/AdditionalInvoice-CHItFGgV.js"), "./Pages/Billing/ManualOperations/ApplyAdjustment.jsx": () => import("./assets/ApplyAdjustment-Cy_mQHWS.js"), "./Pages/Billing/ManualOperations/Fields.jsx": () => import("./assets/Fields-OQdD82hf.js"), "./Pages/Billing/ManualOperations/FormScaffold.jsx": () => import("./assets/FormScaffold-B_tTLrQJ.js"), "./Pages/Billing/ManualOperations/Index.jsx": () => import("./assets/Index-CfR1q50z.js"), "./Pages/Billing/ManualOperations/PostPenalty.jsx": () => import("./assets/PostPenalty-Ddoc1I0O.js"), "./Pages/Billing/ManualOperations/RecordPayment.jsx": () => import("./assets/RecordPayment-49aCk7MC.js"), "./Pages/Billing/StudentStatements/Index.jsx": () => import("./assets/Index-3rPCgHKW.js"), "./Pages/Billing/StudentStatements/Show.jsx": () => import("./assets/Show-C_Jmv6M3.js"), "./Pages/CertificationLevels/Create.jsx": () => import("./assets/Create-YUqcQhkO.js"), "./Pages/CertificationLevels/Edit.jsx": () => import("./assets/Edit-B4GC9nqQ.js"), "./Pages/CertificationLevels/Index.jsx": () => import("./assets/Index-B8MwRhoP.js"), "./Pages/CourseEnrollments/Index.jsx": () => import("./assets/Index-DymPYrry.js"), "./Pages/Courses/Create.jsx": () => import("./assets/Create-COIojHn2.js"), "./Pages/Courses/Edit.jsx": () => import("./assets/Edit--6Sr_deP.js"), "./Pages/Courses/Index.jsx": () => import("./assets/Index-BkgeVSwf.js"), "./Pages/Courses/Reports.jsx": () => import("./assets/AssignRole-DvSMr2cA.js").then((n) => n.R), "./Pages/CurriculumMappings/Create.jsx": () => import("./assets/Create-BUY3DrpF.js"), "./Pages/CurriculumMappings/Edit.jsx": () => import("./assets/Edit-_-FVGCAX.js"), "./Pages/CurriculumMappings/Index.jsx": () => import("./assets/Index-Gx5-nSpV.js"), "./Pages/CurriculumUnits/Create.jsx": () => import("./assets/Create-sbPufLTP.js"), "./Pages/CurriculumUnits/Edit.jsx": () => import("./assets/Edit-DkeXRPpx.js"), "./Pages/CurriculumUnits/Index.jsx": () => import("./assets/Index-Dkwmuw_4.js"), "./Pages/CurriculumUnits/RegisteredUnits.jsx": () => import("./assets/RegisteredUnits-CROZgz83.js"), "./Pages/CurriculumUnits/StudentIndex.jsx": () => import("./assets/StudentIndex-D-fcpAs1.js"), "./Pages/Curriculums/Create.jsx": () => import("./assets/Create-s8w7r4ks.js"), "./Pages/Curriculums/Edit.jsx": () => import("./assets/Edit-CiV14jfE.js"), "./Pages/Curriculums/Index.jsx": () => import("./assets/Index-BQ-1QTf0.js"), "./Pages/Dashboard.jsx": () => import("./assets/Dashboard-CSduujSr.js"), "./Pages/Dashboards/AdminDashboard.jsx": () => import("./assets/AdminDashboard-CBz6pXa2.js"), "./Pages/Dashboards/BursarDashboard.jsx": () => import("./assets/BursarDashboard-BvQIHkzm.js"), "./Pages/Dashboards/GenericStaffDashboard.jsx": () => import("./assets/GenericStaffDashboard-DTtooqUk.js"), "./Pages/Dashboards/HodDashboard.jsx": () => import("./assets/HodDashboard-D00r_kpV.js"), "./Pages/Dashboards/StudentDashboard.jsx": () => import("./assets/StudentDashboard-BYQRqyEz.js"), "./Pages/Dashboards/TrainerDashboard.jsx": () => import("./assets/TrainerDashboard-vDJdoz9-.js"), "./Pages/Departments/Create.jsx": () => import("./assets/Create-CQZracot.js"), "./Pages/Departments/Edit.jsx": () => import("./assets/Edit-D-cHMov2.js"), "./Pages/Departments/Index.jsx": () => import("./assets/Index-DcvNaljT.js"), "./Pages/Error.jsx": () => import("./assets/Error-DR4jYpLA.js"), "./Pages/ExamBodies/Create.jsx": () => import("./assets/Create-DrovKtzY.js"), "./Pages/ExamBodies/Edit.jsx": () => import("./assets/Edit-D_whKe6w.js"), "./Pages/ExamBodies/Index.jsx": () => import("./assets/Index-C2x328bl.js"), "./Pages/ExamBodies/Reports.jsx": () => import("./assets/Reports-kwTJ2vYY.js"), "./Pages/ExamBodies/Workspace.jsx": () => import("./assets/Workspace-iM0Sb-Ix.js"), "./Pages/Fees/FeeAssignments/BulkAssign.jsx": () => import("./assets/BulkAssign-B3GZ7Gxz.js"), "./Pages/Fees/FeeAssignments/BulkPreview.jsx": () => import("./assets/BulkPreview-FcIBgdoe.js"), "./Pages/Fees/FeeAssignments/Create.jsx": () => import("./assets/Create-DFMy6ubD.js"), "./Pages/Fees/FeeAssignments/Edit.jsx": () => import("./assets/Edit-DWNN95DX.js"), "./Pages/Fees/FeeAssignments/Index.jsx": () => import("./assets/Index-B0fmbHOd.js"), "./Pages/Fees/FeePlanItems/Create.jsx": () => import("./assets/Create-x8vT8iSX.js"), "./Pages/Fees/FeePlanItems/Edit.jsx": () => import("./assets/Edit-LeRMf5HC.js"), "./Pages/Fees/FeePlanItems/EditModal.jsx": () => import("./assets/EditModal-4rOYLyOm.js"), "./Pages/Fees/FeePlanItems/Index.jsx": () => import("./assets/Index-CeQamphM.js"), "./Pages/Fees/FeePlans/Create.jsx": () => import("./assets/Create-CE6_2k3s.js"), "./Pages/Fees/FeePlans/Edit.jsx": () => import("./assets/Edit-Dw-jHX6T.js"), "./Pages/Fees/FeePlans/Index.jsx": () => import("./assets/Index-tTwL52Oy.js"), "./Pages/Grades/Add.jsx": () => import("./assets/Add-DjKlX03u.js"), "./Pages/Grades/Index.jsx": () => import("./assets/Index-D8Up0y2h.js"), "./Pages/Grades/Marksheet.jsx": () => import("./assets/Marksheet-NBwM9sWf.js"), "./Pages/Grades/Publish.jsx": () => import("./assets/Publish-KKlGlgL_.js"), "./Pages/Grades/StudentResults.jsx": () => import("./assets/StudentResults-Cddyw4zO.js"), "./Pages/Grades/View.jsx": () => import("./assets/View-CEfZcJe3.js"), "./Pages/Home.jsx": () => import("./assets/Home-Cucyz_fC.js"), "./Pages/HostelAllocations/Create.jsx": () => import("./assets/Create-V56Qn8vA.js"), "./Pages/HostelAllocations/Edit.jsx": () => import("./assets/Edit-BH41FNvf.js"), "./Pages/HostelAllocations/Form.jsx": () => import("./assets/Form-D39FbGGa.js"), "./Pages/HostelAllocations/Index.jsx": () => import("./assets/Index-DEi_WKhZ.js"), "./Pages/Hostels/Create.jsx": () => import("./assets/Create-DvYsWK2w.js"), "./Pages/Hostels/Edit.jsx": () => import("./assets/Edit-CgjEPDgM.js"), "./Pages/Hostels/Form.jsx": () => import("./assets/Form-CHozdKvX.js"), "./Pages/Hostels/Index.jsx": () => import("./assets/Index-B8kJgjTm.js"), "./Pages/LectureRooms/Create.jsx": () => import("./assets/Create-DQveNAV6.js"), "./Pages/LectureRooms/Edit.jsx": () => import("./assets/Edit-TGpGMBds.js"), "./Pages/LectureRooms/Index.jsx": () => import("./assets/Index-BvsdGlTb.js"), "./Pages/Permissions/Create.jsx": () => import("./assets/Create-S088ZXyN.js"), "./Pages/Permissions/Edit.jsx": () => import("./assets/Edit-3KzXuBij.js"), "./Pages/Permissions/Index.jsx": () => import("./assets/Index-66-jywzP.js"), "./Pages/Profile/Edit.jsx": () => import("./assets/Edit-q5TknVZF.js"), "./Pages/Profile/Partials/DeleteUserForm.jsx": () => import("./assets/DeleteUserForm-CCDeHVdY.js"), "./Pages/Profile/Partials/UpdatePasswordForm.jsx": () => import("./assets/UpdatePasswordForm-DxqsXSv4.js"), "./Pages/Profile/Partials/UpdateProfileInformationForm.jsx": () => import("./assets/UpdateProfileInformationForm-Bkby2YAl.js"), "./Pages/Reports/Index.jsx": () => import("./assets/Index-Tz6yrY7N.js"), "./Pages/Roles/AssignRole.jsx": () => import("./assets/AssignRole-DvSMr2cA.js").then((n) => n.A), "./Pages/Roles/Create.jsx": () => import("./assets/Create-DIP16iKu.js"), "./Pages/Roles/Edit.jsx": () => import("./assets/Edit-ZfwSx9NJ.js"), "./Pages/Roles/EditPermissions.jsx": () => import("./assets/EditPermissions-DNQq172H.js"), "./Pages/Roles/Index.jsx": () => import("./assets/Index-Bs7GVwmg.js"), "./Pages/Settings/LogViewer.jsx": () => import("./assets/LogViewer-NI4wsI3n.js"), "./Pages/Settings/PerformanceDashboard.jsx": () => import("./assets/PerformanceDashboard-DBqVvP83.js"), "./Pages/Settings/SecurityMonitoring.jsx": () => import("./assets/SecurityMonitoring-C3ay2Awn.js"), "./Pages/Settings/UserMonitor.jsx": () => import("./assets/UserMonitor-CQtzCj5D.js"), "./Pages/Staff/Dashboard.jsx": () => import("./assets/Dashboard-C-lpnU8E.js"), "./Pages/Staffs/Create.jsx": () => import("./assets/Create-C8GLLUqu.js"), "./Pages/Staffs/Edit.jsx": () => import("./assets/Edit-C_Y2k4Jb.js"), "./Pages/Staffs/Index.jsx": () => import("./assets/Index-Bp3eRaHw.js"), "./Pages/Staffs/ResetPassword.jsx": () => import("./assets/ResetPassword-DZStubSC.js"), "./Pages/students/CourseChange.jsx": () => import("./assets/CourseChange-ifiAjYWO.js"), "./Pages/students/Create.jsx": () => import("./assets/Create-B3lWIJvo.js"), "./Pages/students/Edit.jsx": () => import("./assets/Edit-Brx2a22c.js"), "./Pages/students/Index.jsx": () => import("./assets/Index-BiRnJpMR.js"), "./Pages/students/ResetPassword.jsx": () => import("./assets/ResetPassword-CeGcemrW.js") })
    );
    if (page.default.layout === void 0) {
      if (name.startsWith("Auth/")) {
        page.default.layout = (page2) => /* @__PURE__ */ jsx(
          GuestLayout,
          {
            children: page2,
            fullWidth: name === "Auth/Login"
          }
        );
      } else {
        page.default.layout = (page2) => /* @__PURE__ */ jsx(AuthenticatedLayout, { children: page2 });
      }
    }
    return page;
  },
  setup({ el, App, props }) {
    createRoot(el).render(/* @__PURE__ */ jsx(App, { ...props }));
  },
  progress: {
    color: "#059669"
  }
});
export {
  AuthenticatedLayout as A,
  useRbac as u
};
