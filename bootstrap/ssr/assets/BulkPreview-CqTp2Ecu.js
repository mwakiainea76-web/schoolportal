import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { useState } from "react";
import { Head, Link, router } from "@inertiajs/react";
import { A as AuthenticatedLayout } from "./AuthenticatedLayout-DYCvRbZH.js";
import { I as InputError } from "./InputError-CBvD_6aD.js";
import { I as InputLabel } from "./InputLabel-DlDnrkJG.js";
import "ziggy-js";
import "lucide-react";
import "react-toastify";
function BulkPreview({ affected, toFeePlan, criteria }) {
  const [confirming, setConfirming] = useState(false);
  const [processing, setProcessing] = useState(false);
  const handleReplace = () => {
    setProcessing(true);
    router.post(
      route("fees.assignments.bulk.replace"),
      {
        from_fee_plan_id: criteria.from_fee_plan_id,
        to_fee_plan_id: criteria.to_fee_plan_id,
        academic_year_id: criteria.academic_year_id,
        year_of_study: criteria.year_of_study,
        session_number: criteria.session_number
      },
      {
        preserveScroll: true,
        onFinish: () => setProcessing(false)
      }
    );
  };
  return /* @__PURE__ */ jsxs(AuthenticatedLayout, { children: [
    /* @__PURE__ */ jsx(Head, { title: "Bulk Replace Preview" }),
    /* @__PURE__ */ jsxs("div", { className: "mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-700", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center mb-6", children: [
        /* @__PURE__ */ jsx("h1", { className: "text-lg font-semibold text-zinc-700", children: "Bulk Replace Preview" }),
        /* @__PURE__ */ jsx(
          Link,
          {
            href: route("fees.assignments.index"),
            className: "px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-800 transition",
            children: "Back to Assignments"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "bg-white border border-zinc-100 rounded-lg shadow-sm p-6 mb-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4 mb-4", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("span", { className: "text-sm text-zinc-500", children: "From Fee Plan" }),
            /* @__PURE__ */ jsx("p", { className: "font-medium text-zinc-800", children: affected[0]?.feePlan?.name })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("span", { className: "text-sm text-zinc-500", children: "To Fee Plan" }),
            /* @__PURE__ */ jsx("p", { className: "font-medium text-zinc-800", children: toFeePlan?.name })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("span", { className: "text-sm text-zinc-500", children: "Academic Year / Session" }),
            /* @__PURE__ */ jsxs("p", { className: "font-medium text-zinc-800", children: [
              "Year ",
              criteria.year_of_study,
              ", Session",
              " ",
              criteria.session_number
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "bg-amber-50 border border-amber-200 rounded-lg p-4", children: /* @__PURE__ */ jsxs("p", { className: "text-sm text-amber-800", children: [
          /* @__PURE__ */ jsx("strong", { children: "Warning:" }),
          " This will deactivate",
          " ",
          affected.length,
          " existing fee assignment",
          affected.length !== 1 ? "s" : "",
          " and create new ones under the target fee plan. This action is reversible via the restore feature."
        ] }) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "bg-white border border-zinc-100 rounded-lg shadow-sm overflow-hidden", children: [
        /* @__PURE__ */ jsx("div", { className: "bg-slate-50 px-6 py-3 border-b", children: /* @__PURE__ */ jsxs("h2", { className: "text-sm font-semibold text-slate-800", children: [
          "Affected Assignments (",
          affected.length,
          ")"
        ] }) }),
        /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs("table", { className: "min-w-full divide-y divide-slate-200", children: [
          /* @__PURE__ */ jsx("thead", { className: "bg-white", children: /* @__PURE__ */ jsxs("tr", { children: [
            /* @__PURE__ */ jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider", children: "#" }),
            /* @__PURE__ */ jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider", children: "Program Version" }),
            /* @__PURE__ */ jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider", children: "Year / Session" }),
            /* @__PURE__ */ jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider", children: "Valid From" }),
            /* @__PURE__ */ jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider", children: "Current Fee Plan" })
          ] }) }),
          /* @__PURE__ */ jsx("tbody", { className: "bg-white divide-y divide-slate-100", children: affected.map((assignment, index) => /* @__PURE__ */ jsxs("tr", { children: [
            /* @__PURE__ */ jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-zinc-700", children: index + 1 }),
            /* @__PURE__ */ jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-zinc-700", children: assignment.courseProgramVersion?.name }),
            /* @__PURE__ */ jsxs("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-zinc-700", children: [
              "Year ",
              assignment.year_of_study,
              ", Session",
              " ",
              assignment.session_number
            ] }),
            /* @__PURE__ */ jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-zinc-700", children: assignment.valid_from }),
            /* @__PURE__ */ jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-zinc-700", children: assignment.feePlan?.name })
          ] }, assignment.id)) })
        ] }) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mt-6 bg-white border border-zinc-100 rounded-lg shadow-sm p-6", children: [
        /* @__PURE__ */ jsx("div", { className: "flex items-start gap-4", children: /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
          /* @__PURE__ */ jsx(InputLabel, { value: "Confirmation" }),
          /* @__PURE__ */ jsxs("p", { className: "text-sm text-zinc-600 mt-1", children: [
            "Please confirm that you want to replace",
            " ",
            /* @__PURE__ */ jsx("strong", { children: affected.length }),
            " fee assignment(s) from their current fee plan to",
            " ",
            /* @__PURE__ */ jsx("strong", { children: toFeePlan?.name }),
            ". This will deactivate the old assignments and create new ones."
          ] }),
          /* @__PURE__ */ jsx(
            InputError,
            {
              message: typeof window !== "undefined" ? new URLSearchParams(
                window.location.search
              ).get("error") : void 0
            }
          )
        ] }) }),
        /* @__PURE__ */ jsxs("div", { className: "flex justify-end gap-4 mt-6", children: [
          /* @__PURE__ */ jsx(
            Link,
            {
              href: route("fees.assignments.index"),
              className: "px-4 py-2 bg-zinc-400 text-white rounded hover:bg-zinc-500 transition",
              children: "Cancel"
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: handleReplace,
              disabled: processing || confirming,
              className: "px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center gap-2",
              children: processing ? /* @__PURE__ */ jsxs(Fragment, { children: [
                /* @__PURE__ */ jsx("span", { className: "animate-spin inline-block w-4 h-4 border-[3px] border-white border-t-transparent rounded-full" }),
                "Replacing..."
              ] }) : "Confirm & Replace"
            }
          )
        ] })
      ] })
    ] })
  ] });
}
export {
  BulkPreview as default
};
