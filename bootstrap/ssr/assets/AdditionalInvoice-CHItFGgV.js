import { jsxs, jsx } from "react/jsx-runtime";
import { P as PrimaryButton } from "./PrimaryButton-DsDrFqHJ.js";
import { useForm } from "@inertiajs/react";
import FormScaffold from "./FormScaffold-B_tTLrQJ.js";
import { TextField, NativeSelectField, TextAreaField } from "./Fields-OQdD82hf.js";
import "./InputError-CBvD_6aD.js";
import "./InputLabel-DlDnrkJG.js";
import "react";
import "ziggy-js";
import "./TextArea-DrH8CNbm.js";
import "./TextInput-DsoSnibl.js";
const today = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
const plusDays = (days) => new Date(Date.now() + days * 24 * 60 * 60 * 1e3).toISOString().split("T")[0];
function AdditionalInvoice({
  selectedAdmissionNumber,
  selectedInvoiceKind = "standard_invoice",
  form: externalForm,
  onSubmit: externalSubmit,
  onCancel,
  embedded = false
}) {
  const localForm = useForm({
    admission_number: selectedAdmissionNumber || "",
    invoice_kind: selectedInvoiceKind || "standard_invoice",
    description: "",
    amount: "",
    issue_date: today,
    due_date: plusDays(14)
  });
  const form = externalForm ?? localForm;
  const onSubmit = (e) => {
    e.preventDefault();
    form.post(route("billing.manual.invoices.store"), {
      preserveScroll: true
    });
  };
  const submitHandler = externalSubmit ?? onSubmit;
  const content = /* @__PURE__ */ jsxs(
    "form",
    {
      onSubmit: submitHandler,
      className: "rounded-[1.75rem] border border-zinc-200 bg-white p-6 shadow-[0_18px_48px_rgba(15,23,42,0.08)] sm:p-8",
      children: [
        /* @__PURE__ */ jsxs("div", { className: "grid gap-5 md:grid-cols-2 xl:grid-cols-3", children: [
          /* @__PURE__ */ jsx(
            TextField,
            {
              label: "Admission Number",
              required: true,
              type: "text",
              value: form.data.admission_number,
              onChange: (e) => form.setData("admission_number", e.target.value),
              error: form.errors.admission_number,
              placeholder: "TVET/2026/001",
              className: "h-11"
            }
          ),
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
              error: form.errors.amount,
              placeholder: "0.00",
              className: "h-11"
            }
          ),
          /* @__PURE__ */ jsx(
            NativeSelectField,
            {
              label: "Invoice Type",
              required: true,
              value: form.data.invoice_kind,
              onChange: (value) => form.setData("invoice_kind", value),
              error: form.errors.invoice_kind,
              options: [
                {
                  value: "standard_invoice",
                  label: "Standard Invoice"
                },
                { value: "penalty", label: "Penalty" },
                { value: "hostel", label: "Hostel Invoice" },
                {
                  value: "invoice_adjustment",
                  label: "Invoice Adjustment"
                }
              ]
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
              error: form.errors.issue_date,
              className: "h-11"
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
              error: form.errors.due_date,
              className: "h-11"
            }
          )
        ] }),
        /* @__PURE__ */ jsx("div", { className: "mt-5", children: /* @__PURE__ */ jsx(
          TextAreaField,
          {
            label: "Description",
            required: true,
            rows: 5,
            value: form.data.description,
            onChange: (e) => form.setData("description", e.target.value),
            error: form.errors.description,
            placeholder: form.data.invoice_kind === "standard_invoice" ? "Graduation clearance fee" : form.data.invoice_kind === "hostel" ? "Sunrise Hostel boarding fee" : form.data.invoice_kind === "penalty" ? "Late registration penalty" : "Manual charge correction"
          }
        ) }),
        /* @__PURE__ */ jsxs("div", { className: "mt-6 flex flex-col gap-3 border-t border-zinc-100 pt-5 sm:flex-row sm:items-center sm:justify-end", children: [
          onCancel ? /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              onClick: onCancel,
              className: "rounded-xl border border-zinc-200 bg-white px-5 py-3 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50",
              children: "Cancel"
            }
          ) : null,
          /* @__PURE__ */ jsx(
            PrimaryButton,
            {
              disabled: form.processing,
              className: "justify-center rounded-xl bg-slate-900 px-6 py-3 text-sm normal-case tracking-normal",
              children: form.processing ? "Posting..." : "Post Charge"
            }
          )
        ] })
      ]
    }
  );
  if (embedded) {
    return content;
  }
  return /* @__PURE__ */ jsx(
    FormScaffold,
    {
      title: "Post Student Charge",
      description: "Post a charge to a student account.",
      backHref: route("billing.manual.index"),
      children: content
    }
  );
}
export {
  AdditionalInvoice as default
};
