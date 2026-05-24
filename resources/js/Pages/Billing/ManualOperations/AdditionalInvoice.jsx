import { useForm } from "@inertiajs/react";
import PrimaryButton from "@/Components/PrimaryButton";
import FormScaffold from "./FormScaffold";
import { TextAreaField, TextField } from "./Fields";

const today = new Date().toISOString().split("T")[0];
const plusDays = (days) =>
    new Date(Date.now() + days * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0];

export default function AdditionalInvoice({
    selectedRegistrationNumber,
}) {
    const form = useForm({
        registration_number: selectedRegistrationNumber || "",
        description: "",
        amount: "",
        issue_date: today,
        due_date: plusDays(14),
    });

    const submit = (e) => {
        e.preventDefault();
        form.post(route("billing.manual.invoices.store"), {
            preserveScroll: true,
        });
    };

    return (
        <FormScaffold
            title="Additional Invoice"
            description="Raise a manual charge for a specific student session enrollment."
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
                        The system will automatically use the student&apos;s latest
                        session enrollment.
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
                            onChange={(e) =>
                                form.setData("issue_date", e.target.value)
                            }
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

                    <PrimaryButton
                        disabled={form.processing}
                        className="bg-slate-700 px-6 py-3 text-sm normal-case tracking-normal"
                    >
                        Issue Additional Invoice
                    </PrimaryButton>
                </form>
            </div>
        </FormScaffold>
    );
}
