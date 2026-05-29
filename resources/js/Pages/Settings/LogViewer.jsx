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
    const form = useForm({
        file: filters.file || "laravel.log",
        level: filters.level || "",
        search: filters.search || "",
        lines: filters.lines || "250",
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
                    <button
                        type="button"
                        onClick={refresh}
                        className="rounded-xl bg-zinc-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-zinc-800"
                    >
                        Refresh
                    </button>
                </div>
            }
        >
            <Head title="Log Files" />

            <div className="mx-auto max-w-7xl space-y-6">
                <form
                    onSubmit={submit}
                    className="grid gap-4 rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm lg:grid-cols-[1.2fr,0.7fr,0.7fr,1fr,auto]"
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
                        <span className="text-sm text-zinc-500">
                            {log.entries.length} entries
                        </span>
                    </div>

                    {log.entries.length ? (
                        <div className="divide-y divide-zinc-100">
                            {log.entries.map((entry, index) => (
                                <details
                                    key={`${entry.timestamp}-${index}`}
                                    className="group px-6 py-4"
                                    open={index === log.entries.length - 1}
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
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
