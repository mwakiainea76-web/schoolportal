import { jsxs, Fragment, jsx } from "react/jsx-runtime";
import { Head, Link, router } from "@inertiajs/react";
import { useState } from "react";
import { T as Table, a as Thead, b as THdata, c as Tbody, d as Trow, e as Tdata } from "./Tdata-Lxy5yAUM.js";
import { f as formatDate } from "./date-CQXYOX-2.js";
const formatCurrency = (amount) => `Ksh ${new Intl.NumberFormat("en-KE", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2
}).format(Number(amount || 0))}`;
function InvoiceIndex({
  invoices,
  filters: initialFilters = {}
}) {
  const [sortField, setSortField] = useState(invoices.sort || "created_at");
  const [sortDirection, setSortDirection] = useState(
    invoices.direction || "desc"
  );
  const [filters, setFilters] = useState({
    search: initialFilters.search || "",
    status: initialFilters.status || "",
    approval_status: initialFilters.approval_status || ""
  });
  const applyFilters = (extra = {}) => {
    router.get(
      route("billing.invoices.index"),
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
    return sortDirection === "asc" ? "^" : "v";
  };
  const handleApproval = (id, action) => {
    const actionText = action === "approve" ? "approve" : "reject";
    const confirmMessage = `Are you sure you want to ${actionText} this invoice write-off?`;
    if (!confirm(confirmMessage)) return;
    router.post(
      route("billing.invoices.approval", { invoice: id, action }),
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
    /* @__PURE__ */ jsx(Head, { title: "Student Invoices" }),
    /* @__PURE__ */ jsxs("div", { className: "mx-auto w-full space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsx("h1", { className: "text-lg font-semibold text-zinc-700", children: "Student Invoices" }),
        /* @__PURE__ */ jsxs("div", { className: "flex gap-4", children: [
          /* @__PURE__ */ jsx(
            Link,
            {
              href: route("billing.manual.index"),
              className: "rounded-lg bg-emerald-600 px-4 py-2 text-white transition hover:bg-emerald-800",
              children: "Manual Billing"
            }
          ),
          /* @__PURE__ */ jsx(
            Link,
            {
              href: route("billing.ledger.index"),
              className: "rounded-lg bg-slate-600 px-4 py-2 text-white transition hover:bg-slate-800",
              children: "Financial Ledger"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "rounded-lg border border-zinc-100 bg-white p-4 shadow-sm", children: /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-4", children: [
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "text",
            value: filters.search,
            onChange: (e) => updateFilter("search", e.target.value),
            placeholder: "Search invoices...",
            className: "w-full rounded-lg border border-zinc-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-300 md:w-72"
          }
        ),
        /* @__PURE__ */ jsxs(
          "select",
          {
            value: filters.status,
            onChange: (e) => updateFilter("status", e.target.value),
            className: "rounded-lg border border-zinc-200 px-3 py-2",
            children: [
              /* @__PURE__ */ jsx("option", { value: "", children: "All Status" }),
              /* @__PURE__ */ jsx("option", { value: "issued", children: "Issued" }),
              /* @__PURE__ */ jsx("option", { value: "partial", children: "Partial" }),
              /* @__PURE__ */ jsx("option", { value: "paid", children: "Paid" }),
              /* @__PURE__ */ jsx("option", { value: "overdue", children: "Overdue" }),
              /* @__PURE__ */ jsx("option", { value: "cancelled", children: "Cancelled" })
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          "select",
          {
            value: filters.approval_status,
            onChange: (e) => updateFilter("approval_status", e.target.value),
            className: "rounded-lg border border-zinc-200 px-3 py-2",
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
                status: "",
                approval_status: ""
              };
              setFilters(reset);
              router.get(route("billing.invoices.index"));
            },
            className: "rounded-lg bg-zinc-400 px-4 py-2 text-white transition hover:bg-zinc-500",
            children: "Reset"
          }
        )
      ] }) }),
      /* @__PURE__ */ jsx("div", { className: "overflow-hidden rounded-lg border border-zinc-100 bg-white shadow-sm", children: /* @__PURE__ */ jsxs(
        Table,
        {
          pagination: invoices,
          sortField,
          sortDirection,
          children: [
            /* @__PURE__ */ jsxs(Thead, { children: [
              /* @__PURE__ */ jsx(THdata, { children: "ID" }),
              /* @__PURE__ */ jsxs(
                THdata,
                {
                  onClick: () => handleSort("invoice_number"),
                  className: "cursor-pointer",
                  children: [
                    "Invoice # ",
                    renderArrow("invoice_number")
                  ]
                }
              ),
              /* @__PURE__ */ jsx(THdata, { className: "cursor-pointer", children: "Student" }),
              /* @__PURE__ */ jsx(THdata, { children: "Type" }),
              /* @__PURE__ */ jsx(THdata, { children: "Session" }),
              /* @__PURE__ */ jsxs(
                THdata,
                {
                  onClick: () => handleSort("status"),
                  className: "cursor-pointer",
                  children: [
                    "Status ",
                    renderArrow("status")
                  ]
                }
              ),
              /* @__PURE__ */ jsxs(
                THdata,
                {
                  onClick: () => handleSort("amount_due"),
                  className: "cursor-pointer",
                  children: [
                    "Amount Due ",
                    renderArrow("amount_due")
                  ]
                }
              ),
              /* @__PURE__ */ jsxs(
                THdata,
                {
                  onClick: () => handleSort("balance_due"),
                  className: "cursor-pointer",
                  children: [
                    "Balance ",
                    renderArrow("balance_due")
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
                  onClick: () => handleSort("due_date"),
                  className: "cursor-pointer",
                  children: [
                    "Due Date ",
                    renderArrow("due_date")
                  ]
                }
              ),
              /* @__PURE__ */ jsx(THdata, { children: "Actions" })
            ] }),
            /* @__PURE__ */ jsx(Tbody, { children: invoices?.data?.length ? invoices.data.map((invoice) => {
              const studentName = `${invoice.student?.user?.first_name ?? ""} ${invoice.student?.user?.last_name ?? ""}`.trim();
              const sessionName = invoice.enrollment?.academic_session?.display_name ?? invoice.academic_session?.display_name ?? invoice.academic_session_id ?? "-";
              return /* @__PURE__ */ jsxs(Trow, { children: [
                /* @__PURE__ */ jsx(Tdata, { children: invoice.id }),
                /* @__PURE__ */ jsx(Tdata, { children: invoice.invoice_number }),
                /* @__PURE__ */ jsxs(Tdata, { children: [
                  studentName || "-",
                  /* @__PURE__ */ jsx("br", {}),
                  /* @__PURE__ */ jsx("span", { className: "text-sm text-gray-500", children: invoice.student?.admission_number ?? "" })
                ] }),
                /* @__PURE__ */ jsx(Tdata, { children: invoice.display_type_label ?? "STANDARD INVOICE" }),
                /* @__PURE__ */ jsx(Tdata, { children: sessionName }),
                /* @__PURE__ */ jsx(Tdata, { children: /* @__PURE__ */ jsx(
                  "span",
                  {
                    className: `rounded px-2 py-1 text-xs ${invoice.status === "paid" ? "bg-emerald-100 text-emerald-700" : invoice.status === "overdue" ? "bg-red-100 text-red-700" : invoice.status === "issued" ? "bg-blue-100 text-blue-700" : invoice.status === "partial" ? "bg-amber-100 text-amber-700" : "bg-gray-100 text-gray-700"}`,
                    children: invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)
                  }
                ) }),
                /* @__PURE__ */ jsx(Tdata, { children: formatCurrency(
                  invoice.amount_due
                ) }),
                /* @__PURE__ */ jsx(Tdata, { children: formatCurrency(
                  invoice.balance_due
                ) }),
                /* @__PURE__ */ jsx(Tdata, { children: /* @__PURE__ */ jsx(
                  "span",
                  {
                    className: `rounded px-2 py-1 text-xs ${invoice.approval_status === "approved" ? "bg-emerald-100 text-emerald-700" : invoice.approval_status === "pending_approval" ? "bg-yellow-100 text-yellow-700" : invoice.approval_status === "rejected" ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-700"}`,
                    children: invoice.approval_status === "pending_approval" ? "Pending" : invoice.approval_status.charAt(0).toUpperCase() + invoice.approval_status.slice(1).replace(
                      "_",
                      " "
                    )
                  }
                ) }),
                /* @__PURE__ */ jsx(Tdata, { children: formatDate(invoice.due_date) }),
                /* @__PURE__ */ jsx(Tdata, { children: /* @__PURE__ */ jsxs("div", { className: "flex justify-center gap-2", children: [
                  /* @__PURE__ */ jsx(
                    Link,
                    {
                      href: route(
                        "billing.invoices.show",
                        invoice.id
                      ),
                      className: "text-sm text-emerald-600 hover:underline",
                      children: "View"
                    }
                  ),
                  invoice.approval_status === "pending_approval" && /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
                    /* @__PURE__ */ jsx(
                      "button",
                      {
                        onClick: () => handleApproval(
                          invoice.id,
                          "approve"
                        ),
                        className: "text-sm text-green-600 hover:underline",
                        children: "Approve"
                      }
                    ),
                    /* @__PURE__ */ jsx(
                      "button",
                      {
                        onClick: () => handleApproval(
                          invoice.id,
                          "reject"
                        ),
                        className: "text-sm text-red-600 hover:underline",
                        children: "Reject"
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsx(
                    Link,
                    {
                      href: route(
                        "billing.manual.index",
                        {
                          admission_number: invoice.student?.admission_number
                        }
                      ),
                      className: "text-sm text-blue-600 hover:underline",
                      children: "Manual actions"
                    }
                  )
                ] }) })
              ] }, invoice.id);
            }) : /* @__PURE__ */ jsx(Trow, { children: /* @__PURE__ */ jsx(
              Tdata,
              {
                colSpan: "11",
                className: "py-6 text-center text-zinc-500",
                children: "No invoices found"
              }
            ) }) })
          ]
        }
      ) })
    ] })
  ] });
}
export {
  InvoiceIndex as default
};
