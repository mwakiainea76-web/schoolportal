import { Head, router } from "@inertiajs/react";
import { useMemo, useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import SearchSelect from "@/Components/SearchSelect";
import formatDate from "@/utils/date";
import AcademicYearCreate from "@/Pages/AcademicYears/Create";
import AcademicYearEdit from "@/Pages/AcademicYears/Edit";
import AcademicSessionCreate from "@/Pages/AcademicSessions/Create";
import AcademicSessionEdit from "@/Pages/AcademicSessions/Edit";

export default function Index({
    academic_years = [],
    selected_academic_year_id = "",
    active_academic_session_id = "",
    academic_sessions = [],
    filters = {},
}) {
    const [yearSearchTerm, setYearSearchTerm] = useState(
        filters.year_search || "",
    );
    const [addYearModalOpen, setAddYearModalOpen] = useState(false);
    const [editingYear, setEditingYear] = useState(null);
    const [addSessionModalOpen, setAddSessionModalOpen] = useState(false);
    const [editingSession, setEditingSession] = useState(null);

    const activeAcademicYearId = useMemo(
        () =>
            academic_years.find((year) => year.is_active)?.id
                ? String(academic_years.find((year) => year.is_active)?.id)
                : "",
        [academic_years],
    );

    const selectedYear = academic_years.find(
        (year) => String(year.id) === String(selected_academic_year_id),
    );

    const nextSessionNumber = useMemo(() => {
        if (!academic_sessions.length) {
            return 1;
        }

        return (
            Math.max(
                ...academic_sessions.map((session) =>
                    Number(session.session_No || 0),
                ),
            ) + 1
        );
    }, [academic_sessions]);

    const fetchSessions = (params) => {
        router.get(route("academic.sessions.index"), params, {
            preserveState: true,
            replace: true,
        });
    };

    const selectAcademicYear = (year) => {
        fetchSessions({
            academic_year_id: year.id,
            year_search: yearSearchTerm,
        });
    };

    const submitYearSearch = (event) => {
        event.preventDefault();

        fetchSessions({
            academic_year_id: selected_academic_year_id,
            year_search: yearSearchTerm,
        });
    };

    const handleDeleteSession = (id) => {
        if (!confirm("Are you sure you want to delete this session?")) {
            return;
        }

        router.delete(route("academic.sessions.destroy", id), {
            preserveState: true,
            replace: true,
        });
    };

    const handleDeleteYear = (id) => {
        if (!confirm("Are you sure you want to delete this academic year?")) {
            return;
        }

        router.delete(route("academic.years.destroy", id), {
            preserveState: true,
            replace: true,
        });
    };

    const updateYearStatus = (year, action) => {
        router.patch(
            route("academic.years.status", year.id),
            { action },
            {
                preserveScroll: true,
            },
        );
    };

    const updateSessionStatus = (session, action) => {
        router.patch(
            route("academic.sessions.status", session.id),
            { action },
            {
                preserveScroll: true,
            },
        );
    };

    const getYearStatus = (year) => {
        if (year.is_active) {
            return {
                label: "Ongoing",
                badgeClass: "bg-green-100 text-green-700",
                actionLabel: "End Year",
                action: "end",
                disabled: false,
                helper: "",
            };
        }

        if (year.end_date) {
            return {
                label: "Completed",
                badgeClass: "bg-red-100 text-red-600",
                actionLabel: "Reactivate",
                action: "reactivate",
                disabled:
                    Boolean(activeAcademicYearId) &&
                    String(activeAcademicYearId) !== String(year.id),
                helper:
                    "You can only reactivate an academic year after ending the previous one.",
            };
        }

        return {
            label: "Upcoming",
            badgeClass: "bg-amber-100 text-amber-700",
            actionLabel: "Start Year",
            action: "start",
            disabled:
                Boolean(activeAcademicYearId) &&
                String(activeAcademicYearId) !== String(year.id),
            helper:
                "You can only start an academic year after ending the previous one.",
        };
    };

    const getSessionStatus = (session) => {
        if (session.is_active) {
            return {
                label: "Ongoing",
                badgeClass: "bg-green-100 text-green-700",
                actionLabel: "End Session",
                action: "end",
                disabled: false,
                helper: "",
            };
        }

        if (session.end_date) {
            return {
                label: "Completed",
                badgeClass: "bg-red-100 text-red-600",
                actionLabel: "Reactivate",
                action: "reactivate",
                disabled:
                    Boolean(active_academic_session_id) &&
                    String(active_academic_session_id) !== String(session.id),
                helper:
                    "You can only reactivate a session after ending the previous active one.",
            };
        }

        return {
            label: "Upcoming",
            badgeClass: "bg-amber-100 text-amber-700",
            actionLabel: "Start Session",
            action: "start",
            disabled:
                Boolean(active_academic_session_id) &&
                String(active_academic_session_id) !== String(session.id),
            helper:
                "You can only start session after ending the previous.",
            title:
                "You can only start session after ending the previous.",
        };
    };

    const stopSelection = (event, callback) => {
        event.stopPropagation();
        callback();
    };

    return (
        <AuthenticatedLayout>
            <Head title="Academic Sessions" />

            <div className="mx-auto w-full max-w-7xl animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="flex w-full flex-col gap-6 lg:flex-row lg:items-start">
                    <section className="w-full shrink-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm lg:w-[380px] xl:w-[430px]">
                        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
                            <h2 className="text-lg font-semibold text-slate-900">
                                Academic Years
                            </h2>
                            <button
                                type="button"
                                onClick={() => setAddYearModalOpen(true)}
                                className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-700"
                            >
                                Add Academic Year
                            </button>
                        </div>

                        <div className="border-b border-slate-100 px-6 py-5">
                            <form
                                className="flex flex-col gap-3 md:flex-row"
                                onSubmit={submitYearSearch}
                            >
                                <SearchSelect
                                    routeName="academic.years.search"
                                    defaultOptions={academic_years.map((year) => ({
                                        id: String(year.id),
                                        name: year.label || year.academic_year,
                                    }))}
                                    value={selected_academic_year_id}
                                    selectedLabel={yearSearchTerm}
                                    placeholder="Search academic years..."
                                    preloadOptions
                                    minSearchLength={0}
                                    onChange={(item) => {
                                        setYearSearchTerm(item?.name || "");

                                        if (item?.id) {
                                            fetchSessions({
                                                academic_year_id: item.id,
                                                year_search: item.name || "",
                                            });
                                        }
                                    }}
                                />
                                <button
                                    type="button"
                                    onClick={() => {
                                        setYearSearchTerm("");
                                        fetchSessions({});
                                    }}
                                    className="rounded border border-zinc-200 px-3 py-2 text-sm font-semibold text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-700"
                                    title="Clear academic year filter"
                                >
                                    X
                                </button>
                                <button
                                    className="rounded bg-emerald-700 px-5 py-2 text-sm font-semibold text-white transition hover:bg-emerald-800"
                                    type="submit"
                                >
                                    Search
                                </button>
                            </form>
                        </div>

                        <div className="divide-y divide-slate-100">
                            {academic_years.length > 0 ? (
                                academic_years.map((year) => {
                                    const isSelected =
                                        String(year.id) ===
                                        String(selected_academic_year_id);
                                    const status = getYearStatus(year);

                                    return (
                                        <div
                                            role="button"
                                            tabIndex={0}
                                            key={year.id}
                                            onClick={() =>
                                                selectAcademicYear(year)
                                            }
                                            onKeyDown={(event) => {
                                                if (
                                                    event.key === "Enter" ||
                                                    event.key === " "
                                                ) {
                                                    event.preventDefault();
                                                    selectAcademicYear(year);
                                                }
                                            }}
                                            className={`block w-full px-6 py-5 text-left transition ${
                                                isSelected
                                                    ? "bg-emerald-50"
                                                    : "bg-white hover:bg-slate-50"
                                            }`}
                                        >
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="min-w-0">
                                                    <p className="truncate text-lg font-semibold text-slate-700">
                                                        {year.academic_year}
                                                    </p>
                                                    <p className="mt-2 text-sm text-slate-500">
                                                        Start{" "}
                                                        {formatDate(
                                                            year.start_date,
                                                        )}{" "}
                                                        | End{" "}
                                                        {formatDate(
                                                            year.end_date,
                                                        )}
                                                    </p>
                                                </div>

                                                <span
                                                    className={`rounded px-2 py-0.5 text-xs ${status.badgeClass}`}
                                                >
                                                    {status.label}
                                                </span>
                                            </div>

                                            <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
                                                <button
                                                    type="button"
                                                    onClick={(event) =>
                                                        stopSelection(
                                                            event,
                                                            () =>
                                                                setEditingYear(
                                                                    year,
                                                                ),
                                                        )
                                                    }
                                                    className="text-emerald-600 hover:underline"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={(event) =>
                                                        stopSelection(
                                                            event,
                                                            () =>
                                                                handleDeleteYear(
                                                                    year.id,
                                                                ),
                                                        )
                                                    }
                                                    className="text-red-600 hover:underline"
                                                >
                                                    Delete
                                                </button>
                                                <button
                                                    type="button"
                                                    title={
                                                        status.disabled
                                                            ? status.helper
                                                            : ""
                                                    }
                                                    disabled={status.disabled}
                                                    onClick={(event) =>
                                                        stopSelection(
                                                            event,
                                                            () =>
                                                                !status.disabled &&
                                                                updateYearStatus(
                                                                    year,
                                                                    status.action,
                                                                ),
                                                        )
                                                    }
                                                    className={`${
                                                        status.disabled
                                                            ? "cursor-not-allowed text-slate-400"
                                                            : "text-slate-700 hover:text-emerald-700 hover:underline"
                                                    }`}
                                                >
                                                    {status.actionLabel}
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="px-6 py-10 text-center text-sm text-slate-500">
                                    No academic years found.
                                </div>
                            )}
                        </div>
                    </section>

                    <section className="min-h-[260px] w-full min-w-0 flex-1 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                        <div className="flex flex-col gap-4 border-b border-slate-100 px-6 py-4 lg:flex-row lg:items-center lg:justify-between">
                            <div>
                                <h2 className="text-lg font-semibold text-slate-900">
                                    Sessions for{" "}
                                    <span className="text-slate-600">
                                        {selectedYear?.academic_year ??
                                            "No year selected"}
                                    </span>
                                </h2>
                            </div>
                            <button
                                type="button"
                                onClick={() => setAddSessionModalOpen(true)}
                                disabled={!selectedYear}
                                className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                            >
                                Add Academic Session
                            </button>
                        </div>

                        <div className="px-6 py-6">
                            {selected_academic_year_id ? (
                                academic_sessions.length > 0 ? (
                                    <div className="space-y-4">
                                        {academic_sessions.map((session) => {
                                            const status =
                                                getSessionStatus(session);

                                            return (
                                                <div
                                                    key={session.id}
                                                    className="rounded-2xl border border-slate-200 bg-white px-5 py-4"
                                                >
                                                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                                                        <div>
                                                            <p className="text-lg font-semibold text-slate-800">
                                                                Session{" "}
                                                                {session.session_No}
                                                            </p>
                                                            <div className="mt-2 flex flex-wrap gap-3 text-sm text-slate-500">
                                                                <span>
                                                                    Start:{" "}
                                                                    {formatDate(
                                                                        session.start_date,
                                                                    )}
                                                                </span>
                                                                <span>
                                                                    End:{" "}
                                                                    {formatDate(
                                                                        session.end_date,
                                                                    )}
                                                                </span>
                                                                <span>
                                                                    Created:{" "}
                                                                    {formatDate(
                                                                        session.created_at,
                                                                    )}
                                                                </span>
                                                            </div>
                                                        </div>

                                                        <span
                                                            className={`rounded px-2 py-0.5 text-xs ${status.badgeClass}`}
                                                        >
                                                            {status.label}
                                                        </span>
                                                    </div>

                                                    <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                setEditingSession(
                                                                    session,
                                                                )
                                                            }
                                                            className="text-emerald-600 hover:underline"
                                                        >
                                                            Edit
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                handleDeleteSession(
                                                                    session.id,
                                                                )
                                                            }
                                                            className="text-red-600 hover:underline"
                                                        >
                                                            Delete
                                                        </button>
                                                        <button
                                                            type="button"
                                                            title={
                                                                status.disabled
                                                                    ? status.helper
                                                                    : ""
                                                            }
                                                            disabled={
                                                                status.disabled
                                                            }
                                                            onClick={() =>
                                                                !status.disabled &&
                                                                updateSessionStatus(
                                                                    session,
                                                                    status.action,
                                                                )
                                                            }
                                                            className={`${
                                                                status.disabled
                                                                    ? "cursor-not-allowed text-slate-400"
                                                                    : "text-slate-700 hover:text-emerald-700 hover:underline"
                                                            }`}
                                                        >
                                                            {status.actionLabel}
                                                        </button>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <div className="px-6 py-16 text-center text-sm text-slate-500">
                                        No sessions found for the selected
                                        academic year.
                                    </div>
                                )
                            ) : (
                                <div className="px-6 py-16 text-center text-sm text-slate-500">
                                    Select an academic year to view its
                                    sessions.
                                </div>
                            )}
                        </div>
                    </section>
                </div>
            </div>

            <AcademicYearCreate
                modalMode
                open={addYearModalOpen}
                onClose={() => setAddYearModalOpen(false)}
            />

            {editingYear ? (
                <AcademicYearEdit
                    modalMode
                    open={Boolean(editingYear)}
                    onClose={() => setEditingYear(null)}
                    academic_year={editingYear}
                />
            ) : null}

            <AcademicSessionCreate
                modalMode
                open={addSessionModalOpen}
                onClose={() => setAddSessionModalOpen(false)}
                academic_year={selectedYear}
                session_no={nextSessionNumber}
                prerequisite_error={
                    selectedYear
                        ? null
                        : "Select an academic year before creating a session."
                }
            />

            {editingSession ? (
                <AcademicSessionEdit
                    modalMode
                    open={Boolean(editingSession)}
                    onClose={() => setEditingSession(null)}
                    academic_session={editingSession}
                />
            ) : null}
        </AuthenticatedLayout>
    );
}
