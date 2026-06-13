import { useEffect, useState } from "react";
import { Link } from "@inertiajs/react";
import {
    BookOpen,
    CalendarDays,
    ClipboardPenLine,
    Eye,
    Presentation,
} from "lucide-react";

export default function TrainerDashboard({ dashboard }) {
    const [analytics, setAnalytics] = useState(dashboard.analytics ?? {});
    const [analyticsError, setAnalyticsError] = useState("");
    const [loadedSections, setLoadedSections] = useState({
        academic: Boolean(dashboard.analytics?.academic),
    });
    const [sectionLoading, setSectionLoading] = useState({});

    useEffect(() => {
        setAnalytics(dashboard.analytics ?? {});
        setLoadedSections({
            academic: Boolean(dashboard.analytics?.academic),
        });
    }, [dashboard.analytics]);

    const loadAcademic = async () => {
        if (sectionLoading.academic || loadedSections.academic) {
            return;
        }

        setSectionLoading((current) => ({ ...current, academic: true }));
        setAnalyticsError("");

        try {
            const response = await fetch(route("reports.api.academic-summary"));

            if (!response.ok) {
                throw new Error("academic analytics request failed.");
            }

            const payload = await response.json();

            setAnalytics((current) => ({ ...current, academic: payload }));
            setLoadedSections((current) => ({ ...current, academic: true }));
        } catch (error) {
            console.error("Failed to load academic analytics:", error);
            setAnalyticsError(
                "Academic analytics are taking longer than expected to load. Please try that section again.",
            );
        } finally {
            setSectionLoading((current) => ({ ...current, academic: false }));
        }
    };

    const academic = analytics.academic ?? {};
    const trainerWorkspace = dashboard.trainer_workspace ?? {};
    const staffProfile = dashboard.staff_profile ?? {};

    const overviewCards = [
        {
            label: "Active Session",
            value: trainerWorkspace.active_session?.name ?? "No active session",
            icon: CalendarDays,
            tone: "bg-emerald-50 text-emerald-600",
        },
        {
            label: "Timetable Sessions",
            value: trainerWorkspace.timetable_sessions_count || 0,
            icon: Presentation,
            tone: "bg-sky-50 text-sky-600",
        },
        {
            label: "Recorded Marks",
            value: trainerWorkspace.marks_recorded_count || 0,
            icon: ClipboardPenLine,
            tone: "bg-amber-50 text-amber-600",
        },
        {
            label: "Department",
            value: staffProfile.department_name ?? "Not assigned",
            icon: BookOpen,
            tone: "bg-slate-100 text-slate-700",
        },
    ];

    const quickActions = [
        trainerWorkspace.can_view_timetable
            ? {
                  label: "My Timetable",
                  helper: trainerWorkspace.active_session?.name
                      ? `Current view opens in ${trainerWorkspace.active_session.name}`
                      : "Open your personal teaching schedule",
                  href: route("academic.timetables.index", {
                      academic_session_id:
                          trainerWorkspace.active_session?.id || "",
                      department_id: trainerWorkspace.department_id || "",
                      trainer_staff_id: trainerWorkspace.trainer_staff_id || "",
                  }),
                  icon: Presentation,
                  tone: "from-emerald-500 to-teal-500",
              }
            : null,
        {
            label: "Add Marks",
            helper: "Open marks entry to choose a course mapping, unit, and record assessments.",
            href: route("academic.marks.add.index"),
            icon: ClipboardPenLine,
            tone: "from-sky-500 to-cyan-500",
        },
        {
            label: "View Marks",
            helper: "Review submitted marks by assessment, module, and academic year.",
            href: route("academic.marks.view.index"),
            icon: Eye,
            tone: "from-violet-500 to-indigo-500",
        },
    ].filter(Boolean);

    const academicCards = [
        {
            label: "Registration Rate",
            value: `${academic.metrics?.session_registration_rate ?? 0}%`,
        },
        {
            label: "Students Not Registered",
            value: academic.metrics?.students_not_registered_count ?? 0,
        },
        {
            label: "Timetable Completion",
            value: `${academic.metrics?.timetable_completion_rate ?? 0}%`,
        },
        {
            label: "Lecturer Clashes",
            value: academic.metrics?.lecturer_clash_count ?? 0,
        },
    ];

    return (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-700">
            <h1 className="text-3xl font-bold tracking-tight text-zinc-900">
                Teaching Overview
            </h1>
            <p className="mt-1 text-zinc-500">
                Focus on your timetable, marks workflow, and teaching activity
                in the current session.
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

            <div className="mt-10 rounded-[1.75rem] border border-zinc-100 bg-white p-7 shadow-sm">
                <div className="flex flex-col gap-2 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                        <h2 className="text-xl font-semibold text-zinc-900">
                            Trainer Workspace
                        </h2>
                        <p className="text-sm text-zinc-500">
                            Personal tools for{" "}
                            {staffProfile.designation || "teaching staff"}
                            {staffProfile.department_name
                                ? ` in ${staffProfile.department_name}`
                                : ""}
                            .
                        </p>
                    </div>
                    <div className="rounded-2xl bg-zinc-50 px-4 py-3 text-sm text-zinc-600">
                        <span className="font-semibold text-zinc-900">
                            {trainerWorkspace.timetable_sessions_count || 0}
                        </span>{" "}
                        timetable session(s) in the current view and{" "}
                        <span className="font-semibold text-zinc-900">
                            {trainerWorkspace.marks_recorded_count || 0}
                        </span>{" "}
                        recorded mark(s)
                        {trainerWorkspace.active_session?.name
                            ? ` for ${trainerWorkspace.active_session.name}`
                            : ""}
                        .
                    </div>
                </div>

                <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {quickActions.map((action) => {
                        const Icon = action.icon;

                        return (
                            <Link
                                key={action.label}
                                href={action.href}
                                className="group rounded-[1.5rem] border border-zinc-100 bg-zinc-50 p-5 transition hover:border-emerald-200 hover:bg-white hover:shadow-sm"
                            >
                                <div
                                    className={`inline-flex rounded-2xl bg-gradient-to-br ${action.tone} p-3 text-white shadow-lg`}
                                >
                                    <Icon className="h-5 w-5" />
                                </div>
                                <p className="mt-5 text-lg font-semibold text-zinc-900">
                                    {action.label}
                                </p>
                                <p className="mt-2 text-sm text-zinc-500">
                                    {action.helper}
                                </p>
                            </Link>
                        );
                    })}
                </div>
            </div>

            <div className="mt-10 space-y-8">
                <DashboardSection
                    title="Academic Analytics"
                    description="Session registration, timetable coverage, and academic operational signals."
                    cards={academicCards}
                    loaded={loadedSections.academic}
                    loading={Boolean(sectionLoading.academic)}
                    onLoad={loadAcademic}
                />

                {loadedSections.academic ? (
                    <DashboardListCard
                        title="Students Not Registered"
                        items={
                            academic.exceptions?.students_not_registered ?? []
                        }
                        emptyText="No unregistered active students in the current sample."
                        renderItem={(item) => ({
                            key: item.student_id,
                            title: item.student_name,
                            subtitle: item.admission_number,
                            meta: `Module ${item.current_module}`,
                        })}
                    />
                ) : null}
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

function DashboardListCard({ title, items, emptyText, renderItem }) {
    return (
        <div className="rounded-[1.75rem] border border-zinc-100 bg-white p-7 shadow-sm">
            <h2 className="text-lg font-semibold text-zinc-900">{title}</h2>
            <div className="mt-5 space-y-4">
                {items.length ? (
                    items.map((item) => {
                        const row = renderItem(item);

                        return (
                            <div
                                key={row.key}
                                className="rounded-2xl border border-zinc-100 bg-zinc-50 px-4 py-3"
                            >
                                <p className="font-medium text-zinc-800">
                                    {row.title}
                                </p>
                                <p className="mt-1 text-sm text-zinc-500">
                                    {row.subtitle}
                                </p>
                                {row.meta ? (
                                    <p className="mt-2 text-xs text-zinc-500">
                                        {row.meta}
                                    </p>
                                ) : null}
                            </div>
                        );
                    })
                ) : (
                    <p className="text-sm text-zinc-500">{emptyText}</p>
                )}
            </div>
        </div>
    );
}
