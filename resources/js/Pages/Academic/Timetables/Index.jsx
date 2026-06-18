import { Head, Link, router } from "@inertiajs/react";
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
    should_load_timetable,
    current_session_note,
    current_department_id,
}) {
    const pageFilters =
        filters && !Array.isArray(filters) && typeof filters === "object"
            ? filters
            : {};

    const applyFilters = (nextFilters) => {
        router.get(route("academic.timetables.index"), nextFilters, {
            preserveState: true,
            replace: true,
        });
    };

    const setFilter = (field, value) => {
        const next = {
            ...pageFilters,
            [field]: value,
            lecture_room_id: "",
        };
        if (field === "curriculum_mapping_id") {
            next.module_number = "";
        }
        if (is_trainer) {
            next.trainer_staff_id = pageFilters.trainer_staff_id || "";
        }
        applyFilters(next);
    };

    const handleDownloadPdf = () => {
        window.print();
    };

    return (
        <>
            <Head title="Timetable" />
            <style>{`
                @media print {
                    body * { visibility: hidden; }
                    #timetable-print-area, #timetable-print-area * { visibility: visible; }
                    #timetable-print-area { position: absolute; left: 0; top: 0; width: 100%; padding: 0; margin: 0; }
                    #timetable-print-area table { width: 100%; border-collapse: collapse; }
                    #timetable-print-area th, #timetable-print-area td { break-inside: avoid; page-break-inside: avoid; }
                    .print-hide { display: none !important; }
                }
            `}</style>

            <div className="space-y-8">
                <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
                        {session_options.length > 0 && (
                            <div>
                                <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                                    Academic Session
                                </label>
                                <select
                                    value={pageFilters.academic_session_id || ""}
                                    onChange={(e) =>
                                        setFilter(
                                            "academic_session_id",
                                            e.target.value,
                                        )
                                    }
                                    className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
                                >
                                    <option value="">All sessions</option>
                                    {session_options.map((session) => (
                                        <option
                                            key={session.id}
                                            value={session.id}
                                        >
                                            {session.name}
                                            {session.is_active
                                                ? " (Current)"
                                                : ""}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}

                        <div>
                            <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                                Course
                            </label>
                            {!is_hod && !is_trainer ? (
                                <SearchSelect
                                    routeName="academic.timetables.courses.search"
                                    routeParams={{ limit: 4 }}
                                    defaultOptions={course_options}
                                    value={pageFilters.curriculum_mapping_id || ""}
                                    placeholder="Search course..."
                                    onChange={(item) =>
                                        setFilter(
                                            "curriculum_mapping_id",
                                            item.id,
                                        )
                                    }
                                />
                            ) : (
                                <select
                                    value={
                                        pageFilters.curriculum_mapping_id || ""
                                    }
                                    onChange={(e) =>
                                        setFilter(
                                            "curriculum_mapping_id",
                                            e.target.value,
                                        )
                                    }
                                    className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
                                >
                                    <option value="">All courses</option>
                                    {course_options.map((course) => (
                                        <option key={course.id} value={course.id}>
                                            {course.name}
                                        </option>
                                    ))}
                                </select>
                            )}
                        </div>

                        <div>
                            <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                                Module
                            </label>
                            <select
                                value={pageFilters.module_number || ""}
                                onChange={(e) =>
                                    setFilter("module_number", e.target.value)
                                }
                                disabled={
                                    !pageFilters.curriculum_mapping_id
                                }
                                className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 disabled:cursor-not-allowed disabled:bg-zinc-100"
                            >
                                <option value="">All modules</option>
                                {module_options.map((mod) => (
                                    <option key={mod.id} value={mod.id}>
                                        {mod.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {!is_hod && !is_trainer && (
                            <div>
                                <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                                    Trainer
                                </label>
                                <select
                                    value={
                                        pageFilters.trainer_staff_id || ""
                                    }
                                    onChange={(e) =>
                                        setFilter(
                                            "trainer_staff_id",
                                            e.target.value,
                                        )
                                    }
                                    className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
                                >
                                    <option value="">All trainers</option>
                                    {trainers.map((trainer) => (
                                        <option
                                            key={trainer.id}
                                            value={trainer.id}
                                        >
                                            {trainer.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}

                        <div>
                            <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                                Day
                            </label>
                            <select
                                value={pageFilters.day_of_week || ""}
                                onChange={(e) =>
                                    setFilter("day_of_week", e.target.value)
                                }
                                className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
                            >
                                <option value="">All days</option>
                                {days.map((day) => (
                                    <option key={day.id} value={day.id}>
                                        {day.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {current_session_note && (
                        <p className="mt-3 text-sm text-zinc-500">
                            {current_session_note}
                        </p>
                    )}

                    {(is_hod || is_trainer) && (
                        <p className="mt-2 text-xs text-zinc-400">
                            {is_trainer
                                ? "Timetable is scoped to your assigned courses and trainer profile."
                                : "Timetable is scoped to your department."}
                        </p>
                    )}
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
                                        Lesson columns show the time from and
                                        to. Each slot includes the room and
                                        assigned trainer helper.
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
                                                lesson_columns.map(
                                                    (lesson, index) => (
                                                        <th
                                                            key={lesson.key}
                                                            className={`min-w-64 border border-zinc-200 bg-zinc-50 px-4 py-3 text-left ${
                                                                index ===
                                                                lesson_columns.length -
                                                                    1
                                                                    ? "rounded-tr-2xl"
                                                                    : ""
                                                            }`}
                                                        >
                                                            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                                                                Lesson{" "}
                                                                {index + 1}
                                                            </p>
                                                            <p className="mt-1 text-sm font-semibold text-zinc-900">
                                                                {lesson.label}
                                                            </p>
                                                            <p className="mt-1 text-xs text-zinc-500">
                                                                Time from{" "}
                                                                {lesson.start_time}{" "}
                                                                to{" "}
                                                                {lesson.end_time}
                                                            </p>
                                                        </th>
                                                    ),
                                                )
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
                                                    dayRow.lessons.map(
                                                        (lessonCell) => (
                                                            <td
                                                                key={
                                                                    lessonCell.key
                                                                }
                                                                className="min-w-64 border border-zinc-200 bg-white p-3 align-top"
                                                            >
                                                                {lessonCell
                                                                    .sessions
                                                                    .length ? (
                                                                    <div className="space-y-3">
                                                                        {lessonCell.sessions.map(
                                                                            (
                                                                                session,
                                                                            ) => (
                                                                                <div
                                                                                    key={
                                                                                        session.id
                                                                                    }
                                                                                    className="rounded-2xl border border-zinc-100 bg-zinc-50 p-3"
                                                                                >
                                                                                    <p className="text-sm font-semibold text-zinc-900">
                                                                                        {session.merged_units
                                                                                            .map(
                                                                                                (
                                                                                                    unit,
                                                                                                ) =>
                                                                                                    unit.code,
                                                                                            )
                                                                                            .filter(
                                                                                                Boolean,
                                                                                            )
                                                                                            .join(
                                                                                                ", ",
                                                                                            ) ||
                                                                                            session.unit_code}
                                                                                    </p>
                                                                                    <p className="mt-1 text-xs text-zinc-500">
                                                                                        Trainer:{" "}
                                                                                        {
                                                                                            session.trainer_name
                                                                                        }
                                                                                    </p>
                                                                                    <p className="mt-1 text-xs text-zinc-500">
                                                                                        Venue:{" "}
                                                                                        {
                                                                                            session.lecture_room_code
                                                                                        }{" "}
                                                                                        {
                                                                                            session.lecture_room_name
                                                                                        }
                                                                                    </p>
                                                                                    {!is_trainer && (
                                                                                        <div className="print-hide mt-2 flex gap-2 border-t border-zinc-200 pt-2">
                                                                                            <Link
                                                                                                href={route(
                                                                                                    "academic.timetables.edit",
                                                                                                    session.id,
                                                                                                )}
                                                                                                className="text-xs font-medium text-emerald-600 hover:underline"
                                                                                            >
                                                                                                Edit
                                                                                            </Link>
                                                                                            <Link
                                                                                                href={route(
                                                                                                    "academic.timetables.create",
                                                                                                    {
                                                                                                        department_id:
                                                                                                            session.department_id ||
                                                                                                            current_department_id,
                                                                                                        curriculum_mapping_id:
                                                                                                            session.curriculum_mapping_id ||
                                                                                                            pageFilters.curriculum_mapping_id,
                                                                                                        module_number:
                                                                                                            session.module_number ||
                                                                                                            pageFilters.module_number,
                                                                                                    },
                                                                                                )}
                                                                                                className="text-xs font-medium text-indigo-600 hover:underline"
                                                                                            >
                                                                                                Clone
                                                                                            </Link>
                                                                                            <Link
                                                                                                href={route(
                                                                                                    "academic.timetables.create",
                                                                                                    {
                                                                                                        department_id:
                                                                                                            session.department_id ||
                                                                                                            current_department_id,
                                                                                                    },
                                                                                                )}
                                                                                                className="text-xs font-medium text-amber-600 hover:underline"
                                                                                            >
                                                                                                + New
                                                                                            </Link>
                                                                                        </div>
                                                                                    )}
                                                                                </div>
                                                                            ),
                                                                        )}
                                                                    </div>
                                                                ) : (
                                                                    <div className="rounded-2xl border border-dashed border-zinc-200 px-3 py-6 text-center text-sm text-zinc-400">
                                                                        No
                                                                        lesson
                                                                        assigned.
                                                                    </div>
                                                                )}
                                                            </td>
                                                        ),
                                                    )
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
                                Select a session and course above to load the
                                timetable grid.
                            </p>
                        </div>
                    )}
                </section>
            </div>
        </>
    );
}
