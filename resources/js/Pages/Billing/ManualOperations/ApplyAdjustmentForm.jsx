import PrimaryButton from "@/Components/PrimaryButton";
import { NativeSelectField, TextAreaField, TextField } from "./Fields";

export default function ApplyAdjustmentForm({
    form,
    submitLabel,
    onCancel,
}) {
    const isReversal = form.data.type === "reversal";
    const isRefund = form.data.type === "refund";

    return (
        <form onSubmit={form.onSubmit} className="space-y-5">
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
                Uses the latest invoice where applicable.
            </p>

            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
                Use this section when you want to reduce or correct student charges through waivers, bursaries, HELB support, refunds, or reversals. Do not use it to record payments.
            </div>

            {isReversal ? (
                <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                    Reversal credits the wrong charge. Add corrected values below to issue a replacement invoice.
                </div>
            ) : null}

            {isRefund ? (
                <div className="rounded-2xl border border-sky-200 bg-sky-50 px-4 py-3 text-sm text-sky-800">
                    Refund only applies to cleared accounts with an overpaid credit balance.
                </div>
            ) : null}

            <div className="grid gap-5 md:grid-cols-2">
                <NativeSelectField
                    label="Adjustment Type"
                    required
                    value={form.data.type}
                    onChange={(value) => form.setData("type", value)}
                    error={form.errors.type}
                    options={[
                        { value: "discount", label: "Discount" },
                        { value: "waiver", label: "Waiver" },
                        { value: "bursary", label: "Bursary" },
                        { value: "helb", label: "HELB" },
                        { value: "refund", label: "Refund" },
                        { value: "reversal", label: "Reversal" },
                        { value: "other", label: "Other" },
                    ]}
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
                />
            </div>

            <TextField
                label="Applied Date"
                required
                type="date"
                value={form.data.applied_at}
                onChange={(e) => form.setData("applied_at", e.target.value)}
                error={form.errors.applied_at}
            />

            <TextAreaField
                label="Description"
                required
                rows={4}
                value={form.data.description}
                onChange={(e) => form.setData("description", e.target.value)}
                error={form.errors.description}
                placeholder={
                    isRefund
                        ? "e.g. Cash refund issued to clear final student credit"
                        : isReversal
                          ? "e.g. Reverse wrong invoice amount entered as 4,000 instead of 40,000"
                          : "e.g. Approved bursary support"
                }
            />

            {isReversal ? (
                <div className="grid gap-5 md:grid-cols-2">
                    <TextField
                        label="Corrected Invoice Amount"
                        type="number"
                        min="0"
                        step="0.01"
                        value={form.data.replacement_amount}
                        onChange={(e) =>
                            form.setData("replacement_amount", e.target.value)
                        }
                        error={form.errors.replacement_amount}
                        placeholder="Optional e.g. 40000"
                    />
                    <TextField
                        label="Corrected Invoice Description"
                        type="text"
                        value={form.data.replacement_description}
                        onChange={(e) =>
                            form.setData(
                                "replacement_description",
                                e.target.value,
                            )
                        }
                        error={form.errors.replacement_description}
                        placeholder="Optional e.g. Correct tuition invoice"
                    />
                </div>
            ) : null}

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
                    className="bg-emerald-600 px-6 py-3 text-sm normal-case tracking-normal hover:bg-emerald-700"
                >
                    {submitLabel ?? (isReversal ? "Apply Reversal" : "Apply Charge Reduction")}
                </PrimaryButton>
            </div>
        </form>
    );
}
