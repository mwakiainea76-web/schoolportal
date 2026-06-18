import { jsxs, jsx } from "react/jsx-runtime";
import { A as AuthenticatedLayout } from "../app.js";
import { I as InputError } from "./InputError-CBvD_6aD.js";
import { I as InputLabel } from "./InputLabel-DlDnrkJG.js";
import { P as PrimaryButton } from "./PrimaryButton-DsDrFqHJ.js";
import { S as SearchSelect } from "./SearchSelect-PvfiRNjv.js";
import { T as TextArea } from "./TextArea-DrH8CNbm.js";
import { T as TextInput } from "./TextInput-DsoSnibl.js";
import { usePage, useForm, Head, Link } from "@inertiajs/react";
import { ClipboardCheck, RefreshCcw } from "lucide-react";
import "axios";
import "../app2.js";
import "react-dom/client";
import "react";
import "@radix-ui/react-collapsible";
import "@radix-ui/react-scroll-area";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-separator";
import "@radix-ui/react-dialog";
import "@radix-ui/react-tooltip";
import "react-toastify";
import "ziggy-js";
import "./popover-CKqVD3WM.js";
import "cmdk";
import "@radix-ui/react-popover";
function ChangeStatus({ statuses = [] }) {
  const { auth } = usePage().props;
  const { data, setData, post, processing, errors } = useForm({
    staff_number: "",
    status: "active",
    effective_date: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
    reason: "",
    resume_date: ""
  });
  const statusOptions = statuses.map((status) => ({
    id: status,
    name: status.charAt(0).toUpperCase() + status.slice(1)
  }));
  const requiresReason = ["suspended", "onleave", "exited"].includes(
    data.status
  );
  const showResumeDate = data.status === "onleave";
  const isFormIncomplete = !data.staff_number.trim() || !data.status.trim() || !data.effective_date.trim() || requiresReason && !data.reason.trim();
  const submit = (e) => {
    e.preventDefault();
    post(route("staffs.status.store"), {
      preserveScroll: true
    });
  };
  return /* @__PURE__ */ jsxs(AuthenticatedLayout, { user: auth.user, header: "Staffs / Change Staff Status", children: [
    /* @__PURE__ */ jsx(Head, { title: "Change Staff Status" }),
    /* @__PURE__ */ jsx("div", { className: "mx-auto w-full max-w-5xl py-6", children: /* @__PURE__ */ jsxs("div", { className: "rounded-[28px] border border-zinc-200 bg-white shadow-sm", children: [
      /* @__PURE__ */ jsx("div", { className: "border-b border-zinc-100 px-8 py-6", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-4 md:flex-row md:items-start md:justify-between", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-4", children: [
          /* @__PURE__ */ jsx("div", { className: "flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600", children: /* @__PURE__ */ jsx(ClipboardCheck, { className: "h-6 w-6" }) }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h1", { className: "text-2xl font-semibold text-zinc-900", children: "Change Staff Status" }),
            /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-zinc-500", children: "Update the current staff status and keep a dated audit trail for every transition." })
          ] })
        ] }),
        /* @__PURE__ */ jsx(
          Link,
          {
            href: route("staffs.index"),
            className: "inline-flex items-center justify-center rounded-xl border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50",
            children: "Back to Staff Directory"
          }
        )
      ] }) }),
      /* @__PURE__ */ jsxs("form", { onSubmit: submit, className: "space-y-6 px-8 py-8", children: [
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 gap-5 md:grid-cols-3", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(InputLabel, { value: "Staff Number", required: true }),
            /* @__PURE__ */ jsx(
              TextInput,
              {
                required: true,
                name: "staff_number",
                value: data.staff_number,
                onChange: (e) => setData("staff_number", e.target.value),
                error: errors.staff_number,
                placeholder: "TVET/STAFF/001"
              }
            ),
            /* @__PURE__ */ jsx(InputError, { message: errors.staff_number })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(InputLabel, { value: "Staff Status", required: true }),
            /* @__PURE__ */ jsx(
              SearchSelect,
              {
                defaultOptions: statusOptions,
                value: data.status,
                onChange: (status) => setData("status", status.name.toLowerCase()),
                error: errors.status,
                placeholder: "Select status..."
              }
            ),
            /* @__PURE__ */ jsx(InputError, { message: errors.status })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(InputLabel, { value: "Effective Date", required: true }),
            /* @__PURE__ */ jsx(
              TextInput,
              {
                type: "date",
                name: "effective_date",
                value: data.effective_date,
                onChange: (e) => setData("effective_date", e.target.value),
                error: errors.effective_date
              }
            ),
            /* @__PURE__ */ jsx(InputError, { message: errors.effective_date })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 gap-5 md:grid-cols-2", children: [
          showResumeDate ? /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(InputLabel, { value: "Resume Date" }),
            /* @__PURE__ */ jsx(
              TextInput,
              {
                type: "date",
                name: "resume_date",
                value: data.resume_date,
                onChange: (e) => setData("resume_date", e.target.value),
                error: errors.resume_date
              }
            ),
            /* @__PURE__ */ jsx(InputError, { message: errors.resume_date })
          ] }) : /* @__PURE__ */ jsx("div", {}),
          /* @__PURE__ */ jsxs("div", { className: showResumeDate ? "" : "md:col-span-2", children: [
            /* @__PURE__ */ jsx(
              InputLabel,
              {
                value: "Reason",
                required: requiresReason
              }
            ),
            /* @__PURE__ */ jsx(
              TextArea,
              {
                name: "reason",
                rows: 4,
                value: data.reason,
                onChange: (e) => setData("reason", e.target.value),
                className: "rounded-xl border-zinc-200 bg-zinc-50 px-4 py-3 text-sm shadow-sm focus:border-zinc-300 focus:ring-zinc-200"
              }
            ),
            /* @__PURE__ */ jsx(InputError, { message: errors.reason })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex justify-between pt-2", children: [
          /* @__PURE__ */ jsx(
            Link,
            {
              href: route("staffs.index"),
              className: "rounded-xl border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50",
              children: "Cancel"
            }
          ),
          /* @__PURE__ */ jsxs(
            PrimaryButton,
            {
              disabled: processing || isFormIncomplete,
              className: "inline-flex items-center gap-2",
              children: [
                /* @__PURE__ */ jsx(RefreshCcw, { className: "h-4 w-4" }),
                processing ? "Updating..." : "Update Staff Status"
              ]
            }
          )
        ] })
      ] })
    ] }) })
  ] });
}
export {
  ChangeStatus as default
};
