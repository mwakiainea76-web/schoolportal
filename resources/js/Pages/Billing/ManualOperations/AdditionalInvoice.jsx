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
            description="Post a charge to a student account."
            backHref={route("billing.manual.index")}
        >
            <AdditionalInvoiceForm form={{ ...form, onSubmit }} />
        </FormScaffold>
    );
}
