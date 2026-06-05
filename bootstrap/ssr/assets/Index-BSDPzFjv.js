import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { Head, Link } from "@inertiajs/react";
import { useState, useEffect } from "react";
import { A as AuthenticatedLayout } from "../app.js";
import { I as InputLabel } from "./InputLabel-DlDnrkJG.js";
import { L as LoadingSpinner } from "./LoadingSpinner-BaF8hB9B.js";
import { T as TextInput } from "./TextInput-DsoSnibl.js";
import { S as SearchSelect } from "./SearchSelect-8eQtXAlf.js";
import "axios";
import "lucide-react";
import "react-toastify";
import "react-dom/client";
import "react-spinners";
import "ziggy-js";
const ANALYTICS_SECTIONS = [
  { key: "all", label: "Overview", routeName: "reports.dashboard" },
  { key: "executive", label: "Executive", routeName: "reports.executive" },
  { key: "finance", label: "Finance", routeName: "reports.finance" },
  { key: "academic", label: "Academic", routeName: "reports.academic" },
  {
    key: "admissions",
    label: "Admissions",
    routeName: "reports.admissions"
  },
  { key: "hostel", label: "Hostel", routeName: "reports.hostel" },
  {
    key: "data-quality",
    label: "Data Quality",
    routeName: "reports.data-quality"
  },
  {
    key: "snapshots",
    label: "Snapshot Trends",
    routeName: "reports.snapshots"
  }
];
function ReportsIndex({
  academicSessions = [],
  activeSection = "all",
  pageTitle = "Reports Dashboard",
  pageDescription = "A consolidated analytics workspace."
}) {
  const emptyExecutiveSummary = {
    active_session: null,
    metrics: {
      total_students: 0,
      active_students: 0,
      new_admissions_this_month: 0,
      students_registered_in_active_session: 0,
      eligible_students_for_active_session: 0,
      session_registration_rate: 0,
      hostel_occupancy_rate: 0,
      occupied_beds: 0,
      active_beds: 0,
      total_invoiced: 0,
      total_collected: 0,
      outstanding_balance: 0,
      overdue_balance: 0
    },
    breakdowns: {
      top_courses: [],
      student_statuses: []
    }
  };
  const [academicSummary, setAcademicSummary] = useState(null);
  const [admissionsSummary, setAdmissionsSummary] = useState(null);
  const [dataQualitySummary, setDataQualitySummary] = useState(null);
  const [executiveSummary, setExecutiveSummary] = useState(emptyExecutiveSummary);
  const [executiveError, setExecutiveError] = useState(null);
  const [financeSummary, setFinanceSummary] = useState(null);
  const [hostelSummary, setHostelSummary] = useState(null);
  const [snapshotTrends, setSnapshotTrends] = useState(null);
  const [outstandingBalance, setOutstandingBalance] = useState([]);
  const [overdueByDepartment, setOverdueByDepartment] = useState([]);
  const [collectionPerformance, setCollectionPerformance] = useState({});
  const [feePlanUsage, setFeePlanUsage] = useState([]);
  const [loading, setLoading] = useState(true);
  const [financeSectionLoading, setFinanceSectionLoading] = useState({});
  const [loadedFinanceSections, setLoadedFinanceSections] = useState({
    collection: false,
    outstanding: false,
    overdue: false,
    usage: false
  });
  const [usageFilters, setUsageFilters] = useState({
    academic_session_id: "",
    year_of_study: "",
    session_number: ""
  });
  const showExecutive = activeSection === "all" || activeSection === "executive";
  const showFinance = activeSection === "all" || activeSection === "finance";
  const showAcademic = activeSection === "all" || activeSection === "academic";
  const showAdmissions = activeSection === "all" || activeSection === "admissions";
  const showHostel = activeSection === "all" || activeSection === "hostel";
  const showDataQuality = activeSection === "all" || activeSection === "data-quality";
  const showSnapshots = activeSection === "all" || activeSection === "snapshots";
  const financeOnlyPage = activeSection === "finance";
  useEffect(() => {
    loadReports();
  }, []);
  useEffect(() => {
    if (!showFinance || !loadedFinanceSections.usage) {
      return;
    }
    loadFeePlanUsage();
  }, [
    showFinance,
    loadedFinanceSections.usage,
    usageFilters.academic_session_id,
    usageFilters.year_of_study,
    usageFilters.session_number
  ]);
  const loadReports = async () => {
    setLoading(true);
    try {
      if (showExecutive) {
        const executiveResponse = await fetch(
          route("reports.api.executive-summary")
        );
        if (!executiveResponse.ok) {
          throw new Error(
            `Executive summary request failed with status ${executiveResponse.status}.`
          );
        }
        const executiveData = await executiveResponse.json();
        setExecutiveSummary({
          ...emptyExecutiveSummary,
          ...executiveData,
          metrics: {
            ...emptyExecutiveSummary.metrics,
            ...executiveData.metrics ?? {}
          },
          breakdowns: {
            ...emptyExecutiveSummary.breakdowns,
            ...executiveData.breakdowns ?? {}
          }
        });
        setExecutiveError(null);
      }
      if (showFinance) {
        const financeResponse = await fetch(
          route("reports.api.finance-summary")
        );
        const financeData = await financeResponse.json();
        setFinanceSummary(financeData);
        if (!financeOnlyPage) {
          const outstandingResponse = await fetch(
            route("reports.api.outstanding")
          );
          const outstandingData = await outstandingResponse.json();
          setOutstandingBalance(outstandingData);
          const overdueResponse = await fetch(
            route("reports.api.overdue")
          );
          const overdueData = await overdueResponse.json();
          setOverdueByDepartment(overdueData);
          const collectionResponse = await fetch(
            route("reports.api.collection")
          );
          const collectionData = await collectionResponse.json();
          setCollectionPerformance(collectionData);
          setLoadedFinanceSections({
            collection: true,
            outstanding: true,
            overdue: true,
            usage: true
          });
          await loadFeePlanUsage();
        }
      }
      if (showAcademic) {
        const academicResponse = await fetch(
          route("reports.api.academic-summary")
        );
        const academicData = await academicResponse.json();
        setAcademicSummary(academicData);
      }
      if (showAdmissions) {
        const admissionsResponse = await fetch(
          route("reports.api.admissions-summary")
        );
        const admissionsData = await admissionsResponse.json();
        setAdmissionsSummary(admissionsData);
      }
      if (showHostel) {
        const hostelResponse = await fetch(
          route("reports.api.hostel-summary")
        );
        const hostelData = await hostelResponse.json();
        setHostelSummary(hostelData);
      }
      if (showDataQuality) {
        const dataQualityResponse = await fetch(
          route("reports.api.data-quality-summary")
        );
        const dataQualityData = await dataQualityResponse.json();
        setDataQualitySummary(dataQualityData);
      }
      if (showSnapshots) {
        const snapshotResponse = await fetch(
          route("reports.api.snapshot-trends", { days: 14 })
        );
        const snapshotData = await snapshotResponse.json();
        setSnapshotTrends(snapshotData);
      }
    } catch (error) {
      console.error("Error loading reports:", error);
      if (showExecutive) {
        setExecutiveSummary(emptyExecutiveSummary);
        setExecutiveError(
          error?.message || "Unable to load executive analytics right now."
        );
      }
    } finally {
      setLoading(false);
    }
  };
  const loadFeePlanUsage = async () => {
    if (!showFinance) {
      return;
    }
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
  const loadFinanceSection = async (section) => {
    if (financeSectionLoading[section] || loadedFinanceSections[section]) {
      return;
    }
    setFinanceSectionLoading((current) => ({
      ...current,
      [section]: true
    }));
    try {
      if (section === "collection") {
        const response = await fetch(route("reports.api.collection"));
        const data = await response.json();
        setCollectionPerformance(data);
      }
      if (section === "outstanding") {
        const response = await fetch(route("reports.api.outstanding"));
        const data = await response.json();
        setOutstandingBalance(data);
      }
      if (section === "overdue") {
        const response = await fetch(route("reports.api.overdue"));
        const data = await response.json();
        setOverdueByDepartment(data);
      }
      if (section === "usage") {
        await loadFeePlanUsage();
      }
      setLoadedFinanceSections((current) => ({
        ...current,
        [section]: true
      }));
    } catch (error) {
      console.error(`Error loading finance ${section}:`, error);
    } finally {
      setFinanceSectionLoading((current) => ({
        ...current,
        [section]: false
      }));
    }
  };
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "KES"
    }).format(amount);
  };
  if (loading) {
    return /* @__PURE__ */ jsxs(AuthenticatedLayout, { children: [
      /* @__PURE__ */ jsx(Head, { title: pageTitle }),
      /* @__PURE__ */ jsx("div", { className: "flex h-64 items-center justify-center", children: /* @__PURE__ */ jsx(
        LoadingSpinner,
        {
          size: "lg",
          centered: true
        }
      ) })
    ] });
  }
  return /* @__PURE__ */ jsxs(AuthenticatedLayout, { children: [
    /* @__PURE__ */ jsx(Head, { title: pageTitle }),
    /* @__PURE__ */ jsxs("div", { className: "mx-auto w-full space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700", children: [
      /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border border-zinc-100 bg-white p-6 shadow-sm", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between", children: [
          /* @__PURE__ */ jsxs("div", { className: "max-w-3xl", children: [
            /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold uppercase tracking-[0.25em] text-emerald-600", children: "Analytics" }),
            /* @__PURE__ */ jsx("h1", { className: "mt-2 text-2xl font-semibold text-zinc-800", children: pageTitle }),
            /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm text-zinc-500", children: pageDescription })
          ] }),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: loadReports,
              className: "rounded-lg bg-slate-600 px-4 py-2 text-white transition hover:bg-slate-800",
              children: "Refresh Data"
            }
          )
        ] }),
        /* @__PURE__ */ jsx("div", { className: "mt-5 flex flex-wrap gap-3", children: ANALYTICS_SECTIONS.map((section) => {
          const isActive = section.key === activeSection;
          return /* @__PURE__ */ jsx(
            Link,
            {
              href: route(section.routeName),
              className: `rounded-full px-4 py-2 text-sm font-medium transition ${isActive ? "bg-emerald-600 text-white shadow-sm" : "border border-zinc-200 bg-zinc-50 text-zinc-600 hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700"}`,
              children: section.label
            },
            section.key
          );
        }) })
      ] }),
      showExecutive && /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsxs("div", { className: "rounded-lg border border-zinc-100 bg-white p-6 shadow-sm", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-2 lg:flex-row lg:items-end lg:justify-between", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("h2", { className: "text-lg font-semibold text-zinc-700", children: "Executive Overview" }),
              /* @__PURE__ */ jsx("p", { className: "text-sm text-zinc-500", children: "A quick institutional snapshot built from secured aggregate metrics." })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "text-sm text-zinc-500", children: [
              "Active Session:",
              " ",
              /* @__PURE__ */ jsx("span", { className: "font-medium text-zinc-700", children: executiveSummary.active_session?.label ?? "No active session" })
            ] })
          ] }),
          executiveError ? /* @__PURE__ */ jsx("div", { className: "mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700", children: executiveError }) : null,
          /* @__PURE__ */ jsxs("div", { className: "mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5", children: [
            /* @__PURE__ */ jsx(
              MetricCard,
              {
                label: "Total Students",
                value: executiveSummary.metrics.total_students
              }
            ),
            /* @__PURE__ */ jsx(
              MetricCard,
              {
                label: "Active Students",
                value: executiveSummary.metrics.active_students
              }
            ),
            /* @__PURE__ */ jsx(
              MetricCard,
              {
                label: "New Admissions This Month",
                value: executiveSummary.metrics.new_admissions_this_month
              }
            ),
            /* @__PURE__ */ jsx(
              MetricCard,
              {
                label: "Registered In Active Session",
                value: executiveSummary.metrics.students_registered_in_active_session,
                helper: `${executiveSummary.metrics.session_registration_rate}% registration rate`
              }
            ),
            /* @__PURE__ */ jsx(
              MetricCard,
              {
                label: "Hostel Occupancy",
                value: `${executiveSummary.metrics.hostel_occupancy_rate}%`,
                helper: `${executiveSummary.metrics.occupied_beds} of ${executiveSummary.metrics.active_beds} active beds occupied`
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4", children: [
            /* @__PURE__ */ jsx(
              MetricCard,
              {
                label: "Total Invoiced",
                value: formatCurrency(
                  executiveSummary.metrics.total_invoiced
                ),
                accent: "text-zinc-900"
              }
            ),
            /* @__PURE__ */ jsx(
              MetricCard,
              {
                label: "Total Collected",
                value: formatCurrency(
                  executiveSummary.metrics.total_collected
                ),
                accent: "text-emerald-600"
              }
            ),
            /* @__PURE__ */ jsx(
              MetricCard,
              {
                label: "Outstanding Balance",
                value: formatCurrency(
                  executiveSummary.metrics.outstanding_balance
                ),
                accent: "text-amber-600"
              }
            ),
            /* @__PURE__ */ jsx(
              MetricCard,
              {
                label: "Overdue Balance",
                value: formatCurrency(
                  executiveSummary.metrics.overdue_balance
                ),
                accent: "text-red-600"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 gap-6 xl:grid-cols-2", children: [
          /* @__PURE__ */ jsxs("div", { className: "rounded-lg border border-zinc-100 bg-white p-6 shadow-sm", children: [
            /* @__PURE__ */ jsx("h2", { className: "mb-4 text-lg font-semibold text-zinc-700", children: "Top Courses By Enrollment" }),
            /* @__PURE__ */ jsx("div", { className: "space-y-4", children: executiveSummary.breakdowns.top_courses?.length ? executiveSummary.breakdowns.top_courses.map(
              (course) => /* @__PURE__ */ jsx(
                "div",
                {
                  className: "rounded-lg border border-zinc-100 bg-zinc-50 px-4 py-3",
                  children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-4", children: [
                    /* @__PURE__ */ jsx("p", { className: "font-medium text-zinc-800", children: course.name }),
                    /* @__PURE__ */ jsxs("span", { className: "rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700", children: [
                      course.student_count,
                      " students"
                    ] })
                  ] })
                },
                course.id
              )
            ) : /* @__PURE__ */ jsx("p", { className: "text-sm text-zinc-500", children: "No course enrollment data available." }) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "rounded-lg border border-zinc-100 bg-white p-6 shadow-sm", children: [
            /* @__PURE__ */ jsx("h2", { className: "mb-4 text-lg font-semibold text-zinc-700", children: "Student Status Breakdown" }),
            /* @__PURE__ */ jsx("div", { className: "space-y-4", children: executiveSummary.breakdowns.student_statuses?.length ? executiveSummary.breakdowns.student_statuses.map(
              (status) => /* @__PURE__ */ jsxs(
                "div",
                {
                  className: "flex items-center justify-between rounded-lg border border-zinc-100 bg-zinc-50 px-4 py-3",
                  children: [
                    /* @__PURE__ */ jsx("p", { className: "capitalize text-zinc-700", children: status.status }),
                    /* @__PURE__ */ jsx("span", { className: "font-semibold text-zinc-900", children: status.total })
                  ]
                },
                status.status
              )
            ) : /* @__PURE__ */ jsx("p", { className: "text-sm text-zinc-500", children: "No student status data available." }) })
          ] })
        ] })
      ] }),
      showFinance && financeSummary && /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsxs("div", { className: "rounded-lg border border-zinc-100 bg-white p-6 shadow-sm", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-2 lg:flex-row lg:items-end lg:justify-between", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("h2", { className: "text-lg font-semibold text-zinc-700", children: "Finance Analytics" }),
              /* @__PURE__ */ jsx("p", { className: "text-sm text-zinc-500", children: "Billing health, payment behavior, debt exposure, and finance exception monitoring." })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "text-xs text-zinc-500", children: "Excluding rejected invoices from finance totals" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5", children: [
            /* @__PURE__ */ jsx(
              MetricCard,
              {
                label: "Collection Rate",
                value: `${financeSummary.metrics.collection_rate}%`,
                accent: "text-blue-600"
              }
            ),
            /* @__PURE__ */ jsx(
              MetricCard,
              {
                label: "Overdue Invoices",
                value: financeSummary.metrics.overdue_invoice_count,
                accent: "text-red-600"
              }
            ),
            /* @__PURE__ */ jsx(
              MetricCard,
              {
                label: "Approval Backlog",
                value: financeSummary.metrics.approval_backlog_count,
                accent: "text-amber-600"
              }
            ),
            /* @__PURE__ */ jsx(
              MetricCard,
              {
                label: "Manual Billing Ops",
                value: financeSummary.metrics.manual_billing_operation_count
              }
            ),
            /* @__PURE__ */ jsx(
              MetricCard,
              {
                label: "Students With Credit",
                value: financeSummary.metrics.credit_balance_students,
                accent: "text-emerald-600"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 gap-6 xl:grid-cols-2", children: [
          /* @__PURE__ */ jsxs("div", { className: "rounded-lg border border-zinc-100 bg-white p-6 shadow-sm", children: [
            /* @__PURE__ */ jsx("h2", { className: "mb-4 text-lg font-semibold text-zinc-700", children: "Overdue Aging Buckets" }),
            /* @__PURE__ */ jsx("div", { className: "space-y-4", children: financeSummary.aging.map((bucket) => /* @__PURE__ */ jsxs(
              "div",
              {
                className: "flex items-center justify-between rounded-lg border border-zinc-100 bg-zinc-50 px-4 py-3",
                children: [
                  /* @__PURE__ */ jsx("p", { className: "text-zinc-700", children: bucket.label }),
                  /* @__PURE__ */ jsx("span", { className: "font-semibold text-zinc-900", children: formatCurrency(bucket.amount) })
                ]
              },
              bucket.label
            )) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "rounded-lg border border-zinc-100 bg-white p-6 shadow-sm", children: [
            /* @__PURE__ */ jsx("h2", { className: "mb-4 text-lg font-semibold text-zinc-700", children: "Payment Method Breakdown" }),
            /* @__PURE__ */ jsx("div", { className: "space-y-4", children: financeSummary.breakdowns.payment_methods?.length ? financeSummary.breakdowns.payment_methods.map(
              (method) => /* @__PURE__ */ jsxs(
                "div",
                {
                  className: "rounded-lg border border-zinc-100 bg-zinc-50 px-4 py-3",
                  children: [
                    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-4", children: [
                      /* @__PURE__ */ jsx("p", { className: "capitalize font-medium text-zinc-800", children: method.method }),
                      /* @__PURE__ */ jsxs("span", { className: "text-sm text-zinc-500", children: [
                        method.payment_count,
                        " payments"
                      ] })
                    ] }),
                    /* @__PURE__ */ jsx("p", { className: "mt-2 font-semibold text-zinc-900", children: formatCurrency(
                      method.total_amount
                    ) })
                  ]
                },
                method.method
              )
            ) : /* @__PURE__ */ jsx("p", { className: "text-sm text-zinc-500", children: "No completed payment data available." }) })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 gap-6 xl:grid-cols-3", children: [
          /* @__PURE__ */ jsxs("div", { className: "rounded-lg border border-zinc-100 bg-white p-6 shadow-sm", children: [
            /* @__PURE__ */ jsx("h2", { className: "mb-4 text-lg font-semibold text-zinc-700", children: "Invoice Status Mix" }),
            /* @__PURE__ */ jsx("div", { className: "space-y-3", children: financeSummary.breakdowns.invoice_statuses?.length ? financeSummary.breakdowns.invoice_statuses.map(
              (status) => /* @__PURE__ */ jsxs(
                "div",
                {
                  className: "flex items-center justify-between rounded-lg bg-zinc-50 px-4 py-3",
                  children: [
                    /* @__PURE__ */ jsx("p", { className: "capitalize text-zinc-700", children: status.status }),
                    /* @__PURE__ */ jsx("span", { className: "font-semibold text-zinc-900", children: status.invoice_count })
                  ]
                },
                status.status
              )
            ) : /* @__PURE__ */ jsx("p", { className: "text-sm text-zinc-500", children: "No invoice status data available." }) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "rounded-lg border border-zinc-100 bg-white p-6 shadow-sm xl:col-span-2", children: [
            /* @__PURE__ */ jsx("h2", { className: "mb-4 text-lg font-semibold text-zinc-700", children: "Adjustment Summary" }),
            /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs("table", { className: "min-w-full divide-y divide-zinc-200", children: [
              /* @__PURE__ */ jsx("thead", { className: "bg-zinc-50", children: /* @__PURE__ */ jsxs("tr", { children: [
                /* @__PURE__ */ jsx("th", { className: "px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500", children: "Type" }),
                /* @__PURE__ */ jsx("th", { className: "px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500", children: "Count" }),
                /* @__PURE__ */ jsx("th", { className: "px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500", children: "Total Amount" })
              ] }) }),
              /* @__PURE__ */ jsx("tbody", { className: "divide-y divide-zinc-200 bg-white", children: financeSummary.breakdowns.adjustments?.length ? financeSummary.breakdowns.adjustments.map(
                (adjustment) => /* @__PURE__ */ jsxs(
                  "tr",
                  {
                    children: [
                      /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-sm capitalize text-zinc-800", children: adjustment.type }),
                      /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-sm text-zinc-700", children: adjustment.adjustment_count }),
                      /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-sm font-medium text-zinc-900", children: formatCurrency(
                        adjustment.total_amount
                      ) })
                    ]
                  },
                  adjustment.type
                )
              ) : /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx(
                "td",
                {
                  colSpan: "3",
                  className: "px-4 py-3 text-center text-sm text-zinc-500",
                  children: "No adjustment data found"
                }
              ) }) })
            ] }) })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 gap-6 xl:grid-cols-2", children: [
          /* @__PURE__ */ jsxs("div", { className: "rounded-lg border border-zinc-100 bg-white p-6 shadow-sm", children: [
            /* @__PURE__ */ jsx("h2", { className: "mb-4 text-lg font-semibold text-zinc-700", children: "Collection Trend" }),
            /* @__PURE__ */ jsx("div", { className: "space-y-4", children: financeSummary.breakdowns.collection_trend?.length ? financeSummary.breakdowns.collection_trend.map(
              (trend) => /* @__PURE__ */ jsx(
                "div",
                {
                  className: "rounded-lg border border-zinc-100 bg-zinc-50 px-4 py-3",
                  children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-4", children: [
                    /* @__PURE__ */ jsx("p", { className: "font-medium text-zinc-800", children: trend.month }),
                    /* @__PURE__ */ jsxs("div", { className: "text-right text-sm", children: [
                      /* @__PURE__ */ jsxs("p", { className: "text-zinc-500", children: [
                        "Invoiced:",
                        " ",
                        formatCurrency(
                          trend.invoiced
                        )
                      ] }),
                      /* @__PURE__ */ jsxs("p", { className: "font-semibold text-emerald-700", children: [
                        "Collected:",
                        " ",
                        formatCurrency(
                          trend.collected
                        )
                      ] })
                    ] })
                  ] })
                },
                trend.month
              )
            ) : /* @__PURE__ */ jsx("p", { className: "text-sm text-zinc-500", children: "No trend data available." }) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "rounded-lg border border-zinc-100 bg-white p-6 shadow-sm", children: [
            /* @__PURE__ */ jsx("h2", { className: "mb-4 text-lg font-semibold text-zinc-700", children: "Credit Balance Exceptions" }),
            /* @__PURE__ */ jsx("div", { className: "space-y-4", children: financeSummary.exceptions.credit_balances?.length ? financeSummary.exceptions.credit_balances.map(
              (student) => /* @__PURE__ */ jsx(
                "div",
                {
                  className: "rounded-lg border border-zinc-100 bg-zinc-50 px-4 py-3",
                  children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-4", children: [
                    /* @__PURE__ */ jsxs("div", { children: [
                      /* @__PURE__ */ jsx("p", { className: "font-medium text-zinc-800", children: student.student_name }),
                      /* @__PURE__ */ jsx("p", { className: "text-sm text-zinc-500", children: student.registration_number })
                    ] }),
                    /* @__PURE__ */ jsx("span", { className: "font-semibold text-emerald-700", children: formatCurrency(
                      student.credit_balance
                    ) })
                  ] })
                },
                student.student_id
              )
            ) : /* @__PURE__ */ jsx("p", { className: "text-sm text-zinc-500", children: "No student credit balances found." }) })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "rounded-lg border border-zinc-100 bg-white p-6 shadow-sm", children: [
          /* @__PURE__ */ jsx("h2", { className: "mb-4 text-lg font-semibold text-zinc-700", children: "Payments Without Full Allocation" }),
          /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs("table", { className: "min-w-full divide-y divide-zinc-200", children: [
            /* @__PURE__ */ jsx("thead", { className: "bg-zinc-50", children: /* @__PURE__ */ jsxs("tr", { children: [
              /* @__PURE__ */ jsx("th", { className: "px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500", children: "Reference" }),
              /* @__PURE__ */ jsx("th", { className: "px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500", children: "Student" }),
              /* @__PURE__ */ jsx("th", { className: "px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500", children: "Reg. No" }),
              /* @__PURE__ */ jsx("th", { className: "px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500", children: "Unallocated" })
            ] }) }),
            /* @__PURE__ */ jsx("tbody", { className: "divide-y divide-zinc-200 bg-white", children: financeSummary.exceptions.payments_without_allocations?.length ? financeSummary.exceptions.payments_without_allocations.map(
              (payment) => /* @__PURE__ */ jsxs(
                "tr",
                {
                  children: [
                    /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-sm text-zinc-800", children: payment.reference }),
                    /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-sm text-zinc-700", children: payment.student_name || "Unlinked student" }),
                    /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-sm text-zinc-700", children: payment.registration_number || "-" }),
                    /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-sm font-medium text-red-600", children: formatCurrency(
                      payment.unallocated_amount
                    ) })
                  ]
                },
                payment.payment_id
              )
            ) : /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx(
              "td",
              {
                colSpan: "4",
                className: "px-4 py-3 text-center text-sm text-zinc-500",
                children: "No payment allocation exceptions found"
              }
            ) }) })
          ] }) })
        ] })
      ] }),
      showAcademic && academicSummary && /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsxs("div", { className: "rounded-lg border border-zinc-100 bg-white p-6 shadow-sm", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-2 lg:flex-row lg:items-end lg:justify-between", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("h2", { className: "text-lg font-semibold text-zinc-700", children: "Academic Operations Analytics" }),
              /* @__PURE__ */ jsx("p", { className: "text-sm text-zinc-500", children: "Session registration, timetable delivery, utilization, and operational exception monitoring." })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "text-sm text-zinc-500", children: [
              "Active Session:",
              " ",
              /* @__PURE__ */ jsx("span", { className: "font-medium text-zinc-700", children: academicSummary.active_session?.label ?? "No active session" })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5", children: [
            /* @__PURE__ */ jsx(
              MetricCard,
              {
                label: "Session Registration Rate",
                value: `${academicSummary.metrics.session_registration_rate}%`,
                accent: "text-blue-600"
              }
            ),
            /* @__PURE__ */ jsx(
              MetricCard,
              {
                label: "Registered Students",
                value: academicSummary.metrics.registered_students
              }
            ),
            /* @__PURE__ */ jsx(
              MetricCard,
              {
                label: "Eligible Students",
                value: academicSummary.metrics.eligible_students
              }
            ),
            /* @__PURE__ */ jsx(
              MetricCard,
              {
                label: "Timetable Completion",
                value: `${academicSummary.metrics.timetable_completion_rate}%`,
                accent: "text-emerald-600"
              }
            ),
            /* @__PURE__ */ jsx(
              MetricCard,
              {
                label: "Units Without Timetable",
                value: academicSummary.exceptions.units_without_timetable?.length ?? 0,
                accent: "text-amber-600"
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4", children: [
            /* @__PURE__ */ jsx(
              MetricCard,
              {
                label: "Students Not Registered",
                value: academicSummary.metrics.students_not_registered_count,
                accent: "text-red-600"
              }
            ),
            /* @__PURE__ */ jsx(
              MetricCard,
              {
                label: "Mapped Units",
                value: academicSummary.metrics.mapped_units_count
              }
            ),
            /* @__PURE__ */ jsx(
              MetricCard,
              {
                label: "Lecturer Clashes",
                value: academicSummary.metrics.lecturer_clash_count,
                accent: "text-red-600"
              }
            ),
            /* @__PURE__ */ jsx(
              MetricCard,
              {
                label: "Room Clashes",
                value: academicSummary.metrics.room_clash_count,
                accent: "text-red-600"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 gap-6 xl:grid-cols-2", children: [
          /* @__PURE__ */ jsxs("div", { className: "rounded-lg border border-zinc-100 bg-white p-6 shadow-sm", children: [
            /* @__PURE__ */ jsx("h2", { className: "mb-4 text-lg font-semibold text-zinc-700", children: "Students by Module" }),
            /* @__PURE__ */ jsx("div", { className: "space-y-3", children: academicSummary.breakdowns.students_by_module?.length ? academicSummary.breakdowns.students_by_module.map(
              (row) => /* @__PURE__ */ jsxs(
                "div",
                {
                  className: "flex items-center justify-between rounded-lg bg-zinc-50 px-4 py-3",
                  children: [
                    /* @__PURE__ */ jsxs("p", { className: "text-zinc-700", children: [
                      "Module ",
                      row.module
                    ] }),
                    /* @__PURE__ */ jsx("span", { className: "font-semibold text-zinc-900", children: row.total })
                  ]
                },
                row.module
              )
            ) : /* @__PURE__ */ jsx("p", { className: "text-sm text-zinc-500", children: "No module data available." }) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "rounded-lg border border-zinc-100 bg-white p-6 shadow-sm", children: [
            /* @__PURE__ */ jsx("h2", { className: "mb-4 text-lg font-semibold text-zinc-700", children: "Students by Year of Study" }),
            /* @__PURE__ */ jsx("div", { className: "space-y-3", children: academicSummary.breakdowns.students_by_year?.length ? academicSummary.breakdowns.students_by_year.map(
              (row) => /* @__PURE__ */ jsxs(
                "div",
                {
                  className: "flex items-center justify-between rounded-lg bg-zinc-50 px-4 py-3",
                  children: [
                    /* @__PURE__ */ jsxs("p", { className: "text-zinc-700", children: [
                      "Year",
                      " ",
                      row.year_of_study
                    ] }),
                    /* @__PURE__ */ jsx("span", { className: "font-semibold text-zinc-900", children: row.total })
                  ]
                },
                row.year_of_study
              )
            ) : /* @__PURE__ */ jsx("p", { className: "text-sm text-zinc-500", children: "No year-of-study data available." }) })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 gap-6 xl:grid-cols-2", children: [
          /* @__PURE__ */ jsxs("div", { className: "rounded-lg border border-zinc-100 bg-white p-6 shadow-sm", children: [
            /* @__PURE__ */ jsx("h2", { className: "mb-4 text-lg font-semibold text-zinc-700", children: "Lecturer Load" }),
            /* @__PURE__ */ jsx("div", { className: "space-y-4", children: academicSummary.breakdowns.lecturer_load?.length ? academicSummary.breakdowns.lecturer_load.map(
              (row) => /* @__PURE__ */ jsx(
                "div",
                {
                  className: "rounded-lg border border-zinc-100 bg-zinc-50 px-4 py-3",
                  children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-4", children: [
                    /* @__PURE__ */ jsxs("div", { children: [
                      /* @__PURE__ */ jsx("p", { className: "font-medium text-zinc-800", children: row.trainer_name }),
                      /* @__PURE__ */ jsx("p", { className: "text-sm text-zinc-500", children: row.staff_number })
                    ] }),
                    /* @__PURE__ */ jsxs("span", { className: "font-semibold text-zinc-900", children: [
                      row.session_count,
                      " sessions"
                    ] })
                  ] })
                },
                row.staff_id
              )
            ) : /* @__PURE__ */ jsx("p", { className: "text-sm text-zinc-500", children: "No lecturer load data available." }) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "rounded-lg border border-zinc-100 bg-white p-6 shadow-sm", children: [
            /* @__PURE__ */ jsx("h2", { className: "mb-4 text-lg font-semibold text-zinc-700", children: "Room Utilization Snapshot" }),
            /* @__PURE__ */ jsx("div", { className: "space-y-4", children: academicSummary.breakdowns.room_utilization?.length ? academicSummary.breakdowns.room_utilization.map(
              (row) => /* @__PURE__ */ jsx(
                "div",
                {
                  className: "rounded-lg border border-zinc-100 bg-zinc-50 px-4 py-3",
                  children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-4", children: [
                    /* @__PURE__ */ jsx("p", { className: "font-medium text-zinc-800", children: row.room_name }),
                    /* @__PURE__ */ jsxs("span", { className: "font-semibold text-zinc-900", children: [
                      row.session_count,
                      " sessions"
                    ] })
                  ] })
                },
                row.room_id
              )
            ) : /* @__PURE__ */ jsx("p", { className: "text-sm text-zinc-500", children: "No room utilization data available." }) })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 gap-6 xl:grid-cols-2", children: [
          /* @__PURE__ */ jsxs("div", { className: "rounded-lg border border-zinc-100 bg-white p-6 shadow-sm", children: [
            /* @__PURE__ */ jsx("h2", { className: "mb-4 text-lg font-semibold text-zinc-700", children: "Students Not Registered In Active Session" }),
            /* @__PURE__ */ jsx("div", { className: "space-y-4", children: academicSummary.exceptions.students_not_registered?.length ? academicSummary.exceptions.students_not_registered.map(
              (student) => /* @__PURE__ */ jsx(
                "div",
                {
                  className: "rounded-lg border border-zinc-100 bg-zinc-50 px-4 py-3",
                  children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-4", children: [
                    /* @__PURE__ */ jsxs("div", { children: [
                      /* @__PURE__ */ jsx("p", { className: "font-medium text-zinc-800", children: student.student_name }),
                      /* @__PURE__ */ jsx("p", { className: "text-sm text-zinc-500", children: student.registration_number })
                    ] }),
                    /* @__PURE__ */ jsxs("span", { className: "text-sm text-zinc-600", children: [
                      "Module",
                      " ",
                      student.current_module
                    ] })
                  ] })
                },
                student.student_id
              )
            ) : /* @__PURE__ */ jsx("p", { className: "text-sm text-zinc-500", children: "No unregistered active students found in the current sample." }) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "rounded-lg border border-zinc-100 bg-white p-6 shadow-sm", children: [
            /* @__PURE__ */ jsx("h2", { className: "mb-4 text-lg font-semibold text-zinc-700", children: "Units Without Timetable" }),
            /* @__PURE__ */ jsx("div", { className: "space-y-4", children: academicSummary.exceptions.units_without_timetable?.length ? academicSummary.exceptions.units_without_timetable.map(
              (unit) => /* @__PURE__ */ jsxs(
                "div",
                {
                  className: "rounded-lg border border-zinc-100 bg-zinc-50 px-4 py-3",
                  children: [
                    /* @__PURE__ */ jsxs("p", { className: "font-medium text-zinc-800", children: [
                      unit.unit_code,
                      " -",
                      " ",
                      unit.unit_name
                    ] }),
                    /* @__PURE__ */ jsxs("p", { className: "mt-1 text-sm text-zinc-500", children: [
                      unit.course_name,
                      " /",
                      " ",
                      unit.version_name,
                      " / Module",
                      " ",
                      unit.module_taught
                    ] })
                  ]
                },
                unit.curriculum_unit_id
              )
            ) : /* @__PURE__ */ jsx("p", { className: "text-sm text-zinc-500", children: "All sampled mapped units have timetable coverage." }) })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 gap-6 xl:grid-cols-2", children: [
          /* @__PURE__ */ jsxs("div", { className: "rounded-lg border border-zinc-100 bg-white p-6 shadow-sm", children: [
            /* @__PURE__ */ jsx("h2", { className: "mb-4 text-lg font-semibold text-zinc-700", children: "Lecturer Clashes" }),
            /* @__PURE__ */ jsx("div", { className: "space-y-4", children: academicSummary.exceptions.lecturer_clashes?.length ? academicSummary.exceptions.lecturer_clashes.map(
              (clash, index) => /* @__PURE__ */ jsxs(
                "div",
                {
                  className: "rounded-lg border border-zinc-100 bg-zinc-50 px-4 py-3",
                  children: [
                    /* @__PURE__ */ jsx("p", { className: "font-medium capitalize text-zinc-800", children: clash.day_of_week }),
                    /* @__PURE__ */ jsxs("p", { className: "mt-1 text-sm text-zinc-500", children: [
                      clash.first_time_range,
                      " overlaps with",
                      " ",
                      clash.second_time_range
                    ] })
                  ]
                },
                `${clash.first_timetable_id}-${clash.second_timetable_id}-${index}`
              )
            ) : /* @__PURE__ */ jsx("p", { className: "text-sm text-zinc-500", children: "No lecturer clashes detected in the sampled timetable set." }) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "rounded-lg border border-zinc-100 bg-white p-6 shadow-sm", children: [
            /* @__PURE__ */ jsx("h2", { className: "mb-4 text-lg font-semibold text-zinc-700", children: "Room Clashes" }),
            /* @__PURE__ */ jsx("div", { className: "space-y-4", children: academicSummary.exceptions.room_clashes?.length ? academicSummary.exceptions.room_clashes.map(
              (clash, index) => /* @__PURE__ */ jsxs(
                "div",
                {
                  className: "rounded-lg border border-zinc-100 bg-zinc-50 px-4 py-3",
                  children: [
                    /* @__PURE__ */ jsx("p", { className: "font-medium capitalize text-zinc-800", children: clash.day_of_week }),
                    /* @__PURE__ */ jsxs("p", { className: "mt-1 text-sm text-zinc-500", children: [
                      clash.first_time_range,
                      " overlaps with",
                      " ",
                      clash.second_time_range
                    ] })
                  ]
                },
                `${clash.first_timetable_id}-${clash.second_timetable_id}-${index}`
              )
            ) : /* @__PURE__ */ jsx("p", { className: "text-sm text-zinc-500", children: "No room clashes detected in the sampled timetable set." }) })
          ] })
        ] })
      ] }),
      showAdmissions && admissionsSummary && /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsxs("div", { className: "rounded-lg border border-zinc-100 bg-white p-6 shadow-sm", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-2 lg:flex-row lg:items-end lg:justify-between", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("h2", { className: "text-lg font-semibold text-zinc-700", children: "Admissions and Registry Analytics" }),
              /* @__PURE__ */ jsx("p", { className: "text-sm text-zinc-500", children: "Intake trends, demographic breakdowns, and onboarding completion exceptions." })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "text-sm text-zinc-500", children: [
              "Active Session:",
              " ",
              /* @__PURE__ */ jsx("span", { className: "font-medium text-zinc-700", children: admissionsSummary.active_session?.label ?? "No active session" })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5", children: [
            /* @__PURE__ */ jsx(
              MetricCard,
              {
                label: "Total Admissions",
                value: admissionsSummary.metrics.total_admissions
              }
            ),
            /* @__PURE__ */ jsx(
              MetricCard,
              {
                label: "Admissions In Range",
                value: admissionsSummary.metrics.new_admissions_in_range,
                accent: "text-blue-600"
              }
            ),
            /* @__PURE__ */ jsx(
              MetricCard,
              {
                label: "Inactive Accounts",
                value: admissionsSummary.metrics.inactive_accounts,
                accent: "text-red-600"
              }
            ),
            /* @__PURE__ */ jsx(
              MetricCard,
              {
                label: "Missing Course Enrollment",
                value: admissionsSummary.metrics.students_missing_course_enrollment_count,
                accent: "text-amber-600"
              }
            ),
            /* @__PURE__ */ jsx(
              MetricCard,
              {
                label: "Missing Next Of Kin",
                value: admissionsSummary.metrics.students_missing_next_of_kin_count,
                accent: "text-amber-600"
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4", children: [
            /* @__PURE__ */ jsx(
              MetricCard,
              {
                label: "Active Accounts",
                value: admissionsSummary.metrics.active_accounts,
                accent: "text-emerald-600"
              }
            ),
            /* @__PURE__ */ jsx(
              MetricCard,
              {
                label: "Students Not Session Enrolled",
                value: admissionsSummary.metrics.students_not_session_enrolled_count,
                accent: "text-red-600"
              }
            ),
            /* @__PURE__ */ jsx(
              MetricCard,
              {
                label: "Duplicate Contact Risks",
                value: admissionsSummary.metrics.duplicate_contact_risk_count,
                accent: "text-red-600"
              }
            ),
            /* @__PURE__ */ jsx(
              MetricCard,
              {
                label: "PWD Students",
                value: admissionsSummary.metrics.pwd_students
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 gap-6 xl:grid-cols-2", children: [
          /* @__PURE__ */ jsxs("div", { className: "rounded-lg border border-zinc-100 bg-white p-6 shadow-sm", children: [
            /* @__PURE__ */ jsx("h2", { className: "mb-4 text-lg font-semibold text-zinc-700", children: "Intake Trend" }),
            /* @__PURE__ */ jsx("div", { className: "space-y-3", children: admissionsSummary.breakdowns.intake_trend?.length ? admissionsSummary.breakdowns.intake_trend.map(
              (row) => /* @__PURE__ */ jsxs(
                "div",
                {
                  className: "flex items-center justify-between rounded-lg bg-zinc-50 px-4 py-3",
                  children: [
                    /* @__PURE__ */ jsx("p", { className: "text-zinc-700", children: row.month }),
                    /* @__PURE__ */ jsx("span", { className: "font-semibold text-zinc-900", children: row.total })
                  ]
                },
                row.month
              )
            ) : /* @__PURE__ */ jsx("p", { className: "text-sm text-zinc-500", children: "No intake trend data available." }) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "rounded-lg border border-zinc-100 bg-white p-6 shadow-sm", children: [
            /* @__PURE__ */ jsx("h2", { className: "mb-4 text-lg font-semibold text-zinc-700", children: "Admissions by Gender" }),
            /* @__PURE__ */ jsx("div", { className: "space-y-3", children: admissionsSummary.breakdowns.admissions_by_gender?.length ? admissionsSummary.breakdowns.admissions_by_gender.map(
              (row) => /* @__PURE__ */ jsxs(
                "div",
                {
                  className: "flex items-center justify-between rounded-lg bg-zinc-50 px-4 py-3",
                  children: [
                    /* @__PURE__ */ jsx("p", { className: "capitalize text-zinc-700", children: row.gender }),
                    /* @__PURE__ */ jsx("span", { className: "font-semibold text-zinc-900", children: row.total })
                  ]
                },
                row.gender
              )
            ) : /* @__PURE__ */ jsx("p", { className: "text-sm text-zinc-500", children: "No gender data available." }) })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 gap-6 xl:grid-cols-3", children: [
          /* @__PURE__ */ jsxs("div", { className: "rounded-lg border border-zinc-100 bg-white p-6 shadow-sm", children: [
            /* @__PURE__ */ jsx("h2", { className: "mb-4 text-lg font-semibold text-zinc-700", children: "Admissions by Department" }),
            /* @__PURE__ */ jsx("div", { className: "space-y-3", children: admissionsSummary.breakdowns.admissions_by_department?.length ? admissionsSummary.breakdowns.admissions_by_department.map(
              (row) => /* @__PURE__ */ jsxs(
                "div",
                {
                  className: "flex items-center justify-between rounded-lg bg-zinc-50 px-4 py-3",
                  children: [
                    /* @__PURE__ */ jsx("p", { className: "text-zinc-700", children: row.department_name }),
                    /* @__PURE__ */ jsx("span", { className: "font-semibold text-zinc-900", children: row.total })
                  ]
                },
                row.department_name
              )
            ) : /* @__PURE__ */ jsx("p", { className: "text-sm text-zinc-500", children: "No department data available." }) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "rounded-lg border border-zinc-100 bg-white p-6 shadow-sm", children: [
            /* @__PURE__ */ jsx("h2", { className: "mb-4 text-lg font-semibold text-zinc-700", children: "Top Courses" }),
            /* @__PURE__ */ jsx("div", { className: "space-y-3", children: admissionsSummary.breakdowns.admissions_by_course?.length ? admissionsSummary.breakdowns.admissions_by_course.map(
              (row) => /* @__PURE__ */ jsxs(
                "div",
                {
                  className: "flex items-center justify-between rounded-lg bg-zinc-50 px-4 py-3",
                  children: [
                    /* @__PURE__ */ jsx("p", { className: "text-zinc-700", children: row.course_name }),
                    /* @__PURE__ */ jsx("span", { className: "font-semibold text-zinc-900", children: row.total })
                  ]
                },
                row.course_name
              )
            ) : /* @__PURE__ */ jsx("p", { className: "text-sm text-zinc-500", children: "No course data available." }) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "rounded-lg border border-zinc-100 bg-white p-6 shadow-sm", children: [
            /* @__PURE__ */ jsx("h2", { className: "mb-4 text-lg font-semibold text-zinc-700", children: "Top Counties" }),
            /* @__PURE__ */ jsx("div", { className: "space-y-3", children: admissionsSummary.breakdowns.admissions_by_county?.length ? admissionsSummary.breakdowns.admissions_by_county.map(
              (row) => /* @__PURE__ */ jsxs(
                "div",
                {
                  className: "flex items-center justify-between rounded-lg bg-zinc-50 px-4 py-3",
                  children: [
                    /* @__PURE__ */ jsx("p", { className: "text-zinc-700", children: row.county }),
                    /* @__PURE__ */ jsx("span", { className: "font-semibold text-zinc-900", children: row.total })
                  ]
                },
                row.county
              )
            ) : /* @__PURE__ */ jsx("p", { className: "text-sm text-zinc-500", children: "No county data available." }) })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 gap-6 xl:grid-cols-2", children: [
          /* @__PURE__ */ jsxs("div", { className: "rounded-lg border border-zinc-100 bg-white p-6 shadow-sm", children: [
            /* @__PURE__ */ jsx("h2", { className: "mb-4 text-lg font-semibold text-zinc-700", children: "Missing Course Enrollment" }),
            /* @__PURE__ */ jsx("div", { className: "space-y-4", children: admissionsSummary.exceptions.students_missing_course_enrollment?.length ? admissionsSummary.exceptions.students_missing_course_enrollment.map(
              (student) => /* @__PURE__ */ jsxs(
                "div",
                {
                  className: "rounded-lg border border-zinc-100 bg-zinc-50 px-4 py-3",
                  children: [
                    /* @__PURE__ */ jsx("p", { className: "font-medium text-zinc-800", children: student.student_name }),
                    /* @__PURE__ */ jsxs("p", { className: "mt-1 text-sm text-zinc-500", children: [
                      student.registration_number,
                      " ",
                      "/",
                      " ",
                      student.admission_date
                    ] })
                  ]
                },
                student.student_id
              )
            ) : /* @__PURE__ */ jsx("p", { className: "text-sm text-zinc-500", children: "No missing course enrollment cases found." }) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "rounded-lg border border-zinc-100 bg-white p-6 shadow-sm", children: [
            /* @__PURE__ */ jsx("h2", { className: "mb-4 text-lg font-semibold text-zinc-700", children: "Missing Next Of Kin" }),
            /* @__PURE__ */ jsx("div", { className: "space-y-4", children: admissionsSummary.exceptions.students_missing_next_of_kin?.length ? admissionsSummary.exceptions.students_missing_next_of_kin.map(
              (student) => /* @__PURE__ */ jsxs(
                "div",
                {
                  className: "rounded-lg border border-zinc-100 bg-zinc-50 px-4 py-3",
                  children: [
                    /* @__PURE__ */ jsx("p", { className: "font-medium text-zinc-800", children: student.student_name }),
                    /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-zinc-500", children: student.registration_number })
                  ]
                },
                student.student_id
              )
            ) : /* @__PURE__ */ jsx("p", { className: "text-sm text-zinc-500", children: "No missing next-of-kin cases found." }) })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 gap-6 xl:grid-cols-3", children: [
          /* @__PURE__ */ jsxs("div", { className: "rounded-lg border border-zinc-100 bg-white p-6 shadow-sm", children: [
            /* @__PURE__ */ jsx("h2", { className: "mb-4 text-lg font-semibold text-zinc-700", children: "Inactive Student Accounts" }),
            /* @__PURE__ */ jsx("div", { className: "space-y-4", children: admissionsSummary.exceptions.inactive_student_accounts?.length ? admissionsSummary.exceptions.inactive_student_accounts.map(
              (student) => /* @__PURE__ */ jsxs(
                "div",
                {
                  className: "rounded-lg border border-zinc-100 bg-zinc-50 px-4 py-3",
                  children: [
                    /* @__PURE__ */ jsx("p", { className: "font-medium text-zinc-800", children: student.student_name }),
                    /* @__PURE__ */ jsxs("p", { className: "mt-1 text-sm text-zinc-500", children: [
                      student.registration_number,
                      " ",
                      "/ ",
                      student.email
                    ] })
                  ]
                },
                student.student_id
              )
            ) : /* @__PURE__ */ jsx("p", { className: "text-sm text-zinc-500", children: "No inactive student accounts found." }) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "rounded-lg border border-zinc-100 bg-white p-6 shadow-sm", children: [
            /* @__PURE__ */ jsx("h2", { className: "mb-4 text-lg font-semibold text-zinc-700", children: "Not Session Enrolled" }),
            /* @__PURE__ */ jsx("div", { className: "space-y-4", children: admissionsSummary.exceptions.students_not_session_enrolled?.length ? admissionsSummary.exceptions.students_not_session_enrolled.map(
              (student) => /* @__PURE__ */ jsxs(
                "div",
                {
                  className: "rounded-lg border border-zinc-100 bg-zinc-50 px-4 py-3",
                  children: [
                    /* @__PURE__ */ jsx("p", { className: "font-medium text-zinc-800", children: student.student_name }),
                    /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-zinc-500", children: student.registration_number })
                  ]
                },
                student.student_id
              )
            ) : /* @__PURE__ */ jsx("p", { className: "text-sm text-zinc-500", children: "No session-enrollment gaps found in the current sample." }) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "rounded-lg border border-zinc-100 bg-white p-6 shadow-sm", children: [
            /* @__PURE__ */ jsx("h2", { className: "mb-4 text-lg font-semibold text-zinc-700", children: "Duplicate Contact Risk" }),
            /* @__PURE__ */ jsx("div", { className: "space-y-4", children: admissionsSummary.exceptions.duplicate_contact_risk?.length ? admissionsSummary.exceptions.duplicate_contact_risk.map(
              (risk, index) => /* @__PURE__ */ jsxs(
                "div",
                {
                  className: "rounded-lg border border-zinc-100 bg-zinc-50 px-4 py-3",
                  children: [
                    /* @__PURE__ */ jsx("p", { className: "font-medium uppercase text-zinc-800", children: risk.contact_type }),
                    /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-zinc-500", children: risk.contact_value }),
                    /* @__PURE__ */ jsxs("p", { className: "mt-2 text-sm font-semibold text-red-600", children: [
                      risk.duplicate_count,
                      " duplicates"
                    ] })
                  ]
                },
                `${risk.contact_type}-${risk.contact_value}-${index}`
              )
            ) : /* @__PURE__ */ jsx("p", { className: "text-sm text-zinc-500", children: "No duplicate contact risks found." }) })
          ] })
        ] })
      ] }),
      showHostel && hostelSummary && /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsxs("div", { className: "rounded-lg border border-zinc-100 bg-white p-6 shadow-sm", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-2 lg:flex-row lg:items-end lg:justify-between", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("h2", { className: "text-lg font-semibold text-zinc-700", children: "Hostel Analytics" }),
              /* @__PURE__ */ jsx("p", { className: "text-sm text-zinc-500", children: "Occupancy, hostel billing linkage, and accommodation exception monitoring." })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "text-sm text-zinc-500", children: [
              "Active Session:",
              " ",
              /* @__PURE__ */ jsx("span", { className: "font-medium text-zinc-700", children: hostelSummary.active_session?.label ?? "No active session" })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5", children: [
            /* @__PURE__ */ jsx(
              MetricCard,
              {
                label: "Occupancy Rate",
                value: `${hostelSummary.metrics.occupancy_rate}%`,
                accent: "text-blue-600"
              }
            ),
            /* @__PURE__ */ jsx(
              MetricCard,
              {
                label: "Occupied Beds",
                value: hostelSummary.metrics.occupied_beds,
                helper: `${hostelSummary.metrics.active_beds} active beds`
              }
            ),
            /* @__PURE__ */ jsx(
              MetricCard,
              {
                label: "Available Beds",
                value: hostelSummary.metrics.available_beds,
                accent: "text-emerald-600"
              }
            ),
            /* @__PURE__ */ jsx(
              MetricCard,
              {
                label: "Allocated Students",
                value: hostelSummary.metrics.allocated_students
              }
            ),
            /* @__PURE__ */ jsx(
              MetricCard,
              {
                label: "Hostel-Billed Students",
                value: hostelSummary.metrics.hostel_billed_students
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4", children: [
            /* @__PURE__ */ jsx(
              MetricCard,
              {
                label: "Hostel Revenue Invoiced",
                value: formatCurrency(
                  hostelSummary.metrics.hostel_revenue_invoiced
                ),
                accent: "text-zinc-900"
              }
            ),
            /* @__PURE__ */ jsx(
              MetricCard,
              {
                label: "Hostel Revenue Collected",
                value: formatCurrency(
                  hostelSummary.metrics.hostel_revenue_collected
                ),
                accent: "text-emerald-600"
              }
            ),
            /* @__PURE__ */ jsx(
              MetricCard,
              {
                label: "Billed Not Allocated",
                value: hostelSummary.metrics.billed_but_not_allocated_count,
                accent: "text-amber-600"
              }
            ),
            /* @__PURE__ */ jsx(
              MetricCard,
              {
                label: "Allocated Not Billed",
                value: hostelSummary.metrics.allocated_but_not_billed_count,
                accent: "text-red-600"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 gap-6 xl:grid-cols-2", children: [
          /* @__PURE__ */ jsxs("div", { className: "rounded-lg border border-zinc-100 bg-white p-6 shadow-sm", children: [
            /* @__PURE__ */ jsx("h2", { className: "mb-4 text-lg font-semibold text-zinc-700", children: "Occupancy by Hostel" }),
            /* @__PURE__ */ jsx("div", { className: "space-y-4", children: hostelSummary.breakdowns.occupancy_by_hostel?.length ? hostelSummary.breakdowns.occupancy_by_hostel.map(
              (row) => /* @__PURE__ */ jsx(
                "div",
                {
                  className: "rounded-lg border border-zinc-100 bg-zinc-50 px-4 py-3",
                  children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-4", children: [
                    /* @__PURE__ */ jsxs("div", { children: [
                      /* @__PURE__ */ jsx("p", { className: "font-medium text-zinc-800", children: row.hostel_name }),
                      /* @__PURE__ */ jsxs("p", { className: "text-sm text-zinc-500", children: [
                        row.occupied_beds,
                        " ",
                        "occupied /",
                        " ",
                        row.active_beds,
                        " ",
                        "active beds"
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxs("span", { className: "font-semibold text-zinc-900", children: [
                      row.occupancy_rate,
                      "%"
                    ] })
                  ] })
                },
                row.hostel_id
              )
            ) : /* @__PURE__ */ jsx("p", { className: "text-sm text-zinc-500", children: "No hostel occupancy data available." }) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "rounded-lg border border-zinc-100 bg-white p-6 shadow-sm", children: [
            /* @__PURE__ */ jsx("h2", { className: "mb-4 text-lg font-semibold text-zinc-700", children: "Occupancy by Room" }),
            /* @__PURE__ */ jsx("div", { className: "space-y-4", children: hostelSummary.breakdowns.occupancy_by_room?.length ? hostelSummary.breakdowns.occupancy_by_room.map(
              (row) => /* @__PURE__ */ jsx(
                "div",
                {
                  className: "rounded-lg border border-zinc-100 bg-zinc-50 px-4 py-3",
                  children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-4", children: [
                    /* @__PURE__ */ jsxs("div", { children: [
                      /* @__PURE__ */ jsx("p", { className: "font-medium text-zinc-800", children: row.room_name }),
                      /* @__PURE__ */ jsxs("p", { className: "text-sm text-zinc-500", children: [
                        row.hostel_name,
                        " ",
                        "/",
                        " ",
                        row.occupied_beds,
                        " ",
                        "occupied /",
                        " ",
                        row.active_beds,
                        " ",
                        "active beds"
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxs("span", { className: "font-semibold text-zinc-900", children: [
                      row.occupancy_rate,
                      "%"
                    ] })
                  ] })
                },
                row.room_id
              )
            ) : /* @__PURE__ */ jsx("p", { className: "text-sm text-zinc-500", children: "No room occupancy data available." }) })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 gap-6 xl:grid-cols-2", children: [
          /* @__PURE__ */ jsxs("div", { className: "rounded-lg border border-zinc-100 bg-white p-6 shadow-sm", children: [
            /* @__PURE__ */ jsx("h2", { className: "mb-4 text-lg font-semibold text-zinc-700", children: "Billed but Not Allocated" }),
            /* @__PURE__ */ jsx("div", { className: "space-y-4", children: hostelSummary.exceptions.billed_but_not_allocated?.length ? hostelSummary.exceptions.billed_but_not_allocated.map(
              (row) => /* @__PURE__ */ jsxs(
                "div",
                {
                  className: "rounded-lg border border-zinc-100 bg-zinc-50 px-4 py-3",
                  children: [
                    /* @__PURE__ */ jsx("p", { className: "font-medium text-zinc-800", children: row.student_name }),
                    /* @__PURE__ */ jsxs("p", { className: "mt-1 text-sm text-zinc-500", children: [
                      row.registration_number,
                      " ",
                      "/ ",
                      row.invoice_number
                    ] }),
                    /* @__PURE__ */ jsxs("p", { className: "mt-2 text-sm font-semibold text-amber-700", children: [
                      "Due",
                      " ",
                      formatCurrency(
                        row.balance_due
                      )
                    ] })
                  ]
                },
                row.invoice_id
              )
            ) : /* @__PURE__ */ jsx("p", { className: "text-sm text-zinc-500", children: "No billed-without-allocation cases found." }) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "rounded-lg border border-zinc-100 bg-white p-6 shadow-sm", children: [
            /* @__PURE__ */ jsx("h2", { className: "mb-4 text-lg font-semibold text-zinc-700", children: "Allocated but Not Billed" }),
            /* @__PURE__ */ jsx("div", { className: "space-y-4", children: hostelSummary.exceptions.allocated_but_not_billed?.length ? hostelSummary.exceptions.allocated_but_not_billed.map(
              (row) => /* @__PURE__ */ jsxs(
                "div",
                {
                  className: "rounded-lg border border-zinc-100 bg-zinc-50 px-4 py-3",
                  children: [
                    /* @__PURE__ */ jsx("p", { className: "font-medium text-zinc-800", children: row.student_name }),
                    /* @__PURE__ */ jsxs("p", { className: "mt-1 text-sm text-zinc-500", children: [
                      row.registration_number,
                      " ",
                      "/ ",
                      row.hostel_name
                    ] }),
                    /* @__PURE__ */ jsxs("p", { className: "mt-2 text-sm font-semibold text-red-600", children: [
                      "Expected",
                      " ",
                      formatCurrency(
                        row.hostel_fee_amount
                      )
                    ] })
                  ]
                },
                row.allocation_id
              )
            ) : /* @__PURE__ */ jsx("p", { className: "text-sm text-zinc-500", children: "No allocation-without-billing cases found." }) })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 gap-6 xl:grid-cols-3", children: [
          /* @__PURE__ */ jsxs("div", { className: "rounded-lg border border-zinc-100 bg-white p-6 shadow-sm", children: [
            /* @__PURE__ */ jsx("h2", { className: "mb-4 text-lg font-semibold text-zinc-700", children: "Duplicate Student Allocations" }),
            /* @__PURE__ */ jsx("div", { className: "space-y-4", children: hostelSummary.exceptions.duplicate_allocations?.length ? hostelSummary.exceptions.duplicate_allocations.map(
              (row) => /* @__PURE__ */ jsxs(
                "div",
                {
                  className: "rounded-lg border border-zinc-100 bg-zinc-50 px-4 py-3",
                  children: [
                    /* @__PURE__ */ jsx("p", { className: "font-medium text-zinc-800", children: row.student_name }),
                    /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-zinc-500", children: row.registration_number }),
                    /* @__PURE__ */ jsxs("p", { className: "mt-2 text-sm font-semibold text-red-600", children: [
                      row.allocation_count,
                      " ",
                      "active allocations"
                    ] })
                  ]
                },
                row.student_id
              )
            ) : /* @__PURE__ */ jsx("p", { className: "text-sm text-zinc-500", children: "No duplicate student allocations found." }) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "rounded-lg border border-zinc-100 bg-white p-6 shadow-sm", children: [
            /* @__PURE__ */ jsx("h2", { className: "mb-4 text-lg font-semibold text-zinc-700", children: "Rooms Over Capacity" }),
            /* @__PURE__ */ jsx("div", { className: "space-y-4", children: hostelSummary.exceptions.rooms_over_capacity?.length ? hostelSummary.exceptions.rooms_over_capacity.map(
              (row) => /* @__PURE__ */ jsxs(
                "div",
                {
                  className: "rounded-lg border border-zinc-100 bg-zinc-50 px-4 py-3",
                  children: [
                    /* @__PURE__ */ jsx("p", { className: "font-medium text-zinc-800", children: row.room_name }),
                    /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-zinc-500", children: row.hostel_name }),
                    /* @__PURE__ */ jsxs("p", { className: "mt-2 text-sm font-semibold text-red-600", children: [
                      row.allocation_count,
                      " ",
                      "allocations vs",
                      " ",
                      row.bed_count,
                      " beds"
                    ] })
                  ]
                },
                row.room_id
              )
            ) : /* @__PURE__ */ jsx("p", { className: "text-sm text-zinc-500", children: "No over-capacity rooms found." }) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "rounded-lg border border-zinc-100 bg-white p-6 shadow-sm", children: [
            /* @__PURE__ */ jsx("h2", { className: "mb-4 text-lg font-semibold text-zinc-700", children: "Inactive Students With Allocation" }),
            /* @__PURE__ */ jsx("div", { className: "space-y-4", children: hostelSummary.exceptions.inactive_students_with_active_allocation?.length ? hostelSummary.exceptions.inactive_students_with_active_allocation.map(
              (row) => /* @__PURE__ */ jsxs(
                "div",
                {
                  className: "rounded-lg border border-zinc-100 bg-zinc-50 px-4 py-3",
                  children: [
                    /* @__PURE__ */ jsx("p", { className: "font-medium text-zinc-800", children: row.student_name }),
                    /* @__PURE__ */ jsxs("p", { className: "mt-1 text-sm text-zinc-500", children: [
                      row.registration_number,
                      " ",
                      "/ ",
                      row.hostel_name
                    ] }),
                    /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm font-semibold capitalize text-red-600", children: row.student_status })
                  ]
                },
                row.allocation_id
              )
            ) : /* @__PURE__ */ jsx("p", { className: "text-sm text-zinc-500", children: "No inactive-student allocation conflicts found." }) })
          ] })
        ] })
      ] }),
      showDataQuality && dataQualitySummary && /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsxs("div", { className: "rounded-lg border border-zinc-100 bg-white p-6 shadow-sm", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-2 lg:flex-row lg:items-end lg:justify-between", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("h2", { className: "text-lg font-semibold text-zinc-700", children: "Data Quality and Operational Signals" }),
              /* @__PURE__ */ jsx("p", { className: "text-sm text-zinc-500", children: "Integrity gaps, anomalous records, and runtime-health signals that affect trust in analytics." })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "text-xs text-zinc-500", children: "Log signals use the latest laravel.log tail sample" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5", children: [
            /* @__PURE__ */ jsx(
              MetricCard,
              {
                label: "Missing Relationships",
                value: dataQualitySummary.metrics.records_missing_required_relationships,
                accent: "text-amber-600"
              }
            ),
            /* @__PURE__ */ jsx(
              MetricCard,
              {
                label: "Duplicate Contacts",
                value: dataQualitySummary.metrics.duplicate_contact_identifiers,
                accent: "text-red-600"
              }
            ),
            /* @__PURE__ */ jsx(
              MetricCard,
              {
                label: "Orphaned Financial Records",
                value: dataQualitySummary.metrics.orphaned_financial_records,
                accent: "text-red-600"
              }
            ),
            /* @__PURE__ */ jsx(
              MetricCard,
              {
                label: "Invalid Status Combinations",
                value: dataQualitySummary.metrics.invalid_status_combinations,
                accent: "text-amber-600"
              }
            ),
            /* @__PURE__ */ jsx(
              MetricCard,
              {
                label: "Failed Jobs",
                value: dataQualitySummary.metrics.failed_job_count
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4", children: [
            /* @__PURE__ */ jsx(
              MetricCard,
              {
                label: "Strict-Mode Errors",
                value: dataQualitySummary.metrics.strict_mode_error_count,
                accent: "text-red-600"
              }
            ),
            /* @__PURE__ */ jsx(
              MetricCard,
              {
                label: "Slow Queries",
                value: dataQualitySummary.metrics.slow_query_count,
                accent: "text-amber-600"
              }
            ),
            /* @__PURE__ */ jsx(
              MetricCard,
              {
                label: "Multi-Active Sessions",
                value: dataQualitySummary.metrics.multi_active_session_count,
                accent: "text-red-600"
              }
            ),
            /* @__PURE__ */ jsx(
              MetricCard,
              {
                label: "Multi-Active Course Mappings",
                value: dataQualitySummary.metrics.multi_active_course_mapping_count,
                accent: "text-red-600"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 gap-6 xl:grid-cols-2", children: [
          /* @__PURE__ */ jsxs("div", { className: "rounded-lg border border-zinc-100 bg-white p-6 shadow-sm", children: [
            /* @__PURE__ */ jsx("h2", { className: "mb-4 text-lg font-semibold text-zinc-700", children: "Duplicate Contact Identifiers" }),
            /* @__PURE__ */ jsx("div", { className: "space-y-4", children: dataQualitySummary.exceptions.duplicate_contact_identifiers?.length ? dataQualitySummary.exceptions.duplicate_contact_identifiers.map(
              (row, index) => /* @__PURE__ */ jsxs(
                "div",
                {
                  className: "rounded-lg border border-zinc-100 bg-zinc-50 px-4 py-3",
                  children: [
                    /* @__PURE__ */ jsx("p", { className: "font-medium uppercase text-zinc-800", children: row.contact_type }),
                    /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-zinc-500", children: row.contact_value }),
                    /* @__PURE__ */ jsxs("p", { className: "mt-2 text-sm font-semibold text-red-600", children: [
                      row.duplicate_count,
                      " duplicates"
                    ] })
                  ]
                },
                `${row.contact_type}-${row.contact_value}-${index}`
              )
            ) : /* @__PURE__ */ jsx("p", { className: "text-sm text-zinc-500", children: "No duplicate contacts found." }) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "rounded-lg border border-zinc-100 bg-white p-6 shadow-sm", children: [
            /* @__PURE__ */ jsx("h2", { className: "mb-4 text-lg font-semibold text-zinc-700", children: "Multi-Active Academic Sessions" }),
            /* @__PURE__ */ jsx("div", { className: "space-y-4", children: dataQualitySummary.exceptions.multiple_active_academic_sessions?.length ? dataQualitySummary.exceptions.multiple_active_academic_sessions.map(
              (row) => /* @__PURE__ */ jsxs(
                "div",
                {
                  className: "rounded-lg border border-zinc-100 bg-zinc-50 px-4 py-3",
                  children: [
                    /* @__PURE__ */ jsx("p", { className: "font-medium text-zinc-800", children: row.session_label }),
                    /* @__PURE__ */ jsxs("p", { className: "mt-1 text-sm text-zinc-500", children: [
                      "Session number ",
                      row.session_number
                    ] })
                  ]
                },
                row.academic_session_id
              )
            ) : /* @__PURE__ */ jsx("p", { className: "text-sm text-zinc-500", children: "No multi-active session anomalies found." }) })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 gap-6 xl:grid-cols-3", children: [
          /* @__PURE__ */ jsxs("div", { className: "rounded-lg border border-zinc-100 bg-white p-6 shadow-sm", children: [
            /* @__PURE__ */ jsx("h2", { className: "mb-4 text-lg font-semibold text-zinc-700", children: "Students Without Course Enrollment" }),
            /* @__PURE__ */ jsx("div", { className: "space-y-4", children: dataQualitySummary.exceptions.students_without_course_enrollment?.length ? dataQualitySummary.exceptions.students_without_course_enrollment.map(
              (row) => /* @__PURE__ */ jsxs(
                "div",
                {
                  className: "rounded-lg border border-zinc-100 bg-zinc-50 px-4 py-3",
                  children: [
                    /* @__PURE__ */ jsx("p", { className: "font-medium text-zinc-800", children: row.student_name }),
                    /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-zinc-500", children: row.registration_number })
                  ]
                },
                row.student_id
              )
            ) : /* @__PURE__ */ jsx("p", { className: "text-sm text-zinc-500", children: "No missing course-enrollment cases found." }) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "rounded-lg border border-zinc-100 bg-white p-6 shadow-sm", children: [
            /* @__PURE__ */ jsx("h2", { className: "mb-4 text-lg font-semibold text-zinc-700", children: "Invoices Without Enrollment" }),
            /* @__PURE__ */ jsx("div", { className: "space-y-4", children: dataQualitySummary.exceptions.invoices_without_enrollment?.length ? dataQualitySummary.exceptions.invoices_without_enrollment.map(
              (row) => /* @__PURE__ */ jsxs(
                "div",
                {
                  className: "rounded-lg border border-zinc-100 bg-zinc-50 px-4 py-3",
                  children: [
                    /* @__PURE__ */ jsx("p", { className: "font-medium text-zinc-800", children: row.invoice_number }),
                    /* @__PURE__ */ jsxs("p", { className: "mt-1 text-sm text-zinc-500", children: [
                      "Student ID ",
                      row.student_id
                    ] })
                  ]
                },
                row.invoice_id
              )
            ) : /* @__PURE__ */ jsx("p", { className: "text-sm text-zinc-500", children: "No invoice-enrollment orphan cases found." }) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "rounded-lg border border-zinc-100 bg-white p-6 shadow-sm", children: [
            /* @__PURE__ */ jsx("h2", { className: "mb-4 text-lg font-semibold text-zinc-700", children: "Payments Without Student" }),
            /* @__PURE__ */ jsx("div", { className: "space-y-4", children: dataQualitySummary.exceptions.payments_without_student?.length ? dataQualitySummary.exceptions.payments_without_student.map(
              (row) => /* @__PURE__ */ jsxs(
                "div",
                {
                  className: "rounded-lg border border-zinc-100 bg-zinc-50 px-4 py-3",
                  children: [
                    /* @__PURE__ */ jsx("p", { className: "font-medium text-zinc-800", children: row.reference }),
                    /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-zinc-500", children: formatCurrency(row.amount) })
                  ]
                },
                row.payment_id
              )
            ) : /* @__PURE__ */ jsx("p", { className: "text-sm text-zinc-500", children: "No payments missing student links found." }) })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 gap-6 xl:grid-cols-3", children: [
          /* @__PURE__ */ jsxs("div", { className: "rounded-lg border border-zinc-100 bg-white p-6 shadow-sm", children: [
            /* @__PURE__ */ jsx("h2", { className: "mb-4 text-lg font-semibold text-zinc-700", children: "Invalid Invoice Statuses" }),
            /* @__PURE__ */ jsx("div", { className: "space-y-4", children: dataQualitySummary.exceptions.invalid_invoice_statuses?.length ? dataQualitySummary.exceptions.invalid_invoice_statuses.map(
              (row) => /* @__PURE__ */ jsxs(
                "div",
                {
                  className: "rounded-lg border border-zinc-100 bg-zinc-50 px-4 py-3",
                  children: [
                    /* @__PURE__ */ jsx("p", { className: "font-medium text-zinc-800", children: row.invoice_number }),
                    /* @__PURE__ */ jsxs("p", { className: "mt-1 text-sm text-zinc-500", children: [
                      "Status ",
                      row.status
                    ] }),
                    /* @__PURE__ */ jsxs("p", { className: "mt-2 text-sm text-red-600", children: [
                      "Due ",
                      formatCurrency(row.balance_due)
                    ] })
                  ]
                },
                row.invoice_id
              )
            ) : /* @__PURE__ */ jsx("p", { className: "text-sm text-zinc-500", children: "No invalid invoice status combinations found." }) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "rounded-lg border border-zinc-100 bg-white p-6 shadow-sm", children: [
            /* @__PURE__ */ jsx("h2", { className: "mb-4 text-lg font-semibold text-zinc-700", children: "Invoice Student Mismatches" }),
            /* @__PURE__ */ jsx("div", { className: "space-y-4", children: dataQualitySummary.exceptions.invoice_student_mismatches?.length ? dataQualitySummary.exceptions.invoice_student_mismatches.map(
              (row) => /* @__PURE__ */ jsxs(
                "div",
                {
                  className: "rounded-lg border border-zinc-100 bg-zinc-50 px-4 py-3",
                  children: [
                    /* @__PURE__ */ jsx("p", { className: "font-medium text-zinc-800", children: row.invoice_number }),
                    /* @__PURE__ */ jsxs("p", { className: "mt-1 text-sm text-zinc-500", children: [
                      row.student_name,
                      " /",
                      " ",
                      row.registration_number
                    ] })
                  ]
                },
                row.invoice_id
              )
            ) : /* @__PURE__ */ jsx("p", { className: "text-sm text-zinc-500", children: "No invoice-student mismatch cases found." }) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "rounded-lg border border-zinc-100 bg-white p-6 shadow-sm", children: [
            /* @__PURE__ */ jsx("h2", { className: "mb-4 text-lg font-semibold text-zinc-700", children: "Multi-Active Course Mappings" }),
            /* @__PURE__ */ jsx("div", { className: "space-y-4", children: dataQualitySummary.exceptions.multiple_active_course_mappings?.length ? dataQualitySummary.exceptions.multiple_active_course_mappings.map(
              (row) => /* @__PURE__ */ jsxs(
                "div",
                {
                  className: "rounded-lg border border-zinc-100 bg-zinc-50 px-4 py-3",
                  children: [
                    /* @__PURE__ */ jsx("p", { className: "font-medium text-zinc-800", children: row.course_name }),
                    /* @__PURE__ */ jsxs("p", { className: "mt-1 text-sm text-red-600", children: [
                      row.active_mapping_count,
                      " active mappings"
                    ] })
                  ]
                },
                row.course_id
              )
            ) : /* @__PURE__ */ jsx("p", { className: "text-sm text-zinc-500", children: "No multi-active course mapping cases found." }) })
          ] })
        ] })
      ] }),
      showSnapshots && snapshotTrends && /* @__PURE__ */ jsxs("div", { className: "rounded-lg border border-zinc-100 bg-white p-6 shadow-sm", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-2 lg:flex-row lg:items-end lg:justify-between", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h2", { className: "text-lg font-semibold text-zinc-700", children: "Snapshot Trends" }),
            /* @__PURE__ */ jsx("p", { className: "text-sm text-zinc-500", children: "Historical trend slices sourced from the daily analytics snapshot tables." })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "text-xs text-zinc-500", children: [
            snapshotTrends.range?.date_from,
            " to",
            " ",
            snapshotTrends.range?.date_to
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "mt-6 grid grid-cols-1 gap-6 xl:grid-cols-3", children: [
          /* @__PURE__ */ jsx(
            SnapshotTrendCard,
            {
              title: "Student Growth",
              points: snapshotTrends.executive?.student_growth ?? []
            }
          ),
          /* @__PURE__ */ jsx(
            SnapshotTrendCard,
            {
              title: "Collections",
              points: snapshotTrends.finance?.total_collected ?? [],
              formatter: formatCurrency
            }
          ),
          /* @__PURE__ */ jsx(
            SnapshotTrendCard,
            {
              title: "Outstanding Balance",
              points: snapshotTrends.finance?.outstanding_balance ?? [],
              formatter: formatCurrency
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "mt-6 grid grid-cols-1 gap-6 xl:grid-cols-3", children: [
          /* @__PURE__ */ jsx(
            SnapshotTrendCard,
            {
              title: "Registration Rate",
              points: snapshotTrends.academic?.session_registration_rate ?? [],
              suffix: "%"
            }
          ),
          /* @__PURE__ */ jsx(
            SnapshotTrendCard,
            {
              title: "Hostel Occupancy",
              points: snapshotTrends.hostel?.occupancy_rate ?? [],
              suffix: "%"
            }
          ),
          /* @__PURE__ */ jsx(
            SnapshotTrendCard,
            {
              title: "Slow Query Count",
              points: snapshotTrends.quality?.slow_query_count ?? []
            }
          )
        ] })
      ] }),
      showFinance && /* @__PURE__ */ jsxs(Fragment, { children: [
        !financeOnlyPage || loadedFinanceSections.collection ? /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 gap-6 md:grid-cols-4", children: [
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
        ] }) : /* @__PURE__ */ jsx(
          LoadFinancePanel,
          {
            title: "Collection Performance",
            description: "Load invoiced, collected, outstanding, and collection-rate figures.",
            loading: Boolean(financeSectionLoading.collection),
            onLoad: () => loadFinanceSection("collection")
          }
        ),
        !financeOnlyPage || loadedFinanceSections.outstanding ? /* @__PURE__ */ jsxs("div", { className: "rounded-lg border border-zinc-100 bg-white p-6 shadow-sm", children: [
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
        ] }) : /* @__PURE__ */ jsx(
          LoadFinancePanel,
          {
            title: "Outstanding Balance by Session",
            description: "Load the session-by-session outstanding invoice breakdown.",
            loading: Boolean(financeSectionLoading.outstanding),
            onLoad: () => loadFinanceSection("outstanding")
          }
        ),
        !financeOnlyPage || loadedFinanceSections.overdue ? /* @__PURE__ */ jsxs("div", { className: "rounded-lg border border-zinc-100 bg-white p-6 shadow-sm", children: [
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
        ] }) : /* @__PURE__ */ jsx(
          LoadFinancePanel,
          {
            title: "Overdue Amounts by Department",
            description: "Load overdue totals grouped by department.",
            loading: Boolean(financeSectionLoading.overdue),
            onLoad: () => loadFinanceSection("overdue")
          }
        ),
        !financeOnlyPage || loadedFinanceSections.usage ? /* @__PURE__ */ jsxs("div", { className: "rounded-lg border border-zinc-100 bg-white p-6 shadow-sm", children: [
          /* @__PURE__ */ jsxs("div", { className: "mb-4 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between", children: [
            /* @__PURE__ */ jsx("h2", { className: "text-lg font-semibold text-zinc-700", children: "Fee Plan Usage Statistics" }),
            /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 gap-4 md:grid-cols-3", children: [
              /* @__PURE__ */ jsxs("div", { className: "min-w-56", children: [
                /* @__PURE__ */ jsx(InputLabel, { value: "Academic Session" }),
                /* @__PURE__ */ jsx(
                  SearchSelect,
                  {
                    routeName: "academic.sessions.search",
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
              /* @__PURE__ */ jsx("th", { className: "px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500", children: "Curriculum Count" })
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
        ] }) : /* @__PURE__ */ jsx(
          LoadFinancePanel,
          {
            title: "Fee Plan Usage Statistics",
            description: "Load fee-plan usage and activate the session and study-level filters.",
            loading: Boolean(financeSectionLoading.usage),
            onLoad: () => loadFinanceSection("usage")
          }
        )
      ] })
    ] })
  ] });
}
function MetricCard({ label, value, helper = null, accent = "text-zinc-900" }) {
  return /* @__PURE__ */ jsxs("div", { className: "rounded-lg border border-zinc-100 bg-white p-6 shadow-sm", children: [
    /* @__PURE__ */ jsx("h3", { className: "text-sm font-medium text-zinc-500", children: label }),
    /* @__PURE__ */ jsx("p", { className: `text-2xl font-bold ${accent}`, children: value }),
    helper ? /* @__PURE__ */ jsx("p", { className: "mt-2 text-xs text-zinc-500", children: helper }) : null
  ] });
}
function LoadFinancePanel({ title, description, loading, onLoad }) {
  return /* @__PURE__ */ jsx("div", { className: "rounded-lg border border-zinc-100 bg-white p-6 shadow-sm", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between", children: [
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("h2", { className: "text-lg font-semibold text-zinc-700", children: title }),
      /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-zinc-500", children: description })
    ] }),
    /* @__PURE__ */ jsx(
      "button",
      {
        type: "button",
        onClick: onLoad,
        disabled: loading,
        className: "rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-60",
        children: loading ? "Loading..." : "Load Data"
      }
    )
  ] }) });
}
function SnapshotTrendCard({
  title,
  points,
  formatter = (value) => value,
  suffix = ""
}) {
  return /* @__PURE__ */ jsxs("div", { className: "rounded-lg border border-zinc-100 bg-zinc-50 p-4", children: [
    /* @__PURE__ */ jsx("h3", { className: "text-sm font-semibold text-zinc-700", children: title }),
    /* @__PURE__ */ jsx("div", { className: "mt-4 space-y-3", children: points.length ? points.slice(-7).map((point) => /* @__PURE__ */ jsxs(
      "div",
      {
        className: "flex items-center justify-between text-sm",
        children: [
          /* @__PURE__ */ jsx("span", { className: "text-zinc-500", children: point.date }),
          /* @__PURE__ */ jsxs("span", { className: "font-medium text-zinc-900", children: [
            formatter(point.value),
            suffix
          ] })
        ]
      },
      `${title}-${point.date}`
    )) : /* @__PURE__ */ jsx("p", { className: "text-sm text-zinc-500", children: "No snapshot trend data available yet." }) })
  ] });
}
export {
  ReportsIndex as default
};
