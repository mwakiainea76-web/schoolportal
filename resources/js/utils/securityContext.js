const STORAGE_KEY = "security_device_id";

const createFallbackId = () =>
    `dev-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

export function loadSecurityContext() {
    if (typeof window === "undefined") {
        return {
            device_id: "",
            location_hint: "",
        };
    }

    let deviceId = window.localStorage.getItem(STORAGE_KEY);

    if (!deviceId) {
        deviceId =
            typeof window.crypto?.randomUUID === "function"
                ? window.crypto.randomUUID()
                : createFallbackId();

        window.localStorage.setItem(STORAGE_KEY, deviceId);
    }

    const timeZone =
        Intl.DateTimeFormat?.().resolvedOptions?.().timeZone || "";
    const language = window.navigator?.language || "";
    const platform = window.navigator?.platform || "";
    const screenSize =
        window.screen?.width && window.screen?.height
            ? `${window.screen.width}x${window.screen.height}`
            : "";

    return {
        device_id: deviceId,
        location_hint: [timeZone, language, platform, screenSize]
            .filter(Boolean)
            .join(" | "),
    };
}
