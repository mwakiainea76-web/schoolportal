import { Head, Link, router } from "@inertiajs/react";
import SearchSelect from "@/Components/SearchSelect";
import TimetableWorkspaceTabs from "@/Pages/Academic/Timetables/Partials/TimetableWorkspaceTabs";

export default function Index({
    weekly_board,
    weekly_grid,
    lesson_columns,
    filters,
    session_options,
    departments,
    trainers,
    course_options,
    module_options,
    days,
    current_department_id,
    is_hod,
    is_trainer,
    should_load_timetable,
    current_session_note,
}) {
    const applyFilters = (nextFilters) => {
        router.get(route("academic.timetables.index"), nextFilters, {
            preserveState: true,
            replace: true,
        });
    };

    const onFilterChange = (field, value) => {
        const nextFilters = {
            ...filters,
            lecture_room_id: "",
            [field]: value,
        };

        if (field === "department_id") {
            nextFilters.trainer_staff_id = "";
            nextFilters.curriculum_unit_id = "";
            nextFilters.curriculum_mapping_id = "";
            nextFilters.module_number = "";
        }

        if (field === "curriculum_mapping_id") {
            nextFilters.module_number = "";
        }

        if (is_trainer) {
            nextFilters.academic_session_id = filters.academic_session_id;
            nextFilters.department_id = current_department_id || "";
            nextFilters.trainer_staff_id = filters.trainer_staff_id;
        }

        applyFilters(nextFilters);
    };

    const resetFilters = () => {
        applyFilters({
            academic_session_id:
                session_options.find((session) => session.is_active)?.id || "",
            department_id: is_hod || is_trainer ? current_department_id || "" : "",
            trainer_staff_id: is_trainer ? filters.trainer_staff_id : "",
            curriculum_mapping_id: "",
            module_number: "",
            day_of_week: "",
        });
    };

    const baseFiltersReady = is_hod || is_trainer
        ? Boolean(current_department_id)
        : Boolean(
              filters.department_id &&
                  filters.curriculum_mapping_id &&
                  filters.module_number,
          );

    const trainerFiltersReady = is_hod || is_trainer
        ? Boolean(current_department_id)
        : Boolean(filters.academic_session_id && filters.department_id);

    const adminLoadPathReady = is_hod || is_trainer
        ? Boolean(current_department_id)
        : Boolean(
              filters.academic_session_id &&
                  filters.department_id &&
                  (filters.trainer_staff_id ||
                      (filters.curriculum_mapping_id &&
                          filters.module_number)),
          );

    const addTimetableHref = is_hod
        ? route("academic.timetables.hod.create")
        : route("academic.timetables.create");
    const canAddTimetable = is_hod || is_trainer;
    const handleDownloadPdf = () => {
        window.print();
    };

    const filterGridClassName = is_hod
        ? "grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
        : is_trainer
          ? "grid gap-4 sm:grid-cols-2 xl:grid-cols-3"
        : "grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6";

    return (
        <>
            <Head title="Department Timetable" />
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
                <section>
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <TimetableWorkspaceTabs
                            activeTab="view"
                            addHref={addTimetableHref}
                            canAdd={canAddTimetable}
                        />
                        {!is_trainer ? (
                            <Link
                                href={route("lecture-rooms.index")}
                                className="inline-flex items-center justify-center rounded-xl border border-zinc-200 bg-white px-5 py-3 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50"
                            >
                                Manage Rooms
                            </Link>
                        ) : null}
                    </div>
                </section>

                <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
                    <div className={filterGridClassName}>
                        {!is_trainer ? (
                            <div>
                            <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                                Academic Session
                            </label>
                            <select
                                value={filters.academic_session_id}
                                onChange={(e) =>
                                    onFilterChange(
                                        "academic_session_id",
                                        e.target.value,
                                    )
                                }
                                disabled={!session_options.length}
                                className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-400"
                            >
                                {session_options.length ? (
                                    session_options.map((session) => (
                                        <option key={session.id} value={session.id}>
                                            {session.name}
                                            {session.is_active ? " (Current)" : ""}
                                        </option>
                                    ))
                                ) : (
                                    <option value="">
                                        Run migration to enable sessions
                                    </option>
                                )}
                            </select>
                            </div>
                        ) : null}

                        {!is_hod && !is_trainer ? (
                            <div>
                                <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                                    Department
                                </label>
                                <select
                                    value={filters.department_id}
                                    onChange={(e) =>
                                        onFilterChange("department_id", e.target.value)
                                    }
                                    className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-400"
                                >
                                    <option value="">All departments</option>
                                    {departments.map((department) => (
                                        <option
                                            key={department.id}
                                            value={department.id}
                                        >
                                            {department.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        ) : null}

                        <div>
                            <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                                Versioned Course
                            </label>
                            {is_hod || is_trainer ? (
                                <select
                                    value={filters.curriculum_mapping_id}
                                    onChange={(e) =>
                                        onFilterChange(
                                            "curriculum_mapping_id",
                                            e.target.value,
                                        )
                                    }
                                    className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-400"
                                >
                                    <option value="">All versioned courses</option>
                                    {course_options.map((course) => (
                                        <option key={course.id} value={course.id}>
                                            {course.name}
                                        </option>
                                    ))}
                                </select>
                            ) : (
                                <SearchSelect
                                    key={
                                        filters.department_id || "no-department"
                                    }
                                    routeName="academic.timetables.courses.search"
                                    routeParams={{
                                        department_id: filters.department_id,
                                        limit: 4,
                                    }}
                                    defaultOptions={course_options}
                                    value={filters.curriculum_mapping_id}
                                    placeholder={
                                        filters.department_id
                                            ? "Search versioned course..."
                                            : "Select department first..."
                                    }
                                    onChange={(item) =>
                                        onFilterChange(
                                            "curriculum_mapping_id",
                                            item.id,
                                        )
                                    }
                                    disabled={!filters.department_id}
                                />
                            )}
                        </div>

                        <div>
                            <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                                Module
                            </label>
                            <select
                                value={filters.module_number}
                                onChange={(e) =>
                                    onFilterChange("module_number", e.target.value)
                                }
                                disabled={!filters.curriculum_mapping_id}
                                className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-400 disabled:cursor-not-allowed disabled:bg-zinc-100"
                            >
                                <option value="">Select module</option>
                                {module_options.map((module) => (
                                    <option key={module.id} value={module.id}>
                                        {module.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {!is_hod && !is_trainer ? (
                            <div>
                                <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                                    Trainer
                                </label>
                                <select
                                    value={filters.trainer_staff_id}
                                    onChange={(e) =>
                                        onFilterChange(
                                            "trainer_staff_id",
                                            e.target.value,
                                        )
                                    }
                                    disabled={!trainerFiltersReady}
                                    className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-400 disabled:cursor-not-allowed disabled:bg-zinc-100"
                                >
                                    <option value="">All trainers</option>
                                    {trainers.map((trainer) => (
                                        <option key={trainer.id} value={trainer.id}>
                                            {trainer.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        ) : null}

                        <div>
                            <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                                Day
                            </label>
                            <select
                                value={filters.day_of_week}
                                onChange={(e) =>
                                    onFilterChange("day_of_week", e.target.value)
                                }
                                disabled={!adminLoadPathReady}
                                className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-400 disabled:cursor-not-allowed disabled:bg-zinc-100"
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

                    {!is_hod && !is_trainer ? (
                        <p className="mt-4 text-sm text-amber-700">
                            Choose an academic session and department first.
                            Then either select a trainer to view an individual
                            timetable, or select a versioned course and module
                            to view a class timetable.
                        </p>
                    ) : null}

                    {is_trainer ? (
                        <p className="mt-4 text-sm text-zinc-600">
                            This timetable is already locked to your current department, your trainer profile, and the current running session. Use versioned course, module, and day to narrow your view.
                        </p>
                    ) : null}

                    {current_session_note ? (
                        <p className="mt-4 text-sm text-zinc-500">
                            {current_session_note}
                        </p>
                    ) : null}

                    <div className="mt-4 flex justify-end">
                        <button
                            type="button"
                            onClick={resetFilters}
                            className="rounded-xl border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50"
                        >
                            Reset Filters
                        </button>
                    </div>
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
                                Select a department, then a versioned course,
                                then a module to load the timetable grid.
                            </p>
                        </div>
                    )}
                </section>
            </div>
        </>
    );
}
