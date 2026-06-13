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
            description="Post a payment to a student account."
            backHref={route("billing.manual.index")}
        >
            <RecordPaymentForm form={{ ...form, onSubmit }} />
        </FormScaffold>
    );
}
