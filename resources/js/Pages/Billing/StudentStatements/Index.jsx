import { Head, Link } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { FileText, Receipt } from "lucide-react";

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

export default function Index({ statements }) {
    return (
        <AuthenticatedLayout>
            <Head title="My Fee Statements" />

            <div className="mx-auto w-full max-w-7xl animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="rounded-[2rem] bg-[#1b263b] px-8 py-8 text-white shadow-xl">
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-300">
                        Finance
                    </p>
                    <h1 className="mt-3 text-3xl font-bold tracking-tight">
                        My Fee Statements
                    </h1>
                    <p className="mt-2 max-w-2xl text-sm text-slate-300">
                        View your billed sessions, balances, and printable fee
                        statements.
                    </p>
                </div>

                <div className="mt-6 flex items-center justify-between">
                    <Link
                        href={route("student.dashboard")}
                        className="text-sm font-medium text-emerald-700 transition hover:text-emerald-800"
                    >
                        Back to dashboard
                    </Link>
                </div>

                <div className="mt-6 overflow-hidden rounded-[1.75rem] border border-zinc-100 bg-white shadow-sm">
                    <div className="flex items-center justify-between border-b border-zinc-100 px-6 py-5">
                        <div>
                            <h2 className="text-lg font-semibold text-zinc-900">
                                Statement History
                            </h2>
                            <p className="mt-1 text-sm text-zinc-500">
                                Open any statement to see detailed charges and
                                payments.
                            </p>
                        </div>
                        <div className="rounded-2xl bg-emerald-50 p-3 text-emerald-600">
                            <Receipt className="h-5 w-5" />
                        </div>
                    </div>

                    {statements?.data?.length ? (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-zinc-100">
                                <thead className="bg-zinc-50">
                                    <tr className="text-left text-xs font-semibold uppercase tracking-wide text-zinc-500">
                                        <th className="px-6 py-4">
                                            Statement
                                        </th>
                                        <th className="px-6 py-4">Session</th>
                                        <th className="px-6 py-4">Coverage</th>
                                        <th className="px-6 py-4">
                                            Issue Date
                                        </th>
                                        <th className="px-6 py-4">Due Date</th>
                                        <th className="px-6 py-4 text-right">
                                            Amount
                                        </th>
                                        <th className="px-6 py-4 text-right">
                                            Paid
                                        </th>
                                        <th className="px-6 py-4 text-right">
                                            Balance
                                        </th>
                                        <th className="px-6 py-4">Status</th>
                                        <th className="px-6 py-4 text-right">
                                            Action
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-zinc-100 bg-white">
                                    {statements.data.map((statement) => (
                                        <tr
                                            key={statement.id}
                                            className="text-sm text-zinc-700"
                                        >
                                            <td className="px-6 py-4">
                                                <p className="font-semibold text-zinc-900">
                                                    {statement.statement_reference}
                                                </p>
                                                <p className="mt-1 text-xs text-zinc-500">
                                                    {statement.invoice_count} invoice
                                                    {statement.invoice_count === 1
                                                        ? ""
                                                        : "s"}
                                                </p>
                                            </td>
                                            <td className="px-6 py-4">
                                                {statement.session ??
                                                    "Session not linked"}
                                            </td>
                                            <td className="px-6 py-4 text-zinc-500">
                                                {statement.transaction_count} transaction
                                                {statement.transaction_count === 1
                                                    ? ""
                                                    : "s"}
                                            </td>
                                            <td className="px-6 py-4">
                                                {statement.issue_date ?? "-"}
                                            </td>
                                            <td className="px-6 py-4">
                                                {statement.due_date ?? "-"}
                                            </td>
                                            <td className="px-6 py-4 text-right font-medium text-zinc-900">
                                                {currency(
                                                    statement.amount_due,
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-right text-emerald-700">
                                                {currency(
                                                    statement.paid_amount,
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-right font-semibold text-amber-700">
                                                {currency(
                                                    statement.balance_due,
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span
                                                    className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                                                        statusClasses[
                                                            statement.status
                                                        ] ??
                                                        "bg-slate-100 text-slate-600"
                                                    }`}
                                                >
                                                    {statement.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <Link
                                                    href={route(
                                                        "student.fee-statements.show",
                                                        statement.id,
                                                    )}
                                                    className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-3 py-2 text-xs font-semibold text-white transition hover:bg-slate-700"
                                                >
                                                    <FileText className="h-4 w-4" />
                                                    View
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="px-6 py-16 text-center">
                            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-zinc-100 text-zinc-500">
                                <FileText className="h-8 w-8" />
                            </div>
                            <h3 className="mt-5 text-lg font-semibold text-zinc-900">
                                No statements yet
                            </h3>
                            <p className="mt-2 text-sm text-zinc-500">
                                Your fee statements will appear here after
                                invoicing.
                            </p>
                        </div>
                    )}

                    {statements?.last_page > 1 ? (
                        <div className="flex items-center justify-between border-t border-zinc-100 px-6 py-4 text-sm">
                            <p className="text-zinc-500">
                                Page {statements.current_page} of{" "}
                                {statements.last_page}
                            </p>
                            <div className="flex items-center gap-2">
                                {statements.links
                                    ?.filter((link) => link.label !== "&laquo; Previous" && link.label !== "Next &raquo;")
                                    .map((link, index) => (
                                        <Link
                                            key={`${link.label}-${index}`}
                                            href={link.url || "#"}
                                            preserveScroll
                                            className={`rounded-lg px-3 py-1.5 ${
                                                link.active
                                                    ? "bg-slate-900 text-white"
                                                    : "bg-zinc-100 text-zinc-700"
                                            } ${!link.url ? "pointer-events-none opacity-40" : ""}`}
                                            dangerouslySetInnerHTML={{
                                                __html: link.label,
                                            }}
                                        />
                                    ))}
                            </div>
                        </div>
                    ) : null}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
