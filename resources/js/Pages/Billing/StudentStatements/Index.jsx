import { Head, Link } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import formatDate from "@/utils/date";
import { ArrowRight, FileText } from "lucide-react";

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

export default function Index({ statements }) {
    const rows = statements?.data || [];

    return (
        <AuthenticatedLayout>
            <Head title="My Fee Statements" />

            <div className="mx-auto w-full max-w-7xl space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <section className="overflow-hidden rounded-[1.75rem] border border-zinc-100 bg-white shadow-sm">
                    <div className="border-b border-zinc-100 px-6 py-5">
                        <h2 className="text-lg font-semibold text-zinc-900">
                            Statement History
                        </h2>
                        <p className="mt-1 text-sm text-zinc-500">
                            Open any statement to inspect charges, credits, and
                            the running balance for that session.
                        </p>
                    </div>

                    {rows.length ? (
                        <div className="grid gap-4 p-4 sm:p-6">
                            {rows.map((statement) => (
                                <article
                                    key={statement.id}
                                    className="rounded-[1.5rem] border border-zinc-100 bg-[linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)] p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-md"
                                >
                                    <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                                        <div className="space-y-4">
                                            <div className="flex flex-wrap items-center gap-3">
                                                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-zinc-500">
                                                    {
                                                        statement.statement_reference
                                                    }
                                                </p>
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
                                            </div>

                                            <div>
                                                <h3 className="text-xl font-semibold text-zinc-900">
                                                    {statement.session ??
                                                        "Session not linked"}
                                                </h3>
                                                <p className="mt-1 text-sm text-zinc-500">
                                                    {statement.invoice_count}{" "}
                                                    invoice
                                                    {statement.invoice_count ===
                                                    1
                                                        ? ""
                                                        : "s"}{" "}
                                                    and{" "}
                                                    {
                                                        statement.transaction_count
                                                    }{" "}
                                                    ledger{" "}
                                                    {statement.transaction_count ===
                                                    1
                                                        ? "entry"
                                                        : "entries"}
                                                </p>
                                            </div>

                                            <div className="grid gap-3 sm:grid-cols-3">
                                                <MiniMetric
                                                    label="Charges"
                                                    value={currency(
                                                        statement.amount_due,
                                                    )}
                                                />
                                                <MiniMetric
                                                    label="Paid"
                                                    value={currency(
                                                        statement.paid_amount,
                                                    )}
                                                />
                                                <MiniMetric
                                                    label="Balance"
                                                    value={currency(
                                                        statement.balance_due,
                                                    )}
                                                    emphasis
                                                />
                                            </div>
                                        </div>

                                        <div className="flex min-w-[220px] flex-col gap-4 lg:items-end">
                                            <div className="grid w-full gap-3 rounded-[1.25rem] border border-zinc-100 bg-white p-4 lg:max-w-xs">
                                                <MetaRow
                                                    label="Issue date"
                                                    value={formatDate(
                                                        statement.issue_date,
                                                    )}
                                                />
                                                <MetaRow
                                                    label="Due date"
                                                    value={formatDate(
                                                        statement.due_date,
                                                    )}
                                                />
                                            </div>

                                            <Link
                                                href={route(
                                                    "student.fee-statements.show",
                                                    statement.id,
                                                )}
                                                className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700"
                                            >
                                                Open statement
                                                <ArrowRight className="h-4 w-4" />
                                            </Link>
                                        </div>
                                    </div>
                                </article>
                            ))}
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
                                session invoicing starts.
                            </p>
                        </div>
                    )}

                    {statements?.last_page > 1 ? (
                        <div className="flex flex-col gap-3 border-t border-zinc-100 px-6 py-4 text-sm sm:flex-row sm:items-center sm:justify-between">
                            <p className="text-zinc-500">
                                Page {statements.current_page} of{" "}
                                {statements.last_page}
                            </p>
                            <div className="flex flex-wrap items-center gap-2">
                                {statements.links
                                    ?.filter(
                                        (link) =>
                                            link.label !== "&laquo; Previous" &&
                                            link.label !== "Next &raquo;",
                                    )
                                    .map((link, index) => (
                                        <Link
                                            key={`${link.label}-${index}`}
                                            href={link.url || "#"}
                                            preserveScroll
                                            className={`rounded-full px-3 py-1.5 ${
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
                </section>
            </div>
        </AuthenticatedLayout>
    );
}

function HeroStat({ icon: Icon, label, value }) {
    return (
        <div className="rounded-[1.5rem] border border-white/10 bg-white/10 p-4 backdrop-blur">
            <div className="inline-flex rounded-2xl bg-white/10 p-2 text-emerald-200">
                <Icon className="h-4 w-4" />
            </div>
            <p className="mt-3 text-xs uppercase tracking-[0.16em] text-slate-300">
                {label}
            </p>
            <p className="mt-2 text-lg font-semibold text-white">{value}</p>
        </div>
    );
}

function SummaryCard({ icon: Icon, label, value, helper, tone }) {
    return (
        <div className="rounded-[1.5rem] border border-zinc-100 bg-white p-5 shadow-sm">
            <div className={`inline-flex rounded-2xl p-3 ${tone}`}>
                <Icon className="h-5 w-5" />
            </div>
            <p className="mt-4 text-sm font-medium text-zinc-500">{label}</p>
            <p className="mt-1 text-2xl font-bold text-zinc-900">{value}</p>
            <p className="mt-1 text-sm text-zinc-500">{helper}</p>
        </div>
    );
}

function MiniMetric({ label, value, emphasis = false }) {
    return (
        <div className="rounded-2xl bg-white/80 px-4 py-3 ring-1 ring-zinc-100">
            <p className="text-xs uppercase tracking-[0.14em] text-zinc-500">
                {label}
            </p>
            <p
                className={`mt-1 text-base font-semibold ${
                    emphasis ? "text-amber-700" : "text-zinc-900"
                }`}
            >
                {value}
            </p>
        </div>
    );
}

function MetaRow({ label, value }) {
    return (
        <div className="flex items-center justify-between gap-4 text-sm">
            <span className="text-zinc-500">{label}</span>
            <span className="font-medium text-zinc-900">{value}</span>
        </div>
    );
}
