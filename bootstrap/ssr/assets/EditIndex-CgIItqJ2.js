import { jsxs, Fragment, jsx } from "react/jsx-runtime";
import { Head, Link, router } from "@inertiajs/react";
import { ListChecks, Search, Download, MoreHorizontalIcon } from "lucide-react";
import { useState } from "react";
import { D as DropdownMenu, a as DropdownMenuTrigger, B as Button, b as DropdownMenuContent, c as DropdownMenuItem, d as DropdownMenuSeparator } from "./dropdown-menu-CDZTbnZi.js";
import { T as Table$1, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell } from "./table-CORCWxM6.js";
import { T as TablePagination } from "./TablePagination-BE25-yJ0.js";
import { S as SearchSelect } from "./SearchSelect-PvfiRNjv.js";
import { u as useRbac } from "../app.js";
import { d as downloadExport } from "./exportDownload-D_MQvCpZ.js";
import "class-variance-authority";
import "@radix-ui/react-slot";
import "@radix-ui/react-dropdown-menu";
import "ziggy-js";
import "./popover-CKqVD3WM.js";
import "cmdk";
import "@radix-ui/react-popover";
import "axios";
import "../app2.js";
import "react-dom/client";
import "@radix-ui/react-collapsible";
import "@radix-ui/react-scroll-area";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-separator";
import "@radix-ui/react-dialog";
import "@radix-ui/react-tooltip";
import "react-toastify";
function CurriculumEditIndex({
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
  const canManage = can("curriculums.edit") || can("curriculums.delete");
  const routeName = "curriculums.edit.index";
  const handleSort = (field) => {
    const direction = sortField === field && sortDirection === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortDirection(direction);
    router.get(
      route(routeName),
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
      route(routeName),
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
  const emptyColSpan = canManage ? 4 : 3;
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(Head, { title: "Edit Curriculums" }),
    /* @__PURE__ */ jsxs("div", { className: "mx-auto w-full space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700", children: [
      can("curriculums.view") ? /* @__PURE__ */ jsx("section", { className: "rounded-lg border border-slate-200 bg-white shadow-sm", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-4 border-b border-slate-100 p-4 lg:flex-row lg:items-center lg:justify-between", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsx("span", { className: "flex h-9 w-9 items-center justify-center rounded bg-slate-100 text-slate-700", children: /* @__PURE__ */ jsx(ListChecks, { className: "h-5 w-5", "aria-hidden": "true" }) }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h2", { className: "text-base font-semibold text-slate-900", children: "Operations" }),
            /* @__PURE__ */ jsx("p", { className: "text-xs text-slate-500", children: "Search, export, and manage curriculum status." })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-3 sm:flex-row sm:items-center", children: [
          /* @__PURE__ */ jsxs(
            "form",
            {
              className: "flex min-w-0 flex-1 gap-2 sm:min-w-[360px]",
              onSubmit: submit,
              children: [
                /* @__PURE__ */ jsx("div", { className: "min-w-0 flex-1", children: /* @__PURE__ */ jsx(
                  SearchSelect,
                  {
                    routeName: "curriculums.search",
                    defaultOptions: curriculumOptions,
                    placeholder: "Select curriculum ...",
                    onChange: (body) => setSearchTerm(body?.name || "")
                  }
                ) }),
                /* @__PURE__ */ jsxs(
                  "button",
                  {
                    className: "inline-flex h-[38px] items-center gap-2 whitespace-nowrap rounded bg-emerald-600 px-4 text-sm font-medium text-white transition-colors hover:bg-slate-700",
                    type: "submit",
                    children: [
                      /* @__PURE__ */ jsx(Search, { className: "h-4 w-4", "aria-hidden": "true" }),
                      "Search"
                    ]
                  }
                )
              ]
            }
          ),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center", children: [
            /* @__PURE__ */ jsxs(
              "select",
              {
                value: exportFormat,
                onChange: (e) => setExportFormat(e.target.value),
                className: "h-[38px] rounded-l border border-slate-300 border-r-0 bg-white px-3 text-sm text-slate-700 focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-inset focus:ring-gray-500",
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
                className: "inline-flex h-[38px] items-center gap-2 whitespace-nowrap rounded-r bg-slate-500 px-4 text-sm font-medium text-white transition-colors hover:bg-slate-700",
                children: [
                  /* @__PURE__ */ jsx(Download, { className: "h-4 w-4", "aria-hidden": "true" }),
                  "Export"
                ]
              }
            )
          ] })
        ] })
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
              canManage ? /* @__PURE__ */ jsx(THdata, { children: /* @__PURE__ */ jsx("p", { className: "text-center", children: "Actions" }) }) : null
            ] }),
            /* @__PURE__ */ jsx(Tbody, { children: curricula?.data?.length ? curricula.data.map((curriculum) => /* @__PURE__ */ jsxs(Trow, { children: [
              /* @__PURE__ */ jsx(Tdata, { children: curriculum.name }),
              /* @__PURE__ */ jsx(Tdata, { children: curriculum.exam_body ? [curriculum.exam_body.name].filter(Boolean).join(" - ") : "-" }),
              /* @__PURE__ */ jsx(Tdata, { children: /* @__PURE__ */ jsx(StatusPill, { active: curriculum.is_active }) }),
              canManage ? /* @__PURE__ */ jsx(Tdata, { className: "text-right", children: /* @__PURE__ */ jsxs(DropdownMenu, { children: [
                /* @__PURE__ */ jsx(DropdownMenuTrigger, { asChild: true, children: /* @__PURE__ */ jsxs(
                  Button,
                  {
                    variant: "ghost",
                    size: "icon",
                    className: "size-8",
                    children: [
                      /* @__PURE__ */ jsx(MoreHorizontalIcon, {}),
                      /* @__PURE__ */ jsx("span", { className: "sr-only", children: "Open menu" })
                    ]
                  }
                ) }),
                /* @__PURE__ */ jsxs(
                  DropdownMenuContent,
                  {
                    side: "left",
                    align: "start",
                    sideOffset: 8,
                    className: "w-44",
                    children: [
                      can("curriculums.edit") ? /* @__PURE__ */ jsx(DropdownMenuItem, { asChild: true, children: /* @__PURE__ */ jsx(
                        Link,
                        {
                          href: route(
                            "curriculums.edit",
                            {
                              curriculum: curriculum.id
                            }
                          ),
                          children: "Edit"
                        }
                      ) }) : null,
                      can("curriculums.edit") ? curriculum.is_active ? /* @__PURE__ */ jsx(
                        DropdownMenuItem,
                        {
                          onClick: () => handleDisable(
                            curriculum.id
                          ),
                          children: "Disable"
                        }
                      ) : /* @__PURE__ */ jsx(
                        DropdownMenuItem,
                        {
                          onClick: () => handleReactivate(
                            curriculum.id
                          ),
                          children: "Activate"
                        }
                      ) : null,
                      can("curriculums.delete") ? /* @__PURE__ */ jsxs(Fragment, { children: [
                        /* @__PURE__ */ jsx(DropdownMenuSeparator, {}),
                        /* @__PURE__ */ jsx(
                          DropdownMenuItem,
                          {
                            variant: "destructive",
                            onClick: () => handleDelete(
                              curriculum.id
                            ),
                            children: "Delete"
                          }
                        )
                      ] }) : null
                    ]
                  }
                )
              ] }) }) : null
            ] }, curriculum.id)) : /* @__PURE__ */ jsx(Trow, { children: /* @__PURE__ */ jsx(Tdata, { colSpan: emptyColSpan, className: "py-6 text-center text-slate-400", children: "No curriculums found." }) }) })
          ]
        }
      )
    ] })
  ] });
}
function StatusPill({ active }) {
  return /* @__PURE__ */ jsx(
    "span",
    {
      className: `rounded px-2 py-1 text-xs font-semibold ${active ? "bg-emerald-100 text-emerald-700" : "bg-zinc-200 text-zinc-700"}`,
      children: active ? "Active" : "Disabled"
    }
  );
}
const Table = ({ children, pagination, ...props }) => /* @__PURE__ */ jsxs(Fragment, { children: [
  /* @__PURE__ */ jsx(Table$1, { ...props, children }),
  /* @__PURE__ */ jsx(TablePagination, { pagination })
] });
const Thead = ({ children, ...props }) => /* @__PURE__ */ jsx(TableHeader, { ...props, children: /* @__PURE__ */ jsx(TableRow, { children }) });
const THdata = (props) => /* @__PURE__ */ jsx(TableHead, { ...props });
const Tbody = (props) => /* @__PURE__ */ jsx(TableBody, { ...props });
const Trow = (props) => /* @__PURE__ */ jsx(TableRow, { ...props });
const Tdata = (props) => /* @__PURE__ */ jsx(TableCell, { ...props });
export {
  CurriculumEditIndex as default
};
