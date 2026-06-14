import { useCallback, useEffect, useRef, useState } from "react";
import { route } from "ziggy-js";

export default function SearchSelect({
    value,
    selectedLabel = null,
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
    const [options, setOptions] = useState(defaultOptions);
    const [open, setOpen] = useState(false);
    const [isTyping, setIsTyping] = useState(false);

    const debounceRef = useRef(null);
    const wrapperRef = useRef(null);
    const routeParamsKey = JSON.stringify(routeParams ?? {});

    useEffect(() => {
        if (!routeName) {
            setOptions(defaultOptions);
        }
    }, [defaultOptions, routeName]);

    const visibleOptions = !routeName
        ? options.filter((item) => {
              const name = String(item?.name ?? "").toLowerCase();
              const search = query.trim().toLowerCase();

              if (!search) {
                  return true;
              }

              return name.includes(search);
          })
        : options;

    const fetchOptions = useCallback(
        async (text = "") => {
            if (!routeName || disabled) return;

            const res = await fetch(
                route(routeName, { ...routeParams, q: text }),
            );
            if (!res.ok) {
                setOptions([]);
                return;
            }

            const data = await res.json();
            setOptions(Array.isArray(data) ? data : []);
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [routeName, disabled, routeParamsKey],
    );

    // -----------------------------
    // EDIT MODE + VALUE HYDRATION
    // -----------------------------
    useEffect(() => {
        if (value === null || value === undefined) return;

        if (value === "") {
            if (open && query.trim() !== "") return;
            setQuery("");
            return;
        }

        const selected = [...defaultOptions, ...options].find(
            (o) => String(o.id) === String(value),
        );

        if (selected) {
            setQuery(selected.name);
            return;
        }
        if (selectedLabel) {
            setQuery(selectedLabel);
            return;
        }
        if (typeof value === "string") setQuery(value);
    }, [value, selectedLabel, defaultOptions, options, open, query]);

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

                const trimmed = text.trim();

                if (!trimmed) {
                    preloadOptions
                        ? await fetchOptions("")
                        : setOptions(defaultOptions);
                    onChange?.({ id: "", name: "" });
                    return;
                }

                if (trimmed.length < minSearchLength) {
                    setOptions(defaultOptions);
                    return;
                }

                await fetchOptions(trimmed);
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
    // PRELOAD ON MOUNT / PARAM CHANGE
    // -----------------------------
    useEffect(() => {
        if (!routeName || !preloadOptions || disabled) return;
        fetchOptions("");
    }, [fetchOptions, routeName, preloadOptions, disabled]);

    return (
        <div
            ref={wrapperRef}
            className={`relative w-full ${open ? "z-[60]" : ""}`}
        >
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
                        if (preloadOptions && routeName) fetchOptions("");
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
                    {!visibleOptions.length ? (
                        <div className="p-3 text-sm text-zinc-400">
                            No results found
                        </div>
                    ) : (
                        visibleOptions.map((item) => (
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
