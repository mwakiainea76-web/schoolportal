import { jsxs, jsx } from "react/jsx-runtime";
import { Head, Link } from "@inertiajs/react";
import { A as AuthenticatedLayout } from "../app.js";
import { f as formatDate } from "./date-CQXYOX-2.js";
import { ArrowRight, FileText } from "lucide-react";
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
function Index({ statements }) {
  const rows = statements?.data || [];
  return /* @__PURE__ */ jsxs(AuthenticatedLayout, { children: [
    /* @__PURE__ */ jsx(Head, { title: "My Fee Statements" }),
    /* @__PURE__ */ jsx("div", { className: "mx-auto w-full max-w-7xl space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700", children: /* @__PURE__ */ jsxs("section", { className: "overflow-hidden rounded-[1.75rem] border border-zinc-100 bg-white shadow-sm", children: [
      /* @__PURE__ */ jsxs("div", { className: "border-b border-zinc-100 px-6 py-5", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-lg font-semibold text-zinc-900", children: "Statement History" }),
        /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-zinc-500", children: "Open any statement to inspect charges, credits, and the running balance for that session." })
      ] }),
      rows.length ? /* @__PURE__ */ jsx("div", { className: "grid gap-4 p-4 sm:p-6", children: rows.map((statement) => /* @__PURE__ */ jsx(
        "article",
        {
          className: "rounded-[1.5rem] border border-zinc-100 bg-[linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)] p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-md",
          children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between", children: [
            /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-3", children: [
                /* @__PURE__ */ jsx("p", { className: "text-sm font-semibold uppercase tracking-[0.18em] text-zinc-500", children: statement.statement_reference }),
                /* @__PURE__ */ jsx(
                  "span",
                  {
                    className: `rounded-full px-3 py-1 text-xs font-semibold capitalize ${statusClasses[statement.status] ?? "bg-slate-100 text-slate-600"}`,
                    children: statement.status
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("h3", { className: "text-xl font-semibold text-zinc-900", children: statement.session ?? "Session not linked" }),
                /* @__PURE__ */ jsxs("p", { className: "mt-1 text-sm text-zinc-500", children: [
                  statement.invoice_count,
                  " ",
                  "invoice",
                  statement.invoice_count === 1 ? "" : "s",
                  " ",
                  "and",
                  " ",
                  statement.transaction_count,
                  " ",
                  "ledger",
                  " ",
                  statement.transaction_count === 1 ? "entry" : "entries"
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "grid gap-3 sm:grid-cols-3", children: [
                /* @__PURE__ */ jsx(
                  MiniMetric,
                  {
                    label: "Charges",
                    value: currency(
                      statement.amount_due
                    )
                  }
                ),
                /* @__PURE__ */ jsx(
                  MiniMetric,
                  {
                    label: "Paid",
                    value: currency(
                      statement.paid_amount
                    )
                  }
                ),
                /* @__PURE__ */ jsx(
                  MiniMetric,
                  {
                    label: "Balance",
                    value: currency(
                      statement.balance_due
                    ),
                    emphasis: true
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex min-w-[220px] flex-col gap-4 lg:items-end", children: [
              /* @__PURE__ */ jsxs("div", { className: "grid w-full gap-3 rounded-[1.25rem] border border-zinc-100 bg-white p-4 lg:max-w-xs", children: [
                /* @__PURE__ */ jsx(
                  MetaRow,
                  {
                    label: "Issue date",
                    value: formatDate(
                      statement.issue_date
                    )
                  }
                ),
                /* @__PURE__ */ jsx(
                  MetaRow,
                  {
                    label: "Due date",
                    value: formatDate(
                      statement.due_date
                    )
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs(
                Link,
                {
                  href: route(
                    "student.fee-statements.show",
                    statement.id
                  ),
                  className: "inline-flex items-center justify-center gap-2 rounded-full bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700",
                  children: [
                    "Open statement",
                    /* @__PURE__ */ jsx(ArrowRight, { className: "h-4 w-4" })
                  ]
                }
              )
            ] })
          ] })
        },
        statement.id
      )) }) : /* @__PURE__ */ jsxs("div", { className: "px-6 py-16 text-center", children: [
        /* @__PURE__ */ jsx("div", { className: "mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-zinc-100 text-zinc-500", children: /* @__PURE__ */ jsx(FileText, { className: "h-8 w-8" }) }),
        /* @__PURE__ */ jsx("h3", { className: "mt-5 text-lg font-semibold text-zinc-900", children: "No statements yet" }),
        /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm text-zinc-500", children: "Your fee statements will appear here after session invoicing starts." })
      ] }),
      statements?.last_page > 1 ? /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-3 border-t border-zinc-100 px-6 py-4 text-sm sm:flex-row sm:items-center sm:justify-between", children: [
        /* @__PURE__ */ jsxs("p", { className: "text-zinc-500", children: [
          "Page ",
          statements.current_page,
          " of",
          " ",
          statements.last_page
        ] }),
        /* @__PURE__ */ jsx("div", { className: "flex flex-wrap items-center gap-2", children: statements.links?.filter(
          (link) => link.label !== "&laquo; Previous" && link.label !== "Next &raquo;"
        ).map((link, index) => /* @__PURE__ */ jsx(
          Link,
          {
            href: link.url || "#",
            preserveScroll: true,
            className: `rounded-full px-3 py-1.5 ${link.active ? "bg-slate-900 text-white" : "bg-zinc-100 text-zinc-700"} ${!link.url ? "pointer-events-none opacity-40" : ""}`,
            dangerouslySetInnerHTML: {
              __html: link.label
            }
          },
          `${link.label}-${index}`
        )) })
      ] }) : null
    ] }) })
  ] });
}
function MiniMetric({ label, value, emphasis = false }) {
  return /* @__PURE__ */ jsxs("div", { className: "rounded-2xl bg-white/80 px-4 py-3 ring-1 ring-zinc-100", children: [
    /* @__PURE__ */ jsx("p", { className: "text-xs uppercase tracking-[0.14em] text-zinc-500", children: label }),
    /* @__PURE__ */ jsx(
      "p",
      {
        className: `mt-1 text-base font-semibold ${emphasis ? "text-amber-700" : "text-zinc-900"}`,
        children: value
      }
    )
  ] });
}
function MetaRow({ label, value }) {
  return /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-4 text-sm", children: [
    /* @__PURE__ */ jsx("span", { className: "text-zinc-500", children: label }),
    /* @__PURE__ */ jsx("span", { className: "font-medium text-zinc-900", children: value })
  ] });
}
export {
  Index as default
};
