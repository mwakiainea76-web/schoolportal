import { jsxs, Fragment, jsx } from "react/jsx-runtime";
import { Head, router } from "@inertiajs/react";
import { useState } from "react";
import { T as Table, a as Thead, b as THdata, c as Tbody, d as Trow, e as Tdata } from "./Tdata-BYbinPOB.js";
import { f as formatDate } from "./date-CQXYOX-2.js";
import { S as SearchSelect } from "./SearchSelect-CY7NDfHZ.js";
import { I as InputLabel } from "./InputLabel-DlDnrkJG.js";
import { d as downloadExport } from "./exportDownload-D_MQvCpZ.js";
import "ziggy-js";
const FILTER_DEFINITIONS = [
  {
    key: "course_id",
    label: "Course Name",
    routeName: "courses.hod.search",
    placeholder: "Select active course...",
    selectedLabelKey: "course"
  },
  {
    key: "curriculum_id",
    label: "Curriculum",
    routeName: "curriculums.search",
    placeholder: "Select curriculum...",
    selectedLabelKey: "curriculum"
  }
];
const FILTER_KEYS = FILTER_DEFINITIONS.map((filter) => filter.key);
const emptyFilterState = () => FILTER_KEYS.reduce((values, key) => ({ ...values, [key]: "" }), {});
function HodIndex({
  courses,
  filters = {},
  selectedFilters = {},
  department_context = null
}) {
  const pageFilters = filters && !Array.isArray(filters) && typeof filters === "object" ? filters : {};
  const [sortField, setSortField] = useState(
    pageFilters.sort || "created_at"
  );
  const [sortDirection, setSortDirection] = useState(
    pageFilters.direction || "desc"
  );
  const [form, setForm] = useState({
    ...emptyFilterState(),
    course_id: pageFilters.course_id || "",
    curriculum_id: pageFilters.curriculum_id || ""
  });
  const [currentFilterKey, setCurrentFilterKey] = useState(
    FILTER_DEFINITIONS.find((filter) => pageFilters[filter.key])?.key || ""
  );
  const [exportFormat, setExportFormat] = useState("pdf");
  const setFilter = (key, value) => {
    setForm((current) => ({
      ...current,
      [key]: value
    }));
  };
  const currentFilters = () => FILTER_KEYS.reduce(
    (values, key) => ({ ...values, [key]: form[key] }),
    {}
  );
  const selectedFilterDefinition = FILTER_DEFINITIONS.find(
    (filter) => filter.key === currentFilterKey
  );
  const activeFilters = FILTER_DEFINITIONS.filter(
    (filter) => form[filter.key]
  );
  const clearSingleFilter = (key) => {
    setFilter(key, "");
    if (currentFilterKey === key) {
      setCurrentFilterKey("");
    }
  };
  const getSelectedOptionLabel = (filter) => selectedFilters?.[filter.selectedLabelKey] || form[filter.key];
  const renderFilterInput = (filter) => {
    if (!filter) {
      return /* @__PURE__ */ jsx("div", { className: "rounded-xl border border-dashed border-zinc-200 bg-zinc-50 px-4 py-2 text-sm text-zinc-400", children: "Select a column to show its input" });
    }
    return /* @__PURE__ */ jsx(
      SearchSelect,
      {
        routeName: filter.routeName,
        defaultOptions: [],
        value: form[filter.key],
        selectedLabel: selectedFilters?.[filter.selectedLabelKey],
        placeholder: filter.placeholder,
        preloadOptions: true,
        onChange: (option) => setFilter(filter.key, option?.id || "")
      }
    );
  };
  const handleSort = (field) => {
    const direction = sortField === field && sortDirection === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortDirection(direction);
    router.get(
      route("courses.hod.index"),
      { ...currentFilters(), sort: field, direction, page: 1 },
      { preserveState: true, replace: true }
    );
  };
  const renderArrow = (field) => {
    if (sortField !== field) return null;
    return sortDirection === "asc" ? "^" : "v";
  };
  const submit = (e) => {
    e.preventDefault();
    router.get(
      route("courses.hod.index"),
      {
        ...currentFilters(),
        sort: sortField,
        direction: sortDirection,
        page: 1
      },
      { preserveState: true, replace: true }
    );
  };
  const clearFilters = () => {
    setForm(emptyFilterState());
    setCurrentFilterKey("");
    router.get(
      route("courses.hod.index"),
      { sort: sortField, direction: sortDirection, page: 1 },
      { preserveState: true, replace: true }
    );
  };
  const handleExport = () => {
    downloadExport("courses", exportFormat, {
      ...currentFilters(),
      search: pageFilters.search || "",
      sort: sortField,
      direction: sortDirection
    });
  };
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(Head, { title: "Department Courses" }),
    /* @__PURE__ */ jsxs("div", { className: "mx-auto w-full max-w-6xl animate-in fade-in slide-in-from-bottom-4 duration-700", children: [
      /* @__PURE__ */ jsx("div", { className: "mb-4 rounded-lg border border-zinc-100 bg-white p-4 shadow-sm", children: /* @__PURE__ */ jsxs("h1", { className: "text-2xl font-semibold text-zinc-900", children: [
        "Department Courses -",
        " ",
        /* @__PURE__ */ jsx("span", { className: " rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 ring-1 ring-emerald-100", children: department_context?.label })
      ] }) }),
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
                  onClick: () => currentFilterKey && form[currentFilterKey] && setCurrentFilterKey(""),
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
          pagination: courses,
          sortField,
          sortDirection,
          children: [
            /* @__PURE__ */ jsxs(Thead, { children: [
              /* @__PURE__ */ jsxs(
                THdata,
                {
                  onClick: () => handleSort("id"),
                  className: "cursor-pointer",
                  children: [
                    "Id ",
                    renderArrow("id")
                  ]
                }
              ),
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
                  onClick: () => handleSort("certification_level_id"),
                  className: "cursor-pointer",
                  children: [
                    "Certification Level",
                    " ",
                    renderArrow("certification_level_id")
                  ]
                }
              ),
              /* @__PURE__ */ jsx(THdata, { children: "Department" }),
              /* @__PURE__ */ jsx(THdata, { children: "Current Curriculum" }),
              /* @__PURE__ */ jsxs(
                THdata,
                {
                  onClick: () => handleSort("created_at"),
                  className: "cursor-pointer",
                  children: [
                    "Created ",
                    renderArrow("created_at")
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsx(Tbody, { children: courses?.data?.length ? courses.data.map((course) => /* @__PURE__ */ jsxs(Trow, { children: [
              /* @__PURE__ */ jsx(Tdata, { children: course.id }),
              /* @__PURE__ */ jsx(Tdata, { children: course.code }),
              /* @__PURE__ */ jsx(Tdata, { children: course.name }),
              /* @__PURE__ */ jsx(Tdata, { children: course.certification_level ?? "-" }),
              /* @__PURE__ */ jsx(Tdata, { children: course.department ?? "-" }),
              /* @__PURE__ */ jsx(Tdata, { children: course.curriculum ?? "-" }),
              /* @__PURE__ */ jsx(Tdata, { children: formatDate(course.created_at) })
            ] }, course.id)) : /* @__PURE__ */ jsx(Trow, { children: /* @__PURE__ */ jsx(Tdata, { colSpan: "7", className: "py-4 text-center", children: "No courses found." }) }) })
          ]
        }
      )
    ] })
  ] });
}
export {
  HodIndex as default
};
