import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import SearchSelect from "@/Components/SearchSelect";
import TextInput from "@/Components/TextInput";
import { Head, Link, router, useForm } from "@inertiajs/react";

export default function AuditLogIndex({ logs, filters, users }) {
    const rows = logs?.data ?? [];
    const form = useForm({
        date_from: filters.date_from || "",
        date_to: filters.date_to || "",
        user_id: filters.user_id || "",
        module: filters.module || "",
        action: filters.action || "",
        entity_type: filters.entity_type || "",
        high_risk: filters.high_risk || "",
        search: filters.search || "",
    });

    const submit = (e) => {
        e.preventDefault();
        router.get(route("settings.audit-logs.index"), form.data, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    const exportUrl = route("api.audit-logs.export", form.data);

    return (
        <AuthenticatedLayout
            header={
                <div>
                    <h1 className="text-3xl font-semibold text-zinc-900">
                        Audit Logs
                    </h1>
                    <p className="mt-2 max-w-3xl text-sm text-zinc-600">
                        Review who changed what, when it happened, and the
                        before-and-after values for critical business actions.
                    </p>
                </div>
            }
        >
            <Head title="Audit Logs" />

            <div className="mx-auto max-w-7xl space-y-6">
                <form
                    onSubmit={submit}
                    className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm"
                >
                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                        <div>
                            <InputLabel value="Date From" />
                            <TextInput
                                type="date"
                                value={form.data.date_from}
                                onChange={(e) => form.setData("date_from", e.target.value)}
                                className="mt-2 w-full"
                            />
                        </div>
                        <div>
                            <InputLabel value="Date To" />
                            <TextInput
                                type="date"
                                value={form.data.date_to}
                                onChange={(e) => form.setData("date_to", e.target.value)}
                                className="mt-2 w-full"
                            />
                        </div>
                        <div>
                            <InputLabel value="User" />
                            <div className="mt-2">
                                <SearchSelect
                                    value={form.data.user_id}
                                    defaultOptions={users}
                                    placeholder="Search or select user..."
                                    onChange={(user) =>
                                        form.setData("user_id", user?.id ?? "")
                                    }
                                />
                            </div>
                        </div>
                        <div>
                            <InputLabel value="Module" />
                            <TextInput
                                value={form.data.module}
                                onChange={(e) => form.setData("module", e.target.value)}
                                className="mt-2 w-full"
                                placeholder="finance, students, auth..."
                            />
                        </div>
                        <div>
                            <InputLabel value="Action" />
                            <TextInput
                                value={form.data.action}
                                onChange={(e) => form.setData("action", e.target.value)}
                                className="mt-2 w-full"
                                placeholder="payment_recorded"
                            />
                        </div>
                        <div>
                            <InputLabel value="Entity Type" />
                            <TextInput
                                value={form.data.entity_type}
                                onChange={(e) => form.setData("entity_type", e.target.value)}
                                className="mt-2 w-full"
                                placeholder="student, role, payment..."
                            />
                        </div>
                        <div>
                            <InputLabel value="High Risk Only" />
                            <select
                                value={form.data.high_risk}
                                onChange={(e) => form.setData("high_risk", e.target.value)}
                                className="mt-2 w-full rounded-xl border-zinc-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                            >
                                <option value="">All actions</option>
                                <option value="true">High risk only</option>
                                <option value="false">Standard only</option>
                            </select>
                        </div>
                        <div>
                            <InputLabel value="Search" />
                            <TextInput
                                value={form.data.search}
                                onChange={(e) => form.setData("search", e.target.value)}
                                className="mt-2 w-full"
                                placeholder="entity, request ID, module..."
                            />
                        </div>
                    </div>

                    <div className="mt-5 flex flex-wrap justify-end gap-3">
                        <a
                            href={exportUrl}
                            className="inline-flex items-center rounded-xl border border-zinc-200 px-5 py-3 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50"
                        >
                            Export CSV
                        </a>
                        <PrimaryButton className="px-5 py-3">
                            Apply Filters
                        </PrimaryButton>
                    </div>
                </form>

                <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-zinc-900">
                            Audit Trail
                        </h2>
                        <p className="text-sm text-zinc-500">
                            Showing {logs.from ?? 0}-{logs.to ?? 0} of{" "}
                            {logs.total ?? 0} entries
                        </p>
                    </div>

                    <div className="mt-5 overflow-x-auto">
                        <table className="w-full min-w-[72rem] border-collapse">
                            <thead className="bg-zinc-50">
                                <tr className="text-left text-xs font-semibold uppercase tracking-wide text-zinc-500">
                                    <th className="px-4 py-3">Date</th>
                                    <th className="px-4 py-3">User</th>
                                    <th className="px-4 py-3">Module</th>
                                    <th className="px-4 py-3">Action</th>
                                    <th className="px-4 py-3">Entity</th>
                                    <th className="px-4 py-3">Status</th>
                                    <th className="px-4 py-3 text-right">View</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-100 bg-white">
                                {rows.length ? (
                                    rows.map((log) => (
                                        <tr key={log.id} className="text-sm">
                                            <td className="px-4 py-3 text-zinc-600">
                                                {log.created_at}
                                            </td>
                                            <td className="px-4 py-3 text-zinc-700">
                                                {log.user?.name || "System"}
                                            </td>
                                            <td className="px-4 py-3 font-medium capitalize text-zinc-900">
                                                {log.module}
                                            </td>
                                            <td className="px-4 py-3 text-zinc-700">
                                                {log.action}
                                            </td>
                                            <td className="px-4 py-3 text-zinc-700">
                                                {log.entity_label || `${log.entity_type || "record"} #${log.entity_id || "-"}`}
                                            </td>
                                            <td className="px-4 py-3">
                                                <span
                                                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                                        log.is_high_risk
                                                            ? "bg-red-100 text-red-700"
                                                            : "bg-emerald-100 text-emerald-700"
                                                    }`}
                                                >
                                                    {log.is_high_risk ? "High Risk" : "Standard"}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                <Link
                                                    href={route("settings.audit-logs.show", log.id)}
                                                    className="font-medium text-emerald-700 transition hover:text-emerald-800"
                                                >
                                                    Details
                                                </Link>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan="7"
                                            className="px-4 py-12 text-center text-sm text-zinc-500"
                                        >
                                            No audit logs matched the selected filters.
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

function Pagination({ pagination }) {
    if (!pagination || Number(pagination.last_page ?? 1) <= 1) {
        return null;
    }

    const current = Number(pagination.current_page ?? 1);
    const last = Number(pagination.last_page ?? 1);
    const start = Math.max(1, current - 2);
    const end = Math.min(last, current + 2);
    const pages = Array.from({ length: end - start + 1 }, (_, index) => start + index);

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
        <div className="mt-5 flex flex-col gap-3 border-t border-zinc-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-zinc-500">
                Page {current} of {last}
            </p>
            <div className="flex flex-wrap items-center gap-2">
                <button
                    type="button"
                    disabled={current <= 1}
                    onClick={() => goToPage(current - 1)}
                    className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-700 transition hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    Previous
                </button>
                {pages.map((page) => (
                    <button
                        type="button"
                        key={page}
                        onClick={() => goToPage(page)}
                        className={`rounded-lg px-3 py-2 text-sm transition ${
                            page === current
                                ? "bg-zinc-900 text-white"
                                : "border border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-100"
                        }`}
                    >
                        {page}
                    </button>
                ))}
                <button
                    type="button"
                    disabled={current >= last}
                    onClick={() => goToPage(current + 1)}
                    className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-700 transition hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    Next
                </button>
            </div>
        </div>
    );
}
