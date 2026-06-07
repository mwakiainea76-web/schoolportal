import { useForm } from "@inertiajs/react";
import FormScaffold from "./FormScaffold";
import RecordPaymentForm from "./RecordPaymentForm";

const today = new Date().toISOString().split("T")[0];

export default function RecordPayment({ selectedAdmissionNumber }) {
    const form = useForm({
        admission_number: selectedAdmissionNumber || "",
        amount: "",
        method: "mpesa",
        reference: "",
        payment_date: today,
        notes: "",
    });

    const onSubmit = (e) => {
        e.preventDefault();
        form.post(route("billing.manual.payments.store"), {
            preserveScroll: true,
        });
    };

    return (
        <FormScaffold
            title="Record Payment"
            description="Post a receipt against an invoice and reduce the student balance."
            backHref={route("billing.manual.index")}
        >
            <div className="max-w-4xl rounded-[1.75rem] border border-zinc-100 bg-white p-6 shadow-sm">
                <RecordPaymentForm form={{ ...form, onSubmit }} />
            </div>
        </FormScaffold>
    );
}
