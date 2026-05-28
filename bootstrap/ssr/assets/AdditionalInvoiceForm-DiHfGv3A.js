import { jsxs, jsx } from "react/jsx-runtime";
import { P as PrimaryButton } from "./PrimaryButton-DsDrFqHJ.js";
import { TextField, NativeSelectField, TextAreaField } from "./Fields-CKoWvqxo.js";
import "./InputError-CBvD_6aD.js";
import "./InputLabel-DlDnrkJG.js";
import "react";
import "ziggy-js";
import "./TextArea-DrH8CNbm.js";
import "./TextInput-DsoSnibl.js";
function AdditionalInvoiceForm({
  form,
  submitLabel = "Issue Additional Invoice",
  onCancel
}) {
  return /* @__PURE__ */ jsxs("form", { onSubmit: form.onSubmit, className: "space-y-5", children: [
    /* @__PURE__ */ jsx("div", { className: "rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900", children: "This action charges the student account. Use it only when you intend to increase what the student owes for the selected session." }),
    /* @__PURE__ */ jsx(
      TextField,
      {
        label: "Student Registration Number",
        required: true,
        type: "text",
        value: form.data.registration_number,
        onChange: (e) => form.setData("registration_number", e.target.value),
        error: form.errors.registration_number,
        placeholder: "e.g. TVET/2026/001"
      }
    ),
    /* @__PURE__ */ jsx("p", { className: "-mt-2 text-sm text-zinc-500", children: "Uses the student's latest session enrollment." }),
    /* @__PURE__ */ jsx(
      NativeSelectField,
      {
        label: "Charge Class",
        required: true,
        value: form.data.invoice_kind,
        onChange: (value) => form.setData("invoice_kind", value),
        error: form.errors.invoice_kind,
        options: [
          { value: "standard_invoice", label: "Standard Invoice" },
          { value: "penalty", label: "Penalty" },
          { value: "hostel", label: "Hostel Invoice" },
          { value: "invoice_adjustment", label: "Invoice Adjustment" }
        ]
      }
    ),
    /* @__PURE__ */ jsx(
      TextAreaField,
      {
        label: "Charge Description",
        required: true,
        rows: 4,
        value: form.data.description,
        onChange: (e) => form.setData("description", e.target.value),
        error: form.errors.description,
        placeholder: form.data.invoice_kind === "standard_invoice" ? "e.g. Graduation clearance fee" : form.data.invoice_kind === "hostel" ? "e.g. Sunrise Hostel boarding fee" : "e.g. Late registration"
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "grid gap-5 md:grid-cols-3", children: [
      /* @__PURE__ */ jsx(
        TextField,
        {
          label: "Amount",
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
          label: "Issue Date",
          required: true,
          type: "date",
          value: form.data.issue_date,
          onChange: (e) => form.setData("issue_date", e.target.value),
          error: form.errors.issue_date
        }
      ),
      /* @__PURE__ */ jsx(
        TextField,
        {
          label: "Due Date",
          required: true,
          type: "date",
          value: form.data.due_date,
          onChange: (e) => form.setData("due_date", e.target.value),
          error: form.errors.due_date
        }
      )
    ] }),
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
  AdditionalInvoiceForm as default
};
