import { Head, Link, router } from "@inertiajs/react";
import { useState } from "react";
import SearchSelect from "@/Components/SearchSelect";

export default function Index({
    weekly_board,
    weekly_grid,
    lesson_columns,
    filters,
    session_options,
    trainers,
    course_options,
    module_options,
    days,
    is_hod,
    is_trainer,
    can_manage_timetables,
    should_load_timetable,
    current_session_note,
}) {
    const pageFilters =
        filters && !Array.isArray(filters) && typeof filters === "object"
            ? filters
            : {};

    const [currentFilterKey, setCurrentFilterKey] = useState("");
    const [draftFilters, setDraftFilters] = useState({
        academic_session_id: pageFilters.academic_session_id || "",
        trainer_staff_id: pageFilters.trainer_staff_id || "",
        curriculum_mapping_id: pageFilters.curriculum_mapping_id || "",
        module_number: pageFilters.module_number || "",
        day_of_week: pageFilters.day_of_week || "",
    });

    const applyFilters = (nextFilters) => {
        router.get(route("academic.timetables.index"), nextFilters, {
            preserveState: true,
            replace: true,
        });
    };

    const buildNextFilters = (field, value) => {
        const nextFilters = {
            ...pageFilters,
            lecture_room_id: "",
            [field]: value,
        };


        if (field === "curriculum_mapping_id") {
            nextFilters.module_number = "";
        }

        if (is_trainer) {
            nextFilters.academic_session_id = pageFilters.academic_session_id;
            nextFilters.trainer_staff_id = pageFilters.trainer_staff_id;
        }

        return nextFilters;
    };

    const onFilterChange = (field, value) => {
        const nextFilters = buildNextFilters(field, value);

        setDraftFilters((current) => ({
            ...current,
            ...nextFilters,
        }));

        applyFilters(nextFilters);
    };

    const setDraftFilter = (field, value) => {
        setDraftFilters((current) => {
            const nextFilters = {
                ...current,
                [field]: value,
            };


            if (field === "curriculum_mapping_id") {
                nextFilters.module_number = "";
            }

            return nextFilters;
        });
    };

    const resetFilters = () => {
        const nextFilters = {
            academic_session_id:
                session_options.find((session) => session.is_active)?.id || "",
            trainer_staff_id: is_trainer ? pageFilters.trainer_staff_id : "",
            curriculum_mapping_id: "",
            module_number: "",
            day_of_week: "",
        };

        setCurrentFilterKey("");
        setDraftFilters(nextFilters);
        applyFilters(nextFilters);
    };

    const trainerFiltersReady = is_hod || is_trainer
        ? Boolean(pageFilters.academic_session_id)
        : Boolean(pageFilters.academic_session_id);

    const adminLoadPathReady = Boolean(
        pageFilters.academic_session_id &&
            (pageFilters.trainer_staff_id ||
                (pageFilters.curriculum_mapping_id && pageFilters.module_number)),
    );

    const addTimetableHref = is_hod
        ? route("academic.timetables.hod.create")
        : route("academic.timetables.create");
    const canAddTimetable = is_hod || Boolean(can_manage_timetables);
    const handleDownloadPdf = () => {
        window.print();
    };

    const FILTER_DEFINITIONS = [
        ...(!is_trainer
            ? [
                  {
                      key: "academic_session_id",
                      label: "Academic Session",
                  },
              ]
            : []),
        {
            key: "curriculum_mapping_id",
            label: "Versioned Course",
        },
        {
            key: "module_number",
            label: "Module",
        },
        ...(!is_hod && !is_trainer
            ? [
                  {
                      key: "trainer_staff_id",
                      label: "Trainer",
                  },
              ]
            : []),
        {
            key: "day_of_week",
            label: "Day",
        },
    ];

    const currentFilter = FILTER_DEFINITIONS.find(
        (filter) => filter.key === currentFilterKey,
    );

    const hasCurrentFilterValue =
        currentFilterKey && Boolean(draftFilters[currentFilterKey]);

    const activeFilters = FILTER_DEFINITIONS.filter(
        (filter) => pageFilters[filter.key],
    );

    const findOptionLabel = (options, value, labelKey = "name") => {
        const option = options.find(
            (item) => String(item.id) === String(value),
        );

        return option?.[labelKey] || value;
    };

    const getSelectedOptionLabel = (filter) => {
        const value = pageFilters[filter.key];

        if (!value) return "";

        if (filter.key === "academic_session_id") {
            return findOptionLabel(session_options, value);
        }


        if (filter.key === "curriculum_mapping_id") {
            return findOptionLabel(course_options, value);
        }

        if (filter.key === "module_number") {
            return findOptionLabel(module_options, value);
        }

        if (filter.key === "trainer_staff_id") {
            return findOptionLabel(trainers, value);
        }

        if (filter.key === "day_of_week") {
            return findOptionLabel(days, value);
        }

        return value;
    };

    const clearSingleFilter = (key) => {
        onFilterChange(key, "");
    };

    const selectFilterColumn = (key) => {
        setCurrentFilterKey(key);

        if (!key) return;

        setDraftFilters((current) => ({
            ...current,
            [key]: pageFilters[key] || current[key] || "",
        }));
    };

    const addCurrentFilter = () => {
        if (!hasCurrentFilterValue) return;

        onFilterChange(currentFilterKey, draftFilters[currentFilterKey]);
        setCurrentFilterKey("");
    };

    const submitFilters = (event) => {
        event.preventDefault();

        if (hasCurrentFilterValue) {
            addCurrentFilter();
            return;
        }

        applyFilters(pageFilters);
    };

    const renderFilterInput = (filter) => {
        if (!filter) {
            return (
                <div className="rounded-xl border border-dashed border-zinc-200 bg-zinc-50 px-4 py-2.5 text-sm text-zinc-400">
                    Select a column to show its input
                </div>
            );
        }

        if (filter.key === "academic_session_id") {
            return (
                <select
                    value={draftFilters.academic_session_id}
                    onChange={(e) =>
                        setDraftFilter("academic_session_id", e.target.value)
                    }
                    disabled={!session_options.length}
                    className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 disabled:cursor-not-allowed disabled:bg-zinc-100"
                >
                    {session_options.length ? (
                        session_options.map((session) => (
                            <option key={session.id} value={session.id}>
                                {session.name}
                                {session.is_active ? " (Current)" : ""}
                            </option>
                        ))
                    ) : (
                        <option value="">Run migration to enable sessions</option>
                    )}
                </select>
            );
        }


        if (filter.key === "curriculum_mapping_id") {
            if (is_hod || is_trainer) {
                return (
                    <select
                        value={draftFilters.curriculum_mapping_id}
                        onChange={(e) =>
                            setDraftFilter(
                                "curriculum_mapping_id",
                                e.target.value,
                            )
                        }
                        className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
                    >
                        <option value="">All versioned courses</option>
                        {course_options.map((course) => (
                            <option key={course.id} value={course.id}>
                                {course.name}
                            </option>
                        ))}
                    </select>
                );
            }

            return (
                <SearchSelect
                    routeName="academic.timetables.courses.search"
                    routeParams={{
                        limit: 4,
                    }}
                    defaultOptions={course_options}
                    value={draftFilters.curriculum_mapping_id}
                    placeholder="Search versioned course..."
                    onChange={(item) =>
                        setDraftFilter("curriculum_mapping_id", item.id)
                    }
                />
            );
        }

        if (filter.key === "module_number") {
            return (
                <select
                    value={draftFilters.module_number}
                    onChange={(e) =>
                        setDraftFilter("module_number", e.target.value)
                    }
                    disabled={!pageFilters.curriculum_mapping_id}
                    className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 disabled:cursor-not-allowed disabled:bg-zinc-100"
                >
                    <option value="">Select module</option>
                    {module_options.map((module) => (
                        <option key={module.id} value={module.id}>
                            {module.name}
                        </option>
                    ))}
                </select>
            );
        }

        if (filter.key === "trainer_staff_id") {
            return (
                <select
                    value={draftFilters.trainer_staff_id}
                    onChange={(e) =>
                        setDraftFilter("trainer_staff_id", e.target.value)
                    }
                    disabled={!trainerFiltersReady}
                    className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 disabled:cursor-not-allowed disabled:bg-zinc-100"
                >
                    <option value="">All trainers</option>
                    {trainers.map((trainer) => (
                        <option key={trainer.id} value={trainer.id}>
                            {trainer.name}
                        </option>
                    ))}
                </select>
            );
        }

        if (filter.key === "day_of_week") {
            return (
                <select
                    value={draftFilters.day_of_week}
                    onChange={(e) =>
                        setDraftFilter("day_of_week", e.target.value)
                    }
                    disabled={!adminLoadPathReady}
                    className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 disabled:cursor-not-allowed disabled:bg-zinc-100"
                >
                    <option value="">All days</option>
                    {days.map((day) => (
                        <option key={day.id} value={day.id}>
                            {day.name}
                        </option>
                    ))}
                </select>
            );
        }

        return null;
    };

    return (
        <>
            <Head title="Timetable" />
            <style>{`
                @media print {
                    body * {
                        visibility: hidden;
                    }

                    #timetable-print-area,
                    #timetable-print-area * {
                        visibility: visible;
                    }

                    #timetable-print-area {
                        position: absolute;
                        left: 0;
                        top: 0;
                        width: 100%;
                        padding: 0;
                        margin: 0;
                    }

                    #timetable-print-area table {
                        width: 100%;
                        border-collapse: collapse;
                    }

                    #timetable-print-area th,
                    #timetable-print-area td {
                        break-inside: avoid;
                        page-break-inside: avoid;
                    }

                    .print-hide {
                        display: none !important;
                    }
                }
            `}</style>

            <div className="space-y-8">


                <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
                    <form onSubmit={submitFilters}>
                        <div className="grid grid-cols-1 items-end gap-3 lg:grid-cols-[minmax(220px,300px)_minmax(280px,1fr)_auto_auto_auto]">
                            <div>
                                <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                                    Filter Column
                                </label>
                                <select
                                    value={currentFilterKey}
                                    onChange={(e) =>
                                        selectFilterColumn(e.target.value)
                                    }
                                    className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
                                >
                                    <option value="">Choose column...</option>
                                    {FILTER_DEFINITIONS.map((filter) => (
                                        <option
                                            key={filter.key}
                                            value={filter.key}
                                        >
                                            {filter.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                                    {currentFilter?.label || "Filter Value"}
                                </label>
                                {renderFilterInput(currentFilter)}
                            </div>

                            <button
                                type="button"
                                onClick={addCurrentFilter}
                                disabled={!hasCurrentFilterValue}
                                className="inline-flex h-10 items-center justify-center rounded-lg border border-zinc-300 bg-white px-4 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                + Add filter
                            </button>

                            <button
                                type="button"
                                onClick={resetFilters}
                                className="inline-flex h-10 items-center justify-center rounded-lg border border-zinc-300 bg-white px-4 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50"
                            >
                                Reset Filters
                            </button>

                            <button
                                type="submit"
                                className="inline-flex h-10 items-center justify-center rounded-lg bg-emerald-600 px-4 text-sm font-medium text-white transition hover:bg-emerald-700"
                            >
                                Apply
                            </button>
                        </div>

                        <div className="mt-4 border-t border-zinc-100 pt-3">
                          

                            {activeFilters.length ? (
                                <div className="flex flex-wrap gap-2">
                                    {activeFilters.map((filter) => (
                                        <button
                                            key={filter.key}
                                            type="button"
                                            onClick={() =>
                                                clearSingleFilter(filter.key)
                                            }
                                            className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 ring-1 ring-emerald-100 hover:bg-emerald-100"
                                        >
                                            <span>
                                                {filter.label}:{" "}
                                                {getSelectedOptionLabel(filter)}
                                            </span>
                                            <span className="text-emerald-900">
                                                ×
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-zinc-500">
                                    No filters selected. Choose a column above to filter this timetable.
                                </p>
                            )}
                        </div>
                    </form>
                </section>

                <section
                    id="timetable-print-area"
                    className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm"
                >
                    {should_load_timetable ? (
                        <>
                            <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
                                <h2 className="text-lg font-semibold text-zinc-900">
                                    Weekly Lesson Grid
                                </h2>
                                <div className="flex flex-col gap-3 lg:items-end">
                                    <p className="text-sm text-zinc-500">
                                        Lesson columns show the time from and to.
                                        Each slot includes the room and assigned
                                        trainer helper.
                                    </p>
                                    <button
                                        type="button"
                                        onClick={handleDownloadPdf}
                                        className="print-hide inline-flex items-center justify-center rounded-xl bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-700"
                                    >
                                        Download Timetable PDF
                                    </button>
                                </div>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="min-w-full border-separate border-spacing-0">
                                    <thead>
                                        <tr>
                                            <th className="sticky left-0 z-10 min-w-32 rounded-tl-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                                                Day
                                            </th>
                                            {lesson_columns.length ? (
                                                lesson_columns.map((lesson, index) => (
                                                    <th
                                                        key={lesson.key}
                                                        className={`min-w-64 border border-zinc-200 bg-zinc-50 px-4 py-3 text-left ${
                                                            index === lesson_columns.length - 1
                                                                ? "rounded-tr-2xl"
                                                                : ""
                                                        }`}
                                                    >
                                                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                                                            Lesson {index + 1}
                                                        </p>
                                                        <p className="mt-1 text-sm font-semibold text-zinc-900">
                                                            {lesson.label}
                                                        </p>
                                                        <p className="mt-1 text-xs text-zinc-500">
                                                            Time from {lesson.start_time} to{" "}
                                                            {lesson.end_time}
                                                        </p>
                                                    </th>
                                                ))
                                            ) : (
                                                <th className="rounded-tr-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-left text-sm text-zinc-500">
                                                    No lesson columns yet
                                                </th>
                                            )}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {weekly_grid.map((dayRow) => (
                                            <tr key={dayRow.day}>
                                                <td className="sticky left-0 z-10 min-w-32 border border-zinc-200 bg-white px-4 py-4 align-top">
                                                    <p className="text-sm font-semibold text-zinc-900">
                                                        {dayRow.label}
                                                    </p>
                                                </td>
                                                {lesson_columns.length ? (
                                                    dayRow.lessons.map((lessonCell) => (
                                                        <td
                                                            key={lessonCell.key}
                                                            className="min-w-64 border border-zinc-200 bg-white p-3 align-top"
                                                        >
                                                            {lessonCell.sessions.length ? (
                                                                <div className="space-y-3">
                                                                    {lessonCell.sessions.map((session) => (
                                                                        <div
                                                                            key={session.id}
                                                                            className="rounded-2xl border border-zinc-100 bg-zinc-50 p-3"
                                                                        >
                                                                            <p className="text-sm font-semibold text-zinc-900">
                                                                                {session.merged_units
                                                                                    .map((unit) => unit.code)
                                                                                    .filter(Boolean)
                                                                                    .join(", ") || session.unit_code}
                                                                            </p>
                                                                            <p className="mt-1 text-xs text-zinc-500">
                                                                                Trainer:{" "}
                                                                                {session.trainer_name}
                                                                            </p>
                                                                            <p className="mt-1 text-xs text-zinc-500">
                                                                                Venue:{" "}
                                                                                {session.lecture_room_code}{" "}
                                                                                {session.lecture_room_name}
                                                                            </p>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            ) : (
                                                                <div className="rounded-2xl border border-dashed border-zinc-200 px-3 py-6 text-center text-sm text-zinc-400">
                                                                    No lesson assigned.
                                                                </div>
                                                            )}
                                                        </td>
                                                    ))
                                                ) : (
                                                    <td className="border border-zinc-200 px-4 py-6 text-sm text-zinc-400">
                                                        No sessions planned.
                                                    </td>
                                                )}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    ) : (
                        <div className="rounded-2xl border border-dashed border-zinc-200 px-6 py-12 text-center">
                            <p className="text-lg font-semibold text-zinc-900">
                                Timetable Grid Awaits Filters
                            </p>
                            <p className="mt-2 text-sm text-zinc-500">
                                Select a versioned course and module, or select a
                                trainer, to load the timetable grid.
                            </p>
                        </div>
                    )}
                </section>
            </div>
        </>
    );
}
