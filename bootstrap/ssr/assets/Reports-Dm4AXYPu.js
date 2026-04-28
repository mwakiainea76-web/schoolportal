import { jsxs, jsx } from "react/jsx-runtime";
import { Head, router } from "@inertiajs/react";
import { useState } from "react";
import { A as AuthenticatedLayout } from "./AuthenticatedLayout-C67J8cqJ.js";
import { D as DirectoryTable, T as Thead, a as THdata, b as TBody, c as Trow, d as Tdata } from "./Tdata-C86zXZO_.js";
import { f as formatDate } from "./date-CQXYOX-2.js";
import "lucide-react";
import "react-toastify";
function ExamBody({ examBodies }) {
  const [sortField, setSortField] = useState(examBodies.sort || "created_at");
  const [sortDirection, setSortDirection] = useState(
    examBodies.direction || "desc"
  );
  const [searchTerm, setSearchTerm] = useState("");
  const handleSort = (field) => {
    const direction = sortField === field && sortDirection === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortDirection(direction);
    router.get(
      route("exam-bodies.reports"),
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
      route("exam-bodies.index"),
      { search: searchTerm, sort: sortField, direction: sortDirection },
      { preserveState: true, replace: true }
    );
  };
  return /* @__PURE__ */ jsxs(AuthenticatedLayout, { children: [
    /* @__PURE__ */ jsx(Head, { title: "Exam Bodies" }),
    /* @__PURE__ */ jsxs("div", { className: "max-w-4xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-700", children: [
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
                placeholder: "Search for exam bodies...",
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
          pagination: examBodies,
          sortField,
          sortDirection,
          print: true,
          children: [
            /* @__PURE__ */ jsxs(Thead, { children: [
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
                  onClick: () => handleSort("created_at"),
                  className: "cursor-pointer",
                  children: [
                    "Created ",
                    renderArrow("created_at")
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsx(TBody, { children: examBodies?.data?.length ? examBodies.data.map((examBody) => /* @__PURE__ */ jsxs(Trow, { children: [
              /* @__PURE__ */ jsx(Tdata, { children: examBody.code }),
              /* @__PURE__ */ jsx(Tdata, { children: examBody.name }),
              /* @__PURE__ */ jsx(Tdata, { children: formatDate(examBody.created_at) })
            ] }, examBody.id)) : /* @__PURE__ */ jsx(Trow, { children: /* @__PURE__ */ jsx(Tdata, { colSpan: "6", className: "text-center py-4", children: "No exam bodies found." }) }) })
          ]
        }
      )
    ] })
  ] });
}
export {
  ExamBody as default
};
