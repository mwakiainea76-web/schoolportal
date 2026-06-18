import { jsxs, jsx } from "react/jsx-runtime";
import { useForm, Head, router, Link } from "@inertiajs/react";
import { A as AuthenticatedLayout } from "../app.js";
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
function UserMonitor({ filters, roles, summary, users }) {
  const form = useForm({
    role: filters.role || ""
  });
  const submit = (e) => {
    e.preventDefault();
    router.get(route("settings.user-monitor.index"), form.data, {
      preserveScroll: true,
      preserveState: true
    });
  };
  return /* @__PURE__ */ jsxs(
    AuthenticatedLayout,
    {
      header: /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h1", { className: "text-3xl font-semibold text-zinc-900", children: "User Monitor" }),
          /* @__PURE__ */ jsx("p", { className: "mt-2 max-w-3xl text-sm text-zinc-600", children: "On-demand visibility into currently online users, filtered by role and backed directly by the database sessions table." })
        ] }),
        /* @__PURE__ */ jsx(
          Link,
          {
            href: route("settings.logs.index"),
            className: "rounded-xl border border-zinc-200 bg-white px-5 py-3 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50",
            children: "View Logs"
          }
        )
      ] }),
      children: [
        /* @__PURE__ */ jsx(Head, { title: "User Monitor" }),
        /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-7xl space-y-6", children: [
          /* @__PURE__ */ jsxs("div", { className: "grid gap-4 md:grid-cols-2", children: [
            /* @__PURE__ */ jsx("div", { className: "rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm", children: /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between gap-4", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold uppercase tracking-wide text-zinc-500", children: "Currently Online" }),
                /* @__PURE__ */ jsx("p", { className: "mt-2 text-3xl font-semibold text-zinc-900", children: summary.online_users })
              ] }),
              /* @__PURE__ */ jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => router.reload({ preserveScroll: true }),
                  className: "inline-flex items-center gap-2 rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-100",
                  children: [
                    /* @__PURE__ */ jsx(
                      "svg",
                      {
                        className: "h-4 w-4",
                        viewBox: "0 0 24 24",
                        fill: "none",
                        stroke: "currentColor",
                        strokeWidth: "2",
                        children: /* @__PURE__ */ jsx(
                          "path",
                          {
                            strokeLinecap: "round",
                            strokeLinejoin: "round",
                            d: "M21 12a9 9 0 1 1-2.64-6.36M21 3v6h-6"
                          }
                        )
                      }
                    ),
                    "Refresh"
                  ]
                }
              )
            ] }) }),
            /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm", children: [
              /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold uppercase tracking-wide text-zinc-500", children: "Queried At" }),
              /* @__PURE__ */ jsx("p", { className: "mt-2 text-lg font-semibold text-zinc-900", children: new Date(summary.queried_at).toLocaleString() })
            ] })
          ] }),
          !summary.using_database_sessions ? /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-900 shadow-sm", children: [
            "This feature reads directly from the database `sessions` table. Your app is not currently using the database session driver, so the count may remain zero until you set ",
            /* @__PURE__ */ jsx("span", { className: "font-semibold", children: "SESSION_DRIVER=database" }),
            " and sign in again."
          ] }) : null,
          /* @__PURE__ */ jsxs(
            "form",
            {
              onSubmit: submit,
              className: "grid gap-4 rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm lg:grid-cols-[1fr,auto]",
              children: [
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("label", { className: "text-xs font-semibold uppercase tracking-wide text-zinc-500", children: "Role" }),
                  /* @__PURE__ */ jsxs(
                    "select",
                    {
                      value: form.data.role,
                      onChange: (e) => form.setData("role", e.target.value),
                      className: "mt-2 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-400",
                      children: [
                        /* @__PURE__ */ jsx("option", { value: "", children: "All roles" }),
                        roles.map((role) => /* @__PURE__ */ jsx("option", { value: role, children: role }, role))
                      ]
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
          /* @__PURE__ */ jsxs("div", { className: "overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between border-b border-zinc-100 bg-zinc-50 px-6 py-4", children: [
              /* @__PURE__ */ jsx("h2", { className: "text-lg font-semibold text-zinc-900", children: "Online Users" }),
              /* @__PURE__ */ jsxs("span", { className: "text-sm text-zinc-500", children: [
                "Showing ",
                users.from ?? 0,
                "-",
                users.to ?? 0,
                " of",
                " ",
                users.total ?? 0
              ] })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs("table", { className: "w-full min-w-[64rem] border-collapse", children: [
              /* @__PURE__ */ jsx("thead", { className: "bg-zinc-50", children: /* @__PURE__ */ jsxs("tr", { className: "text-xs font-semibold uppercase tracking-wide text-zinc-500", children: [
                /* @__PURE__ */ jsx("th", { className: "px-4 py-3 text-left", children: "Login ID" }),
                /* @__PURE__ */ jsx("th", { className: "px-4 py-3 text-left", children: "Name" }),
                /* @__PURE__ */ jsx("th", { className: "px-4 py-3 text-left", children: "Email" }),
                /* @__PURE__ */ jsx("th", { className: "px-4 py-3 text-left", children: "Roles" }),
                /* @__PURE__ */ jsx("th", { className: "px-4 py-3 text-left", children: "Last Activity" })
              ] }) }),
              /* @__PURE__ */ jsx("tbody", { className: "divide-y divide-zinc-100 bg-white", children: users.data.length ? users.data.map((user) => /* @__PURE__ */ jsxs("tr", { className: "text-sm", children: [
                /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-zinc-700", children: user.login_id || "-" }),
                /* @__PURE__ */ jsx("td", { className: "px-4 py-3 font-medium text-zinc-900", children: [user.first_name, user.last_name].filter(Boolean).join(" ") || "-" }),
                /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-zinc-700", children: user.email || "-" }),
                /* @__PURE__ */ jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-2", children: user.roles.length ? user.roles.map((role) => /* @__PURE__ */ jsx(
                  "span",
                  {
                    className: "rounded-full bg-zinc-100 px-3 py-1 text-xs font-semibold text-zinc-700",
                    children: role
                  },
                  role
                )) : /* @__PURE__ */ jsx("span", { className: "text-zinc-500", children: "-" }) }) }),
                /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-zinc-700", children: user.last_activity || "-" })
              ] }, user.id)) : /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx(
                "td",
                {
                  colSpan: "5",
                  className: "px-4 py-8 text-center text-sm text-zinc-500",
                  children: "No online users matched the selected filters."
                }
              ) }) })
            ] }) }),
            /* @__PURE__ */ jsx(Pagination, { pagination: users })
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
  const current = Number(pagination.current_page ?? 1);
  const last = Number(pagination.last_page ?? 1);
  const start = Math.max(1, current - 2);
  const end = Math.min(last, current + 2);
  const pages = Array.from({ length: end - start + 1 }, (_, index) => start + index);
  const goToPage = (page) => {
    const params = new URLSearchParams(window.location.search);
    params.set("page", page);
    router.get(`${window.location.pathname}?${params.toString()}`, {}, {
      preserveScroll: true,
      preserveState: true,
      replace: true
    });
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
  UserMonitor as default
};
