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
function RecordPayment({
  selectedAdmissionNumber,
  form: externalForm,
  onSubmit: externalSubmit,
  onCancel,
  embedded = false
}) {
  const localForm = useForm({
    admission_number: selectedAdmissionNumber || "",
    amount: "",
    method: "mpesa",
    reference: "",
    payment_date: today,
    notes: ""
  });
  const form = externalForm ?? localForm;
  const onSubmit = (e) => {
    e.preventDefault();
    form.post(route("billing.manual.payments.store"), {
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
          ),
          /* @__PURE__ */ jsx(
            TextField,
            {
              label: "Payment Date",
              required: true,
              type: "date",
              value: form.data.payment_date,
              onChange: (e) => form.setData("payment_date", e.target.value),
              error: form.errors.payment_date,
              className: "h-11"
            }
          ),
          /* @__PURE__ */ jsx(
            TextField,
            {
              label: "Reference",
              type: "text",
              value: form.data.reference,
              onChange: (e) => form.setData("reference", e.target.value),
              error: form.errors.reference,
              placeholder: "MPESA123ABC",
              className: "h-11"
            }
          )
        ] }),
        /* @__PURE__ */ jsx("div", { className: "mt-5", children: /* @__PURE__ */ jsx(
          TextAreaField,
          {
            label: "Note",
            rows: 5,
            value: form.data.notes,
            onChange: (e) => form.setData("notes", e.target.value),
            error: form.errors.notes,
            placeholder: "Optional note"
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
              children: form.processing ? "Recording..." : "Record Payment"
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
      title: "Record Payment",
      description: "Post a payment to a student account.",
      backHref: route("billing.manual.index"),
      children: content
    }
  );
}
export {
  RecordPayment as default
};
