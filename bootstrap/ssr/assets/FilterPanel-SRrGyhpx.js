import { jsxs, jsx } from "react/jsx-runtime";
import { useState, useCallback } from "react";
import { router } from "@inertiajs/react";
import { route } from "ziggy-js";
import { S as SearchSelect } from "./SearchSelect-PvfiRNjv.js";
const labelStatus = (status) => status ? status.charAt(0).toUpperCase() + status.slice(1) : "-";
function FilterPanel({
  definitions = [],
  filters = {},
  selectedFilters = {},
  statuses = [],
  routeName,
  extraParams = {},
  quickKeys = []
}) {
  const pageFilters = filters && !Array.isArray(filters) && typeof filters === "object" ? filters : {};
  const EMPTY_FILTERS = Object.fromEntries(
    definitions.map((d) => [d.key, ""])
  );
  const [form, setForm] = useState(() => ({
    ...EMPTY_FILTERS,
    ...Object.fromEntries(
      Object.entries(pageFilters).filter(([k]) => k in EMPTY_FILTERS)
    )
  }));
  const [filterLabels, setFilterLabels] = useState(() => {
    const labels = {};
    definitions.forEach((d) => {
      if (d.type === "search") {
        labels[d.key] = selectedFilters[d.selectedLabelKey] || selectedFilters[d.key] || "";
      }
    });
    return labels;
  });
  const [activeFilterKeys, setActiveFilterKeys] = useState(
    () => definitions.filter((d) => Boolean(pageFilters[d.key])).map((d) => d.key)
  );
  const [showMore, setShowMore] = useState(false);
  const quickDefinitions = definitions.filter(
    (d) => quickKeys.includes(d.key)
  );
  const moreDefinitions = definitions.filter(
    (d) => !quickKeys.includes(d.key)
  );
  const activeFilters = definitions.filter(
    (d) => activeFilterKeys.includes(d.key) && Boolean(form[d.key])
  );
  const setFilter = useCallback(
    (key, value, label = "") => {
      const def = definitions.find((d) => d.key === key);
      setForm((prev) => {
        const next = { ...prev, [key]: value };
        def?.clears?.forEach((ck) => {
          next[ck] = "";
        });
        return next;
      });
      if (def?.type === "search") {
        setFilterLabels((prev) => ({
          ...prev,
          [key]: label,
          ...(def.clears || []).reduce(
            (acc, ck) => ({ ...acc, [ck]: "" }),
            {}
          )
        }));
      }
      setActiveFilterKeys((prev) => {
        const next = new Set(prev);
        if (value && value !== "") {
          next.add(key);
        } else {
          next.delete(key);
        }
        def?.clears?.forEach((ck) => next.delete(ck));
        return [...next];
      });
    },
    [definitions]
  );
  const clearSingleFilter = (key) => {
    const def = definitions.find((d) => d.key === key);
    setForm((prev) => {
      const next = { ...prev, [key]: "" };
      def?.clears?.forEach((ck) => {
        next[ck] = "";
      });
      return next;
    });
    setFilterLabels((prev) => {
      const next = { ...prev, [key]: "" };
      def?.clears?.forEach((ck) => {
        next[ck] = "";
      });
      return next;
    });
    setActiveFilterKeys((prev) => {
      const cleared = /* @__PURE__ */ new Set([key, ...def?.clears || []]);
      return prev.filter((k) => !cleared.has(k));
    });
  };
  const submit = (e) => {
    e.preventDefault();
    const clean = Object.fromEntries(
      Object.entries(form).filter(
        ([, v]) => v !== "" && v !== null && v !== void 0
      )
    );
    router.get(
      route(routeName),
      { ...clean, ...extraParams },
      { preserveState: true, replace: true }
    );
  };
  const clearFilters = () => {
    setForm(EMPTY_FILTERS);
    setFilterLabels({});
    setActiveFilterKeys([]);
    router.get(
      route(routeName),
      { ...extraParams },
      { preserveState: true, replace: true }
    );
  };
  const renderInput = (def) => {
    if (!def) return null;
    const disabled = def.dependsOn && !form[def.dependsOn];
    if (def.type === "text") {
      return /* @__PURE__ */ jsx(
        "input",
        {
          type: "text",
          value: form[def.key] || "",
          onChange: (e) => setFilter(def.key, e.target.value),
          placeholder: def.placeholder || "Search...",
          className: "w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
        }
      );
    }
    if (def.type === "select") {
      return /* @__PURE__ */ jsxs(
        "select",
        {
          value: form[def.key] || "",
          onChange: (e) => setFilter(def.key, e.target.value),
          className: "w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100",
          children: [
            /* @__PURE__ */ jsx("option", { value: "", children: def.placeholder || "All" }),
            (def.options || []).map((opt) => /* @__PURE__ */ jsx("option", { value: opt.value, children: opt.label }, opt.value))
          ]
        }
      );
    }
    if (def.type === "status") {
      return /* @__PURE__ */ jsxs(
        "select",
        {
          value: form[def.key] || "",
          onChange: (e) => setFilter(def.key, e.target.value),
          className: "w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100",
          children: [
            /* @__PURE__ */ jsx("option", { value: "", children: def.placeholder || "All statuses" }),
            (statuses || []).map((s) => /* @__PURE__ */ jsx("option", { value: s, children: labelStatus(s) }, s))
          ]
        }
      );
    }
    return /* @__PURE__ */ jsx(
      SearchSelect,
      {
        routeName: def.routeName,
        routeParams: typeof def.routeParams === "function" ? def.routeParams(form) : def.routeParams || {},
        disabled: Boolean(disabled),
        defaultOptions: [],
        value: form[def.key] || "",
        selectedLabel: filterLabels[def.key] || selectedFilters[def.selectedLabelKey] || "",
        placeholder: disabled ? def.disabledPlaceholder || "Select dependency first" : def.placeholder || "Search...",
        preloadOptions: true,
        onChange: (option) => setFilter(
          def.key,
          option?.id || "",
          option?.name || option?.label || ""
        )
      }
    );
  };
  const getPillLabel = (def) => {
    if (def.type === "search") {
      return filterLabels[def.key] || selectedFilters[def.selectedLabelKey] || form[def.key];
    }
    if (def.key === "status") return labelStatus(form[def.key]);
    if (def.key === "year_of_study") return `Year ${form[def.key]}`;
    return form[def.key];
  };
  return /* @__PURE__ */ jsxs(
    "form",
    {
      onSubmit: submit,
      className: "mb-4 rounded-lg border border-zinc-100 bg-white p-4 shadow-sm",
      children: [
        /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-end gap-2", children: [
          quickDefinitions.map((def) => /* @__PURE__ */ jsx("div", { className: "min-w-[160px] flex-1 basis-[160px]", children: renderInput(def) }, def.key)),
          moreDefinitions.length > 0 && /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              onClick: () => setShowMore((v) => !v),
              className: "inline-flex h-[38px] items-center gap-1 rounded-lg border border-zinc-300 bg-white px-3 text-sm text-zinc-600 hover:bg-zinc-50",
              children: showMore ? "− Less" : "+ More"
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "submit",
              className: "inline-flex h-[38px] items-center rounded-lg bg-emerald-600 px-4 text-sm text-white hover:bg-emerald-700",
              children: "Apply"
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              onClick: clearFilters,
              className: "inline-flex h-[38px] items-center rounded-lg border border-zinc-300 bg-white px-3 text-sm text-zinc-600 hover:bg-zinc-50",
              children: "Reset"
            }
          )
        ] }),
        showMore && moreDefinitions.length > 0 && /* @__PURE__ */ jsx("div", { className: "mt-3 flex flex-wrap items-end gap-2 border-t border-zinc-100 pt-3", children: moreDefinitions.map((def) => /* @__PURE__ */ jsx(
          "div",
          {
            className: "min-w-[160px] flex-1 basis-[160px]",
            children: renderInput(def)
          },
          def.key
        )) }),
        activeFilters.length > 0 && /* @__PURE__ */ jsx("div", { className: "mt-3 flex flex-wrap items-center gap-2 border-t border-zinc-100 pt-3", children: activeFilters.map((def) => /* @__PURE__ */ jsxs(
          "button",
          {
            type: "button",
            onClick: () => clearSingleFilter(def.key),
            className: "inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 ring-1 ring-emerald-100 hover:bg-emerald-100",
            children: [
              /* @__PURE__ */ jsxs("span", { children: [
                def.label,
                ": ",
                getPillLabel(def)
              ] }),
              /* @__PURE__ */ jsx("span", { className: "text-emerald-900", children: "×" })
            ]
          },
          def.key
        )) })
      ]
    }
  );
}
export {
  FilterPanel as F
};
