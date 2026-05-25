import { jsxs, jsx } from "react/jsx-runtime";
import { Head } from "@inertiajs/react";
import { useState, useEffect } from "react";
import { A as AuthenticatedLayout } from "./AuthenticatedLayout-DYCvRbZH.js";
import { I as InputLabel } from "./InputLabel-DlDnrkJG.js";
import { S as SearchSelect } from "./SearchSelect-Bxy39qA_.js";
import { T as TextInput } from "./TextInput-DsoSnibl.js";
import "lucide-react";
import "react-toastify";
import "ziggy-js";
function ReportsIndex({ academicSessions = [] }) {
  const [outstandingBalance, setOutstandingBalance] = useState([]);
  const [overdueByDepartment, setOverdueByDepartment] = useState([]);
  const [collectionPerformance, setCollectionPerformance] = useState({});
  const [feePlanUsage, setFeePlanUsage] = useState([]);
  const [loading, setLoading] = useState(true);
  const [usageFilters, setUsageFilters] = useState({
    academic_session_id: "",
    year_of_study: "",
    session_number: ""
  });
  useEffect(() => {
    loadReports();
  }, []);
  useEffect(() => {
    loadFeePlanUsage();
  }, [
    usageFilters.academic_session_id,
    usageFilters.year_of_study,
    usageFilters.session_number
  ]);
  const loadReports = async () => {
    setLoading(true);
    try {
      const outstandingResponse = await fetch(
        route("reports.api.outstanding")
      );
      const outstandingData = await outstandingResponse.json();
      setOutstandingBalance(outstandingData);
      const overdueResponse = await fetch(route("reports.api.overdue"));
      const overdueData = await overdueResponse.json();
      setOverdueByDepartment(overdueData);
      const collectionResponse = await fetch(
        route("reports.api.collection")
      );
      const collectionData = await collectionResponse.json();
      setCollectionPerformance(collectionData);
      await loadFeePlanUsage();
    } catch (error) {
      console.error("Error loading reports:", error);
    } finally {
      setLoading(false);
    }
  };
  const loadFeePlanUsage = async () => {
    try {
      const usageResponse = await fetch(
        route("reports.api.usage", {
          academic_session_id: usageFilters.academic_session_id || void 0,
          year_of_study: usageFilters.year_of_study || void 0,
          session_number: usageFilters.session_number || void 0
        })
      );
      const usageData = await usageResponse.json();
      setFeePlanUsage(usageData);
    } catch (error) {
      console.error("Error loading fee plan usage:", error);
    }
  };
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD"
    }).format(amount);
  };
  if (loading) {
    return /* @__PURE__ */ jsxs(AuthenticatedLayout, { children: [
      /* @__PURE__ */ jsx(Head, { title: "Reports Dashboard" }),
      /* @__PURE__ */ jsx("div", { className: "flex h-64 items-center justify-center", children: /* @__PURE__ */ jsx("div", { className: "text-lg", children: "Loading reports..." }) })
    ] });
  }
  return /* @__PURE__ */ jsxs(AuthenticatedLayout, { children: [
    /* @__PURE__ */ jsx(Head, { title: "Reports Dashboard" }),
    /* @__PURE__ */ jsxs("div", { className: "mx-auto w-full space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsx("h1", { className: "text-lg font-semibold text-zinc-700", children: "Financial Reports Dashboard" }),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: loadReports,
            className: "rounded-lg bg-slate-600 px-4 py-2 text-white transition hover:bg-slate-800",
            children: "Refresh Data"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 gap-6 md:grid-cols-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "rounded-lg border border-zinc-100 bg-white p-6 shadow-sm", children: [
          /* @__PURE__ */ jsx("h3", { className: "text-sm font-medium text-zinc-500", children: "Total Invoiced" }),
          /* @__PURE__ */ jsx("p", { className: "text-2xl font-bold text-zinc-900", children: formatCurrency(
            collectionPerformance.total_invoiced || 0
          ) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "rounded-lg border border-zinc-100 bg-white p-6 shadow-sm", children: [
          /* @__PURE__ */ jsx("h3", { className: "text-sm font-medium text-zinc-500", children: "Total Collected" }),
          /* @__PURE__ */ jsx("p", { className: "text-2xl font-bold text-emerald-600", children: formatCurrency(
            collectionPerformance.total_collected || 0
          ) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "rounded-lg border border-zinc-100 bg-white p-6 shadow-sm", children: [
          /* @__PURE__ */ jsx("h3", { className: "text-sm font-medium text-zinc-500", children: "Outstanding" }),
          /* @__PURE__ */ jsx("p", { className: "text-2xl font-bold text-red-600", children: formatCurrency(
            collectionPerformance.outstanding || 0
          ) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "rounded-lg border border-zinc-100 bg-white p-6 shadow-sm", children: [
          /* @__PURE__ */ jsx("h3", { className: "text-sm font-medium text-zinc-500", children: "Collection Rate" }),
          /* @__PURE__ */ jsxs("p", { className: "text-2xl font-bold text-blue-600", children: [
            collectionPerformance.collection_rate || 0,
            "%"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "rounded-lg border border-zinc-100 bg-white p-6 shadow-sm", children: [
        /* @__PURE__ */ jsx("h2", { className: "mb-4 text-lg font-semibold text-zinc-700", children: "Outstanding Balance by Session" }),
        /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs("table", { className: "min-w-full divide-y divide-zinc-200", children: [
          /* @__PURE__ */ jsx("thead", { className: "bg-zinc-50", children: /* @__PURE__ */ jsxs("tr", { children: [
            /* @__PURE__ */ jsx("th", { className: "px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500", children: "Session" }),
            /* @__PURE__ */ jsx("th", { className: "px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500", children: "Total Outstanding" }),
            /* @__PURE__ */ jsx("th", { className: "px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500", children: "Invoice Count" })
          ] }) }),
          /* @__PURE__ */ jsxs("tbody", { className: "divide-y divide-zinc-200 bg-white", children: [
            outstandingBalance.map((item, index) => /* @__PURE__ */ jsxs("tr", { children: [
              /* @__PURE__ */ jsx("td", { className: "whitespace-nowrap px-6 py-4 text-sm font-medium text-zinc-900", children: item.session }),
              /* @__PURE__ */ jsx("td", { className: "whitespace-nowrap px-6 py-4 text-sm text-zinc-900", children: formatCurrency(
                item.total_outstanding
              ) }),
              /* @__PURE__ */ jsx("td", { className: "whitespace-nowrap px-6 py-4 text-sm text-zinc-900", children: item.invoice_count })
            ] }, index)),
            outstandingBalance.length === 0 && /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx(
              "td",
              {
                colSpan: "3",
                className: "px-6 py-4 text-center text-sm text-zinc-500",
                children: "No outstanding balances found"
              }
            ) })
          ] })
        ] }) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "rounded-lg border border-zinc-100 bg-white p-6 shadow-sm", children: [
        /* @__PURE__ */ jsx("h2", { className: "mb-4 text-lg font-semibold text-zinc-700", children: "Overdue Amounts by Department" }),
        /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs("table", { className: "min-w-full divide-y divide-zinc-200", children: [
          /* @__PURE__ */ jsx("thead", { className: "bg-zinc-50", children: /* @__PURE__ */ jsxs("tr", { children: [
            /* @__PURE__ */ jsx("th", { className: "px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500", children: "Department" }),
            /* @__PURE__ */ jsx("th", { className: "px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500", children: "Total Overdue" }),
            /* @__PURE__ */ jsx("th", { className: "px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500", children: "Overdue Count" })
          ] }) }),
          /* @__PURE__ */ jsxs("tbody", { className: "divide-y divide-zinc-200 bg-white", children: [
            overdueByDepartment.map((item, index) => /* @__PURE__ */ jsxs("tr", { children: [
              /* @__PURE__ */ jsx("td", { className: "whitespace-nowrap px-6 py-4 text-sm font-medium text-zinc-900", children: item.department_name }),
              /* @__PURE__ */ jsx("td", { className: "whitespace-nowrap px-6 py-4 text-sm font-medium text-red-600", children: formatCurrency(item.total_overdue) }),
              /* @__PURE__ */ jsx("td", { className: "whitespace-nowrap px-6 py-4 text-sm text-zinc-900", children: item.overdue_count })
            ] }, index)),
            overdueByDepartment.length === 0 && /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx(
              "td",
              {
                colSpan: "3",
                className: "px-6 py-4 text-center text-sm text-zinc-500",
                children: "No overdue amounts found"
              }
            ) })
          ] })
        ] }) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "rounded-lg border border-zinc-100 bg-white p-6 shadow-sm", children: [
        /* @__PURE__ */ jsxs("div", { className: "mb-4 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between", children: [
          /* @__PURE__ */ jsx("h2", { className: "text-lg font-semibold text-zinc-700", children: "Fee Plan Usage Statistics" }),
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 gap-4 md:grid-cols-3", children: [
            /* @__PURE__ */ jsxs("div", { className: "min-w-56", children: [
              /* @__PURE__ */ jsx(InputLabel, { value: "Academic Session" }),
              /* @__PURE__ */ jsx(
                SearchSelect,
                {
                  routeName: "academic-sessions.search",
                  defaultOptions: academicSessions,
                  placeholder: "Filter session...",
                  onChange: (item) => setUsageFilters((prev) => ({
                    ...prev,
                    academic_session_id: item.id
                  }))
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx(InputLabel, { value: "Year Of Study" }),
              /* @__PURE__ */ jsx(
                TextInput,
                {
                  type: "number",
                  min: "1",
                  value: usageFilters.year_of_study,
                  onChange: (e) => setUsageFilters((prev) => ({
                    ...prev,
                    year_of_study: e.target.value
                  })),
                  className: "w-full"
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx(InputLabel, { value: "Session Number" }),
              /* @__PURE__ */ jsx(
                TextInput,
                {
                  type: "number",
                  min: "1",
                  value: usageFilters.session_number,
                  onChange: (e) => setUsageFilters((prev) => ({
                    ...prev,
                    session_number: e.target.value
                  })),
                  className: "w-full"
                }
              )
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs("table", { className: "min-w-full divide-y divide-zinc-200", children: [
          /* @__PURE__ */ jsx("thead", { className: "bg-zinc-50", children: /* @__PURE__ */ jsxs("tr", { children: [
            /* @__PURE__ */ jsx("th", { className: "px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500", children: "Fee Plan" }),
            /* @__PURE__ */ jsx("th", { className: "px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500", children: "Year Of Study" }),
            /* @__PURE__ */ jsx("th", { className: "px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500", children: "Session Number" }),
            /* @__PURE__ */ jsx("th", { className: "px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500", children: "Assignment Count" }),
            /* @__PURE__ */ jsx("th", { className: "px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500", children: "ProgramVersion Count" })
          ] }) }),
          /* @__PURE__ */ jsxs("tbody", { className: "divide-y divide-zinc-200 bg-white", children: [
            feePlanUsage.map((item, index) => /* @__PURE__ */ jsxs("tr", { children: [
              /* @__PURE__ */ jsx("td", { className: "whitespace-nowrap px-6 py-4 text-sm font-medium text-zinc-900", children: item.plan_name }),
              /* @__PURE__ */ jsx("td", { className: "whitespace-nowrap px-6 py-4 text-sm text-zinc-900", children: item.year_of_study ?? "-" }),
              /* @__PURE__ */ jsx("td", { className: "whitespace-nowrap px-6 py-4 text-sm text-zinc-900", children: item.session_number ?? "-" }),
              /* @__PURE__ */ jsx("td", { className: "whitespace-nowrap px-6 py-4 text-sm text-zinc-900", children: item.assignment_count }),
              /* @__PURE__ */ jsx("td", { className: "whitespace-nowrap px-6 py-4 text-sm text-zinc-900", children: item.curriculum_count })
            ] }, index)),
            feePlanUsage.length === 0 && /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx(
              "td",
              {
                colSpan: "5",
                className: "px-6 py-4 text-center text-sm text-zinc-500",
                children: "No fee plan usage data found"
              }
            ) })
          ] })
        ] }) })
      ] })
    ] })
  ] });
}
export {
  ReportsIndex as default
};
