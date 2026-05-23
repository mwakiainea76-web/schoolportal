import { useState } from "react";
import { Head, Link, useForm, usePage } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import Modal from "@/Components/Modal";
import {
    BookMarked,
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
                ? `Next due ${dashboard.finance.next_invoice_due_date}`
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

    const submitSessionRegistration = (e) => {
        e.preventDefault();
        post(route("student.dashboard.register-session"), {
            preserveScroll: true,
            onSuccess: () => {
                clearErrors();
                setShowSessionRegistrationModal(false);
            },
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
                            session, and billing status from one place.
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
                        <div className="rounded-2xl bg-emerald-50 p-3 text-emerald-600">
                            <Receipt className="h-5 w-5" />
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
                                                statusClasses[
                                                    invoice.status
                                                ] ??
                                                "bg-slate-100 text-slate-600"
                                            }`}
                                        >
                                            {invoice.status}
                                        </span>
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
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowSessionRegistrationModal(
                                                true,
                                            )
                                        }
                                        className="mt-3 inline-flex rounded-xl bg-emerald-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-emerald-700"
                                    >
                                        Register current active session
                                    </button>
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
                                Quick Actions
                            </h2>
                            <div className="rounded-2xl bg-amber-50 p-3 text-amber-600">
                                <CalendarDays className="h-5 w-5" />
                            </div>
                        </div>

                        <div className="mt-6 grid gap-3">
                            <Link
                                href={route("profile.edit")}
                                className="rounded-2xl border border-zinc-200 px-4 py-3 text-sm font-medium text-zinc-700 transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700"
                            >
                                Update profile details
                            </Link>
                            <div className="rounded-2xl bg-[#F8F9FA] px-4 py-3 text-sm text-zinc-500">
                                Track invoices, sessions, and study status
                                from this dashboard as new records are added.
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
                                    processing || !dashboard.active_session
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

    return (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-700">
            <h1 className="text-3xl font-bold text-zinc-900 tracking-tight">
                Academic Overview
            </h1>
            <p className="text-zinc-500 mt-1">
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
