import { useEffect, useState } from "react";
import { Head, Link, useForm, usePage } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import Modal from "@/Components/Modal";
import formatDate from "@/utils/date";
import {
    BookMarked,
    BookOpen,
    CalendarDays,
    CreditCard,
    GraduationCap,
    Receipt,
    ShieldCheck,
    Wallet,
} from "lucide-react";

const currency = (amount) =>
    `Ksh ${new Intl.NumberFormat("en-KE", {
        style: "decimal",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(Number(amount || 0))}`;

const statusClasses = {
    active: "bg-emerald-100 text-emerald-700",
    issued: "bg-amber-100 text-amber-700",
    partial: "bg-blue-100 text-blue-700",
    paid: "bg-emerald-100 text-emerald-700",
    draft: "bg-slate-100 text-slate-600",
    suspended: "bg-red-100 text-red-700",
    graduated: "bg-indigo-100 text-indigo-700",
    dropped: "bg-red-100 text-red-700",
    completed: "bg-blue-100 text-blue-700",
};

function StudentDashboard({ dashboard, fullName }) {
    const cards = [
        {
            label: "Outstanding Balance",
            value: currency(dashboard.finance.outstanding_balance),
            helper: dashboard.finance.next_invoice_due_date
                ? `Next due ${formatDate(dashboard.finance.next_invoice_due_date)}`
                : "No invoice due date available",
            icon: Wallet,
            tone: "from-emerald-500 to-emerald-600",
        },
        {
            label: "Total Paid",
            value: currency(dashboard.finance.total_paid),
            helper: "Payments recorded on your account",
            icon: CreditCard,
            tone: "from-slate-700 to-slate-800",
        },
        {
            label: "Current Module",
            value: dashboard.student?.current_module ?? "-",
            helper:
                dashboard.latest_session?.session ?? "No active session yet",
            icon: GraduationCap,
            tone: "from-sky-500 to-cyan-500",
        },
        {
            label: "Fee Discount",
            value: `${dashboard.student?.fee_discount_percentage ?? 0}%`,
            helper: "Current approved discount",
            icon: ShieldCheck,
            tone: "from-amber-500 to-orange-500",
        },
    ];
    const [showSessionRegistrationModal, setShowSessionRegistrationModal] =
        useState(false);
    const { post, processing, errors, clearErrors } = useForm({});
    useEffect(() => {
        if (errors.session_registration) {
            setShowSessionRegistrationModal(true);
        }
    }, [errors.session_registration]);

    const submitSessionRegistration = (e) => {
        e.preventDefault();
        post(route("student.dashboard.register-session"), {
            preserveScroll: true,
            onBefore: () => clearErrors(),
            onSuccess: () => {
                clearErrors();
                setShowSessionRegistrationModal(false);
            },
            onError: () => setShowSessionRegistrationModal(true),
        });
    };

    return (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-700">
            <div className="relative overflow-hidden rounded-[2rem] bg-[#1b263b] px-8 py-10 text-white shadow-xl">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(16,185,129,0.25),_transparent_35%),radial-gradient(circle_at_bottom_left,_rgba(255,255,255,0.08),_transparent_25%)]" />
                <div className="relative flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
                    <div className="max-w-2xl">
                        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-300">
                            Student Portal
                        </p>
                        <h1 className="mt-3 text-4xl font-bold tracking-tight">
                            Welcome back, {fullName}.
                        </h1>
                        <p className="mt-3 max-w-xl text-sm text-slate-300">
                            Keep track of your program progress, current
                            session, billing status, and learning units from
                            one place.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                        <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur">
                            <p className="text-xs uppercase tracking-wide text-slate-300">
                                Program
                            </p>
                            <p className="mt-2 text-sm font-semibold">
                                {dashboard.program?.name ?? "Not assigned"}
                            </p>
                        </div>
                        <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur">
                            <p className="text-xs uppercase tracking-wide text-slate-300">
                                Version
                            </p>
                            <p className="mt-2 text-sm font-semibold">
                                {dashboard.program?.version ?? "Not assigned"}
                            </p>
                        </div>
                        <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur">
                            <p className="text-xs uppercase tracking-wide text-slate-300">
                                Reg. No
                            </p>
                            <p className="mt-2 text-sm font-semibold">
                                {dashboard.student?.registration_number ?? "-"}
                            </p>
                        </div>
                        <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur">
                            <p className="text-xs uppercase tracking-wide text-slate-300">
                                Status
                            </p>
                            <p className="mt-2 text-sm font-semibold capitalize">
                                {dashboard.student?.status ?? "-"}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
                {cards.map((card) => {
                    const Icon = card.icon;

                    return (
                        <div
                            key={card.label}
                            className="rounded-[1.75rem] border border-zinc-100 bg-white p-6 shadow-sm"
                        >
                            <div
                                className={`inline-flex rounded-2xl bg-gradient-to-br ${card.tone} p-3 text-white shadow-lg`}
                            >
                                <Icon className="h-5 w-5" />
                            </div>
                            <p className="mt-5 text-sm font-medium text-zinc-500">
                                {card.label}
                            </p>
                            <p className="mt-2 text-2xl font-bold tracking-tight text-zinc-900">
                                {card.value}
                            </p>
                            <p className="mt-2 text-sm text-zinc-400">
                                {card.helper}
                            </p>
                        </div>
                    );
                })}
            </div>

            <div className="mt-8 grid grid-cols-1 gap-6 xl:grid-cols-[1.4fr,0.9fr]">
                <div className="rounded-[1.75rem] border border-zinc-100 bg-white p-7 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-semibold text-zinc-900">
                                Recent Invoices
                            </h2>
                            <p className="mt-1 text-sm text-zinc-500">
                                Your latest finance activity and balances.
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <Link
                                href={route("student.fee-statements.index")}
                                className="text-sm font-medium text-emerald-700 transition hover:text-emerald-800"
                            >
                                View all statements
                            </Link>
                            <div className="rounded-2xl bg-emerald-50 p-3 text-emerald-600">
                                <Receipt className="h-5 w-5" />
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 space-y-4">
                        {dashboard.recent_invoices?.length ? (
                            dashboard.recent_invoices.map((invoice) => (
                                <div
                                    key={invoice.id}
                                    className="flex flex-col gap-4 rounded-2xl border border-zinc-100 bg-zinc-50/70 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
                                >
                                    <div>
                                        <p className="font-semibold text-zinc-800">
                                            {invoice.invoice_number}
                                        </p>
                                        <p className="mt-1 text-sm text-zinc-500">
                                            {invoice.session ??
                                                "Session not linked"}
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <div className="text-right">
                                            <p className="text-sm text-zinc-500">
                                                Balance
                                            </p>
                                            <p className="font-semibold text-zinc-900">
                                                {currency(invoice.balance_due)}
                                            </p>
                                        </div>
                                        <span
                                            className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                                                statusClasses[invoice.status] ??
                                                "bg-slate-100 text-slate-600"
                                            }`}
                                        >
                                            {invoice.status}
                                        </span>
                                        <Link
                                            href={route(
                                                "student.fee-statements.show",
                                                invoice.id,
                                            )}
                                            className="inline-flex rounded-xl bg-slate-900 px-3 py-2 text-xs font-semibold text-white transition hover:bg-slate-700"
                                        >
                                            View statement
                                        </Link>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="rounded-2xl border border-dashed border-zinc-200 px-6 py-10 text-center text-sm text-zinc-400">
                                No invoices have been generated for your
                                account yet.
                            </div>
                        )}
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="rounded-[1.75rem] border border-zinc-100 bg-white p-7 shadow-sm">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-semibold text-zinc-900">
                                Study Snapshot
                            </h2>
                            <div className="rounded-2xl bg-sky-50 p-3 text-sky-600">
                                <BookMarked className="h-5 w-5" />
                            </div>
                        </div>

                        <div className="mt-6 space-y-4 text-sm">
                            <div className="rounded-2xl bg-zinc-50 px-4 py-3">
                                <p className="text-zinc-500">
                                    Program Version
                                </p>
                                <p className="mt-1 font-semibold text-zinc-900">
                                    {dashboard.program?.version ??
                                        "Not assigned"}
                                </p>
                            </div>
                            <div className="rounded-2xl bg-zinc-50 px-4 py-3">
                                <p className="text-zinc-500">
                                    Current Session
                                </p>
                                <p className="mt-1 font-semibold text-zinc-900">
                                    {dashboard.latest_session?.session ??
                                        "No session enrollment yet"}
                                </p>
                                {!dashboard.latest_session ? (
                                    <>
                                        {dashboard.session_registration
                                            ?.blocker ? (
                                            <p className="mt-3 text-xs text-amber-700">
                                                {
                                                    dashboard
                                                        .session_registration
                                                        .blocker
                                                }
                                            </p>
                                        ) : null}
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowSessionRegistrationModal(
                                                    true,
                                                )
                                            }
                                            disabled={
                                                !dashboard.session_registration
                                                    ?.can_register
                                            }
                                            className="mt-3 inline-flex rounded-xl bg-emerald-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
                                        >
                                            Register current active session
                                        </button>
                                    </>
                                ) : null}
                            </div>
                            <div className="rounded-2xl bg-zinc-50 px-4 py-3">
                                <p className="text-zinc-500">
                                    Year of Study
                                </p>
                                <p className="mt-1 font-semibold text-zinc-900">
                                    {dashboard.latest_session?.year_of_study
                                        ? `Year ${dashboard.latest_session.year_of_study}`
                                        : "-"}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-[1.75rem] border border-zinc-100 bg-white p-7 shadow-sm">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-semibold text-zinc-900">
                                This Module&apos;s Units
                            </h2>
                            <div className="rounded-2xl bg-amber-50 p-3 text-amber-600">
                                <BookOpen className="h-5 w-5" />
                            </div>
                        </div>

                        <div className="mt-2 flex items-center justify-between">
                            <p className="text-sm text-zinc-500">
                                Units assigned to your current module.
                            </p>
                            <Link
                                href={route("student.program-units.index")}
                                className="text-xs font-semibold text-emerald-700 transition hover:text-emerald-800"
                            >
                                View all units
                            </Link>
                        </div>

                        <div className="mt-6">
                            {dashboard.module_units?.length ? (
                                <div className="overflow-hidden rounded-2xl border border-zinc-100">
                                    <div className="grid grid-cols-[0.9fr,1.6fr,0.8fr] gap-4 bg-zinc-50 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-zinc-500">
                                        <p>Code</p>
                                        <p>Unit</p>
                                        <p className="text-right">Hours</p>
                                    </div>
                                    {dashboard.module_units.map((unit) => (
                                        <div
                                            key={unit.id}
                                            className="grid grid-cols-[0.9fr,1.6fr,0.8fr] gap-4 border-t border-zinc-100 bg-white px-4 py-3 text-sm text-zinc-700"
                                        >
                                            <p className="font-semibold text-emerald-700">
                                                {unit.code ?? "-"}
                                            </p>
                                            <div>
                                                <p className="font-semibold text-zinc-900">
                                                    {unit.name}
                                                </p>
                                                <p className="mt-1 text-xs text-zinc-500">
                                                    Credit Factor:{" "}
                                                    {unit.credit_factor ?? "-"}
                                                </p>
                                            </div>
                                            <p className="text-right font-medium text-zinc-600">
                                                {unit.training_hours ?? "-"}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="rounded-2xl bg-[#F8F9FA] px-4 py-4 text-sm text-zinc-500">
                                    No units have been assigned to this module
                                    yet.
                                </div>
                            )}

                            <div className="mt-3 rounded-2xl bg-[#F8F9FA] px-4 py-3 text-xs text-zinc-500">
                                {dashboard.all_units_count
                                    ? `${dashboard.all_units_count} total unit(s) are mapped to your program version.`
                                    : "Your full unit list will appear once units are mapped to your program version."}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Modal
                show={showSessionRegistrationModal}
                onClose={() => setShowSessionRegistrationModal(false)}
                maxWidth="lg"
            >
                <div className="p-6">
                    <div className="border-b border-zinc-100 pb-4">
                        <h3 className="text-lg font-semibold text-zinc-900">
                            Register Current Session
                        </h3>
                        <p className="mt-1 text-sm text-zinc-500">
                            Register yourself for the active academic session.
                        </p>
                    </div>

                    <form
                        onSubmit={submitSessionRegistration}
                        className="space-y-5 pt-5"
                    >
                        <div className="rounded-2xl bg-zinc-50 px-4 py-3">
                            <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
                                Registration Number
                            </p>
                            <p className="mt-1 text-sm font-semibold text-zinc-900">
                                {dashboard.student?.registration_number ?? "-"}
                            </p>
                        </div>

                        <div className="rounded-2xl bg-zinc-50 px-4 py-3">
                            <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
                                Active Session
                            </p>
                            <p className="mt-1 text-sm font-semibold text-zinc-900">
                                {dashboard.active_session ??
                                    "No active session available"}
                            </p>
                        </div>

                        {errors.session_registration ? (
                            <p className="text-sm text-red-600">
                                {errors.session_registration}
                            </p>
                        ) : null}

                        <div className="flex justify-end gap-3 pt-2">
                            <button
                                type="button"
                                onClick={() =>
                                    setShowSessionRegistrationModal(false)
                                }
                                className="rounded-xl bg-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-300"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={
                                    processing ||
                                    !dashboard.active_session ||
                                    !dashboard.session_registration
                                        ?.can_register
                                }
                                className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-700 disabled:opacity-50"
                            >
                                {processing
                                    ? "Registering..."
                                    : "Register Session"}
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>
        </div>
    );
}

function StaffDashboard({ dashboard }) {
    const analytics = dashboard.analytics ?? {};
    const executive = analytics.executive ?? {};
    const finance = analytics.finance ?? {};
    const academic = analytics.academic ?? {};
    const admissions = analytics.admissions ?? {};
    const hostel = analytics.hostel ?? {};
    const dataQuality = analytics.data_quality ?? {};
    const snapshotTrends = analytics.snapshot_trends ?? {};

    const cards = [
        {
            label: "Programs",
            value: dashboard.stats?.[0]?.value ?? 0,
            icon: BookMarked,
            tone: "bg-emerald-50 text-emerald-600",
        },
        {
            label: "Program Versions",
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
            value: executive.metrics?.students_registered_in_active_session ?? 0,
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
            label: "Missing Program Enrollment",
            value:
                admissions.metrics?.students_missing_program_enrollment_count ??
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
                dataQuality.metrics?.records_missing_required_relationships ?? 0,
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

    return (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-700">
            <h1 className="text-3xl font-bold tracking-tight text-zinc-900">
                Academic Overview
            </h1>
            <p className="mt-1 text-zinc-500">
                Manage programs, program versions, and institutional scheduling
                from one place.
            </p>

            <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
                {cards.map((card) => {
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
                    description={`Active session: ${executive.active_session?.label ?? "No active session"}`}
                    cards={executiveCards}
                />

                <DashboardSection
                    title="Finance Analytics"
                    description="Billing health, debt exposure, and finance exception signals."
                    cards={financeCards}
                />

                <DashboardSection
                    title="Academic Analytics"
                    description="Session registration, timetable coverage, and academic operational signals."
                    cards={academicCards}
                />

                <DashboardSection
                    title="Admissions Analytics"
                    description="Intake quality, onboarding completeness, and admissions risk indicators."
                    cards={admissionsCards}
                />

                <DashboardSection
                    title="Hostel Analytics"
                    description="Occupancy, billing linkage, and accommodation exception indicators."
                    cards={hostelCards}
                />

                <DashboardSection
                    title="Data Quality Signals"
                    description="Cross-system data integrity and operational health indicators."
                    cards={qualityCards}
                />

                <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
                    <DashboardListCard
                        title="Students Not Registered"
                        items={academic.exceptions?.students_not_registered ?? []}
                        emptyText="No unregistered active students in the current sample."
                        renderItem={(item) => ({
                            key: item.student_id,
                            title: item.student_name,
                            subtitle: item.registration_number,
                            meta: `Module ${item.current_module}`,
                        })}
                    />

                    <DashboardListCard
                        title="Admissions Exceptions"
                        items={
                            admissions.exceptions
                                ?.students_missing_program_enrollment ?? []
                        }
                        emptyText="No missing program-enrollment cases found."
                        renderItem={(item) => ({
                            key: item.student_id,
                            title: item.student_name,
                            subtitle: item.registration_number,
                            meta: item.admission_date ?? "",
                        })}
                    />

                    <DashboardListCard
                        title="Hostel Billing Gaps"
                        items={
                            hostel.exceptions?.allocated_but_not_billed ?? []
                        }
                        emptyText="No hostel allocation billing gaps found."
                        renderItem={(item) => ({
                            key: item.allocation_id,
                            title: item.student_name,
                            subtitle: item.registration_number,
                            meta: item.hostel_name,
                        })}
                    />
                </div>

                <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
                    <SnapshotTrendCard
                        title="Collections"
                        points={snapshotTrends.finance?.total_collected ?? []}
                        formatter={currency}
                    />
                    <SnapshotTrendCard
                        title="Outstanding Balance"
                        points={
                            snapshotTrends.finance?.outstanding_balance ?? []
                        }
                        formatter={currency}
                    />
                    <SnapshotTrendCard
                        title="Registration Rate"
                        points={
                            snapshotTrends.academic?.session_registration_rate ??
                            []
                        }
                        suffix="%"
                    />
                </div>
            </div>
        </div>
    );
}

function DashboardSection({ title, description, cards }) {
    return (
        <div className="rounded-[1.75rem] border border-zinc-100 bg-white p-7 shadow-sm">
            <div className="flex flex-col gap-2 lg:flex-row lg:items-end lg:justify-between">
                <div>
                    <h2 className="text-xl font-semibold text-zinc-900">
                        {title}
                    </h2>
                    <p className="text-sm text-zinc-500">{description}</p>
                </div>
            </div>

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
                            <span className="text-zinc-500">
                                {point.date}
                            </span>
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

export default function Dashboard({ dashboard }) {
    const { auth } = usePage().props;
    const fullName =
        [auth?.user?.first_name, auth?.user?.last_name]
            .filter(Boolean)
            .join(" ")
            .trim() || "Student";

    if (dashboard?.type === "student") {
        return (
            <AuthenticatedLayout>
                <Head title="Dashboard" />
                <StudentDashboard dashboard={dashboard} fullName={fullName} />
            </AuthenticatedLayout>
        );
    }

    return (
        <AuthenticatedLayout>
            <Head title="Dashboard" />
            <StaffDashboard dashboard={dashboard} />
        </AuthenticatedLayout>
    );
}
