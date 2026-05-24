import PrimaryButton from "@/Components/PrimaryButton";
import { TextAreaField, TextField } from "./Fields";

export default function AdditionalInvoiceForm({
    form,
    submitLabel = "Issue Additional Invoice",
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
                Uses the student&apos;s latest session enrollment.
            </p>

            <TextAreaField
                label="Charge Description"
                required
                rows={4}
                value={form.data.description}
                onChange={(e) => form.setData("description", e.target.value)}
                error={form.errors.description}
                placeholder="e.g. Graduation clearance fee"
            />

            <div className="grid gap-5 md:grid-cols-3">
                <TextField
                    label="Amount"
                    required
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.data.amount}
                    onChange={(e) => form.setData("amount", e.target.value)}
                    error={form.errors.amount}
                />
                <TextField
                    label="Issue Date"
                    required
                    type="date"
                    value={form.data.issue_date}
                    onChange={(e) => form.setData("issue_date", e.target.value)}
                    error={form.errors.issue_date}
                />
                <TextField
                    label="Due Date"
                    required
                    type="date"
                    value={form.data.due_date}
                    onChange={(e) => form.setData("due_date", e.target.value)}
                    error={form.errors.due_date}
                />
            </div>

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
                    className="bg-slate-700 px-6 py-3 text-sm normal-case tracking-normal"
                >
                    {submitLabel}
                </PrimaryButton>
            </div>
        </form>
    );
}
