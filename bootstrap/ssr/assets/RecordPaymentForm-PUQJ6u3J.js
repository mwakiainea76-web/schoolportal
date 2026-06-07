import { jsxs, jsx } from "react/jsx-runtime";
import { P as PrimaryButton } from "./PrimaryButton-DsDrFqHJ.js";
import { TextField, NativeSelectField, TextAreaField } from "./Fields-CKoWvqxo.js";
import "./InputError-CBvD_6aD.js";
import "./InputLabel-DlDnrkJG.js";
import "react";
import "ziggy-js";
import "./TextArea-DrH8CNbm.js";
import "./TextInput-DsoSnibl.js";
function RecordPaymentForm({
  form,
  submitLabel = "Record Payment",
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
    /* @__PURE__ */ jsx("p", { className: "-mt-2 text-sm text-zinc-500", children: "Applies to the latest outstanding invoice." }),
    /* @__PURE__ */ jsxs("div", { className: "grid gap-5 md:grid-cols-2", children: [
      /* @__PURE__ */ jsx(
        TextField,
        {
          label: "Amount Received",
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
        NativeSelectField,
        {
          label: "Payment Method",
          required: true,
          value: form.data.method,
          onChange: (value) => form.setData("method", value),
          error: form.errors.method,
          options: [
            { value: "mpesa", label: "M-Pesa" },
            { value: "bank", label: "Bank" },
            { value: "cash", label: "Cash" },
            { value: "card", label: "Card" },
            { value: "cheque", label: "Cheque" },
            { value: "other", label: "Other" }
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid gap-5 md:grid-cols-2", children: [
      /* @__PURE__ */ jsx(
        TextField,
        {
          label: "Reference",
          type: "text",
          value: form.data.reference,
          onChange: (e) => form.setData("reference", e.target.value),
          error: form.errors.reference,
          placeholder: "e.g. MPESA123ABC"
        }
      ),
      /* @__PURE__ */ jsx(
        TextField,
        {
          label: "Payment Date",
          required: true,
          type: "date",
          value: form.data.payment_date,
          onChange: (e) => form.setData("payment_date", e.target.value),
          error: form.errors.payment_date
        }
      )
    ] }),
    /* @__PURE__ */ jsx(
      TextAreaField,
      {
        label: "Notes",
        rows: 4,
        value: form.data.notes,
        onChange: (e) => form.setData("notes", e.target.value),
        error: form.errors.notes,
        placeholder: "Optional payment note"
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
          className: "bg-slate-700 px-6 py-3 text-sm normal-case tracking-normal",
          children: submitLabel
        }
      )
    ] })
  ] });
}
export {
  RecordPaymentForm as default
};
