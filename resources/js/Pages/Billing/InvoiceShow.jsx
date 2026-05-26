import { Head, Link } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import formatDate from "@/utils/date";
import {
    ArrowLeft,
    CalendarClock,
    CreditCard,
    FilePlus2,
    Receipt,
    Wallet,
} from "lucide-react";

const currency = (amount) =>
    `Ksh ${new Intl.NumberFormat("en-KE", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(Number(amount || 0))}`;

const signedCurrency = (amount) =>
    `${Number(amount || 0) < 0 ? "-" : ""}Ksh ${new Intl.NumberFormat(
        "en-KE",
        {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        },
    ).format(Math.abs(Number(amount || 0)))}`;

const statusClasses = {
    draft: "bg-slate-100 text-slate-600",
    issued: "bg-blue-100 text-blue-700",
    partial: "bg-amber-100 text-amber-700",
    paid: "bg-emerald-100 text-emerald-700",
};

export default function Show({ invoice, sessionSummary }) {
    const studentName = `${invoice.student?.user?.first_name ?? ""} ${
        invoice.student?.user?.last_name ?? ""
    }`.trim();

    const program =
        invoice.enrollment?.program_enrollment?.program_version_mapping?.program
            ?.name ?? "Not linked";
    const programVersion =
        invoice.enrollment?.program_enrollment?.program_version_mapping
            ?.program_version?.name ?? "Not linked";
    const session =
        invoice.enrollment?.academic_session?.display_name ??
        invoice.academic_session?.display_name ??
        "Session not linked";
    const itemsTotal = Number(
        sessionSummary?.items_total || invoice.items_total || 0,
    );
    const adjustmentsTotal = Number(
        sessionSummary?.adjustments_total || invoice.adjustments_total || 0,
    );
    const paidTotal = Number(
        sessionSummary?.paid_amount || invoice.paid_amount || 0,
    );
    const balanceTotal = Number(
        sessionSummary?.balance_due ?? invoice.balance_due ?? 0,
    );
    const sessionItems =
        sessionSummary?.items?.length > 0
            ? sessionSummary.items
            : invoice.items || [];
    const sessionPayments =
        sessionSummary?.payment_allocations?.length > 0
            ? sessionSummary.payment_allocations
            : invoice.payment_allocations || [];
    const sessionAdjustments =
        sessionSummary?.adjustments?.length > 0
            ? sessionSummary.adjustments
            : invoice.adjustments || [];
    const includedInvoices = sessionSummary?.included_invoices || [];
    const hasAdditionalInvoices = (sessionSummary?.invoice_count || 0) > 1;

    return (
        <AuthenticatedLayout>
            <Head title={`Invoice ${invoice.invoice_number}`} />

            <div className="mx-auto w-full max-w-7xl space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                        <Link
                            href={route("billing.invoices.index")}
                            className="inline-flex items-center gap-2 text-sm font-medium text-emerald-700 transition hover:text-emerald-800"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Back to invoices
                        </Link>
                        <h1 className="mt-3 text-3xl font-bold tracking-tight text-zinc-900">
                            Billing statement for {invoice.invoice_number}
                        </h1>
                        <p className="mt-2 max-w-3xl text-sm text-zinc-500">
                            This admin view shows the same session-based story the
                            student sees: total charges, applied credits, payments,
                            and the remaining balance.
                        </p>
                    </div>
                </div>

                <section className="overflow-hidden rounded-[2rem] bg-[radial-gradient(circle_at_top_left,_rgba(52,211,153,0.24),_transparent_26%),linear-gradient(135deg,#102542_0%,#1b263b_55%,#243b53_100%)] px-6 py-8 text-white shadow-xl sm:px-8">
                    <div className="grid gap-8 xl:grid-cols-[1.05fr,0.95fr]">
                        <div>
                            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-300">
                                Session Billing Overview
                            </p>
                            <h2 className="mt-3 text-2xl font-bold sm:text-3xl">
                                {studentName || "Student not linked"}
                            </h2>
                            <p className="mt-2 text-sm text-slate-300">
                                {invoice.student?.registration_number ?? "N/A"} |{" "}
                                {program} | {programVersion}
                            </p>
                            <p className="mt-2 text-sm text-slate-300">
                                {session}
                            </p>

                            <div className="mt-6 grid gap-3 sm:grid-cols-2">
                                <ProfileMetric
                                    label="Invoice date"
                                    value={formatDate(invoice.issue_date)}
                                />
                                <ProfileMetric
                                    label="Due date"
                                    value={formatDate(invoice.due_date)}
                                />
                                <ProfileMetric
                                    label="Session invoices"
                                    value={`${sessionSummary?.invoice_count || 1}`}
                                />
                                <ProfileMetric
                                    label="Status"
                                    value={invoice.status}
                                    chip
                                />
                            </div>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <StatCard
                                icon={Receipt}
                                label="Base Charges"
                                value={currency(itemsTotal)}
                            />
                            <StatCard
                                icon={Wallet}
                                label="Net Adjustments"
                                value={signedCurrency(adjustmentsTotal)}
                            />
                            <StatCard
                                icon={CreditCard}
                                label="Payments and Credits"
                                value={currency(paidTotal)}
                            />
                            <div className="rounded-[1.5rem] border border-white/10 bg-white/10 p-5">
                                <p className="text-xs uppercase tracking-[0.16em] text-slate-300">
                                    Outstanding Balance
                                </p>
                                <p className="mt-3 text-2xl font-bold text-white">
                                    {signedCurrency(balanceTotal)}
                                </p>
                                <span
                                    className={`mt-4 inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                                        statusClasses[invoice.status] ??
                                        "bg-slate-100 text-slate-600"
                                    }`}
                                >
                                    {invoice.status}
                                </span>
                            </div>
                        </div>
                    </div>
                </section>

                <div className="grid gap-6 xl:grid-cols-[1.15fr,0.85fr]">
                    <section className="rounded-[1.75rem] border border-zinc-100 bg-white p-6 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-lg font-semibold text-zinc-900">
                                    Student Context
                                </h2>
                                <p className="mt-1 text-sm text-zinc-500">
                                    Core information tied to this session statement.
                                </p>
                            </div>
                            <div className="rounded-2xl bg-sky-50 p-3 text-sky-600">
                                <CalendarClock className="h-5 w-5" />
                            </div>
                        </div>

                        <div className="mt-5 grid gap-4 md:grid-cols-2">
                            <InfoCard
                                label="Student"
                                value={studentName || "Not linked"}
                            />
                            <InfoCard
                                label="Registration Number"
                                value={invoice.student?.registration_number ?? "N/A"}
                            />
                            <InfoCard label="Program" value={program} />
                            <InfoCard
                                label="Program Version"
                                value={programVersion}
                            />
                            <InfoCard label="Session" value={session} />
                            <InfoCard
                                label="Invoice Total"
                                value={currency(invoice.amount_due)}
                            />
                            <InfoCard
                                label="Invoice Class"
                                value={
                                    invoice.display_type_label ??
                                    "STANDARD INVOICE"
                                }
                            />
                        </div>

                        {hasAdditionalInvoices ? (
                            <div className="mt-6 rounded-[1.5rem] border border-zinc-100 bg-zinc-50 p-4">
                                <p className="text-sm font-semibold text-zinc-900">
                                    Included Session Invoices
                                </p>
                                <p className="mt-1 text-sm text-zinc-500">
                                    This record groups all invoices issued for the same
                                    student and session.
                                </p>
                                <div className="mt-4 grid gap-3">
                                    {includedInvoices.map((sessionInvoice) => (
                                        <div
                                            key={sessionInvoice.id}
                                            className="flex flex-col gap-2 rounded-2xl bg-white px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
                                        >
                                            <div>
                                                <p className="font-medium text-zinc-900">
                                                    {sessionInvoice.invoice_number}
                                                </p>
                                                <p className="text-sm text-zinc-500">
                                                    {formatDate(sessionInvoice.issue_date)}
                                                </p>
                                            </div>
                                            <div className="text-left sm:text-right">
                                                <p className="font-medium text-zinc-900">
                                                    {currency(sessionInvoice.amount_due)}
                                                </p>
                                                <p className="text-sm text-zinc-500">
                                                    Balance{" "}
                                                    {signedCurrency(
                                                        sessionInvoice.balance_due,
                                                    )}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : null}
                    </section>

                    <section className="rounded-[1.75rem] border border-zinc-100 bg-white p-6 shadow-sm">
                        <h2 className="text-lg font-semibold text-zinc-900">
                            Manual Actions
                        </h2>
                        <p className="mt-1 text-sm text-zinc-500">
                            Post the next billing action from the same student context.
                        </p>
                        <div className="mt-5 space-y-4">
                            <ActionLink
                                href={route("billing.manual.invoices.create", {
                                    registration_number:
                                        invoice.student?.registration_number,
                                })}
                                icon={FilePlus2}
                                title="Post student charge"
                                helper="Charge the student account using Standard Invoice, Penalty, or Invoice Adjustment."
                            />
                            <ActionLink
                                href={route("billing.manual.payments.create", {
                                    registration_number:
                                        invoice.student?.registration_number,
                                })}
                                icon={CreditCard}
                                title="Record payment"
                                helper="Post a receipt and reduce the invoice balance."
                            />
                            <ActionLink
                                href={route("billing.manual.adjustments.create", {
                                    registration_number:
                                        invoice.student?.registration_number,
                                })}
                                icon={Wallet}
                                title="Reduce student charges"
                                helper="Use waivers, bursaries, HELB, refunds, and reversals here. This is not a payment entry."
                            />
                        </div>
                    </section>
                </div>

                <section className="rounded-[1.75rem] border border-zinc-100 bg-white p-6 shadow-sm">
                    <h2 className="text-lg font-semibold text-zinc-900">
                        Session Charge Breakdown
                    </h2>
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
                                {sessionItems.length ? (
                                    sessionItems.map((item, index) => (
                                        <tr
                                            key={`${item.invoice_number ?? "invoice"}-${item.id ?? index}`}
                                        >
                                            <td className="px-5 py-4 text-sm font-medium text-zinc-900">
                                                <div>
                                                    <p>{item.description}</p>
                                                    {item.invoice_number ? (
                                                        <p className="mt-1 text-xs font-normal text-zinc-500">
                                                            {item.invoice_number}
                                                        </p>
                                                    ) : null}
                                                </div>
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
                                        text="No invoice items recorded."
                                    />
                                )}
                            </tbody>
                        </table>
                    </div>
                </section>

                <div className="grid gap-6 xl:grid-cols-2">
                    <section className="rounded-[1.75rem] border border-zinc-100 bg-white p-6 shadow-sm">
                        <h2 className="text-lg font-semibold text-zinc-900">
                            Payments
                        </h2>
                        <div className="mt-5 overflow-hidden rounded-2xl border border-zinc-100">
                            <table className="min-w-full divide-y divide-zinc-100">
                                <thead className="bg-zinc-50">
                                    <tr className="text-left text-xs font-semibold uppercase tracking-wide text-zinc-500">
                                        <th className="px-5 py-4">Date</th>
                                        <th className="px-5 py-4">Method</th>
                                        <th className="px-5 py-4">Reference</th>
                                        <th className="px-5 py-4 text-right">
                                            Amount
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-zinc-100 bg-white">
                                    {sessionPayments.length ? (
                                        sessionPayments.map((allocation) => (
                                            <tr key={allocation.id}>
                                                <td className="px-5 py-4 text-sm text-zinc-700">
                                                    {formatDate(allocation.payment_date)}
                                                </td>
                                                <td className="px-5 py-4 text-sm text-zinc-700 capitalize">
                                                    {allocation.method ?? "-"}
                                                </td>
                                                <td className="px-5 py-4 text-sm text-zinc-700">
                                                    <div>
                                                        <p>{allocation.reference ?? "-"}</p>
                                                        {allocation.invoice_number ? (
                                                            <p className="mt-1 text-xs text-zinc-500">
                                                                {allocation.invoice_number}
                                                            </p>
                                                        ) : null}
                                                    </div>
                                                </td>
                                                <td className="px-5 py-4 text-right text-sm font-semibold text-emerald-700">
                                                    {currency(allocation.amount)}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <EmptyRow
                                            colSpan="4"
                                            text="No payments recorded."
                                        />
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </section>

                    <section className="rounded-[1.75rem] border border-zinc-100 bg-white p-6 shadow-sm">
                        <h2 className="text-lg font-semibold text-zinc-900">
                            Adjustments
                        </h2>
                        <div className="mt-5 overflow-hidden rounded-2xl border border-zinc-100">
                            <table className="min-w-full divide-y divide-zinc-100">
                                <thead className="bg-zinc-50">
                                    <tr className="text-left text-xs font-semibold uppercase tracking-wide text-zinc-500">
                                        <th className="px-5 py-4">Type</th>
                                        <th className="px-5 py-4">Description</th>
                                        <th className="px-5 py-4">Applied</th>
                                        <th className="px-5 py-4 text-right">
                                            Amount
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-zinc-100 bg-white">
                                    {sessionAdjustments.length ? (
                                        sessionAdjustments.map((adjustment) => {
                                            const reducesInvoice = [
                                                "discount",
                                                "waiver",
                                                "bursary",
                                                "helb",
                                                "reversal",
                                            ].includes(adjustment.type);
                                            const increasesInvoice = [
                                                "penalty",
                                                "other",
                                            ].includes(adjustment.type);
                                            const effectAmount =
                                                adjustment.type === "refund"
                                                    ? 0
                                                    : reducesInvoice
                                                      ? -Number(adjustment.amount)
                                                      : Number(adjustment.amount);

                                            return (
                                                <tr key={adjustment.id}>
                                                    <td className="px-5 py-4 text-sm font-medium capitalize text-zinc-900">
                                                        {adjustment.display_type ??
                                                            adjustment.type}
                                                    </td>
                                                    <td className="px-5 py-4 text-sm text-zinc-700">
                                                        <div>
                                                            <p>
                                                                {adjustment.description ?? "-"}
                                                            </p>
                                                            {adjustment.invoice_number ? (
                                                                <p className="mt-1 text-xs text-zinc-500">
                                                                    {adjustment.invoice_number}
                                                                </p>
                                                            ) : null}
                                                        </div>
                                                    </td>
                                                    <td className="px-5 py-4 text-sm text-zinc-700">
                                                        {formatDate(adjustment.applied_at)}
                                                    </td>
                                                    <td
                                                        className={`px-5 py-4 text-right text-sm font-semibold ${
                                                            adjustment.type === "refund"
                                                                ? "text-slate-700"
                                                                : increasesInvoice
                                                                  ? "text-amber-700"
                                                                  : "text-emerald-700"
                                                        }`}
                                                    >
                                                        {adjustment.type === "refund"
                                                            ? currency(adjustment.amount)
                                                            : signedCurrency(effectAmount)}
                                                        <div className="mt-1 text-xs font-normal text-zinc-500">
                                                            {adjustment.type === "refund"
                                                                ? "Cash payout only"
                                                                : reducesInvoice
                                                                  ? "Reduces invoice"
                                                                  : "Increases invoice"}
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    ) : (
                                        <EmptyRow
                                            colSpan="4"
                                            text="No fee adjustments recorded."
                                        />
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </section>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

function StatCard({ icon: Icon, label, value }) {
    return (
        <div className="rounded-[1.5rem] border border-white/10 bg-white/10 p-5">
            <div className="inline-flex rounded-xl bg-white/10 p-2 text-white">
                <Icon className="h-4 w-4" />
            </div>
            <p className="mt-3 text-xs uppercase tracking-[0.16em] text-slate-300">
                {label}
            </p>
            <p className="mt-2 text-xl font-semibold text-white">{value}</p>
        </div>
    );
}

function ProfileMetric({ label, value, chip = false }) {
    return (
        <div className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3">
            <p className="text-xs uppercase tracking-[0.14em] text-slate-300">
                {label}
            </p>
            {chip ? (
                <span
                    className={`mt-2 inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                        statusClasses[value] ?? "bg-slate-100 text-slate-600"
                    }`}
                >
                    {value}
                </span>
            ) : (
                <p className="mt-2 text-sm font-semibold text-white">
                    {value}
                </p>
            )}
        </div>
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

function ActionLink({ href, icon: Icon, title, helper }) {
    return (
        <Link
            href={href}
            className="block rounded-2xl border border-zinc-100 bg-zinc-50 px-4 py-4 transition hover:border-emerald-200 hover:bg-emerald-50/50"
        >
            <div className="flex items-start gap-3">
                <div className="rounded-xl bg-white p-2 text-zinc-700 shadow-sm">
                    <Icon className="h-4 w-4" />
                </div>
                <div>
                    <p className="font-semibold text-zinc-900">{title}</p>
                    <p className="mt-1 text-sm text-zinc-500">{helper}</p>
                </div>
            </div>
        </Link>
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
