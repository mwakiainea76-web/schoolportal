import { Link, usePage } from "@inertiajs/react";
import { useEffect, useRef, useState } from "react";
import { ChevronLeft } from "lucide-react";
import useRbac from "@/Hooks/UseRBAC";
import NavLink from "./SideBarLink";
import { NAV_ITEMS, ICONS } from "../constants/navItems";
import { safeRoute, isRouteCurrent, filterNav } from "../utils/sidebarHelpers";

const SIDEBAR_SCROLL_KEY = "sidebar-scroll-top";

export default function Sidebar({
    collapsed,
    setCollapsed,
    mobileOpen,
    setMobileOpen,
}) {
    const { url } = usePage();
    const { can, hasRole } = useRbac();
    const dashboardRouteName = hasRole("student")
        ? "student.dashboard"
        : "staff.dashboard";
    const dashboardFallback = hasRole("student")
        ? "/student/dashboard"
        : "/staff/dashboard";
    const visibleNav = filterNav(NAV_ITEMS, can);
    const studentQuickLinks = hasRole("student")
        ? [
              {
                  label: "Fee Statements",
                  routeName: "student.fee-statements.index",
                  fallback: "/student/fee-statements",
              },
              {
                  label: "Program Units",
                  routeName: "student.program-units.index",
                  fallback: "/student/program-units",
              },
              {
                  label: "Results",
                  routeName: "student.results.index",
                  fallback: "/student/results",
              },
          ]
        : [];
    const marksQuickLinks = [
        ...(hasRole("admin")
            ? [
                  {
                      label: "Staff Marks",
                      routeName: "academic.marks.index",
                      fallback: "/academic/marks",
                  },
              ]
            : []),
        ...((hasRole("admin") || hasRole("hod"))
            ? [
                  {
                      label: "HOD Marks",
                      routeName: "academic.marks.publish.index",
                      fallback: "/academic/marks/publish",
                  },
              ]
            : []),
        ...((hasRole("admin") || hasRole("hod"))
            ? [
                  {
                      label: "Unit Marksheet",
                      routeName: "academic.marks.marksheet.index",
                      fallback: "/academic/marks/marksheet",
                  },
              ]
            : []),
    ];
    const quickSections = [
        ...(studentQuickLinks.length
            ? [
                  {
                      key: "student-portal",
                      label: "Student Portal",
                      icon: "students",
                      basePath: "/student",
                      children: studentQuickLinks,
                  },
              ]
            : []),
        ...(marksQuickLinks.length
            ? [
                  {
                      key: "marks-workspace",
                      label: "Marks Workspace",
                      icon: "academic",
                      basePath: "/academic/marks",
                      children: marksQuickLinks,
                  },
              ]
            : []),
    ];

    const isChildActive = (child) => {
        if (child.children) {
            return child.children.some(isChildActive);
        }

        return isRouteCurrent(child.routeName, child.fallback, url);
    };

    const isSectionActive = ({ basePath, children }) =>
        url.startsWith(basePath) || children.some(isChildActive);

    const getActiveKey = () =>
        [...quickSections, ...visibleNav].find(isSectionActive)?.key ?? null;

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
            SIDEBAR_SCROLL_KEY,
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
            String(navRef.current.scrollTop),
        );
    };

    const handleSidebarLinkClick = () => {
        preserveSidebarScroll();
        closeMobile();
    };

    const toggleMenu = (key) =>
        setOpenMenu((prev) => (prev === key ? null : key));
    const isDashboardActive =
        isRouteCurrent("dashboard", "/dashboard", url) ||
        isRouteCurrent(dashboardRouteName, dashboardFallback, url);
    const renderNestedSection = ({ key, label, icon, basePath, children }) => {
        const isOpen = openMenu === key;
        const parentActive = isSectionActive({ basePath, children });
        const isSingle = children.length === 1;

        if (isSingle && !collapsed) {
            const { routeName, fallback } = children[0];

            return (
                <div key={key} className="border-b border-white/5">
                    <Link
                        href={safeRoute(routeName, fallback)}
                        onClick={handleSidebarLinkClick}
                        className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition ${
                            parentActive
                                ? "bg-emerald-500 text-white"
                                : "text-zinc-400 hover:bg-white/5 hover:text-white"
                        }`}
                    >
                        {ICONS[icon]}
                        <span>{label}</span>
                    </Link>
                </div>
            );
        }

        return (
            <div key={key} className="border-b border-white/5">
                <button
                    onClick={() => toggleMenu(key)}
                    className={`w-full flex items-center justify-between px-4 py-3 text-sm transition ${
                        parentActive
                            ? "bg-emerald-500 text-white"
                            : "text-zinc-400 hover:bg-white/5 hover:text-white"
                    }`}
                >
                    <div className="flex items-center gap-3">
                        {ICONS[icon]}
                        {!collapsed && <span>{label}</span>}
                    </div>
                    {!collapsed && (
                        <ChevronLeft
                            className={`w-4 h-4 transition-transform duration-300 ${
                                isOpen ? "-rotate-90" : "rotate-0"
                            }`}
                        />
                    )}
                </button>

                <div
                    className={`overflow-hidden transition-all duration-300 ${
                        isOpen && !collapsed
                            ? "max-h-[42rem] opacity-100"
                            : "max-h-0 opacity-0"
                    }`}
                >
                    {children.map((child) => {
                        if (child.children) {
                            return (
                                <div key={child.key ?? child.label} className="py-2">
                                    <p className="flex items-center gap-2 px-10 pb-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-500 [&_svg]:h-3.5 [&_svg]:w-3.5">
                                        {child.icon ? ICONS[child.icon] : null}
                                        {child.label}
                                    </p>
                                    {child.children.map(
                                        ({ routeName, fallback, label: childLabel }) => (
                                            <NavLink
                                                key={routeName}
                                                href={safeRoute(routeName, fallback)}
                                                label={childLabel}
                                                active={isRouteCurrent(
                                                    routeName,
                                                    fallback,
                                                    url,
                                                )}
                                                onClick={handleSidebarLinkClick}
                                            />
                                        ),
                                    )}
                                </div>
                            );
                        }

                        const { routeName, fallback, label: childLabel } = child;

                        return (
                            <NavLink
                                key={routeName}
                                href={safeRoute(routeName, fallback)}
                                label={childLabel}
                                active={isRouteCurrent(
                                    routeName,
                                    fallback,
                                    url,
                                )}
                                onClick={handleSidebarLinkClick}
                            />
                        );
                    })}
                </div>
            </div>
        );
    };

    return (
        <>
            {/* Backdrop */}
            <div
                className={`fixed inset-0 bg-black/40 z-40 transition lg:hidden ${mobileOpen ? "opacity-100" : "opacity-0 pointer-events-none"
                    }`}
                onClick={() => setMobileOpen(false)}
            />

            {/* Sidebar */}
            <aside
                className={`fixed lg:static inset-y-0 left-0 z-50 flex flex-col bg-[#1b263b] transform transition duration-300  h-screen overflow-hidden  ${mobileOpen
                    ? "translate-x-0"
                    : "-translate-x-full lg:translate-x-0"
                    } ${collapsed ? "w-20" : "w-64"}`}
            >
                {/* Logo */}
                <div className="h-20 flex items-center px-5 border-b border-white/5">
                    <div className="flex items-center gap-3">
                        <div className="min-w-[32px] h-[32px] bg-emerald-500 rounded-lg flex items-center justify-center text-black">
                            <svg
                                className="w-4 h-4"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                            >
                                <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3z" />
                            </svg>
                        </div>
                        {!collapsed && (
                            <span className="font-bold text-white uppercase">
                                Apex
                            </span>
                        )}
                    </div>
                </div>

                {/* Nav */}
                <nav
                    ref={navRef}
                    onScroll={preserveSidebarScroll}
                    className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
                >
                    {/* Dashboard */}
                    <div className="border-b border-white/5">
                        <Link
                            href={safeRoute(
                                dashboardRouteName,
                                dashboardFallback,
                            )}
                            onClick={handleSidebarLinkClick}
                            className={`flex items-center px-4 py-3 transition ${isDashboardActive
                                ? "bg-emerald-500 text-white"
                                : "text-zinc-400 hover:bg-white/5 hover:text-white"
                                }`}
                        >
                            {ICONS.dashboard}
                            {!collapsed && (
                                <span className="ml-3">Dashboard</span>
                            )}
                        </Link>
                    </div>

                    {/* Grouped quick sections */}
                    {quickSections.map(renderNestedSection)}

                    {visibleNav.map(renderNestedSection)}
                </nav>

                <div className="p-3 border-t border-white/5" />
            </aside>
        </>
    );
}
