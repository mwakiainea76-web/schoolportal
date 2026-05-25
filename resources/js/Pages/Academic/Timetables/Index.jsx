import { Head, Link, router } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import Table from "@/Components/Table/Table";
import Thead from "@/Components/Table/Thead";
import THdata from "@/Components/Table/THdata";
import Tbody from "@/Components/Table/Tbody";
import Trow from "@/Components/Table/Trow";
import Tdata from "@/Components/Table/Tdata";

export default function Index({
    timetables,
    weekly_board,
    filters,
    departments,
    trainers,
    lecture_rooms,
    program_version_units,
    days,
    current_department_id,
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
            [field]: value,
        };

        if (field === "department_id") {
            nextFilters.trainer_staff_id = "";
            nextFilters.program_version_unit_id = "";
            nextFilters.lecture_room_id = "";
        }

        applyFilters(nextFilters);
    };

    const resetFilters = () => {
        applyFilters({
            department_id: current_department_id || "",
            trainer_staff_id: "",
            lecture_room_id: "",
            program_version_unit_id: "",
            day_of_week: "",
        });
    };

    const handleDelete = (id) => {
        if (!confirm("Remove this timetable session?")) {
            return;
        }

        router.delete(route("academic.timetables.destroy", id), {
            preserveScroll: true,
        });
    };

    const boardSessions = weekly_board.flatMap((day) => day.sessions);
    const totalSessions = boardSessions.length;
    const totalTrainers = new Set(
        boardSessions.map((item) => item.trainer_staff_id),
    ).size;
    const totalUnits = new Set(
        boardSessions.flatMap((item) => item.program_version_unit_ids || []),
    ).size;

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                        <h1 className="text-3xl font-semibold text-zinc-900">
                            Department Timetable
                        </h1>
                        <p className="mt-2 max-w-3xl text-sm text-zinc-600">
                            Schedule real teaching sessions by trainer, room,
                            day, and time, while allowing equivalent curriculum
                            units from different programs to be merged into one
                            class.
                        </p>
                    </div>
                    <div className="flex flex-col gap-3 sm:flex-row">
                        <Link
                            href={route("lecture-rooms.index")}
                            className="inline-flex items-center justify-center rounded-xl border border-zinc-200 bg-white px-5 py-3 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50"
                        >
                            Manage Rooms
                        </Link>
                        <Link
                            href={route("academic.timetables.create", {
                                department_id: filters.department_id,
                            })}
                            className="inline-flex items-center justify-center rounded-xl bg-emerald-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-emerald-700"
                        >
                            Add Timetable Sessions
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title="Department Timetable" />

            <div className="space-y-8">
                <section className="grid gap-4 md:grid-cols-3">
                    <div className="rounded-3xl border border-emerald-100 bg-gradient-to-br from-emerald-50 via-white to-lime-50 p-6 shadow-sm">
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">
                            Weekly Sessions
                        </p>
                        <p className="mt-4 text-3xl font-semibold text-zinc-900">
                            {totalSessions}
                        </p>
                        <p className="mt-2 text-sm text-zinc-600">
                            Scheduled weekly class meetings across the filtered
                            department.
                        </p>
                    </div>
                    <div className="rounded-3xl border border-sky-100 bg-gradient-to-br from-sky-50 via-white to-cyan-50 p-6 shadow-sm">
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-700">
                            Trainers Scheduled
                        </p>
                        <p className="mt-4 text-3xl font-semibold text-zinc-900">
                            {totalTrainers}
                        </p>
                        <p className="mt-2 text-sm text-zinc-600">
                            Staff currently carrying timetable load in this
                            filtered view.
                        </p>
                    </div>
                    <div className="rounded-3xl border border-amber-100 bg-gradient-to-br from-amber-50 via-white to-orange-50 p-6 shadow-sm">
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-700">
                            Units Covered
                        </p>
                        <p className="mt-4 text-3xl font-semibold text-zinc-900">
                            {totalUnits}
                        </p>
                        <p className="mt-2 text-sm text-zinc-600">
                            Program version units currently mapped into those
                            scheduled classes.
                        </p>
                    </div>
                </section>

                <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
                    <div className="grid gap-4 lg:grid-cols-5">
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
                                className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-400"
                            >
                                <option value="">All trainers</option>
                                {trainers.map((trainer) => (
                                    <option key={trainer.id} value={trainer.id}>
                                        {trainer.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                                Lecture Room
                            </label>
                            <select
                                value={filters.lecture_room_id}
                                onChange={(e) =>
                                    onFilterChange("lecture_room_id", e.target.value)
                                }
                                className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-400"
                            >
                                <option value="">All rooms</option>
                                {lecture_rooms.map((room) => (
                                    <option key={room.id} value={room.id}>
                                        {room.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                                Curriculum Unit
                            </label>
                            <select
                                value={filters.program_version_unit_id}
                                onChange={(e) =>
                                    onFilterChange(
                                        "program_version_unit_id",
                                        e.target.value,
                                    )
                                }
                                className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-400"
                            >
                                <option value="">All units</option>
                                {program_version_units.map((unit) => (
                                    <option key={unit.id} value={unit.id}>
                                        {unit.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                                Day
                            </label>
                            <select
                                value={filters.day_of_week}
                                onChange={(e) =>
                                    onFilterChange("day_of_week", e.target.value)
                                }
                                className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-400"
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

                <section className="grid gap-4 xl:grid-cols-7">
                    {weekly_board.map((day) => (
                        <div
                            key={day.day}
                            className="rounded-3xl border border-zinc-200 bg-white p-4 shadow-sm"
                        >
                            <div className="mb-4 flex items-center justify-between">
                                <h2 className="text-sm font-semibold text-zinc-900">
                                    {day.label}
                                </h2>
                                <span className="rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-600">
                                    {day.sessions.length}
                                </span>
                            </div>

                            <div className="space-y-3">
                                {day.sessions.length ? (
                                    day.sessions.map((session) => (
                                        <div
                                            key={session.id}
                                            className="rounded-2xl border border-zinc-100 bg-zinc-50 p-3"
                                        >
                                            <p className="text-sm font-semibold text-zinc-900">
                                                {session.time_range}
                                            </p>
                                            <p className="mt-2 text-sm text-zinc-800">
                                                {session.lecture_room_code}{" "}
                                                {session.lecture_room_name}
                                            </p>
                                            <p className="mt-1 text-xs text-zinc-500">
                                                {session.merged_units.length} unit
                                                {session.merged_units.length === 1
                                                    ? ""
                                                    : "s"}{" "}
                                                merged
                                            </p>
                                            <p className="mt-2 text-xs font-medium uppercase tracking-[0.16em] text-emerald-700">
                                                {session.trainer_name}
                                            </p>
                                            <div className="mt-2 space-y-1">
                                                {session.merged_units
                                                    .slice(0, 2)
                                                    .map((unit) => (
                                                        <p
                                                            key={unit.id}
                                                            className="text-[11px] text-zinc-500"
                                                        >
                                                            {unit.display_name}
                                                        </p>
                                                    ))}
                                                {session.merged_units.length > 2 ? (
                                                    <p className="text-[11px] font-medium text-zinc-500">
                                                        +{session.merged_units.length - 2} more
                                                    </p>
                                                ) : null}
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="rounded-2xl border border-dashed border-zinc-200 px-4 py-6 text-center text-sm text-zinc-400">
                                        No sessions planned.
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </section>

                <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
                    <Table pagination={timetables}>
                        <Thead>
                            <THdata>Day</THdata>
                            <THdata>Time</THdata>
                            <THdata>Lecture Room</THdata>
                            <THdata>Merged Units</THdata>
                            <THdata>Trainer</THdata>
                            <THdata>Department</THdata>
                            <THdata className="text-center">Actions</THdata>
                        </Thead>
                        <Tbody>
                            {timetables.data.length ? (
                                timetables.data.map((entry) => (
                                    <Trow key={entry.id}>
                                        <Tdata>{entry.day_label}</Tdata>
                                        <Tdata>{entry.time_range}</Tdata>
                                        <Tdata>
                                            {entry.lecture_room_code}{" "}
                                            {entry.lecture_room_name}
                                        </Tdata>
                                        <Tdata>
                                            <div className="space-y-2">
                                                {entry.merged_units.map((unit) => (
                                                    <div key={unit.id}>
                                                        <p className="font-medium text-zinc-900">
                                                            {unit.code} {unit.name}
                                                        </p>
                                                        <p className="text-xs text-zinc-500">
                                                            {unit.program_version_name} /{" "}
                                                            {unit.program_name} / Module{" "}
                                                            {unit.module_taught}
                                                        </p>
                                                    </div>
                                                ))}
                                            </div>
                                        </Tdata>
                                        <Tdata>
                                            <div className="space-y-1">
                                                <p>{entry.trainer_name}</p>
                                                <p className="text-xs text-zinc-500">
                                                    {entry.trainer_staff_number}
                                                </p>
                                            </div>
                                        </Tdata>
                                        <Tdata>{entry.department_name}</Tdata>
                                        <Tdata>
                                            <div className="flex items-center justify-center gap-4">
                                                <Link
                                                    href={route(
                                                        "academic.timetables.edit",
                                                        entry.id,
                                                    )}
                                                    className="text-sm font-medium text-emerald-700 hover:underline"
                                                >
                                                    Edit
                                                </Link>
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleDelete(entry.id)
                                                    }
                                                    className="text-sm font-medium text-red-600 hover:underline"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </Tdata>
                                    </Trow>
                                ))
                            ) : (
                                <Trow>
                                    <Tdata
                                        colSpan="7"
                                        className="py-12 text-center text-zinc-400"
                                    >
                                        No timetable sessions found for the
                                        current filters.
                                    </Tdata>
                                </Trow>
                            )}
                        </Tbody>
                    </Table>
                </section>
            </div>
        </AuthenticatedLayout>
    );
}
