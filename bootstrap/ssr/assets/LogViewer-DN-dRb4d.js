import { jsxs, jsx } from "react/jsx-runtime";
import { useForm, Head, router } from "@inertiajs/react";
import { A as AuthenticatedLayout } from "../app.js";
import "axios";
import "react-dom/client";
import "react";
import "lucide-react";
import "react-toastify";
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
  const form = useForm({
    file: filters.file || "laravel.log",
    level: filters.level || "",
    search: filters.search || "",
    lines: filters.lines || "250"
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
  return /* @__PURE__ */ jsxs(
    AuthenticatedLayout,
    {
      header: /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h1", { className: "text-3xl font-semibold text-zinc-900", children: "Log Files" }),
          /* @__PURE__ */ jsx("p", { className: "mt-2 max-w-3xl text-sm text-zinc-600", children: "Read recent application and performance log entries without loading entire files into memory." })
        ] }),
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            onClick: refresh,
            className: "rounded-xl bg-zinc-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-zinc-800",
            children: "Refresh"
          }
        )
      ] }),
      children: [
        /* @__PURE__ */ jsx(Head, { title: "Log Files" }),
        /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-7xl space-y-6", children: [
          /* @__PURE__ */ jsxs(
            "form",
            {
              onSubmit: submit,
              className: "flex flex-wrap items-end gap-3 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm",
              children: [
                /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1.5", children: [
                  /* @__PURE__ */ jsx("label", { className: "text-[11px] font-medium uppercase tracking-wider text-zinc-500", children: "File" }),
                  /* @__PURE__ */ jsx(
                    "select",
                    {
                      value: form.data.file,
                      onChange: (e) => form.setData("file", e.target.value),
                      className: "h-9 w-48 rounded-lg border border-zinc-200 bg-zinc-50 px-3 text-sm outline-none transition focus:border-blue-400",
                      children: files.map((file) => /* @__PURE__ */ jsxs("option", { value: file.name, children: [
                        file.name,
                        " (",
                        bytes(file.size_bytes),
                        ")"
                      ] }, file.name))
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1.5", children: [
                  /* @__PURE__ */ jsx("label", { className: "text-[11px] font-medium uppercase tracking-wider text-zinc-500", children: "Level" }),
                  /* @__PURE__ */ jsxs(
                    "select",
                    {
                      value: form.data.level,
                      onChange: (e) => form.setData("level", e.target.value),
                      className: "h-9 w-36 rounded-lg border border-zinc-200 bg-zinc-50 px-3 text-sm outline-none transition focus:border-blue-400",
                      children: [
                        /* @__PURE__ */ jsx("option", { value: "", children: "All levels" }),
                        ["debug", "info", "notice", "warning", "error", "critical", "alert", "emergency"].map((level) => /* @__PURE__ */ jsx("option", { value: level, children: level }, level))
                      ]
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1.5", children: [
                  /* @__PURE__ */ jsx("label", { className: "text-[11px] font-medium uppercase tracking-wider text-zinc-500", children: "Tail lines" }),
                  /* @__PURE__ */ jsx(
                    "select",
                    {
                      value: form.data.lines,
                      onChange: (e) => form.setData("lines", e.target.value),
                      className: "h-9 w-24 rounded-lg border border-zinc-200 bg-zinc-50 px-3 text-sm outline-none transition focus:border-blue-400",
                      children: ["100", "250", "500", "1000"].map((count) => /* @__PURE__ */ jsx("option", { value: count, children: count }, count))
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1.5", children: [
                  /* @__PURE__ */ jsx("label", { className: "text-[11px] font-medium uppercase tracking-wider text-zinc-500", children: "Search" }),
                  /* @__PURE__ */ jsx(
                    "input",
                    {
                      type: "search",
                      value: form.data.search,
                      onChange: (e) => form.setData("search", e.target.value),
                      className: "h-9 w-56 rounded-lg border border-zinc-200 bg-zinc-50 px-3 text-sm outline-none transition focus:border-blue-400",
                      placeholder: "route, exception, SQL…"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    type: "submit",
                    className: "h-9 rounded-lg bg-blue-50 border border-blue-200 px-5 text-sm font-medium text-blue-700 transition hover:bg-blue-100",
                    children: "Apply"
                  }
                )
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
              /* @__PURE__ */ jsxs("span", { className: "text-sm text-zinc-500", children: [
                log.entries.length,
                " entries"
              ] })
            ] }),
            log.entries.length ? /* @__PURE__ */ jsx("div", { className: "divide-y divide-zinc-100", children: log.entries.map((entry, index) => /* @__PURE__ */ jsxs(
              "details",
              {
                className: "group px-6 py-4",
                open: index === log.entries.length - 1,
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
            )) }) : /* @__PURE__ */ jsx("div", { className: "px-6 py-12 text-center text-sm text-zinc-500", children: "No log entries matched the selected filters." })
          ] })
        ] })
      ]
    }
  );
}
export {
  LogViewer as default
};
