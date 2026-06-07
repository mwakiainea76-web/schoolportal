import { useEffect, useRef, useState } from "react";
import { router } from "@inertiajs/react";

export default function useAuthTabs(user) {
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const isLoggingOutRef = useRef(false);
    const logoutSyncSentRef = useRef(false);

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
    }, [loginRoute, user?.id]);

    return {
        logout,
        isLoggingOut,
    };
}
