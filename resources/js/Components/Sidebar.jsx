import { Link, usePage } from "@inertiajs/react";
import { useEffect, useRef, useState } from "react";
import { ChevronLeft } from "lucide-react";
import useRbac from "@/Hooks/UseRBAC";
import NavLink from "./SideBarLink";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/Components/ui/collapsible";
import { ScrollArea, ScrollAreaViewport } from "@/Components/ui/scroll-area";
import { Separator } from "@/Components/ui/separator";
import { Sheet, SheetContent } from "@/Components/ui/sheet";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/Components/ui/tooltip";
import {
    STAFF_NAV_ITEMS,
    STUDENT_NAV_ITEMS,
    ICONS,
} from "../constants/navItems";
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

    const dashboardRouteName = "dashboard";
    const dashboardFallback = "/dashboard";
    const dashboardLabel = hasRole("student")
        ? "Student Dashboard"
        : hasRole("bursar") && !hasRole("admin")
          ? "Bursar Dashboard"
          : hasRole("hod") && !hasRole("admin")
            ? "HOD Dashboard"
            : hasRole("trainer") && !hasRole("admin") && !hasRole("hod")
              ? "Trainer Dashboard"
              : hasRole("admin")
                ? "Admin Dashboard"
                : "Staff Dashboard";

    const navItems = hasRole("student") ? STUDENT_NAV_ITEMS : STAFF_NAV_ITEMS;
    const visibleNav = filterNav(navItems, can, hasRole);

    const isChildActive = (child) => {
        if (child.children) return child.children.some(isChildActive);
        return isRouteCurrent(
            child.routeName,
            child.fallback,
            url,
            child.activeRouteNames,
        );
    };

    const isSectionActive = ({ basePath, children }) =>
        url.startsWith(basePath) || children.some(isChildActive);

    const getActiveKey = () => visibleNav.find(isSectionActive)?.key ?? null;

    const [openMenu, setOpenMenu] = useState(getActiveKey);
    const navRef = useRef(null);

    useEffect(() => {
        const active = getActiveKey();
        if (active) setOpenMenu(active);
    }, [url]);

    useEffect(() => {
        if (!navRef.current || typeof window === "undefined") return;
        const storedScrollTop =
            window.sessionStorage.getItem(SIDEBAR_SCROLL_KEY);
        if (storedScrollTop !== null)
            navRef.current.scrollTop = Number(storedScrollTop);
    }, [url, collapsed, mobileOpen]);

    const closeMobile = () => mobileOpen && setMobileOpen(false);

    const preserveSidebarScroll = () => {
        if (!navRef.current || typeof window === "undefined") return;
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

    const MaybeTooltip = ({ label, children }) =>
        collapsed ? (
            <Tooltip>
                <TooltipTrigger asChild>{children}</TooltipTrigger>
                <TooltipContent side="right">{label}</TooltipContent>
            </Tooltip>
        ) : (
            children
        );

    const renderSidebarChildren = (items, depth = 0) =>
        items.map((child) => {
            if (child.children) {
                const headingIndent = depth > 0 ? "pl-12" : "pl-8";
                return (
                    <div key={child.key ?? child.label} className="py-2">
                        <p
                            className={`flex min-h-6 items-center gap-2 px-4 ${headingIndent} pr-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-zinc-500 [&_svg]:h-3.5 [&_svg]:w-3.5 [&_svg]:shrink-0`}
                        >
                            {child.icon ? ICONS[child.icon] : null}
                            <span className="truncate">{child.label}</span>
                        </p>
                        {renderSidebarChildren(child.children, depth + 1)}
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
                        child.activeRouteNames,
                    )}
                    depth={Math.max(0, depth - 1)}
                    onClick={handleSidebarLinkClick}
                />
            );
        });

    const renderNestedSection = ({ key, label, icon, basePath, children }) => {
        const isOpen = openMenu === key;
        const parentActive = isSectionActive({ basePath, children });
        const isSingle = children.length === 1 && !children[0].children;

        if (isSingle) {
            const { routeName, fallback } = children[0];
            return (
                <div key={key}>
                    <MaybeTooltip label={label}>
                        <Link
                            href={safeRoute(routeName, fallback)}
                            onClick={handleSidebarLinkClick}
                            className={`flex min-h-12 w-full items-center gap-3 px-4 text-sm transition ${
                                parentActive
                                    ? "bg-emerald-500 text-white"
                                    : "text-zinc-400 hover:bg-white/5 hover:text-white"
                            }`}
                        >
                            {ICONS[icon]}
                            {!collapsed && (
                                <span className="truncate">{label}</span>
                            )}
                        </Link>
                    </MaybeTooltip>
                    <Separator />
                </div>
            );
        }

        return (
            <Collapsible
                key={key}
                open={isOpen && !collapsed}
                onOpenChange={() => toggleMenu(key)}
            >
                <MaybeTooltip label={label}>
                    <CollapsibleTrigger asChild>
                        <button
                            className={`flex min-h-12 w-full items-center justify-between gap-3 px-4 text-sm transition ${
                                parentActive
                                    ? "bg-emerald-500 text-white"
                                    : "text-zinc-400 hover:bg-white/5 hover:text-white"
                            }`}
                        >
                            <div className="flex min-w-0 items-center gap-3">
                                {ICONS[icon]}
                                {!collapsed && (
                                    <span className="truncate">{label}</span>
                                )}
                            </div>
                            {!collapsed && (
                                <ChevronLeft
                                    className={`w-4 h-4 transition-transform duration-300 ${
                                        isOpen ? "-rotate-90" : "rotate-0"
                                    }`}
                                />
                            )}
                        </button>
                    </CollapsibleTrigger>
                </MaybeTooltip>

                <CollapsibleContent
                    className={`overflow-hidden transition-all duration-300 ${
                        isOpen && !collapsed
                            ? "max-h-[80rem] opacity-100"
                            : "max-h-0 opacity-0"
                    }`}
                >
                    {renderSidebarChildren(children)}
                </CollapsibleContent>
                <Separator />
            </Collapsible>
        );
    };

    const SidebarBody = () => (
        <>
            <div className="h-20 flex items-center px-5">
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

            <Separator />

            <ScrollArea className="flex-1">
                <ScrollAreaViewport
                    ref={navRef}
                    onScroll={preserveSidebarScroll}
                    className="h-full [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
                >
                    <nav>
                        <div>
                            <MaybeTooltip label={dashboardLabel}>
                                <Link
                                    href={safeRoute(
                                        dashboardRouteName,
                                        dashboardFallback,
                                    )}
                                    onClick={handleSidebarLinkClick}
                                    className={`flex min-h-12 items-center gap-3 px-4 transition ${
                                        isDashboardActive
                                            ? "bg-emerald-500 text-white"
                                            : "text-zinc-400 hover:bg-white/5 hover:text-white"
                                    }`}
                                >
                                    {ICONS.dashboard}
                                    {!collapsed && (
                                        <span className="truncate">
                                            {dashboardLabel}
                                        </span>
                                    )}
                                </Link>
                            </MaybeTooltip>
                            <Separator />
                        </div>

                        {visibleNav.map(renderNestedSection)}
                    </nav>
                </ScrollAreaViewport>
            </ScrollArea>

            <Separator />
            <div className="p-3" />
        </>
    );

    return (
        <TooltipProvider delayDuration={150}>
            <>
                <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                    <SheetContent
                        side="left"
                        hideClose
                        className={`p-0 bg-[#1b263b] text-zinc-900 h-screen overflow-hidden border-none ${
                            collapsed ? "w-20" : "w-64"
                        } lg:hidden`}
                    >
                        <SidebarBody />
                    </SheetContent>
                </Sheet>

                <aside
                    className={`hidden lg:flex lg:static inset-y-0 left-0 z-30 flex-col bg-[#1b263b] transition duration-300 h-screen overflow-hidden ${
                        collapsed ? "w-20" : "w-64"
                    }`}
                >
                    <SidebarBody />
                </aside>
            </>
        </TooltipProvider>
    );
}
