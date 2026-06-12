import { jsxs, Fragment, jsx } from "react/jsx-runtime";
import { Head, router } from "@inertiajs/react";
import { useState } from "react";
import { T as Table, a as Thead, b as THdata, c as Tbody, d as Trow, e as Tdata } from "./Tdata-BYbinPOB.js";
import { f as formatDate } from "./date-CQXYOX-2.js";
const currency = (amount) => `Ksh ${new Intl.NumberFormat("en-KE", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2
}).format(Number(amount || 0))}`;
function LedgerIndex({
  transactions,
  filters,
  types,
  sessions,
  summary
}) {
  const [sortField, setSortField] = useState(
    transactions.sort || "transaction_date"
  );
  const [sortDirection, setSortDirection] = useState(
    transactions.direction || "desc"
  );
  const [localFilters, setLocalFilters] = useState({
    search: filters.search || "",
    type: filters.type || "",
    academic_session_id: filters.academic_session_id || ""
  });
  const currentQuery = (extra = {}) => ({
    ...localFilters,
    sort: sortField,
    direction: sortDirection,
    ...extra
  });
  const applyFilters = (extra = {}) => {
    router.get(
      route("billing.ledger.index"),
      currentQuery(extra),
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
  const setFilter = (key, value) => {
    setLocalFilters((current) => ({ ...current, [key]: value }));
  };
  const submit = (event) => {
    event.preventDefault();
    applyFilters({ page: 1 });
  };
  const resetFilters = () => {
    const reset = {
      search: "",
      type: "",
      academic_session_id: ""
    };
    setLocalFilters(reset);
    router.get(
      route("billing.ledger.index"),
      { sort: sortField, direction: sortDirection, page: 1 },
      { preserveState: true, replace: true }
    );
  };
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(Head, { title: "Financial Ledger" }),
    /* @__PURE__ */ jsxs("div", { className: "mx-auto w-full space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700", children: [
      /* @__PURE__ */ jsx("div", { className: "flex items-center justify-between", children: /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h1", { className: "text-lg font-semibold text-zinc-700", children: "Financial Ledger" }),
        /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-zinc-500", children: "Core transaction history for invoices, payments, discounts, penalties, and reversals." })
      ] }) }),
      /* @__PURE__ */ jsxs("div", { className: "grid gap-4 md:grid-cols-3", children: [
        /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border border-zinc-100 bg-white p-5 shadow-sm", children: [
          /* @__PURE__ */ jsx("p", { className: "text-sm text-zinc-500", children: "Total Debits" }),
          /* @__PURE__ */ jsx("p", { className: "mt-2 text-2xl font-bold text-zinc-900", children: currency(summary.debit_total) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border border-zinc-100 bg-white p-5 shadow-sm", children: [
          /* @__PURE__ */ jsx("p", { className: "text-sm text-zinc-500", children: "Total Credits" }),
          /* @__PURE__ */ jsx("p", { className: "mt-2 text-2xl font-bold text-zinc-900", children: currency(summary.credit_total) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border border-zinc-100 bg-white p-5 shadow-sm", children: [
          /* @__PURE__ */ jsx("p", { className: "text-sm text-zinc-500", children: "Net Movement" }),
          /* @__PURE__ */ jsx("p", { className: "mt-2 text-2xl font-bold text-zinc-900", children: currency(summary.net_total) })
        ] })
      ] }),
      /* @__PURE__ */ jsxs(
        "form",
        {
          className: "mb-2 flex w-full flex-wrap items-center gap-3",
          onSubmit: submit,
          children: [
            /* @__PURE__ */ jsx("div", { className: "min-w-[220px] flex-1", children: /* @__PURE__ */ jsx(
              "input",
              {
                type: "text",
                value: localFilters.search,
                onChange: (e) => setFilter("search", e.target.value),
                placeholder: "Search reference, invoice, student...",
                className: "h-[34px] w-full rounded border border-slate-300 px-3 text-sm text-slate-700 focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-inset focus:ring-gray-500"
              }
            ) }),
            /* @__PURE__ */ jsx("div", { className: "min-w-[160px]", children: /* @__PURE__ */ jsxs(
              "select",
              {
                value: localFilters.type,
                onChange: (e) => setFilter("type", e.target.value),
                className: "h-[34px] w-full rounded border border-slate-300 bg-white px-3 text-sm text-slate-700 focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-inset focus:ring-gray-500",
                children: [
                  /* @__PURE__ */ jsx("option", { value: "", children: "All Types" }),
                  types.map((type) => /* @__PURE__ */ jsx("option", { value: type, children: type.charAt(0).toUpperCase() + type.slice(1) }, type))
                ]
              }
            ) }),
            /* @__PURE__ */ jsx("div", { className: "min-w-[220px]", children: /* @__PURE__ */ jsxs(
              "select",
              {
                value: localFilters.academic_session_id,
                onChange: (e) => setFilter(
                  "academic_session_id",
                  e.target.value
                ),
                className: "h-[34px] w-full rounded border border-slate-300 bg-white px-3 text-sm text-slate-700 focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-inset focus:ring-gray-500",
                children: [
                  /* @__PURE__ */ jsx("option", { value: "", children: "All Sessions" }),
                  sessions.map((session) => /* @__PURE__ */ jsx("option", { value: session.id, children: session.name }, session.id))
                ]
              }
            ) }),
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "submit",
                className: "h-[34px] rounded bg-emerald-600 px-4 text-sm font-medium text-white transition-colors hover:bg-slate-700",
                children: "Search"
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                onClick: resetFilters,
                className: "h-[34px] rounded bg-zinc-500 px-4 text-sm font-medium text-white transition-colors hover:bg-zinc-600",
                children: "Reset"
              }
            )
          ]
        }
      ),
      /* @__PURE__ */ jsx("div", { className: "overflow-hidden rounded-2xl border border-zinc-100 bg-white shadow-sm", children: /* @__PURE__ */ jsxs(
        Table,
        {
          pagination: transactions,
          sortField,
          sortDirection,
          children: [
            /* @__PURE__ */ jsxs(Thead, { children: [
              /* @__PURE__ */ jsxs(
                THdata,
                {
                  onClick: () => handleSort("transaction_date"),
                  className: "cursor-pointer",
                  children: [
                    "Date ",
                    renderArrow("transaction_date")
                  ]
                }
              ),
              /* @__PURE__ */ jsx(THdata, { children: "Student" }),
              /* @__PURE__ */ jsxs(
                THdata,
                {
                  onClick: () => handleSort("type"),
                  className: "cursor-pointer",
                  children: [
                    "Type ",
                    renderArrow("type")
                  ]
                }
              ),
              /* @__PURE__ */ jsx(THdata, { children: "Reference" }),
              /* @__PURE__ */ jsx(THdata, { children: "Session" }),
              /* @__PURE__ */ jsxs(
                THdata,
                {
                  onClick: () => handleSort("debit"),
                  className: "cursor-pointer",
                  children: [
                    "Debit ",
                    renderArrow("debit")
                  ]
                }
              ),
              /* @__PURE__ */ jsxs(
                THdata,
                {
                  onClick: () => handleSort("credit"),
                  className: "cursor-pointer",
                  children: [
                    "Credit ",
                    renderArrow("credit")
                  ]
                }
              ),
              /* @__PURE__ */ jsx(THdata, { children: "Description" }),
              /* @__PURE__ */ jsx(THdata, { children: "Recorded By" })
            ] }),
            /* @__PURE__ */ jsx(Tbody, { children: transactions?.data?.length ? transactions.data.map((transaction) => /* @__PURE__ */ jsxs(Trow, { children: [
              /* @__PURE__ */ jsx(Tdata, { children: formatDate(
                transaction.transaction_date
              ) }),
              /* @__PURE__ */ jsxs(Tdata, { children: [
                transaction.student || "-",
                /* @__PURE__ */ jsx("br", {}),
                /* @__PURE__ */ jsx("span", { className: "text-xs text-zinc-500", children: transaction.admission_number || "" })
              ] }),
              /* @__PURE__ */ jsx(Tdata, { children: /* @__PURE__ */ jsx("span", { className: "rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold capitalize text-slate-700", children: transaction.type }) }),
              /* @__PURE__ */ jsx(Tdata, { children: transaction.reference || "-" }),
              /* @__PURE__ */ jsx(Tdata, { children: transaction.session || "-" }),
              /* @__PURE__ */ jsx(Tdata, { className: "font-medium text-red-600", children: transaction.debit ? currency(transaction.debit) : "-" }),
              /* @__PURE__ */ jsx(Tdata, { className: "font-medium text-emerald-600", children: transaction.credit ? currency(transaction.credit) : "-" }),
              /* @__PURE__ */ jsx(Tdata, { children: transaction.description || "-" }),
              /* @__PURE__ */ jsx(Tdata, { children: transaction.created_by || "-" })
            ] }, transaction.id)) : /* @__PURE__ */ jsx(Trow, { children: /* @__PURE__ */ jsx(
              Tdata,
              {
                colSpan: "9",
                className: "py-8 text-center text-zinc-500",
                children: "No ledger transactions found."
              }
            ) }) })
          ]
        }
      ) })
    ] })
  ] });
}
export {
  LedgerIndex as default
};
