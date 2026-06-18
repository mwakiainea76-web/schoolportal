import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { route } from "ziggy-js";
import { CheckIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/Components/ui/command";
import {
    Popover,
    PopoverAnchor,
    PopoverContent,
} from "@/Components/ui/popover";

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
    const isOpenRef = useRef(open);
    const queryRef = useRef(query);
    const inputRef = useRef(null);
    const routeParamsKey = JSON.stringify(routeParams ?? {});

    isOpenRef.current = open;
    queryRef.current = query;

    useEffect(() => {
        if (!routeName) {
            setOptions(defaultOptions);
        }
    }, [defaultOptions, routeName]);

    const visibleOptions = useMemo(() => {
        if (routeName) return options;

        const search = query.trim().toLowerCase();
        if (!search) return options;

        return options.filter((item) =>
            String(item?.name ?? "")
                .toLowerCase()
                .includes(search),
        );
    }, [routeName, options, query]);

    const fetchOptions = useCallback(
        async (text = "") => {
            if (!routeName || disabled) return;

            try {
                const res = await fetch(
                    route(routeName, { ...routeParams, q: text }),
                );

                if (!res.ok) {
                    setOptions([]);
                    return;
                }

                const data = await res.json();
                setOptions(Array.isArray(data) ? data : []);
            } catch (err) {
                console.error("SearchSelect fetch error:", err);
                setOptions([]);
            }
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
            if (isOpenRef.current && queryRef.current.trim() !== "") return;
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value, selectedLabel, defaultOptions, options]);

    // -----------------------------
    // SEARCH (DEBOUNCED)
    // -----------------------------
    const handleSearch = (text) => {
        setIsTyping(true);
        setQuery(text);
        setOpen(true);

        clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(async () => {
            if (!routeName) return;

            const trimmed = text.trim();

            if (!trimmed) {
                if (preloadOptions) {
                    await fetchOptions("");
                } else {
                    setOptions(defaultOptions);
                }
                onChange?.({ id: "", name: "" });
                return;
            }

            if (trimmed.length < minSearchLength) {
                setOptions(defaultOptions);
                return;
            }

            await fetchOptions(trimmed);
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
    // PRELOAD ON MOUNT / PARAM CHANGE
    // -----------------------------
    useEffect(() => {
        if (!routeName || !preloadOptions || disabled) return;
        fetchOptions("");
    }, [fetchOptions, routeName, preloadOptions, disabled]);

    // -----------------------------
    // CLEANUP DEBOUNCE ON UNMOUNT
    // -----------------------------
    useEffect(() => {
        return () => clearTimeout(debounceRef.current);
    }, []);

    return (
        <Popover
            open={open && !disabled}
            onOpenChange={(nextOpen) => {
                setOpen(nextOpen);
                if (!nextOpen) {
                    setIsTyping(false);
                }
            }}
        >
            <div className={`relative w-full ${open ? "z-[60]" : ""}`}>
                <PopoverAnchor asChild>
                    <input
                        ref={inputRef}
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
                        onKeyDown={(event) => {
                            if (event.key === "Escape") {
                                setOpen(false);
                                inputRef.current?.blur();
                            }
                        }}
                        placeholder={placeholder}
                        disabled={disabled}
                        className={`w-full rounded-xl border bg-zinc-50 px-5 py-2.5 text-sm outline-none transition ${
                            error ? "border-red-400" : "border-zinc-200"
                        } ${disabled ? "cursor-not-allowed bg-zinc-200" : ""}`}
                    />
                </PopoverAnchor>

                <PopoverContent
                    className="w-[var(--radix-popover-trigger-width)] p-0"
                    align="start"
                >
                    <Command shouldFilter={false}>
                        <CommandInput
                            value={query}
                            onValueChange={(text) =>
                                routeName ? handleSearch(text) : setQuery(text)
                            }
                            placeholder={placeholder}
                        />
                        <CommandList>
                            <CommandEmpty>No results found</CommandEmpty>
                            <CommandGroup>
                                {visibleOptions.map((item) => {
                                    const isSelected =
                                        String(item?.id) === String(value);

                                    return (
                                        <CommandItem
                                            key={item.id ?? item.name}
                                            value={String(item.name ?? "")}
                                            onSelect={() =>
                                                handleSelect(item)
                                            }
                                        >
                                            <CheckIcon
                                                className={cn(
                                                    "mr-2 h-4 w-4",
                                                    isSelected
                                                        ? "opacity-100"
                                                        : "opacity-0",
                                                )}
                                            />
                                            <span>{item.name}</span>
                                        </CommandItem>
                                    );
                                })}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </div>
        </Popover>
    );
}
