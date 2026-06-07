import { jsxs, jsx } from "react/jsx-runtime";
import { Head, Link } from "@inertiajs/react";
import { A as AuthenticatedLayout } from "../app.js";
import { CalendarDays, ClipboardPenLine, Eye, Send, BookMarked, GraduationCap, ShieldCheck } from "lucide-react";
import "axios";
import "react";
import "react-toastify";
import "react-dom/client";
function StaffDashboard({ dashboard }) {
  const staffProfile = dashboard?.staff_profile ?? {};
  const trainerWorkspace = dashboard?.trainer_workspace ?? {};
  const canManageMarks = trainerWorkspace.can_grade_students || (staffProfile.roles || []).some(
    (role) => ["hod", "admin"].includes(String(role).toLowerCase())
  );
  const quickActions = [
    trainerWorkspace.can_view_timetable ? {
      label: "My Timetable",
      helper: "Open your timetable already scoped to the current session and your department.",
      href: route("academic.timetables.index"),
      icon: CalendarDays,
      tone: "from-emerald-500 to-teal-500"
    } : null,
    canManageMarks ? {
      label: "Add Marks",
      helper: "Capture marks for units taught within your department workspace.",
      href: route("academic.marks.add.index"),
      icon: ClipboardPenLine,
      tone: "from-sky-500 to-cyan-500"
    } : null,
    canManageMarks ? {
      label: "View Marks",
      helper: "Review submitted marks by assessment, unit, and academic year.",
      href: route("academic.marks.view.index"),
      icon: Eye,
      tone: "from-violet-500 to-indigo-500"
    } : null,
    (staffProfile.roles || []).some(
      (role) => ["hod", "admin"].includes(String(role).toLowerCase())
    ) ? {
      label: "Publish Marks",
      helper: "Approve and publish departmental marks assessment by assessment.",
      href: route("academic.marks.publish.index"),
      icon: Send,
      tone: "from-rose-500 to-orange-500"
    } : null,
    canManageMarks ? {
      label: "Unit Marksheet",
      helper: "Review marksheets and unit-level grading summaries.",
      href: route("academic.marks.marksheet.index"),
      icon: BookMarked,
      tone: "from-amber-500 to-orange-500"
    } : null
  ].filter(Boolean);
  const infoCards = [
    {
      label: "Department",
      value: staffProfile.department_name || "Not linked",
      icon: GraduationCap,
      tone: "from-slate-800 to-slate-700"
    },
    {
      label: "Current Session",
      value: trainerWorkspace.active_session?.name || "No active session",
      icon: ShieldCheck,
      tone: "from-emerald-500 to-teal-500"
    },
    {
      label: "Timetable Sessions",
      value: trainerWorkspace.timetable_sessions_count || 0,
      icon: CalendarDays,
      tone: "from-sky-500 to-cyan-500"
    },
    {
      label: "Recorded Marks",
      value: trainerWorkspace.marks_recorded_count || 0,
      icon: ClipboardPenLine,
      tone: "from-amber-500 to-orange-500"
    }
  ];
  return /* @__PURE__ */ jsxs(AuthenticatedLayout, { children: [
    /* @__PURE__ */ jsx(Head, { title: "Staff Dashboard" }),
    /* @__PURE__ */ jsxs("div", { className: "animate-in fade-in slide-in-from-bottom-2 duration-700", children: [
      /* @__PURE__ */ jsxs("div", { className: "relative overflow-hidden rounded-[2rem] bg-[#17324d] px-8 py-10 text-white shadow-xl", children: [
        /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(16,185,129,0.24),_transparent_35%),radial-gradient(circle_at_bottom_left,_rgba(255,255,255,0.08),_transparent_25%)]" }),
        /* @__PURE__ */ jsxs("div", { className: "relative flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between", children: [
          /* @__PURE__ */ jsxs("div", { className: "max-w-2xl", children: [
            /* @__PURE__ */ jsx("p", { className: "text-sm font-semibold uppercase tracking-[0.2em] text-emerald-300", children: "Staff Workspace" }),
            /* @__PURE__ */ jsx("h1", { className: "mt-3 text-4xl font-bold tracking-tight", children: staffProfile.name || "Staff Dashboard" }),
            /* @__PURE__ */ jsx("p", { className: "mt-3 max-w-xl text-sm text-slate-300", children: "Keep your teaching work focused in one place with quick access to your timetable, grading, and marksheet tools." })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 gap-4 sm:grid-cols-2", children: [
            /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur", children: [
              /* @__PURE__ */ jsx("p", { className: "text-xs uppercase tracking-wide text-slate-300", children: "Staff Number" }),
              /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm font-semibold", children: staffProfile.staff_number || "-" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur", children: [
              /* @__PURE__ */ jsx("p", { className: "text-xs uppercase tracking-wide text-slate-300", children: "Designation" }),
              /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm font-semibold", children: staffProfile.designation || "Staff" })
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4", children: infoCards.map((card) => {
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
              /* @__PURE__ */ jsx("p", { className: "mt-2 text-2xl font-bold tracking-tight text-zinc-900", children: card.value })
            ]
          },
          card.label
        );
      }) }),
      /* @__PURE__ */ jsxs("div", { className: "mt-8 rounded-[1.75rem] border border-zinc-100 bg-white p-7 shadow-sm", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-2 lg:flex-row lg:items-end lg:justify-between", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h2", { className: "text-xl font-semibold text-zinc-900", children: "My Tools" }),
            /* @__PURE__ */ jsxs("p", { className: "text-sm text-zinc-500", children: [
              "Personal actions for your teaching work in",
              " ",
              staffProfile.department_name || "your department",
              "."
            ] })
          ] }),
          staffProfile.roles?.length ? /* @__PURE__ */ jsxs("div", { className: "rounded-2xl bg-zinc-50 px-4 py-3 text-sm text-zinc-600", children: [
            "Roles:",
            " ",
            /* @__PURE__ */ jsx("span", { className: "font-semibold text-zinc-900", children: staffProfile.roles.join(", ") })
          ] }) : null
        ] }),
        /* @__PURE__ */ jsx("div", { className: "mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3", children: quickActions.length ? quickActions.map((action) => {
          const Icon = action.icon;
          return /* @__PURE__ */ jsxs(
            Link,
            {
              href: action.href,
              className: "group rounded-[1.5rem] border border-zinc-100 bg-zinc-50 p-5 transition hover:border-emerald-200 hover:bg-white hover:shadow-sm",
              children: [
                /* @__PURE__ */ jsx(
                  "div",
                  {
                    className: `inline-flex rounded-2xl bg-gradient-to-br ${action.tone} p-3 text-white shadow-lg`,
                    children: /* @__PURE__ */ jsx(Icon, { className: "h-5 w-5" })
                  }
                ),
                /* @__PURE__ */ jsx("p", { className: "mt-5 text-lg font-semibold text-zinc-900", children: action.label }),
                /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm text-zinc-500", children: action.helper }),
                /* @__PURE__ */ jsx("p", { className: "mt-4 text-sm font-medium text-emerald-700 transition group-hover:text-emerald-800", children: "Open workspace" })
              ]
            },
            action.label
          );
        }) : /* @__PURE__ */ jsx("div", { className: "rounded-2xl border border-dashed border-zinc-200 bg-zinc-50 px-5 py-6 text-sm text-zinc-500", children: "No trainer-specific tools are enabled on this account yet." }) })
      ] })
    ] })
  ] });
}
export {
  StaffDashboard as default
};
