import { jsxs, jsx } from "react/jsx-runtime";
import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { route } from "ziggy-js";
function SearchSelect({
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
  preloadOptions = false
}) {
  const [query, setQuery] = useState("");
  const [options, setOptions] = useState(defaultOptions);
  const [open, setOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const debounceRef = useRef(null);
  const wrapperRef = useRef(null);
  const isOpenRef = useRef(open);
  const queryRef = useRef(query);
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
    return options.filter(
      (item) => String(item?.name ?? "").toLowerCase().includes(search)
    );
  }, [routeName, options, query]);
  const fetchOptions = useCallback(
    async (text = "") => {
      if (!routeName || disabled) return;
      try {
        const res = await fetch(
          route(routeName, { ...routeParams, q: text })
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
    [routeName, disabled, routeParamsKey]
  );
  useEffect(() => {
    if (value === null || value === void 0) return;
    if (value === "") {
      if (isOpenRef.current && queryRef.current.trim() !== "") return;
      setQuery("");
      return;
    }
    const selected = [...defaultOptions, ...options].find(
      (o) => String(o.id) === String(value)
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
  }, [value, selectedLabel, defaultOptions, options]);
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
  const handleSelect = (item) => {
    setIsTyping(false);
    setQuery(item.name);
    setOpen(false);
    onChange?.(item);
  };
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
  useEffect(() => {
    if (!routeName || !preloadOptions || disabled) return;
    fetchOptions("");
  }, [fetchOptions, routeName, preloadOptions, disabled]);
  useEffect(() => {
    return () => clearTimeout(debounceRef.current);
  }, []);
  return /* @__PURE__ */ jsxs(
    "div",
    {
      ref: wrapperRef,
      className: `relative w-full ${open ? "z-[60]" : ""}`,
      children: [
        /* @__PURE__ */ jsx(
          "input",
          {
            value: query,
            onChange: (e) => routeName ? handleSearch(e.target.value) : setQuery(e.target.value),
            onFocus: () => {
              if (!disabled) {
                setIsTyping(false);
                setOpen(true);
                if (preloadOptions && routeName) fetchOptions("");
              }
            },
            placeholder,
            disabled,
            className: `w-full bg-zinc-50 border rounded-xl px-5 py-2.5 text-sm outline-none transition ${error ? "border-red-400" : "border-zinc-200"} ${disabled ? "bg-zinc-200 cursor-not-allowed" : ""}`
          }
        ),
        open && /* @__PURE__ */ jsx("div", { className: "absolute z-[70] mt-1 w-full bg-white border rounded-xl shadow-lg max-h-60 overflow-y-auto", children: !visibleOptions.length ? /* @__PURE__ */ jsx("div", { className: "p-3 text-sm text-zinc-400", children: "No results found" }) : visibleOptions.map((item) => /* @__PURE__ */ jsx(
          "div",
          {
            onClick: () => handleSelect(item),
            className: "px-5 py-2.5 text-sm cursor-pointer hover:bg-zinc-100",
            children: item.name
          },
          item.id ?? item.name
        )) })
      ]
    }
  );
}
export {
  SearchSelect as S
};
