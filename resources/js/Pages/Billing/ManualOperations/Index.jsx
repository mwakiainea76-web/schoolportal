import { Link, useForm } from "@inertiajs/react";
import { useState } from "react";
import { CreditCard, FilePlus2, ShieldAlert, Wallet } from "lucide-react";
import Modal from "@/Components/Modal";
import FormScaffold from "./FormScaffold";
import ActionCard from "./ActionCard";
import AdditionalInvoiceForm from "./AdditionalInvoiceForm";
import ApplyAdjustmentForm from "./ApplyAdjustmentForm";
import PostPenaltyForm from "./PostPenaltyForm";
import RecordPaymentForm from "./RecordPaymentForm";

const today = new Date().toISOString().split("T")[0];
const plusDays = (days) =>
    new Date(Date.now() + days * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0];

export default function Index({ selectedRegistrationNumber = "" }) {
    const [activeModal, setActiveModal] = useState(null);
    const openModal = (name) => setActiveModal(name);
    const closeModal = () => setActiveModal(null);

    const invoiceForm = useForm({
        registration_number: selectedRegistrationNumber || "",
        description: "",
        amount: "",
        issue_date: today,
        due_date: plusDays(14),
    });
    const paymentForm = useForm({
        registration_number: selectedRegistrationNumber || "",
        amount: "",
        method: "mpesa",
        reference: "",
        payment_date: today,
        notes: "",
    });
    const penaltyForm = useForm({
        registration_number: selectedRegistrationNumber || "",
        amount: "",
        description: "",
        applied_at: today,
    });
    const adjustmentForm = useForm({
        registration_number: selectedRegistrationNumber || "",
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
                invoiceForm.setData("registration_number", selectedRegistrationNumber || "");
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
                paymentForm.setData("registration_number", selectedRegistrationNumber || "");
                paymentForm.setData("method", "mpesa");
                paymentForm.setData("payment_date", today);
            },
        });
    };

    const submitPenaltyForm = (e) => {
        e.preventDefault();
        penaltyForm.post(route("billing.manual.penalties.store"), {
            preserveScroll: true,
            onSuccess: () => {
                closeModal();
                penaltyForm.reset("amount", "description");
                penaltyForm.setData("registration_number", selectedRegistrationNumber || "");
                penaltyForm.setData("applied_at", today);
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
                adjustmentForm.setData("registration_number", selectedRegistrationNumber || "");
                adjustmentForm.setData("type", "discount");
                adjustmentForm.setData("applied_at", today);
            },
        });
    };

    return (
        <FormScaffold
            title="Manual Billing"
            description="Pick an action."
            backHref={route("billing.invoices.index")}
            backLabel="Back to invoices"
        >
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
                <ActionCard
                    onClick={() => openModal("invoice")}
                    icon={FilePlus2}
                    imageSrc="/images/manual-billing-invoice.svg"
                    imageAlt="Additional invoice"
                    title="Additional Invoice"
                    description="Add a charge."
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
                    onClick={() => openModal("penalty")}
                    icon={ShieldAlert}
                    imageSrc="/images/manual-billing-penalty.svg"
                    imageAlt="Post penalty"
                    title="Post Penalty"
                    description="Add a penalty."
                />
                <ActionCard
                    onClick={() => openModal("adjustment")}
                    icon={Wallet}
                    imageSrc="/images/manual-billing-adjustment.svg"
                    imageAlt="Fee adjustment"
                    title="Fee Adjustment"
                    description="Apply an adjustment."
                />
            </div>

            <div className="rounded-[1.75rem] border border-zinc-100 bg-white p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-zinc-900">
                    Quick Notes
                </h2>
                <div className="mt-4 space-y-3 text-sm text-zinc-600">
                    <p>Invoices add debits.</p>
                    <p>Payments add credits.</p>
                    <p>Penalties and adjustments keep the ledger intact.</p>
                    <p>Use reversals to correct mistakes.</p>
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
                        Additional Invoice
                    </h2>
                    <p className="mt-1 text-sm text-zinc-500">Add a charge.</p>
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
                show={activeModal === "penalty"}
                onClose={closeModal}
                maxWidth="xl"
                align="top"
            >
                <div className="p-6">
                    <h2 className="text-2xl font-bold tracking-tight text-zinc-900">
                        Post Penalty
                    </h2>
                    <p className="mt-1 text-sm text-zinc-500">Add a penalty.</p>
                    <div className="mt-6">
                        <PostPenaltyForm form={{ ...penaltyForm, onSubmit: submitPenaltyForm }} onCancel={closeModal} />
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
                        Fee Adjustment
                    </h2>
                    <p className="mt-1 text-sm text-zinc-500">Apply an adjustment.</p>
                    <div className="mt-6">
                        <ApplyAdjustmentForm form={{ ...adjustmentForm, onSubmit: submitAdjustmentForm }} onCancel={closeModal} />
                    </div>
                </div>
            </Modal>

        </FormScaffold>
    );
}
