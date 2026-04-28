import { jsxs, jsx } from "react/jsx-runtime";
import { useState } from "react";
import { Head, Link, router } from "@inertiajs/react";
import { A as AuthenticatedLayout } from "./AuthenticatedLayout-C67J8cqJ.js";
import { D as DirectoryTable, T as Thead, a as THdata, b as TBody, c as Trow, d as Tdata } from "./Tdata-C86zXZO_.js";
import { f as formatDate } from "./date-CQXYOX-2.js";
import { S as SearchSelect } from "./SearchSelect-B2scwN3I.js";
import "lucide-react";
import "react-toastify";
import "ziggy-js";
function CoursesIndex({ courses }) {
  const [sortField, setSortField] = useState(courses.sort || "created_at");
  const [sortDirection, setSortDirection] = useState(
    courses.direction || "desc"
  );
  const [searchTerm, setSearchTerm] = useState("");
  const handleSort = (field) => {
    const direction = sortField === field && sortDirection === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortDirection(direction);
    router.get(
      route("courses.index"),
      { sort: field, direction, page: 1 },
      { preserveState: true, replace: true }
    );
  };
  const renderArrow = (field) => {
    if (sortField !== field) return null;
    return sortDirection === "asc" ? "↑" : "↓";
  };
  const submit = (e) => {
    e.preventDefault();
    router.get(
      route("courses.index"),
      { search: searchTerm, sort: sortField, direction: sortDirection },
      { preserveState: true, replace: true }
    );
    setSearchTerm("");
  };
  const handleDelete = (id) => {
    if (!confirm("Are you sure you want to delete this course?")) return;
    router.delete(route("courses.destroy", encodeURIComponent(id)), {
      preserveState: true,
      replace: true
    });
  };
  return /* @__PURE__ */ jsxs(AuthenticatedLayout, { children: [
    /* @__PURE__ */ jsx(Head, { title: "Courses" }),
    /* @__PURE__ */ jsxs("div", { className: "max-w-6xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-700", children: [
      /* @__PURE__ */ jsx(
        Link,
        {
          className: "mb-4 px-4 py-1 bg-slate-400 text-white rounded hover:bg-slate-700 inline-block",
          href: route("courses.create"),
          children: "Add Course"
        }
      ),
      /* @__PURE__ */ jsxs(
        "form",
        {
          className: "w-full relative flex gap-x-7",
          onSubmit: submit,
          children: [
            /* @__PURE__ */ jsx(
              SearchSelect,
              {
                routeName: "courses.search",
                defaultOptions: courses.data,
                placeholder: "Type in course name ...",
                onChange: (body) => setSearchTerm(body.code)
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                className: "px-4 py-1 bg-emerald-600 text-white rounded hover:bg-slate-700",
                type: "submit",
                children: "Search"
              }
            )
          ]
        }
      ),
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
                  children: [
                    "Certification Level",
                    " ",
                    renderArrow("certification_level_id")
                  ]
                }
              ),
              /* @__PURE__ */ jsxs(THdata, { onClick: () => handleSort("department_id"), children: [
                "Department ",
                renderArrow("department_id")
              ] }),
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
              /* @__PURE__ */ jsx(Tdata, { children: course.department }),
              /* @__PURE__ */ jsx(Tdata, { children: course.name ?? "—" }),
              /* @__PURE__ */ jsx(Tdata, { children: formatDate(course.created_at) }),
              /* @__PURE__ */ jsx(Tdata, { children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center gap-x-10", children: [
                /* @__PURE__ */ jsx(
                  Link,
                  {
                    href: route(
                      "courses.edit",
                      encodeURIComponent(
                        course.id
                      )
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
            ] }, course.id)) : /* @__PURE__ */ jsx(Trow, { children: /* @__PURE__ */ jsx(Tdata, { colSpan: "9", className: "text-center py-4", children: "No courses found." }) }) })
          ]
        }
      )
    ] })
  ] });
}
export {
  CoursesIndex as default
};
