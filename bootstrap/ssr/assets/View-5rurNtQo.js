import { jsxs, Fragment, jsx } from "react/jsx-runtime";
import { useForm, Head, router } from "@inertiajs/react";
import { useState } from "react";
import { I as InputLabel } from "./InputLabel-DlDnrkJG.js";
import { I as InputError } from "./InputError-CBvD_6aD.js";
import { S as SearchSelect } from "./SearchSelect-lqQVrrVr.js";
import "ziggy-js";
const FILTER_DEFINITIONS = [
  { key: "curriculum_mapping_id", label: "Course Mapping" },
  { key: "curriculum_unit_id", label: "Unit" },
  {
    key: "assessment_type",
    label: "Assessment Type",
    options: [
      { value: "theory", label: "Theory" },
      { value: "practical", label: "Practical" }
    ]
  },
  { key: "assessment_number", label: "Assessment Number", type: "number" },
  { key: "academic_year_id", label: "Academic Year" },
  { key: "academic_session_id", label: "Session" }
];
function View({
  filters,
  selected_unit,
  submitted_marks,
  course_mappings,
  unit_options,
  filter_options,
  blocker,
  can_publish,
  selected_filters
}) {
  const filterForm = useForm({
    curriculum_mapping_id: filters.curriculum_mapping_id || "",
    curriculum_unit_id: filters.curriculum_unit_id || "",
    assessment_type: filters.assessment_type || "",
    assessment_number: filters.assessment_number || "",
    academic_year_id: filters.academic_year_id || "",
    academic_session_id: filters.academic_session_id || ""
  });
  const marks = submitted_marks?.data ?? [];
  const currentPage = submitted_marks?.current_page ?? 1;
  const lastPage = submitted_marks?.last_page ?? 1;
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
  const loadUnits = (mappingId) => {
    router.get(
      route("academic.marks.view.index"),
      {
        curriculum_mapping_id: mappingId,
        assessment_type: filterForm.data.assessment_type,
        assessment_number: filterForm.data.assessment_number
      },
      { preserveState: true, preserveScroll: true, replace: true }
    );
  };
  const searchMarks = (page = 1) => {
    router.get(
      route("academic.marks.view.index"),
      {
        ...filterForm.data,
        search_marks: true,
        page
      },
      { preserveState: true, preserveScroll: true }
    );
  };
  const clearFilters = () => {
    filterForm.setData({
      curriculum_mapping_id: "",
      curriculum_unit_id: "",
      assessment_type: "",
      assessment_number: "",
      academic_year_id: "",
      academic_session_id: ""
    });
    setCurrentFilterKey("");
    router.get(
      route("academic.marks.view.index"),
      {},
      { preserveState: true, preserveScroll: true, replace: true }
    );
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
  const syncAcademicYear = (academicYear) => {
    router.get(
      route("academic.marks.view.index"),
      {
        curriculum_mapping_id: filterForm.data.curriculum_mapping_id,
        curriculum_unit_id: filterForm.data.curriculum_unit_id,
        assessment_type: filterForm.data.assessment_type,
        assessment_number: filterForm.data.assessment_number,
        academic_year_id: academicYear?.id || "",
        academic_session_id: ""
      },
      { preserveState: true, preserveScroll: true, replace: true }
    );
  };
  const exportMarks = () => {
    const params = new URLSearchParams();
    Object.entries({
      ...filterForm.data,
      format: exportFormat,
      context: "view"
    }).forEach(([key, value]) => {
      if (value !== null && value !== void 0 && value !== "") {
        params.set(key, value);
      }
    });
    window.open(
      `${route("academic.marks.export")}?${params.toString()}`,
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
      return selected_unit?.display_name || selected_unit?.name || value;
    }
    if (filter.key === "assessment_type") {
      return filter.options.find((option) => option.value === value)?.label || value;
    }
    if (filter.key === "assessment_number") {
      return `Assessment ${value}`;
    }
    if (filter.key === "academic_year_id") {
      return selected_filters?.academic_year?.name || value;
    }
    if (filter.key === "academic_session_id") {
      return selected_filters?.academic_session?.name || value;
    }
    return value;
  };
  const renderFilterInput = (filter) => {
    if (!filter) {
      return /* @__PURE__ */ jsx("div", { className: "rounded-xl border border-dashed border-zinc-200 bg-zinc-50 px-4 py-2 text-sm text-zinc-400", children: "Select a column to show its input" });
    }
    if (filter.key === "curriculum_mapping_id") {
      return /* @__PURE__ */ jsxs(
        "select",
        {
          value: filterForm.data.curriculum_mapping_id,
          onChange: (e) => {
            filterForm.setData("curriculum_mapping_id", e.target.value);
            filterForm.setData("curriculum_unit_id", "");
            filterForm.setData("academic_year_id", "");
            filterForm.setData("academic_session_id", "");
            loadUnits(e.target.value);
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
          selectedLabel: selected_unit ? selected_unit.display_name : null,
          placeholder: filterForm.data.curriculum_mapping_id ? "Search unit..." : "Select course mapping first...",
          preloadOptions: true,
          onChange: (unit) => filterForm.setData("curriculum_unit_id", unit?.id || ""),
          error: filterForm.errors.curriculum_unit_id,
          disabled: !filterForm.data.curriculum_mapping_id
        }
      );
    }
    if (filter.key === "assessment_type") {
      return /* @__PURE__ */ jsxs(
        "select",
        {
          value: filterForm.data.assessment_type,
          onChange: (e) => filterForm.setData("assessment_type", e.target.value),
          className: "w-full rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100",
          children: [
            /* @__PURE__ */ jsx("option", { value: "", children: "All Assessment Types" }),
            filter.options.map((option) => /* @__PURE__ */ jsx("option", { value: option.value, children: option.label }, option.value))
          ]
        }
      );
    }
    if (filter.key === "assessment_number") {
      return /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "number",
            min: "1",
            step: "1",
            list: "view-assessment-number-options",
            value: filterForm.data.assessment_number,
            onChange: (e) => {
              const value = e.target.value;
              filterForm.setData(
                "assessment_number",
                value === "" ? "" : value.replace(/\D/g, "")
              );
            },
            placeholder: "All Assessments or type a number",
            className: "w-full rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
          }
        ),
        /* @__PURE__ */ jsx("datalist", { id: "view-assessment-number-options", children: (filter_options?.assessment_numbers ?? []).map(
          (assessment) => /* @__PURE__ */ jsx(
            "option",
            {
              value: assessment.value,
              children: assessment.label
            },
            assessment.value
          )
        ) })
      ] });
    }
    if (filter.key === "academic_year_id") {
      return /* @__PURE__ */ jsx(
        SearchSelect,
        {
          routeName: "academic.years.search",
          value: filterForm.data.academic_year_id,
          selectedLabel: selected_filters?.academic_year?.name,
          placeholder: "Select academic year...",
          defaultOptions: filter_options?.academic_years?.map((year) => ({
            id: year.value,
            name: year.label
          })) ?? [],
          preloadOptions: true,
          onChange: (academicYear) => {
            filterForm.setData("academic_year_id", academicYear?.id || "");
            filterForm.setData("academic_session_id", "");
            syncAcademicYear(academicYear);
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
        selectedLabel: selected_filters?.academic_session?.name,
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
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(Head, { title: "View Marks" }),
    /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-6xl space-y-8", children: [
      /* @__PURE__ */ jsxs(
        "form",
        {
          className: "rounded-lg border border-zinc-100 bg-white p-4 shadow-sm",
          onSubmit: (event) => {
            event.preventDefault();
            searchMarks();
          },
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
                  disabled: !filterForm.data.curriculum_mapping_id || !filterForm.data.curriculum_unit_id,
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
              ] }) : "Choose a unit and apply filters to load submitted marks." }),
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
                    onClick: exportMarks,
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
      blocker && /* @__PURE__ */ jsx("div", { className: "rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-800", children: blocker }),
      marks.length > 0 && /* @__PURE__ */ jsxs("div", { className: "rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-xl font-semibold text-zinc-900", children: "Submitted Marks" }),
        /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-zinc-500", children: "Results are shown for the selected assessment filters, with pagination when multiple assessments are included." }),
        /* @__PURE__ */ jsx("div", { className: "mt-6 overflow-hidden rounded-2xl border border-zinc-100", children: /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs("table", { className: "w-full min-w-[48rem] border-collapse", children: [
          /* @__PURE__ */ jsx("thead", { className: "bg-zinc-50", children: /* @__PURE__ */ jsxs("tr", { className: "text-xs font-semibold uppercase tracking-wide text-zinc-500", children: [
            /* @__PURE__ */ jsx("th", { className: "px-4 py-3 text-left", children: "Reg. No." }),
            /* @__PURE__ */ jsx("th", { className: "px-4 py-3 text-left", children: "Student" }),
            /* @__PURE__ */ jsx("th", { className: "px-4 py-3 text-left", children: "Unit" }),
            /* @__PURE__ */ jsx("th", { className: "px-4 py-3 text-left", children: "Session" }),
            /* @__PURE__ */ jsx("th", { className: "px-4 py-3 text-left", children: "Type" }),
            /* @__PURE__ */ jsx("th", { className: "px-4 py-3 text-left", children: "Assessment" }),
            /* @__PURE__ */ jsx("th", { className: "px-4 py-3 text-left", children: "Marks" }),
            /* @__PURE__ */ jsx("th", { className: "px-4 py-3 text-left", children: "Status" })
          ] }) }),
          /* @__PURE__ */ jsx("tbody", { className: "divide-y divide-zinc-100 bg-white", children: marks.length ? marks.map((mark) => /* @__PURE__ */ jsxs(
            "tr",
            {
              className: "text-sm",
              children: [
                /* @__PURE__ */ jsx("td", { className: "px-4 py-3 font-medium text-zinc-900", children: mark.admission_number }),
                /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-zinc-700", children: mark.student_name || "-" }),
                /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-zinc-700", children: mark.unit_name || "-" }),
                /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-zinc-700", children: mark.session_name || "-" }),
                /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-zinc-700", children: mark.assessment_type || "-" }),
                /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-zinc-700", children: mark.assessment_number || "-" }),
                /* @__PURE__ */ jsx("td", { className: "px-4 py-3 font-semibold text-zinc-900", children: mark.marks }),
                /* @__PURE__ */ jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsx(
                  "span",
                  {
                    className: `rounded-full px-3 py-1 text-xs font-semibold ${mark.is_published ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`,
                    children: mark.is_published ? "Published" : "Unpublished"
                  }
                ) })
              ]
            },
            mark.id
          )) : /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx(
            "td",
            {
              colSpan: "8",
              className: "px-4 py-8 text-center text-sm text-zinc-500",
              children: submitted_marks ? "No submitted marks found for the selected filters." : "Run a search to view submitted marks."
            }
          ) }) })
        ] }) }) }),
        lastPage > 1 && /* @__PURE__ */ jsxs("div", { className: "mt-5 flex justify-end gap-2", children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              onClick: () => searchMarks(currentPage - 1),
              disabled: currentPage === 1,
              className: "rounded-lg border border-zinc-200 px-3 py-1.5 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-40",
              children: "Prev"
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              onClick: () => searchMarks(currentPage + 1),
              disabled: currentPage === lastPage,
              className: "rounded-lg border border-zinc-200 px-3 py-1.5 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-40",
              children: "Next"
            }
          )
        ] })
      ] })
    ] })
  ] });
}
export {
  View as default
};
