import { jsxs, Fragment, jsx } from "react/jsx-runtime";
import { Head, Link, router } from "@inertiajs/react";
import { MoreHorizontalIcon } from "lucide-react";
import { useState } from "react";
import { D as DropdownMenu, a as DropdownMenuTrigger, B as Button, b as DropdownMenuContent, c as DropdownMenuItem } from "./dropdown-menu-CDZTbnZi.js";
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
const currency = (amount) => `Ksh ${new Intl.NumberFormat("en-KE", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2
}).format(Number(amount || 0))}`;
function Index({ allocations, filters, hostels, sessions }) {
  const [search, setSearch] = useState(filters.search || "");
  const submit = (e) => {
    e.preventDefault();
    router.get(
      route("hostel-allocations.index"),
      {
        search,
        status: filters.status,
        hostel_id: filters.hostel_id,
        academic_session_id: filters.academic_session_id
      },
      { preserveState: true, replace: true }
    );
  };
  const updateFilter = (field, value) => {
    router.get(
      route("hostel-allocations.index"),
      {
        search,
        ...filters,
        [field]: value
      },
      { preserveState: true, replace: true }
    );
  };
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(Head, { title: "Hostel Allocations" }),
    /* @__PURE__ */ jsxs("div", { className: "mx-auto w-full space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700", children: [
      /* @__PURE__ */ jsx(
        "form",
        {
          className: "rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm",
          onSubmit: submit,
          children: /* @__PURE__ */ jsxs("div", { className: "grid gap-4 md:grid-cols-2 xl:grid-cols-[minmax(0,2fr)_180px_220px_200px_140px] xl:items-end", children: [
            /* @__PURE__ */ jsxs("label", { className: "block", children: [
              /* @__PURE__ */ jsx("span", { className: "mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500", children: "Search" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "text",
                  value: search,
                  onChange: (e) => setSearch(e.target.value),
                  placeholder: "Search student, hostel, room, or bed...",
                  className: "w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-400"
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("label", { className: "block", children: [
              /* @__PURE__ */ jsx("span", { className: "mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500", children: "Status" }),
              /* @__PURE__ */ jsxs(
                "select",
                {
                  value: filters.status,
                  onChange: (e) => updateFilter("status", e.target.value),
                  className: "w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-400",
                  children: [
                    /* @__PURE__ */ jsx("option", { value: "", children: "All statuses" }),
                    /* @__PURE__ */ jsx("option", { value: "active", children: "Active" }),
                    /* @__PURE__ */ jsx("option", { value: "vacated", children: "Vacated" })
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("label", { className: "block", children: [
              /* @__PURE__ */ jsx("span", { className: "mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500", children: "Hostel" }),
              /* @__PURE__ */ jsxs(
                "select",
                {
                  value: filters.hostel_id,
                  onChange: (e) => updateFilter("hostel_id", e.target.value),
                  className: "w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-400",
                  children: [
                    /* @__PURE__ */ jsx("option", { value: "", children: "All hostels" }),
                    hostels.map((hostel) => /* @__PURE__ */ jsx("option", { value: hostel.id, children: hostel.name }, hostel.id))
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("label", { className: "block", children: [
              /* @__PURE__ */ jsx("span", { className: "mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500", children: "Session" }),
              /* @__PURE__ */ jsxs(
                "select",
                {
                  value: filters.academic_session_id,
                  onChange: (e) => updateFilter("academic_session_id", e.target.value),
                  className: "w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-400",
                  children: [
                    /* @__PURE__ */ jsx("option", { value: "", children: "All sessions" }),
                    sessions.map((session) => /* @__PURE__ */ jsx("option", { value: session.id, children: session.name }, session.id))
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsx(
              "button",
              {
                className: "rounded-xl bg-emerald-600 px-4 py-3 text-white hover:bg-emerald-700",
                type: "submit",
                children: "Search"
              }
            )
          ] })
        }
      ),
      /* @__PURE__ */ jsxs(Table, { pagination: allocations, children: [
        /* @__PURE__ */ jsxs(Thead, { children: [
          /* @__PURE__ */ jsx(THdata, { children: "Student" }),
          /* @__PURE__ */ jsx(THdata, { children: "Session" }),
          /* @__PURE__ */ jsx(THdata, { children: "Hostel" }),
          /* @__PURE__ */ jsx(THdata, { children: "Room / Bed" }),
          /* @__PURE__ */ jsx(THdata, { children: "Fee" }),
          /* @__PURE__ */ jsx(THdata, { children: "Invoice" }),
          /* @__PURE__ */ jsx(THdata, { children: "Status" }),
          /* @__PURE__ */ jsx(THdata, { children: "Allocated On" }),
          /* @__PURE__ */ jsx(THdata, { children: "Actions" })
        ] }),
        /* @__PURE__ */ jsx(Tbody, { children: allocations?.data?.length ? allocations.data.map((allocation) => /* @__PURE__ */ jsxs(Trow, { children: [
          /* @__PURE__ */ jsxs(Tdata, { children: [
            allocation.student_name,
            /* @__PURE__ */ jsx("div", { className: "mt-1 text-xs text-zinc-500", children: allocation.admission_number })
          ] }),
          /* @__PURE__ */ jsx(Tdata, { children: allocation.session_name }),
          /* @__PURE__ */ jsx(Tdata, { children: allocation.hostel_name }),
          /* @__PURE__ */ jsxs(Tdata, { children: [
            /* @__PURE__ */ jsx("div", { children: allocation.room_name }),
            /* @__PURE__ */ jsx("div", { className: "mt-1 text-xs text-zinc-500", children: allocation.bed_label })
          ] }),
          /* @__PURE__ */ jsx(Tdata, { children: currency(allocation.hostel_fee_amount) }),
          /* @__PURE__ */ jsxs(Tdata, { children: [
            allocation.invoice_number || "Pending",
            allocation.invoice_balance_due !== null ? /* @__PURE__ */ jsxs("div", { className: "mt-1 text-xs text-zinc-500", children: [
              "Balance ",
              currency(allocation.invoice_balance_due)
            ] }) : null
          ] }),
          /* @__PURE__ */ jsx(Tdata, { children: /* @__PURE__ */ jsx("span", { className: `rounded-full px-3 py-1 text-xs font-medium ${allocation.status === "active" ? "bg-emerald-50 text-emerald-700" : "bg-zinc-100 text-zinc-600"}`, children: allocation.status }) }),
          /* @__PURE__ */ jsx(Tdata, { children: formatDate(allocation.allocated_on) }),
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
            /* @__PURE__ */ jsx(
              DropdownMenuContent,
              {
                side: "left",
                align: "start",
                sideOffset: 8,
                className: "w-40",
                children: /* @__PURE__ */ jsx(DropdownMenuItem, { asChild: true, children: /* @__PURE__ */ jsx(
                  Link,
                  {
                    href: route(
                      "hostel-allocations.edit",
                      allocation.id
                    ),
                    children: "Edit"
                  }
                ) })
              }
            )
          ] }) })
        ] }, allocation.id)) : /* @__PURE__ */ jsx(Trow, { children: /* @__PURE__ */ jsx(Tdata, { colSpan: "9", className: "py-8 text-center", children: "No hostel allocations found." }) }) })
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
