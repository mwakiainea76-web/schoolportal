import { jsxs, Fragment, jsx } from "react/jsx-runtime";
import { Head, Link } from "@inertiajs/react";
import { T as Table, a as Thead, b as THdata, c as Tbody, d as Trow, e as Tdata } from "./Tdata-Lxy5yAUM.js";
import { t as typeLabel, s as statusClass } from "./shared-CpNiKsO8.js";
import "react";
function LeaveRequestIndex({
  leaveRequests,
  canViewAllRequests
}) {
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(Head, { title: "Leave Requests" }),
    /* @__PURE__ */ jsxs("div", { className: "mx-auto w-full", children: [
      /* @__PURE__ */ jsxs("div", { className: "mb-4 flex flex-wrap items-center justify-between gap-3", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h1", { className: "text-lg font-semibold text-zinc-950", children: canViewAllRequests ? "Leave Requests" : "My Leave Requests" }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-zinc-500", children: "Review submitted staff leave requests." })
        ] }),
        /* @__PURE__ */ jsx(
          Link,
          {
            href: route("hr.leave-requests.create"),
            className: "rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-700",
            children: "Add Leave Request"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs(Table, { pagination: leaveRequests, children: [
        /* @__PURE__ */ jsxs(Thead, { children: [
          canViewAllRequests ? /* @__PURE__ */ jsx(THdata, { children: "Staff" }) : null,
          /* @__PURE__ */ jsx(THdata, { children: "Leave Type" }),
          /* @__PURE__ */ jsx(THdata, { children: "Start Date" }),
          /* @__PURE__ */ jsx(THdata, { children: "End Date" }),
          /* @__PURE__ */ jsx(THdata, { children: "Days" }),
          /* @__PURE__ */ jsx(THdata, { children: "Status" }),
          /* @__PURE__ */ jsx(THdata, { children: "Submitted" })
        ] }),
        /* @__PURE__ */ jsx(Tbody, { children: leaveRequests?.data?.length ? leaveRequests.data.map((request) => /* @__PURE__ */ jsxs(Trow, { children: [
          canViewAllRequests ? /* @__PURE__ */ jsx(Tdata, { children: /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { className: "font-medium text-zinc-800", children: request.staff?.name ?? "N/A" }),
            /* @__PURE__ */ jsx("p", { className: "text-xs text-zinc-500", children: request.staff?.staff_number ?? "N/A" })
          ] }) }) : null,
          /* @__PURE__ */ jsx(Tdata, { children: typeLabel(request.leave_type) }),
          /* @__PURE__ */ jsx(Tdata, { children: request.start_date }),
          /* @__PURE__ */ jsx(Tdata, { children: request.end_date }),
          /* @__PURE__ */ jsx(Tdata, { children: request.total_days }),
          /* @__PURE__ */ jsx(Tdata, { children: /* @__PURE__ */ jsx(
            "span",
            {
              className: `inline-flex rounded-full border px-2.5 py-1 text-xs font-medium capitalize ${statusClass(
                request.status
              )}`,
              children: request.status
            }
          ) }),
          /* @__PURE__ */ jsx(Tdata, { children: request.created_at })
        ] }, request.id)) : /* @__PURE__ */ jsx(Trow, { children: /* @__PURE__ */ jsx(
          Tdata,
          {
            colSpan: canViewAllRequests ? 7 : 6,
            className: "py-4 text-center",
            children: "No leave requests found."
          }
        ) }) })
      ] })
    ] })
  ] });
}
export {
  LeaveRequestIndex as default
};
