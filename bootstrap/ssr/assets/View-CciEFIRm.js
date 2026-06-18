import { jsxs, Fragment, jsx } from "react/jsx-runtime";
import { useForm, Head, router } from "@inertiajs/react";
import { useState } from "react";
import { I as InputError } from "./InputError-CBvD_6aD.js";
import { I as InputLabel } from "./InputLabel-DlDnrkJG.js";
import { S as SearchSelect } from "./SearchSelect-PvfiRNjv.js";
import "ziggy-js";
import "lucide-react";
import "../app.js";
import "axios";
import "../app2.js";
import "react-dom/client";
import "@radix-ui/react-collapsible";
import "@radix-ui/react-scroll-area";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-separator";
import "@radix-ui/react-dialog";
import "@radix-ui/react-tooltip";
import "react-toastify";
import "./popover-CKqVD3WM.js";
import "cmdk";
import "@radix-ui/react-popover";
function View({
  filters,
  selected_unit,
  submitted_marks,
  unit_options,
  filter_options,
  blocker,
  selected_filters
}) {
  const filterForm = useForm({
    curriculum_unit_id: filters.curriculum_unit_id || "",
    assessment_type: filters.assessment_type || "",
    assessment_number: filters.assessment_number || "",
    academic_year_id: filters.academic_year_id || "",
    academic_session_id: filters.academic_session_id || ""
  });
  const marks = submitted_marks?.data ?? [];
  const currentPage = submitted_marks?.current_page ?? 1;
  const lastPage = submitted_marks?.last_page ?? 1;
  const [exportFormat, setExportFormat] = useState("pdf");
  const searchMarks = (page = 1) => {
    router.get(
      route("academic.marks.view.index"),
      { ...filterForm.data, search_marks: true, page },
      { preserveState: true, preserveScroll: true }
    );
  };
  const clearFilters = () => {
    filterForm.setData({
      curriculum_unit_id: "",
      assessment_type: "",
      assessment_number: "",
      academic_year_id: "",
      academic_session_id: ""
    });
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
    if (filter.key === "curriculum_unit_id") {
      return unit_options.find((unit) => String(unit.id) === String(value))?.display_name || unit_options.find((unit) => String(unit.id) === String(value))?.name || selected_unit?.display_name || selected_unit?.name || value;
    }
    if (filter.key === "assessment_type") {
      return filter.options.find((option) => option.value === value)?.label || value;
    }
    if (filter.key === "assessment_number") {
      return `Assessment ${value}`;
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
            /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx(InputLabel, { value: "Unit" }),
                /* @__PURE__ */ jsx(
                  SearchSelect,
                  {
                    routeName: "units.search",
                    routeParams: { limit: 10 },
                    defaultOptions: unit_options,
                    value: filterForm.data.curriculum_unit_id,
                    selectedLabel: selectedLabel({
                      key: "curriculum_unit_id"
                    }),
                    placeholder: "Search unit...",
                    preloadOptions: true,
                    onChange: (unit) => filterForm.setData(
                      "curriculum_unit_id",
                      unit?.id || ""
                    ),
                    error: filterForm.errors.curriculum_unit_id
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx(InputLabel, { value: "Academic Year" }),
                /* @__PURE__ */ jsx(
                  SearchSelect,
                  {
                    routeName: "academic.years.search",
                    value: filterForm.data.academic_year_id,
                    selectedLabel: selectedLabel({
                      key: "academic_year_id"
                    }),
                    placeholder: "Select academic year...",
                    defaultOptions: filter_options?.academic_years?.map(
                      (year) => ({
                        id: year.value,
                        name: year.label
                      })
                    ) ?? [],
                    preloadOptions: true,
                    onChange: (academicYear) => {
                      filterForm.setData(
                        "academic_year_id",
                        academicYear?.id || ""
                      );
                      filterForm.setData(
                        "academic_session_id",
                        ""
                      );
                    }
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx(InputLabel, { value: "Session" }),
                /* @__PURE__ */ jsx(
                  SearchSelect,
                  {
                    routeName: "academic.sessions.search",
                    routeParams: {
                      academic_year_id: filterForm.data.academic_year_id
                    },
                    value: filterForm.data.academic_session_id,
                    selectedLabel: selectedLabel({
                      key: "academic_session_id"
                    }),
                    placeholder: filterForm.data.academic_year_id ? "Search session..." : "Select academic year first...",
                    defaultOptions: filter_options?.sessions?.map(
                      (session) => ({
                        id: session.value,
                        name: session.label
                      })
                    ) ?? [],
                    preloadOptions: true,
                    onChange: (session) => filterForm.setData(
                      "academic_session_id",
                      session?.id || ""
                    ),
                    disabled: !filterForm.data.academic_year_id
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx(InputLabel, { value: "Assessment Type" }),
                /* @__PURE__ */ jsxs(
                  "select",
                  {
                    value: filterForm.data.assessment_type,
                    onChange: (e) => filterForm.setData(
                      "assessment_type",
                      e.target.value
                    ),
                    className: "w-full rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100",
                    children: [
                      /* @__PURE__ */ jsx("option", { value: "", children: "All Assessment Types" }),
                      /* @__PURE__ */ jsx("option", { value: "theory", children: "Theory" }),
                      /* @__PURE__ */ jsx("option", { value: "practical", children: "Practical" })
                    ]
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx(InputLabel, { value: "Assessment Number" }),
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
              ] })
            ] }),
            /* @__PURE__ */ jsx(
              InputError,
              {
                message: filterForm.errors.curriculum_unit_id,
                className: "mt-2"
              }
            ),
            /* @__PURE__ */ jsxs("div", { className: "mt-4 flex flex-col gap-3 border-t border-zinc-100 pt-3 sm:flex-row sm:items-center sm:justify-between", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    type: "submit",
                    disabled: !filterForm.data.curriculum_unit_id || !filterForm.data.academic_year_id || !filterForm.data.academic_session_id,
                    className: "inline-flex h-10 items-center justify-center rounded-lg bg-emerald-600 px-6 text-sm text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60",
                    children: "Apply"
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
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center", children: [
                selected_unit && /* @__PURE__ */ jsxs("span", { className: "mr-3 text-sm font-semibold text-zinc-800", children: [
                  selected_unit.code,
                  " - ",
                  selected_unit.name
                ] }),
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
                    disabled: !filterForm.data.curriculum_unit_id || !filterForm.data.academic_year_id || !filterForm.data.academic_session_id,
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
