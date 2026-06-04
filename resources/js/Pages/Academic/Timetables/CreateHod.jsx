import { Head, Link, router, useForm } from "@inertiajs/react";
import { useEffect } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import SearchSelect from "@/Components/SearchSelect";

const STUDY_SLOTS = [
    {
        id: "08:00|10:00",
        label: "08:00 - 10:00",
        start_time: "08:00",
        end_time: "10:00",
        helper: "Morning study slot",
    },
    {
        id: "11:00|13:00",
        label: "11:00 - 13:00",
        start_time: "11:00",
        end_time: "13:00",
        helper: "After break",
    },
    {
        id: "14:00|16:00",
        label: "14:00 - 16:00",
        start_time: "14:00",
        end_time: "16:00",
        helper: "After lunch",
    },
];

export default function CreateHod({
    department,
    course_options,
    modules,
    available_units,
    trainers,
    lecture_rooms,
    days,
    filters,
}) {
    const { data, setData, post, processing, errors } = useForm({
        department_id: department.id,
        course_version_mapping_id: filters.course_version_mapping_id || "",
        module_number: filters.module_number || "",
        trainer_staff_id: "",
        lecture_room_id: "",
        course_version_unit_ids: [],
        sessions: [
            {
                day_of_week: "monday",
                start_time: "08:00",
                end_time: "10:00",
            },
        ],
    });

    useEffect(() => {
        const messages = Object.entries(errors)
            .filter(([key, value]) =>
                Boolean(value) &&
                (key.startsWith("sessions.") ||
                    key === "course_version_unit_ids" ||
                    key === "trainer_staff_id" ||
                    key === "lecture_room_id"),
            )
            .map(([, value]) => value);

        if (messages.length) {
            alert(messages[0]);
        }
    }, [errors]);

    const updateScopedFilters = (nextValues) => {
        const nextCourseVersionMappingId =
            nextValues.course_version_mapping_id ??
            data.course_version_mapping_id;
        const nextModuleNumber = nextValues.module_number ?? data.module_number;

        router.get(
            route("academic.timetables.hod.create"),
            {
                course_version_mapping_id:
                    nextCourseVersionMappingId || "",
                module_number: nextModuleNumber || "",
            },
            {
                preserveState: true,
                replace: true,
                preserveScroll: true,
            },
        );
    };

    const updateSession = (index, field, value) => {
        const nextSessions = [...data.sessions];
        nextSessions[index] = {
            ...nextSessions[index],
            [field]: value,
        };
        setData("sessions", nextSessions);
    };

    const addSession = () => {
        setData("sessions", [
            ...data.sessions,
            {
                day_of_week: "monday",
                start_time: "08:00",
                end_time: "10:00",
            },
        ]);
    };

    const removeSession = (index) => {
        if (data.sessions.length === 1) {
            return;
        }

        setData(
            "sessions",
            data.sessions.filter((_, sessionIndex) => sessionIndex !== index),
        );
    };

    const toggleUnit = (unitId, checked) => {
        if (checked) {
            setData("course_version_unit_ids", [
                ...data.course_version_unit_ids,
                unitId,
            ]);
            return;
        }

        setData(
            "course_version_unit_ids",
            data.course_version_unit_ids.filter((id) => id !== unitId),
        );
    };

    const submit = (e) => {
        e.preventDefault();
        post(route("academic.timetables.hod.store"), {
            preserveScroll: true,
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <div>
                    <h1 className="text-3xl font-semibold text-zinc-900">
                        Create Department Timetable
                    </h1>
                    <p className="mt-2 max-w-3xl text-sm text-zinc-600">
                        Your department is detected automatically. Choose one
                        active course version, narrow to a module, then assign
                        equivalent units together into one trainer, room, and
                        weekly slot.
                    </p>
                </div>
            }
        >
            <Head title="Create Timetable" />

            <div className="mx-auto max-w-5xl">
                <form
                    onSubmit={submit}
                    className="space-y-8 rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm"
                >
                    <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm text-emerald-800">
                        Timetable creation is scoped to{" "}
                        <span className="font-semibold">{department.name}</span>.
                        Assigned curriculum units disappear from the list after
                        each save so they cannot be double-assigned.
                    </div>

                    <input type="hidden" name="department_id" value={data.department_id} />

                    <div className="grid gap-6 sm:grid-cols-2">
                        <div>
                            <InputLabel value="Course Name" required />
                            <SearchSelect
                                routeName="academic.timetables.hod.courses.search"
                                routeParams={{
                                    limit: 4,
                                }}
                                defaultOptions={course_options}
                                value={data.course_version_mapping_id}
                                placeholder="Search versioned course..."
                                onChange={(item) => {
                                    setData(
                                        "course_version_mapping_id",
                                        item.id,
                                    );
                                    setData("module_number", "");
                                    setData("trainer_staff_id", "");
                                    setData("lecture_room_id", "");
                                    setData("course_version_unit_ids", []);
                                    updateScopedFilters({
                                        course_version_mapping_id: item.id,
                                        module_number: "",
                                    });
                                }}
                                error={errors.course_version_mapping_id}
                            />
                            <InputError
                                message={errors.course_version_mapping_id}
                                className="mt-2"
                            />
                        </div>

                        <div>
                            <InputLabel value="Module Number" required />
                            <select
                                value={data.module_number}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    setData("module_number", value);
                                    setData("trainer_staff_id", "");
                                    setData("lecture_room_id", "");
                                    setData("course_version_unit_ids", []);
                                    updateScopedFilters({
                                        course_version_mapping_id:
                                            data.course_version_mapping_id,
                                        module_number: value,
                                    });
                                }}
                                disabled={!data.course_version_mapping_id}
                                className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-400 disabled:cursor-not-allowed disabled:bg-zinc-100"
                            >
                                <option value="">Select module...</option>
                                {modules.map((module) => (
                                    <option key={module.id} value={module.id}>
                                        {module.name}
                                    </option>
                                ))}
                            </select>
                            <InputError
                                message={errors.module_number}
                                className="mt-2"
                            />
                        </div>
                    </div>

                    <div className="space-y-4 rounded-2xl border border-zinc-200 bg-zinc-50 p-5">
                        <div>
                            <h2 className="text-lg font-semibold text-zinc-900">
                                Curriculum Units in This Class
                            </h2>
                            <p className="text-sm text-zinc-500">
                                Choose every course version unit that shares the
                                same content and can be merged into one teaching
                                room and slot.
                            </p>
                        </div>

                        <InputError
                            message={errors.course_version_unit_ids}
                            className="mt-1"
                        />

                        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                            {available_units.length ? (
                                available_units.map((unit) => {
                                    const checked =
                                        data.course_version_unit_ids.includes(
                                            unit.id,
                                        );

                                    return (
                                        <label
                                            key={unit.id}
                                            className={`flex cursor-pointer items-start gap-3 rounded-xl border px-4 py-3 text-sm transition ${
                                                checked
                                                    ? "border-emerald-300 bg-emerald-50"
                                                    : "border-zinc-200 bg-white hover:border-zinc-300"
                                            }`}
                                        >
                                            <input
                                                type="checkbox"
                                                checked={checked}
                                                onChange={(e) =>
                                                    toggleUnit(
                                                        unit.id,
                                                        e.target.checked,
                                                    )
                                                }
                                                className="mt-1 h-4 w-4 rounded border-zinc-300 text-emerald-600 focus:ring-emerald-500"
                                            />
                                            <span>{unit.name}</span>
                                        </label>
                                    );
                                })
                            ) : (
                                <p className="text-sm text-zinc-400">
                                    {data.course_version_mapping_id &&
                                    data.module_number
                                        ? "No unassigned curriculum units are available for this course and module."
                                        : "Choose a versioned course and module to load curriculum units."}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="grid gap-6 sm:grid-cols-2">
                        <div>
                            <InputLabel value="Trainer" required />
                            <SearchSelect
                                routeName={null}
                                defaultOptions={trainers}
                                value={data.trainer_staff_id}
                                placeholder="Select trainer..."
                                onChange={(item) =>
                                    setData("trainer_staff_id", item.id)
                                }
                                error={errors.trainer_staff_id}
                                disabled={!data.course_version_unit_ids.length}
                            />
                            <InputError
                                message={errors.trainer_staff_id}
                                className="mt-2"
                            />
                        </div>

                        <div>
                            <InputLabel value="Lecture Room" required />
                            <SearchSelect
                                routeName={null}
                                defaultOptions={lecture_rooms}
                                value={data.lecture_room_id}
                                placeholder="Select lecture room..."
                                onChange={(item) =>
                                    setData("lecture_room_id", item.id)
                                }
                                error={errors.lecture_room_id}
                                disabled={!data.course_version_unit_ids.length}
                            />
                            <InputError
                                message={errors.lecture_room_id}
                                className="mt-2"
                            />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-lg font-semibold text-zinc-900">
                                    Weekly Sessions
                                </h2>
                                <p className="text-sm text-zinc-500">
                                    Add one or more weekly meetings for this same
                                    merged class setup. Study slots are fixed to
                                    08:00-10:00, 11:00-13:00, and 14:00-16:00,
                                    with break and lunch between them.
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={addSession}
                                className="rounded-xl border border-emerald-200 px-4 py-2 text-sm font-medium text-emerald-700 transition hover:bg-emerald-50"
                            >
                                Add Another Session
                            </button>
                        </div>

                        {data.sessions.map((session, index) => (
                            <div
                                key={index}
                                className="rounded-2xl border border-zinc-200 bg-zinc-50 p-5"
                            >
                                <div className="mb-4 flex items-center justify-between">
                                    <p className="text-sm font-semibold uppercase tracking-[0.18em] text-zinc-500">
                                        Session {index + 1}
                                    </p>
                                    {data.sessions.length > 1 ? (
                                        <button
                                            type="button"
                                            onClick={() => removeSession(index)}
                                            className="text-sm font-medium text-red-600 hover:underline"
                                        >
                                            Remove
                                        </button>
                                    ) : null}
                                </div>

                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-zinc-700">
                                            Day of Week
                                        </label>
                                        <select
                                            value={session.day_of_week}
                                            onChange={(e) =>
                                                updateSession(
                                                    index,
                                                    "day_of_week",
                                                    e.target.value,
                                                )
                                            }
                                            className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-400"
                                        >
                                            {days.map((day) => (
                                                <option
                                                    key={day.id}
                                                    value={day.id}
                                                >
                                                    {day.name}
                                                </option>
                                            ))}
                                        </select>
                                        <InputError
                                            message={errors[`sessions.${index}.day_of_week`]}
                                            className="mt-2"
                                        />
                                    </div>

                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-zinc-700">
                                            Study Slot
                                        </label>
                                        <select
                                            value={`${session.start_time}|${session.end_time}`}
                                            onChange={(e) => {
                                                const selectedSlot =
                                                    STUDY_SLOTS.find(
                                                        (slot) =>
                                                            slot.id ===
                                                            e.target.value,
                                                    ) ?? STUDY_SLOTS[0];

                                                const nextSessions = [
                                                    ...data.sessions,
                                                ];
                                                nextSessions[index] = {
                                                    ...nextSessions[index],
                                                    start_time:
                                                        selectedSlot.start_time,
                                                    end_time:
                                                        selectedSlot.end_time,
                                                };
                                                setData(
                                                    "sessions",
                                                    nextSessions,
                                                );
                                            }}
                                            className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-400"
                                        >
                                            {STUDY_SLOTS.map((slot) => (
                                                <option
                                                    key={slot.id}
                                                    value={slot.id}
                                                >
                                                    {slot.label}
                                                </option>
                                            ))}
                                        </select>
                                        <InputError
                                            message={errors[`sessions.${index}.start_time`]}
                                            className="mt-2"
                                        />
                                        <p className="mt-2 text-xs text-zinc-500">
                                            {
                                                (STUDY_SLOTS.find(
                                                    (slot) =>
                                                        slot.id ===
                                                        `${session.start_time}|${session.end_time}`,
                                                ) ?? STUDY_SLOTS[0]).helper
                                            }
                                            . Break follows 10:00 and lunch
                                            follows 13:00.
                                        </p>
                                        <InputError
                                            message={errors[`sessions.${index}.end_time`]}
                                            className="mt-2"
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="flex items-center justify-between pt-2">
                        <Link
                            href={route("academic.timetables.index")}
                            className="rounded-xl border border-zinc-200 px-5 py-3 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50"
                        >
                            Cancel
                        </Link>

                        <button
                            type="submit"
                            disabled={processing}
                            className="rounded-xl bg-emerald-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {processing
                                ? "Saving Timetable..."
                                : "Save Timetable"}
                        </button>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
