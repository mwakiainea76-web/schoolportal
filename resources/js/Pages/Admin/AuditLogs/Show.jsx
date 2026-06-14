import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";

export default function AuditLogShow({ auditLog }) {
    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-semibold text-zinc-900">
                            Audit Entry
                        </h1>
                        <p className="mt-2 text-sm text-zinc-600">
                            Review the full before-and-after payload and request
                            context for this action.
                        </p>
                    </div>
                    <Link
                        href={route("settings.audit-logs.index")}
                        className="rounded-xl border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50"
                    >
                        Back to Logs
                    </Link>
                </div>
            }
        >
            <Head title="Audit Entry" />

            <div className="mx-auto max-w-7xl space-y-6">
                <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    {[
                        ["Date", auditLog.created_at],
                        ["User", auditLog.user?.name || "System"],
                        ["Module", auditLog.module],
                        ["Action", auditLog.action],
                        ["Entity", auditLog.entity_label || `${auditLog.entity_type || "record"} #${auditLog.entity_id || "-"}`],
                        ["IP Address", auditLog.ip_address || "-"],
                        ["Request ID", auditLog.request_id || "-"],
                        ["Risk", auditLog.is_high_risk ? "High Risk" : "Standard"],
                    ].map(([label, value]) => (
                        <div
                            key={label}
                            className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm"
                        >
                            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-zinc-400">
                                {label}
                            </p>
                            <p className="mt-3 text-sm font-medium text-zinc-900">
                                {value}
                            </p>
                        </div>
                    ))}
                </section>

                <section className="grid gap-6 xl:grid-cols-2">
                    <PayloadCard title="Before Values" payload={auditLog.old_values} />
                    <PayloadCard title="After Values" payload={auditLog.new_values} />
                </section>

                <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
                    <h2 className="text-lg font-semibold text-zinc-900">
                        Metadata
                    </h2>
                    <pre className="mt-4 overflow-x-auto rounded-2xl bg-zinc-950 p-5 text-sm text-zinc-100">
                        {JSON.stringify(auditLog.metadata || {}, null, 2)}
                    </pre>
                </section>
            </div>
        </AuthenticatedLayout>
    );
}

function PayloadCard({ title, payload }) {
    return (
        <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-zinc-900">{title}</h2>
            <pre className="mt-4 overflow-x-auto rounded-2xl bg-zinc-950 p-5 text-sm text-zinc-100">
                {JSON.stringify(payload || {}, null, 2)}
            </pre>
        </section>
    );
}
