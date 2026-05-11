import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { usePage, Link, router } from "@inertiajs/react";
import { Wallet, GraduationCap, UserRound, ShieldCheck, CalendarRange, LayoutGrid, BookMarked, Building2, BookOpen, LayoutDashboard, ChevronLeft } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
function useRbac() {
  const { props } = usePage();
  const permissions = props.auth?.permissions ?? [];
  const roles = props.auth?.roles ?? [];
  const can = (perm) => permissions.includes(perm);
  const cannot = (perm) => !permissions.includes(perm);
  const hasRole = (role) => roles.includes(role);
  return { permissions, roles, can, cannot, hasRole };
}
function NavLink({ href, label, active, onClick }) {
  return /* @__PURE__ */ jsxs(
    Link,
    {
      href,
      onClick,
      className: `flex items-center pl-10 py-2 text-sm transition ${active ? "text-emerald-400 font-semibold" : "text-zinc-500 hover:text-zinc-200"}`,
      children: [
        /* @__PURE__ */ jsx(
          "span",
          {
            className: `w-1.5 h-1.5 mr-3 rounded-full transition ${active ? "bg-emerald-500" : "bg-zinc-700"}`
          }
        ),
        label
      ]
    }
  );
}
const NAV_ITEMS = [
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
        permission: "departments.view"
      }
    ]
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
        permission: "exam.bodies.view"
      },
      {
        routeName: "/exam-bodies/certification-levels.index",
        fallback: "/exam-bodies/certification-levels",
        label: "Certification Levels",
        permission: "certification.levels.view"
      }
    ]
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
        permission: "courses.view"
      },
      {
        routeName: "curriculum.index",
        fallback: "/curriculum",
        label: "Curriculum",
        permission: "courses.curriculum.view"
      },
      {
        routeName: "courses.curriculum.index",
        fallback: "/courses/curriculum",
        label: "Course Curriculum",
        permission: "courses.curriculum.view"
      },
      {
        routeName: "course.enrollments.index",
        fallback: "/courses/enrollments",
        label: "Course Enrollments",
        permission: "students.view"
      }
    ]
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
        permission: "units.view"
      },
      {
        routeName: "units.curriculum.index",
        fallback: "/units/curriculum",
        label: "Curriculum Units",
        permission: "units.curriculum.view"
      }
    ]
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
        permission: "academic.years.view"
      },
      {
        routeName: "academic.sessions.index",
        fallback: "/academic/sessions",
        label: "Academic Sessions",
        permission: "academic.sessions.view"
      },
      {
        routeName: "academic/sessions/enrollments.index",
        fallback: "/academic/sessions/enrollments",
        label: "Session Enrollments",
        permission: "students.view"
      }
    ]
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
        permission: "students.view"
      },
      {
        routeName: "fees.plans.items.index",
        fallback: "/fees/plans/items",
        label: "Fee plans items",
        permission: "students.view"
      },
      {
        routeName: "fees.assignments.index",
        fallback: "/fees/assignments",
        label: "Fee assignments ",
        permission: "students.view"
      }
    ]
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
        permission: "students.view"
      },
      {
        routeName: "billing.bulk.operations",
        fallback: "/billing/bulk-operations",
        label: "Bulk Operations",
        permission: "students.view"
      },
      {
        routeName: "billing.invoices.create",
        fallback: "/billing/invoices/create",
        label: "Create invoice",
        permission: "students.view"
      }
    ]
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
        permission: "roles.view"
      },
      {
        routeName: "permissions.index",
        fallback: "/permissions",
        label: "Permissions",
        permission: "permissions.view"
      }
    ]
  }
];
const ICONS = {
  dashboard: /* @__PURE__ */ jsx(LayoutDashboard, { className: "w-5 h-5 shrink-0" }),
  book: /* @__PURE__ */ jsx(BookOpen, { className: "w-5 h-5 shrink-0" }),
  // Exam Bodies
  department: /* @__PURE__ */ jsx(Building2, { className: "w-5 h-5 shrink-0" }),
  // Departments
  courses: /* @__PURE__ */ jsx(BookMarked, { className: "w-5 h-5 shrink-0" }),
  // Courses (was FileText)
  grid: /* @__PURE__ */ jsx(LayoutGrid, { className: "w-5 h-5 shrink-0" }),
  // Units (was Grid2X2)
  academic: /* @__PURE__ */ jsx(CalendarRange, { className: "w-5 h-5 shrink-0" }),
  // Academic Calendar (was CalendarDays)
  roles: /* @__PURE__ */ jsx(ShieldCheck, { className: "w-5 h-5 shrink-0" }),
  // Roles & Permissions
  staff: /* @__PURE__ */ jsx(UserRound, { className: "w-5 h-5 shrink-0" }),
  // Staffs (was generic User)
  students: /* @__PURE__ */ jsx(GraduationCap, { className: "w-5 h-5 shrink-0" }),
  // Students — distinct from staff
  finance: /* @__PURE__ */ jsx(Wallet, { className: "w-5 h-5 shrink-0" })
  // Finance (was User — wrong!)
};
const safeRoute = (name, fallback) => route().has(name) ? route(name) : fallback;
const isRouteCurrent = (name, fallback, url) => route().has(name) ? route().current(name) : url === fallback;
const filterNav = (items, can) => items.map((item) => ({
  ...item,
  children: item.children.filter(
    (child) => !child.permission || can(child.permission)
  )
})).filter(
  (item) => item.children.length > 0 && (!item.permissions || item.permissions.some((p) => can(p)))
);
function Sidebar({
  collapsed,
  setCollapsed,
  mobileOpen,
  setMobileOpen
}) {
  const { url } = usePage();
  const { can } = useRbac();
  const visibleNav = filterNav(NAV_ITEMS, can);
  const getActiveKey = () => visibleNav.find(({ basePath }) => url.startsWith(basePath))?.key ?? null;
  const [openMenu, setOpenMenu] = useState(getActiveKey);
  useEffect(() => {
    const active = getActiveKey();
    if (active) setOpenMenu(active);
  }, [url]);
  const closeMobile = () => mobileOpen && setMobileOpen(false);
  const toggleMenu = (key) => setOpenMenu((prev) => prev === key ? null : key);
  const isDashboardActive = isRouteCurrent("dashboard", "/dashboard", url);
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
          /* @__PURE__ */ jsxs("nav", { className: "flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]", children: [
            /* @__PURE__ */ jsx("div", { className: "border-b border-white/5", children: /* @__PURE__ */ jsxs(
              Link,
              {
                href: safeRoute("dashboard", "/dashboard"),
                onClick: closeMobile,
                className: `flex items-center px-4 py-3 transition ${isDashboardActive ? "bg-emerald-500 text-white" : "text-zinc-400 hover:bg-white/5 hover:text-white"}`,
                children: [
                  ICONS.dashboard,
                  !collapsed && /* @__PURE__ */ jsx("span", { className: "ml-3", children: "Dashboard" })
                ]
              }
            ) }),
            visibleNav.map(
              ({ key, label, icon, basePath, children }) => {
                const isOpen = openMenu === key;
                const parentActive = url.startsWith(basePath);
                const isSingle = children.length === 1;
                if (isSingle && !collapsed) {
                  const { routeName, fallback } = children[0];
                  return /* @__PURE__ */ jsx(
                    "div",
                    {
                      className: "border-b border-white/5",
                      children: /* @__PURE__ */ jsxs(
                        Link,
                        {
                          href: safeRoute(
                            routeName,
                            fallback
                          ),
                          onClick: closeMobile,
                          className: `w-full flex items-center gap-3 px-4 py-3 text-sm transition ${parentActive ? "bg-emerald-500 text-white" : "text-zinc-400 hover:bg-white/5 hover:text-white"}`,
                          children: [
                            ICONS[icon],
                            /* @__PURE__ */ jsx("span", { children: label })
                          ]
                        }
                      )
                    },
                    key
                  );
                }
                return /* @__PURE__ */ jsxs(
                  "div",
                  {
                    className: "border-b border-white/5",
                    children: [
                      /* @__PURE__ */ jsxs(
                        "button",
                        {
                          onClick: () => toggleMenu(key),
                          className: `w-full flex items-center justify-between px-4 py-3 text-sm transition ${parentActive ? "bg-emerald-500 text-white" : "text-zinc-400 hover:bg-white/5 hover:text-white"}`,
                          children: [
                            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
                              ICONS[icon],
                              !collapsed && /* @__PURE__ */ jsx("span", { children: label })
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
                          className: `overflow-hidden transition-all duration-300 ${isOpen && !collapsed ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`,
                          children: children.map(
                            ({
                              routeName,
                              fallback,
                              label: childLabel
                            }) => /* @__PURE__ */ jsx(
                              NavLink,
                              {
                                href: safeRoute(
                                  routeName,
                                  fallback
                                ),
                                label: childLabel,
                                active: isRouteCurrent(
                                  routeName,
                                  fallback,
                                  url
                                ),
                                onClick: closeMobile
                              },
                              routeName
                            )
                          )
                        }
                      )
                    ]
                  },
                  key
                );
              }
            )
          ] }),
          /* @__PURE__ */ jsx("div", { className: "p-3 border-t border-white/5" })
        ]
      }
    )
  ] });
}
function AuthenticatedLayout({ header, children }) {
  const { flash } = usePage().props;
  const user = usePage().props.auth.user;
  const [open, setOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  useEffect(() => {
    if (flash?.success) {
      toast.success(flash.success);
    }
    if (flash?.error) {
      toast.error(flash.error);
    }
  }, [flash]);
  return /* @__PURE__ */ jsxs("div", { className: "flex min-h-screen bg-[#F8F9FA] text-zinc-900", children: [
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
                  onClick: () => router.post(route("logout")),
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
                    "Logout"
                  ]
                }
              ) })
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("main", { className: "px-10 pt-4 max-w-7xl flex-1 overflow-y-auto mb-8", children: [
        header && /* @__PURE__ */ jsx("div", { className: "mb-8", children: header }),
        children
      ] }),
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
  ] });
}
export {
  AuthenticatedLayout as A,
  useRbac as u
};
