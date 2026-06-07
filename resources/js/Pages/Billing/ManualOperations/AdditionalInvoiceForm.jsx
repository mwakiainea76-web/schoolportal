import PrimaryButton from "@/Components/PrimaryButton";
import { NativeSelectField, TextAreaField, TextField } from "./Fields";

export default function AdditionalInvoiceForm({
    form,
    submitLabel = "Issue Additional Invoice",
    onCancel,
}) {
    return (
        <form onSubmit={form.onSubmit} className="space-y-5">
            <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
                This action charges the student account. Use it only when you intend to increase what the student owes for the selected session.
            </div>

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
            <p className="-mt-2 text-sm text-zinc-500">
                Uses the student&apos;s latest session enrollment.
            </p>

            <NativeSelectField
                label="Charge Class"
                required
                value={form.data.invoice_kind}
                onChange={(value) => form.setData("invoice_kind", value)}
                error={form.errors.invoice_kind}
                options={[
                    { value: "standard_invoice", label: "Standard Invoice" },
                    { value: "penalty", label: "Penalty" },
                    { value: "hostel", label: "Hostel Invoice" },
                    { value: "invoice_adjustment", label: "Invoice Adjustment" },
                ]}
            />

            <TextAreaField
                label="Charge Description"
                required
                rows={4}
                value={form.data.description}
                onChange={(e) => form.setData("description", e.target.value)}
                error={form.errors.description}
                placeholder={
                    form.data.invoice_kind === "standard_invoice"
                        ? "e.g. Graduation clearance fee"
                        : form.data.invoice_kind === "hostel"
                          ? "e.g. Sunrise Hostel boarding fee"
                        : "e.g. Late registration"
                }
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
