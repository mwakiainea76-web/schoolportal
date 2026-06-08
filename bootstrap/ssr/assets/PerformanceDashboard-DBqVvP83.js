import { jsxs, jsx } from "react/jsx-runtime";
import { Head, router } from "@inertiajs/react";
import { A as AuthenticatedLayout } from "../app.js";
import "axios";
import "react-dom/client";
import "react";
import "lucide-react";
import "react-toastify";
const number = (value) => new Intl.NumberFormat("en-KE").format(value || 0);
const ms = (value) => `${number(value)} ms`;
function Stat({ label, value, helper, tone = "emerald" }) {
  const tones = {
    emerald: "border-emerald-200 bg-emerald-50 text-emerald-700",
    amber: "border-amber-200 bg-amber-50 text-amber-700",
    rose: "border-rose-200 bg-rose-50 text-rose-700",
    zinc: "border-zinc-200 bg-zinc-50 text-zinc-700"
  };
  return /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm", children: [
    /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold uppercase tracking-wide text-zinc-500", children: label }),
    /* @__PURE__ */ jsx("p", { className: "mt-3 text-3xl font-semibold text-zinc-900", children: value }),
    /* @__PURE__ */ jsx(
      "p",
      {
        className: `mt-3 inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${tones[tone]}`,
        children: helper
      }
    )
  ] });
}
function BarList({ items, labelKey, valueKey, emptyText }) {
  const max = Math.max(...items.map((item) => item[valueKey] || 0), 1);
  if (!items.length) {
    return /* @__PURE__ */ jsx("div", { className: "py-8 text-center text-sm text-zinc-500", children: emptyText });
  }
  return /* @__PURE__ */ jsx("div", { className: "space-y-3", children: items.map((item) => /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsxs("div", { className: "mb-1 flex items-center justify-between text-xs", children: [
      /* @__PURE__ */ jsx("span", { className: "font-medium text-zinc-700", children: item[labelKey] }),
      /* @__PURE__ */ jsx("span", { className: "text-zinc-500", children: number(item[valueKey]) })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "h-2 overflow-hidden rounded-full bg-zinc-100", children: /* @__PURE__ */ jsx(
      "div",
      {
        className: "h-full rounded-full bg-emerald-500",
        style: {
          width: `${item[valueKey] / max * 100}%`
        }
      }
    ) })
  ] }, item[labelKey])) });
}
function PerformanceDashboard({
  range,
  load_slow_endpoints,
  summary,
  status_breakdown,
  method_breakdown,
  traffic_trend,
  slow_endpoints,
  slow_endpoints_count,
  recent_errors
}) {
  const slowEndpointRows = slow_endpoints?.data ?? [];
  const setRange = (nextRange) => {
    const params = { range: nextRange };
    if (load_slow_endpoints) {
      params.load_slow_endpoints = 1;
    }
    router.get(
      route("settings.performance.index"),
      params,
      { preserveScroll: true, preserveState: true }
    );
  };
  const loadSlowEndpoints = () => {
    router.get(
      route("settings.performance.index"),
      {
        range,
        load_slow_endpoints: 1
      },
      { preserveScroll: true, preserveState: true }
    );
  };
  const rangeOptions = [
    { value: "1h", label: "1 hour" },
    { value: "24h", label: "24 hours" },
    { value: "7d", label: "7 days" }
  ];
  const updateErrorStatus = (errorId, errorStatus) => {
    router.patch(
      route("settings.performance.errors.update-status", errorId),
      { error_status: errorStatus },
      { preserveScroll: true, preserveState: true }
    );
  };
  const updateEndpointStatus = (endpoint, status) => {
    router.patch(
      route("settings.performance.endpoints.update-status"),
      {
        endpoint_key: endpoint.endpoint_key,
        method: endpoint.method,
        path: endpoint.path,
        route_name: endpoint.route_name,
        status,
        range,
        load_slow_endpoints: 1
      },
      { preserveScroll: true, preserveState: true }
    );
  };
  const healthTone = summary.error_rate > 5 ? "rose" : summary.p95_ms > 1e3 ? "amber" : "emerald";
  return /* @__PURE__ */ jsxs(
    AuthenticatedLayout,
    {
      header: /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h1", { className: "text-3xl font-semibold text-zinc-900", children: "App Performance" }),
          /* @__PURE__ */ jsx("p", { className: "mt-2 max-w-3xl text-sm text-zinc-600", children: "Runtime visibility for API traffic, response times, error rate, slow endpoints, and CORS exposure." })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "flex rounded-xl border border-zinc-200 bg-white p-1 shadow-sm", children: rangeOptions.map((option) => /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            onClick: () => setRange(option.value),
            className: `rounded-lg px-4 py-2 text-sm font-medium transition ${range === option.value ? "bg-emerald-600 text-white" : "text-zinc-600 hover:bg-zinc-50"}`,
            children: option.label
          },
          option.value
        )) })
      ] }),
      children: [
        /* @__PURE__ */ jsx(Head, { title: "App Performance" }),
        /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-7xl space-y-8", children: [
          /* @__PURE__ */ jsxs("div", { className: "grid gap-4 md:grid-cols-2 xl:grid-cols-4", children: [
            /* @__PURE__ */ jsx(
              Stat,
              {
                label: "Requests",
                value: number(summary.total_requests),
                helper: `${number(summary.api_requests)} API / ${number(summary.web_requests)} web`
              }
            ),
            /* @__PURE__ */ jsx(
              Stat,
              {
                label: "P95 Latency",
                value: ms(summary.p95_ms),
                helper: `Avg ${ms(summary.average_ms)}`,
                tone: healthTone
              }
            ),
            /* @__PURE__ */ jsx(
              Stat,
              {
                label: "Error Rate",
                value: `${summary.error_rate}%`,
                helper: `${number(summary.server_errors)} server errors`,
                tone: summary.error_rate > 0 ? "rose" : "emerald"
              }
            ),
            /* @__PURE__ */ jsx(
              Stat,
              {
                label: "Slow Requests",
                value: number(summary.slow_requests),
                helper: `Peak memory ${summary.memory_peak_mb} MB`,
                tone: summary.slow_requests > 0 ? "amber" : "zinc"
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "grid gap-6 xl:grid-cols-[1.5fr,1fr]", children: [
            /* @__PURE__ */ jsxs("div", { className: "rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm", children: [
              /* @__PURE__ */ jsxs("div", { className: "mb-5 flex items-center justify-between", children: [
                /* @__PURE__ */ jsx("h2", { className: "text-lg font-semibold text-zinc-900", children: "Traffic Trend" }),
                /* @__PURE__ */ jsx("span", { className: "text-xs font-medium text-zinc-500", children: "Requests and avg latency" })
              ] }),
              traffic_trend.length ? /* @__PURE__ */ jsx("div", { className: "grid min-h-72 items-end gap-3 sm:grid-cols-6 lg:grid-cols-12", children: traffic_trend.slice(-12).map((point) => {
                const maxRequests = Math.max(
                  ...traffic_trend.map(
                    (item) => item.requests || 0
                  ),
                  1
                );
                return /* @__PURE__ */ jsxs(
                  "div",
                  {
                    className: "flex h-72 flex-col justify-end gap-2",
                    children: [
                      /* @__PURE__ */ jsx(
                        "div",
                        {
                          className: "rounded-t-lg bg-emerald-500",
                          style: {
                            height: `${Math.max(
                              point.requests / maxRequests * 220,
                              8
                            )}px`
                          },
                          title: `${point.requests} requests`
                        }
                      ),
                      /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
                        /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold text-zinc-700", children: number(point.requests) }),
                        /* @__PURE__ */ jsx("p", { className: "truncate text-[11px] text-zinc-400", children: point.label })
                      ] })
                    ]
                  },
                  point.label
                );
              }) }) : /* @__PURE__ */ jsx("div", { className: "py-20 text-center text-sm text-zinc-500", children: "No request metrics in this range yet." })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
              /* @__PURE__ */ jsxs("div", { className: "rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm", children: [
                /* @__PURE__ */ jsx("h2", { className: "mb-5 text-lg font-semibold text-zinc-900", children: "Status Codes" }),
                /* @__PURE__ */ jsx(
                  BarList,
                  {
                    items: status_breakdown,
                    labelKey: "status",
                    valueKey: "count",
                    emptyText: "No statuses recorded."
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm", children: [
                /* @__PURE__ */ jsx("h2", { className: "mb-5 text-lg font-semibold text-zinc-900", children: "Methods" }),
                /* @__PURE__ */ jsx(
                  BarList,
                  {
                    items: method_breakdown,
                    labelKey: "method",
                    valueKey: "count",
                    emptyText: "No methods recorded."
                  }
                )
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm", children: [
            /* @__PURE__ */ jsx("h2", { className: "mb-5 text-lg font-semibold text-zinc-900", children: "Recent Server Errors" }),
            /* @__PURE__ */ jsx("div", { className: "space-y-3", children: recent_errors.length ? recent_errors.map((error) => /* @__PURE__ */ jsxs(
              "div",
              {
                className: "rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm",
                children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-4", children: [
                    /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
                      /* @__PURE__ */ jsxs("p", { className: "font-semibold text-red-800", children: [
                        error.status_code,
                        " ",
                        error.method,
                        " ",
                        error.route_name || error.path
                      ] }),
                      /* @__PURE__ */ jsxs("p", { className: "mt-1 text-xs uppercase tracking-wide text-red-600", children: [
                        "Status:",
                        " ",
                        error.error_status === "in_progress" ? "in progress" : error.error_status
                      ] })
                    ] }),
                    /* @__PURE__ */ jsx("p", { className: "text-xs text-red-600", children: ms(error.duration_ms) })
                  ] }),
                  /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs text-red-600", children: error.occurred_at }),
                  /* @__PURE__ */ jsxs("div", { className: "mt-3 flex flex-wrap gap-2", children: [
                    /* @__PURE__ */ jsx(
                      "button",
                      {
                        type: "button",
                        onClick: () => updateErrorStatus(
                          error.id,
                          "pending"
                        ),
                        className: `rounded-full px-3 py-1 text-xs font-semibold transition ${error.error_status === "pending" ? "bg-amber-600 text-white" : "bg-white text-amber-700 ring-1 ring-inset ring-amber-200 hover:bg-amber-100"}`,
                        children: "Pending"
                      }
                    ),
                    /* @__PURE__ */ jsx(
                      "button",
                      {
                        type: "button",
                        onClick: () => updateErrorStatus(
                          error.id,
                          "in_progress"
                        ),
                        className: `rounded-full px-3 py-1 text-xs font-semibold transition ${error.error_status === "in_progress" ? "bg-sky-600 text-white" : "bg-white text-sky-700 ring-1 ring-inset ring-sky-200 hover:bg-sky-100"}`,
                        children: "In Progress"
                      }
                    ),
                    /* @__PURE__ */ jsx(
                      "button",
                      {
                        type: "button",
                        onClick: () => updateErrorStatus(
                          error.id,
                          "resolved"
                        ),
                        className: "rounded-full bg-white px-3 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-200 transition hover:bg-emerald-100",
                        children: "Resolve"
                      }
                    )
                  ] })
                ]
              },
              error.id
            )) : /* @__PURE__ */ jsx("div", { className: "py-8 text-center text-sm text-zinc-500", children: "No server errors in this range." }) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm", children: [
            /* @__PURE__ */ jsxs("div", { className: "mb-5 flex items-center justify-between", children: [
              /* @__PURE__ */ jsx("h2", { className: "text-lg font-semibold text-zinc-900", children: "Slowest Endpoints" }),
              /* @__PURE__ */ jsx("span", { className: "text-xs font-medium text-zinc-500", children: load_slow_endpoints ? `Showing ${slow_endpoints?.from ?? 0}-${slow_endpoints?.to ?? 0} of ${slow_endpoints?.total ?? 0}, sorted by p95 latency` : `${slow_endpoints_count ?? 0} endpoints were identified as slow. Click to view them` })
            ] }),
            !load_slow_endpoints ? /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border border-dashed border-zinc-200 bg-zinc-50 px-6 py-10 text-center", children: [
              /* @__PURE__ */ jsx("p", { className: "text-sm text-zinc-600", children: "Slow endpoint aggregation can be expensive on busy ranges." }),
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  onClick: loadSlowEndpoints,
                  className: "mt-4 rounded-xl bg-zinc-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-zinc-800",
                  children: "Load Slowest Endpoints"
                }
              )
            ] }) : /* @__PURE__ */ jsxs("div", { className: "overflow-hidden rounded-2xl border border-zinc-100", children: [
              /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs("table", { className: "w-full min-w-[58rem] border-collapse", children: [
                /* @__PURE__ */ jsx("thead", { className: "bg-zinc-50", children: /* @__PURE__ */ jsxs("tr", { className: "text-xs font-semibold uppercase tracking-wide text-zinc-500", children: [
                  /* @__PURE__ */ jsx("th", { className: "px-4 py-3 text-left", children: "Endpoint" }),
                  /* @__PURE__ */ jsx("th", { className: "px-4 py-3 text-left", children: "Hits" }),
                  /* @__PURE__ */ jsx("th", { className: "px-4 py-3 text-left", children: "Avg" }),
                  /* @__PURE__ */ jsx("th", { className: "px-4 py-3 text-left", children: "P95" }),
                  /* @__PURE__ */ jsx("th", { className: "px-4 py-3 text-left", children: "Max" }),
                  /* @__PURE__ */ jsx("th", { className: "px-4 py-3 text-left", children: "Errors" }),
                  /* @__PURE__ */ jsx("th", { className: "px-4 py-3 text-left", children: "Status" })
                ] }) }),
                /* @__PURE__ */ jsx("tbody", { className: "divide-y divide-zinc-100 bg-white", children: slowEndpointRows.length ? slowEndpointRows.map((endpoint) => /* @__PURE__ */ jsxs(
                  "tr",
                  {
                    className: "text-sm",
                    children: [
                      /* @__PURE__ */ jsx("td", { className: "max-w-0 px-4 py-3 font-medium text-zinc-900", children: /* @__PURE__ */ jsx("span", { className: "block truncate", children: endpoint.endpoint }) }),
                      /* @__PURE__ */ jsx("td", { className: "px-4 py-3", children: number(
                        endpoint.requests
                      ) }),
                      /* @__PURE__ */ jsx("td", { className: "px-4 py-3", children: ms(
                        endpoint.average_ms
                      ) }),
                      /* @__PURE__ */ jsx("td", { className: "px-4 py-3 font-semibold text-zinc-900", children: ms(endpoint.p95_ms) }),
                      /* @__PURE__ */ jsx("td", { className: "px-4 py-3", children: ms(endpoint.max_ms) }),
                      /* @__PURE__ */ jsx(
                        "td",
                        {
                          className: `px-4 py-3 ${endpoint.errors ? "text-red-600" : "text-zinc-500"}`,
                          children: number(
                            endpoint.errors
                          )
                        }
                      ),
                      /* @__PURE__ */ jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-2", children: [
                        /* @__PURE__ */ jsx(
                          "button",
                          {
                            type: "button",
                            onClick: () => updateEndpointStatus(
                              endpoint,
                              "pending"
                            ),
                            className: `rounded-full px-3 py-1 text-xs font-semibold transition ${endpoint.status === "pending" ? "bg-amber-600 text-white" : "bg-white text-amber-700 ring-1 ring-inset ring-amber-200 hover:bg-amber-100"}`,
                            children: "Pending"
                          }
                        ),
                        /* @__PURE__ */ jsx(
                          "button",
                          {
                            type: "button",
                            onClick: () => updateEndpointStatus(
                              endpoint,
                              "in_progress"
                            ),
                            className: `rounded-full px-3 py-1 text-xs font-semibold transition ${endpoint.status === "in_progress" ? "bg-sky-600 text-white" : "bg-white text-sky-700 ring-1 ring-inset ring-sky-200 hover:bg-sky-100"}`,
                            children: "In Progress"
                          }
                        ),
                        /* @__PURE__ */ jsx(
                          "button",
                          {
                            type: "button",
                            onClick: () => updateEndpointStatus(
                              endpoint,
                              "resolved"
                            ),
                            className: `rounded-full px-3 py-1 text-xs font-semibold transition ${endpoint.status === "resolved" ? "bg-emerald-600 text-white" : "bg-white text-emerald-700 ring-1 ring-inset ring-emerald-200 hover:bg-emerald-100"}`,
                            children: "Resolve"
                          }
                        )
                      ] }) })
                    ]
                  },
                  endpoint.endpoint
                )) : /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx(
                  "td",
                  {
                    colSpan: "7",
                    className: "px-4 py-8 text-center text-sm text-zinc-500",
                    children: "No endpoint data in this range."
                  }
                ) }) })
              ] }) }),
              /* @__PURE__ */ jsx(
                Pagination,
                {
                  pagination: slow_endpoints,
                  pageName: "endpoint_page"
                }
              )
            ] })
          ] })
        ] })
      ]
    }
  );
}
function Pagination({ pagination, pageName }) {
  if (!pagination || Number(pagination.last_page ?? 1) <= 1) {
    return null;
  }
  const current = Number(pagination.current_page ?? 1);
  const last = Number(pagination.last_page ?? 1);
  const start = Math.max(1, current - 2);
  const end = Math.min(last, current + 2);
  const pages = Array.from(
    { length: end - start + 1 },
    (_, index) => start + index
  );
  const goToPage = (page) => {
    const params = new URLSearchParams(window.location.search);
    params.set(pageName, page);
    router.get(
      `${window.location.pathname}?${params.toString()}`,
      {},
      {
        preserveScroll: true,
        preserveState: true,
        replace: true
      }
    );
  };
  return /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-3 border-t border-zinc-100 bg-zinc-50 px-6 py-4 sm:flex-row sm:items-center sm:justify-between", children: [
    /* @__PURE__ */ jsxs("p", { className: "text-sm text-zinc-500", children: [
      "Page ",
      current,
      " of ",
      last
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          disabled: current <= 1,
          onClick: () => goToPage(current - 1),
          className: "rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-700 transition hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-50",
          children: "Previous"
        }
      ),
      pages.map((page) => /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          onClick: () => goToPage(page),
          className: `rounded-lg px-3 py-2 text-sm transition ${page === current ? "bg-zinc-900 text-white" : "border border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-100"}`,
          children: page
        },
        page
      )),
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          disabled: current >= last,
          onClick: () => goToPage(current + 1),
          className: "rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-700 transition hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-50",
          children: "Next"
        }
      )
    ] })
  ] });
}
export {
  PerformanceDashboard as default
};
