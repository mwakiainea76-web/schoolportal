import { Head, router, useForm } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

const riskTone = (risk) =>
    ({
        info: "bg-blue-50 text-blue-700",
        warning: "bg-amber-100 text-amber-800",
        high: "bg-orange-100 text-orange-800",
        critical: "bg-red-100 text-red-800",
    })[risk] || "bg-zinc-100 text-zinc-700";

export default function SecurityMonitoring({ events, blocks, filters, summary }) {
    const eventRows = events?.data ?? [];
    const blockRows = blocks?.data ?? [];
    const filterForm = useForm({
        risk: filters.risk || "",
        event: filters.event || "",
        search: filters.search || "",
    });

    const blockForm = useForm({
        subject: "",
        ip_address: "",
        device_id: "",
        location_hint: "",
        reason: "",
        notes: "",
        risk_level: "high",
        duration_minutes: "60",
    });

    const submitFilters = (e) => {
        e.preventDefault();
        router.get(route("settings.security.index"), filterForm.data, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const submitBlock = (e) => {
        e.preventDefault();
        blockForm.post(route("settings.security.blocks.store"), {
            preserveScroll: true,
            onSuccess: () =>
                blockForm.reset(
                    "subject",
                    "ip_address",
                    "device_id",
                    "location_hint",
                    "reason",
                    "notes",
                    "duration_minutes",
                ),
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <div>
                    <h1 className="text-3xl font-semibold text-zinc-900">
                        Security Monitoring
                    </h1>
                    <p className="mt-2 max-w-3xl text-sm text-zinc-600">
                        Review security audit events, investigate suspicious
                        authentication behavior, and apply targeted blocks by
                        user, IP, device, or location hint.
                    </p>
                </div>
            }
        >
            <Head title="Security Monitoring" />

            <div className="mx-auto max-w-7xl space-y-6">
                <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    {[
                        ["High Risk Events (24h)", summary.high_risk_events_24h],
                        ["Active Blocks", summary.active_blocks],
                        ["Failed Logins (24h)", summary.failed_logins_24h],
                        ["Forgot Password Risks (24h)", summary.forgot_password_risks_24h],
                    ].map(([label, value]) => (
                        <div
                            key={label}
                            className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm"
                        >
                            <p className="text-sm text-zinc-500">{label}</p>
                            <p className="mt-2 text-3xl font-bold text-zinc-900">
                                {value}
                            </p>
                        </div>
                    ))}
                </section>

                <section className="grid gap-6 xl:grid-cols-[1.1fr,0.9fr]">
                    <form
                        onSubmit={submitBlock}
                        className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm"
                    >
                        <h2 className="text-lg font-semibold text-zinc-900">
                            Create Security Block
                        </h2>
                        <p className="mt-1 text-sm text-zinc-500">
                            Specify one or more attributes. Only requests that
                            match all filled attributes will be blocked.
                        </p>

                        <div className="mt-5 grid gap-4 md:grid-cols-2">
                            <input
                                value={blockForm.data.subject}
                                onChange={(e) => blockForm.setData("subject", e.target.value)}
                                placeholder="User email or login ID"
                                className="rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-400"
                            />
                            <input
                                value={blockForm.data.ip_address}
                                onChange={(e) => blockForm.setData("ip_address", e.target.value)}
                                placeholder="IP address"
                                className="rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-400"
                            />
                            <input
                                value={blockForm.data.device_id}
                                onChange={(e) => blockForm.setData("device_id", e.target.value)}
                                placeholder="Device ID"
                                className="rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-400"
                            />
                            <input
                                value={blockForm.data.location_hint}
                                onChange={(e) => blockForm.setData("location_hint", e.target.value)}
                                placeholder="Location hint"
                                className="rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-400"
                            />
                            <input
                                value={blockForm.data.reason}
                                onChange={(e) => blockForm.setData("reason", e.target.value)}
                                placeholder="Reason"
                                className="rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-400 md:col-span-2"
                            />
                            <textarea
                                value={blockForm.data.notes}
                                onChange={(e) => blockForm.setData("notes", e.target.value)}
                                placeholder="Investigation notes"
                                className="min-h-24 rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-400 md:col-span-2"
                            />
                            <select
                                value={blockForm.data.risk_level}
                                onChange={(e) => blockForm.setData("risk_level", e.target.value)}
                                className="rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-400"
                            >
                                <option value="warning">Warning</option>
                                <option value="high">High</option>
                                <option value="critical">Critical</option>
                            </select>
                            <input
                                type="number"
                                min="5"
                                max="10080"
                                value={blockForm.data.duration_minutes}
                                onChange={(e) => blockForm.setData("duration_minutes", e.target.value)}
                                placeholder="Duration in minutes"
                                className="rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-400"
                            />
                        </div>

                        {Object.values(blockForm.errors).length ? (
                            <div className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">
                                {Object.values(blockForm.errors)[0]}
                            </div>
                        ) : null}

                        <div className="mt-5 flex justify-end">
                            <button
                                type="submit"
                                disabled={blockForm.processing}
                                className="rounded-xl bg-red-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-red-700 disabled:opacity-60"
                            >
                                {blockForm.processing ? "Saving..." : "Create Block"}
                            </button>
                        </div>
                    </form>

                    <form
                        onSubmit={submitFilters}
                        className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm"
                    >
                        <h2 className="text-lg font-semibold text-zinc-900">
                            Event Filters
                        </h2>
                        <div className="mt-5 grid gap-4">
                            <select
                                value={filterForm.data.risk}
                                onChange={(e) => filterForm.setData("risk", e.target.value)}
                                className="rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-400"
                            >
                                <option value="">All risk levels</option>
                                <option value="info">Info</option>
                                <option value="warning">Warning</option>
                                <option value="high">High</option>
                                <option value="critical">Critical</option>
                            </select>
                            <input
                                value={filterForm.data.event}
                                onChange={(e) => filterForm.setData("event", e.target.value)}
                                placeholder="Event type e.g. login.failed"
                                className="rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-400"
                            />
                            <input
                                value={filterForm.data.search}
                                onChange={(e) => filterForm.setData("search", e.target.value)}
                                placeholder="Search email, login, IP, device, location"
                                className="rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-400"
                            />
                        </div>
                        <div className="mt-5 flex justify-end">
                            <button
                                type="submit"
                                className="rounded-xl bg-zinc-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-zinc-800"
                            >
                                Apply Filters
                            </button>
                        </div>
                    </form>
                </section>

                <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-zinc-900">
                            Security Events
                        </h2>
                        <p className="text-sm text-zinc-500">
                            Showing {events.from ?? 0}-{events.to ?? 0} of{" "}
                            {events.total ?? 0} events
                        </p>
                    </div>

                    <div className="mt-5 overflow-x-auto">
                        <table className="w-full min-w-[78rem] border-collapse">
                            <thead className="bg-zinc-50">
                                <tr className="text-left text-xs font-semibold uppercase tracking-wide text-zinc-500">
                                    <th className="px-4 py-3">When</th>
                                    <th className="px-4 py-3">Event</th>
                                    <th className="px-4 py-3">Risk</th>
                                    <th className="px-4 py-3">User</th>
                                    <th className="px-4 py-3">Login</th>
                                    <th className="px-4 py-3">IP</th>
                                    <th className="px-4 py-3">Device</th>
                                    <th className="px-4 py-3">Location</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-100 bg-white">
                                {eventRows.length ? (
                                    eventRows.map((event) => (
                                        <tr key={event.id} className="text-sm">
                                            <td className="px-4 py-3 text-zinc-600">
                                                {event.occurred_at}
                                            </td>
                                            <td className="px-4 py-3 font-medium text-zinc-900">
                                                {event.event_type}
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${riskTone(event.risk_level)}`}>
                                                    {event.risk_level}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-zinc-700">
                                                {event.user?.name || "-"}
                                            </td>
                                            <td className="px-4 py-3 text-zinc-700">
                                                {event.login_identifier || event.email || "-"}
                                            </td>
                                            <td className="px-4 py-3 text-zinc-700">
                                                {event.ip_address || "-"}
                                            </td>
                                            <td className="px-4 py-3 text-zinc-700">
                                                {event.device_id || "-"}
                                            </td>
                                            <td className="px-4 py-3 text-zinc-700">
                                                {event.location_hint || "-"}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="8" className="px-4 py-10 text-center text-sm text-zinc-500">
                                            No security events found for the current filters.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    <Pagination pagination={events} pageName="events_page" />
                </section>

                <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-zinc-900">
                            Security Blocks
                        </h2>
                        <p className="text-sm text-zinc-500">
                            Showing {blocks.from ?? 0}-{blocks.to ?? 0} of{" "}
                            {blocks.total ?? 0} blocks
                        </p>
                    </div>

                    <div className="mt-5 overflow-x-auto">
                        <table className="w-full min-w-[72rem] border-collapse">
                            <thead className="bg-zinc-50">
                                <tr className="text-left text-xs font-semibold uppercase tracking-wide text-zinc-500">
                                    <th className="px-4 py-3">Reason</th>
                                    <th className="px-4 py-3">Status</th>
                                    <th className="px-4 py-3">User / Login</th>
                                    <th className="px-4 py-3">IP</th>
                                    <th className="px-4 py-3">Device</th>
                                    <th className="px-4 py-3">Location</th>
                                    <th className="px-4 py-3">Ends</th>
                                    <th className="px-4 py-3 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-100 bg-white">
                                {blockRows.length ? (
                                    blockRows.map((block) => (
                                        <tr key={block.id} className="text-sm">
                                            <td className="px-4 py-3 font-medium text-zinc-900">
                                                {block.reason}
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${block.is_active ? "bg-red-100 text-red-800" : "bg-zinc-100 text-zinc-700"}`}>
                                                    {block.is_active ? "Active" : "Lifted"}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-zinc-700">
                                                {block.user?.name || block.login_identifier || block.email || "-"}
                                            </td>
                                            <td className="px-4 py-3 text-zinc-700">{block.ip_address || "-"}</td>
                                            <td className="px-4 py-3 text-zinc-700">{block.device_id || "-"}</td>
                                            <td className="px-4 py-3 text-zinc-700">{block.location_hint || "-"}</td>
                                            <td className="px-4 py-3 text-zinc-700">{block.ends_at || "Manual"}</td>
                                            <td className="px-4 py-3 text-right">
                                                {block.is_active ? (
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            router.put(
                                                                route("settings.security.blocks.lift", block.id),
                                                                {},
                                                                { preserveScroll: true },
                                                            )
                                                        }
                                                        className="font-medium text-emerald-700 transition hover:text-emerald-800"
                                                    >
                                                        Lift
                                                    </button>
                                                ) : (
                                                    <span className="text-zinc-400">Closed</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="8" className="px-4 py-10 text-center text-sm text-zinc-500">
                                            No security blocks recorded yet.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    <Pagination pagination={blocks} pageName="blocks_page" />
                </section>
            </div>
        </AuthenticatedLayout>
    );
}

function Pagination({ pagination, pageName }) {
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
        params.set(pageName, page);

        router.get(
            `${window.location.pathname}?${params.toString()}`,
            {},
            {
                preserveScroll: true,
                preserveState: true,
                replace: true,
            },
        );
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
