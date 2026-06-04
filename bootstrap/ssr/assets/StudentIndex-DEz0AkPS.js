import { jsxs, jsx } from "react/jsx-runtime";
import { Head, Link } from "@inertiajs/react";
import { A as AuthenticatedLayout } from "../app.js";
import { BookOpen } from "lucide-react";
import "axios";
import "react";
import "react-toastify";
import "react-dom/client";
function StudentIndex({ course, units_by_module }) {
  return /* @__PURE__ */ jsxs(AuthenticatedLayout, { children: [
    /* @__PURE__ */ jsx(Head, { title: "My Units" }),
    /* @__PURE__ */ jsxs("div", { className: "mx-auto w-full max-w-6xl animate-in fade-in slide-in-from-bottom-4 duration-700", children: [
      /* @__PURE__ */ jsxs("div", { className: "rounded-[2rem] bg-[#1b263b] px-8 py-8 text-white shadow-xl", children: [
        /* @__PURE__ */ jsx("p", { className: "text-sm font-semibold uppercase tracking-[0.2em] text-emerald-300", children: "My Units" }),
        /* @__PURE__ */ jsx("h1", { className: "mt-3 text-3xl font-bold tracking-tight", children: course?.name ?? "Course not assigned" }),
        /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm text-slate-300", children: course?.version ?? "Course version not assigned" })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "mt-6 flex items-center justify-between", children: /* @__PURE__ */ jsx(
        Link,
        {
          href: route("student.dashboard"),
          className: "text-sm font-medium text-emerald-700 transition hover:text-emerald-800",
          children: "Back to dashboard"
        }
      ) }),
      /* @__PURE__ */ jsx("div", { className: "mt-6 space-y-6", children: units_by_module?.length ? units_by_module.map((group) => /* @__PURE__ */ jsxs(
        "section",
        {
          className: "rounded-[1.75rem] border border-zinc-100 bg-white p-6 shadow-sm",
          children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsxs("h2", { className: "text-xl font-semibold text-zinc-900", children: [
                  "Module ",
                  group.module
                ] }),
                /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-zinc-500", children: "Units assigned to this module." })
              ] }),
              /* @__PURE__ */ jsx("div", { className: "rounded-2xl bg-emerald-50 p-3 text-emerald-600", children: /* @__PURE__ */ jsx(BookOpen, { className: "h-5 w-5" }) })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "mt-5 overflow-hidden rounded-2xl border border-zinc-100", children: /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs("table", { className: "w-full min-w-[44rem] border-collapse", children: [
              /* @__PURE__ */ jsx("thead", { className: "bg-zinc-50", children: /* @__PURE__ */ jsxs("tr", { className: "text-xs font-semibold uppercase tracking-wide text-zinc-500", children: [
                /* @__PURE__ */ jsx("th", { className: "px-5 py-3 text-left", children: "Code" }),
                /* @__PURE__ */ jsx("th", { className: "px-5 py-3 text-left", children: "Unit Name" }),
                /* @__PURE__ */ jsx("th", { className: "px-5 py-3 text-right", children: "Credits" }),
                /* @__PURE__ */ jsx("th", { className: "px-5 py-3 text-right", children: "Hours" })
              ] }) }),
              /* @__PURE__ */ jsx("tbody", { className: "divide-y divide-zinc-100 bg-white", children: group.units.map((unit) => /* @__PURE__ */ jsxs(
                "tr",
                {
                  className: "text-sm text-zinc-700",
                  children: [
                    /* @__PURE__ */ jsx("td", { className: "px-5 py-4 font-semibold text-emerald-700", children: unit.code ?? "-" }),
                    /* @__PURE__ */ jsx("td", { className: "px-5 py-4 font-semibold text-zinc-900", children: unit.name }),
                    /* @__PURE__ */ jsx("td", { className: "px-5 py-4 text-right", children: unit.credit_factor ?? "-" }),
                    /* @__PURE__ */ jsx("td", { className: "px-5 py-4 text-right", children: unit.training_hours ?? "-" })
                  ]
                },
                unit.id
              )) })
            ] }) }) })
          ]
        },
        group.module
      )) : /* @__PURE__ */ jsx("div", { className: "rounded-[1.75rem] border border-dashed border-zinc-200 bg-white px-6 py-12 text-center text-sm text-zinc-500 shadow-sm", children: "No units have been assigned to your course version yet." }) })
    ] })
  ] });
}
export {
  StudentIndex as default
};
