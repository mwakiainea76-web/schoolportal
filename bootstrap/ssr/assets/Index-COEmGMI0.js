import { jsxs, Fragment, jsx } from "react/jsx-runtime";
import { Head, Link } from "@inertiajs/react";
import { T as Table, a as Thead, b as THdata, c as Tbody, d as Trow, e as Tdata } from "./Tdata-Lxy5yAUM.js";
import "react";
const STATUS_STYLES = {
  pending: "bg-amber-100 text-amber-700 border-amber-200",
  in_review: "bg-sky-100 text-sky-700 border-sky-200",
  escalated: "bg-purple-100 text-purple-700 border-purple-200",
  resolved: "bg-emerald-100 text-emerald-700 border-emerald-200"
};
function Index({ complaints }) {
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(Head, { title: "My Complaints" }),
    /* @__PURE__ */ jsxs("div", { className: "mx-auto w-full", children: [
      /* @__PURE__ */ jsxs("div", { className: "mb-4 flex flex-wrap items-center justify-between gap-3", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h1", { className: "text-lg font-semibold text-zinc-950", children: "My Complaints" }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-zinc-500", children: "View and track your submitted complaints." })
        ] }),
        /* @__PURE__ */ jsx(
          Link,
          {
            href: route("student.complaints.create"),
            className: "rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-700",
            children: "Submit Complaint"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs(Table, { pagination: complaints, children: [
        /* @__PURE__ */ jsxs(Thead, { children: [
          /* @__PURE__ */ jsx(THdata, { children: "Subject" }),
          /* @__PURE__ */ jsx(THdata, { children: "Status" }),
          /* @__PURE__ */ jsx(THdata, { children: "Escalated To" }),
          /* @__PURE__ */ jsx(THdata, { children: "Submitted" })
        ] }),
        /* @__PURE__ */ jsx(Tbody, { children: complaints?.data?.length ? complaints.data.map((complaint) => /* @__PURE__ */ jsxs(Trow, { children: [
          /* @__PURE__ */ jsx(Tdata, { className: "font-medium text-zinc-800", children: complaint.subject }),
          /* @__PURE__ */ jsx(Tdata, { children: /* @__PURE__ */ jsx(
            "span",
            {
              className: `inline-flex rounded-full border px-2.5 py-1 text-xs font-medium capitalize ${STATUS_STYLES[complaint.status] || "bg-zinc-100 text-zinc-600"}`,
              children: complaint.status.replace("_", " ")
            }
          ) }),
          /* @__PURE__ */ jsx(Tdata, { children: complaint.escalated_to ? `${complaint.escalated_to.name} (${complaint.escalated_to.designation})` : "-" }),
          /* @__PURE__ */ jsx(Tdata, { children: complaint.created_at })
        ] }, complaint.id)) : /* @__PURE__ */ jsx(Trow, { children: /* @__PURE__ */ jsx(
          Tdata,
          {
            colSpan: 4,
            className: "py-8 text-center text-zinc-500",
            children: "No complaints yet."
          }
        ) }) })
      ] })
    ] })
  ] });
}
export {
  Index as default
};
