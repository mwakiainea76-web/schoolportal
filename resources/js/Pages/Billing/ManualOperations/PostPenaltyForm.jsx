import PrimaryButton from "@/Components/PrimaryButton";
import { TextAreaField, TextField } from "./Fields";

export default function PostPenaltyForm({
    form,
    submitLabel = "Post Penalty",
    onCancel,
}) {
    return (
        <form onSubmit={form.onSubmit} className="space-y-5">
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
                Posts to the latest outstanding invoice.
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

            <div className="flex items-center justify-between pt-2">
                <button
                    type="button"
                    onClick={onCancel}
                    className="rounded-xl bg-zinc-100 px-4 py-3 text-sm font-medium text-zinc-700 transition hover:bg-zinc-200"
                >
                    Cancel
                </button>
                <PrimaryButton
                    disabled={form.processing}
                    className="bg-amber-600 px-6 py-3 text-sm normal-case tracking-normal hover:bg-amber-700"
                >
                    {submitLabel}
                </PrimaryButton>
            </div>
        </form>
    );
}
