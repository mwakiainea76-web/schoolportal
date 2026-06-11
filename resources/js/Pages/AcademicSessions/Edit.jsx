import React from "react";
import { Head, useForm, Link, router } from "@inertiajs/react";
import { useEffect, useState } from "react";
import TextInput from "@/Components/TextInput";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import Modal from "@/Components/Modal";

const SESSION_STATUS = {
    upcoming: {
        label: "Upcoming",
        badgeClass: "bg-amber-100 text-amber-700",
        action: "start",
        actionLabel: "Activate",
    },
    ongoing: {
        label: "Ongoing",
        badgeClass: "bg-green-100 text-green-700",
        action: "end",
        actionLabel: "Deactivate",
    },
    completed: {
        label: "Completed",
        badgeClass: "bg-red-100 text-red-600",
        action: "reactivate",
        actionLabel: "Activate",
    },
    on_hold: {
        label: "On hold",
        badgeClass: "bg-slate-100 text-slate-700",
        action: "start",
        actionLabel: "Activate",
    },
};

export default function Edit({
    academic_session,
    modalMode = false,
    open = false,
    onClose = () => {},
}) {
    const [statusProcessing, setStatusProcessing] = useState(false);
    const { data, setData, put, processing, errors } = useForm({
        session_No: academic_session.session_No || "",
        academic_year_id: academic_session.academic_year_id || "",
    });

    useEffect(() => {
        setData({
            session_No: academic_session?.session_No || "",
            academic_year_id: academic_session?.academic_year_id || "",
        });
    }, [academic_session?.id]);

    const submit = (e) => {
        e.preventDefault();
        put(
            route(
                "academic.sessions.update",
                encodeURIComponent(academic_session.id),
            ),
            {
                preserveScroll: true,
                onSuccess: () => {
                    if (modalMode) {
                        onClose();
                    }
                },
            },
        );
    };

    const academicYearLabel =
        academic_session?.academicYear?.academic_year ||
        academic_session?.academic_year?.academic_year ||
        "";
    const statusKey =
        academic_session?.status ||
        (academic_session?.is_active ? "ongoing" : "upcoming");
    const status = SESSION_STATUS[statusKey] || SESSION_STATUS.upcoming;

    const updateStatus = (action = status.action) => {
        setStatusProcessing(true);
        router.patch(
            route("academic.sessions.status", academic_session.id),
            { action },
            {
                preserveScroll: true,
                onFinish: () => setStatusProcessing(false),
                onSuccess: () => {
                    if (modalMode) {
                        onClose();
                    }
                },
            },
        );
    };

    const content = (
        <div className="bg-white rounded-lg border border-zinc-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
            <form className="p-10 space-y-8" onSubmit={submit}>
                <div className="flex flex-col gap-3 text-sm text-zinc-500 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        Current status
                        <span
                            className={`ml-2 rounded px-2 py-0.5 text-xs ${status.badgeClass}`}
                        >
                            {status.label}
                        </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <button
                            type="button"
                            onClick={() => updateStatus()}
                            disabled={statusProcessing || processing}
                            className={`rounded-md px-4 py-2 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-50 ${
                                status.action === "end"
                                    ? "bg-red-600 hover:bg-red-700"
                                    : "bg-emerald-600 hover:bg-emerald-700"
                            }`}
                        >
                            {statusProcessing
                                ? "Updating..."
                                : `${status.actionLabel} Academic Session`}
                        </button>
                        {statusKey !== "on_hold" ? (
                            <button
                                type="button"
                                onClick={() => updateStatus("hold")}
                                disabled={statusProcessing || processing}
                                className="rounded-md bg-slate-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                Put On Hold
                            </button>
                        ) : null}
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <InputLabel value="Academic year" />
                        <TextInput
                            className="cursor-not-allowed bg-gray-100"
                            value={academicYearLabel}
                            disabled
                        />
                        <input
                            type="hidden"
                            name="academic_year_id"
                            value={data.academic_year_id}
                        />
                        <InputError message={errors.academic_year_id} />
                    </div>

                    <div>
                        <InputLabel>Session Number</InputLabel>
                        <TextInput
                            value={data.session_No}
                            onChange={(e) =>
                                setData("session_No", e.target.value)
                            }
                            placeholder="e.g. 1"
                            error={errors.session_No}
                        />
                        <InputError message={errors.session_No} />
                    </div>
                </div>

                <div className="pt-6 flex items-center justify-end gap-4 border-t border-zinc-50">
                    {modalMode ? (
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-3 rounded-xl text-sm font-bold text-zinc-500 hover:bg-zinc-100 transition-colors"
                        >
                            Cancel
                        </button>
                    ) : (
                        <Link
                            href={route("academic.sessions.index")}
                            className="px-6 py-3 rounded-xl text-sm font-bold text-zinc-500 hover:bg-zinc-100 transition-colors"
                        >
                            Cancel
                        </Link>
                    )}

                    <PrimaryButton disabled={processing}>
                        {processing ? "Updating..." : "Update Academic Session"}
                    </PrimaryButton>
                </div>
            </form>
        </div>
    );

    if (modalMode) {
        return (
            <Modal show={open} onClose={onClose} maxWidth="3xl" align="top">
                {content}
            </Modal>
        );
    }

    return (
        <>
            <Head
                title={`Edit Academic Session - ${academic_session?.session_No}`}
            />

            <div className="max-w-7xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-700">
                {content}
            </div>
        </>
    );
}
