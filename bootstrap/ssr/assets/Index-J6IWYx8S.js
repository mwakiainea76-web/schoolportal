import { jsxs, Fragment, jsx } from "react/jsx-runtime";
import { useForm, Head, router } from "@inertiajs/react";
import { useState } from "react";
import { I as InputError } from "./InputError-CBvD_6aD.js";
import { I as InputLabel } from "./InputLabel-DlDnrkJG.js";
import { S as SearchSelect } from "./SearchSelect-CY7NDfHZ.js";
import { T as Table, a as Thead, b as THdata, c as Tbody, d as Trow, e as Tdata } from "./Tdata-BYbinPOB.js";
import { T as TextInput } from "./TextInput-DsoSnibl.js";
import "ziggy-js";
const money = (value) => new Intl.NumberFormat("en-KE", {
  style: "currency",
  currency: "KES",
  maximumFractionDigits: 0
}).format(Number(value ?? 0));
function SalaryManagement({ staffs, loanReductions, filters }) {
  const [search, setSearch] = useState(filters?.search ?? "");
  const { data, setData, patch, processing, errors, reset } = useForm({
    staff_number: "",
    salary: ""
  });
  const {
    data: loanData,
    setData: setLoanData,
    post: postLoan,
    processing: loanProcessing,
    errors: loanErrors,
    reset: resetLoan
  } = useForm({
    staff_number: "",
    loan_name: "",
    principal_amount: "",
    monthly_reduction: "",
    start_date: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
    end_date: "",
    notes: ""
  });
  const submitSearch = (event) => {
    event.preventDefault();
    router.get(
      route("hr.salaries.index"),
      { search },
      { preserveState: true, replace: true }
    );
  };
  const submitSalary = (event) => {
    event.preventDefault();
    patch(route("hr.salaries.update"), {
      preserveScroll: true,
      onSuccess: () => reset()
    });
  };
  const submitLoanReduction = (event) => {
    event.preventDefault();
    postLoan(route("hr.salaries.loan-reductions.store"), {
      preserveScroll: true,
      onSuccess: () => resetLoan()
    });
  };
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(Head, { title: "Salary Management" }),
    /* @__PURE__ */ jsxs("div", { className: "mx-auto w-full space-y-5", children: [
      /* @__PURE__ */ jsxs("div", { className: "overflow-visible rounded-xl border border-zinc-200 bg-white shadow-sm", children: [
        /* @__PURE__ */ jsxs("div", { className: "border-b border-zinc-200 px-5 py-4", children: [
          /* @__PURE__ */ jsx("h1", { className: "text-lg font-semibold text-zinc-950", children: "Salary Management" }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-zinc-500", children: "Search staff and update their current salary record." })
        ] }),
        /* @__PURE__ */ jsx("form", { onSubmit: submitSalary, className: "space-y-5 px-5 py-5", children: /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(InputLabel, { value: "Staff Number", required: true }),
            /* @__PURE__ */ jsx(
              SearchSelect,
              {
                routeName: "staffs.search",
                value: data.staff_number,
                onChange: (staff) => setData(
                  "staff_number",
                  staff.id ?? staff.staff_number ?? ""
                ),
                error: errors.staff_number,
                placeholder: "Search staff number",
                minSearchLength: 1,
                preloadOptions: true
              }
            ),
            /* @__PURE__ */ jsx(InputError, { message: errors.staff_number })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(InputLabel, { value: "Salary", required: true }),
            /* @__PURE__ */ jsx(
              TextInput,
              {
                type: "number",
                min: "0",
                step: "1",
                value: data.salary,
                onChange: (event) => setData("salary", event.target.value),
                error: errors.salary,
                placeholder: "e.g. 85000"
              }
            ),
            /* @__PURE__ */ jsx(InputError, { message: errors.salary })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "flex items-end", children: /* @__PURE__ */ jsx(
            "button",
            {
              type: "submit",
              disabled: processing,
              className: "min-h-[42px] w-full rounded-lg bg-emerald-600 px-5 py-2 text-sm font-medium text-white transition hover:bg-emerald-700 disabled:opacity-50",
              children: processing ? "Updating..." : "Update Salary"
            }
          ) })
        ] }) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "overflow-visible rounded-xl border border-zinc-200 bg-white shadow-sm", children: [
        /* @__PURE__ */ jsxs("div", { className: "border-b border-zinc-200 px-5 py-4", children: [
          /* @__PURE__ */ jsx("h2", { className: "text-base font-semibold text-zinc-950", children: "Loans Reduction" }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-zinc-500", children: "Add staff loan deductions to be reduced from salary." })
        ] }),
        /* @__PURE__ */ jsxs(
          "form",
          {
            onSubmit: submitLoanReduction,
            className: "space-y-5 px-5 py-5",
            children: [
              /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3", children: [
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx(InputLabel, { value: "Staff Number", required: true }),
                  /* @__PURE__ */ jsx(
                    SearchSelect,
                    {
                      routeName: "staffs.search",
                      value: loanData.staff_number,
                      onChange: (staff) => setLoanData(
                        "staff_number",
                        staff.id ?? staff.staff_number ?? ""
                      ),
                      error: loanErrors.staff_number,
                      placeholder: "Search staff number",
                      minSearchLength: 1,
                      preloadOptions: true
                    }
                  ),
                  /* @__PURE__ */ jsx(InputError, { message: loanErrors.staff_number })
                ] }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx(InputLabel, { value: "Loan Name", required: true }),
                  /* @__PURE__ */ jsx(
                    TextInput,
                    {
                      value: loanData.loan_name,
                      onChange: (event) => setLoanData(
                        "loan_name",
                        event.target.value
                      ),
                      error: loanErrors.loan_name,
                      placeholder: "e.g. Sacco Loan"
                    }
                  ),
                  /* @__PURE__ */ jsx(InputError, { message: loanErrors.loan_name })
                ] }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx(InputLabel, { value: "Loan Amount", required: true }),
                  /* @__PURE__ */ jsx(
                    TextInput,
                    {
                      type: "number",
                      min: "1",
                      step: "1",
                      value: loanData.principal_amount,
                      onChange: (event) => setLoanData(
                        "principal_amount",
                        event.target.value
                      ),
                      error: loanErrors.principal_amount,
                      placeholder: "e.g. 50000"
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    InputError,
                    {
                      message: loanErrors.principal_amount
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx(InputLabel, { value: "Monthly Reduction", required: true }),
                  /* @__PURE__ */ jsx(
                    TextInput,
                    {
                      type: "number",
                      min: "1",
                      step: "1",
                      value: loanData.monthly_reduction,
                      onChange: (event) => setLoanData(
                        "monthly_reduction",
                        event.target.value
                      ),
                      error: loanErrors.monthly_reduction,
                      placeholder: "e.g. 5000"
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    InputError,
                    {
                      message: loanErrors.monthly_reduction
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx(InputLabel, { value: "Start Date", required: true }),
                  /* @__PURE__ */ jsx(
                    TextInput,
                    {
                      type: "date",
                      value: loanData.start_date,
                      onChange: (event) => setLoanData(
                        "start_date",
                        event.target.value
                      ),
                      error: loanErrors.start_date
                    }
                  ),
                  /* @__PURE__ */ jsx(InputError, { message: loanErrors.start_date })
                ] }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx(InputLabel, { value: "End Date" }),
                  /* @__PURE__ */ jsx(
                    TextInput,
                    {
                      type: "date",
                      value: loanData.end_date,
                      onChange: (event) => setLoanData(
                        "end_date",
                        event.target.value
                      ),
                      error: loanErrors.end_date
                    }
                  ),
                  /* @__PURE__ */ jsx(InputError, { message: loanErrors.end_date })
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "max-w-4xl", children: [
                /* @__PURE__ */ jsx(InputLabel, { value: "Notes" }),
                /* @__PURE__ */ jsx(
                  "textarea",
                  {
                    value: loanData.notes,
                    onChange: (event) => setLoanData("notes", event.target.value),
                    rows: 3,
                    className: `w-full rounded-xl border bg-zinc-50 px-5 py-2.5 text-sm transition focus:ring-zinc-300 ${loanErrors.notes ? "border-red-400" : "border-zinc-200"}`,
                    placeholder: "Optional loan reference or notes"
                  }
                ),
                /* @__PURE__ */ jsx(InputError, { message: loanErrors.notes })
              ] }),
              /* @__PURE__ */ jsx("div", { className: "flex justify-end", children: /* @__PURE__ */ jsx(
                "button",
                {
                  type: "submit",
                  disabled: loanProcessing,
                  className: "min-h-[42px] rounded-lg bg-emerald-600 px-6 py-2 text-sm font-medium text-white transition hover:bg-emerald-700 disabled:opacity-50",
                  children: loanProcessing ? "Saving..." : "Add Loan Reduction"
                }
              ) })
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs("div", { className: "mb-3", children: [
          /* @__PURE__ */ jsx("h2", { className: "text-base font-semibold text-zinc-900", children: "Loan Reduction Records" }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-zinc-500", children: "Active and recorded loan deductions for staff." })
        ] }),
        /* @__PURE__ */ jsxs(Table, { pagination: loanReductions, children: [
          /* @__PURE__ */ jsxs(Thead, { children: [
            /* @__PURE__ */ jsx(THdata, { children: "Staff" }),
            /* @__PURE__ */ jsx(THdata, { children: "Loan" }),
            /* @__PURE__ */ jsx(THdata, { children: "Loan Amount" }),
            /* @__PURE__ */ jsx(THdata, { children: "Monthly Reduction" }),
            /* @__PURE__ */ jsx(THdata, { children: "Start Date" }),
            /* @__PURE__ */ jsx(THdata, { children: "End Date" }),
            /* @__PURE__ */ jsx(THdata, { children: "Status" })
          ] }),
          /* @__PURE__ */ jsx(Tbody, { children: loanReductions?.data?.length ? loanReductions.data.map((reduction) => /* @__PURE__ */ jsxs(Trow, { children: [
            /* @__PURE__ */ jsx(Tdata, { children: /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("p", { className: "font-medium text-zinc-800", children: reduction.staff?.name ?? "N/A" }),
              /* @__PURE__ */ jsx("p", { className: "text-xs text-zinc-500", children: reduction.staff?.staff_number ?? "N/A" })
            ] }) }),
            /* @__PURE__ */ jsx(Tdata, { children: reduction.loan_name }),
            /* @__PURE__ */ jsx(Tdata, { children: money(reduction.principal_amount) }),
            /* @__PURE__ */ jsx(Tdata, { className: "font-semibold text-red-600", children: money(reduction.monthly_reduction) }),
            /* @__PURE__ */ jsx(Tdata, { children: reduction.start_date }),
            /* @__PURE__ */ jsx(Tdata, { children: reduction.end_date ?? "N/A" }),
            /* @__PURE__ */ jsx(Tdata, { children: /* @__PURE__ */ jsx("span", { className: "capitalize", children: reduction.status }) })
          ] }, reduction.id)) : /* @__PURE__ */ jsx(Trow, { children: /* @__PURE__ */ jsx(Tdata, { colSpan: "7", className: "py-4 text-center", children: "No loan reductions found." }) }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs("div", { className: "mb-3 flex flex-col gap-3 md:flex-row md:items-center md:justify-between", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h2", { className: "text-base font-semibold text-zinc-900", children: "Staff Salary Records" }),
            /* @__PURE__ */ jsx("p", { className: "text-sm text-zinc-500", children: "Current salary values from staff profiles." })
          ] }),
          /* @__PURE__ */ jsxs(
            "form",
            {
              onSubmit: submitSearch,
              className: "flex w-full gap-2 md:max-w-md",
              children: [
                /* @__PURE__ */ jsx(
                  TextInput,
                  {
                    value: search,
                    onChange: (event) => setSearch(event.target.value),
                    placeholder: "Search staff salary records"
                  }
                ),
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    type: "submit",
                    className: "rounded-lg bg-zinc-800 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-700",
                    children: "Search"
                  }
                )
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxs(Table, { pagination: staffs, children: [
          /* @__PURE__ */ jsxs(Thead, { children: [
            /* @__PURE__ */ jsx(THdata, { children: "Staff No" }),
            /* @__PURE__ */ jsx(THdata, { children: "Name" }),
            /* @__PURE__ */ jsx(THdata, { children: "Designation" }),
            /* @__PURE__ */ jsx(THdata, { children: "Department" }),
            /* @__PURE__ */ jsx(THdata, { children: "Status" }),
            /* @__PURE__ */ jsx(THdata, { children: "Salary" })
          ] }),
          /* @__PURE__ */ jsx(Tbody, { children: staffs?.data?.length ? staffs.data.map((staff) => /* @__PURE__ */ jsxs(Trow, { children: [
            /* @__PURE__ */ jsx(Tdata, { children: staff.staff_number }),
            /* @__PURE__ */ jsx(Tdata, { children: /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("p", { className: "font-medium text-zinc-800", children: staff.name }),
              /* @__PURE__ */ jsx("p", { className: "text-xs text-zinc-500", children: staff.email })
            ] }) }),
            /* @__PURE__ */ jsx(Tdata, { children: staff.designation ?? "N/A" }),
            /* @__PURE__ */ jsx(Tdata, { children: staff.department ?? "N/A" }),
            /* @__PURE__ */ jsx(Tdata, { children: /* @__PURE__ */ jsx("span", { className: "capitalize", children: staff.staff_status ?? "N/A" }) }),
            /* @__PURE__ */ jsx(Tdata, { className: "font-semibold text-zinc-800", children: money(staff.salary) })
          ] }, staff.id)) : /* @__PURE__ */ jsx(Trow, { children: /* @__PURE__ */ jsx(Tdata, { colSpan: "6", className: "py-4 text-center", children: "No salary records found." }) }) })
        ] })
      ] })
    ] })
  ] });
}
export {
  SalaryManagement as default
};
