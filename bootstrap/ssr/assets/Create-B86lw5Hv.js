import { jsxs, Fragment, jsx } from "react/jsx-runtime";
import { useForm, Head, router } from "@inertiajs/react";
import { I as InputError } from "./InputError-CBvD_6aD.js";
import { I as InputLabel } from "./InputLabel-DlDnrkJG.js";
import { P as PrimaryButton } from "./PrimaryButton-DsDrFqHJ.js";
import { T as TextArea } from "./TextArea-DrH8CNbm.js";
import { T as TextInput } from "./TextInput-DsoSnibl.js";
import "react";
function Create() {
  const { data, setData, post, processing, errors } = useForm({
    subject: "",
    description: ""
  });
  const submit = (e) => {
    e.preventDefault();
    post(route("student.complaints.store"));
  };
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(Head, { title: "Submit Complaint" }),
    /* @__PURE__ */ jsxs("div", { className: "w-full", children: [
      /* @__PURE__ */ jsxs("div", { className: "mb-6", children: [
        /* @__PURE__ */ jsx("h1", { className: "text-lg font-semibold text-zinc-950", children: "Submit a Complaint" }),
        /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-zinc-500", children: "Describe your issue below. Admin will review and respond." })
      ] }),
      /* @__PURE__ */ jsxs(
        "form",
        {
          onSubmit: submit,
          className: "rounded-lg border border-zinc-100 bg-white p-6 shadow-sm",
          children: [
            /* @__PURE__ */ jsxs("div", { className: "space-y-5", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx(InputLabel, { value: "Subject", required: true }),
                /* @__PURE__ */ jsx(
                  TextInput,
                  {
                    value: data.subject,
                    onChange: (e) => setData("subject", e.target.value),
                    placeholder: "Brief title of your complaint",
                    className: "mt-1 w-full",
                    error: errors.subject
                  }
                ),
                /* @__PURE__ */ jsx(InputError, { message: errors.subject })
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx(InputLabel, { value: "Description", required: true }),
                /* @__PURE__ */ jsx(
                  TextArea,
                  {
                    value: data.description,
                    onChange: (e) => setData("description", e.target.value),
                    placeholder: "Describe your issue in detail...",
                    className: "mt-1 w-full",
                    rows: 6,
                    error: errors.description
                  }
                ),
                /* @__PURE__ */ jsx(InputError, { message: errors.description })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "mt-6 flex items-center gap-3 border-t border-zinc-100 pt-4", children: [
              /* @__PURE__ */ jsx(PrimaryButton, { disabled: processing, children: "Submit Complaint" }),
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  onClick: () => router.get(route("student.complaints.index")),
                  className: "rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-50",
                  children: "Cancel"
                }
              )
            ] })
          ]
        }
      )
    ] })
  ] });
}
export {
  Create as default
};
