import { jsxs, jsx } from "react/jsx-runtime";
import { Head, Link, router } from "@inertiajs/react";
import { useState } from "react";
import { A as AuthenticatedLayout } from "./AuthenticatedLayout-pMoyBgPO.js";
import { D as DirectoryTable, T as Thead, a as THdata, b as TBody, c as Trow, d as Tdata } from "./Tdata-C86zXZO_.js";
import { f as formatDate } from "./date-CQXYOX-2.js";
import "lucide-react";
import "react-toastify";
function InvoiceIndex({ invoices }) {
  const [sortField, setSortField] = useState(invoices.sort || "created_at");
  const [sortDirection, setSortDirection] = useState(
    invoices.direction || "desc"
  );
  const [filters, setFilters] = useState({
    search: invoices.search || "",
    status: invoices.status || "",
    approval_status: invoices.approval_status || ""
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
    return sortDirection === "asc" ? "↑" : "↓";
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
  return /* @__PURE__ */ jsxs(AuthenticatedLayout, { children: [
    /* @__PURE__ */ jsx(Head, { title: "Student Invoices" }),
    /* @__PURE__ */ jsxs("div", { className: "mx-auto w-full space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center", children: [
        /* @__PURE__ */ jsx("h1", { className: "text-lg font-semibold text-zinc-700", children: "Student Invoices" }),
        /* @__PURE__ */ jsxs("div", { className: "flex gap-4", children: [
          /* @__PURE__ */ jsx(
            Link,
            {
              href: route("billing.bulk.operations"),
              className: "px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-800 transition",
              children: "Bulk Generate"
            }
          ),
          /* @__PURE__ */ jsx(
            Link,
            {
              href: route("billing.invoices.create"),
              className: "px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-800 transition",
              children: "+ New Invoice"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "bg-white border border-zinc-100 rounded-lg shadow-sm p-4", children: /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8", children: [
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "text",
            value: filters.search,
            onChange: (e) => updateFilter("search", e.target.value),
            placeholder: "Search invoices...",
            className: "border border-zinc-200 px-3 py-2 rounded-lg w-full md:w-72 focus:outline-none focus:ring-2 focus:ring-slate-300"
          }
        ),
        /* @__PURE__ */ jsxs(
          "select",
          {
            value: filters.status,
            onChange: (e) => updateFilter("status", e.target.value),
            className: "border border-zinc-200 px-3 py-2 rounded-lg",
            children: [
              /* @__PURE__ */ jsx("option", { value: "", children: "All Status" }),
              /* @__PURE__ */ jsx("option", { value: "issued", children: "Issued" }),
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
                status: "",
                approval_status: ""
              };
              setFilters(reset);
              router.get(route("billing.invoices.index"));
            },
            className: "px-4 py-2 bg-zinc-400 text-white rounded-lg hover:bg-zinc-500 transition",
            children: "Reset"
          }
        )
      ] }) }),
      /* @__PURE__ */ jsx("div", { className: "bg-white border border-zinc-100 rounded-lg shadow-sm overflow-hidden", children: /* @__PURE__ */ jsxs(
        DirectoryTable,
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
              /* @__PURE__ */ jsxs(
                THdata,
                {
                  onClick: () => handleSort("student.registration_number"),
                  className: "cursor-pointer",
                  children: [
                    "Student",
                    " ",
                    renderArrow("student.registration_number")
                  ]
                }
              ),
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
            /* @__PURE__ */ jsx(TBody, { children: invoices?.data?.length ? invoices.data.map((invoice) => /* @__PURE__ */ jsxs(Trow, { children: [
              /* @__PURE__ */ jsx(Tdata, { children: invoice.id }),
              /* @__PURE__ */ jsx(Tdata, { children: invoice.invoice_number }),
              /* @__PURE__ */ jsxs(Tdata, { children: [
                invoice.student?.id ?? "—",
                /* @__PURE__ */ jsx("br", {}),
                /* @__PURE__ */ jsx("span", { className: "text-sm text-gray-500", children: invoice.student?.registration_number ?? "" })
              ] }),
              /* @__PURE__ */ jsx(Tdata, { children: invoice.invoice_type === "default_fees" ? "Default Fees" : invoice.invoice_type === "penalty" ? "Penalty" : "Fees" }),
              /* @__PURE__ */ jsx(Tdata, { children: invoice.enrollment?.academic_session?.id ?? invoice.academic_session_id ?? "—" }),
              /* @__PURE__ */ jsx(Tdata, { children: /* @__PURE__ */ jsx(
                "span",
                {
                  className: `px-2 py-1 rounded text-xs ${invoice.status === "paid" ? "bg-emerald-100 text-emerald-700" : invoice.status === "overdue" ? "bg-red-100 text-red-700" : invoice.status === "issued" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-700"}`,
                  children: invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)
                }
              ) }),
              /* @__PURE__ */ jsxs(Tdata, { children: [
                "$",
                invoice.amount_due
              ] }),
              /* @__PURE__ */ jsxs(Tdata, { children: [
                "$",
                invoice.balance_due
              ] }),
              /* @__PURE__ */ jsx(Tdata, { children: /* @__PURE__ */ jsx(
                "span",
                {
                  className: `px-2 py-1 rounded text-xs ${invoice.approval_status === "approved" ? "bg-emerald-100 text-emerald-700" : invoice.approval_status === "pending_approval" ? "bg-yellow-100 text-yellow-700" : invoice.approval_status === "rejected" ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-700"}`,
                  children: invoice.approval_status === "pending_approval" ? "Pending" : invoice.approval_status.charAt(0).toUpperCase() + invoice.approval_status.slice(1).replace("_", " ")
                }
              ) }),
              /* @__PURE__ */ jsx(Tdata, { children: formatDate(invoice.due_date) }),
              /* @__PURE__ */ jsx(Tdata, { children: /* @__PURE__ */ jsxs("div", { className: "flex gap-2 justify-center", children: [
                /* @__PURE__ */ jsx(
                  Link,
                  {
                    href: route(
                      "billing.invoices.show",
                      invoice.id
                    ),
                    className: "text-emerald-600 hover:underline text-sm",
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
                      className: "text-green-600 hover:underline text-sm",
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
                      className: "text-red-600 hover:underline text-sm",
                      children: "Reject"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsx(
                  Link,
                  {
                    href: route(
                      "billing.payments.create",
                      invoice.id
                    ),
                    className: "text-blue-600 hover:underline text-sm",
                    children: "Record Payment"
                  }
                )
              ] }) })
            ] }, invoice.id)) : /* @__PURE__ */ jsx(Trow, { children: /* @__PURE__ */ jsx(
              Tdata,
              {
                colSpan: "8",
                className: "text-center py-6 text-zinc-500",
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
