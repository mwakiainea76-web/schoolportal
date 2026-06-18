import { jsxs, Fragment, jsx } from "react/jsx-runtime";
import { useForm, Head } from "@inertiajs/react";
import { I as InputError } from "./InputError-CBvD_6aD.js";
import { I as InputLabel } from "./InputLabel-DlDnrkJG.js";
import { S as SearchSelect } from "./SearchSelect-PvfiRNjv.js";
import { T as TextInput } from "./TextInput-DsoSnibl.js";
import { l as leaveTypes } from "./shared-CpNiKsO8.js";
import "react";
import "ziggy-js";
import "lucide-react";
import "../app.js";
import "axios";
import "../app2.js";
import "react-dom/client";
import "@radix-ui/react-collapsible";
import "@radix-ui/react-scroll-area";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-separator";
import "@radix-ui/react-dialog";
import "@radix-ui/react-tooltip";
import "react-toastify";
import "./popover-CKqVD3WM.js";
import "cmdk";
import "@radix-ui/react-popover";
function CreateLeaveRequest({ staffOptions = [] }) {
  const { data, setData, post, processing, errors, reset } = useForm({
    staff_number: staffOptions[0]?.id ?? "",
    leave_type: "",
    start_date: "",
    end_date: "",
    reason: ""
  });
  const submit = (event) => {
    event.preventDefault();
    post(route("hr.leave-requests.store"), {
      preserveScroll: true,
      onSuccess: () => reset()
    });
  };
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(Head, { title: "Add Leave Request" }),
    /* @__PURE__ */ jsx("div", { className: "mx-auto w-full", children: /* @__PURE__ */ jsxs("div", { className: "overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm", children: [
      /* @__PURE__ */ jsxs("div", { className: "border-b border-zinc-200 px-5 py-4", children: [
        /* @__PURE__ */ jsx("h1", { className: "text-lg font-semibold text-zinc-950", children: "Add Leave Request" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-zinc-500", children: "Submit staff leave details for HR review." })
      ] }),
      /* @__PURE__ */ jsxs("form", { onSubmit: submit, className: "space-y-6 px-5 py-5", children: [
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(InputLabel, { value: "Staff Number", required: true }),
            /* @__PURE__ */ jsx(
              SearchSelect,
              {
                routeName: "staffs.search",
                defaultOptions: staffOptions,
                value: data.staff_number,
                onChange: (staff) => setData(
                  "staff_number",
                  staff.id ?? staff.staff_number ?? ""
                ),
                error: errors.staff_number,
                placeholder: "Search staff number",
                minSearchLength: 1,
                preloadOptions: true
              }
            ),
            /* @__PURE__ */ jsx(InputError, { message: errors.staff_number })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(InputLabel, { value: "Leave Type", required: true }),
            /* @__PURE__ */ jsxs(
              "select",
              {
                value: data.leave_type,
                onChange: (event) => setData(
                  "leave_type",
                  event.target.value
                ),
                className: `w-full rounded-xl border bg-zinc-50 px-5 py-2.5 text-sm transition focus:ring-zinc-300 ${errors.leave_type ? "border-red-400" : "border-zinc-200"}`,
                children: [
                  /* @__PURE__ */ jsx("option", { value: "", children: "Select leave type" }),
                  leaveTypes.map((type) => /* @__PURE__ */ jsx("option", { value: type.id, children: type.name }, type.id))
                ]
              }
            ),
            /* @__PURE__ */ jsx(InputError, { message: errors.leave_type })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(InputLabel, { value: "Start Date", required: true }),
            /* @__PURE__ */ jsx(
              TextInput,
              {
                type: "date",
                value: data.start_date,
                onChange: (event) => setData(
                  "start_date",
                  event.target.value
                ),
                error: errors.start_date
              }
            ),
            /* @__PURE__ */ jsx(InputError, { message: errors.start_date })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(InputLabel, { value: "End Date", required: true }),
            /* @__PURE__ */ jsx(
              TextInput,
              {
                type: "date",
                value: data.end_date,
                onChange: (event) => setData("end_date", event.target.value),
                error: errors.end_date
              }
            ),
            /* @__PURE__ */ jsx(InputError, { message: errors.end_date })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "max-w-4xl", children: [
          /* @__PURE__ */ jsx(InputLabel, { value: "Reason", required: true }),
          /* @__PURE__ */ jsx(
            "textarea",
            {
              value: data.reason,
              onChange: (event) => setData("reason", event.target.value),
              rows: 4,
              className: `w-full rounded-xl border bg-zinc-50 px-5 py-2.5 text-sm transition focus:ring-zinc-300 ${errors.reason ? "border-red-400" : "border-zinc-200"}`,
              placeholder: "Enter the reason for this leave request"
            }
          ),
          /* @__PURE__ */ jsx(InputError, { message: errors.reason })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "flex justify-end", children: /* @__PURE__ */ jsx(
          "button",
          {
            type: "submit",
            disabled: processing,
            className: "min-h-[42px] rounded-lg bg-emerald-600 px-6 py-2 text-sm font-medium text-white transition hover:bg-emerald-700 disabled:opacity-50",
            children: processing ? "Submitting..." : "Submit Leave Request"
          }
        ) })
      ] })
    ] }) })
  ] });
}
export {
  CreateLeaveRequest as default
};
