import { jsxs, Fragment, jsx } from "react/jsx-runtime";
import { Head, router } from "@inertiajs/react";
import { useState } from "react";
import { I as InputLabel } from "./InputLabel-DlDnrkJG.js";
import { S as SearchSelect } from "./SearchSelect-CY7NDfHZ.js";
import { T as TextInput } from "./TextInput-DsoSnibl.js";
import "ziggy-js";
const money = (value) => new Intl.NumberFormat("en-KE", {
  style: "currency",
  currency: "KES",
  maximumFractionDigits: 0
}).format(Number(value ?? 0));
function MonthlyPayslips({ filters, staffOptions, payslip }) {
  const [staffNumber, setStaffNumber] = useState(filters?.staff_number ?? "");
  const [month, setMonth] = useState(filters?.month ?? "");
  const submit = (event) => {
    event.preventDefault();
    router.get(
      route("hr.payslips.index"),
      {
        staff_number: staffNumber,
        month
      },
      {
        preserveState: true,
        replace: true
      }
    );
  };
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(Head, { title: "Monthly Payslips" }),
    /* @__PURE__ */ jsxs("div", { className: "mx-auto w-full space-y-5", children: [
      /* @__PURE__ */ jsxs("div", { className: "overflow-visible rounded-xl border border-zinc-200 bg-white shadow-sm print:hidden", children: [
        /* @__PURE__ */ jsxs("div", { className: "border-b border-zinc-200 px-5 py-4", children: [
          /* @__PURE__ */ jsx("h1", { className: "text-lg font-semibold text-zinc-950", children: "Monthly Payslips" }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-zinc-500", children: "View staff pay, loan reductions, and net monthly pay." })
        ] }),
        /* @__PURE__ */ jsxs("form", { onSubmit: submit, className: "px-5 py-5", children: [
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 gap-5 md:grid-cols-3", children: [
            /* @__PURE__ */ jsxs("div", { className: "md:col-span-2", children: [
              /* @__PURE__ */ jsx(InputLabel, { value: "Staff Number", required: true }),
              /* @__PURE__ */ jsx(
                SearchSelect,
                {
                  routeName: "staffs.search",
                  value: staffNumber,
                  selectedLabel: staffOptions?.[0]?.name,
                  defaultOptions: staffOptions ?? [],
                  onChange: (staff) => setStaffNumber(
                    staff.id ?? staff.staff_number ?? ""
                  ),
                  placeholder: "Search staff number",
                  minSearchLength: 1,
                  preloadOptions: true
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx(InputLabel, { value: "Month", required: true }),
              /* @__PURE__ */ jsx(
                TextInput,
                {
                  type: "month",
                  value: month,
                  onChange: (event) => setMonth(event.target.value)
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "mt-5 flex justify-end", children: /* @__PURE__ */ jsx(
            "button",
            {
              type: "submit",
              className: "min-h-[42px] rounded-lg bg-emerald-600 px-6 py-2 text-sm font-medium text-white transition hover:bg-emerald-700",
              children: "View Payslip"
            }
          ) })
        ] })
      ] }),
      payslip ? /* @__PURE__ */ jsxs("section", { className: "rounded-xl border border-zinc-200 bg-white shadow-sm print:border-0 print:shadow-none", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-4 border-b border-zinc-200 px-6 py-5 md:flex-row md:items-start md:justify-between", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold uppercase text-emerald-700", children: "Payslip" }),
            /* @__PURE__ */ jsx("h2", { className: "mt-1 text-2xl font-semibold text-zinc-950", children: payslip.period })
          ] }),
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              onClick: () => window.print(),
              className: "min-h-[40px] rounded-lg border border-zinc-300 px-5 py-2 text-sm font-medium text-zinc-800 transition hover:bg-zinc-50 print:hidden",
              children: "Print"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 border-b border-zinc-200 md:grid-cols-2", children: [
          /* @__PURE__ */ jsxs("div", { className: "space-y-2 px-6 py-5", children: [
            /* @__PURE__ */ jsx("h3", { className: "text-sm font-semibold text-zinc-900", children: "Staff Details" }),
            /* @__PURE__ */ jsxs("dl", { className: "grid grid-cols-1 gap-3 text-sm sm:grid-cols-2", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("dt", { className: "text-zinc-500", children: "Name" }),
                /* @__PURE__ */ jsx("dd", { className: "font-medium text-zinc-900", children: payslip.staff.name })
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("dt", { className: "text-zinc-500", children: "Staff Number" }),
                /* @__PURE__ */ jsx("dd", { className: "font-medium text-zinc-900", children: payslip.staff.staff_number })
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("dt", { className: "text-zinc-500", children: "Department" }),
                /* @__PURE__ */ jsx("dd", { className: "font-medium text-zinc-900", children: payslip.staff.department ?? "N/A" })
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("dt", { className: "text-zinc-500", children: "Designation" }),
                /* @__PURE__ */ jsx("dd", { className: "font-medium text-zinc-900", children: payslip.staff.designation ?? "N/A" })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "border-t border-zinc-200 px-6 py-5 md:border-l md:border-t-0", children: [
            /* @__PURE__ */ jsx("h3", { className: "text-sm font-semibold text-zinc-900", children: "Pay Summary" }),
            /* @__PURE__ */ jsxs("div", { className: "mt-3 space-y-2 text-sm", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
                /* @__PURE__ */ jsx("span", { className: "text-zinc-500", children: "Gross Pay" }),
                /* @__PURE__ */ jsx("span", { className: "font-semibold text-zinc-900", children: money(payslip.gross_pay) })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
                /* @__PURE__ */ jsx("span", { className: "text-zinc-500", children: "Deductions" }),
                /* @__PURE__ */ jsx("span", { className: "font-semibold text-red-600", children: money(payslip.total_deductions) })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between border-t border-zinc-200 pt-3 text-base", children: [
                /* @__PURE__ */ jsx("span", { className: "font-semibold text-zinc-900", children: "Net Pay" }),
                /* @__PURE__ */ jsx("span", { className: "font-bold text-emerald-700", children: money(payslip.net_pay) })
              ] })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2", children: [
          /* @__PURE__ */ jsxs("div", { className: "px-6 py-5", children: [
            /* @__PURE__ */ jsx("h3", { className: "text-sm font-semibold text-zinc-900", children: "Earnings" }),
            /* @__PURE__ */ jsx("div", { className: "mt-3 overflow-hidden rounded-lg border border-zinc-200", children: payslip.earnings.map((earning) => /* @__PURE__ */ jsxs(
              "div",
              {
                className: "flex items-center justify-between px-4 py-3 text-sm",
                children: [
                  /* @__PURE__ */ jsx("span", { className: "text-zinc-700", children: earning.label }),
                  /* @__PURE__ */ jsx("span", { className: "font-semibold text-zinc-900", children: money(earning.amount) })
                ]
              },
              earning.label
            )) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "border-t border-zinc-200 px-6 py-5 md:border-l md:border-t-0", children: [
            /* @__PURE__ */ jsx("h3", { className: "text-sm font-semibold text-zinc-900", children: "Deductions" }),
            /* @__PURE__ */ jsx("div", { className: "mt-3 overflow-hidden rounded-lg border border-zinc-200", children: payslip.deductions.length ? payslip.deductions.map((deduction) => /* @__PURE__ */ jsxs(
              "div",
              {
                className: "flex items-center justify-between gap-4 border-b border-zinc-100 px-4 py-3 text-sm last:border-b-0",
                children: [
                  /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsx("p", { className: "font-medium text-zinc-800", children: deduction.label }),
                    /* @__PURE__ */ jsxs("p", { className: "text-xs text-zinc-500", children: [
                      deduction.start_date,
                      deduction.end_date ? ` to ${deduction.end_date}` : ""
                    ] })
                  ] }),
                  /* @__PURE__ */ jsx("span", { className: "font-semibold text-red-600", children: money(deduction.amount) })
                ]
              },
              deduction.id
            )) : /* @__PURE__ */ jsx("div", { className: "px-4 py-3 text-sm text-zinc-500", children: "No deductions for this month." }) })
          ] })
        ] })
      ] }) : /* @__PURE__ */ jsx("div", { className: "rounded-xl border border-dashed border-zinc-300 bg-white px-6 py-10 text-center text-sm text-zinc-500", children: "Select a staff number and month to view a payslip." })
    ] })
  ] });
}
export {
  MonthlyPayslips as default
};
