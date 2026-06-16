import { jsxs, Fragment, jsx } from "react/jsx-runtime";
import { Head, Link } from "@inertiajs/react";
import { Settings2, BookOpenCheck, CheckCircle2, Ban, Layers3, PieChart, Activity } from "lucide-react";
import { u as useRbac } from "../app.js";
import "axios";
import "react-dom/client";
import "react";
import "react-toastify";
function CurriculumIndex({
  summary = {},
  examBodyBreakdown = [],
  recentCurricula = []
}) {
  const { can } = useRbac();
  const formatNumber = (value) => Number(value || 0).toLocaleString();
  const activeCount = Number(summary.active || 0);
  const totalCount = Number(summary.total || 0);
  const activeRate = totalCount ? Math.round(activeCount / totalCount * 100) : 0;
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(Head, { title: "Curriculums" }),
    /* @__PURE__ */ jsxs("div", { className: "mx-auto w-full space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-700", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold uppercase text-emerald-600", children: "Edit" }),
          /* @__PURE__ */ jsx("h1", { className: "text-xl font-semibold text-slate-950", children: "Curriculum Edit Workspace" })
        ] }),
        can("curriculums.view") ? /* @__PURE__ */ jsxs(
          Link,
          {
            href: route("curriculums.edit.index"),
            className: "inline-flex items-center justify-center gap-2 rounded border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700",
            children: [
              /* @__PURE__ */ jsx(Settings2, { className: "h-4 w-4", "aria-hidden": "true" }),
              "Edit"
            ]
          }
        ) : null
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4", children: [
        /* @__PURE__ */ jsx(
          SummaryCard,
          {
            icon: BookOpenCheck,
            label: "Total Curriculums",
            value: formatNumber(summary.total),
            helper: `${formatNumber(summary.exam_bodies)} exam bodies represented`,
            tone: "sky"
          }
        ),
        /* @__PURE__ */ jsx(
          SummaryCard,
          {
            icon: CheckCircle2,
            label: "Active Curriculums",
            value: formatNumber(summary.active),
            helper: `${activeRate}% active`,
            tone: "emerald",
            featured: true
          }
        ),
        /* @__PURE__ */ jsx(
          SummaryCard,
          {
            icon: Ban,
            label: "Disabled Curriculums",
            value: formatNumber(summary.disabled),
            helper: "Ready for reactivation when needed",
            tone: "amber"
          }
        ),
        /* @__PURE__ */ jsx(
          SummaryCard,
          {
            icon: Layers3,
            label: "Course Mappings",
            value: formatNumber(summary.mapped_courses),
            helper: `${formatNumber(summary.unmapped)} not mapped`,
            tone: "violet"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(320px,0.72fr)]", children: [
        /* @__PURE__ */ jsx(InsightPanel, { icon: PieChart, title: "Curriculums by Exam Body", children: examBodyBreakdown.length ? /* @__PURE__ */ jsx("div", { className: "space-y-3", children: examBodyBreakdown.map((item) => {
          const percent = totalCount ? Math.round(item.count / totalCount * 100) : 0;
          return /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-4 text-sm", children: [
              /* @__PURE__ */ jsx("span", { className: "font-medium text-slate-700", children: item.name }),
              /* @__PURE__ */ jsx("span", { className: "text-slate-500", children: formatNumber(item.count) })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "mt-2 h-2 overflow-hidden rounded-full bg-slate-100", children: /* @__PURE__ */ jsx(
              "div",
              {
                className: "h-full rounded-full bg-emerald-500",
                style: { width: `${percent}%` }
              }
            ) })
          ] }, item.id ?? "unassigned");
        }) }) : /* @__PURE__ */ jsx(EmptyPanelMessage, { message: "No curriculums assigned to exam bodies yet." }) }),
        /* @__PURE__ */ jsx(InsightPanel, { icon: Activity, title: "Recent Activity", children: recentCurricula.length ? /* @__PURE__ */ jsx("div", { className: "divide-y divide-slate-100", children: recentCurricula.map((curriculum) => /* @__PURE__ */ jsxs(
          "div",
          {
            className: "flex items-start justify-between gap-4 py-3 first:pt-0 last:pb-0",
            children: [
              /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
                /* @__PURE__ */ jsx("p", { className: "truncate text-sm font-semibold text-slate-800", children: curriculum.name }),
                /* @__PURE__ */ jsxs("p", { className: "mt-1 text-xs text-slate-500", children: [
                  curriculum.exam_body || "No exam body",
                  " -",
                  " ",
                  curriculum.updated_at || "No date"
                ] })
              ] }),
              /* @__PURE__ */ jsx(StatusPill, { active: curriculum.is_active })
            ]
          },
          curriculum.id
        )) }) : /* @__PURE__ */ jsx(EmptyPanelMessage, { message: "No recent curriculum activity." }) })
      ] })
    ] })
  ] });
}
function SummaryCard({ icon: Icon, label, value, helper, tone, featured = false }) {
  const tones = {
    sky: "bg-sky-100 text-sky-700",
    emerald: "bg-emerald-100 text-emerald-700",
    amber: "bg-amber-100 text-amber-700",
    violet: "bg-violet-100 text-violet-700"
  };
  return /* @__PURE__ */ jsx(
    "div",
    {
      className: `rounded-lg border border-slate-200 bg-white p-5 shadow-sm ${featured ? "border-r-4 border-r-emerald-500" : ""}`,
      children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
        /* @__PURE__ */ jsx("span", { className: `flex h-12 w-12 shrink-0 items-center justify-center rounded ${tones[tone]}`, children: /* @__PURE__ */ jsx(Icon, { className: "h-6 w-6", "aria-hidden": "true" }) }),
        /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
          /* @__PURE__ */ jsx("h3", { className: "text-xs font-bold uppercase text-slate-500", children: label }),
          /* @__PURE__ */ jsx("p", { className: "mt-1 text-3xl font-semibold leading-none text-slate-950", children: value }),
          /* @__PURE__ */ jsx("p", { className: "mt-2 text-xs text-slate-500", children: helper })
        ] })
      ] })
    }
  );
}
function InsightPanel({ icon: Icon, title, children }) {
  return /* @__PURE__ */ jsxs("section", { className: "rounded-lg border border-slate-200 bg-white shadow-sm", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 border-b border-slate-100 px-4 py-4", children: [
      /* @__PURE__ */ jsx(Icon, { className: "h-5 w-5 text-slate-900", "aria-hidden": "true" }),
      /* @__PURE__ */ jsx("h2", { className: "text-lg font-semibold text-slate-950", children: title })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "min-h-[126px] p-5", children })
  ] });
}
function EmptyPanelMessage({ message }) {
  return /* @__PURE__ */ jsx("div", { className: "flex min-h-[96px] items-center justify-center text-center text-sm text-slate-400", children: message });
}
function StatusPill({ active }) {
  return /* @__PURE__ */ jsx(
    "span",
    {
      className: `rounded px-2 py-1 text-xs font-semibold ${active ? "bg-emerald-100 text-emerald-700" : "bg-zinc-200 text-zinc-700"}`,
      children: active ? "Active" : "Disabled"
    }
  );
}
export {
  CurriculumIndex as default
};
