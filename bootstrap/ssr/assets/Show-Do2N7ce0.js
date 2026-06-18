import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { A as AuthenticatedLayout } from "../app.js";
import { Head, Link } from "@inertiajs/react";
import "axios";
import "../app2.js";
import "react-dom/client";
import "react";
import "lucide-react";
import "@radix-ui/react-collapsible";
import "@radix-ui/react-scroll-area";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-separator";
import "@radix-ui/react-dialog";
import "@radix-ui/react-tooltip";
import "react-toastify";
function AuditLogShow({ auditLog }) {
  const changedRows = buildChangedRows(
    auditLog.old_values_display || auditLog.old_values,
    auditLog.new_values_display || auditLog.new_values
  );
  return /* @__PURE__ */ jsxs(
    AuthenticatedLayout,
    {
      header: /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between", children: [
        /* @__PURE__ */ jsx("h1", { className: "text-2xl font-semibold text-zinc-900", children: "Audit Log Details" }),
        /* @__PURE__ */ jsx(
          Link,
          {
            href: route("settings.audit-logs.index"),
            className: "inline-flex w-fit rounded-md border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50",
            children: "Back to Logs"
          }
        )
      ] }),
      children: [
        /* @__PURE__ */ jsx(Head, { title: "Audit Log Details" }),
        /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-7xl space-y-5", children: [
          /* @__PURE__ */ jsxs("section", { className: "rounded-lg border border-zinc-200 bg-white shadow-sm", children: [
            /* @__PURE__ */ jsxs("div", { className: "border-b border-zinc-200 px-5 py-4", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between", children: [
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold uppercase text-zinc-500", children: "Event Summary" }),
                  /* @__PURE__ */ jsx("div", { className: "mt-2 text-base leading-7 text-zinc-900", children: /* @__PURE__ */ jsx(EventDescription, { log: auditLog }) })
                ] }),
                /* @__PURE__ */ jsx(
                  ActivityBadge,
                  {
                    label: auditLog.action_label || auditLog.action
                  }
                )
              ] }),
              auditLog.change_summary?.length ? /* @__PURE__ */ jsx("div", { className: "mt-4 rounded-md border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm leading-6 text-zinc-700", children: auditLog.change_summary.map((line) => /* @__PURE__ */ jsxs("p", { children: [
                "- ",
                line
              ] }, line)) }) : null
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "grid gap-4 p-5 sm:grid-cols-2 lg:grid-cols-4", children: [
              /* @__PURE__ */ jsx(
                SummaryItem,
                {
                  label: "User",
                  value: auditLog.user?.name || "System"
                }
              ),
              /* @__PURE__ */ jsx(
                SummaryItem,
                {
                  label: "Date & Time",
                  value: auditLog.created_at
                }
              ),
              /* @__PURE__ */ jsx(
                SummaryItem,
                {
                  label: "Platform",
                  value: auditLog.platform || "Web"
                }
              ),
              /* @__PURE__ */ jsx(
                SummaryItem,
                {
                  label: "Risk",
                  value: auditLog.is_high_risk ? "High Risk" : "Standard"
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxs("section", { className: "overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm", children: [
            /* @__PURE__ */ jsx("div", { className: "border-b border-zinc-200 px-4 py-4", children: /* @__PURE__ */ jsx("h2", { className: "text-base font-semibold text-zinc-900", children: "Changed Values" }) }),
            changedRows.length ? /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs("table", { className: "w-full min-w-[48rem] border-collapse text-sm", children: [
              /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { className: "border-b border-zinc-200 bg-zinc-50 text-left font-semibold text-zinc-900", children: [
                /* @__PURE__ */ jsx("th", { className: "w-[28%] px-4 py-3", children: "Field" }),
                /* @__PURE__ */ jsx("th", { className: "w-[36%] px-4 py-3", children: "Before" }),
                /* @__PURE__ */ jsx("th", { className: "w-[36%] px-4 py-3", children: "After" })
              ] }) }),
              /* @__PURE__ */ jsx("tbody", { children: changedRows.map((row) => /* @__PURE__ */ jsxs(
                "tr",
                {
                  className: "border-b border-zinc-200 last:border-b-0",
                  children: [
                    /* @__PURE__ */ jsx("td", { className: "px-4 py-3 font-medium text-zinc-900", children: humanize(row.field) }),
                    /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-zinc-700", children: formatValue(row.before) }),
                    /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-zinc-700", children: formatValue(row.after) })
                  ]
                },
                row.field
              )) })
            ] }) }) : /* @__PURE__ */ jsx("div", { className: "px-5 py-6", children: /* @__PURE__ */ jsx("div", { className: "rounded-md border border-dashed border-zinc-300 bg-zinc-50 px-4 py-4 text-sm text-zinc-600", children: "No field-level changes were stored for this action." }) })
          ] }),
          /* @__PURE__ */ jsxs("section", { className: "rounded-lg border border-zinc-200 bg-white shadow-sm", children: [
            /* @__PURE__ */ jsx("div", { className: "border-b border-zinc-200 px-4 py-4", children: /* @__PURE__ */ jsx("h2", { className: "text-base font-semibold text-zinc-900", children: "Request Context" }) }),
            /* @__PURE__ */ jsxs("div", { className: "grid gap-4 p-5 md:grid-cols-2 xl:grid-cols-3", children: [
              /* @__PURE__ */ jsx(
                ContextItem,
                {
                  label: "Module",
                  value: auditLog.module_label || auditLog.module || "-"
                }
              ),
              /* @__PURE__ */ jsx(
                ContextItem,
                {
                  label: "Entity",
                  value: /* @__PURE__ */ jsxs(Fragment, { children: [
                    auditLog.entity_record_label || auditLog.entity_type || "Record",
                    auditLog.entity_id ? ` (ID: ${auditLog.entity_id})` : ""
                  ] })
                }
              ),
              /* @__PURE__ */ jsx(
                ContextItem,
                {
                  label: "IP Address",
                  value: auditLog.ip_address || "-"
                }
              ),
              /* @__PURE__ */ jsx(
                ContextItem,
                {
                  label: "Request ID",
                  value: auditLog.request_id || "-"
                }
              )
            ] })
          ] })
        ] })
      ]
    }
  );
}
function SummaryItem({ label, value }) {
  return /* @__PURE__ */ jsxs("div", { className: "rounded-md border border-zinc-200 bg-white px-4 py-3", children: [
    /* @__PURE__ */ jsx("p", { className: "text-xs font-medium uppercase text-zinc-500", children: label }),
    /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm font-semibold text-zinc-900", children: value })
  ] });
}
function ContextItem({ label, value }) {
  return /* @__PURE__ */ jsxs("div", { className: "rounded-md bg-zinc-50 px-4 py-3", children: [
    /* @__PURE__ */ jsx("p", { className: "text-xs font-medium uppercase text-zinc-500", children: label }),
    /* @__PURE__ */ jsx("p", { className: "mt-1 break-words text-sm font-medium text-zinc-900", children: value })
  ] });
}
function ActivityBadge({ label }) {
  const normalized = String(label || "Activity").toLowerCase();
  const styles = normalized.includes("delete") ? "bg-red-600 text-white" : normalized.includes("create") ? "bg-emerald-600 text-white" : "bg-blue-600 text-white";
  return /* @__PURE__ */ jsx(
    "span",
    {
      className: `inline-flex rounded px-2 py-1 text-xs font-medium ${styles}`,
      children: label || "Activity"
    }
  );
}
function EventDescription({ log }) {
  if (!log.event_description) {
    return /* @__PURE__ */ jsxs("p", { children: [
      log.entity_record_label || log.entity_type || "Record",
      " ",
      log.entity_id ? `(ID: ${log.entity_id})` : ""
    ] });
  }
  if (!log.entity_record_label) {
    return /* @__PURE__ */ jsx("p", { children: log.event_description });
  }
  const [before, ...afterParts] = log.event_description.split(
    log.entity_record_label
  );
  if (!afterParts.length) {
    return /* @__PURE__ */ jsx("p", { children: log.event_description });
  }
  return /* @__PURE__ */ jsxs("p", { children: [
    before,
    /* @__PURE__ */ jsx("strong", { children: log.entity_record_label }),
    afterParts.join(log.entity_record_label)
  ] });
}
function buildChangedRows(before = {}, after = {}) {
  const beforeValues = isPlainObject(before) ? before : {};
  const afterValues = isPlainObject(after) ? after : {};
  const fields = Array.from(
    /* @__PURE__ */ new Set([...Object.keys(beforeValues), ...Object.keys(afterValues)])
  );
  return fields.map((field) => ({
    field,
    before: beforeValues[field],
    after: afterValues[field]
  }));
}
function formatValue(value) {
  if (value === null || value === void 0 || value === "") {
    return /* @__PURE__ */ jsx("span", { className: "italic text-zinc-500", children: "null" });
  }
  if (typeof value === "boolean") {
    return value ? "Yes" : "No";
  }
  if (Array.isArray(value)) {
    return value.length ? value.join(", ") : "-";
  }
  if (isPlainObject(value)) {
    return Object.entries(value).map(([key, item]) => `${humanize(key)}: ${item}`).join(", ");
  }
  return String(value);
}
function humanize(value) {
  return String(value || "").replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
}
function isPlainObject(value) {
  return value && typeof value === "object" && !Array.isArray(value);
}
export {
  AuditLogShow as default
};
