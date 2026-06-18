import { jsxs, jsx } from "react/jsx-runtime";
import { BookMarked, Wallet, CreditCard, ShieldCheck } from "lucide-react";
function BursarDashboard({ dashboard }) {
  const overviewCards = [
    {
      label: "Courses",
      value: dashboard.stats?.[0]?.value ?? 0,
      icon: BookMarked,
      tone: "bg-slate-100 text-slate-700"
    },
    {
      label: "Finance Workspace",
      value: "Billing",
      icon: Wallet,
      tone: "bg-amber-50 text-amber-600"
    },
    {
      label: "Collections",
      value: "Payments",
      icon: CreditCard,
      tone: "bg-emerald-50 text-emerald-600"
    },
    {
      label: "Approvals",
      value: "Invoices",
      icon: ShieldCheck,
      tone: "bg-sky-50 text-sky-600"
    }
  ];
  return /* @__PURE__ */ jsxs("div", { className: "animate-in fade-in slide-in-from-bottom-2 duration-700", children: [
    /* @__PURE__ */ jsx("h1", { className: "text-3xl font-bold tracking-tight text-zinc-900", children: "Finance Overview" }),
    /* @__PURE__ */ jsx("p", { className: "mt-1 text-zinc-500", children: "Track collections, billing workflows, and approval operations for the bursary workspace." }),
    /* @__PURE__ */ jsx("div", { className: "mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4", children: overviewCards.map((card) => {
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
  BursarDashboard as default
};
