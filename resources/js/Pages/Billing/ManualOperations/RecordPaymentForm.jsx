import PrimaryButton from "@/Components/PrimaryButton";
import { NativeSelectField, TextAreaField, TextField } from "./Fields";

export default function RecordPaymentForm({
    form,
    submitLabel = "Record Payment",
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
                Applies to the latest outstanding invoice.
            </p>

            <div className="grid gap-5 md:grid-cols-2">
                <TextField
                    label="Amount Received"
                    required
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.data.amount}
                    onChange={(e) => form.setData("amount", e.target.value)}
                    error={form.errors.amount}
                />
                <NativeSelectField
                    label="Payment Method"
                    required
                    value={form.data.method}
                    onChange={(value) => form.setData("method", value)}
                    error={form.errors.method}
                    options={[
                        { value: "mpesa", label: "M-Pesa" },
                        { value: "bank", label: "Bank" },
                        { value: "cash", label: "Cash" },
                        { value: "card", label: "Card" },
                        { value: "cheque", label: "Cheque" },
                        { value: "other", label: "Other" },
                    ]}
                />
            </div>

            <div className="grid gap-5 md:grid-cols-2">
                <TextField
                    label="Reference"
                    type="text"
                    value={form.data.reference}
                    onChange={(e) => form.setData("reference", e.target.value)}
                    error={form.errors.reference}
                    placeholder="e.g. MPESA123ABC"
                />
                <TextField
                    label="Payment Date"
                    required
                    type="date"
                    value={form.data.payment_date}
                    onChange={(e) =>
                        form.setData("payment_date", e.target.value)
                    }
                    error={form.errors.payment_date}
                />
            </div>

            <TextAreaField
                label="Notes"
                rows={4}
                value={form.data.notes}
                onChange={(e) => form.setData("notes", e.target.value)}
                error={form.errors.notes}
                placeholder="Optional payment note"
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
                    className="bg-slate-700 px-6 py-3 text-sm normal-case tracking-normal"
                >
                    {submitLabel}
                </PrimaryButton>
            </div>
        </form>
    );
}
