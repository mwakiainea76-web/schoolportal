import { Head, Link, router, useForm } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function UserMonitor({ filters, roles, summary, users }) {
    const form = useForm({
        role: filters.role || "",
    });

    const submit = (e) => {
        e.preventDefault();
        router.get(route("settings.user-monitor.index"), form.data, {
            preserveScroll: true,
            preserveState: true,
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <h1 className="text-3xl font-semibold text-zinc-900">
                            User Monitor
                        </h1>
                        <p className="mt-2 max-w-3xl text-sm text-zinc-600">
                            On-demand visibility into currently online users,
                            filtered by role and backed directly by the database
                            sessions table.
                        </p>
                    </div>
                    <Link
                        href={route("settings.logs.index")}
                        className="rounded-xl border border-zinc-200 bg-white px-5 py-3 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50"
                    >
                        View Logs
                    </Link>
                </div>
            }
        >
            <Head title="User Monitor" />

            <div className="mx-auto max-w-7xl space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                    <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                                    Currently Online
                                </p>
                                <p className="mt-2 text-3xl font-semibold text-zinc-900">
                                    {summary.online_users}
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={() => router.reload({ preserveScroll: true })}
                                className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-100"
                            >
                                <svg
                                    className="h-4 w-4"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M21 12a9 9 0 1 1-2.64-6.36M21 3v6h-6"
                                    />
                                </svg>
                                Refresh
                            </button>
                        </div>
                    </div>
                    <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
                        <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                            Queried At
                        </p>
                        <p className="mt-2 text-lg font-semibold text-zinc-900">
                            {new Date(summary.queried_at).toLocaleString()}
                        </p>
                    </div>
                </div>

                {!summary.using_database_sessions ? (
                    <div className="rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-900 shadow-sm">
                        This feature reads directly from the database
                        `sessions` table. Your app is not currently using the
                        database session driver, so the count may remain zero
                        until you set <span className="font-semibold">SESSION_DRIVER=database</span> and sign in again.
                    </div>
                ) : null}

                <form
                    onSubmit={submit}
                    className="grid gap-4 rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm lg:grid-cols-[1fr,auto]"
                >
                    <div>
                        <label className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                            Role
                        </label>
                        <select
                            value={form.data.role}
                            onChange={(e) => form.setData("role", e.target.value)}
                            className="mt-2 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-400"
                        >
                            <option value="">All roles</option>
                            {roles.map((role) => (
                                <option key={role} value={role}>
                                    {role}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex items-end">
                        <button
                            type="submit"
                            className="w-full rounded-xl bg-emerald-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-emerald-700"
                        >
                            Apply
                        </button>
                    </div>
                </form>

                <div className="overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm">
                    <div className="flex items-center justify-between border-b border-zinc-100 bg-zinc-50 px-6 py-4">
                        <h2 className="text-lg font-semibold text-zinc-900">
                            Online Users
                        </h2>
                        <span className="text-sm text-zinc-500">
                            Showing {users.from ?? 0}-{users.to ?? 0} of{" "}
                            {users.total ?? 0}
                        </span>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[64rem] border-collapse">
                            <thead className="bg-zinc-50">
                                <tr className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                                    <th className="px-4 py-3 text-left">
                                        Login ID
                                    </th>
                                    <th className="px-4 py-3 text-left">
                                        Name
                                    </th>
                                    <th className="px-4 py-3 text-left">
                                        Email
                                    </th>
                                    <th className="px-4 py-3 text-left">
                                        Roles
                                    </th>
                                    <th className="px-4 py-3 text-left">
                                        Last Activity
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-100 bg-white">
                                {users.data.length ? (
                                    users.data.map((user) => (
                                        <tr key={user.id} className="text-sm">
                                            <td className="px-4 py-3 text-zinc-700">
                                                {user.login_id || "-"}
                                            </td>
                                            <td className="px-4 py-3 font-medium text-zinc-900">
                                                {[user.first_name, user.last_name]
                                                    .filter(Boolean)
                                                    .join(" ") || "-"}
                                            </td>
                                            <td className="px-4 py-3 text-zinc-700">
                                                {user.email || "-"}
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex flex-wrap gap-2">
                                                    {user.roles.length ? (
                                                        user.roles.map((role) => (
                                                            <span
                                                                key={role}
                                                                className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-semibold text-zinc-700"
                                                            >
                                                                {role}
                                                            </span>
                                                        ))
                                                    ) : (
                                                        <span className="text-zinc-500">
                                                            -
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 text-zinc-700">
                                                {user.last_activity || "-"}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan="5"
                                            className="px-4 py-8 text-center text-sm text-zinc-500"
                                        >
                                            No online users matched the selected
                                            filters.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <Pagination pagination={users} />
                </div>
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
        <div className="flex flex-col gap-3 border-t border-zinc-100 bg-zinc-50 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
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
