import { jsxs, Fragment, jsx } from "react/jsx-runtime";
import { useForm, Head, router } from "@inertiajs/react";
import { I as InputError } from "./InputError-CBvD_6aD.js";
import { I as InputLabel } from "./InputLabel-DlDnrkJG.js";
import { P as PrimaryButton } from "./PrimaryButton-DsDrFqHJ.js";
import { T as TextArea } from "./TextArea-DrH8CNbm.js";
import "react";
const STATUS_STYLES = {
  pending: "bg-amber-100 text-amber-700 border-amber-200",
  in_review: "bg-sky-100 text-sky-700 border-sky-200",
  escalated: "bg-purple-100 text-purple-700 border-purple-200",
  resolved: "bg-emerald-100 text-emerald-700 border-emerald-200"
};
function AdminShow({ complaint, staffOptions }) {
  const form = useForm({
    escalated_to: "",
    admin_notes: complaint.admin_notes || ""
  });
  const escalateComplaint = (e) => {
    e.preventDefault();
    form.post(route("complaints.admin.escalate", complaint.id));
  };
  const resolveComplaint = (e) => {
    e.preventDefault();
    router.post(
      route("complaints.admin.resolve", complaint.id),
      { admin_notes: form.data.admin_notes },
      { preserveState: true, preserveScroll: true }
    );
  };
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(Head, { title: `Complaint: ${complaint.subject}` }),
    /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-3xl", children: [
      /* @__PURE__ */ jsx("div", { className: "mb-4", children: /* @__PURE__ */ jsx(
        "a",
        {
          href: route("complaints.admin.index"),
          className: "text-sm font-medium text-sky-600 hover:text-sky-800",
          children: "← Back to Complaints"
        }
      ) }),
      /* @__PURE__ */ jsxs("div", { className: "rounded-lg border border-zinc-100 bg-white p-6 shadow-sm", children: [
        /* @__PURE__ */ jsxs("div", { className: "mb-6 flex flex-wrap items-start justify-between gap-3", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h1", { className: "text-lg font-semibold text-zinc-950", children: complaint.subject }),
            /* @__PURE__ */ jsxs("p", { className: "mt-1 text-sm text-zinc-500", children: [
              "Submitted",
              " ",
              complaint.created_at
            ] })
          ] }),
          /* @__PURE__ */ jsx(
            "span",
            {
              className: `inline-flex rounded-full border px-3 py-1 text-xs font-medium capitalize ${STATUS_STYLES[complaint.status] || "bg-zinc-100 text-zinc-600"}`,
              children: complaint.status.replace("_", " ")
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "mb-6 grid grid-cols-2 gap-4 rounded-lg bg-zinc-50 p-4 text-sm", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("span", { className: "font-medium text-zinc-700", children: "Student:" }),
            " ",
            /* @__PURE__ */ jsx("span", { className: "text-zinc-600", children: complaint.student?.name ?? "N/A" })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("span", { className: "font-medium text-zinc-700", children: "Admission No:" }),
            " ",
            /* @__PURE__ */ jsx("span", { className: "text-zinc-600", children: complaint.student?.admission_number ?? "N/A" })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("span", { className: "font-medium text-zinc-700", children: "Email:" }),
            " ",
            /* @__PURE__ */ jsx("span", { className: "text-zinc-600", children: complaint.student?.email ?? "N/A" })
          ] }),
          complaint.escalated_to && /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("span", { className: "font-medium text-zinc-700", children: "Escalated To:" }),
            " ",
            /* @__PURE__ */ jsxs("span", { className: "text-zinc-600", children: [
              complaint.escalated_to.name,
              " (",
              complaint.escalated_to.designation,
              " -",
              " ",
              complaint.escalated_to.department,
              ")"
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "mb-6", children: [
          /* @__PURE__ */ jsx("h2", { className: "mb-2 text-sm font-semibold text-zinc-700", children: "Description" }),
          /* @__PURE__ */ jsx("p", { className: "whitespace-pre-wrap rounded-lg border border-zinc-200 bg-white p-4 text-sm text-zinc-600", children: complaint.description })
        ] }),
        complaint.admin_notes && /* @__PURE__ */ jsxs("div", { className: "mb-6", children: [
          /* @__PURE__ */ jsx("h2", { className: "mb-2 text-sm font-semibold text-zinc-700", children: "Admin Notes" }),
          /* @__PURE__ */ jsx("p", { className: "whitespace-pre-wrap rounded-lg border border-zinc-200 bg-zinc-50 p-4 text-sm text-zinc-600", children: complaint.admin_notes })
        ] }),
        complaint.status !== "resolved" && /* @__PURE__ */ jsxs("div", { className: "border-t border-zinc-100 pt-6", children: [
          /* @__PURE__ */ jsx("h2", { className: "mb-4 text-sm font-semibold text-zinc-700", children: "Actions" }),
          /* @__PURE__ */ jsxs("form", { onSubmit: escalateComplaint, className: "mb-4", children: [
            /* @__PURE__ */ jsxs("div", { className: "mb-3", children: [
              /* @__PURE__ */ jsx(InputLabel, { value: "Escalate to Responsible Person" }),
              /* @__PURE__ */ jsxs(
                "select",
                {
                  value: form.data.escalated_to,
                  onChange: (e) => form.setData(
                    "escalated_to",
                    e.target.value
                  ),
                  className: "mt-1 w-full rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100",
                  children: [
                    /* @__PURE__ */ jsx("option", { value: "", children: "Select staff member..." }),
                    staffOptions.map((staff) => /* @__PURE__ */ jsx(
                      "option",
                      {
                        value: staff.value,
                        children: staff.label
                      },
                      staff.value
                    ))
                  ]
                }
              ),
              /* @__PURE__ */ jsx(
                InputError,
                {
                  message: form.errors.escalated_to
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "mb-3", children: [
              /* @__PURE__ */ jsx(InputLabel, { value: "Admin Notes" }),
              /* @__PURE__ */ jsx(
                TextArea,
                {
                  value: form.data.admin_notes,
                  onChange: (e) => form.setData(
                    "admin_notes",
                    e.target.value
                  ),
                  className: "mt-1 w-full",
                  rows: 3,
                  placeholder: "Add notes about this escalation..."
                }
              ),
              /* @__PURE__ */ jsx(
                InputError,
                {
                  message: form.errors.admin_notes
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
              /* @__PURE__ */ jsx(
                PrimaryButton,
                {
                  disabled: form.processing || !form.data.escalated_to,
                  children: "Escalate"
                }
              ),
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  onClick: resolveComplaint,
                  className: "rounded-lg border border-emerald-300 bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700 hover:bg-emerald-100",
                  children: "Mark as Resolved"
                }
              )
            ] })
          ] })
        ] })
      ] })
    ] })
  ] });
}
export {
  AdminShow as default
};
