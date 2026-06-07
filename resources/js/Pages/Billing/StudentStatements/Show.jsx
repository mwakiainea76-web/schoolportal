import { Head, Link } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import formatDate from "@/utils/date";
import {
    ArrowLeft,
    BookOpen,
    CalendarClock,
    FileText,
    Printer,
    Receipt,
} from "lucide-react";

const currency = (amount) =>
    `Ksh ${new Intl.NumberFormat("en-KE", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(Number(amount || 0))}`;

const statusClasses = {
    issued: "bg-amber-100 text-amber-700",
    partial: "bg-sky-100 text-sky-700",
    paid: "bg-emerald-100 text-emerald-700",
    draft: "bg-slate-100 text-slate-600",
};

export default function Show({ statement }) {
    return (
        <AuthenticatedLayout>
            <Head title={`Fee Statement ${statement.statement_reference}`} />

            <div className="mx-auto w-full max-w-7xl space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between print:hidden">
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
                        className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700"
                    >
                        <Printer className="h-4 w-4" />
                        Print statement
                    </button>
                </div>

                <section className="overflow-hidden rounded-[2rem] bg-[radial-gradient(circle_at_top_left,_rgba(52,211,153,0.24),_transparent_25%),linear-gradient(135deg,#102542_0%,#1b263b_55%,#243b53_100%)] px-6 py-8 text-white shadow-xl print:rounded-none print:bg-white print:px-0 print:py-0 print:text-zinc-900 print:shadow-none sm:px-8">
                    <div className="grid gap-8 lg:grid-cols-[1.15fr,0.85fr] lg:items-start">
                        <div>
                            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-300 print:text-emerald-700">
                                Official Fee Statement
                            </p>
                            <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                                {statement.school_name}
                            </h1>
                            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300 print:text-zinc-500">
                                Consolidated statement of charges, credits,
                                payments, and resulting session balance.
                            </p>

                            <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                                <ProfileChip
                                    icon={BookOpen}
                                    label="Student"
                                    value={statement.student.name}
                                />
                                <ProfileChip
                                    icon={FileText}
                                        label="Admission Number"
                                        value={
                                            statement.student.admission_number
                                        }
                                    />
                                <ProfileChip
                                    icon={CalendarClock}
                                    label="Session"
                                    value={statement.session}
                                />
                                <ProfileChip
                                    icon={Receipt}
                                    label="Statement No."
                                    value={statement.statement_reference}
                                />
                            </div>
                        </div>

                        <div className="grid gap-3 rounded-[1.5rem] border border-white/10 bg-white/10 p-5 backdrop-blur print:border-zinc-200 print:bg-zinc-50">
                            <MetaPair
                                label="Generated on"
                                value={formatDate(statement.generated_on)}
                            />
                            <MetaPair
                                label="Issue date"
                                value={formatDate(statement.issue_date)}
                            />
                            <MetaPair
                                label="Due date"
                                value={formatDate(statement.due_date)}
                            />
                            <div className="pt-2">
                                <p className="text-xs uppercase tracking-[0.15em] text-slate-300 print:text-zinc-500">
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
                </section>

                <section className="rounded-[1.75rem] border border-zinc-100 bg-white p-6 shadow-sm">
                    <h2 className="text-lg font-semibold text-zinc-900">
                        Charge Breakdown
                    </h2>
                    <p className="mt-1 text-sm text-zinc-500">
                        Individual billed items contributing to the session total.
                    </p>

                    <div className="mt-5 overflow-hidden rounded-2xl border border-zinc-100">
                        <table className="min-w-full divide-y divide-zinc-100">
                            <thead className="bg-zinc-50">
                                <tr className="text-left text-xs font-semibold uppercase tracking-wide text-zinc-500">
                                    <th className="px-5 py-4">Description</th>
                                    <th className="px-5 py-4 text-right">Qty</th>
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
                                    <EmptyRow
                                        colSpan="4"
                                        text="No charge lines are attached to this statement yet."
                                    />
                                )}
                            </tbody>
                        </table>
                    </div>
                </section>

                <section className="rounded-[1.75rem] border border-zinc-100 bg-white p-6 shadow-sm">
                    <h2 className="text-lg font-semibold text-zinc-900">
                        Ledger Activity
                    </h2>
                    <p className="mt-1 text-sm text-zinc-500">
                        Chronological movement of charges, credits, and balance.
                    </p>

                    <div className="mt-5 overflow-hidden rounded-2xl border border-zinc-100">
                        <table className="min-w-full divide-y divide-zinc-100">
                            <thead className="bg-zinc-50">
                                <tr className="text-left text-xs font-semibold uppercase tracking-wide text-zinc-500">
                                    <th className="px-5 py-4">Date</th>
                                    <th className="px-5 py-4">Reference</th>
                                    <th className="px-5 py-4">Description</th>
                                    <th className="px-5 py-4">Type</th>
                                    <th className="px-5 py-4 text-right">Debit</th>
                                    <th className="px-5 py-4 text-right">Credit</th>
                                    <th className="px-5 py-4 text-right">Balance</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-100 bg-white">
                                {statement.entries?.length ? (
                                    statement.entries.map((entry) => (
                                        <tr key={entry.id}>
                                            <td className="px-5 py-4 text-sm text-zinc-700">
                                                {formatDate(entry.date)}
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
                                            <td className="px-5 py-4 text-right text-sm text-rose-600">
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
                                                {currency(entry.running_balance)}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <EmptyRow
                                        colSpan="7"
                                        text="No ledger activity found for this statement."
                                    />
                                )}
                            </tbody>
                        </table>
                    </div>
                </section>
            </div>
        </AuthenticatedLayout>
    );
}

function ProfileChip({ icon: Icon, label, value }) {
    return (
        <div className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 print:border-zinc-200 print:bg-zinc-50">
            <div className="space-y-3">
                <div className="inline-flex rounded-xl bg-white/10 p-2 text-emerald-200 print:bg-emerald-50 print:text-emerald-700">
                    <Icon className="h-4 w-4" />
                </div>
                <span className="block text-xs uppercase tracking-[0.14em] text-slate-300 print:text-zinc-500">
                    {label}
                </span>
                <span className="block text-sm font-semibold text-white print:text-zinc-900">
                    {value || "-"}
                </span>
            </div>
        </div>
    );
}

function MetaPair({ label, value }) {
    return (
        <div className="flex items-center justify-between gap-4 text-sm">
            <span className="text-slate-300 print:text-zinc-500">{label}</span>
            <span className="font-semibold text-white print:text-zinc-900">
                {value}
            </span>
        </div>
    );
}

function EmptyRow({ colSpan, text }) {
    return (
        <tr>
            <td
                colSpan={colSpan}
                className="px-5 py-8 text-center text-sm text-zinc-500"
            >
                {text}
            </td>
        </tr>
    );
}
