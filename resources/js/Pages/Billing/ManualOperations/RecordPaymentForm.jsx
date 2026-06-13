import PrimaryButton from "@/Components/PrimaryButton";
import { NativeSelectField, TextAreaField, TextField } from "./Fields";

export default function RecordPaymentForm({
    form,
    submitLabel = "Record Payment",
    onCancel,
}) {
    return (
        <form
            onSubmit={form.onSubmit}
            className="rounded-[1.75rem] border border-zinc-200 bg-white p-6 shadow-[0_18px_48px_rgba(15,23,42,0.08)] sm:p-8"
        >
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                <TextField
                    label="Admission Number"
                    required
                    type="text"
                    value={form.data.admission_number}
                    onChange={(e) =>
                        form.setData("admission_number", e.target.value)
                    }
                    error={form.errors.admission_number}
                    placeholder="TVET/2026/001"
                    className="h-11"
                />

                <TextField
                    label="Amount"
                    required
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.data.amount}
                    onChange={(e) => form.setData("amount", e.target.value)}
                    error={form.errors.amount}
                    placeholder="0.00"
                    className="h-11"
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

                <TextField
                    label="Payment Date"
                    required
                    type="date"
                    value={form.data.payment_date}
                    onChange={(e) =>
                        form.setData("payment_date", e.target.value)
                    }
                    error={form.errors.payment_date}
                    className="h-11"
                />

                <div className="md:col-span-2 xl:col-span-3">
                    <TextField
                        label="Reference"
                        type="text"
                        value={form.data.reference}
                        onChange={(e) =>
                            form.setData("reference", e.target.value)
                        }
                        error={form.errors.reference}
                        placeholder="MPESA123ABC"
                        className="h-11"
                    />
                </div>
            </div>

            <div className="mt-5">
                <TextAreaField
                    label="Note"
                    rows={5}
                    value={form.data.notes}
                    onChange={(e) => form.setData("notes", e.target.value)}
                    error={form.errors.notes}
                    placeholder="Optional note"
                />
            </div>

            <div className="mt-6 flex flex-col gap-3 border-t border-zinc-100 pt-5 sm:flex-row sm:items-center sm:justify-end">
                <button
                    type="button"
                    onClick={onCancel}
                    className="rounded-xl border border-zinc-200 bg-white px-5 py-3 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50"
                >
                    Cancel
                </button>
                <PrimaryButton
                    disabled={form.processing}
                    className="justify-center rounded-xl bg-slate-900 px-6 py-3 text-sm normal-case tracking-normal"
                >
                    {form.processing ? "Recording..." : submitLabel}
                </PrimaryButton>
            </div>
        </form>
    );
}
