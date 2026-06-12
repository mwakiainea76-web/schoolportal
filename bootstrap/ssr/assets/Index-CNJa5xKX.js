import { jsxs, Fragment, jsx } from "react/jsx-runtime";
import { Head, Link, router } from "@inertiajs/react";
import { useState } from "react";
import { T as Table, a as Thead, b as THdata, c as Tbody, d as Trow, e as Tdata } from "./Tdata-BYbinPOB.js";
import { S as SearchSelect } from "./SearchSelect-lqQVrrVr.js";
import { u as useRbac } from "../app.js";
import { d as downloadExport } from "./exportDownload-D_MQvCpZ.js";
import "ziggy-js";
import "axios";
import "react-dom/client";
import "lucide-react";
import "react-toastify";
function CurriculumIndex({
  curricula,
  filters = {},
  curriculumOptions = []
}) {
  const pageFilters = filters && typeof filters === "object" && !Array.isArray(filters) ? filters : {};
  const [sortField, setSortField] = useState(
    pageFilters.sort || curricula.sort || "created_at"
  );
  const [sortDirection, setSortDirection] = useState(
    pageFilters.direction || curricula.direction || "desc"
  );
  const [searchTerm, setSearchTerm] = useState(pageFilters.search || "");
  const [exportFormat, setExportFormat] = useState("pdf");
  const { can } = useRbac();
  const handleSort = (field) => {
    const direction = sortField === field && sortDirection === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortDirection(direction);
    router.get(
      route("curriculums.index"),
      {
        search: searchTerm || pageFilters.search || "",
        sort: field,
        direction,
        page: 1
      },
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
      route("curriculums.index"),
      { search: searchTerm, sort: sortField, direction: sortDirection },
      { preserveState: true, replace: true }
    );
  };
  const handleExport = () => {
    downloadExport("curriculums", exportFormat, {
      search: searchTerm || pageFilters.search || "",
      sort: sortField,
      direction: sortDirection
    });
  };
  const handleDelete = (id) => {
    if (!confirm("Are you sure you want to delete this curriculum?")) {
      return;
    }
    router.delete(route("curriculums.destroy", { curriculum: id }), {
      preserveState: true,
      replace: true
    });
  };
  const handleDisable = (id) => {
    if (!confirm("Disable this curriculum?")) {
      return;
    }
    router.patch(route("curriculums.disable", { curriculum: id }), {}, {
      preserveScroll: true,
      preserveState: true,
      replace: true
    });
  };
  const handleReactivate = (id) => {
    if (!confirm("Reactivate this curriculum?")) {
      return;
    }
    router.patch(route("curriculums.reactivate", { curriculum: id }), {}, {
      preserveScroll: true,
      preserveState: true,
      replace: true
    });
  };
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(Head, { title: "Curriculums" }),
    /* @__PURE__ */ jsxs("div", { className: "mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-700", children: [
      can("curriculums.view") ? /* @__PURE__ */ jsxs(
        "form",
        {
          className: "mb-2 flex w-full flex-wrap items-center gap-3",
          onSubmit: submit,
          children: [
            /* @__PURE__ */ jsx("div", { className: "min-w-[200px] flex-1", children: /* @__PURE__ */ jsx(
              SearchSelect,
              {
                routeName: "curriculums.search",
                defaultOptions: curriculumOptions,
                placeholder: "Select curriculum ...",
                onChange: (body) => setSearchTerm(body?.name || "")
              }
            ) }),
            /* @__PURE__ */ jsx(
              "button",
              {
                className: "whitespace-nowrap rounded bg-emerald-600 px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-slate-700",
                type: "submit",
                children: "Search"
              }
            )
          ]
        }
      ) : null,
      can("curriculums.view") ? /* @__PURE__ */ jsx("div", { className: "flex justify-end", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center", children: [
        /* @__PURE__ */ jsxs(
          "select",
          {
            value: exportFormat,
            onChange: (e) => setExportFormat(e.target.value),
            className: "h-[34px] rounded-l border border-slate-300 border-r-0 bg-white px-3 text-sm text-slate-700 focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-inset focus:ring-gray-500",
            children: [
              /* @__PURE__ */ jsx("option", { value: "pdf", children: "PDF" }),
              /* @__PURE__ */ jsx("option", { value: "csv", children: "CSV" }),
              /* @__PURE__ */ jsx("option", { value: "excel", children: "Excel" })
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          "button",
          {
            type: "button",
            onClick: handleExport,
            className: "h-[34px] whitespace-nowrap rounded-r bg-gray-400 px-4 text-sm font-medium text-white transition-colors hover:bg-gray-600",
            children: [
              "Export ",
              exportFormat.toUpperCase()
            ]
          }
        )
      ] }) }) : null,
      /* @__PURE__ */ jsxs(
        Table,
        {
          pagination: curricula,
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
              /* @__PURE__ */ jsx(THdata, { children: "Exam Body" }),
              /* @__PURE__ */ jsx(THdata, { children: "Status" }),
              can("curriculums.edit") || can("curriculums.delete") ? /* @__PURE__ */ jsx(THdata, { children: /* @__PURE__ */ jsx("p", { className: "text-center", children: "Actions" }) }) : null
            ] }),
            /* @__PURE__ */ jsx(Tbody, { children: curricula?.data?.length ? curricula.data.map((curriculum) => /* @__PURE__ */ jsxs(Trow, { children: [
              /* @__PURE__ */ jsx(Tdata, { children: curriculum.name }),
              /* @__PURE__ */ jsx(Tdata, { children: curriculum.exam_body ? [curriculum.exam_body.name].filter(Boolean).join(" - ") : "-" }),
              /* @__PURE__ */ jsx(Tdata, { children: /* @__PURE__ */ jsx(
                "span",
                {
                  className: `rounded px-2 py-1 text-xs font-semibold ${curriculum.is_active ? "bg-emerald-100 text-emerald-700" : "bg-zinc-200 text-zinc-700"}`,
                  children: curriculum.is_active ? "Active" : "Disabled"
                }
              ) }),
              can("curriculums.edit") || can("curriculums.delete") ? /* @__PURE__ */ jsx(Tdata, { children: /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center justify-center gap-x-4 gap-y-2", children: [
                can("curriculums.edit") ? /* @__PURE__ */ jsx(
                  Link,
                  {
                    href: route(
                      "curriculums.edit",
                      {
                        curriculum: curriculum.id
                      }
                    ),
                    className: "whitespace-nowrap text-emerald-600 hover:underline",
                    children: "Edit"
                  }
                ) : null,
                can("curriculums.edit") ? curriculum.is_active ? /* @__PURE__ */ jsx(
                  "button",
                  {
                    onClick: () => handleDisable(
                      curriculum.id
                    ),
                    className: "whitespace-nowrap text-amber-600 hover:underline",
                    children: "Disable"
                  }
                ) : /* @__PURE__ */ jsx(
                  "button",
                  {
                    onClick: () => handleReactivate(
                      curriculum.id
                    ),
                    className: "whitespace-nowrap text-emerald-600 hover:underline",
                    children: "Activate"
                  }
                ) : null,
                can("curriculums.delete") ? /* @__PURE__ */ jsx(
                  "button",
                  {
                    onClick: () => handleDelete(
                      curriculum.id
                    ),
                    className: "whitespace-nowrap text-red-600 hover:underline",
                    children: "Delete"
                  }
                ) : null
              ] }) }) : null
            ] }, curriculum.id)) : /* @__PURE__ */ jsx(Trow, { children: /* @__PURE__ */ jsx(Tdata, { colSpan: "5", className: "text-center py-4", children: "No curriculums found." }) }) })
          ]
        }
      )
    ] })
  ] });
}
export {
  CurriculumIndex as default
};
