import { jsxs, jsx } from "react/jsx-runtime";
import { Head, Link } from "@inertiajs/react";
import { A as AuthenticatedLayout } from "../app.js";
import { f as formatDate } from "./date-CQXYOX-2.js";
import { ArrowLeft, Printer, BookOpen, FileText, CalendarClock, Receipt } from "lucide-react";
import "axios";
import "react";
import "react-toastify";
import "react-dom/client";
const currency = (amount) => `Ksh ${new Intl.NumberFormat("en-KE", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2
}).format(Number(amount || 0))}`;
const statusClasses = {
  issued: "bg-amber-100 text-amber-700",
  partial: "bg-sky-100 text-sky-700",
  paid: "bg-emerald-100 text-emerald-700",
  draft: "bg-slate-100 text-slate-600"
};
function Show({ statement }) {
  return /* @__PURE__ */ jsxs(AuthenticatedLayout, { children: [
    /* @__PURE__ */ jsx(Head, { title: `Fee Statement ${statement.statement_reference}` }),
    /* @__PURE__ */ jsxs("div", { className: "mx-auto w-full max-w-7xl space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between print:hidden", children: [
        /* @__PURE__ */ jsxs(
          Link,
          {
            href: route("student.fee-statements.index"),
            className: "inline-flex items-center gap-2 text-sm font-medium text-emerald-700 transition hover:text-emerald-800",
            children: [
              /* @__PURE__ */ jsx(ArrowLeft, { className: "h-4 w-4" }),
              "Back to statements"
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          "button",
          {
            type: "button",
            onClick: () => window.print(),
            className: "inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700",
            children: [
              /* @__PURE__ */ jsx(Printer, { className: "h-4 w-4" }),
              "Print statement"
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsx("section", { className: "overflow-hidden rounded-[2rem] bg-[radial-gradient(circle_at_top_left,_rgba(52,211,153,0.24),_transparent_25%),linear-gradient(135deg,#102542_0%,#1b263b_55%,#243b53_100%)] px-6 py-8 text-white shadow-xl print:rounded-none print:bg-white print:px-0 print:py-0 print:text-zinc-900 print:shadow-none sm:px-8", children: /* @__PURE__ */ jsxs("div", { className: "grid gap-8 lg:grid-cols-[1.15fr,0.85fr] lg:items-start", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("p", { className: "text-sm font-semibold uppercase tracking-[0.22em] text-emerald-300 print:text-emerald-700", children: "Official Fee Statement" }),
          /* @__PURE__ */ jsx("h1", { className: "mt-3 text-3xl font-bold tracking-tight sm:text-4xl", children: statement.school_name }),
          /* @__PURE__ */ jsx("p", { className: "mt-3 max-w-2xl text-sm leading-6 text-slate-300 print:text-zinc-500", children: "Consolidated statement of charges, credits, payments, and resulting session balance." }),
          /* @__PURE__ */ jsxs("div", { className: "mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4", children: [
            /* @__PURE__ */ jsx(
              ProfileChip,
              {
                icon: BookOpen,
                label: "Student",
                value: statement.student.name
              }
            ),
            /* @__PURE__ */ jsx(
              ProfileChip,
              {
                icon: FileText,
                label: "Admission Number",
                value: statement.student.admission_number
              }
            ),
            /* @__PURE__ */ jsx(
              ProfileChip,
              {
                icon: CalendarClock,
                label: "Session",
                value: statement.session
              }
            ),
            /* @__PURE__ */ jsx(
              ProfileChip,
              {
                icon: Receipt,
                label: "Statement No.",
                value: statement.statement_reference
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid gap-3 rounded-[1.5rem] border border-white/10 bg-white/10 p-5 backdrop-blur print:border-zinc-200 print:bg-zinc-50", children: [
          /* @__PURE__ */ jsx(
            MetaPair,
            {
              label: "Generated on",
              value: formatDate(statement.generated_on)
            }
          ),
          /* @__PURE__ */ jsx(
            MetaPair,
            {
              label: "Issue date",
              value: formatDate(statement.issue_date)
            }
          ),
          /* @__PURE__ */ jsx(
            MetaPair,
            {
              label: "Due date",
              value: formatDate(statement.due_date)
            }
          ),
          /* @__PURE__ */ jsxs("div", { className: "pt-2", children: [
            /* @__PURE__ */ jsx("p", { className: "text-xs uppercase tracking-[0.15em] text-slate-300 print:text-zinc-500", children: "Status" }),
            /* @__PURE__ */ jsx(
              "span",
              {
                className: `mt-2 inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize ${statusClasses[statement.status] ?? "bg-slate-100 text-slate-600"}`,
                children: statement.status
              }
            )
          ] })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxs("section", { className: "rounded-[1.75rem] border border-zinc-100 bg-white p-6 shadow-sm", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-lg font-semibold text-zinc-900", children: "Charge Breakdown" }),
        /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-zinc-500", children: "Individual billed items contributing to the session total." }),
        /* @__PURE__ */ jsx("div", { className: "mt-5 overflow-hidden rounded-2xl border border-zinc-100", children: /* @__PURE__ */ jsxs("table", { className: "min-w-full divide-y divide-zinc-100", children: [
          /* @__PURE__ */ jsx("thead", { className: "bg-zinc-50", children: /* @__PURE__ */ jsxs("tr", { className: "text-left text-xs font-semibold uppercase tracking-wide text-zinc-500", children: [
            /* @__PURE__ */ jsx("th", { className: "px-5 py-4", children: "Description" }),
            /* @__PURE__ */ jsx("th", { className: "px-5 py-4 text-right", children: "Qty" }),
            /* @__PURE__ */ jsx("th", { className: "px-5 py-4 text-right", children: "Unit Amount" }),
            /* @__PURE__ */ jsx("th", { className: "px-5 py-4 text-right", children: "Total" })
          ] }) }),
          /* @__PURE__ */ jsx("tbody", { className: "divide-y divide-zinc-100 bg-white", children: statement.items?.length ? statement.items.map((item, index) => /* @__PURE__ */ jsxs("tr", { children: [
            /* @__PURE__ */ jsx("td", { className: "px-5 py-4 text-sm font-medium text-zinc-900", children: item.description }),
            /* @__PURE__ */ jsx("td", { className: "px-5 py-4 text-right text-sm text-zinc-700", children: item.quantity }),
            /* @__PURE__ */ jsx("td", { className: "px-5 py-4 text-right text-sm text-zinc-700", children: currency(item.unit_amount) }),
            /* @__PURE__ */ jsx("td", { className: "px-5 py-4 text-right text-sm font-semibold text-zinc-900", children: currency(item.total_amount) })
          ] }, `${item.description}-${index}`)) : /* @__PURE__ */ jsx(
            EmptyRow,
            {
              colSpan: "4",
              text: "No charge lines are attached to this statement yet."
            }
          ) })
        ] }) })
      ] }),
      /* @__PURE__ */ jsxs("section", { className: "rounded-[1.75rem] border border-zinc-100 bg-white p-6 shadow-sm", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-lg font-semibold text-zinc-900", children: "Ledger Activity" }),
        /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-zinc-500", children: "Chronological movement of charges, credits, and balance." }),
        /* @__PURE__ */ jsx("div", { className: "mt-5 overflow-hidden rounded-2xl border border-zinc-100", children: /* @__PURE__ */ jsxs("table", { className: "min-w-full divide-y divide-zinc-100", children: [
          /* @__PURE__ */ jsx("thead", { className: "bg-zinc-50", children: /* @__PURE__ */ jsxs("tr", { className: "text-left text-xs font-semibold uppercase tracking-wide text-zinc-500", children: [
            /* @__PURE__ */ jsx("th", { className: "px-5 py-4", children: "Date" }),
            /* @__PURE__ */ jsx("th", { className: "px-5 py-4", children: "Reference" }),
            /* @__PURE__ */ jsx("th", { className: "px-5 py-4", children: "Description" }),
            /* @__PURE__ */ jsx("th", { className: "px-5 py-4", children: "Type" }),
            /* @__PURE__ */ jsx("th", { className: "px-5 py-4 text-right", children: "Debit" }),
            /* @__PURE__ */ jsx("th", { className: "px-5 py-4 text-right", children: "Credit" }),
            /* @__PURE__ */ jsx("th", { className: "px-5 py-4 text-right", children: "Balance" })
          ] }) }),
          /* @__PURE__ */ jsx("tbody", { className: "divide-y divide-zinc-100 bg-white", children: statement.entries?.length ? statement.entries.map((entry) => /* @__PURE__ */ jsxs("tr", { children: [
            /* @__PURE__ */ jsx("td", { className: "px-5 py-4 text-sm text-zinc-700", children: formatDate(entry.date) }),
            /* @__PURE__ */ jsx("td", { className: "px-5 py-4 text-sm font-medium text-zinc-900", children: entry.reference ?? "-" }),
            /* @__PURE__ */ jsx("td", { className: "px-5 py-4 text-sm text-zinc-700", children: entry.description ?? "-" }),
            /* @__PURE__ */ jsx("td", { className: "px-5 py-4", children: /* @__PURE__ */ jsx("span", { className: "rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold capitalize text-slate-700", children: entry.type }) }),
            /* @__PURE__ */ jsx("td", { className: "px-5 py-4 text-right text-sm text-rose-600", children: entry.debit ? currency(entry.debit) : "-" }),
            /* @__PURE__ */ jsx("td", { className: "px-5 py-4 text-right text-sm text-emerald-700", children: entry.credit ? currency(entry.credit) : "-" }),
            /* @__PURE__ */ jsx("td", { className: "px-5 py-4 text-right text-sm font-semibold text-zinc-900", children: currency(entry.running_balance) })
          ] }, entry.id)) : /* @__PURE__ */ jsx(
            EmptyRow,
            {
              colSpan: "7",
              text: "No ledger activity found for this statement."
            }
          ) })
        ] }) })
      ] })
    ] })
  ] });
}
function ProfileChip({ icon: Icon, label, value }) {
  return /* @__PURE__ */ jsx("div", { className: "rounded-2xl border border-white/10 bg-white/10 px-4 py-3 print:border-zinc-200 print:bg-zinc-50", children: /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
    /* @__PURE__ */ jsx("div", { className: "inline-flex rounded-xl bg-white/10 p-2 text-emerald-200 print:bg-emerald-50 print:text-emerald-700", children: /* @__PURE__ */ jsx(Icon, { className: "h-4 w-4" }) }),
    /* @__PURE__ */ jsx("span", { className: "block text-xs uppercase tracking-[0.14em] text-slate-300 print:text-zinc-500", children: label }),
    /* @__PURE__ */ jsx("span", { className: "block text-sm font-semibold text-white print:text-zinc-900", children: value || "-" })
  ] }) });
}
function MetaPair({ label, value }) {
  return /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-4 text-sm", children: [
    /* @__PURE__ */ jsx("span", { className: "text-slate-300 print:text-zinc-500", children: label }),
    /* @__PURE__ */ jsx("span", { className: "font-semibold text-white print:text-zinc-900", children: value })
  ] });
}
function EmptyRow({ colSpan, text }) {
  return /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx(
    "td",
    {
      colSpan,
      className: "px-5 py-8 text-center text-sm text-zinc-500",
      children: text
    }
  ) });
}
export {
  Show as default
};
