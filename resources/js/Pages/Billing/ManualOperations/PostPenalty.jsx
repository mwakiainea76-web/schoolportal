import { useForm } from "@inertiajs/react";
import PrimaryButton from "@/Components/PrimaryButton";
import FormScaffold from "./FormScaffold";
import { TextAreaField, TextField } from "./Fields";

const today = new Date().toISOString().split("T")[0];

export default function PostPenalty({ selectedRegistrationNumber }) {
    const form = useForm({
        registration_number: selectedRegistrationNumber || "",
        amount: "",
        description: "",
        applied_at: today,
    });

    const submit = (e) => {
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
                <form onSubmit={submit} className="space-y-5">
                    <TextField
                        label="Student Registration Number"
                        required
                        type="text"
                        value={form.data.registration_number}
                        onChange={(e) =>
                            form.setData("registration_number", e.target.value)
                        }
                        error={form.errors.registration_number}
                        placeholder="e.g. TVET/2026/001"
                    />
                    <p className="-mt-2 text-sm text-zinc-500">
                        The system will post the penalty to the student&apos;s latest
                        outstanding invoice automatically.
                    </p>

                    <div className="grid gap-5 md:grid-cols-2">
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
                            onChange={(e) =>
                                form.setData("applied_at", e.target.value)
                            }
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

                    <PrimaryButton
                        disabled={form.processing}
                        className="bg-amber-600 px-6 py-3 text-sm normal-case tracking-normal hover:bg-amber-700"
                    >
                        Post Penalty
                    </PrimaryButton>
                </form>
            </div>
        </FormScaffold>
    );
}
