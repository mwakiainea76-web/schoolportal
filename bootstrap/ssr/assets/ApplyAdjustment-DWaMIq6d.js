import { jsx } from "react/jsx-runtime";
import { useForm } from "@inertiajs/react";
import FormScaffold from "./FormScaffold-DVDfp30V.js";
import ApplyAdjustmentForm from "./ApplyAdjustmentForm-B6aG1e3T.js";
import "./PrimaryButton-DsDrFqHJ.js";
import "./Fields-CKoWvqxo.js";
import "./InputError-CBvD_6aD.js";
import "./InputLabel-DlDnrkJG.js";
import "react";
import "ziggy-js";
import "./TextArea-DrH8CNbm.js";
import "./TextInput-DsoSnibl.js";
const today = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
function ApplyAdjustment({ selectedAdmissionNumber }) {
  const form = useForm({
    admission_number: selectedAdmissionNumber || "",
    type: "discount",
    amount: "",
    description: "",
    applied_at: today,
    replacement_amount: "",
    replacement_description: ""
  });
  const onSubmit = (e) => {
    e.preventDefault();
    form.post(route("billing.manual.adjustments.store"), {
      preserveScroll: true
    });
  };
  return /* @__PURE__ */ jsx(
    FormScaffold,
    {
      title: "Reduce Student Charges",
      description: "Use this form for waivers, bursaries, HELB, refunds, and reversals that reduce or correct what the student owes. It is not for posting payments.",
      backHref: route("billing.manual.index"),
      children: /* @__PURE__ */ jsx("div", { className: "max-w-4xl rounded-[1.75rem] border border-zinc-100 bg-white p-6 shadow-sm", children: /* @__PURE__ */ jsx(ApplyAdjustmentForm, { form: { ...form, onSubmit } }) })
    }
  );
}
export {
  ApplyAdjustment as default
};
