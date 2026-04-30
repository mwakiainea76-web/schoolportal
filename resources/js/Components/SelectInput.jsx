import { useEffect, useRef, useState } from "react";
import { route } from "ziggy-js";

export default function SearchSelect({
    value,
    selectedLabel = null, // fallback label from backend relations
    routeName = null,
    routeParams = {},
    placeholder = "Search...",
    onChange,
    error = false,
    defaultOptions = [],
}) {
    const [query, setQuery] = useState("");
    const [options, setOptions] = useState(defaultOptions);
    const [open, setOpen] = useState(false);

    const debounceRef = useRef(null);
    const wrapperRef = useRef(null);

    // -----------------------------
    // EDIT MODE + VALUE HYDRATION
    // -----------------------------
    useEffect(() => {
        if (value === null || value === undefined) return;

        // 1. match from current options (best case)
        const selected = defaultOptions.find(
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
        if (typeof value === "string") {
            setQuery(value);
        }
    }, [value, selectedLabel, defaultOptions]);

    // -----------------------------
    // SEARCH (DEBOUNCED)
    // -----------------------------
    const handleSearch = (text) => {
        setQuery(text);
        setOpen(true);

        clearTimeout(debounceRef.current);

        debounceRef.current = setTimeout(async () => {
            try {
                if (!routeName) return;

                if (!text.trim()) {
                    setOptions(defaultOptions);
                    return;
                }

                const res = await fetch(
                    route(routeName, { ...routeParams, q: text }),
                );
                const data = await res.json();

                setOptions(data);
            } catch (err) {
                console.error("SearchSelect error:", err);
            }
        }, 500);
    };

    // -----------------------------
    // SELECT ITEM
    // -----------------------------
    const handleSelect = (item) => {
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
        setOptions(defaultOptions);
    }, [defaultOptions]);

    return (
        <div ref={wrapperRef} className="relative w-full">
            <input
                value={query}
                onChange={(e) =>
                    routeName
                        ? handleSearch(e.target.value)
                        : setQuery(e.target.value)
                }
                onFocus={() => setOpen(true)}
                placeholder={placeholder}
                className={`w-full bg-zinc-50 border rounded-xl px-5 py-2.5 text-sm outline-none transition ${
                    error ? "border-red-400" : "border-zinc-200"
                }`}
            />

            {open && (
                <div className="absolute z-50 mt-1 w-full bg-white border rounded-xl shadow-lg max-h-60 overflow-y-auto">
                    {options.length === 0 ? (
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
