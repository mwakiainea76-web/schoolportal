import { jsxs, Fragment, jsx } from "react/jsx-runtime";
import { Head, Link, router } from "@inertiajs/react";
import { useState } from "react";
import { MoreHorizontalIcon } from "lucide-react";
import { T as Table$1, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell } from "./table-CORCWxM6.js";
import { T as TablePagination } from "./TablePagination-BE25-yJ0.js";
import { f as formatDate } from "./date-CQXYOX-2.js";
import { S as SearchSelect } from "./SearchSelect-PvfiRNjv.js";
import { D as DropdownMenu, a as DropdownMenuTrigger, B as Button, b as DropdownMenuContent, c as DropdownMenuItem, d as DropdownMenuSeparator } from "./dropdown-menu-CDZTbnZi.js";
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
import "ziggy-js";
import "./popover-CKqVD3WM.js";
import "cmdk";
import "@radix-ui/react-popover";
import "class-variance-authority";
import "@radix-ui/react-slot";
import "@radix-ui/react-dropdown-menu";
function Index({ permissions }) {
  const [sortField, setSortField] = useState("name");
  const [sortDirection, setSortDirection] = useState("asc");
  const [searchTerm, setSearchTerm] = useState("");
  const handleSort = (field) => {
    const direction = sortField === field && sortDirection === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortDirection(direction);
    router.get(
      route("permissions.index"),
      { sort: field, direction, page: 1 },
      { preserveState: true, replace: true }
    );
  };
  const submit = (e) => {
    e.preventDefault();
    router.get(
      route("permissions.index"),
      {
        search: searchTerm,
        sort: sortField,
        direction: sortDirection
      },
      { preserveState: true, replace: true }
    );
  };
  const handleDelete = (id) => {
    if (!confirm("Delete this permission?")) return;
    router.delete(route("permissions.destroy", id), {
      preserveState: true,
      replace: true
    });
  };
  const renderArrow = (field) => {
    if (sortField !== field) return null;
    return sortDirection === "asc" ? "↑" : "↓";
  };
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(Head, { title: "Permissions" }),
    /* @__PURE__ */ jsxs("div", { className: "max-w-4xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-700", children: [
      /* @__PURE__ */ jsxs("form", { className: "w-full flex gap-x-7 mb-4", onSubmit: submit, children: [
        /* @__PURE__ */ jsx(
          SearchSelect,
          {
            routeName: "permissions.search",
            defaultOptions: permissions.data,
            placeholder: "Search permission...",
            onChange: (perm) => setSearchTerm(perm.name)
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
      ] }),
      /* @__PURE__ */ jsxs(Table, { pagination: permissions, children: [
        /* @__PURE__ */ jsxs(Thead, { children: [
          /* @__PURE__ */ jsxs(
            THdata,
            {
              onClick: () => handleSort("name"),
              className: "cursor-pointer",
              children: [
                "Permission ",
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
          ),
          /* @__PURE__ */ jsx(THdata, { children: "Actions" })
        ] }),
        /* @__PURE__ */ jsx(Tbody, { children: permissions?.data?.length > 0 ? permissions.data.map((permission) => /* @__PURE__ */ jsxs(Trow, { children: [
          /* @__PURE__ */ jsx(Tdata, { children: permission.name }),
          /* @__PURE__ */ jsx(Tdata, { children: formatDate(permission.created_at) }),
          /* @__PURE__ */ jsx(Tdata, { className: "text-right", children: /* @__PURE__ */ jsxs(DropdownMenu, { children: [
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
                        "permissions.edit",
                        permission.id
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
                        permission.id
                      ),
                      children: "Delete"
                    }
                  )
                ]
              }
            )
          ] }) })
        ] }, permission.id)) : /* @__PURE__ */ jsx(Trow, { children: /* @__PURE__ */ jsx(Tdata, { colSpan: "3", className: "text-center py-4", children: "No permissions found." }) }) })
      ] })
    ] })
  ] });
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
  Index as default
};
