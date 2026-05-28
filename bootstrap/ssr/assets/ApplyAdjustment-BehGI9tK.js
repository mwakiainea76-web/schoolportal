import { jsx } from "react/jsx-runtime";
import { useForm } from "@inertiajs/react";
import FormScaffold from "./FormScaffold-BfIBnlBD.js";
import ApplyAdjustmentForm from "./ApplyAdjustmentForm--k9NWWrx.js";
import "./AuthenticatedLayout-Cmi-8zkq.js";
import "react";
import "lucide-react";
import "react-toastify";
import "./PrimaryButton-DsDrFqHJ.js";
import "./Fields-CKoWvqxo.js";
import "./InputError-CBvD_6aD.js";
import "./InputLabel-DlDnrkJG.js";
import "ziggy-js";
import "./TextArea-DrH8CNbm.js";
import "./TextInput-DsoSnibl.js";
const today = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
function ApplyAdjustment({ selectedRegistrationNumber }) {
  const form = useForm({
    registration_number: selectedRegistrationNumber || "",
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
