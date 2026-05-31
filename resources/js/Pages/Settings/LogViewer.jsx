import { Head, router, useForm } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

const bytes = (value) => {
    const size = Number(value || 0);
    if (size < 1024) return `${size} B`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
    return `${(size / 1024 / 1024).toFixed(2)} MB`;
};

const levelClass = (level) =>
    ({
        emergency: "bg-red-100 text-red-800",
        alert: "bg-red-100 text-red-800",
        critical: "bg-red-100 text-red-800",
        error: "bg-red-100 text-red-800",
        warning: "bg-amber-100 text-amber-800",
        notice: "bg-blue-100 text-blue-800",
        info: "bg-emerald-100 text-emerald-800",
        debug: "bg-zinc-100 text-zinc-700",
    })[level] || "bg-zinc-100 text-zinc-700";

export default function LogViewer({ files, filters, log }) {
    const entries = log.entries?.data ?? [];
    const pagination = log.entries ?? {};
    const form = useForm({
        file: filters.file || "laravel.log",
        level: filters.level || "",
        search: filters.search || "",
        lines: filters.lines || "250",
        per_page: filters.per_page || "25",
    });

    const submit = (e) => {
        e.preventDefault();
        router.get(route("settings.logs.index"), form.data, {
            preserveScroll: true,
            preserveState: true,
        });
    };

    const refresh = () => {
        router.get(route("settings.logs.index"), form.data, {
            preserveScroll: true,
            preserveState: true,
            replace: true,
        });
    };

    const clearSelectedFile = () => {
        if (!form.data.file) {
            return;
        }

        const confirmed = window.confirm(
            `Clear all contents of ${form.data.file}? This keeps the file but removes its current log entries.`,
        );

        if (!confirmed) {
            return;
        }

        router.post(
            route("settings.logs.clear"),
            { file: form.data.file },
            {
                preserveScroll: true,
            },
        );
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <h1 className="text-3xl font-semibold text-zinc-900">
                            Log Files
                        </h1>
                        <p className="mt-2 max-w-3xl text-sm text-zinc-600">
                            Read recent application and performance log entries
                            without loading entire files into memory.
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={() => router.visit(route("settings.security.index"))}
                            className="rounded-xl border border-zinc-200 bg-white px-5 py-3 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50"
                        >
                            Security Monitor
                        </button>
                        <button
                            type="button"
                            onClick={refresh}
                            className="rounded-xl bg-zinc-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-zinc-800"
                        >
                            Refresh
                        </button>
                    </div>
                </div>
            }
        >
            <Head title="Log Files" />

            <div className="mx-auto max-w-7xl space-y-6">
                <form
                    onSubmit={submit}
                    className="grid gap-4 rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm lg:grid-cols-[1.2fr,0.7fr,0.7fr,0.7fr,1fr,auto]"
                >
                    <div>
                        <label className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                            File
                        </label>
                        <select
                            value={form.data.file}
                            onChange={(e) => form.setData("file", e.target.value)}
                            className="mt-2 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-400"
                        >
                            {files.map((file) => (
                                <option key={file.name} value={file.name}>
                                    {file.name} ({bytes(file.size_bytes)})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                            Level
                        </label>
                        <select
                            value={form.data.level}
                            onChange={(e) => form.setData("level", e.target.value)}
                            className="mt-2 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-400"
                        >
                            <option value="">All levels</option>
                            {[
                                "debug",
                                "info",
                                "notice",
                                "warning",
                                "error",
                                "critical",
                                "alert",
                                "emergency",
                            ].map((level) => (
                                <option key={level} value={level}>
                                    {level}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                            Tail Lines
                        </label>
                        <select
                            value={form.data.lines}
                            onChange={(e) => form.setData("lines", e.target.value)}
                            className="mt-2 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-400"
                        >
                            {["100", "250", "500", "1000"].map((count) => (
                                <option key={count} value={count}>
                                    {count}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                            Page Size
                        </label>
                        <select
                            value={form.data.per_page}
                            onChange={(e) => form.setData("per_page", e.target.value)}
                            className="mt-2 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-400"
                        >
                            {["10", "25", "50", "100"].map((count) => (
                                <option key={count} value={count}>
                                    {count}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                            Search
                        </label>
                        <input
                            type="search"
                            value={form.data.search}
                            onChange={(e) => form.setData("search", e.target.value)}
                            className="mt-2 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-400"
                            placeholder="route, exception, SQL..."
                        />
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

                <div className="grid gap-4 md:grid-cols-3">
                    <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
                        <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                            Selected File
                        </p>
                        <p className="mt-2 truncate text-lg font-semibold text-zinc-900">
                            {log.file}
                        </p>
                    </div>
                    <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
                        <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                            File Size
                        </p>
                        <p className="mt-2 text-lg font-semibold text-zinc-900">
                            {bytes(log.size_bytes)}
                        </p>
                    </div>
                    <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
                        <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                            Updated
                        </p>
                        <p className="mt-2 text-lg font-semibold text-zinc-900">
                            {log.updated_at || "-"}
                        </p>
                    </div>
                </div>

                <div className="overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm">
                    <div className="flex items-center justify-between border-b border-zinc-100 bg-zinc-50 px-6 py-4">
                        <h2 className="text-lg font-semibold text-zinc-900">
                            Recent Entries
                        </h2>
                        <div className="flex items-center gap-4">
                            <span className="text-sm text-zinc-500">
                                Showing {pagination.from ?? 0}-{pagination.to ?? 0} of{" "}
                                {pagination.total ?? 0} entries
                            </span>
                            <button
                                type="button"
                                onClick={clearSelectedFile}
                                className="rounded-xl bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700"
                            >
                                Clear File
                            </button>
                        </div>
                    </div>

                    {entries.length ? (
                        <div className="divide-y divide-zinc-100">
                            {entries.map((entry, index) => (
                                <details
                                    key={`${entry.timestamp}-${index}`}
                                    className="group px-6 py-4"
                                    open={index === 0}
                                >
                                    <summary className="flex cursor-pointer list-none items-start gap-4">
                                        <span
                                            className={`rounded-full px-3 py-1 text-xs font-semibold ${levelClass(
                                                entry.level,
                                            )}`}
                                        >
                                            {entry.level}
                                        </span>
                                        <div className="min-w-0 flex-1">
                                            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                                                <p className="truncate text-sm font-semibold text-zinc-900">
                                                    {entry.message}
                                                </p>
                                                <p className="shrink-0 text-xs text-zinc-500">
                                                    {entry.timestamp}
                                                </p>
                                            </div>
                                        </div>
                                    </summary>
                                    <pre className="mt-4 max-h-96 overflow-auto rounded-2xl bg-zinc-950 p-4 text-xs leading-6 text-zinc-100">
                                        {entry.raw}
                                    </pre>
                                </details>
                            ))}
                        </div>
                    ) : (
                        <div className="px-6 py-12 text-center text-sm text-zinc-500">
                            No log entries matched the selected filters.
                        </div>
                    )}

                    <Pagination pagination={pagination} />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

function Pagination({ pagination }) {
    if (!pagination || Number(pagination.last_page ?? 1) <= 1) {
        return null;
    }

    const goToPage = (page) => {
        const params = new URLSearchParams(window.location.search);
        params.set("page", page);

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

    const current = Number(pagination.current_page ?? 1);
    const last = Number(pagination.last_page ?? 1);
    const start = Math.max(1, current - 2);
    const end = Math.min(last, current + 2);
    const pages = Array.from({ length: end - start + 1 }, (_, index) => start + index);

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
