import { jsxs, Fragment, jsx } from "react/jsx-runtime";
import { Head, router, Link } from "@inertiajs/react";
import { MoreHorizontalIcon } from "lucide-react";
import { useState } from "react";
import { D as DropdownMenu, a as DropdownMenuTrigger, B as Button, b as DropdownMenuContent, c as DropdownMenuItem, d as DropdownMenuSeparator } from "./dropdown-menu-CDZTbnZi.js";
import { T as Table$1, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell } from "./table-CORCWxM6.js";
import { T as TablePagination } from "./TablePagination-BE25-yJ0.js";
import { f as formatDate } from "./date-CQXYOX-2.js";
import "class-variance-authority";
import "@radix-ui/react-slot";
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
import "@radix-ui/react-dropdown-menu";
function FeePlans({ feePlans }) {
  const [sortField, setSortField] = useState(feePlans.sort || "created_at");
  const [sortDirection, setSortDirection] = useState(
    feePlans.direction || "desc"
  );
  const [filters, setFilters] = useState({
    search: feePlans.search || "",
    is_active: feePlans.is_active ?? "",
    version: feePlans.version || "",
    approval_status: feePlans.approval_status || ""
  });
  const applyFilters = (extra = {}) => {
    router.get(
      route("fees.plans.index"),
      {
        ...filters,
        sort: sortField,
        direction: sortDirection,
        ...extra
      },
      {
        preserveState: true,
        replace: true
      }
    );
  };
  const handleSort = (field) => {
    const direction = sortField === field && sortDirection === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortDirection(direction);
    applyFilters({ sort: field, direction });
  };
  const renderArrow = (field) => {
    if (sortField !== field) return null;
    return sortDirection === "asc" ? "↑" : "↓";
  };
  const handleDelete = (id) => {
    if (!confirm("Delete this fee plan?")) return;
    router.delete(route("fees.plans.destroy", id), {
      preserveState: true,
      replace: true
    });
  };
  const handleApproval = (id, action) => {
    const actionText = action === "approve" ? "approve" : "reject";
    const confirmMessage = `Are you sure you want to ${actionText} this fee plan?`;
    if (!confirm(confirmMessage)) return;
    router.post(
      route("fees.plans.approval", { feePlan: id, action }),
      {},
      {
        preserveState: true,
        replace: true
      }
    );
  };
  const updateFilter = (key, value) => {
    const updated = { ...filters, [key]: value };
    setFilters(updated);
    applyFilters({ [key]: value });
  };
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(Head, { title: "Fee Plans" }),
    /* @__PURE__ */ jsxs("div", { className: "mx-auto w-full space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700", children: [
      /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx("h1", { className: "text-lg font-semibold text-zinc-700", children: "Fee Plans" }) }),
      /* @__PURE__ */ jsx("div", { className: "bg-white border border-zinc-100 rounded-lg shadow-sm p-4", children: /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2  xl:grid-cols-3 gap-8", children: [
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "text",
            value: filters.search,
            onChange: (e) => updateFilter("search", e.target.value),
            placeholder: "Search fee plans...",
            className: "border border-zinc-200 px-3 py-2 rounded-lg w-full md:w-72 focus:outline-none focus:ring-2 focus:ring-slate-300"
          }
        ),
        /* @__PURE__ */ jsxs(
          "select",
          {
            value: filters.is_active,
            onChange: (e) => updateFilter("is_active", e.target.value),
            className: "border border-zinc-200 px-3 py-2 rounded-lg",
            children: [
              /* @__PURE__ */ jsx("option", { value: "", children: "All Status" }),
              /* @__PURE__ */ jsx("option", { value: "1", children: "Active" }),
              /* @__PURE__ */ jsx("option", { value: "0", children: "Inactive" })
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          "select",
          {
            value: filters.version,
            onChange: (e) => updateFilter("version", e.target.value),
            className: "border border-zinc-200 px-3 py-2 rounded-lg",
            children: [
              /* @__PURE__ */ jsx("option", { value: "", children: "All Versions" }),
              /* @__PURE__ */ jsx("option", { value: "v1", children: "v1" }),
              /* @__PURE__ */ jsx("option", { value: "v2", children: "v2" }),
              /* @__PURE__ */ jsx("option", { value: "v3", children: "v3" })
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          "select",
          {
            value: filters.approval_status,
            onChange: (e) => updateFilter("approval_status", e.target.value),
            className: "border border-zinc-200 px-3 py-2 rounded-lg",
            children: [
              /* @__PURE__ */ jsx("option", { value: "", children: "All Approvals" }),
              /* @__PURE__ */ jsx("option", { value: "draft", children: "Draft" }),
              /* @__PURE__ */ jsx("option", { value: "pending_approval", children: "Pending Approval" }),
              /* @__PURE__ */ jsx("option", { value: "approved", children: "Approved" }),
              /* @__PURE__ */ jsx("option", { value: "rejected", children: "Rejected" })
            ]
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => {
              const reset = {
                search: "",
                is_active: "",
                version: "",
                approval_status: ""
              };
              setFilters(reset);
              router.get(route("fees.plans.index"));
            },
            className: "px-4 py-2 bg-zinc-400 text-white rounded-lg hover:bg-zinc-500 transition",
            children: "Reset"
          }
        )
      ] }) }),
      /* @__PURE__ */ jsx("div", { className: "bg-white border border-zinc-100 rounded-lg shadow-sm overflow-hidden", children: /* @__PURE__ */ jsxs(
        Table,
        {
          pagination: feePlans,
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
              /* @__PURE__ */ jsxs(
                THdata,
                {
                  onClick: () => handleSort("version"),
                  className: "cursor-pointer",
                  children: [
                    "Version ",
                    renderArrow("version")
                  ]
                }
              ),
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
                  onClick: () => handleSort("approval_status"),
                  className: "cursor-pointer",
                  children: [
                    "Approval ",
                    renderArrow("approval_status")
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
            /* @__PURE__ */ jsx(Tbody, { children: feePlans?.data?.length ? feePlans.data.map((plan) => /* @__PURE__ */ jsxs(Trow, { children: [
              /* @__PURE__ */ jsx(Tdata, { children: plan.name }),
              /* @__PURE__ */ jsx(Tdata, { children: plan.version }),
              /* @__PURE__ */ jsx(Tdata, { children: /* @__PURE__ */ jsx(
                "span",
                {
                  className: `px-2 py-1 rounded text-xs ${plan.is_active == 1 ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`,
                  children: plan.is_active == 1 ? "Active" : "Inactive"
                }
              ) }),
              /* @__PURE__ */ jsx(Tdata, { children: /* @__PURE__ */ jsx(
                "span",
                {
                  className: `px-2 py-1 rounded text-xs ${plan.approval_status === "approved" ? "bg-emerald-100 text-emerald-700" : plan.approval_status === "pending_approval" ? "bg-yellow-100 text-yellow-700" : plan.approval_status === "rejected" ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-700"}`,
                  children: plan.approval_status === "pending_approval" ? "Pending" : plan.approval_status.charAt(0).toUpperCase() + plan.approval_status.slice(1).replace("_", " ")
                }
              ) }),
              /* @__PURE__ */ jsx(Tdata, { children: formatDate(plan.created_at) }),
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
                    className: "w-44",
                    children: [
                      /* @__PURE__ */ jsx(DropdownMenuItem, { asChild: true, children: /* @__PURE__ */ jsx(
                        Link,
                        {
                          href: route(
                            "fees.plans.edit",
                            plan.id
                          ),
                          children: "Edit"
                        }
                      ) }),
                      /* @__PURE__ */ jsx(DropdownMenuItem, { asChild: true, children: /* @__PURE__ */ jsx(
                        Link,
                        {
                          href: route(
                            "fees.plans.items",
                            plan.id
                          ),
                          children: "Fee Items"
                        }
                      ) }),
                      plan.approval_status === "pending_approval" ? /* @__PURE__ */ jsxs(Fragment, { children: [
                        /* @__PURE__ */ jsx(
                          DropdownMenuItem,
                          {
                            onClick: () => handleApproval(
                              plan.id,
                              "approve"
                            ),
                            children: "Approve"
                          }
                        ),
                        /* @__PURE__ */ jsx(
                          DropdownMenuItem,
                          {
                            onClick: () => handleApproval(
                              plan.id,
                              "reject"
                            ),
                            children: "Reject"
                          }
                        )
                      ] }) : null,
                      /* @__PURE__ */ jsx(DropdownMenuSeparator, {}),
                      /* @__PURE__ */ jsx(
                        DropdownMenuItem,
                        {
                          variant: "destructive",
                          onClick: () => handleDelete(
                            plan.id
                          ),
                          children: "Delete"
                        }
                      )
                    ]
                  }
                )
              ] }) })
            ] }, plan.id)) : /* @__PURE__ */ jsx(Trow, { children: /* @__PURE__ */ jsx(
              Tdata,
              {
                colSpan: "6",
                className: "text-center py-6 text-zinc-500",
                children: "No fee plans found"
              }
            ) }) })
          ]
        }
      ) })
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
  FeePlans as default
};
