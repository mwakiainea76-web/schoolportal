import { jsxs, jsx } from "react/jsx-runtime";
import { A as AuthenticatedLayout } from "../app.js";
import { T as TextInput } from "./TextInput-DsoSnibl.js";
import { useForm, Head, Link, router } from "@inertiajs/react";
import "axios";
import "../app2.js";
import "react-dom/client";
import "react";
import "lucide-react";
import "react-toastify";
function AuditLogIndex({ logs, filters }) {
  const rows = logs?.data ?? [];
  const form = useForm({
    search: filters.search || "",
    per_page: String(filters.per_page || 10)
  });
  const applyFilters = (data = form.data) => {
    router.get(route("settings.audit-logs.index"), data, {
      preserveState: true,
      preserveScroll: true,
      replace: true
    });
  };
  const handleSearch = (e) => {
    e.preventDefault();
    applyFilters({ ...form.data, page: 1 });
  };
  const handlePerPageChange = (e) => {
    const nextData = {
      ...form.data,
      per_page: e.target.value,
      page: 1
    };
    form.setData("per_page", e.target.value);
    applyFilters(nextData);
  };
  return /* @__PURE__ */ jsxs(
    AuthenticatedLayout,
    {
      header: /* @__PURE__ */ jsx("h1", { className: "text-2xl font-semibold text-zinc-900", children: "System Activity Logs" }),
      children: [
        /* @__PURE__ */ jsx(Head, { title: "System Activity Logs" }),
        /* @__PURE__ */ jsx("div", { className: "mx-auto max-w-7xl", children: /* @__PURE__ */ jsxs("section", { className: "overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm", children: [
          /* @__PURE__ */ jsx("div", { className: "border-b border-zinc-200 px-4 py-4", children: /* @__PURE__ */ jsx("h2", { className: "text-base font-semibold text-zinc-900", children: "System Activity Logs" }) }),
          /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-4 px-4 py-5 sm:flex-row sm:items-center sm:justify-between", children: [
            /* @__PURE__ */ jsxs("label", { className: "flex items-center gap-2 text-sm text-zinc-900", children: [
              /* @__PURE__ */ jsx("span", { children: "Show" }),
              /* @__PURE__ */ jsx(
                "select",
                {
                  value: form.data.per_page,
                  onChange: handlePerPageChange,
                  className: "rounded-md border-zinc-300 py-2 text-sm shadow-sm focus:border-emerald-500 focus:ring-emerald-500",
                  children: [10, 25, 50, 100].map((size) => /* @__PURE__ */ jsx("option", { value: size, children: size }, size))
                }
              ),
              /* @__PURE__ */ jsx("span", { children: "entries" })
            ] }),
            /* @__PURE__ */ jsxs(
              "form",
              {
                onSubmit: handleSearch,
                className: "flex items-center gap-2 sm:justify-end",
                children: [
                  /* @__PURE__ */ jsx(
                    "label",
                    {
                      htmlFor: "audit-search",
                      className: "text-sm text-zinc-900",
                      children: "Search:"
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    TextInput,
                    {
                      id: "audit-search",
                      value: form.data.search,
                      onChange: (e) => form.setData("search", e.target.value),
                      className: "h-10 w-full sm:w-44"
                    }
                  )
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsx("div", { className: "overflow-x-auto px-4", children: /* @__PURE__ */ jsxs("table", { className: "w-full min-w-[72rem] border-collapse border border-zinc-200", children: [
            /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { className: "border-b border-zinc-200 bg-white text-left text-sm font-semibold text-zinc-900", children: [
              /* @__PURE__ */ jsx("th", { className: "w-[14%] border-r border-zinc-200 px-3 py-3", children: "User" }),
              /* @__PURE__ */ jsx("th", { className: "w-[12%] border-r border-zinc-200 px-3 py-3", children: "Activity" }),
              /* @__PURE__ */ jsx("th", { className: "w-[10%] border-r border-zinc-200 px-3 py-3", children: "Platform" }),
              /* @__PURE__ */ jsx("th", { className: "border-r border-zinc-200 px-3 py-3", children: "Event Details" }),
              /* @__PURE__ */ jsx("th", { className: "w-[20%] px-3 py-3", children: "Date & Time" }),
              /* @__PURE__ */ jsx("th", { className: "w-[10%] px-3 py-3", children: "Details" })
            ] }) }),
            /* @__PURE__ */ jsx("tbody", { children: rows.length ? rows.map((log) => /* @__PURE__ */ jsxs(
              "tr",
              {
                className: "border-b border-zinc-200 odd:bg-zinc-50 even:bg-white",
                children: [
                  /* @__PURE__ */ jsx("td", { className: "border-r border-zinc-200 px-3 py-4 align-top text-sm text-zinc-900", children: log.user?.name || "System" }),
                  /* @__PURE__ */ jsx("td", { className: "border-r border-zinc-200 px-3 py-4 align-top", children: /* @__PURE__ */ jsx(
                    ActivityBadge,
                    {
                      label: log.action_label || log.action
                    }
                  ) }),
                  /* @__PURE__ */ jsx("td", { className: "border-r border-zinc-200 px-3 py-4 align-top text-sm text-zinc-900", children: log.platform || "Web" }),
                  /* @__PURE__ */ jsxs("td", { className: "border-r border-zinc-200 px-3 py-4 align-top text-sm text-zinc-900", children: [
                    /* @__PURE__ */ jsx(EventDescription, { log }),
                    log.change_summary?.length ? /* @__PURE__ */ jsx("div", { className: "mt-2 rounded-md bg-white px-3 py-2 text-xs leading-6 text-zinc-700", children: log.change_summary.map(
                      (line) => /* @__PURE__ */ jsxs("p", { children: [
                        "- ",
                        line
                      ] }, line)
                    ) }) : null
                  ] }),
                  /* @__PURE__ */ jsx("td", { className: "border-r border-zinc-200 px-3 py-4 align-top text-sm text-zinc-900", children: log.created_at }),
                  /* @__PURE__ */ jsx("td", { className: "px-3 py-4 align-top text-sm", children: /* @__PURE__ */ jsx(
                    Link,
                    {
                      href: route(
                        "settings.audit-logs.show",
                        log.id
                      ),
                      className: "font-medium text-blue-700 hover:text-blue-900",
                      children: "View Details"
                    }
                  ) })
                ]
              },
              log.id
            )) : /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx(
              "td",
              {
                colSpan: "6",
                className: "px-4 py-12 text-center text-sm text-zinc-500",
                children: "No audit logs matched the search."
              }
            ) }) })
          ] }) }),
          /* @__PURE__ */ jsx(Pagination, { pagination: logs })
        ] }) })
      ]
    }
  );
}
function ActivityBadge({ label }) {
  const normalized = String(label || "Activity").toLowerCase();
  const styles = normalized.includes("delete") ? "bg-red-600 text-white" : normalized.includes("create") ? "bg-emerald-600 text-white" : "bg-blue-600 text-white";
  return /* @__PURE__ */ jsx("span", { className: `inline-flex rounded px-2 py-1 text-xs font-medium ${styles}`, children: label || "Activity" });
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
function Pagination({ pagination }) {
  if (!pagination) {
    return null;
  }
  const current = Number(pagination.current_page ?? 1);
  const last = Number(pagination.last_page ?? 1);
  const total = Number(pagination.total ?? 0);
  const from = pagination.from ?? 0;
  const to = pagination.to ?? 0;
  const goToPage = (page) => {
    const params = new URLSearchParams(window.location.search);
    params.set("page", page);
    router.get(`${window.location.pathname}?${params.toString()}`, {}, {
      preserveScroll: true,
      preserveState: true,
      replace: true
    });
  };
  return /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-4 px-4 py-5 sm:flex-row sm:items-center sm:justify-between", children: [
    /* @__PURE__ */ jsxs("p", { className: "text-sm text-zinc-900", children: [
      "Showing ",
      from,
      " to ",
      to,
      " of ",
      total,
      " entries"
    ] }),
    last > 1 ? /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-end", children: [
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          disabled: current <= 1,
          onClick: () => goToPage(current - 1),
          className: "border border-zinc-300 bg-white px-4 py-2 text-sm text-zinc-600 transition hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50",
          children: "Previous"
        }
      ),
      /* @__PURE__ */ jsx("span", { className: "border-y border-orange-600 bg-orange-600 px-4 py-2 text-sm text-white", children: current }),
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          disabled: current >= last,
          onClick: () => goToPage(current + 1),
          className: "border border-zinc-300 bg-white px-4 py-2 text-sm text-zinc-600 transition hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50",
          children: "Next"
        }
      )
    ] }) : null
  ] });
}
export {
  AuditLogIndex as default
};
