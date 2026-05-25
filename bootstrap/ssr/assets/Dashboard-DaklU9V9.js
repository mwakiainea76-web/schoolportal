import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { usePage, Head, useForm, Link } from "@inertiajs/react";
import { A as AuthenticatedLayout } from "./AuthenticatedLayout-DYCvRbZH.js";
import { M as Modal } from "./Modal-DzNit_Do.js";
import { Wallet, CreditCard, GraduationCap, ShieldCheck, Receipt, BookMarked, BookOpen, CalendarDays } from "lucide-react";
import "react-toastify";
import "@headlessui/react";
const currency = (amount) => `Ksh ${new Intl.NumberFormat("en-KE", {
  style: "decimal",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2
}).format(Number(amount || 0))}`;
const statusClasses = {
  active: "bg-emerald-100 text-emerald-700",
  issued: "bg-amber-100 text-amber-700",
  partial: "bg-blue-100 text-blue-700",
  paid: "bg-emerald-100 text-emerald-700",
  draft: "bg-slate-100 text-slate-600",
  suspended: "bg-red-100 text-red-700",
  graduated: "bg-indigo-100 text-indigo-700",
  dropped: "bg-red-100 text-red-700",
  completed: "bg-blue-100 text-blue-700"
};
function StudentDashboard({ dashboard, fullName }) {
  const cards = [
    {
      label: "Outstanding Balance",
      value: currency(dashboard.finance.outstanding_balance),
      helper: dashboard.finance.next_invoice_due_date ? `Next due ${dashboard.finance.next_invoice_due_date}` : "No invoice due date available",
      icon: Wallet,
      tone: "from-emerald-500 to-emerald-600"
    },
    {
      label: "Total Paid",
      value: currency(dashboard.finance.total_paid),
      helper: "Payments recorded on your account",
      icon: CreditCard,
      tone: "from-slate-700 to-slate-800"
    },
    {
      label: "Current Module",
      value: dashboard.student?.current_module ?? "-",
      helper: dashboard.latest_session?.session ?? "No active session yet",
      icon: GraduationCap,
      tone: "from-sky-500 to-cyan-500"
    },
    {
      label: "Fee Discount",
      value: `${dashboard.student?.fee_discount_percentage ?? 0}%`,
      helper: "Current approved discount",
      icon: ShieldCheck,
      tone: "from-amber-500 to-orange-500"
    }
  ];
  const [showSessionRegistrationModal, setShowSessionRegistrationModal] = useState(false);
  const { post, processing, errors, clearErrors } = useForm({});
  useEffect(() => {
    if (errors.session_registration) {
      setShowSessionRegistrationModal(true);
    }
  }, [errors.session_registration]);
  const submitSessionRegistration = (e) => {
    e.preventDefault();
    post(route("student.dashboard.register-session"), {
      preserveScroll: true,
      onBefore: () => clearErrors(),
      onSuccess: () => {
        clearErrors();
        setShowSessionRegistrationModal(false);
      },
      onError: () => setShowSessionRegistrationModal(true)
    });
  };
  return /* @__PURE__ */ jsxs("div", { className: "animate-in fade-in slide-in-from-bottom-2 duration-700", children: [
    /* @__PURE__ */ jsxs("div", { className: "relative overflow-hidden rounded-[2rem] bg-[#1b263b] px-8 py-10 text-white shadow-xl", children: [
      /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(16,185,129,0.25),_transparent_35%),radial-gradient(circle_at_bottom_left,_rgba(255,255,255,0.08),_transparent_25%)]" }),
      /* @__PURE__ */ jsxs("div", { className: "relative flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between", children: [
        /* @__PURE__ */ jsxs("div", { className: "max-w-2xl", children: [
          /* @__PURE__ */ jsx("p", { className: "text-sm font-semibold uppercase tracking-[0.2em] text-emerald-300", children: "Student Portal" }),
          /* @__PURE__ */ jsxs("h1", { className: "mt-3 text-4xl font-bold tracking-tight", children: [
            "Welcome back, ",
            fullName,
            "."
          ] }),
          /* @__PURE__ */ jsx("p", { className: "mt-3 max-w-xl text-sm text-slate-300", children: "Keep track of your program progress, current session, billing status, and learning units from one place." })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4 sm:grid-cols-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur", children: [
            /* @__PURE__ */ jsx("p", { className: "text-xs uppercase tracking-wide text-slate-300", children: "Program" }),
            /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm font-semibold", children: dashboard.program?.name ?? "Not assigned" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur", children: [
            /* @__PURE__ */ jsx("p", { className: "text-xs uppercase tracking-wide text-slate-300", children: "Version" }),
            /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm font-semibold", children: dashboard.program?.version ?? "Not assigned" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur", children: [
            /* @__PURE__ */ jsx("p", { className: "text-xs uppercase tracking-wide text-slate-300", children: "Reg. No" }),
            /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm font-semibold", children: dashboard.student?.registration_number ?? "-" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur", children: [
            /* @__PURE__ */ jsx("p", { className: "text-xs uppercase tracking-wide text-slate-300", children: "Status" }),
            /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm font-semibold capitalize", children: dashboard.student?.status ?? "-" })
          ] })
        ] })
      ] })
    ] }),
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
                className: `inline-flex rounded-2xl bg-gradient-to-br ${card.tone} p-3 text-white shadow-lg`,
                children: /* @__PURE__ */ jsx(Icon, { className: "h-5 w-5" })
              }
            ),
            /* @__PURE__ */ jsx("p", { className: "mt-5 text-sm font-medium text-zinc-500", children: card.label }),
            /* @__PURE__ */ jsx("p", { className: "mt-2 text-2xl font-bold tracking-tight text-zinc-900", children: card.value }),
            /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm text-zinc-400", children: card.helper })
          ]
        },
        card.label
      );
    }) }),
    /* @__PURE__ */ jsxs("div", { className: "mt-8 grid grid-cols-1 gap-6 xl:grid-cols-[1.4fr,0.9fr]", children: [
      /* @__PURE__ */ jsxs("div", { className: "rounded-[1.75rem] border border-zinc-100 bg-white p-7 shadow-sm", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h2", { className: "text-xl font-semibold text-zinc-900", children: "Recent Invoices" }),
            /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-zinc-500", children: "Your latest finance activity and balances." })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsx(
              Link,
              {
                href: route("student.fee-statements.index"),
                className: "text-sm font-medium text-emerald-700 transition hover:text-emerald-800",
                children: "View all statements"
              }
            ),
            /* @__PURE__ */ jsx("div", { className: "rounded-2xl bg-emerald-50 p-3 text-emerald-600", children: /* @__PURE__ */ jsx(Receipt, { className: "h-5 w-5" }) })
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "mt-6 space-y-4", children: dashboard.recent_invoices?.length ? dashboard.recent_invoices.map((invoice) => /* @__PURE__ */ jsxs(
          "div",
          {
            className: "flex flex-col gap-4 rounded-2xl border border-zinc-100 bg-zinc-50/70 px-5 py-4 sm:flex-row sm:items-center sm:justify-between",
            children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("p", { className: "font-semibold text-zinc-800", children: invoice.invoice_number }),
                /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-zinc-500", children: invoice.session ?? "Session not linked" })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
                /* @__PURE__ */ jsxs("div", { className: "text-right", children: [
                  /* @__PURE__ */ jsx("p", { className: "text-sm text-zinc-500", children: "Balance" }),
                  /* @__PURE__ */ jsx("p", { className: "font-semibold text-zinc-900", children: currency(invoice.balance_due) })
                ] }),
                /* @__PURE__ */ jsx(
                  "span",
                  {
                    className: `rounded-full px-3 py-1 text-xs font-semibold capitalize ${statusClasses[invoice.status] ?? "bg-slate-100 text-slate-600"}`,
                    children: invoice.status
                  }
                ),
                /* @__PURE__ */ jsx(
                  Link,
                  {
                    href: route(
                      "student.fee-statements.show",
                      invoice.id
                    ),
                    className: "inline-flex rounded-xl bg-slate-900 px-3 py-2 text-xs font-semibold text-white transition hover:bg-slate-700",
                    children: "View statement"
                  }
                )
              ] })
            ]
          },
          invoice.id
        )) : /* @__PURE__ */ jsx("div", { className: "rounded-2xl border border-dashed border-zinc-200 px-6 py-10 text-center text-sm text-zinc-400", children: "No invoices have been generated for your account yet." }) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "rounded-[1.75rem] border border-zinc-100 bg-white p-7 shadow-sm", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsx("h2", { className: "text-xl font-semibold text-zinc-900", children: "Study Snapshot" }),
            /* @__PURE__ */ jsx("div", { className: "rounded-2xl bg-sky-50 p-3 text-sky-600", children: /* @__PURE__ */ jsx(BookMarked, { className: "h-5 w-5" }) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "mt-6 space-y-4 text-sm", children: [
            /* @__PURE__ */ jsxs("div", { className: "rounded-2xl bg-zinc-50 px-4 py-3", children: [
              /* @__PURE__ */ jsx("p", { className: "text-zinc-500", children: "Program Version" }),
              /* @__PURE__ */ jsx("p", { className: "mt-1 font-semibold text-zinc-900", children: dashboard.program?.version ?? "Not assigned" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "rounded-2xl bg-zinc-50 px-4 py-3", children: [
              /* @__PURE__ */ jsx("p", { className: "text-zinc-500", children: "Current Session" }),
              /* @__PURE__ */ jsx("p", { className: "mt-1 font-semibold text-zinc-900", children: dashboard.latest_session?.session ?? "No session enrollment yet" }),
              !dashboard.latest_session ? /* @__PURE__ */ jsxs(Fragment, { children: [
                dashboard.session_registration?.blocker ? /* @__PURE__ */ jsx("p", { className: "mt-3 text-xs text-amber-700", children: dashboard.session_registration.blocker }) : null,
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => setShowSessionRegistrationModal(
                      true
                    ),
                    disabled: !dashboard.session_registration?.can_register,
                    className: "mt-3 inline-flex rounded-xl bg-emerald-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50",
                    children: "Register current active session"
                  }
                )
              ] }) : null
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "rounded-2xl bg-zinc-50 px-4 py-3", children: [
              /* @__PURE__ */ jsx("p", { className: "text-zinc-500", children: "Year of Study" }),
              /* @__PURE__ */ jsx("p", { className: "mt-1 font-semibold text-zinc-900", children: dashboard.latest_session?.year_of_study ? `Year ${dashboard.latest_session.year_of_study}` : "-" })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "rounded-[1.75rem] border border-zinc-100 bg-white p-7 shadow-sm", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsx("h2", { className: "text-xl font-semibold text-zinc-900", children: "This Module's Units" }),
            /* @__PURE__ */ jsx("div", { className: "rounded-2xl bg-amber-50 p-3 text-amber-600", children: /* @__PURE__ */ jsx(BookOpen, { className: "h-5 w-5" }) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "mt-2 flex items-center justify-between", children: [
            /* @__PURE__ */ jsx("p", { className: "text-sm text-zinc-500", children: "Units assigned to your current module." }),
            /* @__PURE__ */ jsx(
              Link,
              {
                href: route("student.program-units.index"),
                className: "text-xs font-semibold text-emerald-700 transition hover:text-emerald-800",
                children: "View all units"
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "mt-6", children: [
            dashboard.module_units?.length ? /* @__PURE__ */ jsxs("div", { className: "overflow-hidden rounded-2xl border border-zinc-100", children: [
              /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-[0.9fr,1.6fr,0.8fr] gap-4 bg-zinc-50 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-zinc-500", children: [
                /* @__PURE__ */ jsx("p", { children: "Code" }),
                /* @__PURE__ */ jsx("p", { children: "Unit" }),
                /* @__PURE__ */ jsx("p", { className: "text-right", children: "Hours" })
              ] }),
              dashboard.module_units.map((unit) => /* @__PURE__ */ jsxs(
                "div",
                {
                  className: "grid grid-cols-[0.9fr,1.6fr,0.8fr] gap-4 border-t border-zinc-100 bg-white px-4 py-3 text-sm text-zinc-700",
                  children: [
                    /* @__PURE__ */ jsx("p", { className: "font-semibold text-emerald-700", children: unit.code ?? "-" }),
                    /* @__PURE__ */ jsxs("div", { children: [
                      /* @__PURE__ */ jsx("p", { className: "font-semibold text-zinc-900", children: unit.name }),
                      /* @__PURE__ */ jsxs("p", { className: "mt-1 text-xs text-zinc-500", children: [
                        "Credit Factor:",
                        " ",
                        unit.credit_factor ?? "-"
                      ] })
                    ] }),
                    /* @__PURE__ */ jsx("p", { className: "text-right font-medium text-zinc-600", children: unit.training_hours ?? "-" })
                  ]
                },
                unit.id
              ))
            ] }) : /* @__PURE__ */ jsx("div", { className: "rounded-2xl bg-[#F8F9FA] px-4 py-4 text-sm text-zinc-500", children: "No units have been assigned to this module yet." }),
            /* @__PURE__ */ jsx("div", { className: "mt-3 rounded-2xl bg-[#F8F9FA] px-4 py-3 text-xs text-zinc-500", children: dashboard.all_units_count ? `${dashboard.all_units_count} total unit(s) are mapped to your program version.` : "Your full unit list will appear once units are mapped to your program version." })
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx(
      Modal,
      {
        show: showSessionRegistrationModal,
        onClose: () => setShowSessionRegistrationModal(false),
        maxWidth: "lg",
        children: /* @__PURE__ */ jsxs("div", { className: "p-6", children: [
          /* @__PURE__ */ jsxs("div", { className: "border-b border-zinc-100 pb-4", children: [
            /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold text-zinc-900", children: "Register Current Session" }),
            /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-zinc-500", children: "Register yourself for the active academic session." })
          ] }),
          /* @__PURE__ */ jsxs(
            "form",
            {
              onSubmit: submitSessionRegistration,
              className: "space-y-5 pt-5",
              children: [
                /* @__PURE__ */ jsxs("div", { className: "rounded-2xl bg-zinc-50 px-4 py-3", children: [
                  /* @__PURE__ */ jsx("p", { className: "text-xs font-medium uppercase tracking-wide text-zinc-500", children: "Registration Number" }),
                  /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm font-semibold text-zinc-900", children: dashboard.student?.registration_number ?? "-" })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "rounded-2xl bg-zinc-50 px-4 py-3", children: [
                  /* @__PURE__ */ jsx("p", { className: "text-xs font-medium uppercase tracking-wide text-zinc-500", children: "Active Session" }),
                  /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm font-semibold text-zinc-900", children: dashboard.active_session ?? "No active session available" })
                ] }),
                errors.session_registration ? /* @__PURE__ */ jsx("p", { className: "text-sm text-red-600", children: errors.session_registration }) : null,
                /* @__PURE__ */ jsxs("div", { className: "flex justify-end gap-3 pt-2", children: [
                  /* @__PURE__ */ jsx(
                    "button",
                    {
                      type: "button",
                      onClick: () => setShowSessionRegistrationModal(false),
                      className: "rounded-xl bg-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-300",
                      children: "Cancel"
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "button",
                    {
                      type: "submit",
                      disabled: processing || !dashboard.active_session || !dashboard.session_registration?.can_register,
                      className: "rounded-xl bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-700 disabled:opacity-50",
                      children: processing ? "Registering..." : "Register Session"
                    }
                  )
                ] })
              ]
            }
          )
        ] })
      }
    )
  ] });
}
function StaffDashboard({ dashboard }) {
  const cards = [
    {
      label: "Programs",
      value: dashboard.stats?.[0]?.value ?? 0,
      icon: BookMarked,
      tone: "bg-emerald-50 text-emerald-600"
    },
    {
      label: "Program Versions",
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
    /* @__PURE__ */ jsx("h1", { className: "text-3xl font-bold tracking-tight text-zinc-900", children: "Academic Overview" }),
    /* @__PURE__ */ jsx("p", { className: "mt-1 text-zinc-500", children: "Manage programs, program versions, and institutional scheduling from one place." }),
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
function Dashboard({ dashboard }) {
  const { auth } = usePage().props;
  const fullName = [auth?.user?.first_name, auth?.user?.last_name].filter(Boolean).join(" ").trim() || "Student";
  if (dashboard?.type === "student") {
    return /* @__PURE__ */ jsxs(AuthenticatedLayout, { children: [
      /* @__PURE__ */ jsx(Head, { title: "Dashboard" }),
      /* @__PURE__ */ jsx(StudentDashboard, { dashboard, fullName })
    ] });
  }
  return /* @__PURE__ */ jsxs(AuthenticatedLayout, { children: [
    /* @__PURE__ */ jsx(Head, { title: "Dashboard" }),
    /* @__PURE__ */ jsx(StaffDashboard, { dashboard })
  ] });
}
export {
  Dashboard as default
};
