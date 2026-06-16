import { jsxs, Fragment, jsx } from "react/jsx-runtime";
import { useForm, Head, router } from "@inertiajs/react";
import { useState } from "react";
import { I as InputError } from "./InputError-CBvD_6aD.js";
import { I as InputLabel } from "./InputLabel-DlDnrkJG.js";
import { S as SearchSelect } from "./SearchSelect-CY7NDfHZ.js";
import { f as formatDate } from "./date-CQXYOX-2.js";
import "ziggy-js";
const FILTER_DEFINITIONS = [
  { key: "admission_number", label: "Admission Number", type: "text" },
  { key: "curriculum_mapping_id", label: "Course Mapping" },
  { key: "curriculum_unit_id", label: "Unit" },
  { key: "academic_year_id", label: "Academic Year" },
  { key: "academic_session_id", label: "Session" }
];
function Marksheet({
  filters,
  selected_unit,
  course_mappings,
  unit_options,
  filter_options,
  marksheet,
  blocker,
  can_publish,
  selected_filters
}) {
  const filterForm = useForm({
    admission_number: filters.admission_number || "",
    curriculum_mapping_id: filters.curriculum_mapping_id || "",
    curriculum_unit_id: filters.curriculum_unit_id || "",
    academic_year_id: filters.academic_year_id || "",
    academic_session_id: filters.academic_session_id || ""
  });
  const [currentFilterKey, setCurrentFilterKey] = useState(
    FILTER_DEFINITIONS.find((filter) => filterForm.data[filter.key])?.key || ""
  );
  const [exportFormat, setExportFormat] = useState("pdf");
  const currentFilter = FILTER_DEFINITIONS.find(
    (filter) => filter.key === currentFilterKey
  );
  const activeFilters = FILTER_DEFINITIONS.filter(
    (filter) => filterForm.data[filter.key]
  );
  const loadMarksheet = (event) => {
    event?.preventDefault();
    router.get(route("academic.marks.marksheet.index"), filterForm.data, {
      preserveState: true,
      preserveScroll: true
    });
  };
  const clearFilters = () => {
    filterForm.setData({
      curriculum_mapping_id: "",
      curriculum_unit_id: "",
      academic_year_id: "",
      academic_session_id: "",
      admission_number: ""
    });
    setCurrentFilterKey("");
  };
  const clearSingleFilter = (key) => {
    const updates = { [key]: "" };
    if (key === "curriculum_mapping_id") {
      updates.curriculum_unit_id = "";
      updates.academic_year_id = "";
      updates.academic_session_id = "";
    }
    if (key === "academic_year_id") {
      updates.academic_session_id = "";
    }
    filterForm.setData({ ...filterForm.data, ...updates });
    if (currentFilterKey === key) {
      setCurrentFilterKey("");
    }
  };
  const downloadMarksheet = () => {
    const params = new URLSearchParams();
    Object.entries({
      ...filterForm.data,
      format: exportFormat
    }).forEach(([key, value]) => {
      if (value !== null && value !== void 0 && value !== "") {
        params.set(key, value);
      }
    });
    window.open(
      `${route("academic.marks.marksheet.export")}?${params.toString()}`,
      "_blank",
      "noopener,noreferrer"
    );
  };
  const selectedLabel = (filter) => {
    const value = filterForm.data[filter.key];
    if (!value) return "";
    if (filter.key === "curriculum_mapping_id") {
      return course_mappings.find(
        (mapping) => String(mapping.id) === String(value)
      )?.name || value;
    }
    if (filter.key === "curriculum_unit_id") {
      return unit_options.find((unit) => String(unit.id) === String(value))?.display_name || unit_options.find((unit) => String(unit.id) === String(value))?.name || selected_unit?.display_name || selected_unit?.name || value;
    }
    if (filter.key === "academic_year_id") {
      return filter_options?.academic_years?.find(
        (year) => String(year.value) === String(value)
      )?.label || selected_filters?.academic_year?.name || value;
    }
    if (filter.key === "academic_session_id") {
      return filter_options?.sessions?.find(
        (session) => String(session.value) === String(value)
      )?.label || selected_filters?.academic_session?.name || value;
    }
    return value;
  };
  const renderFilterInput = (filter) => {
    if (!filter) {
      return /* @__PURE__ */ jsx("div", { className: "rounded-xl border border-dashed border-zinc-200 bg-zinc-50 px-4 py-2 text-sm text-zinc-400", children: "Select a column to show its input" });
    }
    if (filter.key === "admission_number") {
      return /* @__PURE__ */ jsx(
        "input",
        {
          type: "text",
          value: filterForm.data.admission_number,
          onChange: (e) => filterForm.setData("admission_number", e.target.value),
          placeholder: "Search admission number...",
          className: "w-full rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
        }
      );
    }
    if (filter.key === "curriculum_mapping_id") {
      return /* @__PURE__ */ jsxs(
        "select",
        {
          value: filterForm.data.curriculum_mapping_id,
          onChange: (event) => {
            filterForm.setData(
              "curriculum_mapping_id",
              event.target.value
            );
            filterForm.setData("curriculum_unit_id", "");
            filterForm.setData("academic_year_id", "");
            filterForm.setData("academic_session_id", "");
          },
          className: "w-full rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100",
          children: [
            /* @__PURE__ */ jsx("option", { value: "", children: "Select course mapping..." }),
            course_mappings.map((mapping) => /* @__PURE__ */ jsx("option", { value: mapping.id, children: mapping.name }, mapping.id))
          ]
        }
      );
    }
    if (filter.key === "curriculum_unit_id") {
      return /* @__PURE__ */ jsx(
        SearchSelect,
        {
          routeName: "units.search",
          routeParams: {
            curriculum_mapping_id: filterForm.data.curriculum_mapping_id,
            limit: 10
          },
          defaultOptions: unit_options,
          value: filterForm.data.curriculum_unit_id,
          selectedLabel: selectedLabel({ key: "curriculum_unit_id" }),
          placeholder: filterForm.data.curriculum_mapping_id ? "Search unit..." : "Select course mapping first...",
          preloadOptions: true,
          onChange: (unit) => filterForm.setData("curriculum_unit_id", unit?.id || ""),
          error: filterForm.errors.curriculum_unit_id,
          disabled: !filterForm.data.curriculum_mapping_id
        }
      );
    }
    if (filter.key === "academic_year_id") {
      return /* @__PURE__ */ jsx(
        SearchSelect,
        {
          routeName: "academic.years.search",
          value: filterForm.data.academic_year_id,
          selectedLabel: selectedLabel({ key: "academic_year_id" }),
          placeholder: "Select academic year...",
          defaultOptions: filter_options?.academic_years?.map((year) => ({
            id: year.value,
            name: year.label
          })) ?? [],
          preloadOptions: true,
          onChange: (academicYear) => {
            filterForm.setData("academic_year_id", academicYear?.id || "");
            filterForm.setData("academic_session_id", "");
          }
        }
      );
    }
    return /* @__PURE__ */ jsx(
      SearchSelect,
      {
        routeName: "academic.sessions.search",
        routeParams: {
          academic_year_id: filterForm.data.academic_year_id
        },
        value: filterForm.data.academic_session_id,
        selectedLabel: selectedLabel({ key: "academic_session_id" }),
        placeholder: filterForm.data.academic_year_id ? "Search session..." : "Select academic year first...",
        defaultOptions: filter_options?.sessions?.map((session) => ({
          id: session.value,
          name: session.label
        })) ?? [],
        preloadOptions: true,
        onChange: (session) => filterForm.setData("academic_session_id", session?.id || ""),
        disabled: !filterForm.data.academic_year_id
      }
    );
  };
  const rows = marksheet?.rows ?? [];
  const pagination = marksheet?.pagination ?? {
    current_page: 1,
    last_page: 1,
    total: rows.length
  };
  const meta = marksheet?.meta ?? {};
  const goToPage = (page) => {
    router.get(
      route("academic.marks.marksheet.index"),
      {
        ...filterForm.data,
        page
      },
      {
        preserveState: true,
        preserveScroll: true
      }
    );
  };
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(Head, { title: "FA Marksheet" }),
    /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-7xl space-y-8", children: [
      /* @__PURE__ */ jsxs(
        "form",
        {
          onSubmit: loadMarksheet,
          className: "rounded-lg border border-zinc-100 bg-white p-4 shadow-sm",
          children: [
            /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 items-end gap-3 lg:grid-cols-[minmax(220px,300px)_minmax(300px,1fr)_auto_auto_auto]", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx(InputLabel, { value: "Filter Column" }),
                /* @__PURE__ */ jsxs(
                  "select",
                  {
                    value: currentFilterKey,
                    onChange: (event) => setCurrentFilterKey(event.target.value),
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
                    value: currentFilter?.label || "Filter Value"
                  }
                ),
                renderFilterInput(currentFilter)
              ] }),
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  onClick: () => setCurrentFilterKey(""),
                  disabled: !currentFilterKey || !filterForm.data[currentFilterKey],
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
                  type: "submit",
                  disabled: !filterForm.data.curriculum_unit_id,
                  className: "inline-flex h-10 items-center justify-center rounded-lg bg-emerald-600 px-4 text-sm text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60",
                  children: "Apply"
                }
              )
            ] }),
            /* @__PURE__ */ jsx(
              InputError,
              {
                message: filterForm.errors.curriculum_mapping_id,
                className: "mt-2"
              }
            ),
            /* @__PURE__ */ jsx(
              InputError,
              {
                message: filterForm.errors.curriculum_unit_id,
                className: "mt-2"
              }
            ),
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
                    selectedLabel(filter)
                  ] }),
                  /* @__PURE__ */ jsx("span", { className: "text-emerald-900", children: "x" })
                ]
              },
              filter.key
            )) }) : /* @__PURE__ */ jsx("p", { className: "text-sm text-zinc-500", children: "No filters selected. Choose a column above to filter this table." }) }),
            /* @__PURE__ */ jsxs("div", { className: "mt-4 flex flex-col gap-3 border-t border-zinc-100 pt-3 sm:flex-row sm:items-center sm:justify-between", children: [
              /* @__PURE__ */ jsx("div", { className: "text-sm text-zinc-500", children: selected_unit ? /* @__PURE__ */ jsxs("span", { className: "font-semibold text-zinc-800", children: [
                selected_unit.code,
                " - ",
                selected_unit.name
              ] }) : "Choose a unit and apply filters to load the marksheet." }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center", children: [
                /* @__PURE__ */ jsxs(
                  "select",
                  {
                    value: exportFormat,
                    onChange: (event) => setExportFormat(event.target.value),
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
                    onClick: downloadMarksheet,
                    disabled: !filterForm.data.curriculum_unit_id,
                    className: "h-[34px] whitespace-nowrap rounded-r bg-gray-400 px-4 text-sm font-medium text-white transition-colors hover:bg-gray-600 disabled:cursor-not-allowed disabled:opacity-50",
                    children: [
                      "Export ",
                      exportFormat.toUpperCase()
                    ]
                  }
                )
              ] })
            ] })
          ]
        }
      ),
      blocker ? /* @__PURE__ */ jsx("div", { className: "rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-800", children: blocker }) : null,
      selected_unit && !blocker ? /* @__PURE__ */ jsx("div", { className: "overflow-hidden border border-zinc-200 bg-white px-5 py-6 shadow-sm", children: /* @__PURE__ */ jsxs("div", { className: "text-[12px] text-black", children: [
        /* @__PURE__ */ jsx("div", { className: "mb-6 text-center text-[15px] font-semibold uppercase tracking-wide text-blue-800 underline", children: "Formative Assessment (FA) Marksheet Per Unit of Competency" }),
        /* @__PURE__ */ jsxs("div", { className: "mb-3 grid grid-cols-1 gap-x-10 gap-y-3 md:grid-cols-[1fr_1fr_0.9fr]", children: [
          /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx("span", { className: "font-bold", children: "Assessment Center Code:" }) }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("span", { className: "font-bold", children: "Assessment Center Name:" }),
            " ",
            meta.assessment_center_name || ""
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("span", { className: "font-bold", children: "Term Dates:" }),
            " ",
            "From",
            " ",
            meta.term_from ? formatDate(meta.term_from) : "",
            " ",
            "to",
            " ",
            meta.term_to ? formatDate(meta.term_to) : ""
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "mb-3 grid grid-cols-1 gap-x-10 gap-y-3 md:grid-cols-[1fr_1fr_0.9fr]", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("span", { className: "font-bold", children: "Course Code:" }),
            " ",
            meta.course_code || ""
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("span", { className: "font-bold", children: "Course Title:" }),
            " ",
            meta.course_title || ""
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("span", { className: "font-bold", children: "Unit Code:" }),
            " ",
            meta.unit_code || ""
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "mb-5", children: [
          /* @__PURE__ */ jsx("span", { className: "font-bold", children: "Unit Title:" }),
          " ",
          meta.unit_title || ""
        ] }),
        /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs("table", { className: "w-full min-w-[980px] border-collapse border border-zinc-500 text-[12px]", children: [
          /* @__PURE__ */ jsxs("thead", { children: [
            /* @__PURE__ */ jsxs("tr", { className: "bg-white", children: [
              /* @__PURE__ */ jsx(
                "th",
                {
                  rowSpan: "2",
                  className: "w-[44px] border border-zinc-500 bg-zinc-50 px-1 py-2 text-left font-bold",
                  children: "S/N"
                }
              ),
              /* @__PURE__ */ jsx(
                "th",
                {
                  rowSpan: "2",
                  className: "w-[220px] border border-zinc-500 bg-zinc-50 px-1 py-2 text-left font-bold",
                  children: "Candidate's Reg Code"
                }
              ),
              /* @__PURE__ */ jsx(
                "th",
                {
                  rowSpan: "2",
                  className: "w-[180px] border border-zinc-500 bg-zinc-50 px-1 py-2 text-left font-bold",
                  children: "Candidate's Name"
                }
              ),
              /* @__PURE__ */ jsx(
                "th",
                {
                  colSpan: "4",
                  className: "border border-zinc-500 bg-zinc-200 px-1 py-1 text-center font-bold",
                  children: "Continuous Theory (CT) Marks (100%)"
                }
              ),
              /* @__PURE__ */ jsx(
                "th",
                {
                  colSpan: "4",
                  className: "border border-zinc-500 bg-orange-50 px-1 py-1 text-center font-bold",
                  children: "Continuous Practical (CP) Marks (100%)"
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("tr", { className: "bg-white", children: [
              /* @__PURE__ */ jsx("th", { className: "w-[80px] border border-zinc-500 bg-zinc-50 px-1 py-1 text-center font-bold", children: "FA 1" }),
              /* @__PURE__ */ jsx("th", { className: "w-[80px] border border-zinc-500 bg-zinc-50 px-1 py-1 text-center font-bold", children: "FA 2" }),
              /* @__PURE__ */ jsx("th", { className: "w-[80px] border border-zinc-500 bg-zinc-50 px-1 py-1 text-center font-bold", children: "FA 3" }),
              /* @__PURE__ */ jsx("th", { className: "w-[140px] border border-zinc-500 bg-zinc-200 px-1 py-1 text-center font-bold", children: "Average" }),
              /* @__PURE__ */ jsx("th", { className: "w-[92px] border border-zinc-500 bg-orange-50 px-1 py-1 text-center font-bold", children: "Pract 1" }),
              /* @__PURE__ */ jsx("th", { className: "w-[92px] border border-zinc-500 bg-orange-50 px-1 py-1 text-center font-bold", children: "Pract 2" }),
              /* @__PURE__ */ jsx("th", { className: "w-[92px] border border-zinc-500 bg-orange-50 px-1 py-1 text-center font-bold", children: "Pract 3" }),
              /* @__PURE__ */ jsx("th", { className: "w-[140px] border border-zinc-500 bg-orange-100 px-1 py-1 text-center font-bold", children: "Average" })
            ] })
          ] }),
          /* @__PURE__ */ jsx("tbody", { children: rows.map((row, index) => /* @__PURE__ */ jsxs(
            "tr",
            {
              children: [
                /* @__PURE__ */ jsx("td", { className: "border border-zinc-500 px-1 py-1 text-center", children: `${index + 1}.` }),
                /* @__PURE__ */ jsx("td", { className: "border border-zinc-500 px-1 py-1", children: row.admission_number || "" }),
                /* @__PURE__ */ jsx("td", { className: "border border-zinc-500 px-1 py-1", children: row.student_name || "" }),
                /* @__PURE__ */ jsx("td", { className: "border border-zinc-500 px-1 py-1 text-center", children: row.theory?.[1] || "" }),
                /* @__PURE__ */ jsx("td", { className: "border border-zinc-500 px-1 py-1 text-center", children: row.theory?.[2] || "" }),
                /* @__PURE__ */ jsx("td", { className: "border border-zinc-500 px-1 py-1 text-center", children: row.theory?.[3] || "" }),
                /* @__PURE__ */ jsx("td", { className: "border border-zinc-500 bg-zinc-100 px-1 py-1 text-center font-semibold text-rose-700", children: row.theory_average || "" }),
                /* @__PURE__ */ jsx("td", { className: "border border-zinc-500 px-1 py-1 text-center", children: row.practical?.[1] || "" }),
                /* @__PURE__ */ jsx("td", { className: "border border-zinc-500 px-1 py-1 text-center", children: row.practical?.[2] || "" }),
                /* @__PURE__ */ jsx("td", { className: "border border-zinc-500 px-1 py-1 text-center", children: row.practical?.[3] || "" }),
                /* @__PURE__ */ jsx("td", { className: "border border-zinc-500 bg-orange-50 px-1 py-1 text-center font-semibold text-rose-700", children: row.practical_average || "" })
              ]
            },
            row.admission_number || index
          )) })
        ] }) }),
        pagination.last_page > 1 ? /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between pt-3", children: [
          /* @__PURE__ */ jsxs("div", { className: "text-sm text-zinc-600", children: [
            "Page ",
            pagination.current_page,
            " of",
            " ",
            pagination.last_page,
            " |",
            " ",
            pagination.total,
            " students"
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                onClick: () => goToPage(
                  pagination.current_page - 1
                ),
                disabled: pagination.current_page === 1,
                className: "rounded-lg border border-zinc-200 px-3 py-1.5 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-40",
                children: "Prev"
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                onClick: () => goToPage(
                  pagination.current_page + 1
                ),
                disabled: pagination.current_page === pagination.last_page,
                className: "rounded-lg border border-zinc-200 px-3 py-1.5 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-40",
                children: "Next"
              }
            )
          ] })
        ] }) : null
      ] }) }) : null
    ] })
  ] });
}
export {
  Marksheet as default
};
