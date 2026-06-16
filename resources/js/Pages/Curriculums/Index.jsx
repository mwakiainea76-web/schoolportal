import { Head, Link } from "@inertiajs/react";
import {
    Activity,
    Ban,
    BookOpenCheck,
    CheckCircle2,
    Layers3,
    PieChart,
    Settings2,
} from "lucide-react";
import useRbac from "@/Hooks/UseRBAC";

export default function CurriculumIndex({
    summary = {},
    examBodyBreakdown = [],
    recentCurricula = [],
}) {
    const { can } = useRbac();
    const formatNumber = (value) => Number(value || 0).toLocaleString();
    const activeCount = Number(summary.active || 0);
    const totalCount = Number(summary.total || 0);
    const activeRate = totalCount
        ? Math.round((activeCount / totalCount) * 100)
        : 0;

    return (
        <>
            <Head title="Curriculums" />

            <div className="mx-auto w-full space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <p className="text-xs font-semibold uppercase text-emerald-600">
                            Edit
                        </p>
                        <h1 className="text-xl font-semibold text-slate-950">
                            Curriculum Edit Workspace
                        </h1>
                    </div>
                    {can("curriculums.view") ? (
                        <Link
                            href={route("curriculums.edit.index")}
                            className="inline-flex items-center justify-center gap-2 rounded border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700"
                        >
                            <Settings2 className="h-4 w-4" aria-hidden="true" />
                            Edit
                        </Link>
                    ) : null}
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
                    <SummaryCard
                        icon={BookOpenCheck}
                        label="Total Curriculums"
                        value={formatNumber(summary.total)}
                        helper={`${formatNumber(summary.exam_bodies)} exam bodies represented`}
                        tone="sky"
                    />
                    <SummaryCard
                        icon={CheckCircle2}
                        label="Active Curriculums"
                        value={formatNumber(summary.active)}
                        helper={`${activeRate}% active`}
                        tone="emerald"
                        featured
                    />
                    <SummaryCard
                        icon={Ban}
                        label="Disabled Curriculums"
                        value={formatNumber(summary.disabled)}
                        helper="Ready for reactivation when needed"
                        tone="amber"
                    />
                    <SummaryCard
                        icon={Layers3}
                        label="Course Mappings"
                        value={formatNumber(summary.mapped_courses)}
                        helper={`${formatNumber(summary.unmapped)} not mapped`}
                        tone="violet"
                    />
                </div>

                <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(320px,0.72fr)]">
                    <InsightPanel icon={PieChart} title="Curriculums by Exam Body">
                        {examBodyBreakdown.length ? (
                            <div className="space-y-3">
                                {examBodyBreakdown.map((item) => {
                                    const percent = totalCount
                                        ? Math.round((item.count / totalCount) * 100)
                                        : 0;

                                    return (
                                        <div key={item.id ?? "unassigned"}>
                                            <div className="flex items-center justify-between gap-4 text-sm">
                                                <span className="font-medium text-slate-700">
                                                    {item.name}
                                                </span>
                                                <span className="text-slate-500">
                                                    {formatNumber(item.count)}
                                                </span>
                                            </div>
                                            <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
                                                <div
                                                    className="h-full rounded-full bg-emerald-500"
                                                    style={{ width: `${percent}%` }}
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <EmptyPanelMessage message="No curriculums assigned to exam bodies yet." />
                        )}
                    </InsightPanel>

                    <InsightPanel icon={Activity} title="Recent Activity">
                        {recentCurricula.length ? (
                            <div className="divide-y divide-slate-100">
                                {recentCurricula.map((curriculum) => (
                                    <div
                                        key={curriculum.id}
                                        className="flex items-start justify-between gap-4 py-3 first:pt-0 last:pb-0"
                                    >
                                        <div className="min-w-0">
                                            <p className="truncate text-sm font-semibold text-slate-800">
                                                {curriculum.name}
                                            </p>
                                            <p className="mt-1 text-xs text-slate-500">
                                                {curriculum.exam_body || "No exam body"} -{" "}
                                                {curriculum.updated_at || "No date"}
                                            </p>
                                        </div>
                                        <StatusPill active={curriculum.is_active} />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <EmptyPanelMessage message="No recent curriculum activity." />
                        )}
                    </InsightPanel>
                </div>
            </div>
        </>
    );
}

function SummaryCard({ icon: Icon, label, value, helper, tone, featured = false }) {
    const tones = {
        sky: "bg-sky-100 text-sky-700",
        emerald: "bg-emerald-100 text-emerald-700",
        amber: "bg-amber-100 text-amber-700",
        violet: "bg-violet-100 text-violet-700",
    };

    return (
        <div
            className={`rounded-lg border border-slate-200 bg-white p-5 shadow-sm ${
                featured ? "border-r-4 border-r-emerald-500" : ""
            }`}
        >
            <div className="flex items-center gap-4">
                <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded ${tones[tone]}`}>
                    <Icon className="h-6 w-6" aria-hidden="true" />
                </span>
                <div className="min-w-0">
                    <h3 className="text-xs font-bold uppercase text-slate-500">
                        {label}
                    </h3>
                    <p className="mt-1 text-3xl font-semibold leading-none text-slate-950">
                        {value}
                    </p>
                    <p className="mt-2 text-xs text-slate-500">{helper}</p>
                </div>
            </div>
        </div>
    );
}

function InsightPanel({ icon: Icon, title, children }) {
    return (
        <section className="rounded-lg border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center gap-3 border-b border-slate-100 px-4 py-4">
                <Icon className="h-5 w-5 text-slate-900" aria-hidden="true" />
                <h2 className="text-lg font-semibold text-slate-950">{title}</h2>
            </div>
            <div className="min-h-[126px] p-5">{children}</div>
        </section>
    );
}

function EmptyPanelMessage({ message }) {
    return (
        <div className="flex min-h-[96px] items-center justify-center text-center text-sm text-slate-400">
            {message}
        </div>
    );
}

function StatusPill({ active }) {
    return (
        <span
            className={`rounded px-2 py-1 text-xs font-semibold ${
                active
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-zinc-200 text-zinc-700"
            }`}
        >
            {active ? "Active" : "Disabled"}
        </span>
    );
}
