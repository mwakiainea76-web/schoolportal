import { useForm } from "@inertiajs/react";
import FormScaffold from "./FormScaffold";
import AdditionalInvoiceForm from "./AdditionalInvoiceForm";

const today = new Date().toISOString().split("T")[0];
const plusDays = (days) =>
    new Date(Date.now() + days * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0];

export default function AdditionalInvoice({
    selectedAdmissionNumber,
    selectedInvoiceKind = "standard_invoice",
}) {
    const form = useForm({
        admission_number: selectedAdmissionNumber || "",
        invoice_kind: selectedInvoiceKind || "standard_invoice",
        description: "",
        amount: "",
        issue_date: today,
        due_date: plusDays(14),
    });

    const onSubmit = (e) => {
        e.preventDefault();
        form.post(route("billing.manual.invoices.store"), {
            preserveScroll: true,
        });
    };

    return (
        <FormScaffold
            title="Post Student Charge"
            description="This form increases the student account by posting a Standard Invoice, Penalty, or Invoice Adjustment."
            backHref={route("billing.manual.index")}
        >
            <div className="max-w-4xl rounded-[1.75rem] border border-zinc-100 bg-white p-6 shadow-sm">
                <AdditionalInvoiceForm form={{ ...form, onSubmit }} />
            </div>
        </FormScaffold>
    );
}
