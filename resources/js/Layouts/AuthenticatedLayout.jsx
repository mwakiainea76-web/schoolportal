import { createContext, useContext, useEffect, useRef, useState } from "react";
import { usePage, router } from "@inertiajs/react";
import Sidebar from "@/Components/Sidebar";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AuthenticatedLayoutContext = createContext(null);

export default function AuthenticatedLayout({ header, children }) {
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
            return undefined;
        }

        parentLayout.setPageHeader(header ?? null);

        return () => {
            parentLayout.setPageHeader(null);
        };
    }, [header, parentLayout]);

    if (parentLayout) {
        return <>{children}</>;
    }

    const logoutRoute = route("logout");
    const loginRoute = route("login");
    const sessionOwnerStorageKey = "auth.sessionOwner";
    const sessionHeartbeatStorageKey = "auth.sessionHeartbeat";
    const sessionHeartbeatIntervalMs = 15000;

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

    const getCsrfToken = () =>
        document.querySelector('meta[name="csrf-token"]')?.content ?? "";

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
                at: Date.now(),
            }),
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
            keepalive: true,
        }).catch(() => {});
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
            (activeTabId) => activeTabId !== tabId,
        );

        writeActiveTabs(storageKey, remainingTabs);
        window.sessionStorage.removeItem(tabIdStorageKey);

        if (
            logoutIfLast &&
            remainingTabs.length === 0 &&
            !isLoggingOutRef.current
        ) {
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
                },
            },
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
                at: Date.now(),
            }),
        );
        window.localStorage.setItem(
            sessionHeartbeatStorageKey,
            String(Date.now()),
        );
    };
    // ✅ Toast trigger from Laravel flash
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
            return undefined;
        }

        const storageKey = getTabStorageKey();
        const tabIdStorageKey = getTabIdStorageKey();
        const existingTabId = window.sessionStorage.getItem(tabIdStorageKey);
        const tabId =
            existingTabId ?? `${user.id}-${Date.now()}-${Math.random()}`;
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
                handleVisibilityChange,
            );
            window.removeEventListener("storage", handleStorage);
        };
    }, [loginRoute, sessionHeartbeatIntervalMs, user?.id]);

    return (
        <AuthenticatedLayoutContext.Provider value={{ setPageHeader }}>
            <div className="flex min-h-screen bg-[#F8F9FA] text-zinc-900">
                {/* Sidebar */}
                <Sidebar
                    collapsed={collapsed}
                    setCollapsed={setCollapsed}
                    mobileOpen={mobileOpen}
                    setMobileOpen={setMobileOpen}
                />

                <div className="flex-1 flex flex-col h-screen overflow-hidden">
                    {/* Header */}
                    <header className="w-full h-14 shrink-0 bg-white border-b border-zinc-200 flex items-center px-6 sticky top-0 z-20">
                        {/* MOBILE BUTTON */}
                        <button
                            onClick={() => setMobileOpen(true)}
                            className="p-2.5 mr-4 rounded-xl hover:bg-zinc-50 text-zinc-400 transition-all hover:text-emerald-600 active:scale-95 lg:hidden"
                        >
                            <svg
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                strokeWidth="2.5"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M4 6h16M4 12h16M4 18h16"
                                />
                            </svg>
                        </button>

                        {/* RIGHT SIDE */}
                        <div className="ml-auto flex items-center gap-6 relative">
                            {/* STATUS */}
                            <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-lg text-xs font-bold border border-emerald-100">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                </span>
                                Live Updates
                            </div>

                            {/* USER DROPDOWN */}
                            <div className="relative">
                                <button
                                    onClick={() => setOpen(!open)}
                                    className="flex items-center gap-3 pl-4 border-l border-zinc-200"
                                >
                                    {/* USER INFO */}

                                    {/* AVATAR */}
                                    <div className="w-9 h-9 rounded-full bg-emerald-500 text-white flex items-center justify-center text-sm font-bold">
                                        {user?.last_name?.charAt(0)}
                                    </div>
                                </button>

                                {/* DROPDOWN */}
                                {open && (
                                    <div className="absolute right-0 mt-2 w-52 bg-white border border-zinc-200 rounded-xl shadow-lg overflow-hidden z-50">
                                        {/* USER INFO HEADER */}
                                        <div className="px-4 py-3 border-b border-zinc-100">
                                            <p className="text-sm font-semibold text-zinc-800 truncate">
                                                {user?.last_name}{" "}
                                                {user?.first_name}
                                            </p>
                                            <p className="text-xs text-zinc-500 truncate">
                                                {user?.email}
                                            </p>
                                        </div>

                                        {/* ACTIONS */}
                                        <div className="p-1">
                                            <button
                                                onClick={logout}
                                                disabled={isLoggingOut}
                                                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition"
                                            >
                                                <svg
                                                    className="w-4 h-4"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        d="M17 16l4-4m0 0l-4-4m4 4H7"
                                                    />
                                                </svg>
                                                {isLoggingOut
                                                    ? "Logging out..."
                                                    : "Logout"}
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </header>

                    {/* Content */}
                    <main className="flex-1 overflow-y-auto mb-8 w-full">
                        <div className="px-10 pt-2 ">
                            {pageHeader && (
                                <div className="mb-8">{pageHeader}</div>
                            )}
                            {children}
                        </div>
                    </main>

                    {/* ✅ Toastify container (GLOBAL ONLY ONCE) */}
                    <ToastContainer
                        position="top-right"
                        autoClose={5000}
                        hideProgressBar={false}
                        closeOnClick
                        pauseOnHover
                        draggable
                        theme="light"
                    />
                </div>
            </div>
        </AuthenticatedLayoutContext.Provider>
    );
}

export const withAuthenticatedLayout =
    (layoutProps = {}) =>
    (page) => (
        <AuthenticatedLayout {...layoutProps}>{page}</AuthenticatedLayout>
    );
