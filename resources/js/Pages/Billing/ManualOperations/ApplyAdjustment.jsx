import { useForm } from "@inertiajs/react";
import PrimaryButton from "@/Components/PrimaryButton";
import FormScaffold from "./FormScaffold";
import { NativeSelectField, TextAreaField, TextField } from "./Fields";

const today = new Date().toISOString().split("T")[0];

export default function ApplyAdjustment({ selectedRegistrationNumber }) {
    const form = useForm({
        registration_number: selectedRegistrationNumber || "",
        type: "discount",
        amount: "",
        description: "",
        applied_at: today,
        replacement_amount: "",
        replacement_description: "",
    });

    const isReversal = form.data.type === "reversal";
    const isRefund = form.data.type === "refund";

    const submit = (e) => {
        e.preventDefault();
        form.post(route("billing.manual.adjustments.store"), {
            preserveScroll: true,
        });
    };

    return (
        <FormScaffold
            title="Fee Adjustment"
            description="Apply approved finance adjustments to the selected invoice, including full reversals of wrong charges."
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
                        The system will use the student&apos;s latest invoice, or
                        latest outstanding invoice where applicable.
                    </p>

                    {isReversal ? (
                        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                            Reversal will credit the wrong invoice amount. If you
                            provide a corrected amount below, the system will also
                            raise a replacement invoice for the same student and
                            session automatically.
                        </div>
                    ) : null}

                    {isRefund ? (
                        <div className="rounded-2xl border border-sky-200 bg-sky-50 px-4 py-3 text-sm text-sky-800">
                            Refund is a physical cash-out to the student. It is
                            only allowed when the student has cleared all invoices
                            and still has an overpaid credit balance available for
                            payout.
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

                    <div className="grid gap-5 md:grid-cols-2">
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
                                    form.setData(
                                        "replacement_amount",
                                        e.target.value,
                                    )
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

                    <PrimaryButton
                        disabled={form.processing}
                        className="bg-emerald-600 px-6 py-3 text-sm normal-case tracking-normal hover:bg-emerald-700"
                    >
                        {isReversal
                            ? "Apply Reversal"
                            : "Apply Fee Adjustment"}
                    </PrimaryButton>
                </form>
            </div>
        </FormScaffold>
    );
}
