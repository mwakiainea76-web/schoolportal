import { jsxs, jsx } from "react/jsx-runtime";
import { P as PrimaryButton } from "./PrimaryButton-DsDrFqHJ.js";
import { TextField, TextAreaField } from "./Fields-CKoWvqxo.js";
import "./InputError-CBvD_6aD.js";
import "./InputLabel-DlDnrkJG.js";
import "react";
import "ziggy-js";
import "./TextArea-DrH8CNbm.js";
import "./TextInput-DsoSnibl.js";
function PostPenaltyForm({
  form,
  submitLabel = "Post Penalty",
  onCancel
}) {
  return /* @__PURE__ */ jsxs("form", { onSubmit: form.onSubmit, className: "space-y-5", children: [
    /* @__PURE__ */ jsx(
      TextField,
      {
        label: "Student Admission Number",
        required: true,
        type: "text",
        value: form.data.admission_number,
        onChange: (e) => form.setData("admission_number", e.target.value),
        error: form.errors.admission_number,
        placeholder: "e.g. TVET/2026/001"
      }
    ),
    /* @__PURE__ */ jsx("p", { className: "-mt-2 text-sm text-zinc-500", children: "Posts to the latest outstanding invoice." }),
    /* @__PURE__ */ jsxs("div", { className: "grid gap-5 md:grid-cols-2", children: [
      /* @__PURE__ */ jsx(
        TextField,
        {
          label: "Penalty Amount",
          required: true,
          type: "number",
          min: "0",
          step: "0.01",
          value: form.data.amount,
          onChange: (e) => form.setData("amount", e.target.value),
          error: form.errors.amount
        }
      ),
      /* @__PURE__ */ jsx(
        TextField,
        {
          label: "Applied Date",
          required: true,
          type: "date",
          value: form.data.applied_at,
          onChange: (e) => form.setData("applied_at", e.target.value),
          error: form.errors.applied_at
        }
      )
    ] }),
    /* @__PURE__ */ jsx(
      TextAreaField,
      {
        label: "Reason",
        required: true,
        rows: 4,
        value: form.data.description,
        onChange: (e) => form.setData("description", e.target.value),
        error: form.errors.description,
        placeholder: "e.g. Late registration penalty"
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between pt-2", children: [
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          onClick: onCancel,
          className: "rounded-xl bg-zinc-100 px-4 py-3 text-sm font-medium text-zinc-700 transition hover:bg-zinc-200",
          children: "Cancel"
        }
      ),
      /* @__PURE__ */ jsx(
        PrimaryButton,
        {
          disabled: form.processing,
          className: "bg-amber-600 px-6 py-3 text-sm normal-case tracking-normal hover:bg-amber-700",
          children: submitLabel
        }
      )
    ] })
  ] });
}
export {
  PostPenaltyForm as default
};
