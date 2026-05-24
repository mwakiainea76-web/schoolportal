import { Head, Link } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import {
    ArrowLeft,
    BookOpen,
    FileText,
    Printer,
    Receipt,
    Wallet,
} from "lucide-react";

const currency = (amount) =>
    `Ksh ${new Intl.NumberFormat("en-KE", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(Number(amount || 0))}`;

const statusClasses = {
    issued: "bg-amber-100 text-amber-700",
    partial: "bg-blue-100 text-blue-700",
    paid: "bg-emerald-100 text-emerald-700",
    draft: "bg-slate-100 text-slate-600",
};

export default function Show({ statement }) {
    const totals = [
        {
            label: "Total Charges",
            value: currency(statement.totals.amount_due),
            icon: Receipt,
            tone: "bg-amber-50 text-amber-600",
        },
        {
            label: "Payments and Credits",
            value: currency(statement.totals.paid_amount),
            icon: Wallet,
            tone: "bg-emerald-50 text-emerald-600",
        },
        {
            label: "Outstanding Balance",
            value: currency(statement.totals.balance_due),
            icon: FileText,
            tone: "bg-slate-100 text-slate-700",
        },
    ];

    return (
        <AuthenticatedLayout>
            <Head title={`Fee Statement ${statement.statement_reference}`} />

            <div className="mx-auto w-full max-w-7xl animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="mb-6 flex items-center justify-between">
                    <Link
                        href={route("student.fee-statements.index")}
                        className="inline-flex items-center gap-2 text-sm font-medium text-emerald-700 transition hover:text-emerald-800"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to statements
                    </Link>

                    <button
                        type="button"
                        onClick={() => window.print()}
                        className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700"
                    >
                        <Printer className="h-4 w-4" />
                        Print statement
                    </button>
                </div>

                <div className="rounded-[2rem] bg-[#1b263b] px-8 py-8 text-white shadow-xl print:rounded-none print:bg-white print:px-0 print:py-0 print:text-zinc-900 print:shadow-none">
                    <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
                        <div>
                            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-300 print:text-emerald-700">
                                Fee Statement
                            </p>
                            <h1 className="mt-3 text-3xl font-bold tracking-tight">
                                {statement.school_name}
                            </h1>
                            <p className="mt-2 text-sm text-slate-300 print:text-zinc-500">
                                Student fee statement for invoiced charges,
                                payments, and running balance.
                            </p>
                        </div>

                        <div className="grid gap-3 rounded-[1.5rem] border border-white/10 bg-white/5 p-5 backdrop-blur print:border-zinc-200 print:bg-zinc-50">
                            <div>
                                <p className="text-xs uppercase tracking-wide text-slate-300 print:text-zinc-500">
                                    Statement No.
                                </p>
                                <p className="mt-1 font-semibold">
                                    {statement.statement_reference}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs uppercase tracking-wide text-slate-300 print:text-zinc-500">
                                    Generated On
                                </p>
                                <p className="mt-1 font-semibold">
                                    {statement.generated_on ?? "-"}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs uppercase tracking-wide text-slate-300 print:text-zinc-500">
                                    Status
                                </p>
                                <span
                                    className={`mt-2 inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                                        statusClasses[statement.status] ??
                                        "bg-slate-100 text-slate-600"
                                    }`}
                                >
                                    {statement.status}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-6 grid gap-6 lg:grid-cols-[1.15fr,0.85fr]">
                    <div className="rounded-[1.75rem] border border-zinc-100 bg-white p-7 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-lg font-semibold text-zinc-900">
                                    Student Details
                                </h2>
                                <p className="mt-1 text-sm text-zinc-500">
                                    Statement holder and study information.
                                </p>
                            </div>
                            <div className="rounded-2xl bg-sky-50 p-3 text-sky-600">
                                <BookOpen className="h-5 w-5" />
                            </div>
                        </div>

                        <div className="mt-6 grid gap-4 md:grid-cols-2">
                            <InfoCard
                                label="Student Name"
                                value={statement.student.name}
                            />
                            <InfoCard
                                label="Registration Number"
                                value={statement.student.registration_number}
                            />
                            <InfoCard
                                label="Program"
                                value={statement.program.name ?? "Not assigned"}
                            />
                            <InfoCard
                                label="Program Version"
                                value={
                                    statement.program.version ??
                                    "Not assigned"
                                }
                            />
                            <InfoCard
                                label="Session"
                                value={statement.session ?? "Not linked"}
                            />
                            <InfoCard
                                label="Admission Date"
                                value={
                                    statement.student.admission_date ?? "-"
                                }
                            />
                        </div>

                        {statement.included_invoices?.length > 1 ? (
                            <div className="mt-6 rounded-2xl bg-zinc-50 px-4 py-4">
                                <p className="text-sm font-semibold text-zinc-900">
                                    Included Session Invoices
                                </p>
                                <p className="mt-1 text-sm text-zinc-500">
                                    This statement combines all invoices issued
                                    for the same academic session.
                                </p>
                                <div className="mt-3 space-y-2">
                                    {statement.included_invoices.map(
                                        (invoice) => (
                                            <div
                                                key={invoice.id}
                                                className="flex items-center justify-between text-sm"
                                            >
                                                <span className="font-medium text-zinc-800">
                                                    {invoice.invoice_number}
                                                </span>
                                                <span className="text-zinc-500">
                                                    {currency(
                                                        invoice.amount_due,
                                                    )}
                                                </span>
                                            </div>
                                        ),
                                    )}
                                </div>
                            </div>
                        ) : null}
                    </div>

                    <div className="grid gap-4">
                        {totals.map((item) => {
                            const Icon = item.icon;

                            return (
                                <div
                                    key={item.label}
                                    className="rounded-[1.75rem] border border-zinc-100 bg-white p-6 shadow-sm"
                                >
                                    <div
                                        className={`inline-flex rounded-2xl p-3 ${item.tone}`}
                                    >
                                        <Icon className="h-5 w-5" />
                                    </div>
                                    <p className="mt-4 text-sm font-medium text-zinc-500">
                                        {item.label}
                                    </p>
                                    <p className="mt-2 text-2xl font-bold text-zinc-900">
                                        {item.value}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="mt-6 rounded-[1.75rem] border border-zinc-100 bg-white p-7 shadow-sm">
                    <h2 className="text-lg font-semibold text-zinc-900">
                        Charge Breakdown
                    </h2>
                    <p className="mt-1 text-sm text-zinc-500">
                        Statement items billed for this session.
                    </p>

                    <div className="mt-5 overflow-hidden rounded-2xl border border-zinc-100">
                        <table className="min-w-full divide-y divide-zinc-100">
                            <thead className="bg-zinc-50">
                                <tr className="text-left text-xs font-semibold uppercase tracking-wide text-zinc-500">
                                    <th className="px-5 py-4">Description</th>
                                    <th className="px-5 py-4 text-right">
                                        Qty
                                    </th>
                                    <th className="px-5 py-4 text-right">
                                        Unit Amount
                                    </th>
                                    <th className="px-5 py-4 text-right">
                                        Total
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-100 bg-white">
                                {statement.items?.length ? (
                                    statement.items.map((item, index) => (
                                        <tr key={`${item.description}-${index}`}>
                                            <td className="px-5 py-4 text-sm font-medium text-zinc-900">
                                                {item.description}
                                            </td>
                                            <td className="px-5 py-4 text-right text-sm text-zinc-700">
                                                {item.quantity}
                                            </td>
                                            <td className="px-5 py-4 text-right text-sm text-zinc-700">
                                                {currency(item.unit_amount)}
                                            </td>
                                            <td className="px-5 py-4 text-right text-sm font-semibold text-zinc-900">
                                                {currency(item.total_amount)}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan="4"
                                            className="px-5 py-8 text-center text-sm text-zinc-500"
                                        >
                                            No charge lines are attached to this
                                            statement yet.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="mt-6 rounded-[1.75rem] border border-zinc-100 bg-white p-7 shadow-sm">
                    <h2 className="text-lg font-semibold text-zinc-900">
                        Ledger Activity
                    </h2>
                    <p className="mt-1 text-sm text-zinc-500">
                        Running statement of charges, payments, and balance
                        movement.
                    </p>

                    <div className="mt-5 overflow-hidden rounded-2xl border border-zinc-100">
                        <table className="min-w-full divide-y divide-zinc-100">
                            <thead className="bg-zinc-50">
                                <tr className="text-left text-xs font-semibold uppercase tracking-wide text-zinc-500">
                                    <th className="px-5 py-4">Date</th>
                                    <th className="px-5 py-4">Reference</th>
                                    <th className="px-5 py-4">Description</th>
                                    <th className="px-5 py-4">Type</th>
                                    <th className="px-5 py-4 text-right">
                                        Debit
                                    </th>
                                    <th className="px-5 py-4 text-right">
                                        Credit
                                    </th>
                                    <th className="px-5 py-4 text-right">
                                        Balance
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-100 bg-white">
                                {statement.entries?.length ? (
                                    statement.entries.map((entry) => (
                                        <tr key={entry.id}>
                                            <td className="px-5 py-4 text-sm text-zinc-700">
                                                {entry.date ?? "-"}
                                            </td>
                                            <td className="px-5 py-4 text-sm font-medium text-zinc-900">
                                                {entry.reference ?? "-"}
                                            </td>
                                            <td className="px-5 py-4 text-sm text-zinc-700">
                                                {entry.description ?? "-"}
                                            </td>
                                            <td className="px-5 py-4">
                                                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold capitalize text-slate-700">
                                                    {entry.type}
                                                </span>
                                            </td>
                                            <td className="px-5 py-4 text-right text-sm text-red-600">
                                                {entry.debit
                                                    ? currency(entry.debit)
                                                    : "-"}
                                            </td>
                                            <td className="px-5 py-4 text-right text-sm text-emerald-700">
                                                {entry.credit
                                                    ? currency(entry.credit)
                                                    : "-"}
                                            </td>
                                            <td className="px-5 py-4 text-right text-sm font-semibold text-zinc-900">
                                                {currency(
                                                    entry.running_balance,
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan="7"
                                            className="px-5 py-8 text-center text-sm text-zinc-500"
                                        >
                                            No ledger activity found for this
                                            statement.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

function InfoCard({ label, value }) {
    return (
        <div className="rounded-2xl bg-zinc-50 px-4 py-3">
            <p className="text-sm text-zinc-500">{label}</p>
            <p className="mt-1 font-semibold text-zinc-900">{value || "-"}</p>
        </div>
    );
}
