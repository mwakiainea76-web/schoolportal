import { jsxs, Fragment, jsx } from "react/jsx-runtime";
import { Head, Link, router } from "@inertiajs/react";
import { useState } from "react";
import { MoreHorizontalIcon } from "lucide-react";
import { S as SearchSelect } from "./SearchSelect-PvfiRNjv.js";
import { f as formatDate } from "./date-CQXYOX-2.js";
import { d as downloadExport } from "./exportDownload-D_MQvCpZ.js";
import { B as Button, D as DropdownMenu, a as DropdownMenuTrigger, b as DropdownMenuContent, c as DropdownMenuItem, d as DropdownMenuSeparator } from "./dropdown-menu-CDZTbnZi.js";
import { T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell, f as TableFooter } from "./table-CORCWxM6.js";
import "ziggy-js";
import "../app.js";
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
import "./popover-CKqVD3WM.js";
import "cmdk";
import "@radix-ui/react-popover";
import "class-variance-authority";
import "@radix-ui/react-slot";
import "@radix-ui/react-dropdown-menu";
function DepartmentsIndex({ departments }) {
  const [sortField, setSortField] = useState(
    departments.sort || "created_at"
  );
  const [sortDirection, setSortDirection] = useState(
    departments.direction || "desc"
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [exportFormat, setExportFormat] = useState("pdf");
  const handleSort = (field) => {
    const direction = sortField === field && sortDirection === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortDirection(direction);
    router.get(
      route("departments.index"),
      {
        sort: field,
        direction,
        page: 1
      },
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
  const submit = (e) => {
    e.preventDefault();
    router.get(
      route("departments.index"),
      {
        search: searchTerm,
        sort: sortField,
        direction: sortDirection
      },
      {
        preserveState: true,
        replace: true
      }
    );
  };
  const handleDelete = (id) => {
    if (!confirm("Are you sure you want to delete this department?")) {
      return;
    }
    router.delete(route("departments.destroy", encodeURIComponent(id)), {
      preserveState: true,
      replace: true
    });
  };
  const handleExport = () => {
    downloadExport("departments", exportFormat, {
      search: searchTerm || departments.filters?.search || "",
      sort: sortField,
      direction: sortDirection
    });
  };
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(Head, { title: "Departments" }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-4 md:flex-row md:items-center md:justify-between", children: [
        /* @__PURE__ */ jsxs("form", { onSubmit: submit, className: "flex flex-1 gap-2", children: [
          /* @__PURE__ */ jsx("div", { className: "flex-1", children: /* @__PURE__ */ jsx(
            SearchSelect,
            {
              routeName: "departments.search",
              defaultOptions: departments.data,
              placeholder: "Search department...",
              onChange: (body) => setSearchTerm(body?.name ?? "")
            }
          ) }),
          /* @__PURE__ */ jsx(Button, { type: "submit", children: "Search" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxs(
            "select",
            {
              value: exportFormat,
              onChange: (e) => setExportFormat(e.target.value),
              className: "h-9 rounded-md border bg-background px-3 text-sm",
              children: [
                /* @__PURE__ */ jsx("option", { value: "pdf", children: "PDF" }),
                /* @__PURE__ */ jsx("option", { value: "csv", children: "CSV" }),
                /* @__PURE__ */ jsx("option", { value: "excel", children: "Excel" })
              ]
            }
          ),
          /* @__PURE__ */ jsx(Button, { variant: "outline", onClick: handleExport, children: "Export" })
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsxs(Table, { children: [
        /* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
          /* @__PURE__ */ jsxs(
            TableHead,
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
            TableHead,
            {
              onClick: () => handleSort("name"),
              className: "cursor-pointer",
              children: [
                "Name ",
                renderArrow("name")
              ]
            }
          ),
          /* @__PURE__ */ jsx(TableHead, { children: "HOD" }),
          /* @__PURE__ */ jsxs(
            TableHead,
            {
              onClick: () => handleSort("created_at"),
              className: "cursor-pointer",
              children: [
                "Created ",
                renderArrow("created_at")
              ]
            }
          ),
          /* @__PURE__ */ jsx(TableHead, { className: "text-right", children: "Actions" })
        ] }) }),
        /* @__PURE__ */ jsx(TableBody, { children: departments?.data?.length ? departments.data.map((department) => /* @__PURE__ */ jsxs(TableRow, { children: [
          /* @__PURE__ */ jsx(TableCell, { className: "font-medium text-slate-700", children: department.code }),
          /* @__PURE__ */ jsx(TableCell, { children: department.name }),
          /* @__PURE__ */ jsx(TableCell, { children: department.hod ? [
            department.hod.staff_number,
            department.hod.name
          ].filter(Boolean).join(" - ") : "-" }),
          /* @__PURE__ */ jsx(TableCell, { children: formatDate(department.created_at) }),
          /* @__PURE__ */ jsx(TableCell, { className: "text-right", children: /* @__PURE__ */ jsxs(DropdownMenu, { children: [
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
                className: "w-40",
                children: [
                  /* @__PURE__ */ jsx(DropdownMenuItem, { asChild: true, children: /* @__PURE__ */ jsx(
                    Link,
                    {
                      href: route(
                        "departments.edit",
                        encodeURIComponent(
                          department.id
                        )
                      ),
                      children: "Edit"
                    }
                  ) }),
                  /* @__PURE__ */ jsx(DropdownMenuSeparator, {}),
                  /* @__PURE__ */ jsx(
                    DropdownMenuItem,
                    {
                      variant: "destructive",
                      onClick: () => handleDelete(
                        department.id
                      ),
                      children: "Delete"
                    }
                  )
                ]
              }
            )
          ] }) })
        ] }, department.id)) : /* @__PURE__ */ jsx(TableRow, { children: /* @__PURE__ */ jsx(
          TableCell,
          {
            colSpan: 5,
            className: "h-24 text-center",
            children: "No departments found."
          }
        ) }) }),
        /* @__PURE__ */ jsx(TableFooter, { children: /* @__PURE__ */ jsx(TableRow, { children: /* @__PURE__ */ jsxs(
          TableCell,
          {
            colSpan: 5,
            className: "px-8 py-3 text-xs font-semibold tracking-widest text-slate-400",
            children: [
              "Showing ",
              departments.from,
              " to",
              " ",
              departments.to,
              " of ",
              departments.total,
              " ",
              "departments"
            ]
          }
        ) }) })
      ] }) }),
      departments.links && departments.links.length > 3 && /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-2", children: departments.links.map((link, index) => /* @__PURE__ */ jsx(
        Link,
        {
          href: link.url || "#",
          preserveState: true,
          preserveScroll: true,
          className: `rounded-md border px-3 py-2 text-sm ${link.active ? "bg-primary text-primary-foreground" : "hover:bg-muted"} ${!link.url ? "pointer-events-none opacity-50" : ""}`,
          dangerouslySetInnerHTML: {
            __html: link.label
          }
        },
        index
      )) })
    ] })
  ] });
}
export {
  DepartmentsIndex as default
};
