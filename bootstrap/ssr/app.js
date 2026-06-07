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
      "curriculums.view",
      "curriculums.create",
      "courses.curriculum-mappings.view",
      "courses.curriculum-mappings.create",
      "students.view"
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
              "departments.edit"
            ]
          }
        ]
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
              "units.edit"
            ]
          }
        ]
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
              "certification-levels.edit"
            ]
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
              "academic.sessions.edit"
            ]
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
              "permissions.edit"
            ]
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
  const timetableQuickLinks = !hasRole("student") && (hasRole("admin") || hasRole("hod") || hasRole("trainer")) ? [
    {
      label: "Timetable Workspace",
      routeName: "academic.timetables.index",
      fallback: "/academic/timetables"
    }
  ] : [];
  const marksQuickLinks = !hasRole("student") && (hasRole("admin") || hasRole("hod") || hasRole("trainer")) ? [
    {
      label: "Marks Workspace",
      routeName: "academic.marks.add.index",
      fallback: "/academic/marks/add"
    }
  ] : [];
  const hostelQuickLinks = hasRole("admin") ? [
    {
      label: "Hostel Workspace",
      routeName: "hostels.index",
      fallback: "/hostels"
    }
  ] : [];
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
    ...marksQuickLinks.length ? [
      {
        key: "marks-workspace",
        label: "Marks Workspace",
        icon: "academic",
        basePath: "/academic/marks",
        children: marksQuickLinks
      }
    ] : [],
    ...hostelQuickLinks.length ? [
      {
        key: "hostel-workspace",
        label: "Hostel Workspace",
        icon: "students",
        basePath: "/hostel",
        children: hostelQuickLinks
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
      /* @__PURE__ */ jsxs("header", { className: "w-full h-14 shrink-0 bg-white border-b border-zinc-200 flex items-center px-6 sticky top-0 z-20", children: [
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
      /* @__PURE__ */ jsx("main", { className: "flex-1 overflow-y-auto mb-8 w-full", children: /* @__PURE__ */ jsxs("div", { className: "px-10 pt-2 ", children: [
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
    /* @__PURE__ */ Object.assign({ "./Pages/Academic/Exams.jsx": () => import("./assets/Exams-B1m8nPBN.js"), "./Pages/Academic/Partials/AcademicCalendarWorkspaceTabs.jsx": () => import("./assets/AcademicCalendarWorkspaceTabs-BIDzA_tP.js"), "./Pages/Academic/Schedules.jsx": () => import("./assets/Schedules-dezb1yBk.js"), "./Pages/Academic/Timetables/Create.jsx": () => import("./assets/Create-BnuHmSBo.js"), "./Pages/Academic/Timetables/CreateHod.jsx": () => import("./assets/CreateHod-BvQAFVhZ.js"), "./Pages/Academic/Timetables/Edit.jsx": () => import("./assets/Edit-BDXbODDH.js"), "./Pages/Academic/Timetables/Index.jsx": () => import("./assets/Index-DEJvJ3oV.js"), "./Pages/Academic/Timetables/Partials/TimetableWorkspaceTabs.jsx": () => import("./assets/TimetableWorkspaceTabs-zPur6baL.js"), "./Pages/AcademicSessionEnrollments/Create.jsx": () => import("./assets/Create-Dy46LRyv.js"), "./Pages/AcademicSessionEnrollments/Edit.jsx": () => import("./assets/Edit-DgTgF42i.js"), "./Pages/AcademicSessionEnrollments/Index.jsx": () => import("./assets/Index-Diw9j2_3.js"), "./Pages/AcademicSessions/Create.jsx": () => import("./assets/Create-mydU9e3m.js"), "./Pages/AcademicSessions/Edit.jsx": () => import("./assets/Edit-BlHYvLIc.js"), "./Pages/AcademicSessions/Index.jsx": () => import("./assets/Index-Dm6ZyV_G.js"), "./Pages/AcademicYears/Create.jsx": () => import("./assets/Create-ByQn9DKP.js"), "./Pages/AcademicYears/Edit.jsx": () => import("./assets/Edit-CsfoZXW7.js"), "./Pages/AcademicYears/Index.jsx": () => import("./assets/Index-DIh_OmAq.js"), "./Pages/Auth/ConfirmPassword.jsx": () => import("./assets/ConfirmPassword-1ZGPxF5n.js"), "./Pages/Auth/ForgotPassword.jsx": () => import("./assets/ForgotPassword-wdpr9QK9.js"), "./Pages/Auth/Login.jsx": () => import("./assets/Login-CTvY0kss.js"), "./Pages/Auth/Register.jsx": () => import("./assets/Register-BybKZBmQ.js"), "./Pages/Auth/ResetPassword.jsx": () => import("./assets/ResetPassword-pobg1EMW.js"), "./Pages/Auth/VerifyEmail.jsx": () => import("./assets/VerifyEmail-BH-rQcLd.js"), "./Pages/Billing/BulkOperations.jsx": () => import("./assets/BulkOperations-DlvPBJW7.js"), "./Pages/Billing/InvoiceCreate.jsx": () => import("./assets/InvoiceCreate-Hr9JDLYR.js"), "./Pages/Billing/InvoiceIndex.jsx": () => import("./assets/InvoiceIndex-BnRrIn9s.js"), "./Pages/Billing/InvoiceShow.jsx": () => import("./assets/InvoiceShow-BHpIXdvz.js"), "./Pages/Billing/LedgerIndex.jsx": () => import("./assets/LedgerIndex-D8OUIrlY.js"), "./Pages/Billing/ManualOperations/ActionCard.jsx": () => import("./assets/ActionCard-BqjP59Fa.js"), "./Pages/Billing/ManualOperations/AdditionalInvoice.jsx": () => import("./assets/AdditionalInvoice-BuAvutXS.js"), "./Pages/Billing/ManualOperations/AdditionalInvoiceForm.jsx": () => import("./assets/AdditionalInvoiceForm-BqvSp69s.js"), "./Pages/Billing/ManualOperations/ApplyAdjustment.jsx": () => import("./assets/ApplyAdjustment-BbD6PTAM.js"), "./Pages/Billing/ManualOperations/ApplyAdjustmentForm.jsx": () => import("./assets/ApplyAdjustmentForm-B6aG1e3T.js"), "./Pages/Billing/ManualOperations/Fields.jsx": () => import("./assets/Fields-CKoWvqxo.js"), "./Pages/Billing/ManualOperations/FormScaffold.jsx": () => import("./assets/FormScaffold-pJj3vvjR.js"), "./Pages/Billing/ManualOperations/Index.jsx": () => import("./assets/Index-CvJSaLK4.js"), "./Pages/Billing/ManualOperations/PostPenalty.jsx": () => import("./assets/PostPenalty-D4Ia0kOS.js"), "./Pages/Billing/ManualOperations/PostPenaltyForm.jsx": () => import("./assets/PostPenaltyForm-D4WuSM6s.js"), "./Pages/Billing/ManualOperations/RecordPayment.jsx": () => import("./assets/RecordPayment-Dmraagrb.js"), "./Pages/Billing/ManualOperations/RecordPaymentForm.jsx": () => import("./assets/RecordPaymentForm-PUQJ6u3J.js"), "./Pages/Billing/StudentStatements/Index.jsx": () => import("./assets/Index-_VEkGCeO.js"), "./Pages/Billing/StudentStatements/Show.jsx": () => import("./assets/Show-DVg8Wjbx.js"), "./Pages/CertificationLevels/Create.jsx": () => import("./assets/Create-g19Z8DFI.js"), "./Pages/CertificationLevels/Edit.jsx": () => import("./assets/Edit-ChDYV3Tk.js"), "./Pages/CertificationLevels/Index.jsx": () => import("./assets/Index-CJh6c3De.js"), "./Pages/CourseEnrollments/Index.jsx": () => import("./assets/Index-D7uB9saM.js"), "./Pages/Courses/Create.jsx": () => import("./assets/Create-B0afqAmS.js"), "./Pages/Courses/Edit.jsx": () => import("./assets/Edit-CP2ValjM.js"), "./Pages/Courses/Index.jsx": () => import("./assets/Index-DlpIxPZe.js"), "./Pages/Courses/Partials/CourseWorkspaceTabs.jsx": () => import("./assets/CourseWorkspaceTabs-D8YFDE67.js"), "./Pages/Courses/Reports.jsx": () => import("./assets/AssignRole-DvSMr2cA.js").then((n) => n.R), "./Pages/CurriculumMappings/Create.jsx": () => import("./assets/Create-C_v25jJ1.js"), "./Pages/CurriculumMappings/Edit.jsx": () => import("./assets/Edit-DLNhTFC-.js"), "./Pages/CurriculumMappings/Index.jsx": () => import("./assets/Index-BTXLodaP.js"), "./Pages/CurriculumUnits/Create.jsx": () => import("./assets/Create-CZ79atWO.js"), "./Pages/CurriculumUnits/Edit.jsx": () => import("./assets/Edit-C1HqMPp4.js"), "./Pages/CurriculumUnits/Index.jsx": () => import("./assets/Index-DPGSH9Kr.js"), "./Pages/CurriculumUnits/StudentIndex.jsx": () => import("./assets/StudentIndex-BzhiDmTz.js"), "./Pages/Curriculums/Create.jsx": () => import("./assets/Create-CxP-8Gvq.js"), "./Pages/Curriculums/Edit.jsx": () => import("./assets/Edit-qTr992vK.js"), "./Pages/Curriculums/Index.jsx": () => import("./assets/Index-BqEf04Br.js"), "./Pages/Dashboard.jsx": () => import("./assets/Dashboard-DhEMK5dD.js"), "./Pages/Dashboard/AdminDashboard.jsx": () => import("./assets/AdminDashboard-B3JYHkAw.js"), "./Pages/Dashboard/StudentDashboard.jsx": () => import("./assets/StudentDashboard-B3JYHkAw.js"), "./Pages/Dashboard/TrainerDashboard.jsx": () => import("./assets/TrainerDashboard-Cp0qWtb1.js"), "./Pages/Departments/Create.jsx": () => import("./assets/Create-Ziu99JjR.js"), "./Pages/Departments/Edit.jsx": () => import("./assets/Edit-YBLE44va.js"), "./Pages/Departments/Index.jsx": () => import("./assets/Index-BWU_iQf0.js"), "./Pages/Departments/Partials/DepartmentWorkspaceTabs.jsx": () => import("./assets/DepartmentWorkspaceTabs-B9DqQFLw.js"), "./Pages/Error.jsx": () => import("./assets/Error-DR4jYpLA.js"), "./Pages/ExamBodies/Create.jsx": () => import("./assets/Create-FTTa6Wdi.js"), "./Pages/ExamBodies/Edit.jsx": () => import("./assets/Edit-wKjrIYKD.js"), "./Pages/ExamBodies/Index.jsx": () => import("./assets/Index-NuYiuZaX.js"), "./Pages/ExamBodies/Reports.jsx": () => import("./assets/Reports-CplBxbNQ.js"), "./Pages/ExamBodies/Workspace.jsx": () => import("./assets/Workspace-CcRa6Y19.js"), "./Pages/Fees/FeeAssignments/BulkAssign.jsx": () => import("./assets/BulkAssign-BHyulwi8.js"), "./Pages/Fees/FeeAssignments/BulkPreview.jsx": () => import("./assets/BulkPreview-B1RxeLEq.js"), "./Pages/Fees/FeeAssignments/Create.jsx": () => import("./assets/Create-CfVNBQnb.js"), "./Pages/Fees/FeeAssignments/Edit.jsx": () => import("./assets/Edit-Dtm13M47.js"), "./Pages/Fees/FeeAssignments/Index.jsx": () => import("./assets/Index-BVN3S9EF.js"), "./Pages/Fees/FeePlanItems/Create.jsx": () => import("./assets/Create-CiPobT0b.js"), "./Pages/Fees/FeePlanItems/Edit.jsx": () => import("./assets/Edit-ghAj3-gY.js"), "./Pages/Fees/FeePlanItems/EditModal.jsx": () => import("./assets/EditModal-DaHT3mDE.js"), "./Pages/Fees/FeePlanItems/Index.jsx": () => import("./assets/Index-DJxWvlt2.js"), "./Pages/Fees/FeePlans/Create.jsx": () => import("./assets/Create-vPp1ifbI.js"), "./Pages/Fees/FeePlans/Edit.jsx": () => import("./assets/Edit-DL3oIb0O.js"), "./Pages/Fees/FeePlans/Index.jsx": () => import("./assets/Index-CMJ9XL2H.js"), "./Pages/Grades/Add.jsx": () => import("./assets/Add-3bEuFWW_.js"), "./Pages/Grades/Index.jsx": () => import("./assets/Index-BW6KivCi.js"), "./Pages/Grades/Marksheet.jsx": () => import("./assets/Marksheet-CZpqOnO5.js"), "./Pages/Grades/Partials/MarksWorkspaceTabs.jsx": () => import("./assets/MarksWorkspaceTabs-DcBwMEdx.js"), "./Pages/Grades/Publish.jsx": () => import("./assets/Publish-CPAayBJv.js"), "./Pages/Grades/StudentResults.jsx": () => import("./assets/StudentResults-CPoyVgQl.js"), "./Pages/Grades/View.jsx": () => import("./assets/View-BM1z2WEd.js"), "./Pages/Home.jsx": () => import("./assets/Home-Cucyz_fC.js"), "./Pages/HostelAllocations/Create.jsx": () => import("./assets/Create-DWnFVkPV.js"), "./Pages/HostelAllocations/Edit.jsx": () => import("./assets/Edit-NuR_o7t-.js"), "./Pages/HostelAllocations/Form.jsx": () => import("./assets/Form-BTOKKuAS.js"), "./Pages/HostelAllocations/Index.jsx": () => import("./assets/Index-BLxjBAsu.js"), "./Pages/Hostels/Create.jsx": () => import("./assets/Create-DpSY4UAP.js"), "./Pages/Hostels/Edit.jsx": () => import("./assets/Edit-C3DmLgNv.js"), "./Pages/Hostels/Form.jsx": () => import("./assets/Form-CHozdKvX.js"), "./Pages/Hostels/Index.jsx": () => import("./assets/Index-DWBEcW3V.js"), "./Pages/Hostels/Partials/HostelWorkspaceTabs.jsx": () => import("./assets/HostelWorkspaceTabs-Ce9MBAen.js"), "./Pages/LectureRooms/Create.jsx": () => import("./assets/Create-C92ZH-3_.js"), "./Pages/LectureRooms/Edit.jsx": () => import("./assets/Edit-0tv2pml8.js"), "./Pages/LectureRooms/Index.jsx": () => import("./assets/Index-BrGnqzw-.js"), "./Pages/Permissions/Create.jsx": () => import("./assets/Create-D4yiLnCO.js"), "./Pages/Permissions/Edit.jsx": () => import("./assets/Edit-Dkx9Ofwj.js"), "./Pages/Permissions/Index.jsx": () => import("./assets/Index-DFe4AE21.js"), "./Pages/Profile/Edit.jsx": () => import("./assets/Edit-BNv-Laor.js"), "./Pages/Profile/Partials/DeleteUserForm.jsx": () => import("./assets/DeleteUserForm-CCDeHVdY.js"), "./Pages/Profile/Partials/UpdatePasswordForm.jsx": () => import("./assets/UpdatePasswordForm-DG2MrccK.js"), "./Pages/Profile/Partials/UpdateProfileInformationForm.jsx": () => import("./assets/UpdateProfileInformationForm-DBBY2A7G.js"), "./Pages/Reports/Index.jsx": () => import("./assets/Index-DhmliLtN.js"), "./Pages/Roles/AssignRole.jsx": () => import("./assets/AssignRole-DvSMr2cA.js").then((n) => n.A), "./Pages/Roles/Create.jsx": () => import("./assets/Create-CRy8Ll8V.js"), "./Pages/Roles/Edit.jsx": () => import("./assets/Edit-DjUOJjwq.js"), "./Pages/Roles/EditPermissions.jsx": () => import("./assets/EditPermissions-DS4vhbFB.js"), "./Pages/Roles/Index.jsx": () => import("./assets/Index-COsp1eUC.js"), "./Pages/Roles/Partials/AccessWorkspaceTabs.jsx": () => import("./assets/AccessWorkspaceTabs-BJjJkDSw.js"), "./Pages/Settings/LogViewer.jsx": () => import("./assets/LogViewer-BLuGIVGy.js"), "./Pages/Settings/PerformanceDashboard.jsx": () => import("./assets/PerformanceDashboard-9GG_bptN.js"), "./Pages/Settings/SecurityMonitoring.jsx": () => import("./assets/SecurityMonitoring-BZlUF7xa.js"), "./Pages/Settings/UserMonitor.jsx": () => import("./assets/UserMonitor-LToLyFmU.js"), "./Pages/Staff/Dashboard.jsx": () => import("./assets/Dashboard-9T4PBJ_T.js"), "./Pages/Staffs/Create.jsx": () => import("./assets/Create-DFV3GVW2.js"), "./Pages/Staffs/Edit.jsx": () => import("./assets/Edit-B_-67gvM.js"), "./Pages/Staffs/Forms/EmploymentDetails.jsx": () => import("./assets/EmploymentDetails-B4WVKVoV.js"), "./Pages/Staffs/Forms/KinDetails.jsx": () => import("./assets/KinDetails-C2wShOKW.js"), "./Pages/Staffs/Forms/PersonalDetails.jsx": () => import("./assets/PersonalDetails-CU4zA6nf.js"), "./Pages/Staffs/Index.jsx": () => import("./assets/Index-CgH-UDS9.js"), "./Pages/students/CourseChange.jsx": () => import("./assets/CourseChange-DiSRFxkY.js"), "./Pages/students/Create.jsx": () => import("./assets/Create-MYlanp53.js"), "./Pages/students/Edit.jsx": () => import("./assets/Edit-BaPzt1Tw.js"), "./Pages/students/Index.jsx": () => import("./assets/Index-CTcTpglP.js") })
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
