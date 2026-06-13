import { jsxs, Fragment, jsx } from "react/jsx-runtime";
import { Head, Link } from "@inertiajs/react";
import { BookCheck, CalendarDays } from "lucide-react";
function RegisteredUnits({ session, units }) {
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(Head, { title: "Registered Units" }),
    /* @__PURE__ */ jsxs("div", { className: "mx-auto w-full max-w-6xl animate-in fade-in slide-in-from-bottom-4 duration-700", children: [
      /* @__PURE__ */ jsxs("div", { className: "rounded-[2rem] bg-[#1b263b] px-8 py-8 text-white shadow-xl", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsx("div", { className: "rounded-xl bg-emerald-500/20 p-2 text-emerald-400", children: /* @__PURE__ */ jsx(BookCheck, { className: "h-6 w-6" }) }),
          /* @__PURE__ */ jsx("p", { className: "text-sm font-semibold uppercase tracking-[0.2em] text-emerald-300", children: "Recently Registered Units" })
        ] }),
        /* @__PURE__ */ jsx("h1", { className: "mt-4 text-3xl font-bold tracking-tight", children: session?.name ?? "No active registration" }),
        session && /* @__PURE__ */ jsxs("div", { className: "mt-3 flex flex-wrap gap-4 text-sm text-slate-300", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5", children: [
            /* @__PURE__ */ jsx(CalendarDays, { className: "h-4 w-4 text-emerald-400" }),
            "Year ",
            session.year_of_study
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5", children: [
            /* @__PURE__ */ jsx("div", { className: "h-1.5 w-1.5 rounded-full bg-emerald-400" }),
            "Module ",
            session.module
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mt-6 flex items-center justify-between", children: [
        /* @__PURE__ */ jsx(
          Link,
          {
            href: route("dashboard"),
            className: "text-sm font-medium text-emerald-700 transition hover:text-emerald-800",
            children: "Back to dashboard"
          }
        ),
        /* @__PURE__ */ jsx(
          Link,
          {
            href: route("student.course-units.index"),
            className: "text-sm font-medium text-zinc-600 transition hover:text-zinc-900",
            children: "View all curriculum units"
          }
        )
      ] }),
      /* @__PURE__ */ jsx("div", { className: "mt-6", children: units?.length ? /* @__PURE__ */ jsx("div", { className: "rounded-[1.75rem] border border-zinc-100 bg-white p-6 shadow-sm", children: /* @__PURE__ */ jsx("div", { className: "overflow-hidden rounded-2xl border border-zinc-100", children: /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs("table", { className: "w-full min-w-[44rem] border-collapse", children: [
        /* @__PURE__ */ jsx("thead", { className: "bg-zinc-50", children: /* @__PURE__ */ jsxs("tr", { className: "text-xs font-semibold uppercase tracking-wide text-zinc-500", children: [
          /* @__PURE__ */ jsx("th", { className: "px-5 py-3 text-left", children: "Code" }),
          /* @__PURE__ */ jsx("th", { className: "px-5 py-3 text-left", children: "Unit Name" }),
          /* @__PURE__ */ jsx("th", { className: "px-5 py-3 text-center", children: "Module" }),
          /* @__PURE__ */ jsx("th", { className: "px-5 py-3 text-right", children: "Credits" }),
          /* @__PURE__ */ jsx("th", { className: "px-5 py-3 text-right", children: "Hours" })
        ] }) }),
        /* @__PURE__ */ jsx("tbody", { className: "divide-y divide-zinc-100 bg-white", children: units.map((unit) => /* @__PURE__ */ jsxs(
          "tr",
          {
            className: "group text-sm text-zinc-700 transition hover:bg-zinc-50/50",
            children: [
              /* @__PURE__ */ jsx("td", { className: "px-5 py-4 font-semibold text-emerald-700", children: unit.code ?? "-" }),
              /* @__PURE__ */ jsx("td", { className: "px-5 py-4 font-semibold text-zinc-900", children: unit.name }),
              /* @__PURE__ */ jsx("td", { className: "px-5 py-4 text-center", children: /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-800", children: [
                "Module ",
                unit.module_taught
              ] }) }),
              /* @__PURE__ */ jsx("td", { className: "px-5 py-4 text-right", children: unit.credit_factor ?? "-" }),
              /* @__PURE__ */ jsx("td", { className: "px-5 py-4 text-right", children: unit.training_hours ?? "-" })
            ]
          },
          unit.id
        )) })
      ] }) }) }) }) : /* @__PURE__ */ jsxs("div", { className: "rounded-[1.75rem] border border-dashed border-zinc-200 bg-white px-6 py-16 text-center shadow-sm", children: [
        /* @__PURE__ */ jsx("div", { className: "mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-zinc-50 text-zinc-400", children: /* @__PURE__ */ jsx(BookCheck, { className: "h-6 w-6" }) }),
        /* @__PURE__ */ jsx("h3", { className: "mt-4 text-sm font-semibold text-zinc-900", children: "No registered units" }),
        /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-zinc-500", children: "You haven't registered for any units in the current session yet." }),
        /* @__PURE__ */ jsx("div", { className: "mt-6", children: /* @__PURE__ */ jsx(
          Link,
          {
            href: route("dashboard"),
            className: "inline-flex items-center rounded-xl bg-[#1b263b] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#2c3e50] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1b263b]",
            children: "Go to Registration"
          }
        ) })
      ] }) })
    ] })
  ] });
}
export {
  RegisteredUnits as default
};
