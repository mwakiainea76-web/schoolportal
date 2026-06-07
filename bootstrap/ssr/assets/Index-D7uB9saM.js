import { jsxs, Fragment, jsx } from "react/jsx-runtime";
import { useState } from "react";
import { Head, router } from "@inertiajs/react";
import { D as DirectoryTable, T as Thead, a as THdata, b as TBody, c as Trow, d as Tdata } from "./Tdata-ezyKIspX.js";
import { f as formatDate } from "./date-CQXYOX-2.js";
import { I as InputLabel } from "./InputLabel-DlDnrkJG.js";
import { S as SearchSelect } from "./SearchSelect-BoobybnU.js";
import "ziggy-js";
const STATUS_STYLES = {
  active: "bg-emerald-100 text-emerald-700",
  deferred: "bg-amber-100 text-amber-700",
  transferred: "bg-yellow-100 text-yellow-700",
  suspended: "bg-zinc-100 text-zinc-600",
  completed: "bg-blue-100 text-blue-700",
  dropped: "bg-red-100 text-red-600",
  deactivated: "bg-slate-100 text-slate-600"
};
const labelStatus = (status) => status ? status.charAt(0).toUpperCase() + status.slice(1) : "-";
function Index({
  courseEnrollments,
  filters = {},
  selectedFilters = {},
  statuses = []
}) {
  const pageFilters = filters && !Array.isArray(filters) && typeof filters === "object" ? filters : {};
  const [form, setForm] = useState({
    course_id: pageFilters.course_id || "",
    curriculum_id: pageFilters.curriculum_id || "",
    academic_year_id: pageFilters.academic_year_id || "",
    academic_session_id: pageFilters.academic_session_id || "",
    status: pageFilters.status || ""
  });
  const setFilter = (key, value) => {
    setForm((current) => ({
      ...current,
      [key]: value
    }));
  };
  const submit = (e) => {
    e.preventDefault();
    router.get(
      route("courses.enrollments.index"),
      { ...form, page: 1 },
      { preserveState: true, replace: true }
    );
  };
  const clearFilters = () => {
    const emptyFilters = {
      course_id: "",
      curriculum_id: "",
      academic_year_id: "",
      academic_session_id: "",
      status: ""
    };
    setForm(emptyFilters);
    router.get(
      route("courses.enrollments.index"),
      { page: 1 },
      { preserveState: true, replace: true }
    );
  };
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(Head, { title: "Course Enrollments" }),
    /* @__PURE__ */ jsxs("div", { className: "max-w-6xl mx-auto w-full", children: [
      /* @__PURE__ */ jsxs(
        "form",
        {
          className: "mb-4 rounded-lg border border-zinc-100 bg-white p-4 shadow-sm",
          onSubmit: submit,
          children: [
            /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 gap-4 md:grid-cols-3", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx(InputLabel, { value: "Course Name" }),
                /* @__PURE__ */ jsx(
                  SearchSelect,
                  {
                    routeName: "courses.search",
                    defaultOptions: [],
                    value: form.course_id,
                    selectedLabel: selectedFilters.course,
                    placeholder: "Select course...",
                    preloadOptions: true,
                    onChange: (course) => setFilter("course_id", course.id)
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx(InputLabel, { value: "Curriculum Name" }),
                /* @__PURE__ */ jsx(
                  SearchSelect,
                  {
                    routeName: "curriculums.search",
                    defaultOptions: [],
                    value: form.curriculum_id,
                    selectedLabel: selectedFilters.curriculum,
                    placeholder: "Select curriculum...",
                    preloadOptions: true,
                    onChange: (curriculum) => setFilter("curriculum_id", curriculum.id)
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx(InputLabel, { value: "Academic Year" }),
                /* @__PURE__ */ jsx(
                  SearchSelect,
                  {
                    routeName: "academic-years.search",
                    defaultOptions: [],
                    value: form.academic_year_id,
                    selectedLabel: selectedFilters.academic_year,
                    placeholder: "Select academic year...",
                    preloadOptions: true,
                    onChange: (academicYear) => {
                      setForm((current) => ({
                        ...current,
                        academic_year_id: academicYear.id,
                        academic_session_id: ""
                      }));
                    }
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx(InputLabel, { value: "Academic Session" }),
                /* @__PURE__ */ jsx(
                  SearchSelect,
                  {
                    routeName: "academic-sessions.search",
                    routeParams: {
                      academic_year_id: form.academic_year_id
                    },
                    defaultOptions: [],
                    value: form.academic_session_id,
                    selectedLabel: selectedFilters.academic_session,
                    placeholder: "Select academic session...",
                    preloadOptions: true,
                    onChange: (academicSession) => setFilter(
                      "academic_session_id",
                      academicSession.id
                    )
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx(InputLabel, { value: "Status" }),
                /* @__PURE__ */ jsxs(
                  "select",
                  {
                    value: form.status,
                    onChange: (e) => setFilter("status", e.target.value),
                    className: "w-full rounded-xl border border-zinc-200 bg-zinc-50 px-5 py-2.5 text-sm outline-none transition focus:border-emerald-400 focus:ring-emerald-200",
                    children: [
                      /* @__PURE__ */ jsx("option", { value: "", children: "All statuses" }),
                      statuses.map((status) => /* @__PURE__ */ jsx("option", { value: status, children: labelStatus(status) }, status))
                    ]
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "mt-4 flex justify-end gap-3", children: [
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  onClick: clearFilters,
                  className: "rounded bg-zinc-400 px-4 py-2 text-sm text-white hover:bg-zinc-600",
                  children: "Clear"
                }
              ),
              /* @__PURE__ */ jsx(
                "button",
                {
                  className: "rounded bg-emerald-600 px-4 py-2 text-sm text-white hover:bg-slate-700",
                  type: "submit",
                  children: "Search"
                }
              )
            ] })
          ]
        }
      ),
      /* @__PURE__ */ jsxs(DirectoryTable, { pagination: courseEnrollments, children: [
        /* @__PURE__ */ jsxs(Thead, { children: [
          /* @__PURE__ */ jsx(THdata, { children: "Student" }),
          /* @__PURE__ */ jsx(THdata, { children: "Reg No" }),
          /* @__PURE__ */ jsx(THdata, { children: "Course" }),
          /* @__PURE__ */ jsx(THdata, { children: "Curriculum" }),
          /* @__PURE__ */ jsx(THdata, { children: "Academic Year" }),
          /* @__PURE__ */ jsx(THdata, { children: "Academic Session" }),
          /* @__PURE__ */ jsx(THdata, { children: "Status" }),
          /* @__PURE__ */ jsx(THdata, { children: "Admitted" })
        ] }),
        /* @__PURE__ */ jsx(TBody, { children: courseEnrollments?.data?.length ? courseEnrollments.data.map((item) => /* @__PURE__ */ jsxs(Trow, { children: [
          /* @__PURE__ */ jsx(Tdata, { children: item.student_name || "-" }),
          /* @__PURE__ */ jsx(Tdata, { children: item.admission_number || "-" }),
          /* @__PURE__ */ jsx(Tdata, { children: item.course ?? "-" }),
          /* @__PURE__ */ jsx(Tdata, { children: item.curriculum ?? "-" }),
          /* @__PURE__ */ jsx(Tdata, { children: item.academic_year ?? "-" }),
          /* @__PURE__ */ jsx(Tdata, { children: item.academic_session ?? "-" }),
          /* @__PURE__ */ jsx(Tdata, { children: /* @__PURE__ */ jsx(
            "span",
            {
              className: `rounded px-2 py-0.5 text-xs ${STATUS_STYLES[item.status] ?? "bg-gray-100 text-gray-600"}`,
              children: labelStatus(item.status)
            }
          ) }),
          /* @__PURE__ */ jsx(Tdata, { children: formatDate(item.created_at) })
        ] }, item.id)) : /* @__PURE__ */ jsx(Trow, { children: /* @__PURE__ */ jsx(Tdata, { colSpan: "8", className: "text-center py-6", children: "No course enrollments found." }) }) })
      ] })
    ] })
  ] });
}
export {
  Index as default
};
