import { jsxs, Fragment, jsx } from "react/jsx-runtime";
import { Head } from "@inertiajs/react";
import { T as Table, a as Thead, b as THdata, c as Tbody, d as Trow, e as Tdata } from "./Tdata-BYbinPOB.js";
import { F as FilterPanel } from "./FilterPanel-B_xT30Ex.js";
import { f as formatDate } from "./date-CQXYOX-2.js";
import "react";
import "ziggy-js";
import "./SearchSelect-CY7NDfHZ.js";
const STATUS_STYLES = {
  active: "bg-emerald-100 text-emerald-700",
  deferred: "bg-amber-100 text-amber-700",
  transferred: "bg-yellow-100 text-yellow-700",
  suspended: "bg-zinc-100 text-zinc-600",
  completed: "bg-blue-100 text-blue-700",
  dropped: "bg-red-100 text-red-600",
  deactivated: "bg-slate-100 text-slate-600"
};
const FILTER_DEFINITIONS = [
  {
    key: "admission_number",
    label: "Admission Number",
    type: "text",
    placeholder: "Search by Reg No..."
  },
  {
    key: "course_id",
    label: "Course",
    type: "search",
    routeName: "courses.hod.search",
    placeholder: "Select course...",
    selectedLabelKey: "course",
    clears: ["curriculum_id"]
  },
  {
    key: "curriculum_id",
    label: "Curriculum",
    type: "search",
    routeName: "curriculums.search",
    placeholder: "Select curriculum...",
    selectedLabelKey: "curriculum",
    dependsOn: "course_id",
    disabledPlaceholder: "Select course first",
    routeParams: (form) => ({ course_id: form.course_id })
  },
  {
    key: "academic_year_id",
    label: "Academic Year",
    type: "search",
    routeName: "academic-years.search",
    placeholder: "Select academic year...",
    selectedLabelKey: "academic_year",
    clears: ["academic_session_id"]
  },
  {
    key: "academic_session_id",
    label: "Academic Session",
    type: "search",
    routeName: "academic-sessions.search",
    placeholder: "Select academic session...",
    selectedLabelKey: "academic_session",
    dependsOn: "academic_year_id",
    disabledPlaceholder: "Select academic year first",
    routeParams: (form) => ({ academic_year_id: form.academic_year_id })
  },
  {
    key: "year_of_study",
    label: "Year of Study",
    type: "select",
    placeholder: "All years",
    options: [
      { value: "1", label: "Year 1" },
      { value: "2", label: "Year 2" },
      { value: "3", label: "Year 3" },
      { value: "4", label: "Year 4" }
    ]
  },
  {
    key: "status",
    label: "Status",
    type: "status",
    placeholder: "All statuses"
  }
];
const labelStatus = (status) => status ? status.charAt(0).toUpperCase() + status.slice(1) : "-";
function HodIndex({
  courseEnrollments,
  filters = {},
  selectedFilters = {},
  statuses = []
}) {
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(Head, { title: "Department Enrollments" }),
    /* @__PURE__ */ jsxs("div", { className: "mx-auto w-full max-w-6xl", children: [
      /* @__PURE__ */ jsx(
        FilterPanel,
        {
          definitions: FILTER_DEFINITIONS,
          filters,
          selectedFilters,
          statuses,
          routeName: "courses.enrollments.hod.index",
          extraParams: { page: 1 },
          quickKeys: [
            "admission_number",
            "course_id",
            "year_of_study",
            "status"
          ]
        }
      ),
      /* @__PURE__ */ jsxs(Table, { pagination: courseEnrollments, children: [
        /* @__PURE__ */ jsxs(Thead, { children: [
          /* @__PURE__ */ jsx(THdata, { children: "Student" }),
          /* @__PURE__ */ jsx(THdata, { children: "Reg No" }),
          /* @__PURE__ */ jsx(THdata, { children: "Department" }),
          /* @__PURE__ */ jsx(THdata, { children: "Course" }),
          /* @__PURE__ */ jsx(THdata, { children: "Year" }),
          /* @__PURE__ */ jsx(THdata, { children: "Session" }),
          /* @__PURE__ */ jsx(THdata, { children: "Status" }),
          /* @__PURE__ */ jsx(THdata, { children: "Admitted" })
        ] }),
        /* @__PURE__ */ jsx(Tbody, { children: courseEnrollments?.data?.length ? courseEnrollments.data.map((item) => /* @__PURE__ */ jsxs(Trow, { children: [
          /* @__PURE__ */ jsx(Tdata, { children: item.student_name || "-" }),
          /* @__PURE__ */ jsx(Tdata, { children: item.admission_number || "-" }),
          /* @__PURE__ */ jsx(Tdata, { children: item.department ?? "-" }),
          /* @__PURE__ */ jsx(Tdata, { children: item.course ?? "-" }),
          /* @__PURE__ */ jsx(Tdata, { children: item.year_of_study ?? "-" }),
          /* @__PURE__ */ jsx(Tdata, { children: item.academic_session ?? "-" }),
          /* @__PURE__ */ jsx(Tdata, { children: /* @__PURE__ */ jsx(
            "span",
            {
              className: `rounded px-2 py-0.5 text-xs ${STATUS_STYLES[item.status] ?? "bg-gray-100 text-gray-600"}`,
              children: labelStatus(item.status)
            }
          ) }),
          /* @__PURE__ */ jsx(Tdata, { children: formatDate(item.created_at) })
        ] }, item.id)) : /* @__PURE__ */ jsx(Trow, { children: /* @__PURE__ */ jsx(Tdata, { colSpan: "8", className: "py-6 text-center", children: "No course enrollments found." }) }) })
      ] })
    ] })
  ] });
}
export {
  HodIndex as default
};
