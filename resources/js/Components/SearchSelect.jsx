import { useEffect, useRef, useState } from "react";
import { route } from "ziggy-js";

const API_LOOKUP_ROUTES = {
    "departments.search": "/api/lookups/departments",
    "courses.search": "/api/lookups/courses",
    "curriculums.search": "/api/lookups/curriculums",
    "curriculum-mappings.search": "/api/lookups/curriculum-mappings",
    "units.search": "/api/lookups/units",
    "academic-years.search": "/api/lookups/academic-years",
    "academic-sessions.search": "/api/lookups/academic-sessions",
    "exam-bodies.search": "/api/lookups/exam-bodies",
    "certification-levels.search": "/api/lookups/certification-levels",
    "staffs.search": "/api/lookups/staffs",
};

const buildSearchUrl = (routeName, routeParams, text) => {
    const apiUrl = API_LOOKUP_ROUTES[routeName];
    const params = new URLSearchParams();

    Object.entries(routeParams ?? {}).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== "") {
            params.set(key, value);
        }
    });

    params.set("q", text);

    if (apiUrl) {
        return `${apiUrl}?${params.toString()}`;
    }

    return route(routeName, { ...routeParams, q: text });
};

export default function SearchSelect({
    value,
    selectedLabel = null, // fallback label from backend relations
    routeName = null,
    routeParams = {},
    placeholder = "Search...",
    onChange,
    error = false,
    defaultOptions = [],
    disabled = false,
    minSearchLength = 2,
    preloadOptions = false,
}) {
    const [query, setQuery] = useState("");
    const isApiLookup = !!API_LOOKUP_ROUTES[routeName];
    const initialOptions = isApiLookup ? [] : defaultOptions;
    const [options, setOptions] = useState(initialOptions);
    const [open, setOpen] = useState(false);
    const [isTyping, setIsTyping] = useState(false);

    const debounceRef = useRef(null);
    const wrapperRef = useRef(null);
    const routeParamsKey = JSON.stringify(routeParams ?? {});

    const fetchOptions = async (text = "") => {
        if (!routeName || disabled) return;

        const res = await fetch(buildSearchUrl(routeName, routeParams, text));
        if (!res.ok) {
            setOptions([]);
            return;
        }

        const data = await res.json();

        setOptions(Array.isArray(data) ? data : []);
    };

    // -----------------------------
    // EDIT MODE + VALUE HYDRATION
    // -----------------------------
    useEffect(() => {
        if (value === null || value === undefined) return;

        if (isTyping && open) {
            return;
        }

        // Keep the typed query visible while the user is actively searching.
        if (value === "") {
            if (open && query.trim() !== "") {
                return;
            }

            setQuery("");
            return;
        }

        // 1. match from current options (best case)
        const selected = [...defaultOptions, ...options].find(
            (o) => String(o.id) === String(value),
        );

        if (selected) {
            setQuery(selected.name);
            return;
        }

        // 2. fallback from backend label (edit mode)
        if (selectedLabel) {
            setQuery(selectedLabel);
            return;
        }

        // 3. fallback if value is already a string (role_name, gender, etc.)
        if (!isApiLookup && typeof value === "string") {
            setQuery(value);
        }
    }, [value, selectedLabel, defaultOptions, options, isApiLookup, open, query, isTyping]);

    // -----------------------------
    // SEARCH (DEBOUNCED)
    // -----------------------------
    const handleSearch = (text) => {
        setIsTyping(true);
        setQuery(text);
        setOpen(true);

        clearTimeout(debounceRef.current);

        debounceRef.current = setTimeout(async () => {
            try {
                if (!routeName) return;

                const trimmedText = text.trim();

                if (!trimmedText) {
                    if (isApiLookup && preloadOptions) {
                        await fetchOptions("");
                    } else {
                        setOptions(initialOptions);
                    }
                    onChange?.({ id: "", name: "" });
                    return;
                }

                if (routeName && trimmedText.length < minSearchLength) {
                    setOptions(initialOptions);
                    return;
                }

                await fetchOptions(trimmedText);
            } catch (err) {
                console.error("SearchSelect error:", err);
            }
        }, 500);
    };

    // -----------------------------
    // SELECT ITEM
    // -----------------------------
    const handleSelect = (item) => {
        setIsTyping(false);
        setQuery(item.name);
        setOpen(false);
        onChange?.(item);
    };

    // -----------------------------
    // CLOSE ON OUTSIDE CLICK
    // -----------------------------
    useEffect(() => {
        const handleClick = (e) => {
            if (!wrapperRef.current?.contains(e.target)) {
                setIsTyping(false);
                setOpen(false);
            }
        };

        document.addEventListener("click", handleClick);
        return () => document.removeEventListener("click", handleClick);
    }, []);

    // -----------------------------
    // SYNC OPTIONS ON PROP CHANGE
    // -----------------------------
    useEffect(() => {
        if (isApiLookup) {
            if (!preloadOptions) {
                setOptions([]);
            }

            return;
        }

        setOptions(defaultOptions);
    }, [defaultOptions, isApiLookup, preloadOptions]);

    useEffect(() => {
        if (!isApiLookup || !preloadOptions || disabled) return;

        fetchOptions("");
    }, [isApiLookup, preloadOptions, disabled, routeParamsKey]);

    return (
        <div ref={wrapperRef} className={`relative w-full ${open ? "z-[60]" : ""}`}>
            <input
                value={query}
                onChange={(e) =>
                    routeName
                        ? handleSearch(e.target.value)
                        : setQuery(e.target.value)
                }
                onFocus={() => {
                    if (!disabled) {
                        setIsTyping(false);
                        setOpen(true);
                        if (preloadOptions && isApiLookup) {
                            fetchOptions("");
                        }
                    }
                }}
                placeholder={placeholder}
                disabled={disabled}
                className={`w-full bg-zinc-50 border rounded-xl px-5 py-2.5 text-sm outline-none transition ${
                    error ? "border-red-400" : "border-zinc-200"
                } ${disabled ? "bg-zinc-200 cursor-not-allowed" : ""}`}
            />

            {open && (
                <div className="absolute z-[70] mt-1 w-full bg-white border rounded-xl shadow-lg max-h-60 overflow-y-auto">
                    {!Array.isArray(options) || options.length === 0 ? (
                        <div className="p-3 text-sm text-zinc-400">
                            No results found
                        </div>
                    ) : (
                        options.map((item) => (
                            <div
                                key={item.id ?? item.name}
                                onClick={() => handleSelect(item)}
                                className="px-5 py-2.5 text-sm cursor-pointer hover:bg-zinc-100"
                            >
                                {item.name}
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}
