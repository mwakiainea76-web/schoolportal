import { jsxs, jsx } from "react/jsx-runtime";
import { Head, Link, router } from "@inertiajs/react";
import { useState } from "react";
import { A as AuthenticatedLayout } from "../app.js";
import { D as DirectoryTable, T as Thead, a as THdata, b as TBody, c as Trow, d as Tdata } from "./Tdata-ezyKIspX.js";
import { f as formatDate } from "./date-CQXYOX-2.js";
import { S as SearchSelect } from "./SearchSelect-BoobybnU.js";
import { I as InputLabel } from "./InputLabel-DlDnrkJG.js";
import CourseWorkspaceTabs from "./CourseWorkspaceTabs-D8YFDE67.js";
import "axios";
import "lucide-react";
import "react-toastify";
import "react-dom/client";
import "ziggy-js";
function coursesIndex({
  courses,
  filters = {},
  selectedFilters = {}
}) {
  const pageFilters = filters && !Array.isArray(filters) && typeof filters === "object" ? filters : {};
  const [sortField, setSortField] = useState(
    pageFilters.sort || "created_at"
  );
  const [sortDirection, setSortDirection] = useState(
    pageFilters.direction || "desc"
  );
  const [form, setForm] = useState({
    course_id: pageFilters.course_id || "",
    department_id: pageFilters.department_id || "",
    exam_body_id: pageFilters.exam_body_id || "",
    certification_level_id: pageFilters.certification_level_id || "",
    curriculum_id: pageFilters.curriculum_id || ""
  });
  const setFilter = (key, value) => {
    setForm((current) => ({
      ...current,
      [key]: value
    }));
  };
  const currentFilters = () => ({
    course_id: form.course_id,
    department_id: form.department_id,
    exam_body_id: form.exam_body_id,
    certification_level_id: form.certification_level_id,
    curriculum_id: form.curriculum_id
  });
  const handleSort = (field) => {
    const direction = sortField === field && sortDirection === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortDirection(direction);
    router.get(
      route("courses.index"),
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
      route("courses.index"),
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
    setForm({
      course_id: "",
      department_id: "",
      exam_body_id: "",
      certification_level_id: "",
      curriculum_id: ""
    });
    router.get(
      route("courses.index"),
      { sort: sortField, direction: sortDirection, page: 1 },
      { preserveState: true, replace: true }
    );
  };
  const handleDelete = (id) => {
    if (!confirm("Are you sure you want to delete this course?")) {
      return;
    }
    router.delete(route("courses.destroy", encodeURIComponent(id)), {
      preserveState: true,
      replace: true
    });
  };
  return /* @__PURE__ */ jsxs(AuthenticatedLayout, { children: [
    /* @__PURE__ */ jsx(Head, { title: "Courses" }),
    /* @__PURE__ */ jsxs("div", { className: "max-w-6xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-700", children: [
      /* @__PURE__ */ jsx("div", { className: "mb-6", children: /* @__PURE__ */ jsx(CourseWorkspaceTabs, { activeTab: "courses" }) }),
      /* @__PURE__ */ jsxs("form", { className: "mb-4 rounded-lg border border-zinc-100 bg-white p-4 shadow-sm", onSubmit: submit, children: [
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(InputLabel, { value: "Course Name" }),
            /* @__PURE__ */ jsx(
              SearchSelect,
              {
                routeName: "courses.search",
                defaultOptions: [],
                value: form.course_id,
                selectedLabel: selectedFilters.course,
                placeholder: "Select active course...",
                preloadOptions: true,
                onChange: (course) => setFilter("course_id", course.id)
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(InputLabel, { value: "Curriculum" }),
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
            /* @__PURE__ */ jsx(InputLabel, { value: "Department" }),
            /* @__PURE__ */ jsx(
              SearchSelect,
              {
                routeName: "departments.search",
                defaultOptions: [],
                value: form.department_id,
                selectedLabel: selectedFilters.department,
                placeholder: "Type to search department...",
                preloadOptions: true,
                onChange: (department) => setFilter("department_id", department.id)
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(InputLabel, { value: "Exam Body" }),
            /* @__PURE__ */ jsx(
              SearchSelect,
              {
                routeName: "exam-bodies.search",
                defaultOptions: [],
                value: form.exam_body_id,
                selectedLabel: selectedFilters.exam_body,
                placeholder: "Type to search exam body...",
                preloadOptions: true,
                onChange: (examBody) => setFilter("exam_body_id", examBody.id)
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(InputLabel, { value: "Certification Level" }),
            /* @__PURE__ */ jsx(
              SearchSelect,
              {
                routeName: "certification-levels.search",
                defaultOptions: [],
                value: form.certification_level_id,
                selectedLabel: selectedFilters.certification_level,
                placeholder: "Type to search level...",
                preloadOptions: true,
                onChange: (level) => setFilter(
                  "certification_level_id",
                  level.id
                )
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
      ] }),
      /* @__PURE__ */ jsxs(
        DirectoryTable,
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
              /* @__PURE__ */ jsxs(
                THdata,
                {
                  onClick: () => handleSort("department_id"),
                  className: "cursor-pointer",
                  children: [
                    "Department ",
                    renderArrow("department_id")
                  ]
                }
              ),
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
              ),
              /* @__PURE__ */ jsx(THdata, { children: "Actions" })
            ] }),
            /* @__PURE__ */ jsx(TBody, { children: courses?.data?.length ? courses.data.map((course) => /* @__PURE__ */ jsxs(Trow, { children: [
              /* @__PURE__ */ jsx(Tdata, { children: course.id }),
              /* @__PURE__ */ jsx(Tdata, { children: course.code }),
              /* @__PURE__ */ jsx(Tdata, { children: course.name }),
              /* @__PURE__ */ jsx(Tdata, { children: course.certification_level ?? "-" }),
              /* @__PURE__ */ jsx(Tdata, { children: course.department ?? "-" }),
              /* @__PURE__ */ jsx(Tdata, { children: course.curriculum ?? "-" }),
              /* @__PURE__ */ jsx(Tdata, { children: formatDate(course.created_at) }),
              /* @__PURE__ */ jsx(Tdata, { children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center gap-x-10", children: [
                /* @__PURE__ */ jsx(
                  Link,
                  {
                    href: route(
                      "courses.edit",
                      encodeURIComponent(course.id)
                    ),
                    className: "text-emerald-600 hover:underline",
                    children: "Edit"
                  }
                ),
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    onClick: () => handleDelete(course.id),
                    className: "text-red-600 hover:underline",
                    children: "Delete"
                  }
                )
              ] }) })
            ] }, course.id)) : /* @__PURE__ */ jsx(Trow, { children: /* @__PURE__ */ jsx(Tdata, { colSpan: "8", className: "py-4 text-center", children: "No courses found." }) }) })
          ]
        }
      )
    ] })
  ] });
}
export {
  coursesIndex as default
};
