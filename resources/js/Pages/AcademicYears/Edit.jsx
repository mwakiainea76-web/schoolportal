import React from "react";
import { Head, useForm, Link, router } from "@inertiajs/react";
import { useEffect, useState } from "react";
import TextInput from "@/Components/TextInput";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import Modal from "@/Components/Modal";

const toDateInputValue = (value) => (value ? String(value).slice(0, 10) : "");

const YEAR_STATUS = {
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
    academic_year,
    modalMode = false,
    open = false,
    onClose = () => {},
}) {
    const [statusProcessing, setStatusProcessing] = useState(false);
    const { data, setData, put, processing, errors } = useForm({
        academic_year: academic_year?.academic_year || "",
        start_date: toDateInputValue(academic_year?.start_date),
        end_date: toDateInputValue(academic_year?.end_date),
    });

    useEffect(() => {
        setData("academic_year", academic_year?.academic_year || "");
        setData("start_date", toDateInputValue(academic_year?.start_date));
        setData("end_date", toDateInputValue(academic_year?.end_date));
    }, [academic_year?.id]);

    const statusKey =
        academic_year?.status ||
        (academic_year?.is_active ? "ongoing" : "upcoming");
    const status = YEAR_STATUS[statusKey] || YEAR_STATUS.upcoming;

    const submit = (e) => {
        e.preventDefault();
        // Assuming the route uses the ID for updates
        put(
            route(
                "academic.years.update",
                encodeURIComponent(academic_year.id),
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

    const updateStatus = (action = status.action) => {
        setStatusProcessing(true);
        router.patch(
            route("academic.years.status", academic_year.id),
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
                        Current status{" "}
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
                                : `${status.actionLabel} Academic Year`}
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
                        <InputLabel>Academic Year Name</InputLabel>
                        <TextInput
                            value={data.academic_year}
                            onChange={(e) =>
                                setData("academic_year", e.target.value)
                            }
                            placeholder="e.g. 2023/2024"
                            error={errors.academic_year}
                        />
                        <InputError message={errors.academic_year} />
                    </div>
                    <div>
                        <InputLabel>Start Date</InputLabel>
                        <TextInput
                            type="date"
                            value={data.start_date}
                            onChange={(e) =>
                                setData("start_date", e.target.value)
                            }
                            error={errors.start_date}
                        />
                        <InputError message={errors.start_date} />
                    </div>
                    <div>
                        <InputLabel>End Date</InputLabel>
                        <TextInput
                            type="date"
                            value={data.end_date}
                            onChange={(e) =>
                                setData("end_date", e.target.value)
                            }
                            error={errors.end_date}
                        />
                        <InputError message={errors.end_date} />
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
                            href={route("academic.years.index")}
                            className="px-6 py-3 rounded-xl text-sm font-bold text-zinc-500 hover:bg-zinc-100 transition-colors"
                        >
                            Cancel
                        </Link>
                    )}

                    <PrimaryButton disabled={processing}>
                        {processing ? "Updating..." : "Update Academic Year"}
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
                title={`Edit Academic Year - ${academic_year?.academic_year}`}
            />

            <div className="max-w-7xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-700">
                {content}
            </div>
        </>
    );
}
