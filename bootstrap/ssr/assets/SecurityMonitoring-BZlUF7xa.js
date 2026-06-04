import { jsxs, jsx } from "react/jsx-runtime";
import { useForm, Head, router } from "@inertiajs/react";
import { A as AuthenticatedLayout } from "../app.js";
import "axios";
import "react";
import "lucide-react";
import "react-toastify";
import "react-dom/client";
const riskTone = (risk) => ({
  info: "bg-blue-50 text-blue-700",
  warning: "bg-amber-100 text-amber-800",
  high: "bg-orange-100 text-orange-800",
  critical: "bg-red-100 text-red-800"
})[risk] || "bg-zinc-100 text-zinc-700";
function SecurityMonitoring({ events, blocks, filters, summary }) {
  const eventRows = events?.data ?? [];
  const blockRows = blocks?.data ?? [];
  const filterForm = useForm({
    risk: filters.risk || "",
    event: filters.event || "",
    search: filters.search || ""
  });
  const blockForm = useForm({
    subject: "",
    ip_address: "",
    device_id: "",
    location_hint: "",
    reason: "",
    notes: "",
    risk_level: "high",
    duration_minutes: "60"
  });
  const submitFilters = (e) => {
    e.preventDefault();
    router.get(route("settings.security.index"), filterForm.data, {
      preserveState: true,
      preserveScroll: true
    });
  };
  const submitBlock = (e) => {
    e.preventDefault();
    blockForm.post(route("settings.security.blocks.store"), {
      preserveScroll: true,
      onSuccess: () => blockForm.reset(
        "subject",
        "ip_address",
        "device_id",
        "location_hint",
        "reason",
        "notes",
        "duration_minutes"
      )
    });
  };
  return /* @__PURE__ */ jsxs(
    AuthenticatedLayout,
    {
      header: /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h1", { className: "text-3xl font-semibold text-zinc-900", children: "Security Monitoring" }),
        /* @__PURE__ */ jsx("p", { className: "mt-2 max-w-3xl text-sm text-zinc-600", children: "Review security audit events, investigate suspicious authentication behavior, and apply targeted blocks by user, IP, device, or location hint." })
      ] }),
      children: [
        /* @__PURE__ */ jsx(Head, { title: "Security Monitoring" }),
        /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-7xl space-y-6", children: [
          /* @__PURE__ */ jsx("section", { className: "grid gap-4 md:grid-cols-2 xl:grid-cols-4", children: [
            ["High Risk Events (24h)", summary.high_risk_events_24h],
            ["Active Blocks", summary.active_blocks],
            ["Failed Logins (24h)", summary.failed_logins_24h],
            ["Forgot Password Risks (24h)", summary.forgot_password_risks_24h]
          ].map(([label, value]) => /* @__PURE__ */ jsxs(
            "div",
            {
              className: "rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm",
              children: [
                /* @__PURE__ */ jsx("p", { className: "text-sm text-zinc-500", children: label }),
                /* @__PURE__ */ jsx("p", { className: "mt-2 text-3xl font-bold text-zinc-900", children: value })
              ]
            },
            label
          )) }),
          /* @__PURE__ */ jsxs("section", { className: "grid gap-6 xl:grid-cols-[1.1fr,0.9fr]", children: [
            /* @__PURE__ */ jsxs(
              "form",
              {
                onSubmit: submitBlock,
                className: "rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm",
                children: [
                  /* @__PURE__ */ jsx("h2", { className: "text-lg font-semibold text-zinc-900", children: "Create Security Block" }),
                  /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-zinc-500", children: "Specify one or more attributes. Only requests that match all filled attributes will be blocked." }),
                  /* @__PURE__ */ jsxs("div", { className: "mt-5 grid gap-4 md:grid-cols-2", children: [
                    /* @__PURE__ */ jsx(
                      "input",
                      {
                        value: blockForm.data.subject,
                        onChange: (e) => blockForm.setData("subject", e.target.value),
                        placeholder: "User email or login ID",
                        className: "rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-400"
                      }
                    ),
                    /* @__PURE__ */ jsx(
                      "input",
                      {
                        value: blockForm.data.ip_address,
                        onChange: (e) => blockForm.setData("ip_address", e.target.value),
                        placeholder: "IP address",
                        className: "rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-400"
                      }
                    ),
                    /* @__PURE__ */ jsx(
                      "input",
                      {
                        value: blockForm.data.device_id,
                        onChange: (e) => blockForm.setData("device_id", e.target.value),
                        placeholder: "Device ID",
                        className: "rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-400"
                      }
                    ),
                    /* @__PURE__ */ jsx(
                      "input",
                      {
                        value: blockForm.data.location_hint,
                        onChange: (e) => blockForm.setData("location_hint", e.target.value),
                        placeholder: "Location hint",
                        className: "rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-400"
                      }
                    ),
                    /* @__PURE__ */ jsx(
                      "input",
                      {
                        value: blockForm.data.reason,
                        onChange: (e) => blockForm.setData("reason", e.target.value),
                        placeholder: "Reason",
                        className: "rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-400 md:col-span-2"
                      }
                    ),
                    /* @__PURE__ */ jsx(
                      "textarea",
                      {
                        value: blockForm.data.notes,
                        onChange: (e) => blockForm.setData("notes", e.target.value),
                        placeholder: "Investigation notes",
                        className: "min-h-24 rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-400 md:col-span-2"
                      }
                    ),
                    /* @__PURE__ */ jsxs(
                      "select",
                      {
                        value: blockForm.data.risk_level,
                        onChange: (e) => blockForm.setData("risk_level", e.target.value),
                        className: "rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-400",
                        children: [
                          /* @__PURE__ */ jsx("option", { value: "warning", children: "Warning" }),
                          /* @__PURE__ */ jsx("option", { value: "high", children: "High" }),
                          /* @__PURE__ */ jsx("option", { value: "critical", children: "Critical" })
                        ]
                      }
                    ),
                    /* @__PURE__ */ jsx(
                      "input",
                      {
                        type: "number",
                        min: "5",
                        max: "10080",
                        value: blockForm.data.duration_minutes,
                        onChange: (e) => blockForm.setData("duration_minutes", e.target.value),
                        placeholder: "Duration in minutes",
                        className: "rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-400"
                      }
                    )
                  ] }),
                  Object.values(blockForm.errors).length ? /* @__PURE__ */ jsx("div", { className: "mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700", children: Object.values(blockForm.errors)[0] }) : null,
                  /* @__PURE__ */ jsx("div", { className: "mt-5 flex justify-end", children: /* @__PURE__ */ jsx(
                    "button",
                    {
                      type: "submit",
                      disabled: blockForm.processing,
                      className: "rounded-xl bg-red-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-red-700 disabled:opacity-60",
                      children: blockForm.processing ? "Saving..." : "Create Block"
                    }
                  ) })
                ]
              }
            ),
            /* @__PURE__ */ jsxs(
              "form",
              {
                onSubmit: submitFilters,
                className: "rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm",
                children: [
                  /* @__PURE__ */ jsx("h2", { className: "text-lg font-semibold text-zinc-900", children: "Event Filters" }),
                  /* @__PURE__ */ jsxs("div", { className: "mt-5 grid gap-4", children: [
                    /* @__PURE__ */ jsxs(
                      "select",
                      {
                        value: filterForm.data.risk,
                        onChange: (e) => filterForm.setData("risk", e.target.value),
                        className: "rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-400",
                        children: [
                          /* @__PURE__ */ jsx("option", { value: "", children: "All risk levels" }),
                          /* @__PURE__ */ jsx("option", { value: "info", children: "Info" }),
                          /* @__PURE__ */ jsx("option", { value: "warning", children: "Warning" }),
                          /* @__PURE__ */ jsx("option", { value: "high", children: "High" }),
                          /* @__PURE__ */ jsx("option", { value: "critical", children: "Critical" })
                        ]
                      }
                    ),
                    /* @__PURE__ */ jsx(
                      "input",
                      {
                        value: filterForm.data.event,
                        onChange: (e) => filterForm.setData("event", e.target.value),
                        placeholder: "Event type e.g. login.failed",
                        className: "rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-400"
                      }
                    ),
                    /* @__PURE__ */ jsx(
                      "input",
                      {
                        value: filterForm.data.search,
                        onChange: (e) => filterForm.setData("search", e.target.value),
                        placeholder: "Search email, login, IP, device, location",
                        className: "rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-400"
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsx("div", { className: "mt-5 flex justify-end", children: /* @__PURE__ */ jsx(
                    "button",
                    {
                      type: "submit",
                      className: "rounded-xl bg-zinc-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-zinc-800",
                      children: "Apply Filters"
                    }
                  ) })
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("section", { className: "rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsx("h2", { className: "text-lg font-semibold text-zinc-900", children: "Security Events" }),
              /* @__PURE__ */ jsxs("p", { className: "text-sm text-zinc-500", children: [
                "Showing ",
                events.from ?? 0,
                "-",
                events.to ?? 0,
                " of",
                " ",
                events.total ?? 0,
                " events"
              ] })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "mt-5 overflow-x-auto", children: /* @__PURE__ */ jsxs("table", { className: "w-full min-w-[78rem] border-collapse", children: [
              /* @__PURE__ */ jsx("thead", { className: "bg-zinc-50", children: /* @__PURE__ */ jsxs("tr", { className: "text-left text-xs font-semibold uppercase tracking-wide text-zinc-500", children: [
                /* @__PURE__ */ jsx("th", { className: "px-4 py-3", children: "When" }),
                /* @__PURE__ */ jsx("th", { className: "px-4 py-3", children: "Event" }),
                /* @__PURE__ */ jsx("th", { className: "px-4 py-3", children: "Risk" }),
                /* @__PURE__ */ jsx("th", { className: "px-4 py-3", children: "User" }),
                /* @__PURE__ */ jsx("th", { className: "px-4 py-3", children: "Login" }),
                /* @__PURE__ */ jsx("th", { className: "px-4 py-3", children: "IP" }),
                /* @__PURE__ */ jsx("th", { className: "px-4 py-3", children: "Device" }),
                /* @__PURE__ */ jsx("th", { className: "px-4 py-3", children: "Location" })
              ] }) }),
              /* @__PURE__ */ jsx("tbody", { className: "divide-y divide-zinc-100 bg-white", children: eventRows.length ? eventRows.map((event) => /* @__PURE__ */ jsxs("tr", { className: "text-sm", children: [
                /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-zinc-600", children: event.occurred_at }),
                /* @__PURE__ */ jsx("td", { className: "px-4 py-3 font-medium text-zinc-900", children: event.event_type }),
                /* @__PURE__ */ jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsx("span", { className: `rounded-full px-3 py-1 text-xs font-semibold ${riskTone(event.risk_level)}`, children: event.risk_level }) }),
                /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-zinc-700", children: event.user?.name || "-" }),
                /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-zinc-700", children: event.login_identifier || event.email || "-" }),
                /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-zinc-700", children: event.ip_address || "-" }),
                /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-zinc-700", children: event.device_id || "-" }),
                /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-zinc-700", children: event.location_hint || "-" })
              ] }, event.id)) : /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", { colSpan: "8", className: "px-4 py-10 text-center text-sm text-zinc-500", children: "No security events found for the current filters." }) }) })
            ] }) }),
            /* @__PURE__ */ jsx(Pagination, { pagination: events, pageName: "events_page" })
          ] }),
          /* @__PURE__ */ jsxs("section", { className: "rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsx("h2", { className: "text-lg font-semibold text-zinc-900", children: "Security Blocks" }),
              /* @__PURE__ */ jsxs("p", { className: "text-sm text-zinc-500", children: [
                "Showing ",
                blocks.from ?? 0,
                "-",
                blocks.to ?? 0,
                " of",
                " ",
                blocks.total ?? 0,
                " blocks"
              ] })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "mt-5 overflow-x-auto", children: /* @__PURE__ */ jsxs("table", { className: "w-full min-w-[72rem] border-collapse", children: [
              /* @__PURE__ */ jsx("thead", { className: "bg-zinc-50", children: /* @__PURE__ */ jsxs("tr", { className: "text-left text-xs font-semibold uppercase tracking-wide text-zinc-500", children: [
                /* @__PURE__ */ jsx("th", { className: "px-4 py-3", children: "Reason" }),
                /* @__PURE__ */ jsx("th", { className: "px-4 py-3", children: "Status" }),
                /* @__PURE__ */ jsx("th", { className: "px-4 py-3", children: "User / Login" }),
                /* @__PURE__ */ jsx("th", { className: "px-4 py-3", children: "IP" }),
                /* @__PURE__ */ jsx("th", { className: "px-4 py-3", children: "Device" }),
                /* @__PURE__ */ jsx("th", { className: "px-4 py-3", children: "Location" }),
                /* @__PURE__ */ jsx("th", { className: "px-4 py-3", children: "Ends" }),
                /* @__PURE__ */ jsx("th", { className: "px-4 py-3 text-right", children: "Action" })
              ] }) }),
              /* @__PURE__ */ jsx("tbody", { className: "divide-y divide-zinc-100 bg-white", children: blockRows.length ? blockRows.map((block) => /* @__PURE__ */ jsxs("tr", { className: "text-sm", children: [
                /* @__PURE__ */ jsx("td", { className: "px-4 py-3 font-medium text-zinc-900", children: block.reason }),
                /* @__PURE__ */ jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsx("span", { className: `rounded-full px-3 py-1 text-xs font-semibold ${block.is_active ? "bg-red-100 text-red-800" : "bg-zinc-100 text-zinc-700"}`, children: block.is_active ? "Active" : "Lifted" }) }),
                /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-zinc-700", children: block.user?.name || block.login_identifier || block.email || "-" }),
                /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-zinc-700", children: block.ip_address || "-" }),
                /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-zinc-700", children: block.device_id || "-" }),
                /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-zinc-700", children: block.location_hint || "-" }),
                /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-zinc-700", children: block.ends_at || "Manual" }),
                /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-right", children: block.is_active ? /* @__PURE__ */ jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => router.put(
                      route("settings.security.blocks.lift", block.id),
                      {},
                      { preserveScroll: true }
                    ),
                    className: "font-medium text-emerald-700 transition hover:text-emerald-800",
                    children: "Lift"
                  }
                ) : /* @__PURE__ */ jsx("span", { className: "text-zinc-400", children: "Closed" }) })
              ] }, block.id)) : /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", { colSpan: "8", className: "px-4 py-10 text-center text-sm text-zinc-500", children: "No security blocks recorded yet." }) }) })
            ] }) }),
            /* @__PURE__ */ jsx(Pagination, { pagination: blocks, pageName: "blocks_page" })
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
  const pages = Array.from({ length: end - start + 1 }, (_, index) => start + index);
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
  return /* @__PURE__ */ jsxs("div", { className: "mt-5 flex flex-col gap-3 border-t border-zinc-100 pt-4 sm:flex-row sm:items-center sm:justify-between", children: [
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
  SecurityMonitoring as default
};
