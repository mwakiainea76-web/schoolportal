import { jsxs, jsx } from "react/jsx-runtime";
import { Head, Link, router } from "@inertiajs/react";
import { useState } from "react";
import { A as AuthenticatedLayout } from "../app.js";
import { D as DirectoryTable, T as Thead, a as THdata, b as TBody, c as Trow, d as Tdata } from "./Tdata--sq9P0k3.js";
import { f as formatDate } from "./date-CQXYOX-2.js";
import { S as SearchSelect } from "./SearchSelect-DFX8pDhT.js";
import "axios";
import "lucide-react";
import "react-toastify";
import "react-dom/client";
import "ziggy-js";
function CourseVersionMappingsIndex({
  courseVersionMappings
}) {
  const [sortField, setSortField] = useState(
    courseVersionMappings.sort || "created_at"
  );
  const [sortDirection, setSortDirection] = useState(
    courseVersionMappings.direction || "desc"
  );
  const [searchTerm, setSearchTerm] = useState("");
  const handleSort = (field) => {
    const direction = sortField === field && sortDirection === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortDirection(direction);
    router.get(
      route("courses.course-version-mappings.index"),
      { sort: field, direction, page: 1 },
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
      route("courses.course-version-mappings.index"),
      { search: searchTerm, sort: sortField, direction: sortDirection },
      { preserveState: true, replace: true }
    );
    setSearchTerm("");
  };
  const handleDelete = (id) => {
    if (!confirm("Are you sure you want to delete this mapping?")) {
      return;
    }
    router.delete(
      route(
        "courses.course-version-mappings.destroy",
        encodeURIComponent(id)
      ),
      {
        preserveState: true,
        replace: true
      }
    );
  };
  return /* @__PURE__ */ jsxs(AuthenticatedLayout, { children: [
    /* @__PURE__ */ jsx(Head, { title: "Course Version Mapping" }),
    /* @__PURE__ */ jsxs("div", { className: "max-w-6xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-700", children: [
      /* @__PURE__ */ jsxs(
        "form",
        {
          className: "relative flex w-full gap-x-7",
          onSubmit: submit,
          children: [
            /* @__PURE__ */ jsx(
              SearchSelect,
              {
                routeName: "course-versions.search",
                defaultOptions: [],
                placeholder: "Select course version ...",
                preloadOptions: true,
                onChange: (body) => setSearchTerm(body.name ?? "")
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                className: "rounded bg-emerald-600 px-4 py-1 text-white hover:bg-slate-700",
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
          pagination: courseVersionMappings,
          sortField,
          sortDirection,
          children: [
            /* @__PURE__ */ jsxs(Thead, { children: [
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
              /* @__PURE__ */ jsx(THdata, { children: "Course" }),
              /* @__PURE__ */ jsx(THdata, { children: "Exam Body" }),
              /* @__PURE__ */ jsxs(
                THdata,
                {
                  onClick: () => handleSort("is_active"),
                  className: "cursor-pointer",
                  children: [
                    "Status ",
                    renderArrow("is_active")
                  ]
                }
              ),
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
              /* @__PURE__ */ jsx(THdata, { children: /* @__PURE__ */ jsx("p", { className: "flex w-full justify-center", children: /* @__PURE__ */ jsx("span", { children: "Actions" }) }) })
            ] }),
            /* @__PURE__ */ jsx(TBody, { children: courseVersionMappings?.data?.length ? courseVersionMappings.data.map((mapping) => /* @__PURE__ */ jsxs(Trow, { children: [
              /* @__PURE__ */ jsx(Tdata, { children: mapping.course_version?.name }),
              /* @__PURE__ */ jsx(Tdata, { children: mapping.course?.name ?? "-" }),
              /* @__PURE__ */ jsx(Tdata, { children: mapping.course?.certification_level?.exam_body ? `${mapping.course.certification_level.exam_body.code} - ${mapping.course.certification_level.exam_body.name}` : "-" }),
              /* @__PURE__ */ jsx(Tdata, { children: /* @__PURE__ */ jsx(
                "span",
                {
                  className: `rounded px-2 py-1 text-xs ${mapping.is_active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`,
                  children: mapping.is_active ? "Active" : "Inactive"
                }
              ) }),
              /* @__PURE__ */ jsx(Tdata, { children: formatDate(mapping.created_at) }),
              /* @__PURE__ */ jsx(Tdata, { children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center gap-x-10", children: [
                /* @__PURE__ */ jsx(
                  Link,
                  {
                    href: route(
                      "courses.course-version-mappings.edit",
                      encodeURIComponent(
                        mapping.id
                      )
                    ),
                    className: "text-emerald-600 hover:underline",
                    children: "Edit"
                  }
                ),
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    onClick: () => handleDelete(mapping.id),
                    className: "text-red-600 hover:underline",
                    children: "Delete"
                  }
                )
              ] }) })
            ] }, mapping.id)) : /* @__PURE__ */ jsx(Trow, { children: /* @__PURE__ */ jsx(Tdata, { colSpan: "6", className: "py-4 text-center", children: "No course version mappings found." }) }) })
          ]
        }
      )
    ] })
  ] });
}
export {
  CourseVersionMappingsIndex as default
};
