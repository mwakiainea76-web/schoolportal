import { useForm } from "@inertiajs/react";
import FormScaffold from "./FormScaffold";
import ApplyAdjustmentForm from "./ApplyAdjustmentForm";

const today = new Date().toISOString().split("T")[0];

export default function ApplyAdjustment({ selectedRegistrationNumber }) {
    const form = useForm({
        registration_number: selectedRegistrationNumber || "",
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
            description="Use this form for waivers, bursaries, HELB, refunds, and reversals that reduce or correct what the student owes. It is not for posting payments."
            backHref={route("billing.manual.index")}
        >
            <div className="max-w-4xl rounded-[1.75rem] border border-zinc-100 bg-white p-6 shadow-sm">
                <ApplyAdjustmentForm form={{ ...form, onSubmit }} />
            </div>
        </FormScaffold>
    );
}
