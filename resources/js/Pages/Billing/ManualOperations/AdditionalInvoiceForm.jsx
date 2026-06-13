import PrimaryButton from "@/Components/PrimaryButton";
import { NativeSelectField, TextAreaField, TextField } from "./Fields";

export default function AdditionalInvoiceForm({
    form,
    submitLabel = "Post Charge",
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
                    label="Invoice Type"
                    required
                    value={form.data.invoice_kind}
                    onChange={(value) => form.setData("invoice_kind", value)}
                    error={form.errors.invoice_kind}
                    options={[
                        {
                            value: "standard_invoice",
                            label: "Standard Invoice",
                        },
                        { value: "penalty", label: "Penalty" },
                        { value: "hostel", label: "Hostel Invoice" },
                        {
                            value: "invoice_adjustment",
                            label: "Invoice Adjustment",
                        },
                    ]}
                />

                <TextField
                    label="Issue Date"
                    required
                    type="date"
                    value={form.data.issue_date}
                    onChange={(e) => form.setData("issue_date", e.target.value)}
                    error={form.errors.issue_date}
                    className="h-11"
                />

                <TextField
                    label="Due Date"
                    required
                    type="date"
                    value={form.data.due_date}
                    onChange={(e) => form.setData("due_date", e.target.value)}
                    error={form.errors.due_date}
                    className="h-11"
                />
            </div>

            <div className="mt-5">
                <TextAreaField
                    label="Description"
                    required
                    rows={5}
                    value={form.data.description}
                    onChange={(e) => form.setData("description", e.target.value)}
                    error={form.errors.description}
                    placeholder={
                        form.data.invoice_kind === "standard_invoice"
                            ? "Graduation clearance fee"
                            : form.data.invoice_kind === "hostel"
                              ? "Sunrise Hostel boarding fee"
                              : form.data.invoice_kind === "penalty"
                                ? "Late registration penalty"
                                : "Manual charge correction"
                    }
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
                    {form.processing ? "Posting..." : submitLabel}
                </PrimaryButton>
            </div>
        </form>
    );
}
