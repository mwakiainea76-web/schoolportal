import { useForm } from "@inertiajs/react";
import FormScaffold from "./FormScaffold";
import ApplyAdjustmentForm from "./ApplyAdjustmentForm";

const today = new Date().toISOString().split("T")[0];

export default function ApplyAdjustment({ selectedAdmissionNumber }) {
    const form = useForm({
        admission_number: selectedAdmissionNumber || "",
        type: "discount",
        amount: "",
        description: "",
        applied_at: today,
        replacement_amount: "",
        replacement_description: "",
    });

    const onSubmit = (e) => {
        e.preventDefault();
        form.post(route("billing.manual.adjustments.store"), {
            preserveScroll: true,
        });
    };

    return (
        <FormScaffold
            title="Reduce Student Charges"
            description="Reduce or correct charges on a student account."
            backHref={route("billing.manual.index")}
        >
            <ApplyAdjustmentForm form={{ ...form, onSubmit }} />
        </FormScaffold>
    );
}
