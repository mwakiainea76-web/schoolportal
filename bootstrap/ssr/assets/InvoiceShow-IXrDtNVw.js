import { jsxs, jsx } from "react/jsx-runtime";
import { Head, Link } from "@inertiajs/react";
import { A as AuthenticatedLayout } from "../app.js";
import { f as formatDate } from "./date-CQXYOX-2.js";
import { ArrowLeft, Receipt, Wallet, CreditCard, CalendarClock, FilePlus2 } from "lucide-react";
import "axios";
import "react";
import "react-toastify";
import "react-dom/client";
const currency = (amount) => `Ksh ${new Intl.NumberFormat("en-KE", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2
}).format(Number(amount || 0))}`;
const signedCurrency = (amount) => `${Number(amount || 0) < 0 ? "-" : ""}Ksh ${new Intl.NumberFormat(
  "en-KE",
  {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }
).format(Math.abs(Number(amount || 0)))}`;
const statusClasses = {
  draft: "bg-slate-100 text-slate-600",
  issued: "bg-blue-100 text-blue-700",
  partial: "bg-amber-100 text-amber-700",
  paid: "bg-emerald-100 text-emerald-700"
};
function Show({ invoice, sessionSummary }) {
  const studentName = `${invoice.student?.user?.first_name ?? ""} ${invoice.student?.user?.last_name ?? ""}`.trim();
  const program = invoice.enrollment?.program_enrollment?.program_version_mapping?.program?.name ?? "Not linked";
  const programVersion = invoice.enrollment?.program_enrollment?.program_version_mapping?.program_version?.name ?? "Not linked";
  const session = invoice.enrollment?.academic_session?.display_name ?? invoice.academic_session?.display_name ?? "Session not linked";
  const itemsTotal = Number(
    sessionSummary?.items_total || invoice.items_total || 0
  );
  const adjustmentsTotal = Number(
    sessionSummary?.adjustments_total || invoice.adjustments_total || 0
  );
  const paidTotal = Number(
    sessionSummary?.paid_amount || invoice.paid_amount || 0
  );
  const balanceTotal = Number(
    sessionSummary?.balance_due ?? invoice.balance_due ?? 0
  );
  const sessionItems = sessionSummary?.items?.length > 0 ? sessionSummary.items : invoice.items || [];
  const sessionPayments = sessionSummary?.payment_allocations?.length > 0 ? sessionSummary.payment_allocations : invoice.payment_allocations || [];
  const sessionAdjustments = sessionSummary?.adjustments?.length > 0 ? sessionSummary.adjustments : invoice.adjustments || [];
  const includedInvoices = sessionSummary?.included_invoices || [];
  const hasAdditionalInvoices = (sessionSummary?.invoice_count || 0) > 1;
  return /* @__PURE__ */ jsxs(AuthenticatedLayout, { children: [
    /* @__PURE__ */ jsx(Head, { title: `Invoice ${invoice.invoice_number}` }),
    /* @__PURE__ */ jsxs("div", { className: "mx-auto w-full max-w-7xl space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700", children: [
      /* @__PURE__ */ jsx("div", { className: "flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between", children: /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs(
          Link,
          {
            href: route("billing.invoices.index"),
            className: "inline-flex items-center gap-2 text-sm font-medium text-emerald-700 transition hover:text-emerald-800",
            children: [
              /* @__PURE__ */ jsx(ArrowLeft, { className: "h-4 w-4" }),
              "Back to invoices"
            ]
          }
        ),
        /* @__PURE__ */ jsxs("h1", { className: "mt-3 text-3xl font-bold tracking-tight text-zinc-900", children: [
          "Billing statement for ",
          invoice.invoice_number
        ] }),
        /* @__PURE__ */ jsx("p", { className: "mt-2 max-w-3xl text-sm text-zinc-500", children: "This admin view shows the same session-based story the student sees: total charges, applied credits, payments, and the remaining balance." })
      ] }) }),
      /* @__PURE__ */ jsx("section", { className: "overflow-hidden rounded-[2rem] bg-[radial-gradient(circle_at_top_left,_rgba(52,211,153,0.24),_transparent_26%),linear-gradient(135deg,#102542_0%,#1b263b_55%,#243b53_100%)] px-6 py-8 text-white shadow-xl sm:px-8", children: /* @__PURE__ */ jsxs("div", { className: "grid gap-8 xl:grid-cols-[1.05fr,0.95fr]", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("p", { className: "text-sm font-semibold uppercase tracking-[0.2em] text-emerald-300", children: "Session Billing Overview" }),
          /* @__PURE__ */ jsx("h2", { className: "mt-3 text-2xl font-bold sm:text-3xl", children: studentName || "Student not linked" }),
          /* @__PURE__ */ jsxs("p", { className: "mt-2 text-sm text-slate-300", children: [
            invoice.student?.registration_number ?? "N/A",
            " |",
            " ",
            program,
            " | ",
            programVersion
          ] }),
          /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm text-slate-300", children: session }),
          /* @__PURE__ */ jsxs("div", { className: "mt-6 grid gap-3 sm:grid-cols-2", children: [
            /* @__PURE__ */ jsx(
              ProfileMetric,
              {
                label: "Invoice date",
                value: formatDate(invoice.issue_date)
              }
            ),
            /* @__PURE__ */ jsx(
              ProfileMetric,
              {
                label: "Due date",
                value: formatDate(invoice.due_date)
              }
            ),
            /* @__PURE__ */ jsx(
              ProfileMetric,
              {
                label: "Session invoices",
                value: `${sessionSummary?.invoice_count || 1}`
              }
            ),
            /* @__PURE__ */ jsx(
              ProfileMetric,
              {
                label: "Status",
                value: invoice.status,
                chip: true
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid gap-4 sm:grid-cols-2", children: [
          /* @__PURE__ */ jsx(
            StatCard,
            {
              icon: Receipt,
              label: "Base Charges",
              value: currency(itemsTotal)
            }
          ),
          /* @__PURE__ */ jsx(
            StatCard,
            {
              icon: Wallet,
              label: "Net Adjustments",
              value: signedCurrency(adjustmentsTotal)
            }
          ),
          /* @__PURE__ */ jsx(
            StatCard,
            {
              icon: CreditCard,
              label: "Payments and Credits",
              value: currency(paidTotal)
            }
          ),
          /* @__PURE__ */ jsxs("div", { className: "rounded-[1.5rem] border border-white/10 bg-white/10 p-5", children: [
            /* @__PURE__ */ jsx("p", { className: "text-xs uppercase tracking-[0.16em] text-slate-300", children: "Outstanding Balance" }),
            /* @__PURE__ */ jsx("p", { className: "mt-3 text-2xl font-bold text-white", children: signedCurrency(balanceTotal) }),
            /* @__PURE__ */ jsx(
              "span",
              {
                className: `mt-4 inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize ${statusClasses[invoice.status] ?? "bg-slate-100 text-slate-600"}`,
                children: invoice.status
              }
            )
          ] })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxs("div", { className: "grid gap-6 xl:grid-cols-[1.15fr,0.85fr]", children: [
        /* @__PURE__ */ jsxs("section", { className: "rounded-[1.75rem] border border-zinc-100 bg-white p-6 shadow-sm", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("h2", { className: "text-lg font-semibold text-zinc-900", children: "Student Context" }),
              /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-zinc-500", children: "Core information tied to this session statement." })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "rounded-2xl bg-sky-50 p-3 text-sky-600", children: /* @__PURE__ */ jsx(CalendarClock, { className: "h-5 w-5" }) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "mt-5 grid gap-4 md:grid-cols-2", children: [
            /* @__PURE__ */ jsx(
              InfoCard,
              {
                label: "Student",
                value: studentName || "Not linked"
              }
            ),
            /* @__PURE__ */ jsx(
              InfoCard,
              {
                label: "Registration Number",
                value: invoice.student?.registration_number ?? "N/A"
              }
            ),
            /* @__PURE__ */ jsx(InfoCard, { label: "Course", value: program }),
            /* @__PURE__ */ jsx(
              InfoCard,
              {
                label: "Course Version",
                value: programVersion
              }
            ),
            /* @__PURE__ */ jsx(InfoCard, { label: "Session", value: session }),
            /* @__PURE__ */ jsx(
              InfoCard,
              {
                label: "Invoice Total",
                value: currency(invoice.amount_due)
              }
            ),
            /* @__PURE__ */ jsx(
              InfoCard,
              {
                label: "Invoice Class",
                value: invoice.display_type_label ?? "STANDARD INVOICE"
              }
            )
          ] }),
          hasAdditionalInvoices ? /* @__PURE__ */ jsxs("div", { className: "mt-6 rounded-[1.5rem] border border-zinc-100 bg-zinc-50 p-4", children: [
            /* @__PURE__ */ jsx("p", { className: "text-sm font-semibold text-zinc-900", children: "Included Session Invoices" }),
            /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-zinc-500", children: "This record groups all invoices issued for the same student and session." }),
            /* @__PURE__ */ jsx("div", { className: "mt-4 grid gap-3", children: includedInvoices.map((sessionInvoice) => /* @__PURE__ */ jsxs(
              "div",
              {
                className: "flex flex-col gap-2 rounded-2xl bg-white px-4 py-3 sm:flex-row sm:items-center sm:justify-between",
                children: [
                  /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsx("p", { className: "font-medium text-zinc-900", children: sessionInvoice.invoice_number }),
                    /* @__PURE__ */ jsx("p", { className: "text-sm text-zinc-500", children: formatDate(sessionInvoice.issue_date) })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "text-left sm:text-right", children: [
                    /* @__PURE__ */ jsx("p", { className: "font-medium text-zinc-900", children: currency(sessionInvoice.amount_due) }),
                    /* @__PURE__ */ jsxs("p", { className: "text-sm text-zinc-500", children: [
                      "Balance",
                      " ",
                      signedCurrency(
                        sessionInvoice.balance_due
                      )
                    ] })
                  ] })
                ]
              },
              sessionInvoice.id
            )) })
          ] }) : null
        ] }),
        /* @__PURE__ */ jsxs("section", { className: "rounded-[1.75rem] border border-zinc-100 bg-white p-6 shadow-sm", children: [
          /* @__PURE__ */ jsx("h2", { className: "text-lg font-semibold text-zinc-900", children: "Manual Actions" }),
          /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-zinc-500", children: "Post the next billing action from the same student context." }),
          /* @__PURE__ */ jsxs("div", { className: "mt-5 space-y-4", children: [
            /* @__PURE__ */ jsx(
              ActionLink,
              {
                href: route("billing.manual.invoices.create", {
                  registration_number: invoice.student?.registration_number
                }),
                icon: FilePlus2,
                title: "Post student charge",
                helper: "Charge the student account using Standard Invoice, Penalty, or Invoice Adjustment."
              }
            ),
            /* @__PURE__ */ jsx(
              ActionLink,
              {
                href: route("billing.manual.payments.create", {
                  registration_number: invoice.student?.registration_number
                }),
                icon: CreditCard,
                title: "Record payment",
                helper: "Post a receipt and reduce the invoice balance."
              }
            ),
            /* @__PURE__ */ jsx(
              ActionLink,
              {
                href: route("billing.manual.adjustments.create", {
                  registration_number: invoice.student?.registration_number
                }),
                icon: Wallet,
                title: "Reduce student charges",
                helper: "Use waivers, bursaries, HELB, refunds, and reversals here. This is not a payment entry."
              }
            )
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("section", { className: "rounded-[1.75rem] border border-zinc-100 bg-white p-6 shadow-sm", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-lg font-semibold text-zinc-900", children: "Session Charge Breakdown" }),
        /* @__PURE__ */ jsx("div", { className: "mt-5 overflow-hidden rounded-2xl border border-zinc-100", children: /* @__PURE__ */ jsxs("table", { className: "min-w-full divide-y divide-zinc-100", children: [
          /* @__PURE__ */ jsx("thead", { className: "bg-zinc-50", children: /* @__PURE__ */ jsxs("tr", { className: "text-left text-xs font-semibold uppercase tracking-wide text-zinc-500", children: [
            /* @__PURE__ */ jsx("th", { className: "px-5 py-4", children: "Description" }),
            /* @__PURE__ */ jsx("th", { className: "px-5 py-4 text-right", children: "Qty" }),
            /* @__PURE__ */ jsx("th", { className: "px-5 py-4 text-right", children: "Unit Amount" }),
            /* @__PURE__ */ jsx("th", { className: "px-5 py-4 text-right", children: "Total" })
          ] }) }),
          /* @__PURE__ */ jsx("tbody", { className: "divide-y divide-zinc-100 bg-white", children: sessionItems.length ? sessionItems.map((item, index) => /* @__PURE__ */ jsxs(
            "tr",
            {
              children: [
                /* @__PURE__ */ jsx("td", { className: "px-5 py-4 text-sm font-medium text-zinc-900", children: /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("p", { children: item.description }),
                  item.invoice_number ? /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs font-normal text-zinc-500", children: item.invoice_number }) : null
                ] }) }),
                /* @__PURE__ */ jsx("td", { className: "px-5 py-4 text-right text-sm text-zinc-700", children: item.quantity }),
                /* @__PURE__ */ jsx("td", { className: "px-5 py-4 text-right text-sm text-zinc-700", children: currency(item.unit_amount) }),
                /* @__PURE__ */ jsx("td", { className: "px-5 py-4 text-right text-sm font-semibold text-zinc-900", children: currency(item.total_amount) })
              ]
            },
            `${item.invoice_number ?? "invoice"}-${item.id ?? index}`
          )) : /* @__PURE__ */ jsx(
            EmptyRow,
            {
              colSpan: "4",
              text: "No invoice items recorded."
            }
          ) })
        ] }) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid gap-6 xl:grid-cols-2", children: [
        /* @__PURE__ */ jsxs("section", { className: "rounded-[1.75rem] border border-zinc-100 bg-white p-6 shadow-sm", children: [
          /* @__PURE__ */ jsx("h2", { className: "text-lg font-semibold text-zinc-900", children: "Payments" }),
          /* @__PURE__ */ jsx("div", { className: "mt-5 overflow-hidden rounded-2xl border border-zinc-100", children: /* @__PURE__ */ jsxs("table", { className: "min-w-full divide-y divide-zinc-100", children: [
            /* @__PURE__ */ jsx("thead", { className: "bg-zinc-50", children: /* @__PURE__ */ jsxs("tr", { className: "text-left text-xs font-semibold uppercase tracking-wide text-zinc-500", children: [
              /* @__PURE__ */ jsx("th", { className: "px-5 py-4", children: "Date" }),
              /* @__PURE__ */ jsx("th", { className: "px-5 py-4", children: "Method" }),
              /* @__PURE__ */ jsx("th", { className: "px-5 py-4", children: "Reference" }),
              /* @__PURE__ */ jsx("th", { className: "px-5 py-4 text-right", children: "Amount" })
            ] }) }),
            /* @__PURE__ */ jsx("tbody", { className: "divide-y divide-zinc-100 bg-white", children: sessionPayments.length ? sessionPayments.map((allocation) => /* @__PURE__ */ jsxs("tr", { children: [
              /* @__PURE__ */ jsx("td", { className: "px-5 py-4 text-sm text-zinc-700", children: formatDate(allocation.payment_date) }),
              /* @__PURE__ */ jsx("td", { className: "px-5 py-4 text-sm text-zinc-700 capitalize", children: allocation.method ?? "-" }),
              /* @__PURE__ */ jsx("td", { className: "px-5 py-4 text-sm text-zinc-700", children: /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("p", { children: allocation.reference ?? "-" }),
                allocation.invoice_number ? /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs text-zinc-500", children: allocation.invoice_number }) : null
              ] }) }),
              /* @__PURE__ */ jsx("td", { className: "px-5 py-4 text-right text-sm font-semibold text-emerald-700", children: currency(allocation.amount) })
            ] }, allocation.id)) : /* @__PURE__ */ jsx(
              EmptyRow,
              {
                colSpan: "4",
                text: "No payments recorded."
              }
            ) })
          ] }) })
        ] }),
        /* @__PURE__ */ jsxs("section", { className: "rounded-[1.75rem] border border-zinc-100 bg-white p-6 shadow-sm", children: [
          /* @__PURE__ */ jsx("h2", { className: "text-lg font-semibold text-zinc-900", children: "Adjustments" }),
          /* @__PURE__ */ jsx("div", { className: "mt-5 overflow-hidden rounded-2xl border border-zinc-100", children: /* @__PURE__ */ jsxs("table", { className: "min-w-full divide-y divide-zinc-100", children: [
            /* @__PURE__ */ jsx("thead", { className: "bg-zinc-50", children: /* @__PURE__ */ jsxs("tr", { className: "text-left text-xs font-semibold uppercase tracking-wide text-zinc-500", children: [
              /* @__PURE__ */ jsx("th", { className: "px-5 py-4", children: "Type" }),
              /* @__PURE__ */ jsx("th", { className: "px-5 py-4", children: "Description" }),
              /* @__PURE__ */ jsx("th", { className: "px-5 py-4", children: "Applied" }),
              /* @__PURE__ */ jsx("th", { className: "px-5 py-4 text-right", children: "Amount" })
            ] }) }),
            /* @__PURE__ */ jsx("tbody", { className: "divide-y divide-zinc-100 bg-white", children: sessionAdjustments.length ? sessionAdjustments.map((adjustment) => {
              const reducesInvoice = [
                "discount",
                "waiver",
                "bursary",
                "helb",
                "reversal"
              ].includes(adjustment.type);
              const increasesInvoice = [
                "penalty",
                "other"
              ].includes(adjustment.type);
              const effectAmount = adjustment.type === "refund" ? 0 : reducesInvoice ? -Number(adjustment.amount) : Number(adjustment.amount);
              return /* @__PURE__ */ jsxs("tr", { children: [
                /* @__PURE__ */ jsx("td", { className: "px-5 py-4 text-sm font-medium capitalize text-zinc-900", children: adjustment.display_type ?? adjustment.type }),
                /* @__PURE__ */ jsx("td", { className: "px-5 py-4 text-sm text-zinc-700", children: /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("p", { children: adjustment.description ?? "-" }),
                  adjustment.invoice_number ? /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs text-zinc-500", children: adjustment.invoice_number }) : null
                ] }) }),
                /* @__PURE__ */ jsx("td", { className: "px-5 py-4 text-sm text-zinc-700", children: formatDate(adjustment.applied_at) }),
                /* @__PURE__ */ jsxs(
                  "td",
                  {
                    className: `px-5 py-4 text-right text-sm font-semibold ${adjustment.type === "refund" ? "text-slate-700" : increasesInvoice ? "text-amber-700" : "text-emerald-700"}`,
                    children: [
                      adjustment.type === "refund" ? currency(adjustment.amount) : signedCurrency(effectAmount),
                      /* @__PURE__ */ jsx("div", { className: "mt-1 text-xs font-normal text-zinc-500", children: adjustment.type === "refund" ? "Cash payout only" : reducesInvoice ? "Reduces invoice" : "Increases invoice" })
                    ]
                  }
                )
              ] }, adjustment.id);
            }) : /* @__PURE__ */ jsx(
              EmptyRow,
              {
                colSpan: "4",
                text: "No fee adjustments recorded."
              }
            ) })
          ] }) })
        ] })
      ] })
    ] })
  ] });
}
function StatCard({ icon: Icon, label, value }) {
  return /* @__PURE__ */ jsxs("div", { className: "rounded-[1.5rem] border border-white/10 bg-white/10 p-5", children: [
    /* @__PURE__ */ jsx("div", { className: "inline-flex rounded-xl bg-white/10 p-2 text-white", children: /* @__PURE__ */ jsx(Icon, { className: "h-4 w-4" }) }),
    /* @__PURE__ */ jsx("p", { className: "mt-3 text-xs uppercase tracking-[0.16em] text-slate-300", children: label }),
    /* @__PURE__ */ jsx("p", { className: "mt-2 text-xl font-semibold text-white", children: value })
  ] });
}
function ProfileMetric({ label, value, chip = false }) {
  return /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border border-white/10 bg-white/10 px-4 py-3", children: [
    /* @__PURE__ */ jsx("p", { className: "text-xs uppercase tracking-[0.14em] text-slate-300", children: label }),
    chip ? /* @__PURE__ */ jsx(
      "span",
      {
        className: `mt-2 inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize ${statusClasses[value] ?? "bg-slate-100 text-slate-600"}`,
        children: value
      }
    ) : /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm font-semibold text-white", children: value })
  ] });
}
function InfoCard({ label, value }) {
  return /* @__PURE__ */ jsxs("div", { className: "rounded-2xl bg-zinc-50 px-4 py-3", children: [
    /* @__PURE__ */ jsx("p", { className: "text-sm text-zinc-500", children: label }),
    /* @__PURE__ */ jsx("p", { className: "mt-1 font-semibold text-zinc-900", children: value || "-" })
  ] });
}
function ActionLink({ href, icon: Icon, title, helper }) {
  return /* @__PURE__ */ jsx(
    Link,
    {
      href,
      className: "block rounded-2xl border border-zinc-100 bg-zinc-50 px-4 py-4 transition hover:border-emerald-200 hover:bg-emerald-50/50",
      children: /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3", children: [
        /* @__PURE__ */ jsx("div", { className: "rounded-xl bg-white p-2 text-zinc-700 shadow-sm", children: /* @__PURE__ */ jsx(Icon, { className: "h-4 w-4" }) }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("p", { className: "font-semibold text-zinc-900", children: title }),
          /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-zinc-500", children: helper })
        ] })
      ] })
    }
  );
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
