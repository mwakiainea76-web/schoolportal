import { jsxs, Fragment, jsx } from "react/jsx-runtime";
import { useForm, Head, router } from "@inertiajs/react";
import { I as InputLabel } from "./InputLabel-DlDnrkJG.js";
import { I as InputError } from "./InputError-CBvD_6aD.js";
import { S as SearchSelect } from "./SearchSelect-lqQVrrVr.js";
import "react";
import "ziggy-js";
function Publish({
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
  const loadUnits = (mappingId) => {
    router.get(
      route("academic.marks.publish.index"),
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
      route("academic.marks.publish.index"),
      {
        ...filterForm.data,
        search_marks: true,
        page
      },
      { preserveState: true, preserveScroll: true }
    );
  };
  const syncAcademicYear = (academicYear) => {
    router.get(
      route("academic.marks.publish.index"),
      {
        curriculum_mapping_id: filterForm.data.curriculum_mapping_id,
        curriculum_unit_id: filterForm.data.curriculum_unit_id,
        assessment_type: filterForm.data.assessment_type,
        assessment_number: filterForm.data.assessment_number,
        academic_year_id: academicYear.id || "",
        academic_session_id: ""
      },
      { preserveState: true, preserveScroll: true, replace: true }
    );
  };
  const exportMarks = (format) => {
    const params = new URLSearchParams();
    Object.entries({
      ...filterForm.data,
      format,
      context: "publish"
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
  const publishAssessment = (action) => {
    router.post(
      route("academic.marks.publish.assessment"),
      {
        ...filterForm.data,
        action
      },
      { preserveScroll: true }
    );
  };
  const toggleStudentMark = (markId, action) => {
    router.post(
      route("academic.marks.publish.toggle", markId),
      { action },
      { preserveScroll: true }
    );
  };
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(Head, { title: "Publish Marks" }),
    /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-6xl space-y-8", children: [
      /* @__PURE__ */ jsxs("div", { className: "rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm", children: [
        /* @__PURE__ */ jsxs("div", { className: "grid gap-6 md:grid-cols-2 xl:grid-cols-3", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(InputLabel, { value: "Course Mapping", required: true }),
            /* @__PURE__ */ jsxs(
              "select",
              {
                value: filterForm.data.curriculum_mapping_id || "",
                onChange: (e) => {
                  filterForm.setData(
                    "curriculum_mapping_id",
                    e.target.value
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
                  loadUnits(e.target.value);
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
            /* @__PURE__ */ jsx(InputLabel, { value: "Assessment Type" }),
            /* @__PURE__ */ jsxs(
              "select",
              {
                value: filterForm.data.assessment_type,
                onChange: (e) => filterForm.setData(
                  "assessment_type",
                  e.target.value
                ),
                className: "mt-2 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-400",
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
                list: "publish-assessment-number-options",
                value: filterForm.data.assessment_number,
                onChange: (e) => {
                  const value = e.target.value;
                  filterForm.setData(
                    "assessment_number",
                    value === "" ? "" : value.replace(/\D/g, "")
                  );
                },
                placeholder: "All Assessments or type a number",
                className: "mt-2 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-400"
              }
            ),
            /* @__PURE__ */ jsx("datalist", { id: "publish-assessment-number-options", children: (filter_options?.assessment_numbers ?? []).map(
              (assessment) => /* @__PURE__ */ jsx(
                "option",
                {
                  value: assessment.value,
                  children: assessment.label
                },
                assessment.value
              )
            ) })
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
        /* @__PURE__ */ jsxs("div", { className: "mt-6 flex items-center justify-between", children: [
          /* @__PURE__ */ jsx("div", { className: "text-sm text-zinc-500", children: selected_unit ? /* @__PURE__ */ jsxs("span", { className: "font-semibold text-zinc-800", children: [
            selected_unit.code,
            " - ",
            selected_unit.name
          ] }) : "Choose a unit and search to review marks for publishing." }),
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              onClick: () => searchMarks(),
              disabled: !filterForm.data.curriculum_mapping_id || !filterForm.data.curriculum_unit_id,
              className: "rounded-xl bg-emerald-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60",
              children: "Load Assessment"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "mt-4 flex flex-wrap gap-3", children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              onClick: () => exportMarks("csv"),
              disabled: !filterForm.data.curriculum_unit_id,
              className: "rounded-xl border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50",
              children: "Export CSV"
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              onClick: () => exportMarks("excel"),
              disabled: !filterForm.data.curriculum_unit_id,
              className: "rounded-xl border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50",
              children: "Export Excel"
            }
          )
        ] })
      ] }),
      blocker && /* @__PURE__ */ jsx("div", { className: "rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-800", children: blocker }),
      marks.length > 0 && /* @__PURE__ */ jsxs("div", { className: "rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h2", { className: "text-xl font-semibold text-zinc-900", children: "Publish Assessment" }),
            /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-zinc-500", children: "Review the filtered results first, then publish or unpublish the loaded marks in bulk or one by one." })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex gap-3", children: [
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                onClick: () => publishAssessment("publish"),
                disabled: !selected_unit || !marks.length,
                className: "rounded-xl bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60",
                children: "Publish Assessment"
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                onClick: () => publishAssessment("unpublish"),
                disabled: !selected_unit || !marks.length,
                className: "rounded-xl border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-60",
                children: "Unpublish Assessment"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "mt-6 overflow-hidden rounded-2xl border border-zinc-100", children: /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs("table", { className: "w-full min-w-[56rem] border-collapse", children: [
          /* @__PURE__ */ jsx("thead", { className: "bg-zinc-50", children: /* @__PURE__ */ jsxs("tr", { className: "text-xs font-semibold uppercase tracking-wide text-zinc-500", children: [
            /* @__PURE__ */ jsx("th", { className: "px-4 py-3 text-left", children: "Reg. No." }),
            /* @__PURE__ */ jsx("th", { className: "px-4 py-3 text-left", children: "Student" }),
            /* @__PURE__ */ jsx("th", { className: "px-4 py-3 text-left", children: "Unit" }),
            /* @__PURE__ */ jsx("th", { className: "px-4 py-3 text-left", children: "Session" }),
            /* @__PURE__ */ jsx("th", { className: "px-4 py-3 text-left", children: "Type" }),
            /* @__PURE__ */ jsx("th", { className: "px-4 py-3 text-left", children: "Assessment" }),
            /* @__PURE__ */ jsx("th", { className: "px-4 py-3 text-left", children: "Marks" }),
            /* @__PURE__ */ jsx("th", { className: "px-4 py-3 text-left", children: "Status" }),
            /* @__PURE__ */ jsx("th", { className: "px-4 py-3 text-right", children: "Action" })
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
                ) }),
                /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-right", children: /* @__PURE__ */ jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => toggleStudentMark(
                      mark.id,
                      mark.is_published ? "unpublish" : "publish"
                    ),
                    className: "rounded-lg border border-zinc-200 px-3 py-1.5 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50",
                    children: mark.is_published ? "Unpublish" : "Publish"
                  }
                ) })
              ]
            },
            mark.id
          )) : /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx(
            "td",
            {
              colSpan: "9",
              className: "px-4 py-8 text-center text-sm text-zinc-500",
              children: submitted_marks ? "No submitted marks found for the selected filters." : "Run a search to review marks for publishing."
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
  Publish as default
};
