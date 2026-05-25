import { jsxs, jsx } from "react/jsx-runtime";
import { I as InputError } from "./InputError-CBvD_6aD.js";
import { I as InputLabel } from "./InputLabel-DlDnrkJG.js";
import { useState, useRef, useEffect } from "react";
import { route } from "ziggy-js";
import { T as TextArea } from "./TextArea-DrH8CNbm.js";
import { T as TextInput } from "./TextInput-DsoSnibl.js";
function SearchSelect({
  value,
  selectedLabel = null,
  // fallback label from backend relations
  routeName = null,
  routeParams = {},
  placeholder = "Search...",
  onChange,
  error = false,
  defaultOptions = []
}) {
  const [query, setQuery] = useState("");
  const [options, setOptions] = useState(defaultOptions);
  const [open, setOpen] = useState(false);
  const debounceRef = useRef(null);
  const wrapperRef = useRef(null);
  useEffect(() => {
    if (value === null || value === void 0) return;
    const selected = defaultOptions.find(
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
    if (typeof value === "string") {
      setQuery(value);
    }
  }, [value, selectedLabel, defaultOptions]);
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
          route(routeName, { ...routeParams, q: text })
        );
        const data = await res.json();
        setOptions(data);
      } catch (err) {
        console.error("SearchSelect error:", err);
      }
    }, 500);
  };
  const handleSelect = (item) => {
    setQuery(item.name);
    setOpen(false);
    onChange?.(item);
  };
  useEffect(() => {
    const handleClick = (e) => {
      if (!wrapperRef.current?.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);
  useEffect(() => {
    setOptions(defaultOptions);
  }, [defaultOptions]);
  return /* @__PURE__ */ jsxs("div", { ref: wrapperRef, className: "relative w-full", children: [
    /* @__PURE__ */ jsx(
      "input",
      {
        value: query,
        onChange: (e) => routeName ? handleSearch(e.target.value) : setQuery(e.target.value),
        onFocus: () => setOpen(true),
        placeholder,
        className: `w-full bg-zinc-50 border rounded-xl px-5 py-2.5 text-sm outline-none transition ${error ? "border-red-400" : "border-zinc-200"}`
      }
    ),
    open && /* @__PURE__ */ jsx("div", { className: "absolute z-50 mt-1 w-full bg-white border rounded-xl shadow-lg max-h-60 overflow-y-auto", children: options.length === 0 ? /* @__PURE__ */ jsx("div", { className: "p-3 text-sm text-zinc-400", children: "No results found" }) : options.map((item) => /* @__PURE__ */ jsx(
      "div",
      {
        onClick: () => handleSelect(item),
        className: "px-5 py-2.5 text-sm cursor-pointer hover:bg-zinc-100",
        children: item.name
      },
      item.id ?? item.name
    )) })
  ] });
}
function SearchSelectField({
  label,
  value,
  options,
  onChange,
  error,
  placeholder
}) {
  return /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
    /* @__PURE__ */ jsx(InputLabel, { value: label, required: true }),
    /* @__PURE__ */ jsx(
      SearchSelect,
      {
        value,
        defaultOptions: options,
        placeholder,
        error: Boolean(error),
        onChange: (item) => onChange(item?.id ?? "")
      }
    ),
    /* @__PURE__ */ jsx(InputError, { message: error })
  ] });
}
function TextField({ label, error, className = "", ...props }) {
  return /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
    /* @__PURE__ */ jsx(InputLabel, { value: label, required: props.required }),
    /* @__PURE__ */ jsx(TextInput, { error: Boolean(error), className, ...props }),
    /* @__PURE__ */ jsx(InputError, { message: error })
  ] });
}
function TextAreaField({ label, error, className = "", ...props }) {
  return /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
    /* @__PURE__ */ jsx(InputLabel, { value: label, required: props.required }),
    /* @__PURE__ */ jsx(
      TextArea,
      {
        className: `rounded-xl border bg-zinc-50 px-5 py-3 text-sm ${error ? "border-red-400" : "border-zinc-200"} ${className}`,
        ...props
      }
    ),
    /* @__PURE__ */ jsx(InputError, { message: error })
  ] });
}
function NativeSelectField({
  label,
  value,
  onChange,
  options,
  error,
  required = false
}) {
  return /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
    /* @__PURE__ */ jsx(InputLabel, { value: label, required }),
    /* @__PURE__ */ jsx(
      "select",
      {
        value,
        onChange: (e) => onChange(e.target.value),
        className: `w-full rounded-xl border bg-zinc-50 px-5 py-2.5 text-sm ${error ? "border-red-400" : "border-zinc-200"}`,
        children: options.map((option) => /* @__PURE__ */ jsx("option", { value: option.value, children: option.label }, option.value))
      }
    ),
    /* @__PURE__ */ jsx(InputError, { message: error })
  ] });
}
export {
  NativeSelectField,
  SearchSelectField,
  TextAreaField,
  TextField
};
