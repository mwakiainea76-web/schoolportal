import { jsxs, jsx } from "react/jsx-runtime";
import { useForm, Head, router } from "@inertiajs/react";
import { A as AuthenticatedLayout } from "../app.js";
import "axios";
import "react";
import "lucide-react";
import "react-toastify";
import "react-dom/client";
const bytes = (value) => {
  const size = Number(value || 0);
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / 1024 / 1024).toFixed(2)} MB`;
};
const levelClass = (level) => ({
  emergency: "bg-red-100 text-red-800",
  alert: "bg-red-100 text-red-800",
  critical: "bg-red-100 text-red-800",
  error: "bg-red-100 text-red-800",
  warning: "bg-amber-100 text-amber-800",
  notice: "bg-blue-100 text-blue-800",
  info: "bg-emerald-100 text-emerald-800",
  debug: "bg-zinc-100 text-zinc-700"
})[level] || "bg-zinc-100 text-zinc-700";
function LogViewer({ files, filters, log }) {
  const entries = log.entries?.data ?? [];
  const pagination = log.entries ?? {};
  const form = useForm({
    file: filters.file || "laravel.log",
    level: filters.level || "",
    search: filters.search || "",
    lines: filters.lines || "250",
    per_page: filters.per_page || "25"
  });
  const submit = (e) => {
    e.preventDefault();
    router.get(route("settings.logs.index"), form.data, {
      preserveScroll: true,
      preserveState: true
    });
  };
  const refresh = () => {
    router.get(route("settings.logs.index"), form.data, {
      preserveScroll: true,
      preserveState: true,
      replace: true
    });
  };
  const clearSelectedFile = () => {
    if (!form.data.file) {
      return;
    }
    const confirmed = window.confirm(
      `Clear all contents of ${form.data.file}? This keeps the file but removes its current log entries.`
    );
    if (!confirmed) {
      return;
    }
    router.post(
      route("settings.logs.clear"),
      { file: form.data.file },
      {
        preserveScroll: true
      }
    );
  };
  return /* @__PURE__ */ jsxs(
    AuthenticatedLayout,
    {
      header: /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h1", { className: "text-3xl font-semibold text-zinc-900", children: "Log Files" }),
          /* @__PURE__ */ jsx("p", { className: "mt-2 max-w-3xl text-sm text-zinc-600", children: "Read recent application and performance log entries without loading entire files into memory." })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex gap-3", children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              onClick: () => router.visit(route("settings.security.index")),
              className: "rounded-xl border border-zinc-200 bg-white px-5 py-3 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50",
              children: "Security Monitor"
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              onClick: refresh,
              className: "rounded-xl bg-zinc-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-zinc-800",
              children: "Refresh"
            }
          )
        ] })
      ] }),
      children: [
        /* @__PURE__ */ jsx(Head, { title: "Log Files" }),
        /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-7xl space-y-6", children: [
          /* @__PURE__ */ jsxs(
            "form",
            {
              onSubmit: submit,
              className: "grid gap-4 rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm lg:grid-cols-[1.2fr,0.7fr,0.7fr,0.7fr,1fr,auto]",
              children: [
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("label", { className: "text-xs font-semibold uppercase tracking-wide text-zinc-500", children: "File" }),
                  /* @__PURE__ */ jsx(
                    "select",
                    {
                      value: form.data.file,
                      onChange: (e) => form.setData("file", e.target.value),
                      className: "mt-2 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-400",
                      children: files.map((file) => /* @__PURE__ */ jsxs("option", { value: file.name, children: [
                        file.name,
                        " (",
                        bytes(file.size_bytes),
                        ")"
                      ] }, file.name))
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("label", { className: "text-xs font-semibold uppercase tracking-wide text-zinc-500", children: "Level" }),
                  /* @__PURE__ */ jsxs(
                    "select",
                    {
                      value: form.data.level,
                      onChange: (e) => form.setData("level", e.target.value),
                      className: "mt-2 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-400",
                      children: [
                        /* @__PURE__ */ jsx("option", { value: "", children: "All levels" }),
                        [
                          "debug",
                          "info",
                          "notice",
                          "warning",
                          "error",
                          "critical",
                          "alert",
                          "emergency"
                        ].map((level) => /* @__PURE__ */ jsx("option", { value: level, children: level }, level))
                      ]
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("label", { className: "text-xs font-semibold uppercase tracking-wide text-zinc-500", children: "Tail Lines" }),
                  /* @__PURE__ */ jsx(
                    "select",
                    {
                      value: form.data.lines,
                      onChange: (e) => form.setData("lines", e.target.value),
                      className: "mt-2 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-400",
                      children: ["100", "250", "500", "1000"].map((count) => /* @__PURE__ */ jsx("option", { value: count, children: count }, count))
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("label", { className: "text-xs font-semibold uppercase tracking-wide text-zinc-500", children: "Page Size" }),
                  /* @__PURE__ */ jsx(
                    "select",
                    {
                      value: form.data.per_page,
                      onChange: (e) => form.setData("per_page", e.target.value),
                      className: "mt-2 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-400",
                      children: ["10", "25", "50", "100"].map((count) => /* @__PURE__ */ jsx("option", { value: count, children: count }, count))
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("label", { className: "text-xs font-semibold uppercase tracking-wide text-zinc-500", children: "Search" }),
                  /* @__PURE__ */ jsx(
                    "input",
                    {
                      type: "search",
                      value: form.data.search,
                      onChange: (e) => form.setData("search", e.target.value),
                      className: "mt-2 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-400",
                      placeholder: "route, exception, SQL..."
                    }
                  )
                ] }),
                /* @__PURE__ */ jsx("div", { className: "flex items-end", children: /* @__PURE__ */ jsx(
                  "button",
                  {
                    type: "submit",
                    className: "w-full rounded-xl bg-emerald-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-emerald-700",
                    children: "Apply"
                  }
                ) })
              ]
            }
          ),
          /* @__PURE__ */ jsxs("div", { className: "grid gap-4 md:grid-cols-3", children: [
            /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm", children: [
              /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold uppercase tracking-wide text-zinc-500", children: "Selected File" }),
              /* @__PURE__ */ jsx("p", { className: "mt-2 truncate text-lg font-semibold text-zinc-900", children: log.file })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm", children: [
              /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold uppercase tracking-wide text-zinc-500", children: "File Size" }),
              /* @__PURE__ */ jsx("p", { className: "mt-2 text-lg font-semibold text-zinc-900", children: bytes(log.size_bytes) })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm", children: [
              /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold uppercase tracking-wide text-zinc-500", children: "Updated" }),
              /* @__PURE__ */ jsx("p", { className: "mt-2 text-lg font-semibold text-zinc-900", children: log.updated_at || "-" })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between border-b border-zinc-100 bg-zinc-50 px-6 py-4", children: [
              /* @__PURE__ */ jsx("h2", { className: "text-lg font-semibold text-zinc-900", children: "Recent Entries" }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
                /* @__PURE__ */ jsxs("span", { className: "text-sm text-zinc-500", children: [
                  "Showing ",
                  pagination.from ?? 0,
                  "-",
                  pagination.to ?? 0,
                  " of",
                  " ",
                  pagination.total ?? 0,
                  " entries"
                ] }),
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    type: "button",
                    onClick: clearSelectedFile,
                    className: "rounded-xl bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700",
                    children: "Clear File"
                  }
                )
              ] })
            ] }),
            entries.length ? /* @__PURE__ */ jsx("div", { className: "divide-y divide-zinc-100", children: entries.map((entry, index) => /* @__PURE__ */ jsxs(
              "details",
              {
                className: "group px-6 py-4",
                open: index === 0,
                children: [
                  /* @__PURE__ */ jsxs("summary", { className: "flex cursor-pointer list-none items-start gap-4", children: [
                    /* @__PURE__ */ jsx(
                      "span",
                      {
                        className: `rounded-full px-3 py-1 text-xs font-semibold ${levelClass(
                          entry.level
                        )}`,
                        children: entry.level
                      }
                    ),
                    /* @__PURE__ */ jsx("div", { className: "min-w-0 flex-1", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between", children: [
                      /* @__PURE__ */ jsx("p", { className: "truncate text-sm font-semibold text-zinc-900", children: entry.message }),
                      /* @__PURE__ */ jsx("p", { className: "shrink-0 text-xs text-zinc-500", children: entry.timestamp })
                    ] }) })
                  ] }),
                  /* @__PURE__ */ jsx("pre", { className: "mt-4 max-h-96 overflow-auto rounded-2xl bg-zinc-950 p-4 text-xs leading-6 text-zinc-100", children: entry.raw })
                ]
              },
              `${entry.timestamp}-${index}`
            )) }) : /* @__PURE__ */ jsx("div", { className: "px-6 py-12 text-center text-sm text-zinc-500", children: "No log entries matched the selected filters." }),
            /* @__PURE__ */ jsx(Pagination, { pagination })
          ] })
        ] })
      ]
    }
  );
}
function Pagination({ pagination }) {
  if (!pagination || Number(pagination.last_page ?? 1) <= 1) {
    return null;
  }
  const goToPage = (page) => {
    const params = new URLSearchParams(window.location.search);
    params.set("page", page);
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
  const current = Number(pagination.current_page ?? 1);
  const last = Number(pagination.last_page ?? 1);
  const start = Math.max(1, current - 2);
  const end = Math.min(last, current + 2);
  const pages = Array.from({ length: end - start + 1 }, (_, index) => start + index);
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
  LogViewer as default
};
