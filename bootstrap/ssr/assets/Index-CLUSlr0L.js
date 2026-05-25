import { jsxs, jsx } from "react/jsx-runtime";
import { Head, Link } from "@inertiajs/react";
import { A as AuthenticatedLayout } from "./AuthenticatedLayout-DYCvRbZH.js";
import { Receipt, Wallet, Coins, FileText, CalendarRange, ArrowRight } from "lucide-react";
import "react";
import "react-toastify";
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
  const totalBilled = rows.reduce(
    (sum, statement) => sum + Number(statement.amount_due || 0),
    0
  );
  const totalPaid = rows.reduce(
    (sum, statement) => sum + Number(statement.paid_amount || 0),
    0
  );
  const totalBalance = rows.reduce(
    (sum, statement) => sum + Number(statement.balance_due || 0),
    0
  );
  return /* @__PURE__ */ jsxs(AuthenticatedLayout, { children: [
    /* @__PURE__ */ jsx(Head, { title: "My Fee Statements" }),
    /* @__PURE__ */ jsxs("div", { className: "mx-auto w-full max-w-7xl space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700", children: [
      /* @__PURE__ */ jsx("section", { className: "overflow-hidden rounded-[2rem] bg-[radial-gradient(circle_at_top_left,_rgba(52,211,153,0.26),_transparent_28%),linear-gradient(135deg,#102542_0%,#1b263b_55%,#243b53_100%)] px-6 py-8 text-white shadow-xl sm:px-8", children: /* @__PURE__ */ jsxs("div", { className: "grid gap-8 lg:grid-cols-[1.2fr,0.8fr] lg:items-end", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("p", { className: "text-sm font-semibold uppercase tracking-[0.24em] text-emerald-300", children: "Student Finance" }),
          /* @__PURE__ */ jsx("h1", { className: "mt-3 max-w-3xl text-3xl font-bold tracking-tight sm:text-4xl", children: "Fee statements that read like a real account summary" }),
          /* @__PURE__ */ jsx("p", { className: "mt-3 max-w-2xl text-sm leading-6 text-slate-300 sm:text-base", children: "Review each billed session, see how payments were applied, and open a printable statement with a running balance." }),
          /* @__PURE__ */ jsx(
            Link,
            {
              href: route("student.dashboard"),
              className: "mt-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/15",
              children: "Back to dashboard"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid gap-3 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3", children: [
          /* @__PURE__ */ jsx(
            HeroStat,
            {
              icon: Receipt,
              label: "Total billed",
              value: currency(totalBilled)
            }
          ),
          /* @__PURE__ */ jsx(
            HeroStat,
            {
              icon: Wallet,
              label: "Total paid",
              value: currency(totalPaid)
            }
          ),
          /* @__PURE__ */ jsx(
            HeroStat,
            {
              icon: Coins,
              label: "Outstanding",
              value: currency(totalBalance)
            }
          )
        ] })
      ] }) }),
      /* @__PURE__ */ jsxs("section", { className: "grid gap-4 md:grid-cols-3", children: [
        /* @__PURE__ */ jsx(
          SummaryCard,
          {
            icon: FileText,
            label: "Statements",
            value: rows.length,
            helper: "Visible in this page",
            tone: "bg-amber-50 text-amber-700"
          }
        ),
        /* @__PURE__ */ jsx(
          SummaryCard,
          {
            icon: CalendarRange,
            label: "Invoices covered",
            value: rows.reduce(
              (sum, statement) => sum + Number(statement.invoice_count || 0),
              0
            ),
            helper: "Across listed sessions",
            tone: "bg-sky-50 text-sky-700"
          }
        ),
        /* @__PURE__ */ jsx(
          SummaryCard,
          {
            icon: Receipt,
            label: "Ledger entries",
            value: rows.reduce(
              (sum, statement) => sum + Number(statement.transaction_count || 0),
              0
            ),
            helper: "Charges, payments, credits",
            tone: "bg-emerald-50 text-emerald-700"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("section", { className: "overflow-hidden rounded-[1.75rem] border border-zinc-100 bg-white shadow-sm", children: [
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
                    " invoice",
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
                      value: statement.issue_date ?? "-"
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    MetaRow,
                    {
                      label: "Due date",
                      value: statement.due_date ?? "-"
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
      ] })
    ] })
  ] });
}
function HeroStat({ icon: Icon, label, value }) {
  return /* @__PURE__ */ jsxs("div", { className: "rounded-[1.5rem] border border-white/10 bg-white/10 p-4 backdrop-blur", children: [
    /* @__PURE__ */ jsx("div", { className: "inline-flex rounded-2xl bg-white/10 p-2 text-emerald-200", children: /* @__PURE__ */ jsx(Icon, { className: "h-4 w-4" }) }),
    /* @__PURE__ */ jsx("p", { className: "mt-3 text-xs uppercase tracking-[0.16em] text-slate-300", children: label }),
    /* @__PURE__ */ jsx("p", { className: "mt-2 text-lg font-semibold text-white", children: value })
  ] });
}
function SummaryCard({ icon: Icon, label, value, helper, tone }) {
  return /* @__PURE__ */ jsxs("div", { className: "rounded-[1.5rem] border border-zinc-100 bg-white p-5 shadow-sm", children: [
    /* @__PURE__ */ jsx("div", { className: `inline-flex rounded-2xl p-3 ${tone}`, children: /* @__PURE__ */ jsx(Icon, { className: "h-5 w-5" }) }),
    /* @__PURE__ */ jsx("p", { className: "mt-4 text-sm font-medium text-zinc-500", children: label }),
    /* @__PURE__ */ jsx("p", { className: "mt-1 text-2xl font-bold text-zinc-900", children: value }),
    /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-zinc-500", children: helper })
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
