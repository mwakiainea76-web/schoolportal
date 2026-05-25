import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { Head, Link, router } from "@inertiajs/react";
import { useState } from "react";
import { A as AuthenticatedLayout } from "./AuthenticatedLayout-DYCvRbZH.js";
import { D as DirectoryTable, T as Thead, a as THdata, b as TBody, c as Trow, d as Tdata } from "./Tdata-C86zXZO_.js";
import { f as formatDate } from "./date-CQXYOX-2.js";
import { S as SearchSelect } from "./SearchSelect-Bxy39qA_.js";
import "lucide-react";
import "react-toastify";
import "ziggy-js";
function Workspace({
  activeTab = "exam-bodies",
  examBodies,
  certificationLevels,
  selectedExamBody,
  filters = {}
}) {
  const isExamBodies = activeTab === "exam-bodies";
  const dataset = isExamBodies ? examBodies : certificationLevels;
  const [sortField, setSortField] = useState(filters.sort || "created_at");
  const [sortDirection, setSortDirection] = useState(
    filters.direction || "desc"
  );
  const [searchTerm, setSearchTerm] = useState(filters.search || "");
  const indexRoute = isExamBodies ? "exam.bodies.index" : "certification-levels.index";
  const createRoute = isExamBodies ? "exam.bodies.create" : "certification-levels.create";
  const searchRoute = isExamBodies ? "exam.bodies.search" : "certification-levels.search";
  const selectedExamBodyId = filters.exam_body_id || selectedExamBody?.id;
  const handleSort = (field) => {
    const direction = sortField === field && sortDirection === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortDirection(direction);
    router.get(
      route(indexRoute),
      {
        sort: field,
        direction,
        page: 1,
        search: searchTerm || void 0,
        exam_body_id: selectedExamBodyId || void 0
      },
      { preserveState: true, replace: true }
    );
  };
  const submit = (e) => {
    e.preventDefault();
    router.get(
      route(indexRoute),
      {
        search: searchTerm || void 0,
        sort: sortField,
        direction: sortDirection,
        exam_body_id: selectedExamBodyId || void 0
      },
      { preserveState: true, replace: true }
    );
  };
  const handleDelete = (id) => {
    const confirmed = confirm(
      isExamBodies ? "Are you sure you want to delete this exam body?" : "Are you sure you want to delete this certification level?"
    );
    if (!confirmed) return;
    router.delete(
      route(
        isExamBodies ? "exam.bodies.destroy" : "certification-levels.destroy",
        encodeURIComponent(id)
      ),
      {
        preserveState: true,
        replace: true
      }
    );
  };
  const renderArrow = (field) => {
    if (sortField !== field) return null;
    return sortDirection === "asc" ? "↑" : "↓";
  };
  return /* @__PURE__ */ jsxs(AuthenticatedLayout, { children: [
    /* @__PURE__ */ jsx(Head, { title: "Exams & Certifications" }),
    /* @__PURE__ */ jsxs("div", { className: "mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-700", children: [
      /* @__PURE__ */ jsxs("div", { className: "mb-5 flex flex-col gap-4 rounded-[1.75rem] bg-[#132238] px-6 py-6 text-white shadow-lg md:flex-row md:items-end md:justify-between", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("p", { className: "text-sm font-semibold uppercase tracking-[0.2em] text-emerald-300", children: "Academic Setup" }),
          /* @__PURE__ */ jsx("h1", { className: "mt-2 text-3xl font-bold tracking-tight", children: "Exams & Certifications" }),
          /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm text-slate-300", children: "Manage exam bodies and the certification levels under them from one workspace." })
        ] }),
        /* @__PURE__ */ jsx(
          Link,
          {
            href: route(createRoute),
            data: !isExamBodies && selectedExamBodyId ? { exam_body_id: selectedExamBodyId } : void 0,
            className: "inline-flex rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700",
            children: isExamBodies ? "Add Exam Body" : "Add Certification Level"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mb-5 flex flex-wrap gap-3", children: [
        /* @__PURE__ */ jsx(
          Link,
          {
            href: route("exam.bodies.index"),
            className: `rounded-xl px-4 py-2 text-sm font-semibold transition ${isExamBodies ? "bg-slate-900 text-white" : "bg-white text-slate-700 shadow-sm ring-1 ring-zinc-200 hover:bg-zinc-50"}`,
            children: "Exam Bodies"
          }
        ),
        /* @__PURE__ */ jsx(
          Link,
          {
            href: route("certification-levels.index"),
            className: `rounded-xl px-4 py-2 text-sm font-semibold transition ${!isExamBodies ? "bg-slate-900 text-white" : "bg-white text-slate-700 shadow-sm ring-1 ring-zinc-200 hover:bg-zinc-50"}`,
            children: "Certification Levels"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("form", { className: "mb-4 flex w-full gap-x-7", onSubmit: submit, children: [
        /* @__PURE__ */ jsx(
          SearchSelect,
          {
            routeName: searchRoute,
            defaultOptions: dataset?.data ?? [],
            placeholder: isExamBodies ? "Search exam body..." : "Search certification level...",
            onChange: (item) => setSearchTerm(
              item?.name ?? item?.code ?? ""
            )
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
      ] }),
      !isExamBodies && selectedExamBody ? /* @__PURE__ */ jsxs("div", { className: "mb-4 flex items-center justify-between rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800", children: [
        /* @__PURE__ */ jsxs("p", { children: [
          "Viewing certification levels for",
          " ",
          /* @__PURE__ */ jsx("span", { className: "font-semibold", children: selectedExamBody.name }),
          selectedExamBody.code ? ` (${selectedExamBody.code})` : "",
          "."
        ] }),
        /* @__PURE__ */ jsx(
          Link,
          {
            href: route("certification-levels.index"),
            className: "font-semibold text-emerald-700 hover:underline",
            children: "Clear filter"
          }
        )
      ] }) : null,
      /* @__PURE__ */ jsxs(
        DirectoryTable,
        {
          pagination: dataset,
          sortField,
          sortDirection,
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
              isExamBodies ? /* @__PURE__ */ jsxs(
                THdata,
                {
                  onClick: () => handleSort("description"),
                  className: "cursor-pointer",
                  children: [
                    "Description ",
                    renderArrow("description")
                  ]
                }
              ) : /* @__PURE__ */ jsxs(Fragment, { children: [
                /* @__PURE__ */ jsx(THdata, { children: "Exam Body" }),
                /* @__PURE__ */ jsxs(
                  THdata,
                  {
                    onClick: () => handleSort("entry_grade"),
                    className: "cursor-pointer",
                    children: [
                      "Entry Grade ",
                      renderArrow("entry_grade")
                    ]
                  }
                )
              ] }),
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
            /* @__PURE__ */ jsx(TBody, { children: dataset?.data?.length ? dataset.data.map((item) => /* @__PURE__ */ jsxs(Trow, { children: [
              /* @__PURE__ */ jsx(Tdata, { children: item.code }),
              /* @__PURE__ */ jsx(Tdata, { children: item.name }),
              isExamBodies ? /* @__PURE__ */ jsx(Tdata, { children: item.description }) : /* @__PURE__ */ jsxs(Fragment, { children: [
                /* @__PURE__ */ jsx(Tdata, { children: item.exam_body?.name }),
                /* @__PURE__ */ jsx(Tdata, { children: item.entry_grade })
              ] }),
              /* @__PURE__ */ jsx(Tdata, { children: formatDate(item.created_at) }),
              /* @__PURE__ */ jsx(Tdata, { children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center gap-x-10", children: [
                /* @__PURE__ */ jsx(
                  Link,
                  {
                    href: route(
                      isExamBodies ? "exam.bodies.edit" : "certification-levels.edit",
                      encodeURIComponent(item.id)
                    ),
                    className: "text-emerald-600 hover:underline",
                    children: "Edit"
                  }
                ),
                isExamBodies ? /* @__PURE__ */ jsx(
                  Link,
                  {
                    href: route(
                      "certification-levels.index",
                      {
                        exam_body_id: item.id
                      }
                    ),
                    className: "text-emerald-600 hover:underline",
                    children: "View certifications"
                  }
                ) : null,
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    onClick: () => handleDelete(item.id),
                    className: "text-red-600 hover:underline",
                    children: "Delete"
                  }
                )
              ] }) })
            ] }, item.id)) : /* @__PURE__ */ jsx(Trow, { children: /* @__PURE__ */ jsx(
              Tdata,
              {
                colSpan: isExamBodies ? "5" : "6",
                className: "py-4 text-center",
                children: isExamBodies ? "No exam bodies found." : "No certification levels found."
              }
            ) }) })
          ]
        }
      )
    ] })
  ] });
}
export {
  Workspace as default
};
