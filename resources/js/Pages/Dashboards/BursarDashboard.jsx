import { useEffect, useState } from "react";
import {
    BookMarked,
    CalendarDays,
    CreditCard,
    ShieldCheck,
    Wallet,
} from "lucide-react";

const currency = (amount) =>
    `Ksh ${new Intl.NumberFormat("en-KE", {
        style: "decimal",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(Number(amount || 0))}`;

export default function BursarDashboard({ dashboard }) {
    const [analytics, setAnalytics] = useState(dashboard.analytics ?? {});
    const [analyticsError, setAnalyticsError] = useState("");
    const [loadedSections, setLoadedSections] = useState({
        executive: Boolean(dashboard.analytics?.executive),
        finance: Boolean(dashboard.analytics?.finance),
        snapshot_trends: Boolean(dashboard.analytics?.snapshot_trends),
    });
    const [sectionLoading, setSectionLoading] = useState({});

    useEffect(() => {
        setAnalytics(dashboard.analytics ?? {});
        setLoadedSections({
            executive: Boolean(dashboard.analytics?.executive),
            finance: Boolean(dashboard.analytics?.finance),
            snapshot_trends: Boolean(dashboard.analytics?.snapshot_trends),
        });
    }, [dashboard.analytics]);

    const sectionRequests = {
        executive: () => fetch(route("reports.api.executive-summary")),
        finance: () => fetch(route("reports.api.finance-summary")),
        snapshot_trends: () =>
            fetch(route("reports.api.snapshot-trends", { days: 14 })),
    };

    const loadSection = async (sectionKey) => {
        if (sectionLoading[sectionKey] || loadedSections[sectionKey]) {
            return;
        }

        setSectionLoading((current) => ({ ...current, [sectionKey]: true }));
        setAnalyticsError("");

        try {
            const response = await sectionRequests[sectionKey]();

            if (!response.ok) {
                throw new Error(`${sectionKey} analytics request failed.`);
            }

            const payload = await response.json();

            setAnalytics((current) => ({ ...current, [sectionKey]: payload }));
            setLoadedSections((current) => ({
                ...current,
                [sectionKey]: true,
            }));
        } catch (error) {
            console.error(`Failed to load ${sectionKey} analytics:`, error);
            setAnalyticsError(
                "Some analytics are taking longer than expected to load. Please try that section again.",
            );
        } finally {
            setSectionLoading((current) => ({
                ...current,
                [sectionKey]: false,
            }));
        }
    };

    const executive = analytics.executive ?? {};
    const finance = analytics.finance ?? {};
    const snapshotTrends = analytics.snapshot_trends ?? {};

    const overviewCards = [
        {
            label: "Courses",
            value: dashboard.stats?.[0]?.value ?? 0,
            icon: BookMarked,
            tone: "bg-slate-100 text-slate-700",
        },
        {
            label: "Outstanding Balance",
            value: loadedSections.executive
                ? currency(executive.metrics?.outstanding_balance ?? 0)
                : "Load Data",
            icon: Wallet,
            tone: "bg-amber-50 text-amber-600",
        },
        {
            label: "Collection Rate",
            value: loadedSections.finance
                ? `${finance.metrics?.collection_rate ?? 0}%`
                : "Load Data",
            icon: CreditCard,
            tone: "bg-emerald-50 text-emerald-600",
        },
        {
            label: "Approval Backlog",
            value: loadedSections.finance
                ? finance.metrics?.approval_backlog_count ?? 0
                : "Load Data",
            icon: ShieldCheck,
            tone: "bg-sky-50 text-sky-600",
        },
    ];

    const executiveCards = [
        {
            label: "Total Students",
            value: executive.metrics?.total_students ?? 0,
        },
        {
            label: "Active Students",
            value: executive.metrics?.active_students ?? 0,
        },
        {
            label: "Registered In Session",
            value:
                executive.metrics?.students_registered_in_active_session ?? 0,
            helper: `${executive.metrics?.session_registration_rate ?? 0}% registration`,
        },
        {
            label: "Outstanding Balance",
            value: currency(executive.metrics?.outstanding_balance ?? 0),
        },
    ];

    const financeCards = [
        {
            label: "Collection Rate",
            value: `${finance.metrics?.collection_rate ?? 0}%`,
        },
        {
            label: "Overdue Balance",
            value: currency(finance.metrics?.overdue_balance ?? 0),
        },
        {
            label: "Approval Backlog",
            value: finance.metrics?.approval_backlog_count ?? 0,
        },
        {
            label: "Credit Balance Students",
            value: finance.metrics?.credit_balance_students ?? 0,
        },
    ];

    return (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-700">
            <h1 className="text-3xl font-bold tracking-tight text-zinc-900">
                Finance Overview
            </h1>
            <p className="mt-1 text-zinc-500">
                Track collections, balances, and the finance analytics that
                matter to bursary operations.
            </p>

            {analyticsError ? (
                <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                    {analyticsError}
                </div>
            ) : null}

            <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
                {overviewCards.map((card) => {
                    const Icon = card.icon;

                    return (
                        <div
                            key={card.label}
                            className="rounded-[1.75rem] border border-zinc-100 bg-white p-6 shadow-sm"
                        >
                            <div
                                className={`inline-flex rounded-2xl p-3 ${card.tone}`}
                            >
                                <Icon className="h-5 w-5" />
                            </div>
                            <p className="mt-5 text-sm font-medium text-zinc-500">
                                {card.label}
                            </p>
                            <p className="mt-2 text-3xl font-bold tracking-tight text-zinc-900">
                                {card.value}
                            </p>
                        </div>
                    );
                })}
            </div>

            <div className="mt-10 space-y-8">
                <DashboardSection
                    title="Executive Analytics"
                    description={
                        loadedSections.executive
                            ? `Active session: ${executive.active_session?.label ?? "No active session"}`
                            : "Institution-wide student and finance signals."
                    }
                    cards={executiveCards}
                    loaded={loadedSections.executive}
                    loading={Boolean(sectionLoading.executive)}
                    onLoad={() => loadSection("executive")}
                />

                <DashboardSection
                    title="Finance Analytics"
                    description="Billing health, debt exposure, and finance exception signals."
                    cards={financeCards}
                    loaded={loadedSections.finance}
                    loading={Boolean(sectionLoading.finance)}
                    onLoad={() => loadSection("finance")}
                />

                {loadedSections.snapshot_trends ? (
                    <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
                        <SnapshotTrendCard
                            title="Collections"
                            points={
                                snapshotTrends.finance?.total_collected ?? []
                            }
                            formatter={currency}
                        />
                        <SnapshotTrendCard
                            title="Outstanding Balance"
                            points={
                                snapshotTrends.finance?.outstanding_balance ??
                                []
                            }
                            formatter={currency}
                        />
                        <SnapshotTrendCard
                            title="Registration Rate"
                            points={
                                snapshotTrends.academic
                                    ?.session_registration_rate ?? []
                            }
                            suffix="%"
                        />
                    </div>
                ) : (
                    <DashboardSection
                        title="Snapshot Trends"
                        description="Historical collections, outstanding balances, and registration trends."
                        cards={[
                            { label: "Collections", value: "Load Data" },
                            {
                                label: "Outstanding Balance",
                                value: "Load Data",
                            },
                            { label: "Registration Rate", value: "Load Data" },
                        ]}
                        loaded={false}
                        loading={Boolean(sectionLoading.snapshot_trends)}
                        onLoad={() => loadSection("snapshot_trends")}
                    />
                )}
            </div>
        </div>
    );
}

function DashboardSection({
    title,
    description,
    cards,
    loaded = true,
    loading = false,
    onLoad = null,
}) {
    return (
        <div className="rounded-[1.75rem] border border-zinc-100 bg-white p-7 shadow-sm">
            <div className="flex flex-col gap-2 lg:flex-row lg:items-end lg:justify-between">
                <div>
                    <h2 className="text-xl font-semibold text-zinc-900">
                        {title}
                    </h2>
                    <p className="text-sm text-zinc-500">{description}</p>
                </div>
                {!loaded && onLoad ? (
                    <button
                        type="button"
                        onClick={onLoad}
                        disabled={loading}
                        className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {loading ? "Loading..." : "Load Data"}
                    </button>
                ) : null}
            </div>
            {loaded ? (
                <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
                    {cards.map((card) => (
                        <div
                            key={card.label}
                            className="rounded-2xl border border-zinc-100 bg-zinc-50 px-5 py-4"
                        >
                            <p className="text-sm font-medium text-zinc-500">
                                {card.label}
                            </p>
                            <p className="mt-2 text-2xl font-bold tracking-tight text-zinc-900">
                                {card.value}
                            </p>
                            {card.helper ? (
                                <p className="mt-2 text-xs text-zinc-500">
                                    {card.helper}
                                </p>
                            ) : null}
                        </div>
                    ))}
                </div>
            ) : (
                <div className="mt-6 rounded-2xl border border-dashed border-zinc-200 bg-zinc-50 px-5 py-6 text-sm text-zinc-500">
                    This section stays unloaded until you click{" "}
                    <span className="font-semibold text-zinc-700">
                        Load Data
                    </span>
                    .
                </div>
            )}
        </div>
    );
}

function SnapshotTrendCard({
    title,
    points,
    formatter = (value) => value,
    suffix = "",
}) {
    return (
        <div className="rounded-[1.75rem] border border-zinc-100 bg-white p-7 shadow-sm">
            <h2 className="text-lg font-semibold text-zinc-900">{title}</h2>
            <div className="mt-5 space-y-3">
                {points.length ? (
                    points.slice(-7).map((point) => (
                        <div
                            key={`${title}-${point.date}`}
                            className="flex items-center justify-between rounded-2xl bg-zinc-50 px-4 py-3 text-sm"
                        >
                            <span className="text-zinc-500">{point.date}</span>
                            <span className="font-medium text-zinc-900">
                                {formatter(point.value)}
                                {suffix}
                            </span>
                        </div>
                    ))
                ) : (
                    <p className="text-sm text-zinc-500">
                        No snapshot trend data available yet.
                    </p>
                )}
            </div>
        </div>
    );
}
