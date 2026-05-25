import { jsxs, jsx } from "react/jsx-runtime";
import { useForm, Link } from "@inertiajs/react";
import { useState } from "react";
import { FilePlus2, CreditCard, Wallet } from "lucide-react";
import { M as Modal } from "./Modal-DzNit_Do.js";
import FormScaffold from "./FormScaffold-CmQIlIE5.js";
import ActionCard from "./ActionCard-BqjP59Fa.js";
import AdditionalInvoiceForm from "./AdditionalInvoiceForm-DiHfGv3A.js";
import ApplyAdjustmentForm from "./ApplyAdjustmentForm--k9NWWrx.js";
import RecordPaymentForm from "./RecordPaymentForm-B5ZnjX-E.js";
import "@headlessui/react";
import "./AuthenticatedLayout-DYCvRbZH.js";
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
function Index({ selectedRegistrationNumber = "" }) {
  const [activeModal, setActiveModal] = useState(null);
  const openModal = (name) => setActiveModal(name);
  const closeModal = () => setActiveModal(null);
  const invoiceForm = useForm({
    registration_number: selectedRegistrationNumber || "",
    invoice_kind: "standard_invoice",
    description: "",
    amount: "",
    issue_date: today,
    due_date: plusDays(14)
  });
  const paymentForm = useForm({
    registration_number: selectedRegistrationNumber || "",
    amount: "",
    method: "mpesa",
    reference: "",
    payment_date: today,
    notes: ""
  });
  const adjustmentForm = useForm({
    registration_number: selectedRegistrationNumber || "",
    type: "discount",
    amount: "",
    description: "",
    applied_at: today,
    replacement_amount: "",
    replacement_description: ""
  });
  const submitInvoiceForm = (e) => {
    e.preventDefault();
    invoiceForm.post(route("billing.manual.invoices.store"), {
      preserveScroll: true,
      onSuccess: () => {
        closeModal();
        invoiceForm.reset("description", "amount", "issue_date", "due_date");
        invoiceForm.setData("registration_number", selectedRegistrationNumber || "");
        invoiceForm.setData("invoice_kind", "standard_invoice");
        invoiceForm.setData("issue_date", today);
        invoiceForm.setData("due_date", plusDays(14));
      }
    });
  };
  const submitPaymentForm = (e) => {
    e.preventDefault();
    paymentForm.post(route("billing.manual.payments.store"), {
      preserveScroll: true,
      onSuccess: () => {
        closeModal();
        paymentForm.reset("amount", "reference", "notes");
        paymentForm.setData("registration_number", selectedRegistrationNumber || "");
        paymentForm.setData("method", "mpesa");
        paymentForm.setData("payment_date", today);
      }
    });
  };
  const submitAdjustmentForm = (e) => {
    e.preventDefault();
    adjustmentForm.post(route("billing.manual.adjustments.store"), {
      preserveScroll: true,
      onSuccess: () => {
        closeModal();
        adjustmentForm.reset("amount", "description", "replacement_amount", "replacement_description");
        adjustmentForm.setData("registration_number", selectedRegistrationNumber || "");
        adjustmentForm.setData("type", "discount");
        adjustmentForm.setData("applied_at", today);
      }
    });
  };
  return /* @__PURE__ */ jsxs(
    FormScaffold,
    {
      title: "Manual Billing",
      description: "Pick whether you are charging the student account, recording a payment, or reducing existing charges.",
      backHref: route("billing.invoices.index"),
      backLabel: "Back to invoices",
      children: [
        /* @__PURE__ */ jsxs("div", { className: "grid gap-6 md:grid-cols-2 xl:grid-cols-3", children: [
          /* @__PURE__ */ jsx(
            ActionCard,
            {
              onClick: () => openModal("invoice"),
              icon: FilePlus2,
              imageSrc: "/images/manual-billing-invoice.svg",
              imageAlt: "Additional invoice",
              title: "Post Student Charge",
              description: "Increase the student account with a standard invoice, penalty, hostel invoice, or invoice adjustment."
            }
          ),
          /* @__PURE__ */ jsx(
            ActionCard,
            {
              onClick: () => openModal("payment"),
              icon: CreditCard,
              imageSrc: "/images/manual-billing-payment.svg",
              imageAlt: "Record payment",
              title: "Record Payment",
              description: "Post a payment."
            }
          ),
          /* @__PURE__ */ jsx(
            ActionCard,
            {
              onClick: () => openModal("adjustment"),
              icon: Wallet,
              imageSrc: "/images/manual-billing-adjustment.svg",
              imageAlt: "Reduce student charges",
              title: "Reduce Student Charges",
              description: "Apply waivers, bursaries, HELB support, refunds, or reversals without posting a payment."
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "rounded-[1.75rem] border border-zinc-100 bg-white p-6 shadow-sm", children: [
          /* @__PURE__ */ jsx("h2", { className: "text-lg font-semibold text-zinc-900", children: "Quick Notes" }),
          /* @__PURE__ */ jsxs("div", { className: "mt-4 space-y-3 text-sm text-zinc-600", children: [
            /* @__PURE__ */ jsx("p", { children: "Student charges increase what the student owes, including hostel prepayment invoices." }),
            /* @__PURE__ */ jsx("p", { children: "Payments add credits." }),
            /* @__PURE__ */ jsx("p", { children: "Charge reductions lower or correct existing student charges." }),
            /* @__PURE__ */ jsx("p", { children: "Use reversals to correct mistakes and corrected invoices to reissue the right charge." }),
            /* @__PURE__ */ jsx("p", { children: "Refunds only apply to cleared overpayments." })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "mt-5", children: /* @__PURE__ */ jsx(
            Link,
            {
              href: route("billing.ledger.index"),
              className: "text-sm font-medium text-emerald-700 transition hover:text-emerald-800",
              children: "View financial ledger"
            }
          ) })
        ] }),
        /* @__PURE__ */ jsx(
          Modal,
          {
            show: activeModal === "invoice",
            onClose: closeModal,
            maxWidth: "xl",
            align: "top",
            children: /* @__PURE__ */ jsxs("div", { className: "p-6", children: [
              /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold tracking-tight text-zinc-900", children: "Post Student Charge" }),
              /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-zinc-500", children: "This action increases the student account." }),
              /* @__PURE__ */ jsx("div", { className: "mt-6", children: /* @__PURE__ */ jsx(AdditionalInvoiceForm, { form: { ...invoiceForm, onSubmit: submitInvoiceForm }, onCancel: closeModal }) })
            ] })
          }
        ),
        /* @__PURE__ */ jsx(
          Modal,
          {
            show: activeModal === "payment",
            onClose: closeModal,
            maxWidth: "xl",
            align: "top",
            children: /* @__PURE__ */ jsxs("div", { className: "p-6", children: [
              /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold tracking-tight text-zinc-900", children: "Record Payment" }),
              /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-zinc-500", children: "Post a payment." }),
              /* @__PURE__ */ jsx("div", { className: "mt-6", children: /* @__PURE__ */ jsx(RecordPaymentForm, { form: { ...paymentForm, onSubmit: submitPaymentForm }, onCancel: closeModal }) })
            ] })
          }
        ),
        /* @__PURE__ */ jsx(
          Modal,
          {
            show: activeModal === "adjustment",
            onClose: closeModal,
            maxWidth: "xl",
            align: "top",
            children: /* @__PURE__ */ jsxs("div", { className: "p-6", children: [
              /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold tracking-tight text-zinc-900", children: "Reduce Student Charges" }),
              /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-zinc-500", children: "Use approved credits or reversals to reduce or correct charges, not to record payments." }),
              /* @__PURE__ */ jsx("div", { className: "mt-6", children: /* @__PURE__ */ jsx(ApplyAdjustmentForm, { form: { ...adjustmentForm, onSubmit: submitAdjustmentForm }, onCancel: closeModal }) })
            ] })
          }
        )
      ]
    }
  );
}
export {
  Index as default
};
