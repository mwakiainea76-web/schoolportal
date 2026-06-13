import { jsxs, jsx } from "react/jsx-runtime";
import { P as PrimaryButton } from "./PrimaryButton-DsDrFqHJ.js";
import { useForm } from "@inertiajs/react";
import FormScaffold from "./FormScaffold-B_tTLrQJ.js";
import { TextField, TextAreaField } from "./Fields-OQdD82hf.js";
import "./InputError-CBvD_6aD.js";
import "./InputLabel-DlDnrkJG.js";
import "react";
import "ziggy-js";
import "./TextArea-DrH8CNbm.js";
import "./TextInput-DsoSnibl.js";
const today = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
function PostPenalty({
  selectedAdmissionNumber,
  form: externalForm,
  onSubmit: externalSubmit,
  onCancel,
  embedded = false
}) {
  const localForm = useForm({
    admission_number: selectedAdmissionNumber || "",
    amount: "",
    description: "",
    applied_at: today
  });
  const form = externalForm ?? localForm;
  const onSubmit = (e) => {
    e.preventDefault();
    form.post(route("billing.manual.penalties.store"), {
      preserveScroll: true
    });
  };
  const submitHandler = externalSubmit ?? onSubmit;
  const content = /* @__PURE__ */ jsxs("form", { onSubmit: submitHandler, className: "space-y-5 rounded-[1.75rem] border border-zinc-200 bg-white p-6 shadow-[0_18px_48px_rgba(15,23,42,0.08)] sm:p-8", children: [
    /* @__PURE__ */ jsxs("div", { className: "grid gap-5 md:grid-cols-2 xl:grid-cols-3", children: [
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
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-3 border-t border-zinc-100 pt-5 sm:flex-row sm:items-center sm:justify-end", children: [
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
          className: "justify-center rounded-xl bg-amber-600 px-6 py-3 text-sm normal-case tracking-normal hover:bg-amber-700",
          children: form.processing ? "Posting..." : "Post Penalty"
        }
      )
    ] })
  ] });
  if (embedded) {
    return content;
  }
  return /* @__PURE__ */ jsx(
    FormScaffold,
    {
      title: "Post Penalty",
      description: "Add a penalty that increases the selected invoice balance.",
      backHref: route("billing.manual.index"),
      children: content
    }
  );
}
export {
  PostPenalty as default
};
