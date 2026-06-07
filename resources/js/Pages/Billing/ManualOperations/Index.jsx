import { Link, useForm } from "@inertiajs/react";
import { useState } from "react";
import { CreditCard, FilePlus2, Wallet } from "lucide-react";
import Modal from "@/Components/Modal";
import FormScaffold from "./FormScaffold";
import ActionCard from "./ActionCard";
import AdditionalInvoiceForm from "./AdditionalInvoiceForm";
import ApplyAdjustmentForm from "./ApplyAdjustmentForm";
import RecordPaymentForm from "./RecordPaymentForm";

const today = new Date().toISOString().split("T")[0];
const plusDays = (days) =>
    new Date(Date.now() + days * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0];

export default function Index({ selectedAdmissionNumber = "" }) {
    const [activeModal, setActiveModal] = useState(null);
    const openModal = (name) => setActiveModal(name);
    const closeModal = () => setActiveModal(null);

    const invoiceForm = useForm({
        admission_number: selectedAdmissionNumber || "",
        invoice_kind: "standard_invoice",
        description: "",
        amount: "",
        issue_date: today,
        due_date: plusDays(14),
    });
    const paymentForm = useForm({
        admission_number: selectedAdmissionNumber || "",
        amount: "",
        method: "mpesa",
        reference: "",
        payment_date: today,
        notes: "",
    });
    const adjustmentForm = useForm({
        admission_number: selectedAdmissionNumber || "",
        type: "discount",
        amount: "",
        description: "",
        applied_at: today,
        replacement_amount: "",
        replacement_description: "",
    });
    const submitInvoiceForm = (e) => {
        e.preventDefault();
        invoiceForm.post(route("billing.manual.invoices.store"), {
            preserveScroll: true,
            onSuccess: () => {
                closeModal();
                invoiceForm.reset("description", "amount", "issue_date", "due_date");
                invoiceForm.setData("admission_number", selectedAdmissionNumber || "");
                invoiceForm.setData("invoice_kind", "standard_invoice");
                invoiceForm.setData("issue_date", today);
                invoiceForm.setData("due_date", plusDays(14));
            },
        });
    };

    const submitPaymentForm = (e) => {
        e.preventDefault();
        paymentForm.post(route("billing.manual.payments.store"), {
            preserveScroll: true,
            onSuccess: () => {
                closeModal();
                paymentForm.reset("amount", "reference", "notes");
                paymentForm.setData("admission_number", selectedAdmissionNumber || "");
                paymentForm.setData("method", "mpesa");
                payment_form.setData("payment_date", today);
            },
        });
    };

    const submitAdjustmentForm = (e) => {
        e.preventDefault();
        adjustmentForm.post(route("billing.manual.adjustments.store"), {
            preserveScroll: true,
            onSuccess: () => {
                closeModal();
                adjustmentForm.reset("amount", "description", "replacement_amount", "replacement_description");
                adjustmentForm.setData("admission_number", selectedAdmissionNumber || "");
                adjustmentForm.setData("type", "discount");
                adjustmentForm.setData("applied_at", today);
            },
        });
    };

    return (
        <FormScaffold
            title="Manual Billing"
            description="Pick whether you are charging the student account, recording a payment, or reducing existing charges."
            backHref={route("billing.invoices.index")}
            backLabel="Back to invoices"
        >
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                <ActionCard
                    onClick={() => openModal("invoice")}
                    icon={FilePlus2}
                    imageSrc="/images/manual-billing-invoice.svg"
                    imageAlt="Additional invoice"
                    title="Post Student Charge"
                    description="Increase the student account with a standard invoice, penalty, hostel invoice, or invoice adjustment."
                />
                <ActionCard
                    onClick={() => openModal("payment")}
                    icon={CreditCard}
                    imageSrc="/images/manual-billing-payment.svg"
                    imageAlt="Record payment"
                    title="Record Payment"
                    description="Post a payment."
                />
                <ActionCard
                    onClick={() => openModal("adjustment")}
                    icon={Wallet}
                    imageSrc="/images/manual-billing-adjustment.svg"
                    imageAlt="Reduce student charges"
                    title="Reduce Student Charges"
                    description="Apply waivers, bursaries, HELB support, refunds, or reversals without posting a payment."
                />
            </div>

            <div className="rounded-[1.75rem] border border-zinc-100 bg-white p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-zinc-900">
                    Quick Notes
                </h2>
                <div className="mt-4 space-y-3 text-sm text-zinc-600">
                    <p>Student charges increase what the student owes, including hostel prepayment invoices.</p>
                    <p>Payments add credits.</p>
                    <p>Charge reductions lower or correct existing student charges.</p>
                    <p>Use reversals to correct mistakes and corrected invoices to reissue the right charge.</p>
                    <p>Refunds only apply to cleared overpayments.</p>
                </div>

                <div className="mt-5">
                    <Link
                        href={route("billing.ledger.index")}
                        className="text-sm font-medium text-emerald-700 transition hover:text-emerald-800"
                    >
                        View financial ledger
                    </Link>
                </div>
            </div>

            <Modal
                show={activeModal === "invoice"}
                onClose={closeModal}
                maxWidth="xl"
                align="top"
            >
                <div className="p-6">
                    <h2 className="text-2xl font-bold tracking-tight text-zinc-900">
                        Post Student Charge
                    </h2>
                    <p className="mt-1 text-sm text-zinc-500">This action increases the student account.</p>
                    <div className="mt-6">
                        <AdditionalInvoiceForm form={{ ...invoiceForm, onSubmit: submitInvoiceForm }} onCancel={closeModal} />
                    </div>
                </div>
            </Modal>

            <Modal
                show={activeModal === "payment"}
                onClose={closeModal}
                maxWidth="xl"
                align="top"
            >
                <div className="p-6">
                    <h2 className="text-2xl font-bold tracking-tight text-zinc-900">
                        Record Payment
                    </h2>
                    <p className="mt-1 text-sm text-zinc-500">Post a payment.</p>
                    <div className="mt-6">
                        <RecordPaymentForm form={{ ...paymentForm, onSubmit: submitPaymentForm }} onCancel={closeModal} />
                    </div>
                </div>
            </Modal>

            <Modal
                show={activeModal === "adjustment"}
                onClose={closeModal}
                maxWidth="xl"
                align="top"
            >
                <div className="p-6">
                    <h2 className="text-2xl font-bold tracking-tight text-zinc-900">
                        Reduce Student Charges
                    </h2>
                    <p className="mt-1 text-sm text-zinc-500">Use approved credits or reversals to reduce or correct charges, not to record payments.</p>
                    <div className="mt-6">
                        <ApplyAdjustmentForm form={{ ...adjustmentForm, onSubmit: submitAdjustmentForm }} onCancel={closeModal} />
                    </div>
                </div>
            </Modal>

        </FormScaffold>
    );
}
