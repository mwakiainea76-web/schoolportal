import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";

export default function AuditLogShow({ auditLog }) {
    const changedRows = buildChangedRows(
        auditLog.old_values_display || auditLog.old_values,
        auditLog.new_values_display || auditLog.new_values
    );

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <h1 className="text-2xl font-semibold text-zinc-900">
                        Audit Log Details
                    </h1>
                    <Link
                        href={route("settings.audit-logs.index")}
                        className="inline-flex w-fit rounded-md border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50"
                    >
                        Back to Logs
                    </Link>
                </div>
            }
        >
            <Head title="Audit Log Details" />

            <div className="mx-auto max-w-7xl space-y-5">
                <section className="rounded-lg border border-zinc-200 bg-white shadow-sm">
                    <div className="border-b border-zinc-200 px-5 py-4">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                            <div>
                                <p className="text-xs font-semibold uppercase text-zinc-500">
                                    Event Summary
                                </p>
                                <div className="mt-2 text-base leading-7 text-zinc-900">
                                    <EventDescription log={auditLog} />
                                </div>
                            </div>
                            <ActivityBadge
                                label={
                                    auditLog.action_label || auditLog.action
                                }
                            />
                        </div>

                        {auditLog.change_summary?.length ? (
                            <div className="mt-4 rounded-md border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm leading-6 text-zinc-700">
                                {auditLog.change_summary.map((line) => (
                                    <p key={line}>- {line}</p>
                                ))}
                            </div>
                        ) : null}
                    </div>

                    <div className="grid gap-4 p-5 sm:grid-cols-2 lg:grid-cols-4">
                        <SummaryItem
                            label="User"
                            value={auditLog.user?.name || "System"}
                        />
                        <SummaryItem
                            label="Date & Time"
                            value={auditLog.created_at}
                        />
                        <SummaryItem
                            label="Platform"
                            value={auditLog.platform || "Web"}
                        />
                        <SummaryItem
                            label="Risk"
                            value={
                                auditLog.is_high_risk ? "High Risk" : "Standard"
                            }
                        />
                    </div>
                </section>

                <section className="overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm">
                    <div className="border-b border-zinc-200 px-4 py-4">
                        <h2 className="text-base font-semibold text-zinc-900">
                            Changed Values
                        </h2>
                    </div>

                    {changedRows.length ? (
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[48rem] border-collapse text-sm">
                                <thead>
                                    <tr className="border-b border-zinc-200 bg-zinc-50 text-left font-semibold text-zinc-900">
                                        <th className="w-[28%] px-4 py-3">
                                            Field
                                        </th>
                                        <th className="w-[36%] px-4 py-3">
                                            Before
                                        </th>
                                        <th className="w-[36%] px-4 py-3">
                                            After
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {changedRows.map((row) => (
                                        <tr
                                            key={row.field}
                                            className="border-b border-zinc-200 last:border-b-0"
                                        >
                                            <td className="px-4 py-3 font-medium text-zinc-900">
                                                {humanize(row.field)}
                                            </td>
                                            <td className="px-4 py-3 text-zinc-700">
                                                {formatValue(row.before)}
                                            </td>
                                            <td className="px-4 py-3 text-zinc-700">
                                                {formatValue(row.after)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="px-5 py-6">
                            <div className="rounded-md border border-dashed border-zinc-300 bg-zinc-50 px-4 py-4 text-sm text-zinc-600">
                                No field-level changes were stored for this
                                action.
                            </div>
                        </div>
                    )}
                </section>

                <section className="rounded-lg border border-zinc-200 bg-white shadow-sm">
                    <div className="border-b border-zinc-200 px-4 py-4">
                        <h2 className="text-base font-semibold text-zinc-900">
                            Request Context
                        </h2>
                    </div>

                    <div className="grid gap-4 p-5 md:grid-cols-2 xl:grid-cols-3">
                        <ContextItem
                            label="Module"
                            value={auditLog.module_label || auditLog.module || "-"}
                        />
                        <ContextItem
                            label="Entity"
                            value={
                                <>
                                    {auditLog.entity_record_label ||
                                        auditLog.entity_type ||
                                        "Record"}
                                    {auditLog.entity_id
                                        ? ` (ID: ${auditLog.entity_id})`
                                        : ""}
                                </>
                            }
                        />
                        <ContextItem
                            label="IP Address"
                            value={auditLog.ip_address || "-"}
                        />
                        <ContextItem
                            label="Request ID"
                            value={auditLog.request_id || "-"}
                        />
                    </div>
                </section>
            </div>
        </AuthenticatedLayout>
    );
}

function SummaryItem({ label, value }) {
    return (
        <div className="rounded-md border border-zinc-200 bg-white px-4 py-3">
            <p className="text-xs font-medium uppercase text-zinc-500">
                {label}
            </p>
            <p className="mt-1 text-sm font-semibold text-zinc-900">{value}</p>
        </div>
    );
}

function ContextItem({ label, value }) {
    return (
        <div className="rounded-md bg-zinc-50 px-4 py-3">
            <p className="text-xs font-medium uppercase text-zinc-500">
                {label}
            </p>
            <p className="mt-1 break-words text-sm font-medium text-zinc-900">
                {value}
            </p>
        </div>
    );
}

function ActivityBadge({ label }) {
    const normalized = String(label || "Activity").toLowerCase();
    const styles = normalized.includes("delete")
        ? "bg-red-600 text-white"
        : normalized.includes("create")
          ? "bg-emerald-600 text-white"
          : "bg-blue-600 text-white";

    return (
        <span
            className={`inline-flex rounded px-2 py-1 text-xs font-medium ${styles}`}
        >
            {label || "Activity"}
        </span>
    );
}

function EventDescription({ log }) {
    if (!log.event_description) {
        return (
            <p>
                {log.entity_record_label || log.entity_type || "Record"}{" "}
                {log.entity_id ? `(ID: ${log.entity_id})` : ""}
            </p>
        );
    }

    if (!log.entity_record_label) {
        return <p>{log.event_description}</p>;
    }

    const [before, ...afterParts] = log.event_description.split(
        log.entity_record_label
    );

    if (!afterParts.length) {
        return <p>{log.event_description}</p>;
    }

    return (
        <p>
            {before}
            <strong>{log.entity_record_label}</strong>
            {afterParts.join(log.entity_record_label)}
        </p>
    );
}

function buildChangedRows(before = {}, after = {}) {
    const beforeValues = isPlainObject(before) ? before : {};
    const afterValues = isPlainObject(after) ? after : {};
    const fields = Array.from(
        new Set([...Object.keys(beforeValues), ...Object.keys(afterValues)])
    );

    return fields.map((field) => ({
        field,
        before: beforeValues[field],
        after: afterValues[field],
    }));
}

function formatValue(value) {
    if (value === null || value === undefined || value === "") {
        return <span className="italic text-zinc-500">null</span>;
    }

    if (typeof value === "boolean") {
        return value ? "Yes" : "No";
    }

    if (Array.isArray(value)) {
        return value.length ? value.join(", ") : "-";
    }

    if (isPlainObject(value)) {
        return Object.entries(value)
            .map(([key, item]) => `${humanize(key)}: ${item}`)
            .join(", ");
    }

    return String(value);
}

function humanize(value) {
    return String(value || "")
        .replace(/_/g, " ")
        .replace(/\b\w/g, (char) => char.toUpperCase());
}

function isPlainObject(value) {
    return value && typeof value === "object" && !Array.isArray(value);
}
