import { jsxs, jsx } from "react/jsx-runtime";
import { Link } from "@inertiajs/react";
import { BookOpen, CalendarDays, Presentation, ClipboardPenLine, Eye, Send } from "lucide-react";
function HodDashboard({ dashboard }) {
  const trainerWorkspace = dashboard.trainer_workspace ?? {};
  const staffProfile = dashboard.staff_profile ?? {};
  const overviewCards = [
    {
      label: "Department",
      value: staffProfile.department_name ?? "Not assigned",
      icon: BookOpen,
      tone: "bg-emerald-50 text-emerald-600"
    },
    {
      label: "Active Session",
      value: trainerWorkspace.active_session?.name ?? "No active session",
      icon: CalendarDays,
      tone: "bg-sky-50 text-sky-600"
    },
    {
      label: "Timetable Sessions",
      value: trainerWorkspace.timetable_sessions_count || 0,
      icon: Presentation,
      tone: "bg-amber-50 text-amber-600"
    },
    {
      label: "Marks Recorded",
      value: trainerWorkspace.marks_recorded_count || 0,
      icon: ClipboardPenLine,
      tone: "bg-slate-100 text-slate-700"
    }
  ];
  const quickActions = [
    trainerWorkspace.can_view_timetable ? {
      label: "Department Timetable",
      helper: trainerWorkspace.active_session?.name ? `Open timetable for ${trainerWorkspace.active_session.name}` : "Open department timetable workspace",
      href: route("academic.timetables.index", {
        academic_session_id: trainerWorkspace.active_session?.id || "",
        department_id: trainerWorkspace.department_id || "",
        trainer_staff_id: trainerWorkspace.trainer_staff_id || ""
      }),
      icon: Presentation,
      tone: "from-emerald-500 to-teal-500"
    } : null,
    {
      label: "Add Marks",
      helper: "Open marks entry to choose a course mapping, unit, and record assessments.",
      href: route("academic.marks.add.index"),
      icon: ClipboardPenLine,
      tone: "from-sky-500 to-cyan-500"
    },
    {
      label: "View Marks",
      helper: "Review submitted marks by assessment, module, and academic year.",
      href: route("academic.marks.view.index"),
      icon: Eye,
      tone: "from-violet-500 to-indigo-500"
    },
    {
      label: "Publish Marks",
      helper: "Publish or unpublish departmental marks for a selected assessment.",
      href: route("academic.marks.publish.index"),
      icon: Send,
      tone: "from-rose-500 to-orange-500"
    }
  ].filter(Boolean);
  return /* @__PURE__ */ jsxs("div", { className: "animate-in fade-in slide-in-from-bottom-2 duration-700", children: [
    /* @__PURE__ */ jsx("h1", { className: "text-3xl font-bold tracking-tight text-zinc-900", children: "Department Overview" }),
    /* @__PURE__ */ jsx("p", { className: "mt-1 text-zinc-500", children: "Monitor teaching delivery, academic progress, and department-level academic operations." }),
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
    }) }),
    /* @__PURE__ */ jsxs("div", { className: "mt-10 rounded-[1.75rem] border border-zinc-100 bg-white p-7 shadow-sm", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-xl font-semibold text-zinc-900", children: "Department Workspace" }),
      /* @__PURE__ */ jsxs("p", { className: "text-sm text-zinc-500", children: [
        "Personal tools for",
        " ",
        staffProfile.designation || "department leadership",
        staffProfile.department_name ? ` in ${staffProfile.department_name}` : "",
        "."
      ] }),
      /* @__PURE__ */ jsx("div", { className: "mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3", children: quickActions.map((action) => {
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
              /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm text-zinc-500", children: action.helper })
            ]
          },
          action.label
        );
      }) })
    ] })
  ] });
}
export {
  HodDashboard as default
};
