import { jsxs, jsx } from "react/jsx-runtime";
import { BookMarked, GraduationCap, ShieldCheck, CalendarDays } from "lucide-react";
function GenericStaffDashboard({ dashboard }) {
  const cards = [
    {
      label: "Courses",
      value: dashboard.stats?.[0]?.value ?? 0,
      icon: BookMarked,
      tone: "bg-emerald-50 text-emerald-600"
    },
    {
      label: "Curriculums",
      value: dashboard.stats?.[1]?.value ?? 0,
      icon: GraduationCap,
      tone: "bg-sky-50 text-sky-600"
    },
    {
      label: "Departments",
      value: dashboard.stats?.[2]?.value ?? 0,
      icon: ShieldCheck,
      tone: "bg-amber-50 text-amber-600"
    },
    {
      label: "Academic Years",
      value: dashboard.stats?.[3]?.value ?? 0,
      icon: CalendarDays,
      tone: "bg-slate-100 text-slate-700"
    }
  ];
  return /* @__PURE__ */ jsxs("div", { className: "animate-in fade-in slide-in-from-bottom-2 duration-700", children: [
    /* @__PURE__ */ jsx("h1", { className: "text-3xl font-bold tracking-tight text-zinc-900", children: "Staff Overview" }),
    /* @__PURE__ */ jsx("p", { className: "mt-1 text-zinc-500", children: "Access your workspace and the analytics available to your account." }),
    /* @__PURE__ */ jsx("div", { className: "mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4", children: cards.map((card) => {
      const Icon = card.icon;
      return /* @__PURE__ */ jsxs(
        "div",
        {
          className: "rounded-[1.75rem] border border-zinc-100 bg-white p-6 shadow-sm",
          children: [
            /* @__PURE__ */ jsx(
              "div",
              {
                className: `inline-flex rounded-2xl p-3 ${card.tone}`,
                children: /* @__PURE__ */ jsx(Icon, { className: "h-5 w-5" })
              }
            ),
            /* @__PURE__ */ jsx("p", { className: "mt-5 text-sm font-medium text-zinc-500", children: card.label }),
            /* @__PURE__ */ jsx("p", { className: "mt-2 text-3xl font-bold tracking-tight text-zinc-900", children: card.value })
          ]
        },
        card.label
      );
    }) })
  ] });
}
export {
  GenericStaffDashboard as default
};
