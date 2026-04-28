import { jsxs, jsx } from "react/jsx-runtime";
import { Head, Link, router } from "@inertiajs/react";
import { useState } from "react";
import { A as AuthenticatedLayout } from "./AuthenticatedLayout-C67J8cqJ.js";
import { D as DirectoryTable, T as Thead, a as THdata, b as TBody, c as Trow, d as Tdata } from "./Tdata-C86zXZO_.js";
import { f as formatDate } from "./date-CQXYOX-2.js";
import "lucide-react";
import "react-toastify";
function UnitsIndex({ academic_sessions }) {
  const [sortField, setSortField] = useState(
    academic_sessions.sort || "created_at"
  );
  const [sortDirection, setSortDirection] = useState(
    academic_sessions.direction || "desc"
  );
  const [searchTerm, setSearchTerm] = useState("");
  const handleSort = (field) => {
    const direction = sortField === field && sortDirection === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortDirection(direction);
    router.get(
      route("academic.sessions.index"),
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
      route("academic.sessions.index"),
      { search: searchTerm, sort: sortField, direction: sortDirection },
      { preserveState: true, replace: true }
    );
  };
  const handleDelete = (id) => {
    if (!confirm("Are you sure you want to delete this session?")) return;
    router.delete(route("academic.sessions.destroy", id), {
      preserveState: true,
      replace: true
    });
  };
  return /* @__PURE__ */ jsxs(AuthenticatedLayout, { children: [
    /* @__PURE__ */ jsx(Head, { title: "Academic Sessions" }),
    /* @__PURE__ */ jsxs("div", { className: "max-w-6xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-700", children: [
      /* @__PURE__ */ jsx(
        Link,
        {
          className: "mb-4 px-4 py-1 bg-slate-400 text-white rounded hover:bg-slate-700 inline-block",
          href: route("academic.sessions.create"),
          children: "Add Academic Session"
        }
      ),
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
                placeholder: "Search academic sessions...",
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
          pagination: academic_sessions,
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
              /* @__PURE__ */ jsx(THdata, { children: "Session_No" }),
              /* @__PURE__ */ jsx(THdata, { children: "Academic Year" }),
              /* @__PURE__ */ jsx(THdata, { children: "Start Date" }),
              /* @__PURE__ */ jsx(THdata, { children: "End Date" }),
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
              /* @__PURE__ */ jsx(THdata, { children: "Actions" })
            ] }),
            /* @__PURE__ */ jsx(TBody, { children: academic_sessions?.data?.length ? academic_sessions.data.map((session) => /* @__PURE__ */ jsxs(Trow, { children: [
              /* @__PURE__ */ jsx(Tdata, { children: session.id }),
              /* @__PURE__ */ jsx(Tdata, { className: "font-medium text-slate-700", children: session.session_No }),
              /* @__PURE__ */ jsx(Tdata, { className: "font-medium text-slate-700", children: session.academic_year.academic_year }),
              /* @__PURE__ */ jsx(Tdata, { children: formatDate(session.start_date) }),
              /* @__PURE__ */ jsx(Tdata, { children: formatDate(session.end_date) }),
              /* @__PURE__ */ jsx(Tdata, { children: /* @__PURE__ */ jsx(
                "span",
                {
                  className: `px-2 py-0.5 rounded text-xs ${session.is_active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`,
                  children: session.is_active ? "Active" : "Inactive"
                }
              ) }),
              /* @__PURE__ */ jsx(Tdata, { children: formatDate(session.created_at) }),
              /* @__PURE__ */ jsx(Tdata, { children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center gap-x-10", children: [
                /* @__PURE__ */ jsx(
                  Link,
                  {
                    href: route(
                      "academic.sessions.edit",
                      session.id
                    ),
                    className: "text-emerald-600 hover:underline",
                    children: "Edit"
                  }
                ),
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    onClick: () => handleDelete(session.id),
                    className: "text-red-600 hover:underline",
                    children: "Delete"
                  }
                )
              ] }) })
            ] }, session.id)) : /* @__PURE__ */ jsx(Trow, { children: /* @__PURE__ */ jsx(Tdata, { colSpan: "8", className: "text-center py-4", children: "No records found." }) }) })
          ]
        }
      )
    ] })
  ] });
}
export {
  UnitsIndex as default
};
