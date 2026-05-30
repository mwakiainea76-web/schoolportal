import { Head, router } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

const number = (value) => new Intl.NumberFormat("en-KE").format(value || 0);
const ms = (value) => `${number(value)} ms`;

function Stat({ label, value, helper, tone = "emerald" }) {
    const tones = {
        emerald: "border-emerald-200 bg-emerald-50 text-emerald-700",
        amber: "border-amber-200 bg-amber-50 text-amber-700",
        rose: "border-rose-200 bg-rose-50 text-rose-700",
        zinc: "border-zinc-200 bg-zinc-50 text-zinc-700",
    };

    return (
        <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                {label}
            </p>
            <p className="mt-3 text-3xl font-semibold text-zinc-900">{value}</p>
            <p
                className={`mt-3 inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${
                    tones[tone]
                }`}
            >
                {helper}
            </p>
        </div>
    );
}

function BarList({ items, labelKey, valueKey, emptyText }) {
    const max = Math.max(...items.map((item) => item[valueKey] || 0), 1);

    if (!items.length) {
        return (
            <div className="py-8 text-center text-sm text-zinc-500">
                {emptyText}
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {items.map((item) => (
                <div key={item[labelKey]}>
                    <div className="mb-1 flex items-center justify-between text-xs">
                        <span className="font-medium text-zinc-700">
                            {item[labelKey]}
                        </span>
                        <span className="text-zinc-500">
                            {number(item[valueKey])}
                        </span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-zinc-100">
                        <div
                            className="h-full rounded-full bg-emerald-500"
                            style={{
                                width: `${(item[valueKey] / max) * 100}%`,
                            }}
                        />
                    </div>
                </div>
            ))}
        </div>
    );
}

export default function PerformanceDashboard({
    range,
    summary,
    status_breakdown,
    method_breakdown,
    traffic_trend,
    slow_endpoints,
    recent_errors,
}) {
    const setRange = (nextRange) => {
        router.get(
            route("settings.performance.index"),
            { range: nextRange },
            { preserveScroll: true, preserveState: true },
        );
    };

    const rangeOptions = [
        { value: "1h", label: "1 hour" },
        { value: "24h", label: "24 hours" },
        { value: "7d", label: "7 days" },
    ];

    const healthTone =
        summary.error_rate > 5
            ? "rose"
            : summary.p95_ms > 1000
              ? "amber"
              : "emerald";

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <h1 className="text-3xl font-semibold text-zinc-900">
                            App Performance
                        </h1>
                        <p className="mt-2 max-w-3xl text-sm text-zinc-600">
                            Runtime visibility for API traffic, response times,
                            error rate, slow endpoints, and CORS exposure.
                        </p>
                    </div>
                    <div className="flex rounded-xl border border-zinc-200 bg-white p-1 shadow-sm">
                        {rangeOptions.map((option) => (
                            <button
                                key={option.value}
                                type="button"
                                onClick={() => setRange(option.value)}
                                className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                                    range === option.value
                                        ? "bg-emerald-600 text-white"
                                        : "text-zinc-600 hover:bg-zinc-50"
                                }`}
                            >
                                {option.label}
                            </button>
                        ))}
                    </div>
                </div>
            }
        >
            <Head title="App Performance" />

            <div className="mx-auto max-w-7xl space-y-8">
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    <Stat
                        label="Requests"
                        value={number(summary.total_requests)}
                        helper={`${number(summary.api_requests)} API / ${number(summary.web_requests)} web`}
                    />
                    <Stat
                        label="P95 Latency"
                        value={ms(summary.p95_ms)}
                        helper={`Avg ${ms(summary.average_ms)}`}
                        tone={healthTone}
                    />
                    <Stat
                        label="Error Rate"
                        value={`${summary.error_rate}%`}
                        helper={`${number(summary.server_errors)} server errors`}
                        tone={summary.error_rate > 0 ? "rose" : "emerald"}
                    />
                    <Stat
                        label="Slow Requests"
                        value={number(summary.slow_requests)}
                        helper={`Peak memory ${summary.memory_peak_mb} MB`}
                        tone={summary.slow_requests > 0 ? "amber" : "zinc"}
                    />
                </div>

                <div className="grid gap-6 xl:grid-cols-[1.5fr,1fr]">
                    <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
                        <div className="mb-5 flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-zinc-900">
                                Traffic Trend
                            </h2>
                            <span className="text-xs font-medium text-zinc-500">
                                Requests and avg latency
                            </span>
                        </div>
                        {traffic_trend.length ? (
                            <div className="grid min-h-72 items-end gap-3 sm:grid-cols-6 lg:grid-cols-12">
                                {traffic_trend.slice(-12).map((point) => {
                                    const maxRequests = Math.max(
                                        ...traffic_trend.map(
                                            (item) => item.requests || 0,
                                        ),
                                        1,
                                    );
                                    return (
                                        <div
                                            key={point.label}
                                            className="flex h-72 flex-col justify-end gap-2"
                                        >
                                            <div
                                                className="rounded-t-lg bg-emerald-500"
                                                style={{
                                                    height: `${Math.max(
                                                        (point.requests /
                                                            maxRequests) *
                                                            220,
                                                        8,
                                                    )}px`,
                                                }}
                                                title={`${point.requests} requests`}
                                            />
                                            <div className="text-center">
                                                <p className="text-xs font-semibold text-zinc-700">
                                                    {number(point.requests)}
                                                </p>
                                                <p className="truncate text-[11px] text-zinc-400">
                                                    {point.label}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="py-20 text-center text-sm text-zinc-500">
                                No request metrics in this range yet.
                            </div>
                        )}
                    </div>

                    <div className="space-y-6">
                        <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
                            <h2 className="mb-5 text-lg font-semibold text-zinc-900">
                                Status Codes
                            </h2>
                            <BarList
                                items={status_breakdown}
                                labelKey="status"
                                valueKey="count"
                                emptyText="No statuses recorded."
                            />
                        </div>
                        <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
                            <h2 className="mb-5 text-lg font-semibold text-zinc-900">
                                Methods
                            </h2>
                            <BarList
                                items={method_breakdown}
                                labelKey="method"
                                valueKey="count"
                                emptyText="No methods recorded."
                            />
                        </div>
                    </div>
                </div>

                <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
                    <div className="mb-5 flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-zinc-900">
                            Slowest Endpoints
                        </h2>
                        <span className="text-xs font-medium text-zinc-500">
                            Sorted by p95 latency
                        </span>
                    </div>
                    <div className="overflow-hidden rounded-2xl border border-zinc-100">
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[58rem] border-collapse">
                                <thead className="bg-zinc-50">
                                    <tr className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                                        <th className="px-4 py-3 text-left">
                                            Endpoint
                                        </th>
                                        <th className="px-4 py-3 text-left">
                                            Hits
                                        </th>
                                        <th className="px-4 py-3 text-left">
                                            Avg
                                        </th>
                                        <th className="px-4 py-3 text-left">
                                            P95
                                        </th>
                                        <th className="px-4 py-3 text-left">
                                            Max
                                        </th>
                                        <th className="px-4 py-3 text-left">
                                            Errors
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-zinc-100 bg-white">
                                    {slow_endpoints.length ? (
                                        slow_endpoints.map((endpoint) => (
                                            <tr
                                                key={endpoint.endpoint}
                                                className="text-sm"
                                            >
                                                <td className="max-w-0 px-4 py-3 font-medium text-zinc-900">
                                                    <span className="block truncate">
                                                        {endpoint.endpoint}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3">
                                                    {number(endpoint.requests)}
                                                </td>
                                                <td className="px-4 py-3">
                                                    {ms(endpoint.average_ms)}
                                                </td>
                                                <td className="px-4 py-3 font-semibold text-zinc-900">
                                                    {ms(endpoint.p95_ms)}
                                                </td>
                                                <td className="px-4 py-3">
                                                    {ms(endpoint.max_ms)}
                                                </td>
                                                <td
                                                    className={`px-4 py-3 ${
                                                        endpoint.errors
                                                            ? "text-red-600"
                                                            : "text-zinc-500"
                                                    }`}
                                                >
                                                    {number(endpoint.errors)}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td
                                                colSpan="6"
                                                className="px-4 py-8 text-center text-sm text-zinc-500"
                                            >
                                                No endpoint data in this range.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <div className="grid gap-6 xl:grid-cols-[1.4fr,0.8fr]">
                    <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
                        <h2 className="mb-5 text-lg font-semibold text-zinc-900">
                            Recent Server Errors
                        </h2>
                        <div className="space-y-3">
                            {recent_errors.length ? (
                                recent_errors.map((error) => (
                                    <div
                                        key={error.id}
                                        className="rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm"
                                    >
                                        <div className="flex items-center justify-between gap-4">
                                            <p className="font-semibold text-red-800">
                                                {error.status_code}{" "}
                                                {error.method}{" "}
                                                {error.route_name || error.path}
                                            </p>
                                            <p className="text-xs text-red-600">
                                                {ms(error.duration_ms)}
                                            </p>
                                        </div>
                                        <p className="mt-1 text-xs text-red-600">
                                            {error.occurred_at}
                                        </p>
                                    </div>
                                ))
                            ) : (
                                <div className="py-8 text-center text-sm text-zinc-500">
                                    No server errors in this range.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
