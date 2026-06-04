import { jsxs, jsx } from "react/jsx-runtime";
import { usePage, Head, Link, router } from "@inertiajs/react";
import { useState } from "react";
import { A as AuthenticatedLayout } from "../app.js";
import { D as DirectoryTable, T as Thead, a as THdata, b as TBody, c as Trow, d as Tdata } from "./Tdata--sq9P0k3.js";
import { f as formatDate } from "./date-CQXYOX-2.js";
import "axios";
import "lucide-react";
import "react-toastify";
import "react-dom/client";
const STATUS_STYLES = {
  active: "bg-green-100 text-green-700",
  completed: "bg-blue-100 text-blue-700",
  dropped: "bg-red-100 text-red-600",
  transferred: "bg-yellow-100 text-yellow-700",
  suspended: "bg-gray-100 text-gray-600"
};
function Index({ enrollments }) {
  const { flash } = usePage().props;
  const [sortField, setSortField] = useState(
    enrollments.sort || "created_at"
  );
  const [sortDirection, setSortDirection] = useState(
    enrollments.direction || "desc"
  );
  const [searchTerm, setSearchTerm] = useState("");
  const handleSort = (field) => {
    const direction = sortField === field && sortDirection === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortDirection(direction);
    router.get(
      route("academic.sessions.enrollments.index"),
      { search: searchTerm, sort: field, direction, page: 1 },
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
      route("academic.sessions.enrollments.index"),
      { search: searchTerm, sort: sortField, direction: sortDirection },
      { preserveState: true, replace: true }
    );
  };
  const handleDelete = (id) => {
    if (!confirm("Are you sure you want to remove this enrollment?"))
      return;
    router.delete(route("academic.session.enrollments.destroy", id), {
      preserveScroll: true,
      replace: true
    });
  };
  return /* @__PURE__ */ jsxs(AuthenticatedLayout, { children: [
    /* @__PURE__ */ jsx(Head, { title: "Academic Session Enrollments" }),
    /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-700", children: [
      /* @__PURE__ */ jsxs(
        "form",
        {
          className: "w-full relative flex gap-x-7",
          onSubmit: submit,
          children: [
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "text",
                placeholder: "Search by student name or registration number...",
                className: "w-full bg-zinc-50 border-zinc-200 rounded-xl py-2.5 pl-11 text-sm focus:ring-gray-400 transition-all",
                value: searchTerm,
                onChange: (e) => setSearchTerm(e.target.value)
              }
            ),
            /* @__PURE__ */ jsx(
              "svg",
              {
                className: "w-4 h-4 text-zinc-400 absolute left-4 top-3",
                fill: "none",
                stroke: "currentColor",
                viewBox: "0 0 24 24",
                children: /* @__PURE__ */ jsx(
                  "path",
                  {
                    d: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z",
                    strokeWidth: "2"
                  }
                )
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
          pagination: enrollments,
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
              /* @__PURE__ */ jsx(THdata, { children: "Student" }),
              /* @__PURE__ */ jsx(THdata, { children: "Reg No." }),
              /* @__PURE__ */ jsx(THdata, { children: "Session" }),
              /* @__PURE__ */ jsx(THdata, { children: "Course Version" }),
              /* @__PURE__ */ jsx(THdata, { children: "Course" }),
              /* @__PURE__ */ jsx(THdata, { children: "Year Of Study" }),
              /* @__PURE__ */ jsx(THdata, { children: "Module" }),
              /* @__PURE__ */ jsx(THdata, { children: "Status" }),
              /* @__PURE__ */ jsxs(
                THdata,
                {
                  onClick: () => handleSort("created_at"),
                  className: "cursor-pointer",
                  children: [
                    "Enrolled ",
                    renderArrow("created_at")
                  ]
                }
              ),
              /* @__PURE__ */ jsx(THdata, { children: "Actions" })
            ] }),
            /* @__PURE__ */ jsx(TBody, { children: enrollments?.data?.length ? enrollments.data.map((enrollment) => /* @__PURE__ */ jsxs(Trow, { children: [
              /* @__PURE__ */ jsx(Tdata, { children: enrollment.id }),
              /* @__PURE__ */ jsx(Tdata, { className: "font-medium text-slate-700", children: enrollment.student_name }),
              /* @__PURE__ */ jsx(Tdata, { className: "text-slate-500", children: enrollment.registration_number }),
              /* @__PURE__ */ jsx(Tdata, { children: enrollment.session }),
              /* @__PURE__ */ jsx(Tdata, { children: enrollment.curriculum }),
              /* @__PURE__ */ jsx(Tdata, { children: enrollment.course }),
              /* @__PURE__ */ jsx(Tdata, { className: "text-center", children: enrollment.year_of_study }),
              /* @__PURE__ */ jsx(Tdata, { className: "text-center", children: enrollment.module }),
              /* @__PURE__ */ jsx(Tdata, { children: /* @__PURE__ */ jsx(
                "span",
                {
                  className: `px-2 py-0.5 rounded text-xs ${STATUS_STYLES[enrollment.status] ?? "bg-gray-100 text-gray-600"}`,
                  children: enrollment.status.charAt(0).toUpperCase() + enrollment.status.slice(1)
                }
              ) }),
              /* @__PURE__ */ jsx(Tdata, { children: formatDate(enrollment.created_at) }),
              /* @__PURE__ */ jsx(Tdata, { children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center gap-x-6", children: [
                /* @__PURE__ */ jsx(
                  Link,
                  {
                    href: route(
                      "academic.sessions.enrollments.edit",
                      enrollment.id
                    ),
                    className: "text-emerald-600 hover:underline",
                    children: "Edit"
                  }
                ),
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    onClick: () => handleDelete(enrollment.id),
                    className: "text-red-600 hover:underline",
                    children: "Delete"
                  }
                )
              ] }) })
            ] }, enrollment.id)) : /* @__PURE__ */ jsx(Trow, { children: /* @__PURE__ */ jsx(
              Tdata,
              {
                colSpan: "11",
                className: "text-center py-4",
                children: "No enrollments found."
              }
            ) }) })
          ]
        }
      )
    ] })
  ] });
}
export {
  Index as default
};
