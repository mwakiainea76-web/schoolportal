import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import TextInput from "@/Components/TextInput";
import { Head, Link, router, useForm } from "@inertiajs/react";

export default function AuditLogIndex({ logs, filters }) {
    const rows = logs?.data ?? [];
    const form = useForm({
        search: filters.search || "",
        per_page: String(filters.per_page || 10),
    });

    const applyFilters = (data = form.data) => {
        router.get(route("settings.audit-logs.index"), data, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    const handleSearch = (e) => {
        e.preventDefault();
        applyFilters({ ...form.data, page: 1 });
    };

    const handlePerPageChange = (e) => {
        const nextData = {
            ...form.data,
            per_page: e.target.value,
            page: 1,
        };

        form.setData("per_page", e.target.value);
        applyFilters(nextData);
    };

    return (
        <AuthenticatedLayout
            header={
                <h1 className="text-2xl font-semibold text-zinc-900">
                    System Activity Logs
                </h1>
            }
        >
            <Head title="System Activity Logs" />

            <div className="mx-auto max-w-7xl">
                <section className="overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm">
                    <div className="border-b border-zinc-200 px-4 py-4">
                        <h2 className="text-base font-semibold text-zinc-900">
                            System Activity Logs
                        </h2>
                    </div>

                    <div className="flex flex-col gap-4 px-4 py-5 sm:flex-row sm:items-center sm:justify-between">
                        <label className="flex items-center gap-2 text-sm text-zinc-900">
                            <span>Show</span>
                            <select
                                value={form.data.per_page}
                                onChange={handlePerPageChange}
                                className="rounded-md border-zinc-300 py-2 text-sm shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                            >
                                {[10, 25, 50, 100].map((size) => (
                                    <option key={size} value={size}>
                                        {size}
                                    </option>
                                ))}
                            </select>
                            <span>entries</span>
                        </label>

                        <form
                            onSubmit={handleSearch}
                            className="flex items-center gap-2 sm:justify-end"
                        >
                            <label
                                htmlFor="audit-search"
                                className="text-sm text-zinc-900"
                            >
                                Search:
                            </label>
                            <TextInput
                                id="audit-search"
                                value={form.data.search}
                                onChange={(e) =>
                                    form.setData("search", e.target.value)
                                }
                                className="h-10 w-full sm:w-44"
                            />
                        </form>
                    </div>

                    <div className="overflow-x-auto px-4">
                        <table className="w-full min-w-[72rem] border-collapse border border-zinc-200">
                            <thead>
                                <tr className="border-b border-zinc-200 bg-white text-left text-sm font-semibold text-zinc-900">
                                    <th className="w-[14%] border-r border-zinc-200 px-3 py-3">
                                        User
                                    </th>
                                    <th className="w-[12%] border-r border-zinc-200 px-3 py-3">
                                        Activity
                                    </th>
                                    <th className="w-[10%] border-r border-zinc-200 px-3 py-3">
                                        Platform
                                    </th>
                                    <th className="border-r border-zinc-200 px-3 py-3">
                                        Event Details
                                    </th>
                                    <th className="w-[20%] px-3 py-3">
                                        Date & Time
                                    </th>
                                    <th className="w-[10%] px-3 py-3">
                                        Details
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {rows.length ? (
                                    rows.map((log) => (
                                        <tr
                                            key={log.id}
                                            className="border-b border-zinc-200 odd:bg-zinc-50 even:bg-white"
                                        >
                                            <td className="border-r border-zinc-200 px-3 py-4 align-top text-sm text-zinc-900">
                                                {log.user?.name || "System"}
                                            </td>
                                            <td className="border-r border-zinc-200 px-3 py-4 align-top">
                                                <ActivityBadge
                                                    label={
                                                        log.action_label ||
                                                        log.action
                                                    }
                                                />
                                            </td>
                                            <td className="border-r border-zinc-200 px-3 py-4 align-top text-sm text-zinc-900">
                                                {log.platform || "Web"}
                                            </td>
                                            <td className="border-r border-zinc-200 px-3 py-4 align-top text-sm text-zinc-900">
                                                <EventDescription log={log} />
                                                {log.change_summary?.length ? (
                                                    <div className="mt-2 rounded-md bg-white px-3 py-2 text-xs leading-6 text-zinc-700">
                                                        {log.change_summary.map(
                                                            (line) => (
                                                                <p key={line}>
                                                                    - {line}
                                                                </p>
                                                            )
                                                        )}
                                                    </div>
                                                ) : null}
                                            </td>
                                            <td className="border-r border-zinc-200 px-3 py-4 align-top text-sm text-zinc-900">
                                                {log.created_at}
                                            </td>
                                            <td className="px-3 py-4 align-top text-sm">
                                                <Link
                                                    href={route(
                                                        "settings.audit-logs.show",
                                                        log.id
                                                    )}
                                                    className="font-medium text-blue-700 hover:text-blue-900"
                                                >
                                                    View Details
                                                </Link>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan="6"
                                            className="px-4 py-12 text-center text-sm text-zinc-500"
                                        >
                                            No audit logs matched the search.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <Pagination pagination={logs} />
                </section>
            </div>
        </AuthenticatedLayout>
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
        <span className={`inline-flex rounded px-2 py-1 text-xs font-medium ${styles}`}>
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

function Pagination({ pagination }) {
    if (!pagination) {
        return null;
    }

    const current = Number(pagination.current_page ?? 1);
    const last = Number(pagination.last_page ?? 1);
    const total = Number(pagination.total ?? 0);
    const from = pagination.from ?? 0;
    const to = pagination.to ?? 0;

    const goToPage = (page) => {
        const params = new URLSearchParams(window.location.search);
        params.set("page", page);

        router.get(`${window.location.pathname}?${params.toString()}`, {}, {
            preserveScroll: true,
            preserveState: true,
            replace: true,
        });
    };

    return (
        <div className="flex flex-col gap-4 px-4 py-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-zinc-900">
                Showing {from} to {to} of {total} entries
            </p>

            {last > 1 ? (
                <div className="flex items-center justify-end">
                    <button
                        type="button"
                        disabled={current <= 1}
                        onClick={() => goToPage(current - 1)}
                        className="border border-zinc-300 bg-white px-4 py-2 text-sm text-zinc-600 transition hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        Previous
                    </button>
                    <span className="border-y border-orange-600 bg-orange-600 px-4 py-2 text-sm text-white">
                        {current}
                    </span>
                    <button
                        type="button"
                        disabled={current >= last}
                        onClick={() => goToPage(current + 1)}
                        className="border border-zinc-300 bg-white px-4 py-2 text-sm text-zinc-600 transition hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
            ) : null}
        </div>
    );
}
