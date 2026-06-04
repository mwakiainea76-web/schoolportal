import { jsxs, jsx } from "react/jsx-runtime";
import { Head, Link, router } from "@inertiajs/react";
import { useState } from "react";
import { A as AuthenticatedLayout } from "../app.js";
import { D as DirectoryTable, T as Thead, a as THdata, b as TBody, c as Trow, d as Tdata } from "./Tdata--sq9P0k3.js";
import { f as formatDate } from "./date-CQXYOX-2.js";
import { S as SearchSelect } from "./SearchSelect-iSHxFhW9.js";
import { I as InputLabel } from "./InputLabel-DlDnrkJG.js";
import "axios";
import "lucide-react";
import "react-toastify";
import "react-dom/client";
import "ziggy-js";
function ProgramsIndex({
  programs,
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
    program_id: pageFilters.program_id || "",
    department_id: pageFilters.department_id || "",
    exam_body_id: pageFilters.exam_body_id || "",
    certification_level_id: pageFilters.certification_level_id || "",
    program_version_id: pageFilters.program_version_id || ""
  });
  const setFilter = (key, value) => {
    setForm((current) => ({
      ...current,
      [key]: value
    }));
  };
  const currentFilters = () => ({
    program_id: form.program_id,
    department_id: form.department_id,
    exam_body_id: form.exam_body_id,
    certification_level_id: form.certification_level_id,
    program_version_id: form.program_version_id
  });
  const setProgramVersionFilter = (version) => {
    setForm((current) => ({
      ...current,
      program_version_id: version.id,
      program_id: ""
    }));
  };
  const setExamBodyFilter = (examBody) => {
    setForm((current) => ({
      ...current,
      exam_body_id: examBody.id,
      certification_level_id: ""
    }));
  };
  const handleSort = (field) => {
    const direction = sortField === field && sortDirection === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortDirection(direction);
    router.get(
      route("programs.index"),
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
      route("programs.index"),
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
      program_id: "",
      department_id: "",
      exam_body_id: "",
      certification_level_id: "",
      program_version_id: ""
    });
    router.get(
      route("programs.index"),
      { sort: sortField, direction: sortDirection, page: 1 },
      { preserveState: true, replace: true }
    );
  };
  const handleDelete = (id) => {
    if (!confirm("Are you sure you want to delete this course?")) {
      return;
    }
    router.delete(route("programs.destroy", encodeURIComponent(id)), {
      preserveState: true,
      replace: true
    });
  };
  return /* @__PURE__ */ jsxs(AuthenticatedLayout, { children: [
    /* @__PURE__ */ jsx(Head, { title: "Courses" }),
    /* @__PURE__ */ jsxs("div", { className: "max-w-6xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-700", children: [
      /* @__PURE__ */ jsxs("form", { className: "mb-4 rounded-lg border border-zinc-100 bg-white p-4 shadow-sm", onSubmit: submit, children: [
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(InputLabel, { value: "Course Name" }),
            /* @__PURE__ */ jsx(
              SearchSelect,
              {
                routeName: "programs.search",
                routeParams: {
                  program_version_id: form.program_version_id
                },
                defaultOptions: [],
                value: form.program_id,
                selectedLabel: selectedFilters.program,
                placeholder: "Select active course...",
                disabled: !form.program_version_id,
                preloadOptions: true,
                onChange: (program) => setFilter("program_id", program.id)
              }
            ),
            !form.program_version_id ? /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs text-amber-600", children: "Select a course version first." }) : null
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(InputLabel, { value: "Course Version" }),
            /* @__PURE__ */ jsx(
              SearchSelect,
              {
                routeName: "program-versions.search",
                defaultOptions: [],
                value: form.program_version_id,
                selectedLabel: selectedFilters.program_version,
                placeholder: "Select version...",
                preloadOptions: true,
                onChange: setProgramVersionFilter
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
                onChange: setExamBodyFilter
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(InputLabel, { value: "Certification Level" }),
            /* @__PURE__ */ jsx(
              SearchSelect,
              {
                routeName: "certification-levels.search",
                routeParams: {
                  exam_body_id: form.exam_body_id
                },
                defaultOptions: [],
                value: form.certification_level_id,
                selectedLabel: selectedFilters.certification_level,
                placeholder: "Type to search level...",
                disabled: !form.exam_body_id,
                preloadOptions: true,
                onChange: (level) => setFilter(
                  "certification_level_id",
                  level.id
                )
              }
            ),
            !form.exam_body_id ? /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs text-amber-600", children: "Select an exam body first." }) : null
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
          pagination: programs,
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
              /* @__PURE__ */ jsx(THdata, { children: "Current Course Version" }),
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
            /* @__PURE__ */ jsx(TBody, { children: programs?.data?.length ? programs.data.map((program) => /* @__PURE__ */ jsxs(Trow, { children: [
              /* @__PURE__ */ jsx(Tdata, { children: program.id }),
              /* @__PURE__ */ jsx(Tdata, { children: program.code }),
              /* @__PURE__ */ jsx(Tdata, { children: program.name }),
              /* @__PURE__ */ jsx(Tdata, { children: program.certification_level ?? "-" }),
              /* @__PURE__ */ jsx(Tdata, { children: program.department ?? "-" }),
              /* @__PURE__ */ jsx(Tdata, { children: program.curriculum ?? "-" }),
              /* @__PURE__ */ jsx(Tdata, { children: formatDate(program.created_at) }),
              /* @__PURE__ */ jsx(Tdata, { children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center gap-x-10", children: [
                /* @__PURE__ */ jsx(
                  Link,
                  {
                    href: route(
                      "programs.edit",
                      encodeURIComponent(program.id)
                    ),
                    className: "text-emerald-600 hover:underline",
                    children: "Edit"
                  }
                ),
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    onClick: () => handleDelete(program.id),
                    className: "text-red-600 hover:underline",
                    children: "Delete"
                  }
                )
              ] }) })
            ] }, program.id)) : /* @__PURE__ */ jsx(Trow, { children: /* @__PURE__ */ jsx(Tdata, { colSpan: "8", className: "py-4 text-center", children: "No courses found." }) }) })
          ]
        }
      )
    ] })
  ] });
}
export {
  ProgramsIndex as default
};
