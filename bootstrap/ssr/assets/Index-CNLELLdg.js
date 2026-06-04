import { jsxs, jsx } from "react/jsx-runtime";
import { Head, Link, router } from "@inertiajs/react";
import { useState } from "react";
import { u as useRbac, A as AuthenticatedLayout } from "../app.js";
import { D as DirectoryTable, T as Thead, a as THdata, b as TBody, c as Trow, d as Tdata } from "./Tdata--sq9P0k3.js";
import { S as SearchSelect } from "./SearchSelect-iSHxFhW9.js";
import { f as formatDate } from "./date-CQXYOX-2.js";
import "axios";
import "lucide-react";
import "react-toastify";
import "react-dom/client";
import "ziggy-js";
function ProgramVersionIndex({
  curricula,
  program_versions = []
}) {
  const [sortField, setSortField] = useState(curricula.sort || "created_at");
  const [sortDirection, setSortDirection] = useState(
    curricula.direction || "desc"
  );
  const [searchTerm, setSearchTerm] = useState("");
  const { can } = useRbac();
  const handleSort = (field) => {
    const direction = sortField === field && sortDirection === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortDirection(direction);
    router.get(
      route("program-versions.index"),
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
      route("program-versions.index"),
      { search: searchTerm, sort: sortField, direction: sortDirection },
      { preserveState: true, replace: true }
    );
  };
  const handleDelete = (id) => {
    if (!confirm("Are you sure you want to delete this course version?")) {
      return;
    }
    router.delete(route("program-versions.destroy", { curriculum: id }), {
      preserveState: true,
      replace: true
    });
  };
  return /* @__PURE__ */ jsxs(AuthenticatedLayout, { children: [
    /* @__PURE__ */ jsx(Head, { title: "Course Versions" }),
    /* @__PURE__ */ jsxs("div", { className: "mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-700", children: [
      can("program-versions.view") ? /* @__PURE__ */ jsxs(
        "form",
        {
          className: "w-full relative flex gap-x-7",
          onSubmit: submit,
          children: [
            /* @__PURE__ */ jsx(
              SearchSelect,
              {
                defaultOptions: program_versions,
                placeholder: "Select course version ...",
                onChange: (body) => setSearchTerm(body.name)
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
      ) : null,
      /* @__PURE__ */ jsxs(
        DirectoryTable,
        {
          pagination: curricula,
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
                  onClick: () => handleSort("start_date"),
                  className: "cursor-pointer",
                  children: [
                    "Start Date ",
                    renderArrow("start_date")
                  ]
                }
              ),
              /* @__PURE__ */ jsxs(
                THdata,
                {
                  onClick: () => handleSort("end_date"),
                  className: "cursor-pointer",
                  children: [
                    "End Date ",
                    renderArrow("end_date")
                  ]
                }
              ),
              /* @__PURE__ */ jsx(THdata, { children: "Status" }),
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
              can("program-versions.edit") || can("program-versions.delete") ? /* @__PURE__ */ jsx(THdata, { children: /* @__PURE__ */ jsx("p", { className: "text-center", children: "Actions" }) }) : null
            ] }),
            /* @__PURE__ */ jsx(TBody, { children: curricula?.data?.length ? curricula.data.map((curriculum) => /* @__PURE__ */ jsxs(Trow, { children: [
              /* @__PURE__ */ jsx(Tdata, { children: curriculum.id }),
              /* @__PURE__ */ jsx(Tdata, { children: curriculum.name }),
              /* @__PURE__ */ jsx(Tdata, { children: formatDate(curriculum.start_date) }),
              /* @__PURE__ */ jsx(Tdata, { children: curriculum.end_date ? formatDate(curriculum.end_date) : "Ongoing" }),
              /* @__PURE__ */ jsx(Tdata, { children: /* @__PURE__ */ jsx(
                "span",
                {
                  className: `px-2 py-1 rounded text-xs ${curriculum.is_active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`,
                  children: curriculum.is_active ? "Active" : "Inactive"
                }
              ) }),
              /* @__PURE__ */ jsx(Tdata, { children: formatDate(curriculum.created_at) }),
              can("program-versions.edit") || can("program-versions.delete") ? /* @__PURE__ */ jsx(Tdata, { children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center gap-x-10", children: [
                can("program-versions.edit") ? /* @__PURE__ */ jsx(
                  Link,
                  {
                    href: route(
                      "program-versions.edit",
                      {
                        curriculum: curriculum.id
                      }
                    ),
                    className: "text-emerald-600 hover:underline",
                    children: "Edit"
                  }
                ) : null,
                can("program-versions.delete") ? /* @__PURE__ */ jsx(
                  "button",
                  {
                    onClick: () => handleDelete(
                      curriculum.id
                    ),
                    className: "text-red-600 hover:underline",
                    children: "Delete"
                  }
                ) : null
              ] }) }) : null
            ] }, curriculum.id)) : /* @__PURE__ */ jsx(Trow, { children: /* @__PURE__ */ jsx(Tdata, { colSpan: "7", className: "text-center py-4", children: "No course versions found." }) }) })
          ]
        }
      )
    ] })
  ] });
}
export {
  ProgramVersionIndex as default
};
