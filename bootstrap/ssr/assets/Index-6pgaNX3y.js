import { jsxs, Fragment, jsx } from "react/jsx-runtime";
import { Head, Link, router } from "@inertiajs/react";
import { useState } from "react";
import { T as Table, a as Thead, b as THdata, c as Tbody, d as Trow, e as Tdata } from "./Tdata-BYbinPOB.js";
import { f as formatDate } from "./date-CQXYOX-2.js";
import { S as SearchSelect } from "./SearchSelect-CY7NDfHZ.js";
import { I as InputLabel } from "./InputLabel-DlDnrkJG.js";
import { d as downloadExport } from "./exportDownload-D_MQvCpZ.js";
import "ziggy-js";
const FILTER_DEFINITIONS = [
  {
    key: "curriculum_id",
    label: "Curriculum",
    routeName: "curriculums.search",
    placeholder: "Select curriculum...",
    selectedLabelKey: "curriculum"
  },
  {
    key: "course_id",
    label: "Course",
    routeName: "courses.search",
    placeholder: "Select course...",
    selectedLabelKey: "course"
  },
  {
    key: "exam_body_id",
    label: "Exam Body",
    routeName: "exam.bodies.search",
    placeholder: "Select exam body...",
    selectedLabelKey: "exam_body"
  },
  {
    key: "is_active",
    label: "Status",
    type: "select",
    selectedLabelKey: "status",
    options: [
      { value: "1", label: "Active" },
      { value: "0", label: "Inactive" }
    ]
  }
];
const FILTER_KEYS = FILTER_DEFINITIONS.map((filter) => filter.key);
const emptyFilterState = () => FILTER_KEYS.reduce((values, key) => ({ ...values, [key]: "" }), {});
function CurriculumMappingsIndex({
  curriculumMappings,
  filters = {},
  selectedFilters = {}
}) {
  const pageFilters = filters && typeof filters === "object" && !Array.isArray(filters) ? filters : {};
  const [sortField, setSortField] = useState(
    pageFilters.sort || curriculumMappings.sort || "created_at"
  );
  const [sortDirection, setSortDirection] = useState(
    pageFilters.direction || curriculumMappings.direction || "desc"
  );
  const [form, setForm] = useState({
    ...emptyFilterState(),
    curriculum_id: pageFilters.curriculum_id || "",
    course_id: pageFilters.course_id || "",
    exam_body_id: pageFilters.exam_body_id || "",
    is_active: pageFilters.is_active ?? ""
  });
  const [currentFilterKey, setCurrentFilterKey] = useState(
    FILTER_KEYS.find((key) => pageFilters[key] !== void 0 && pageFilters[key] !== "") || ""
  );
  const [exportFormat, setExportFormat] = useState("pdf");
  const setFilter = (key, value) => {
    setForm((current) => ({
      ...current,
      [key]: value
    }));
  };
  const currentFilters = () => FILTER_KEYS.reduce((values, key) => ({ ...values, [key]: form[key] }), {});
  const selectedFilterDefinition = FILTER_DEFINITIONS.find(
    (filter) => filter.key === currentFilterKey
  );
  const activeFilters = FILTER_DEFINITIONS.filter(
    (filter) => form[filter.key] !== void 0 && form[filter.key] !== ""
  );
  const addCurrentFilter = () => {
    if (!currentFilterKey || form[currentFilterKey] === "") return;
    setCurrentFilterKey("");
  };
  const clearSingleFilter = (key) => {
    setFilter(key, "");
    if (currentFilterKey === key) {
      setCurrentFilterKey("");
    }
  };
  const getSelectedOptionLabel = (filter) => selectedFilters?.[filter.selectedLabelKey] || filter.options?.find((option) => option.value === form[filter.key])?.label || form[filter.key];
  const renderFilterInput = (filter) => {
    if (!filter) {
      return /* @__PURE__ */ jsx("div", { className: "rounded-xl border border-dashed border-zinc-200 bg-zinc-50 px-4 py-2 text-sm text-zinc-400", children: "Select a column to show its input" });
    }
    if (filter.type === "select") {
      return /* @__PURE__ */ jsxs(
        "select",
        {
          value: form[filter.key],
          onChange: (e) => setFilter(filter.key, e.target.value),
          className: "w-full rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100",
          children: [
            /* @__PURE__ */ jsx("option", { value: "", children: "Choose status..." }),
            filter.options.map((option) => /* @__PURE__ */ jsx("option", { value: option.value, children: option.label }, option.value))
          ]
        }
      );
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
      route("courses.curriculum-mappings.index"),
      {
        ...currentFilters(),
        sort: field,
        direction,
        page: 1
      },
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
      route("courses.curriculum-mappings.index"),
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
      route("courses.curriculum-mappings.index"),
      { sort: sortField, direction: sortDirection, page: 1 },
      { preserveState: true, replace: true }
    );
  };
  const handleExport = () => {
    downloadExport("curriculum-mappings", exportFormat, {
      ...currentFilters(),
      search: pageFilters.search || "",
      sort: sortField,
      direction: sortDirection
    });
  };
  const handleDelete = (id) => {
    if (!confirm("Are you sure you want to delete this mapping?")) {
      return;
    }
    router.delete(
      route(
        "courses.curriculum-mappings.destroy",
        encodeURIComponent(id)
      ),
      {
        preserveState: true,
        replace: true
      }
    );
  };
  const handleActivate = (id) => {
    if (!confirm("Activate this curriculum mapping?")) {
      return;
    }
    router.patch(
      route("courses.curriculum-mappings.activate", id),
      {},
      {
        preserveScroll: true,
        preserveState: true,
        replace: true
      }
    );
  };
  const handleDeactivate = (id) => {
    if (!confirm("Deactivate this curriculum mapping?")) {
      return;
    }
    router.patch(
      route("courses.curriculum-mappings.deactivate", id),
      {},
      {
        preserveScroll: true,
        preserveState: true,
        replace: true
      }
    );
  };
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(Head, { title: "Curriculum Mapping" }),
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
                  disabled: !currentFilterKey || form[currentFilterKey] === "",
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
                    ": ",
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
          pagination: curriculumMappings,
          sortField,
          sortDirection,
          children: [
            /* @__PURE__ */ jsxs(Thead, { children: [
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
              /* @__PURE__ */ jsx(THdata, { children: "Course" }),
              /* @__PURE__ */ jsx(THdata, { children: "Exam Body" }),
              /* @__PURE__ */ jsxs(
                THdata,
                {
                  onClick: () => handleSort("is_active"),
                  className: "cursor-pointer",
                  children: [
                    "Status ",
                    renderArrow("is_active")
                  ]
                }
              ),
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
              ),
              /* @__PURE__ */ jsx(THdata, { children: /* @__PURE__ */ jsx("p", { className: "flex w-full justify-center", children: /* @__PURE__ */ jsx("span", { children: "Actions" }) }) })
            ] }),
            /* @__PURE__ */ jsx(Tbody, { children: curriculumMappings?.data?.length ? curriculumMappings.data.map((mapping) => /* @__PURE__ */ jsxs(Trow, { children: [
              /* @__PURE__ */ jsx(Tdata, { children: mapping.curriculum?.name }),
              /* @__PURE__ */ jsx(Tdata, { children: mapping.course?.name ?? "-" }),
              /* @__PURE__ */ jsx(Tdata, { children: mapping.course?.certification_level?.exam_body ? `${mapping.course.certification_level.exam_body.code} - ${mapping.course.certification_level.exam_body.name}` : "-" }),
              /* @__PURE__ */ jsx(Tdata, { children: /* @__PURE__ */ jsx(
                "span",
                {
                  className: `rounded px-2 py-1 text-xs ${mapping.is_active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`,
                  children: mapping.is_active ? "Active" : "Inactive"
                }
              ) }),
              /* @__PURE__ */ jsx(Tdata, { children: formatDate(mapping.created_at) }),
              /* @__PURE__ */ jsx(Tdata, { children: /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center justify-center gap-x-4 gap-y-2", children: [
                /* @__PURE__ */ jsx(
                  Link,
                  {
                    href: route(
                      "units.index",
                      {
                        curriculum_mapping_id: mapping.id
                      }
                    ),
                    className: "text-emerald-600 hover:underline",
                    children: "Units"
                  }
                ),
                /* @__PURE__ */ jsx(
                  Link,
                  {
                    href: route(
                      "courses.curriculum-mappings.edit",
                      encodeURIComponent(
                        mapping.id
                      )
                    ),
                    className: "text-emerald-600 hover:underline",
                    children: "Edit"
                  }
                ),
                mapping.is_active ? /* @__PURE__ */ jsx(
                  "button",
                  {
                    onClick: () => handleDeactivate(
                      mapping.id
                    ),
                    className: "text-amber-600 hover:underline",
                    children: "Deactivate"
                  }
                ) : /* @__PURE__ */ jsx(
                  "button",
                  {
                    onClick: () => handleActivate(
                      mapping.id
                    ),
                    className: "text-emerald-600 hover:underline",
                    children: "Activate"
                  }
                ),
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    onClick: () => handleDelete(mapping.id),
                    className: "text-red-600 hover:underline",
                    children: "Delete"
                  }
                )
              ] }) })
            ] }, mapping.id)) : /* @__PURE__ */ jsx(Trow, { children: /* @__PURE__ */ jsx(Tdata, { colSpan: "6", className: "py-4 text-center", children: "No curriculum mappings found." }) }) })
          ]
        }
      )
    ] })
  ] });
}
export {
  CurriculumMappingsIndex as default
};
