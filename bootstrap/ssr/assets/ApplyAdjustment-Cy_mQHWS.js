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
function ApplyAdjustment({
  selectedAdmissionNumber,
  form: externalForm,
  onSubmit: externalSubmit,
  onCancel,
  embedded = false
}) {
  const localForm = useForm({
    admission_number: selectedAdmissionNumber || "",
    type: "discount",
    amount: "",
    description: "",
    applied_at: today,
    replacement_amount: "",
    replacement_description: ""
  });
  const form = externalForm ?? localForm;
  const onSubmit = (e) => {
    e.preventDefault();
    form.post(route("billing.manual.adjustments.store"), {
      preserveScroll: true
    });
  };
  const submitHandler = externalSubmit ?? onSubmit;
  const isReversal = form.data.type === "reversal";
  const isRefund = form.data.type === "refund";
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
            NativeSelectField,
            {
              label: "Adjustment Type",
              required: true,
              value: form.data.type,
              onChange: (value) => form.setData("type", value),
              error: form.errors.type,
              options: [
                { value: "discount", label: "Discount" },
                { value: "waiver", label: "Waiver" },
                { value: "bursary", label: "Bursary" },
                { value: "helb", label: "HELB" },
                { value: "refund", label: "Refund" },
                { value: "reversal", label: "Reversal" },
                { value: "other", label: "Other" }
              ]
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
            TextField,
            {
              label: "Applied Date",
              required: true,
              type: "date",
              value: form.data.applied_at,
              onChange: (e) => form.setData("applied_at", e.target.value),
              error: form.errors.applied_at,
              className: "h-11"
            }
          ),
          isReversal ? /* @__PURE__ */ jsx(
            TextField,
            {
              label: "Corrected Invoice Amount",
              type: "number",
              min: "0",
              step: "0.01",
              value: form.data.replacement_amount,
              onChange: (e) => form.setData("replacement_amount", e.target.value),
              error: form.errors.replacement_amount,
              placeholder: "40000",
              className: "h-11"
            }
          ) : null
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
            placeholder: isRefund ? "Cash refund issued to clear final student credit" : isReversal ? "Reverse wrong invoice amount entered as 4,000 instead of 40,000" : "Approved bursary support"
          }
        ) }),
        isReversal ? /* @__PURE__ */ jsx("div", { className: "mt-5", children: /* @__PURE__ */ jsx(
          TextField,
          {
            label: "Corrected Invoice Description",
            type: "text",
            value: form.data.replacement_description,
            onChange: (e) => form.setData(
              "replacement_description",
              e.target.value
            ),
            error: form.errors.replacement_description,
            placeholder: "Correct tuition invoice",
            className: "h-11"
          }
        ) }) : null,
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
              className: "justify-center rounded-xl bg-emerald-600 px-6 py-3 text-sm normal-case tracking-normal hover:bg-emerald-700",
              children: form.processing ? "Saving..." : isReversal ? "Apply Reversal" : "Apply Charge Reduction"
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
      title: "Reduce Student Charges",
      description: "Reduce or correct charges on a student account.",
      backHref: route("billing.manual.index"),
      children: content
    }
  );
}
export {
  ApplyAdjustment as default
};
