import { jsxs, Fragment, jsx } from "react/jsx-runtime";
import { useForm, Head, router } from "@inertiajs/react";
import { I as InputError } from "./InputError-CBvD_6aD.js";
import { I as InputLabel } from "./InputLabel-DlDnrkJG.js";
import { S as SearchSelect } from "./SearchSelect-lqQVrrVr.js";
import { f as formatDate } from "./date-CQXYOX-2.js";
import "react";
import "ziggy-js";
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
    curriculum_mapping_id: filters.curriculum_mapping_id || "",
    curriculum_unit_id: filters.curriculum_unit_id || "",
    academic_year_id: filters.academic_year_id || "",
    academic_session_id: filters.academic_session_id || ""
  });
  const loadUnits = (mappingId) => {
    router.get(
      route("academic.marks.marksheet.index"),
      {
        curriculum_mapping_id: mappingId
      },
      {
        preserveState: true,
        preserveScroll: true,
        replace: true
      }
    );
  };
  const syncAcademicYear = (academicYear) => {
    router.get(
      route("academic.marks.marksheet.index"),
      {
        curriculum_mapping_id: filterForm.data.curriculum_mapping_id,
        curriculum_unit_id: filterForm.data.curriculum_unit_id,
        academic_year_id: academicYear.id || "",
        academic_session_id: ""
      },
      {
        preserveState: true,
        preserveScroll: true,
        replace: true
      }
    );
  };
  const loadMarksheet = (event) => {
    event.preventDefault();
    router.get(route("academic.marks.marksheet.index"), filterForm.data, {
      preserveState: true,
      preserveScroll: true
    });
  };
  const downloadMarksheet = (format) => {
    const params = new URLSearchParams();
    Object.entries({
      ...filterForm.data,
      format
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
          className: "space-y-6 rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm",
          children: [
            /* @__PURE__ */ jsxs("div", { className: "grid gap-6 md:grid-cols-2 xl:grid-cols-4", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx(InputLabel, { value: "Course Mapping", required: true }),
                /* @__PURE__ */ jsxs(
                  "select",
                  {
                    value: filterForm.data.curriculum_mapping_id,
                    onChange: (event) => {
                      filterForm.setData(
                        "curriculum_mapping_id",
                        event.target.value
                      );
                      filterForm.setData(
                        "curriculum_unit_id",
                        ""
                      );
                      filterForm.setData("academic_year_id", "");
                      filterForm.setData(
                        "academic_session_id",
                        ""
                      );
                      loadUnits(event.target.value);
                    },
                    className: "mt-2 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-400",
                    children: [
                      /* @__PURE__ */ jsx("option", { value: "", children: "Select course mapping" }),
                      course_mappings.map((mapping) => /* @__PURE__ */ jsx("option", { value: mapping.id, children: mapping.name }, mapping.id))
                    ]
                  }
                ),
                /* @__PURE__ */ jsx(
                  InputError,
                  {
                    message: filterForm.errors.curriculum_mapping_id,
                    className: "mt-2"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx(InputLabel, { value: "Unit", required: true }),
                /* @__PURE__ */ jsx("div", { className: "mt-2", children: /* @__PURE__ */ jsx(
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
                    onChange: (unit) => filterForm.setData(
                      "curriculum_unit_id",
                      unit.id || ""
                    ),
                    error: filterForm.errors.curriculum_unit_id,
                    disabled: !filterForm.data.curriculum_mapping_id
                  }
                ) }),
                /* @__PURE__ */ jsx(
                  InputError,
                  {
                    message: filterForm.errors.curriculum_unit_id,
                    className: "mt-2"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx(InputLabel, { value: "Academic Year" }),
                /* @__PURE__ */ jsx("div", { className: "mt-2", children: /* @__PURE__ */ jsx(
                  SearchSelect,
                  {
                    routeName: "academic.years.search",
                    value: filterForm.data.academic_year_id,
                    selectedLabel: selected_filters?.academic_year?.name,
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
                        academicYear.id || ""
                      );
                      filterForm.setData(
                        "academic_session_id",
                        ""
                      );
                      syncAcademicYear(academicYear);
                    }
                  }
                ) })
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx(InputLabel, { value: "Session" }),
                /* @__PURE__ */ jsx("div", { className: "mt-2", children: /* @__PURE__ */ jsx(
                  SearchSelect,
                  {
                    routeName: "academic.sessions.search",
                    routeParams: {
                      academic_year_id: filterForm.data.academic_year_id
                    },
                    value: filterForm.data.academic_session_id,
                    selectedLabel: selected_filters?.academic_session?.name,
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
                      session.id || ""
                    ),
                    disabled: !filterForm.data.academic_year_id
                  }
                ) })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex gap-4", children: [
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "submit",
                  disabled: !filterForm.data.curriculum_unit_id,
                  className: "rounded-xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50",
                  children: "Load Marksheet"
                }
              ),
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  onClick: () => downloadMarksheet("csv"),
                  disabled: !filterForm.data.curriculum_unit_id,
                  className: "rounded-xl border border-zinc-200 bg-white px-6 py-3 text-sm font-semibold text-zinc-900 transition hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50",
                  children: "Download CSV"
                }
              ),
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  onClick: () => downloadMarksheet("excel"),
                  disabled: !filterForm.data.curriculum_unit_id,
                  className: "rounded-xl border border-zinc-200 bg-white px-6 py-3 text-sm font-semibold text-zinc-900 transition hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50",
                  children: "Download Excel"
                }
              )
            ] })
          ]
        }
      ),
      blocker ? /* @__PURE__ */ jsx("div", { className: "rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-800", children: blocker }) : null,
      selected_unit && !blocker ? /* @__PURE__ */ jsx("div", { className: "overflow-hidden rounded-3xl border border-zinc-300 bg-white p-6 shadow-sm", children: /* @__PURE__ */ jsxs("div", { className: "space-y-4 text-[13px] text-zinc-900", children: [
        /* @__PURE__ */ jsx("div", { className: "text-sm font-semibold", children: meta.session_name || "" }),
        /* @__PURE__ */ jsx("div", { className: "text-center text-base font-bold uppercase tracking-wide text-blue-800 underline", children: "Formative Assessment (FA) Marksheet Per Unit of Competency" }),
        /* @__PURE__ */ jsxs("div", { className: "grid gap-x-10 gap-y-2 md:grid-cols-3", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("span", { className: "font-semibold", children: "Assessment Center Code:" }),
            " ",
            meta.assessment_center_code || ""
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("span", { className: "font-semibold", children: "Assessment Center Name:" }),
            " ",
            meta.assessment_center_name || ""
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("span", { className: "font-semibold", children: "Term Dates:" }),
            " ",
            "From",
            " ",
            meta.term_from ? formatDate(meta.term_from) : "",
            " ",
            "to",
            " ",
            meta.term_to ? formatDate(meta.term_to) : ""
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("span", { className: "font-semibold", children: "Course Code:" }),
            " ",
            meta.course_code || ""
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("span", { className: "font-semibold", children: "Course Title:" }),
            " ",
            meta.course_title || ""
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("span", { className: "font-semibold", children: "Unit Code:" }),
            " ",
            meta.unit_code || ""
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "md:col-span-3", children: [
            /* @__PURE__ */ jsx("span", { className: "font-semibold", children: "Unit Title:" }),
            " ",
            meta.unit_title || ""
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs("table", { className: "w-full  border-collapse border border-zinc-500 text-[12px]", children: [
          /* @__PURE__ */ jsxs("thead", { children: [
            /* @__PURE__ */ jsxs("tr", { className: "bg-white", children: [
              /* @__PURE__ */ jsx(
                "th",
                {
                  rowSpan: "2",
                  className: "border border-zinc-500 bg-zinc-50  text-left",
                  children: "S/N"
                }
              ),
              /* @__PURE__ */ jsx(
                "th",
                {
                  rowSpan: "2",
                  className: "border border-zinc-500 bg-zinc-50  text-left",
                  children: "Candidate's Reg Code"
                }
              ),
              /* @__PURE__ */ jsx(
                "th",
                {
                  rowSpan: "2",
                  className: "border border-zinc-500 bg-zinc-50  text-left",
                  children: "Candidate's Name"
                }
              ),
              /* @__PURE__ */ jsx(
                "th",
                {
                  colSpan: "4",
                  className: "border border-zinc-500 bg-zinc-200  text-center",
                  children: "Continuous Theory (CT) Marks (100%)"
                }
              ),
              /* @__PURE__ */ jsx(
                "th",
                {
                  colSpan: "4",
                  className: "border border-zinc-500 bg-orange-100  text-center",
                  children: "Continuous Practical (CP) Marks (100%)"
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("tr", { className: "bg-white", children: [
              /* @__PURE__ */ jsx("th", { className: "border border-zinc-500 bg-zinc-100  text-center", children: "FA 1" }),
              /* @__PURE__ */ jsx("th", { className: "border border-zinc-500 bg-zinc-100  text-center", children: "FA 2" }),
              /* @__PURE__ */ jsx("th", { className: "border border-zinc-500 bg-zinc-100  text-center", children: "FA 3" }),
              /* @__PURE__ */ jsx("th", { className: "border border-zinc-500 bg-zinc-200  text-center", children: "Average" }),
              /* @__PURE__ */ jsx("th", { className: "border border-zinc-500 bg-orange-50  text-center", children: "Pract 1" }),
              /* @__PURE__ */ jsx("th", { className: "border border-zinc-500 bg-orange-50  text-center", children: "Pract 2" }),
              /* @__PURE__ */ jsx("th", { className: "border border-zinc-500 bg-orange-50  text-center", children: "Pract 3" }),
              /* @__PURE__ */ jsx("th", { className: "border border-zinc-500 bg-orange-100  text-center", children: "Average" })
            ] })
          ] }),
          /* @__PURE__ */ jsx("tbody", { children: rows.map((row, index) => /* @__PURE__ */ jsxs(
            "tr",
            {
              children: [
                /* @__PURE__ */ jsx("td", { className: "border border-zinc-500  text-center", children: `${index + 1}.` }),
                /* @__PURE__ */ jsx("td", { className: "border border-zinc-500 ", children: row.admission_number || "" }),
                /* @__PURE__ */ jsx("td", { className: "border border-zinc-500 ", children: row.student_name || "" }),
                /* @__PURE__ */ jsx("td", { className: "border border-zinc-500  text-center", children: row.theory?.[1] || "" }),
                /* @__PURE__ */ jsx("td", { className: "border border-zinc-500  text-center", children: row.theory?.[2] || "" }),
                /* @__PURE__ */ jsx("td", { className: "border border-zinc-500  text-center", children: row.theory?.[3] || "" }),
                /* @__PURE__ */ jsx("td", { className: "border border-zinc-500 bg-zinc-100  text-center font-semibold text-rose-700", children: row.theory_average || "" }),
                /* @__PURE__ */ jsx("td", { className: "border border-zinc-500  text-center", children: row.practical?.[1] || "" }),
                /* @__PURE__ */ jsx("td", { className: "border border-zinc-500  text-center", children: row.practical?.[2] || "" }),
                /* @__PURE__ */ jsx("td", { className: "border border-zinc-500  text-center", children: row.practical?.[3] || "" }),
                /* @__PURE__ */ jsx("td", { className: "border border-zinc-500 bg-orange-50  text-center font-semibold text-rose-700", children: row.practical_average || "" })
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
