import { jsxs, jsx } from "react/jsx-runtime";
import { Head, Link } from "@inertiajs/react";
import { A as AuthenticatedLayout } from "./AuthenticatedLayout-DYCvRbZH.js";
import { BookOpen } from "lucide-react";
import "react";
import "react-toastify";
function StudentIndex({ program, units_by_module }) {
  return /* @__PURE__ */ jsxs(AuthenticatedLayout, { children: [
    /* @__PURE__ */ jsx(Head, { title: "My Units" }),
    /* @__PURE__ */ jsxs("div", { className: "mx-auto w-full max-w-6xl animate-in fade-in slide-in-from-bottom-4 duration-700", children: [
      /* @__PURE__ */ jsxs("div", { className: "rounded-[2rem] bg-[#1b263b] px-8 py-8 text-white shadow-xl", children: [
        /* @__PURE__ */ jsx("p", { className: "text-sm font-semibold uppercase tracking-[0.2em] text-emerald-300", children: "My Units" }),
        /* @__PURE__ */ jsx("h1", { className: "mt-3 text-3xl font-bold tracking-tight", children: program?.name ?? "Program not assigned" }),
        /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm text-slate-300", children: program?.version ?? "Program version not assigned" })
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
            /* @__PURE__ */ jsxs("div", { className: "mt-5 overflow-hidden rounded-2xl border border-zinc-100", children: [
              /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-[0.85fr,1.8fr,0.8fr,0.8fr] gap-4 bg-zinc-50 px-5 py-3 text-xs font-semibold uppercase tracking-wide text-zinc-500", children: [
                /* @__PURE__ */ jsx("p", { children: "Code" }),
                /* @__PURE__ */ jsx("p", { children: "Unit Name" }),
                /* @__PURE__ */ jsx("p", { className: "text-right", children: "Credits" }),
                /* @__PURE__ */ jsx("p", { className: "text-right", children: "Hours" })
              ] }),
              group.units.map((unit) => /* @__PURE__ */ jsxs(
                "div",
                {
                  className: "grid grid-cols-[0.85fr,1.8fr,0.8fr,0.8fr] gap-4 border-t border-zinc-100 bg-white px-5 py-4 text-sm text-zinc-700",
                  children: [
                    /* @__PURE__ */ jsx("p", { className: "font-semibold text-emerald-700", children: unit.code ?? "-" }),
                    /* @__PURE__ */ jsx("p", { className: "font-semibold text-zinc-900", children: unit.name }),
                    /* @__PURE__ */ jsx("p", { className: "text-right", children: unit.credit_factor ?? "-" }),
                    /* @__PURE__ */ jsx("p", { className: "text-right", children: unit.training_hours ?? "-" })
                  ]
                },
                unit.id
              ))
            ] })
          ]
        },
        group.module
      )) : /* @__PURE__ */ jsx("div", { className: "rounded-[1.75rem] border border-dashed border-zinc-200 bg-white px-6 py-12 text-center text-sm text-zinc-500 shadow-sm", children: "No units have been assigned to your program version yet." }) })
    ] })
  ] });
}
export {
  StudentIndex as default
};
