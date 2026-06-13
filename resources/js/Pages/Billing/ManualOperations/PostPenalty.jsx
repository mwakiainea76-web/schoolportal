import PrimaryButton from "@/Components/PrimaryButton";
import { useForm } from "@inertiajs/react";
import FormScaffold from "./FormScaffold";
import { TextAreaField, TextField } from "./Fields";

const today = new Date().toISOString().split("T")[0];

export default function PostPenalty({
    selectedAdmissionNumber,
    form: externalForm,
    onSubmit: externalSubmit,
    onCancel,
    embedded = false,
}) {
    const localForm = useForm({
        admission_number: selectedAdmissionNumber || "",
        amount: "",
        description: "",
        applied_at: today,
    });
    const form = externalForm ?? localForm;

    const onSubmit = (e) => {
        e.preventDefault();
        form.post(route("billing.manual.penalties.store"), {
            preserveScroll: true,
        });
    };

    const submitHandler = externalSubmit ?? onSubmit;
    const content = (
        <form onSubmit={submitHandler} className="space-y-5 rounded-[1.75rem] border border-zinc-200 bg-white p-6 shadow-[0_18px_48px_rgba(15,23,42,0.08)] sm:p-8">
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                <TextField
                    label="Student Admission Number"
                    required
                    type="text"
                    value={form.data.admission_number}
                    onChange={(e) =>
                        form.setData("admission_number", e.target.value)
                    }
                    error={form.errors.admission_number}
                    placeholder="e.g. TVET/2026/001"
                />

                <TextField
                    label="Penalty Amount"
                    required
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.data.amount}
                    onChange={(e) => form.setData("amount", e.target.value)}
                    error={form.errors.amount}
                />

                <TextField
                    label="Applied Date"
                    required
                    type="date"
                    value={form.data.applied_at}
                    onChange={(e) => form.setData("applied_at", e.target.value)}
                    error={form.errors.applied_at}
                />
            </div>

            <TextAreaField
                label="Reason"
                required
                rows={4}
                value={form.data.description}
                onChange={(e) => form.setData("description", e.target.value)}
                error={form.errors.description}
                placeholder="e.g. Late registration penalty"
            />

            <div className="flex flex-col gap-3 border-t border-zinc-100 pt-5 sm:flex-row sm:items-center sm:justify-end">
                {onCancel ? (
                    <button
                        type="button"
                        onClick={onCancel}
                        className="rounded-xl border border-zinc-200 bg-white px-5 py-3 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50"
                    >
                        Cancel
                    </button>
                ) : null}
                <PrimaryButton
                    disabled={form.processing}
                    className="justify-center rounded-xl bg-amber-600 px-6 py-3 text-sm normal-case tracking-normal hover:bg-amber-700"
                >
                    {form.processing ? "Posting..." : "Post Penalty"}
                </PrimaryButton>
            </div>
        </form>
    );

    if (embedded) {
        return content;
    }

    return (
        <FormScaffold
            title="Post Penalty"
            description="Add a penalty that increases the selected invoice balance."
            backHref={route("billing.manual.index")}
        >
            {content}
        </FormScaffold>
    );
}
