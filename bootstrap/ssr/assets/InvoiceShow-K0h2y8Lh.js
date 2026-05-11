import { jsxs, jsx } from "react/jsx-runtime";
import "react";
import { Head, Link } from "@inertiajs/react";
import { A as AuthenticatedLayout } from "./AuthenticatedLayout-pMoyBgPO.js";
import { f as formatDate } from "./date-CQXYOX-2.js";
import "lucide-react";
import "react-toastify";
function Show({ invoice }) {
  const student = invoice.student;
  const enrollment = invoice.enrollment;
  return /* @__PURE__ */ jsxs(AuthenticatedLayout, { children: [
    /* @__PURE__ */ jsx(Head, { title: `Invoice ${invoice.invoice_number}` }),
    /* @__PURE__ */ jsxs("div", { className: "max-w-6xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs("h1", { className: "text-lg font-semibold text-zinc-700", children: [
            "Invoice #",
            invoice.invoice_number
          ] }),
          /* @__PURE__ */ jsxs("p", { className: "text-sm text-zinc-500", children: [
            "Created on ",
            formatDate(invoice.created_at)
          ] })
        ] }),
        /* @__PURE__ */ jsx(
          Link,
          {
            href: route("billing.invoices.index"),
            className: "px-4 py-2 bg-slate-500 text-white rounded hover:bg-slate-700",
            children: "Back"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "bg-white border border-zinc-100 rounded-lg shadow-sm p-6 grid md:grid-cols-3 gap-6", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h3", { className: "text-sm text-zinc-500", children: "Student" }),
          /* @__PURE__ */ jsx("p", { className: "font-medium", children: student?.name }),
          /* @__PURE__ */ jsxs("p", { className: "text-sm text-zinc-500", children: [
            "ID: ",
            student?.id,
            " • ",
            student?.registration_number
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h3", { className: "text-sm text-zinc-500", children: "Type" }),
          /* @__PURE__ */ jsx("p", { children: invoice.invoice_type === "default_fees" ? "Default Fees" : invoice.invoice_type === "penalty" ? "Penalty" : "Fees" })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h3", { className: "text-sm text-zinc-500", children: "Session" }),
          /* @__PURE__ */ jsx("p", { children: invoice.enrollment?.academic_session?.name ?? invoice.academic_session_id ?? "—" })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h3", { className: "text-sm text-zinc-500", children: "Course" }),
          /* @__PURE__ */ jsx("p", { children: enrollment?.course_curriculum?.course?.name ?? "—" })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h3", { className: "text-sm text-zinc-500", children: "Issue Date" }),
          /* @__PURE__ */ jsx("p", { children: formatDate(invoice.issue_date) })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h3", { className: "text-sm text-zinc-500", children: "Due Date" }),
          /* @__PURE__ */ jsx("p", { children: formatDate(invoice.due_date) })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h3", { className: "text-sm text-zinc-500", children: "Status" }),
          /* @__PURE__ */ jsx(
            "span",
            {
              className: `px-2 py-1 rounded text-xs ${invoice.status === "paid" ? "bg-emerald-100 text-emerald-700" : invoice.status === "overdue" ? "bg-red-100 text-red-700" : "bg-blue-100 text-blue-700"}`,
              children: invoice.status
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "bg-white border border-zinc-100 rounded-lg shadow-sm p-6 grid md:grid-cols-3 gap-6", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h3", { className: "text-sm text-zinc-500", children: "Amount Due" }),
          /* @__PURE__ */ jsxs("p", { className: "text-lg font-semibold", children: [
            "$",
            invoice.amount_due
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h3", { className: "text-sm text-zinc-500", children: "Paid" }),
          /* @__PURE__ */ jsxs("p", { className: "text-lg font-semibold text-emerald-600", children: [
            "$",
            invoice.amount_due - invoice.balance_due
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h3", { className: "text-sm text-zinc-500", children: "Balance" }),
          /* @__PURE__ */ jsxs("p", { className: "text-lg font-semibold text-red-600", children: [
            "$",
            invoice.balance_due
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "bg-white border border-zinc-100 rounded-lg shadow-sm", children: [
        /* @__PURE__ */ jsx("div", { className: "px-6 py-3 border-b text-sm font-medium", children: "Invoice Items" }),
        /* @__PURE__ */ jsxs("table", { className: "w-full text-sm", children: [
          /* @__PURE__ */ jsx("thead", { className: "bg-zinc-50", children: /* @__PURE__ */ jsxs("tr", { children: [
            /* @__PURE__ */ jsx("th", { className: "px-4 py-2 text-left", children: "Description" }),
            /* @__PURE__ */ jsx("th", { className: "px-4 py-2 text-right", children: "Amount" })
          ] }) }),
          /* @__PURE__ */ jsx("tbody", { children: invoice.invoice_items?.length ? invoice.invoice_items.map((item) => /* @__PURE__ */ jsxs("tr", { className: "border-t", children: [
            /* @__PURE__ */ jsx("td", { className: "px-4 py-2", children: item.description }),
            /* @__PURE__ */ jsxs("td", { className: "px-4 py-2 text-right", children: [
              "$",
              item.amount
            ] })
          ] }, item.id)) : /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx(
            "td",
            {
              colSpan: "2",
              className: "text-center py-4 text-zinc-500",
              children: "No items"
            }
          ) }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "bg-white border border-zinc-100 rounded-lg shadow-sm", children: [
        /* @__PURE__ */ jsx("div", { className: "px-6 py-3 border-b text-sm font-medium", children: "Payments" }),
        /* @__PURE__ */ jsxs("table", { className: "w-full text-sm", children: [
          /* @__PURE__ */ jsx("thead", { className: "bg-zinc-50", children: /* @__PURE__ */ jsxs("tr", { children: [
            /* @__PURE__ */ jsx("th", { className: "px-4 py-2 text-left", children: "Date" }),
            /* @__PURE__ */ jsx("th", { className: "px-4 py-2 text-right", children: "Amount" })
          ] }) }),
          /* @__PURE__ */ jsx("tbody", { children: invoice.payments?.length ? invoice.payments.map((p) => /* @__PURE__ */ jsxs("tr", { className: "border-t", children: [
            /* @__PURE__ */ jsx("td", { className: "px-4 py-2", children: formatDate(p.created_at) }),
            /* @__PURE__ */ jsxs("td", { className: "px-4 py-2 text-right text-emerald-600", children: [
              "$",
              p.amount
            ] })
          ] }, p.id)) : /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx(
            "td",
            {
              colSpan: "2",
              className: "text-center py-4 text-zinc-500",
              children: "No payments recorded"
            }
          ) }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "bg-white border border-zinc-100 rounded-lg shadow-sm", children: [
        /* @__PURE__ */ jsx("div", { className: "px-6 py-3 border-b text-sm font-medium", children: "Adjustments" }),
        /* @__PURE__ */ jsxs("table", { className: "w-full text-sm", children: [
          /* @__PURE__ */ jsx("thead", { className: "bg-zinc-50", children: /* @__PURE__ */ jsxs("tr", { children: [
            /* @__PURE__ */ jsx("th", { className: "px-4 py-2 text-left", children: "Type" }),
            /* @__PURE__ */ jsx("th", { className: "px-4 py-2 text-right", children: "Amount" })
          ] }) }),
          /* @__PURE__ */ jsx("tbody", { children: invoice.adjustments?.length ? invoice.adjustments.map((a) => /* @__PURE__ */ jsxs("tr", { className: "border-t", children: [
            /* @__PURE__ */ jsx("td", { className: "px-4 py-2 capitalize", children: a.type }),
            /* @__PURE__ */ jsxs("td", { className: "px-4 py-2 text-right text-blue-600", children: [
              "-$",
              a.amount
            ] })
          ] }, a.id)) : /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx(
            "td",
            {
              colSpan: "2",
              className: "text-center py-4 text-zinc-500",
              children: "No adjustments"
            }
          ) }) })
        ] })
      ] })
    ] })
  ] });
}
export {
  Show as default
};
