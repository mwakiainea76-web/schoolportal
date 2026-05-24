import { useForm } from "@inertiajs/react";
import FormScaffold from "./FormScaffold";
import PostPenaltyForm from "./PostPenaltyForm";

const today = new Date().toISOString().split("T")[0];

export default function PostPenalty({ selectedRegistrationNumber }) {
    const form = useForm({
        registration_number: selectedRegistrationNumber || "",
        amount: "",
        description: "",
        applied_at: today,
    });

    const onSubmit = (e) => {
        e.preventDefault();
        form.post(route("billing.manual.penalties.store"), {
            preserveScroll: true,
        });
    };

    return (
        <FormScaffold
            title="Post Penalty"
            description="Add a penalty that increases the selected invoice balance."
            backHref={route("billing.manual.index")}
        >
            <div className="max-w-4xl rounded-[1.75rem] border border-zinc-100 bg-white p-6 shadow-sm">
                <PostPenaltyForm form={{ ...form, onSubmit }} />
            </div>
        </FormScaffold>
    );
}
