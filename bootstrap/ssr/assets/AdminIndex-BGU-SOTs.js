import { jsxs, Fragment, jsx } from "react/jsx-runtime";
import { Head, Link, router } from "@inertiajs/react";
import { T as Table$1, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell } from "./table-CORCWxM6.js";
import { T as TablePagination } from "./TablePagination-BE25-yJ0.js";
import "react";
import "../app.js";
import "axios";
import "../app2.js";
import "react-dom/client";
import "lucide-react";
import "@radix-ui/react-collapsible";
import "@radix-ui/react-scroll-area";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-separator";
import "@radix-ui/react-dialog";
import "@radix-ui/react-tooltip";
import "react-toastify";
const STATUS_STYLES = {
  pending: "bg-amber-100 text-amber-700 border-amber-200",
  in_review: "bg-sky-100 text-sky-700 border-sky-200",
  escalated: "bg-purple-100 text-purple-700 border-purple-200",
  resolved: "bg-emerald-100 text-emerald-700 border-emerald-200"
};
function AdminIndex({ complaints, filterStatus }) {
  const handleStatusFilter = (status) => {
    router.get(
      route("complaints.admin.index"),
      { status },
      { preserveState: true, preserveScroll: true }
    );
  };
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(Head, { title: "Complaints Management" }),
    /* @__PURE__ */ jsxs("div", { className: "mx-auto w-full", children: [
      /* @__PURE__ */ jsx("div", { className: "mb-4 flex flex-wrap items-center justify-between gap-3", children: /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h1", { className: "text-lg font-semibold text-zinc-950", children: "Complaints Management" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-zinc-500", children: "Review and escalate student complaints." })
      ] }) }),
      /* @__PURE__ */ jsx("div", { className: "mb-4 flex flex-wrap gap-2", children: ["", "pending", "in_review", "escalated", "resolved"].map(
        (status) => /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            onClick: () => handleStatusFilter(status),
            className: `rounded-lg px-3 py-1.5 text-xs font-medium transition ${filterStatus === status ? "bg-emerald-600 text-white" : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"}`,
            children: status ? status.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase()) : "All"
          },
          status
        )
      ) }),
      /* @__PURE__ */ jsxs(Table, { pagination: complaints, children: [
        /* @__PURE__ */ jsxs(Thead, { children: [
          /* @__PURE__ */ jsx(THdata, { children: "Student" }),
          /* @__PURE__ */ jsx(THdata, { children: "Subject" }),
          /* @__PURE__ */ jsx(THdata, { children: "Status" }),
          /* @__PURE__ */ jsx(THdata, { children: "Escalated To" }),
          /* @__PURE__ */ jsx(THdata, { children: "Submitted" }),
          /* @__PURE__ */ jsx(THdata, { children: "Action" })
        ] }),
        /* @__PURE__ */ jsx(Tbody, { children: complaints?.data?.length ? complaints.data.map((complaint) => /* @__PURE__ */ jsxs(Trow, { children: [
          /* @__PURE__ */ jsx(Tdata, { children: /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { className: "font-medium text-zinc-800", children: complaint.student?.name ?? "N/A" }),
            /* @__PURE__ */ jsx("p", { className: "text-xs text-zinc-500", children: complaint.student?.admission_number ?? "" })
          ] }) }),
          /* @__PURE__ */ jsx(Tdata, { className: "font-medium text-zinc-800", children: complaint.subject }),
          /* @__PURE__ */ jsx(Tdata, { children: /* @__PURE__ */ jsx(
            "span",
            {
              className: `inline-flex rounded-full border px-2.5 py-1 text-xs font-medium capitalize ${STATUS_STYLES[complaint.status] || "bg-zinc-100 text-zinc-600"}`,
              children: complaint.status.replace("_", " ")
            }
          ) }),
          /* @__PURE__ */ jsx(Tdata, { children: complaint.escalated_to ? complaint.escalated_to.name : "-" }),
          /* @__PURE__ */ jsx(Tdata, { children: complaint.created_at }),
          /* @__PURE__ */ jsx(Tdata, { children: /* @__PURE__ */ jsx(
            Link,
            {
              href: route(
                "complaints.admin.show",
                complaint.id
              ),
              className: "text-sm font-medium text-sky-600 hover:text-sky-800",
              children: "View"
            }
          ) })
        ] }, complaint.id)) : /* @__PURE__ */ jsx(Trow, { children: /* @__PURE__ */ jsx(
          Tdata,
          {
            colSpan: 6,
            className: "py-8 text-center text-zinc-500",
            children: "No complaints found."
          }
        ) }) })
      ] })
    ] })
  ] });
}
const Table = ({ children, pagination, ...props }) => /* @__PURE__ */ jsxs(Fragment, { children: [
  /* @__PURE__ */ jsx(Table$1, { ...props, children }),
  /* @__PURE__ */ jsx(TablePagination, { pagination })
] });
const Thead = ({ children, ...props }) => /* @__PURE__ */ jsx(TableHeader, { ...props, children: /* @__PURE__ */ jsx(TableRow, { children }) });
const THdata = (props) => /* @__PURE__ */ jsx(TableHead, { ...props });
const Tbody = (props) => /* @__PURE__ */ jsx(TableBody, { ...props });
const Trow = (props) => /* @__PURE__ */ jsx(TableRow, { ...props });
const Tdata = (props) => /* @__PURE__ */ jsx(TableCell, { ...props });
export {
  AdminIndex as default
};
