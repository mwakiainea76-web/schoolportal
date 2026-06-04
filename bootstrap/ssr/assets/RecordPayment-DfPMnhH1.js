import { jsx } from "react/jsx-runtime";
import { useForm } from "@inertiajs/react";
import FormScaffold from "./FormScaffold-pJj3vvjR.js";
import RecordPaymentForm from "./RecordPaymentForm-B5ZnjX-E.js";
import "../app.js";
import "axios";
import "react";
import "lucide-react";
import "react-toastify";
import "react-dom/client";
import "./PrimaryButton-DsDrFqHJ.js";
import "./Fields-CKoWvqxo.js";
import "./InputError-CBvD_6aD.js";
import "./InputLabel-DlDnrkJG.js";
import "ziggy-js";
import "./TextArea-DrH8CNbm.js";
import "./TextInput-DsoSnibl.js";
const today = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
function RecordPayment({ selectedRegistrationNumber }) {
  const form = useForm({
    registration_number: selectedRegistrationNumber || "",
    amount: "",
    method: "mpesa",
    reference: "",
    payment_date: today,
    notes: ""
  });
  const onSubmit = (e) => {
    e.preventDefault();
    form.post(route("billing.manual.payments.store"), {
      preserveScroll: true
    });
  };
  return /* @__PURE__ */ jsx(
    FormScaffold,
    {
      title: "Record Payment",
      description: "Post a receipt against an invoice and reduce the student balance.",
      backHref: route("billing.manual.index"),
      children: /* @__PURE__ */ jsx("div", { className: "max-w-4xl rounded-[1.75rem] border border-zinc-100 bg-white p-6 shadow-sm", children: /* @__PURE__ */ jsx(RecordPaymentForm, { form: { ...form, onSubmit } }) })
    }
  );
}
export {
  RecordPayment as default
};
