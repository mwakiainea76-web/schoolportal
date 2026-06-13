import { useEffect, useState } from "react";
import { Link, useForm } from "@inertiajs/react";
import Checkbox from "@/Components/Checkbox";
import Modal from "@/Components/Modal";
import formatDate from "@/utils/date";
import {
    BookMarked,
    CreditCard,
    GraduationCap,
    ShieldCheck,
    Wallet,
} from "lucide-react";

const currency = (amount) =>
    `Ksh ${new Intl.NumberFormat("en-KE", {
        style: "decimal",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(Number(amount || 0))}`;

export default function StudentDashboard({ dashboard, fullName }) {
    const moduleUnitIds = (dashboard.module_units ?? []).map((unit) =>
        String(unit.id),
    );
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
    const {
        data: unitRegistrationData,
        setData: setUnitRegistrationData,
        post: postUnitRegistration,
        processing: unitRegistrationProcessing,
        errors: unitRegistrationErrors,
        clearErrors: clearUnitRegistrationErrors,
    } = useForm({
        curriculum_unit_ids: (dashboard.module_units ?? [])
            .filter((unit) => unit.is_registered)
            .map((unit) => String(unit.id)),
    });

    useEffect(() => {
        if (errors.session_registration) {
            setShowSessionRegistrationModal(true);
        }
    }, [errors.session_registration]);

    useEffect(() => {
        setUnitRegistrationData(
            "curriculum_unit_ids",
            (dashboard.module_units ?? [])
                .filter((unit) => unit.is_registered)
                .map((unit) => String(unit.id)),
        );
    }, [dashboard.module_units, setUnitRegistrationData]);

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

    const toggleUnitSelection = (unitId) => {
        const value = String(unitId);

        setUnitRegistrationData(
            "curriculum_unit_ids",
            unitRegistrationData.curriculum_unit_ids.includes(value)
                ? unitRegistrationData.curriculum_unit_ids.filter(
                      (id) => id !== value,
                  )
                : [...unitRegistrationData.curriculum_unit_ids, value],
        );
    };

    const submitUnitRegistration = (e) => {
        e.preventDefault();
        postUnitRegistration(route("student.dashboard.register-units"), {
            preserveScroll: true,
            onBefore: () => clearUnitRegistrationErrors(),
        });
    };

    const selectedUnitCount = unitRegistrationData.curriculum_unit_ids.length;
    const allModuleUnitsSelected =
        moduleUnitIds.length > 0 && selectedUnitCount === moduleUnitIds.length;

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
                            Keep track of your course progress, current session,
                            billing status, and learning units from one place.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-2">
                        <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur">
                            <p className="text-xs uppercase tracking-wide text-slate-300">
                                Course
                            </p>
                            <p className="mt-2 text-sm font-semibold">
                                {dashboard.course?.name ?? "Not assigned"}
                            </p>
                        </div>
                        <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur">
                            <p className="text-xs uppercase tracking-wide text-slate-300">
                                Version
                            </p>
                            <p className="mt-2 text-sm font-semibold">
                                {dashboard.course?.version ?? "Not assigned"}
                            </p>
                        </div>
                        <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur">
                            <p className="text-xs uppercase tracking-wide text-slate-300">
                                Reg. No
                            </p>
                            <p className="mt-2 text-sm font-semibold">
                                {dashboard.student?.admission_number ?? "-"}
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
                                This Module&apos;s Units
                            </h2>
                            <p className="mt-1 text-sm text-zinc-500">
                                Units assigned to your current module.
                            </p>
                        </div>
                        <div className="flex gap-4">
                            <Link
                                href={route("student.registered-units.index")}
                                className="text-sm font-medium text-emerald-700 transition hover:text-emerald-800"
                            >
                                Registered Units
                            </Link>
                            <Link
                                href={route("student.course-units.index")}
                                className="text-sm font-medium text-zinc-500 transition hover:text-zinc-700"
                            >
                                All Units
                            </Link>
                        </div>
                    </div>

                    <div className="mt-6">
                        {!dashboard.latest_session &&
                        dashboard.unit_registration?.blocker ? (
                            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm">
                                <p className="font-semibold text-amber-900">
                                    Register Your Session First
                                </p>
                                <p className="mt-2 text-amber-800">
                                    You must register for the current active
                                    session before you can register units. Once
                                    session registration is complete,
                                    you&apos;ll be able to select your units
                                    here.
                                </p>
                            </div>
                        ) : null}

                        {dashboard.module_units?.length ? (
                            <form
                                onSubmit={submitUnitRegistration}
                                className={`space-y-4 ${!dashboard.latest_session ? "mt-4" : ""}`}
                            >
                                <div className="overflow-hidden rounded-2xl border border-zinc-100">
                                    <div className="overflow-x-auto">
                                        <table className="w-full min-w-[42rem] border-collapse">
                                            <thead className="bg-zinc-50">
                                                <tr className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                                                    <th className="px-4 py-3 text-left">
                                                        Select
                                                    </th>
                                                    <th className="px-4 py-3 text-left">
                                                        Code
                                                    </th>
                                                    <th className="px-4 py-3 text-left">
                                                        Unit
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-zinc-100 bg-white">
                                                {dashboard.module_units.map(
                                                    (unit) => (
                                                        <tr
                                                            key={unit.id}
                                                            className="text-sm text-zinc-700"
                                                        >
                                                            <td className="px-4 py-3 align-top">
                                                                <label className="flex cursor-pointer items-center">
                                                                    <Checkbox
                                                                        checked={unitRegistrationData.curriculum_unit_ids.includes(
                                                                            String(
                                                                                unit.id,
                                                                            ),
                                                                        )}
                                                                        onChange={() =>
                                                                            toggleUnitSelection(
                                                                                unit.id,
                                                                            )
                                                                        }
                                                                        disabled={
                                                                            dashboard
                                                                                .unit_registration
                                                                                ?.is_complete ||
                                                                            !dashboard.latest_session
                                                                        }
                                                                        className="h-4 w-4 rounded border-zinc-300 text-emerald-600 focus:ring-emerald-600"
                                                                    />
                                                                </label>
                                                            </td>
                                                            <td className="px-4 py-3 align-top font-semibold text-emerald-700">
                                                                {unit.code ??
                                                                    "-"}
                                                            </td>
                                                            <td className="px-4 py-3 align-top">
                                                                <p className="font-semibold text-zinc-900">
                                                                    {unit.name}
                                                                </p>
                                                                <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-zinc-500">
                                                                    <span>
                                                                        Credit
                                                                        Factor:{" "}
                                                                        {unit.credit_factor ??
                                                                            "-"}
                                                                    </span>
                                                                    {unit.is_registered ? (
                                                                        <span className="rounded-full bg-emerald-100 px-2 py-0.5 font-semibold text-emerald-700">
                                                                            Registered
                                                                        </span>
                                                                    ) : null}
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ),
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                {unitRegistrationErrors.unit_registration ? (
                                    <p className="text-sm text-red-600">
                                        {
                                            unitRegistrationErrors.unit_registration
                                        }
                                    </p>
                                ) : null}

                                <div className="flex flex-col gap-3 rounded-2xl bg-zinc-50 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
                                    <div className="text-sm text-zinc-600">
                                        {dashboard.unit_registration
                                            ?.is_complete
                                            ? "Units registered"
                                            : "Register all units"}
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={
                                            unitRegistrationProcessing ||
                                            !dashboard.unit_registration
                                                ?.can_register ||
                                            !allModuleUnitsSelected ||
                                            !dashboard.latest_session
                                        }
                                        className="inline-flex rounded-xl bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        {unitRegistrationProcessing
                                            ? "Registering..."
                                            : "Register Units"}
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <div className="rounded-2xl bg-[#F8F9FA] px-4 py-4 text-sm text-zinc-500">
                                No units have been assigned to this module yet.
                            </div>
                        )}

                        <div className="mt-3 rounded-2xl bg-[#F8F9FA] px-4 py-3 text-xs text-zinc-500">
                            {dashboard.all_units_count
                                ? `${dashboard.all_units_count} total unit(s) are mapped to your curriculum.`
                                : "Your full unit list will appear once units are mapped to your curriculum."}
                        </div>
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
                                <p className="text-zinc-500">Curriculum</p>
                                <p className="mt-1 font-semibold text-zinc-900">
                                    {dashboard.course?.version ??
                                        "Not assigned"}
                                </p>
                            </div>
                            <div className="rounded-2xl bg-zinc-50 px-4 py-3">
                                <p className="text-zinc-500">Current Session</p>
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
                                <p className="text-zinc-500">Year of Study</p>
                                <p className="mt-1 font-semibold text-zinc-900">
                                    {dashboard.latest_session?.year_of_study
                                        ? `Year ${dashboard.latest_session.year_of_study}`
                                        : "-"}
                                </p>
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
                                Admission Number
                            </p>
                            <p className="mt-1 text-sm font-semibold text-zinc-900">
                                {dashboard.student?.admission_number ?? "-"}
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
