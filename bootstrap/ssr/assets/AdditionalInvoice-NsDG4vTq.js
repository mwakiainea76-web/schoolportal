import { jsx } from "react/jsx-runtime";
import { useForm } from "@inertiajs/react";
import FormScaffold from "./FormScaffold-BfIBnlBD.js";
import AdditionalInvoiceForm from "./AdditionalInvoiceForm-DiHfGv3A.js";
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
const plusDays = (days) => new Date(Date.now() + days * 24 * 60 * 60 * 1e3).toISOString().split("T")[0];
function AdditionalInvoice({
  selectedRegistrationNumber,
  selectedInvoiceKind = "standard_invoice"
}) {
  const form = useForm({
    registration_number: selectedRegistrationNumber || "",
    invoice_kind: selectedInvoiceKind || "standard_invoice",
    description: "",
    amount: "",
    issue_date: today,
    due_date: plusDays(14)
  });
  const onSubmit = (e) => {
    e.preventDefault();
    form.post(route("billing.manual.invoices.store"), {
      preserveScroll: true
    });
  };
  return /* @__PURE__ */ jsx(
    FormScaffold,
    {
      title: "Post Student Charge",
      description: "This form increases the student account by posting a Standard Invoice, Penalty, or Invoice Adjustment.",
      backHref: route("billing.manual.index"),
      children: /* @__PURE__ */ jsx("div", { className: "max-w-4xl rounded-[1.75rem] border border-zinc-100 bg-white p-6 shadow-sm", children: /* @__PURE__ */ jsx(AdditionalInvoiceForm, { form: { ...form, onSubmit } }) })
    }
  );
}
export {
  AdditionalInvoice as default
};
