import { jsxs, Fragment, jsx } from "react/jsx-runtime";
import { useState } from "react";
import { Head, Link, router } from "@inertiajs/react";
import { S as SearchSelect } from "./SearchSelect-CY7NDfHZ.js";
import { I as InputLabel } from "./InputLabel-DlDnrkJG.js";
import { T as Table, a as Thead, b as THdata, c as Tbody, d as Trow, e as Tdata } from "./Tdata-BYbinPOB.js";
import { d as downloadExport } from "./exportDownload-D_MQvCpZ.js";
import "ziggy-js";
const FILTER_DEFINITIONS = [
  {
    key: "unit_id",
    label: "Unit Name",
    routeName: "units.search",
    placeholder: "Type in unit name...",
    selectedLabelKey: "unit"
  },
  {
    key: "curriculum_mapping_id",
    label: "Course",
    routeName: "courses.curriculum-mappings.search",
    placeholder: "Search course curriculum...",
    selectedLabelKey: "curriculum_mapping"
  },
  {
    key: "module_taught",
    label: "Module Taught",
    type: "select",
    selectedLabelKey: "module_taught",
    options: [1, 2, 3, 4, 5, 6].map((module) => ({
      value: String(module),
      label: `Module ${module}`
    }))
  },
  {
    key: "scope",
    label: "Scope",
    type: "select",
    selectedLabelKey: "scope",
    options: [
      { value: "basic", label: "Basic" },
      { value: "common", label: "Common" },
      { value: "core", label: "Core" }
    ]
  }
];
const FILTER_KEYS = FILTER_DEFINITIONS.map((filter) => filter.key);
const emptyFilterState = () => FILTER_KEYS.reduce((values, key) => ({ ...values, [key]: "" }), {});
function Index({
  curriculum_mapping,
  selected_mapping_option,
  filters = {},
  selectedFilters = {},
  units,
  can_manage_units = true
}) {
  const pageFilters = filters && !Array.isArray(filters) && typeof filters === "object" ? filters : {};
  const [sortField, setSortField] = useState(
    pageFilters.sort || units.sort || "module_taught"
  );
  const [sortDirection, setSortDirection] = useState(
    pageFilters.direction || units.direction || "asc"
  );
  const [exportFormat, setExportFormat] = useState("pdf");
  const [form, setForm] = useState({
    ...emptyFilterState(),
    unit_id: pageFilters.unit_id || "",
    module_taught: pageFilters.module_taught || "",
    scope: pageFilters.scope || "",
    course_id: pageFilters.course_id || "",
    curriculum_mapping_id: pageFilters.curriculum_mapping_id || selected_mapping_option?.id || curriculum_mapping?.id || ""
  });
  const [currentFilterKey, setCurrentFilterKey] = useState(
    FILTER_KEYS.find((key) => pageFilters[key]) || ""
  );
  const setFilter = (key, value) => {
    setForm((current) => {
      const next = {
        ...current,
        [key]: value
      };
      if (key === "module_taught" || key === "curriculum_mapping_id") {
        next.unit_id = "";
      }
      return next;
    });
  };
  const effectiveCurriculumMappingId = form.curriculum_mapping_id;
  const currentFilters = () => ({
    ...FILTER_KEYS.reduce(
      (values, key) => ({ ...values, [key]: form[key] }),
      {}
    ),
    curriculum_mapping_id: effectiveCurriculumMappingId
  });
  const selectedFilterDefinition = FILTER_DEFINITIONS.find(
    (filter) => filter.key === currentFilterKey
  );
  const activeFilters = FILTER_DEFINITIONS.filter((filter) => form[filter.key]);
  const addCurrentFilter = () => {
    if (!currentFilterKey || !form[currentFilterKey]) return;
    setCurrentFilterKey("");
  };
  const clearSingleFilter = (key) => {
    setFilter(key, "");
    if (currentFilterKey === key) {
      setCurrentFilterKey("");
    }
  };
  const clearFilters = () => {
    setForm((current) => ({
      ...current,
      ...emptyFilterState(),
      curriculum_mapping_id: pageFilters.curriculum_mapping_id || selected_mapping_option?.id || curriculum_mapping?.id || ""
    }));
    setCurrentFilterKey("");
    router.get(
      route("units.index"),
      {
        curriculum_mapping_id: pageFilters.curriculum_mapping_id || selected_mapping_option?.id || curriculum_mapping?.id || "",
        sort: sortField,
        direction: sortDirection,
        page: 1
      },
      { preserveState: true, replace: true }
    );
  };
  const getSelectedOptionLabel = (filter) => selectedFilters?.[filter.selectedLabelKey] || filter.options?.find((option) => option.value === form[filter.key])?.label || form[filter.key];
  const renderFilterInput = (filter) => {
    if (!filter) {
      return /* @__PURE__ */ jsx("div", { className: "rounded-xl border border-dashed border-zinc-200 bg-zinc-50 px-4 py-2 text-sm text-zinc-400", children: "Select a column to show its input" });
    }
    const requiresCourseSelection = filter.key === "module_taught" || filter.key === "scope";
    const isDisabled = requiresCourseSelection && !effectiveCurriculumMappingId;
    if (filter.type === "select") {
      return /* @__PURE__ */ jsxs(
        "select",
        {
          value: form[filter.key],
          disabled: isDisabled,
          onChange: (e) => setFilter(filter.key, e.target.value),
          className: "w-full rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 disabled:cursor-not-allowed disabled:bg-zinc-100",
          children: [
            /* @__PURE__ */ jsx("option", { value: "", children: isDisabled ? "Select course first..." : `Choose ${filter.label.toLowerCase()}...` }),
            filter.options.map((option) => /* @__PURE__ */ jsx("option", { value: option.value, children: option.label }, option.value))
          ]
        }
      );
    }
    const routeParams = filter.key === "unit_id" ? {
      curriculum_mapping_id: effectiveCurriculumMappingId || "",
      module_taught: form.module_taught || ""
    } : filter.routeParams || {};
    return /* @__PURE__ */ jsx(
      SearchSelect,
      {
        routeName: filter.routeName,
        defaultOptions: [],
        value: form[filter.key],
        selectedLabel: selectedFilters?.[filter.selectedLabelKey],
        routeParams,
        placeholder: filter.placeholder,
        preloadOptions: true,
        minSearchLength: filter.key === "unit_id" ? 2 : void 0,
        onChange: (option) => setFilter(filter.key, option?.id || "")
      }
    );
  };
  const applyFilters = (nextSort = sortField, nextDirection = sortDirection) => {
    router.get(
      route("units.index"),
      {
        ...currentFilters(),
        sort: nextSort,
        direction: nextDirection,
        page: 1
      },
      { preserveState: true, replace: true }
    );
  };
  const submit = (e) => {
    e.preventDefault();
    applyFilters(sortField, sortDirection);
  };
  const handleSort = (field) => {
    const direction = sortField === field && sortDirection === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortDirection(direction);
    applyFilters(field, direction);
  };
  const renderArrow = (field) => {
    if (sortField !== field) return null;
    return sortDirection === "asc" ? " ^" : " v";
  };
  const handleDelete = (id) => {
    if (!confirm("Are you sure you want to delete this unit?")) {
      return;
    }
    router.delete(route("units.destroy", id), {
      preserveState: true,
      replace: true
    });
  };
  const handleExport = () => {
    downloadExport("units", exportFormat, {
      ...currentFilters(),
      sort: sortField,
      direction: sortDirection
    });
  };
  const title = curriculum_mapping ? `Units for ${curriculum_mapping.curriculum?.name}` : "Units";
  curriculum_mapping?.course?.name || "All units";
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(Head, { title }),
    /* @__PURE__ */ jsxs("div", { className: "mx-auto w-full max-w-6xl animate-in fade-in slide-in-from-bottom-4 duration-700", children: [
      /* @__PURE__ */ jsxs(
        "form",
        {
          className: "mb-4 rounded-lg border border-zinc-100 bg-white p-4 shadow-sm",
          onSubmit: submit,
          children: [
            /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 items-end gap-3 lg:grid-cols-[minmax(220px,300px)_minmax(300px,1fr)_auto_auto_auto]", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx(InputLabel, { value: "Filter Column" }),
                /* @__PURE__ */ jsxs(
                  "select",
                  {
                    value: currentFilterKey,
                    onChange: (e) => setCurrentFilterKey(e.target.value),
                    className: "w-full rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100",
                    children: [
                      /* @__PURE__ */ jsx("option", { value: "", children: "Choose column..." }),
                      FILTER_DEFINITIONS.map((filter) => /* @__PURE__ */ jsx("option", { value: filter.key, children: filter.label }, filter.key))
                    ]
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx(
                  InputLabel,
                  {
                    value: selectedFilterDefinition?.label || "Filter Value"
                  }
                ),
                renderFilterInput(selectedFilterDefinition)
              ] }),
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  onClick: addCurrentFilter,
                  disabled: !currentFilterKey || !form[currentFilterKey],
                  className: "inline-flex h-10 items-center justify-center rounded-lg border border-zinc-300 bg-white px-4 text-sm font-medium text-zinc-700 hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50",
                  children: "+ Add filter"
                }
              ),
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  onClick: clearFilters,
                  className: "inline-flex h-10 items-center justify-center rounded-lg border border-zinc-300 bg-white px-4 text-sm text-zinc-700 hover:bg-zinc-50",
                  children: "Clear all"
                }
              ),
              /* @__PURE__ */ jsx(
                "button",
                {
                  className: "inline-flex h-10 items-center justify-center rounded-lg bg-emerald-600 px-4 text-sm text-white hover:bg-emerald-700",
                  type: "submit",
                  children: "Apply"
                }
              )
            ] }),
            /* @__PURE__ */ jsx("div", { className: "mt-4 border-t border-zinc-100 pt-3", children: activeFilters.length ? /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-2", children: activeFilters.map((filter) => /* @__PURE__ */ jsxs(
              "button",
              {
                type: "button",
                onClick: () => clearSingleFilter(filter.key),
                className: "inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 ring-1 ring-emerald-100 hover:bg-emerald-100",
                children: [
                  /* @__PURE__ */ jsxs("span", { children: [
                    filter.label,
                    ":",
                    " ",
                    getSelectedOptionLabel(filter)
                  ] }),
                  /* @__PURE__ */ jsx("span", { className: "text-emerald-900", children: "x" })
                ]
              },
              filter.key
            )) }) : /* @__PURE__ */ jsx("p", { className: "text-sm text-zinc-500", children: "No filters selected. Choose a column above to filter this table." }) })
          ]
        }
      ),
      /* @__PURE__ */ jsx("div", { className: "mb-2 flex justify-end", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center", children: [
        /* @__PURE__ */ jsxs(
          "select",
          {
            value: exportFormat,
            onChange: (e) => setExportFormat(e.target.value),
            className: "h-[34px] rounded-l border border-slate-300 border-r-0 bg-white px-3 text-sm text-slate-700 focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-inset focus:ring-gray-500",
            children: [
              /* @__PURE__ */ jsx("option", { value: "pdf", children: "PDF" }),
              /* @__PURE__ */ jsx("option", { value: "csv", children: "CSV" }),
              /* @__PURE__ */ jsx("option", { value: "excel", children: "Excel" })
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          "button",
          {
            type: "button",
            onClick: handleExport,
            className: "h-[34px] whitespace-nowrap rounded-r bg-gray-400 px-4 text-sm font-medium text-white transition-colors hover:bg-gray-600",
            children: [
              "Export ",
              exportFormat.toUpperCase()
            ]
          }
        )
      ] }) }),
      /* @__PURE__ */ jsxs(
        Table,
        {
          pagination: units,
          sortField,
          sortDirection,
          children: [
            /* @__PURE__ */ jsxs(Thead, { children: [
              /* @__PURE__ */ jsxs(
                THdata,
                {
                  onClick: () => handleSort("code"),
                  className: "cursor-pointer",
                  children: [
                    "Code ",
                    renderArrow("code")
                  ]
                }
              ),
              /* @__PURE__ */ jsxs(
                THdata,
                {
                  onClick: () => handleSort("name"),
                  className: "cursor-pointer",
                  children: [
                    "Name ",
                    renderArrow("name")
                  ]
                }
              ),
              /* @__PURE__ */ jsxs(
                THdata,
                {
                  onClick: () => handleSort("module_taught"),
                  className: "cursor-pointer text-center",
                  children: [
                    "Module ",
                    renderArrow("module_taught")
                  ]
                }
              ),
              /* @__PURE__ */ jsx(THdata, { className: "text-center", children: "Scope" }),
              /* @__PURE__ */ jsx(THdata, { children: "Course" }),
              /* @__PURE__ */ jsx(THdata, { children: "Certification Level" }),
              can_manage_units ? /* @__PURE__ */ jsx(THdata, { className: "text-center", children: "Actions" }) : null
            ] }),
            /* @__PURE__ */ jsx(Tbody, { children: units?.data?.length ? units.data.map((item) => /* @__PURE__ */ jsxs(Trow, { children: [
              /* @__PURE__ */ jsx(Tdata, { className: "font-mono text-sm", children: item.code }),
              /* @__PURE__ */ jsx(Tdata, { children: item.name }),
              /* @__PURE__ */ jsx(Tdata, { className: "text-center", children: item.module_taught }),
              /* @__PURE__ */ jsx(Tdata, { className: "text-center", children: /* @__PURE__ */ jsx("span", { className: "rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-medium capitalize text-zinc-700", children: item.scope || "core" }) }),
              /* @__PURE__ */ jsx(Tdata, { children: item.curriculum_mapping?.course?.name || "-" }),
              /* @__PURE__ */ jsx(Tdata, { children: item.curriculum_mapping?.course?.certification_level?.name || "-" }),
              can_manage_units ? /* @__PURE__ */ jsx(Tdata, { children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center gap-x-6", children: [
                /* @__PURE__ */ jsx(
                  Link,
                  {
                    href: route(
                      "units.edit",
                      item.id
                    ),
                    className: "text-emerald-600 hover:underline",
                    children: "Edit"
                  }
                ),
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    onClick: () => handleDelete(item.id),
                    className: "text-red-600 hover:underline",
                    children: "Delete"
                  }
                )
              ] }) }) : null
            ] }, item.id)) : /* @__PURE__ */ jsx(Trow, { children: /* @__PURE__ */ jsx(
              Tdata,
              {
                colSpan: can_manage_units ? "7" : "6",
                className: "py-12 text-center text-zinc-400",
                children: "No units found for the selected filters."
              }
            ) }) })
          ]
        }
      )
    ] })
  ] });
}
export {
  Index as default
};
