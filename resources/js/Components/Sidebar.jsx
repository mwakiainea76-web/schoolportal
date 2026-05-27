import { Link, usePage } from "@inertiajs/react";
import { useState, useEffect } from "react";
import { ChevronLeft } from "lucide-react";
import useRbac from "@/Hooks/UseRBAC";
import NavLink from "./SideBarLink";
import { NAV_ITEMS, ICONS } from "../constants/navItems";
import { safeRoute, isRouteCurrent, filterNav } from "../utils/sidebarHelpers";

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
    const studentQuickLinks = hasRole("student")
        ? [
              {
                  label: "Fee Statements",
                  routeName: "student.fee-statements.index",
                  fallback: "/student/fee-statements",
                  icon: ICONS.finance,
              },
              {
                  label: "Program Units",
                  routeName: "student.program-units.index",
                  fallback: "/student/program-units",
                  icon: ICONS.grid,
              },
              {
                  label: "Results",
                  routeName: "student.results.index",
                  fallback: "/student/results",
                  icon: ICONS.book,
              },
          ]
        : [];
    const hodQuickLinks = hasRole("hod")
        ? [
              {
                  label: "HOD Marks",
                  routeName: "academic.marks.publish.index",
                  fallback: "/academic/marks/publish",
                  icon: ICONS.book,
              },
          ]
        : [];
    const adminQuickLinks = hasRole("admin")
        ? [
              {
                  label: "Staff Marks",
                  routeName: "academic.marks.index",
                  fallback: "/academic/marks",
                  icon: ICONS.academic,
              },
              {
                  label: "HOD Marks",
                  routeName: "academic.marks.publish.index",
                  fallback: "/academic/marks/publish",
                  icon: ICONS.book,
              },
          ]
        : [];

    const visibleNav = filterNav(NAV_ITEMS, can);

    const getActiveKey = () =>
        visibleNav.find(({ basePath }) => url.startsWith(basePath))?.key ??
        null;

    const [openMenu, setOpenMenu] = useState(getActiveKey);

    useEffect(() => {
        const active = getActiveKey();
        if (active) setOpenMenu(active);
    }, [url]);

    const closeMobile = () => mobileOpen && setMobileOpen(false);
    const toggleMenu = (key) =>
        setOpenMenu((prev) => (prev === key ? null : key));
    const isDashboardActive =
        isRouteCurrent("dashboard", "/dashboard", url) ||
        isRouteCurrent(dashboardRouteName, dashboardFallback, url);

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
                <nav className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                    {/* Dashboard */}
                    <div className="border-b border-white/5">
                        <Link
                            href={safeRoute(
                                dashboardRouteName,
                                dashboardFallback,
                            )}
                            onClick={closeMobile}
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

                    {/* Filtered menu */}
                    {studentQuickLinks.map(
                        ({ label, routeName, fallback, icon }) => (
                            <div
                                key={routeName}
                                className="border-b border-white/5"
                            >
                                <Link
                                    href={safeRoute(routeName, fallback)}
                                    onClick={closeMobile}
                                    className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition ${
                                        isRouteCurrent(routeName, fallback, url)
                                            ? "bg-emerald-500 text-white"
                                            : "text-zinc-400 hover:bg-white/5 hover:text-white"
                                    }`}
                                >
                                    {icon}
                                    {!collapsed && <span>{label}</span>}
                                </Link>
                            </div>
                        ),
                    )}
                    {hodQuickLinks.map(
                        ({ label, routeName, fallback, icon }) => (
                            <div
                                key={routeName}
                                className="border-b border-white/5"
                            >
                                <Link
                                    href={safeRoute(routeName, fallback)}
                                    onClick={closeMobile}
                                    className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition ${
                                        isRouteCurrent(routeName, fallback, url)
                                            ? "bg-emerald-500 text-white"
                                            : "text-zinc-400 hover:bg-white/5 hover:text-white"
                                    }`}
                                >
                                    {icon}
                                    {!collapsed && <span>{label}</span>}
                                </Link>
                            </div>
                        ),
                    )}
                    {adminQuickLinks.map(
                        ({ label, routeName, fallback, icon }) => (
                            <div
                                key={routeName}
                                className="border-b border-white/5"
                            >
                                <Link
                                    href={safeRoute(routeName, fallback)}
                                    onClick={closeMobile}
                                    className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition ${
                                        isRouteCurrent(routeName, fallback, url)
                                            ? "bg-emerald-500 text-white"
                                            : "text-zinc-400 hover:bg-white/5 hover:text-white"
                                    }`}
                                >
                                    {icon}
                                    {!collapsed && <span>{label}</span>}
                                </Link>
                            </div>
                        ),
                    )}

                    {visibleNav.map(
                        ({ key, label, icon, basePath, children }) => {
                            const isOpen = openMenu === key;
                            const parentActive = url.startsWith(basePath);
                            const isSingle = children.length === 1;

                            if (isSingle && !collapsed) {
                                const { routeName, fallback } = children[0];
                                return (
                                    <div
                                        key={key}
                                        className="border-b border-white/5"
                                    >
                                        <Link
                                            href={safeRoute(
                                                routeName,
                                                fallback,
                                            )}
                                            onClick={closeMobile}
                                            className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition ${parentActive
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
                                <div
                                    key={key}
                                    className="border-b border-white/5"
                                >
                                    <button
                                        onClick={() => toggleMenu(key)}
                                        className={`w-full flex items-center justify-between px-4 py-3 text-sm transition ${parentActive
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
                                                className={`w-4 h-4 transition-transform duration-300 ${isOpen
                                                    ? "-rotate-90"
                                                    : "rotate-0"
                                                    }`}
                                            />
                                        )}
                                    </button>

                                    <div
                                        className={`overflow-hidden transition-all duration-300 ${isOpen && !collapsed
                                            ? "max-h-96 opacity-100"
                                            : "max-h-0 opacity-0"
                                            }`}
                                    >
                                        {children.map(
                                            ({
                                                routeName,
                                                fallback,
                                                label: childLabel,
                                            }) => (
                                                <NavLink
                                                    key={routeName}
                                                    href={safeRoute(
                                                        routeName,
                                                        fallback,
                                                    )}
                                                    label={childLabel}
                                                    active={isRouteCurrent(
                                                        routeName,
                                                        fallback,
                                                        url,
                                                    )}
                                                    onClick={closeMobile}
                                                />
                                            ),
                                        )}
                                    </div>
                                </div>
                            );
                        },
                    )}
                </nav>

                <div className="p-3 border-t border-white/5" />
            </aside>
        </>
    );
}
