import { useEffect, useState } from "react";
import { Link } from "@inertiajs/react";
import {
    BookMarked,
    BookOpen,
    CalendarDays,
    ClipboardPenLine,
    Eye,
    GraduationCap,
    Presentation,
    Send,
    ShieldCheck,
} from "lucide-react";

const currency = (amount) =>
    `Ksh ${new Intl.NumberFormat("en-KE", {
        style: "decimal",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(Number(amount || 0))}`;

export default function AdminDashboard({ dashboard }) {
    const [analytics, setAnalytics] = useState(dashboard.analytics ?? {});
    const [analyticsError, setAnalyticsError] = useState("");
    const [loadedSections, setLoadedSections] = useState({
        executive: Boolean(dashboard.analytics?.executive),
        finance: Boolean(dashboard.analytics?.finance),
        academic: Boolean(dashboard.analytics?.academic),
        admissions: Boolean(dashboard.analytics?.admissions),
        hostel: Boolean(dashboard.analytics?.hostel),
        data_quality: Boolean(dashboard.analytics?.data_quality),
        snapshot_trends: Boolean(dashboard.analytics?.snapshot_trends),
    });
    const [sectionLoading, setSectionLoading] = useState({});

    useEffect(() => {
        setAnalytics(dashboard.analytics ?? {});
        setLoadedSections({
            executive: Boolean(dashboard.analytics?.executive),
            finance: Boolean(dashboard.analytics?.finance),
            academic: Boolean(dashboard.analytics?.academic),
            admissions: Boolean(dashboard.analytics?.admissions),
            hostel: Boolean(dashboard.analytics?.hostel),
            data_quality: Boolean(dashboard.analytics?.data_quality),
            snapshot_trends: Boolean(dashboard.analytics?.snapshot_trends),
        });
    }, [dashboard.analytics]);

    const sectionRequests = {
        executive: () => fetch(route("reports.api.executive-summary")),
        finance: () => fetch(route("reports.api.finance-summary")),
        academic: () => fetch(route("reports.api.academic-summary")),
        admissions: () => fetch(route("reports.api.admissions-summary")),
        hostel: () => fetch(route("reports.api.hostel-summary")),
        data_quality: () => fetch(route("reports.api.data-quality-summary")),
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
    const academic = analytics.academic ?? {};
    const admissions = analytics.admissions ?? {};
    const hostel = analytics.hostel ?? {};
    const dataQuality = analytics.data_quality ?? {};
    const snapshotTrends = analytics.snapshot_trends ?? {};
    const trainerWorkspace = dashboard.trainer_workspace ?? {};
    const staffProfile = dashboard.staff_profile ?? {};

    const overviewCards = [
        {
            label: "Courses",
            value: dashboard.stats?.[0]?.value ?? 0,
            icon: BookMarked,
            tone: "bg-emerald-50 text-emerald-600",
        },
        {
            label: "Curriculums",
            value: dashboard.stats?.[1]?.value ?? 0,
            icon: GraduationCap,
            tone: "bg-sky-50 text-sky-600",
        },
        {
            label: "Departments",
            value: dashboard.stats?.[2]?.value ?? 0,
            icon: ShieldCheck,
            tone: "bg-amber-50 text-amber-600",
        },
        {
            label: "Academic Years",
            value: dashboard.stats?.[3]?.value ?? 0,
            icon: CalendarDays,
            tone: "bg-slate-100 text-slate-700",
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

    const admissionsCards = [
        {
            label: "Admissions In Range",
            value: admissions.metrics?.new_admissions_in_range ?? 0,
        },
        {
            label: "Inactive Accounts",
            value: admissions.metrics?.inactive_accounts ?? 0,
        },
        {
            label: "Missing Course Enrollment",
            value:
                admissions.metrics?.students_missing_course_enrollment_count ??
                0,
        },
        {
            label: "Duplicate Contacts",
            value: admissions.metrics?.duplicate_contact_risk_count ?? 0,
        },
    ];

    const hostelCards = [
        {
            label: "Occupancy Rate",
            value: `${hostel.metrics?.occupancy_rate ?? 0}%`,
        },
        {
            label: "Available Beds",
            value: hostel.metrics?.available_beds ?? 0,
        },
        {
            label: "Revenue Collected",
            value: currency(hostel.metrics?.hostel_revenue_collected ?? 0),
        },
        {
            label: "Allocated Not Billed",
            value: hostel.metrics?.allocated_but_not_billed_count ?? 0,
        },
    ];

    const qualityCards = [
        {
            label: "Missing Relationships",
            value:
                dataQuality.metrics?.records_missing_required_relationships ??
                0,
        },
        {
            label: "Orphaned Financial Records",
            value: dataQuality.metrics?.orphaned_financial_records ?? 0,
        },
        {
            label: "Slow Queries",
            value: dataQuality.metrics?.slow_query_count ?? 0,
        },
        {
            label: "Failed Jobs",
            value: dataQuality.metrics?.failed_job_count ?? 0,
        },
    ];

    const quickActions = [
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
        {
            label: "Publish Marks",
            helper: "Publish or unpublish departmental marks for a selected assessment.",
            href: route("academic.marks.publish.index"),
            icon: Send,
            tone: "from-rose-500 to-orange-500",
        },
        {
            label: "Unit Marksheet",
            helper: "Review submitted unit performance and top performers.",
            href: route("academic.marks.marksheet.index"),
            icon: BookOpen,
            tone: "from-amber-500 to-orange-500",
        },
        trainerWorkspace.can_view_timetable
            ? {
                  label: "Teaching Timetable",
                  helper: trainerWorkspace.active_session?.name
                      ? `Open timetable for ${trainerWorkspace.active_session.name}`
                      : "Open timetable workspace",
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
    ].filter(Boolean);

    return (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-700">
            <h1 className="text-3xl font-bold tracking-tight text-zinc-900">
                Institution Overview
            </h1>
            <p className="mt-1 text-zinc-500">
                Monitor institution-wide operations across academic, finance,
                admissions, hostel, and data quality workflows.
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

            {quickActions.length ? (
                <div className="mt-10 rounded-[1.75rem] border border-zinc-100 bg-white p-7 shadow-sm">
                    <div className="flex flex-col gap-2 lg:flex-row lg:items-end lg:justify-between">
                        <div>
                            <h2 className="text-xl font-semibold text-zinc-900">
                                Admin Workspace
                            </h2>
                            <p className="text-sm text-zinc-500">
                                Operational tools for{" "}
                                {staffProfile.designation || "administration"}
                                {staffProfile.department_name
                                    ? ` in ${staffProfile.department_name}`
                                    : ""}
                                .
                            </p>
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
            ) : null}

            <div className="mt-10 space-y-8">
                <DashboardSection
                    title="Executive Analytics"
                    description={
                        loadedSections.executive
                            ? `Active session: ${executive.active_session?.label ?? "No active session"}`
                            : "Institution-wide student, finance, and hostel signals."
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

                <DashboardSection
                    title="Academic Analytics"
                    description="Session registration, timetable coverage, and academic operational signals."
                    cards={academicCards}
                    loaded={loadedSections.academic}
                    loading={Boolean(sectionLoading.academic)}
                    onLoad={() => loadSection("academic")}
                />

                <DashboardSection
                    title="Admissions Analytics"
                    description="Intake quality, onboarding completeness, and admissions risk indicators."
                    cards={admissionsCards}
                    loaded={loadedSections.admissions}
                    loading={Boolean(sectionLoading.admissions)}
                    onLoad={() => loadSection("admissions")}
                />

                <DashboardSection
                    title="Hostel Analytics"
                    description="Occupancy, billing linkage, and accommodation exception indicators."
                    cards={hostelCards}
                    loaded={loadedSections.hostel}
                    loading={Boolean(sectionLoading.hostel)}
                    onLoad={() => loadSection("hostel")}
                />

                <DashboardSection
                    title="Data Quality Signals"
                    description="Cross-system data integrity and operational health indicators."
                    cards={qualityCards}
                    loaded={loadedSections.data_quality}
                    loading={Boolean(sectionLoading.data_quality)}
                    onLoad={() => loadSection("data_quality")}
                />

                {loadedSections.academic ||
                loadedSections.admissions ||
                loadedSections.hostel ? (
                    <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
                        <DashboardListCard
                            title="Students Not Registered"
                            items={
                                loadedSections.academic
                                    ? (academic.exceptions
                                          ?.students_not_registered ?? [])
                                    : []
                            }
                            emptyText={
                                loadedSections.academic
                                    ? "No unregistered active students in the current sample."
                                    : "Load Academic Analytics to view this list."
                            }
                            renderItem={(item) => ({
                                key: item.student_id,
                                title: item.student_name,
                                subtitle: item.admission_number,
                                meta: `Module ${item.current_module}`,
                            })}
                        />

                        <DashboardListCard
                            title="Admissions Exceptions"
                            items={
                                loadedSections.admissions
                                    ? (admissions.exceptions
                                          ?.students_missing_course_enrollment ??
                                      [])
                                    : []
                            }
                            emptyText={
                                loadedSections.admissions
                                    ? "No missing course-enrollment cases found."
                                    : "Load Admissions Analytics to view this list."
                            }
                            renderItem={(item) => ({
                                key: item.student_id,
                                title: item.student_name,
                                subtitle: item.admission_number,
                                meta: item.admission_date ?? "",
                            })}
                        />

                        <DashboardListCard
                            title="Hostel Billing Gaps"
                            items={
                                loadedSections.hostel
                                    ? (hostel.exceptions
                                          ?.allocated_but_not_billed ?? [])
                                    : []
                            }
                            emptyText={
                                loadedSections.hostel
                                    ? "No hostel allocation billing gaps found."
                                    : "Load Hostel Analytics to view this list."
                            }
                            renderItem={(item) => ({
                                key: item.allocation_id,
                                title: item.student_name,
                                subtitle: item.admission_number,
                                meta: item.hostel_name,
                            })}
                        />
                    </div>
                ) : null}

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
