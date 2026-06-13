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
                    placeholder="0.00"
                    className="h-11"
                />

                <TextField
                    label="Applied Date"
                    required
                    type="date"
                    value={form.data.applied_at}
                    onChange={(e) => form.setData("applied_at", e.target.value)}
                    error={form.errors.applied_at}
                    className="h-11"
                />

                {isReversal ? (
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
                        placeholder="40000"
                        className="h-11"
                    />
                ) : null}
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
                        isRefund
                            ? "Cash refund issued to clear final student credit"
                            : isReversal
                              ? "Reverse wrong invoice amount entered as 4,000 instead of 40,000"
                              : "Approved bursary support"
                    }
                />
            </div>

            {isReversal ? (
                <div className="mt-5">
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
                        placeholder="Correct tuition invoice"
                        className="h-11"
                    />
                </div>
            ) : null}

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
                    className="justify-center rounded-xl bg-emerald-600 px-6 py-3 text-sm normal-case tracking-normal hover:bg-emerald-700"
                >
                    {form.processing
                        ? "Saving..."
                        : submitLabel ??
                          (isReversal
                              ? "Apply Reversal"
                              : "Apply Charge Reduction")}
                </PrimaryButton>
            </div>
        </form>
    );
}
