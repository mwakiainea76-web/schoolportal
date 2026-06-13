import { Head, Link, useForm } from "@inertiajs/react";
import { useState } from "react";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import Modal from "@/Components/Modal";
import SearchSelect from "@/Components/SearchSelect";
import {
    collectMatchingMergedUnits,
    hasExactOccupiedSlot,
    STUDY_SLOTS,
} from "@/Pages/Academic/Timetables/shared";

export default function CreateHod({
    department,
    course_options,
    curriculum_units,
    trainers,
    lecture_rooms,
    days,
}) {
    const [editUnit, setEditUnit] = useState(null);
    const { data, setData, post, processing, errors } = useForm({
        department_id: department.id,
        curriculum_mapping_id: "",
        module_number: "",
        trainer_staff_id: "",
        lecture_room_id: "",
        curriculum_unit_ids: [],
        sessions: [
            {
                day_of_week: "monday",
                start_time: "08:00",
                end_time: "10:00",
            },
        ],
    });

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

    const selectUnit = (unitId) => {
        setData("curriculum_unit_ids", unitId ? [unitId] : []);
    };

    const moduleOptions = data.curriculum_mapping_id
        ? [
              ...new Set(
                  curriculum_units
                      .filter(
                          (unit) =>
                              unit.curriculum_mapping_id ===
                              data.curriculum_mapping_id,
                      )
                      .map((unit) => String(unit.module_taught || "")),
              ),
          ]
              .filter(Boolean)
              .sort((a, b) => Number(a) - Number(b))
        : [];

    const filteredUnits =
        data.curriculum_mapping_id && data.module_number
            ? curriculum_units.filter(
                  (unit) =>
                      unit.curriculum_mapping_id ===
                          data.curriculum_mapping_id &&
                      String(unit.module_taught || "") ===
                          String(data.module_number),
              )
            : [];

    const selectedUnit =
        filteredUnits.find((unit) => unit.id === data.curriculum_unit_ids[0]) ||
        null;
    const mergeMatches = collectMatchingMergedUnits(
        curriculum_units,
        selectedUnit,
        data,
    );
    const selectedUnitIsAssigned =
        (selectedUnit?.assigned_timetables || []).length > 0;
    const selectedUnitCanMergeNow = mergeMatches.length > 0;
    const occupiedExactSlotExists = hasExactOccupiedSlot(
        curriculum_units,
        selectedUnit,
        data,
    );

    const submit = (e) => {
        e.preventDefault();
        post(route("academic.timetables.hod.store"), {
            preserveScroll: true,
        });
    };

    return (
        <>
            <Head title="Create Timetable" />

            <div className="space-y-8">
                <form
                    onSubmit={submit}
                    className="space-y-8 rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm"
                >
                    <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm text-emerald-800">
                        Timetable creation is scoped to{" "}
                        <span className="font-semibold">{department.name}</span>
                        . Assigned curriculum units stay visible for reference,
                        but they remain locked so they cannot be double-assigned.
                    </div>

                    <input
                        type="hidden"
                        name="department_id"
                        value={data.department_id}
                    />

                    <div className="grid sm:grid-cols-2 gap-6">
                        <div>
                            <InputLabel value="Course" required />
                            <SearchSelect
                                routeName="academic.timetables.hod.courses.search"
                                routeParams={{
                                    limit: 4,
                                }}
                                defaultOptions={course_options}
                                value={data.curriculum_mapping_id}
                                placeholder="Select mapped course..."
                                onChange={(item) => {
                                    setData("curriculum_mapping_id", item.id);
                                    setData("module_number", "");
                                    setData("trainer_staff_id", "");
                                    setData("lecture_room_id", "");
                                    setData("curriculum_unit_ids", []);
                                }}
                                error={errors.curriculum_mapping_id}
                            />
                            <InputError
                                message={errors.curriculum_mapping_id}
                                className="mt-2"
                            />
                        </div>

                        <div>
                            <InputLabel value="Module" required />
                            <select
                                value={data.module_number}
                                onChange={(e) => {
                                    setData("module_number", e.target.value);
                                    setData("curriculum_unit_ids", []);
                                }}
                                disabled={!data.curriculum_mapping_id}
                                className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-400 disabled:cursor-not-allowed disabled:bg-zinc-100"
                            >
                                <option value="">Select module...</option>
                                {moduleOptions.map((module) => (
                                    <option key={module} value={module}>
                                        Module {module}
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
                                Select one curriculum unit to plan its timetable.
                                Already assigned units stay locked. A unit
                                can still share an existing live class when the
                                trainer, room, and every planned study slot
                                match exactly.
                            </p>
                        </div>

                        <InputError
                            message={errors.curriculum_unit_ids}
                            className="mt-1"
                        />

                        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                            {filteredUnits.length ? (
                                filteredUnits.map((unit) => {
                                    const checked = data.curriculum_unit_ids[0] === unit.id;
                                    const assignedTimetable = unit.assigned_timetable;
                                    const assignedTimetables =
                                        unit.assigned_timetables || [];
                                    const isAssigned = assignedTimetables.length > 0;
                                    const isLocked = isAssigned;

                                    return (
                                        <div
                                            key={unit.id}
                                            className={`rounded-xl border px-4 py-3 text-sm transition ${
                                                isAssigned
                                                    ? "border-zinc-200 bg-zinc-100 text-zinc-500"
                                                    : checked
                                                      ? "border-emerald-300 bg-emerald-50"
                                                      : "border-zinc-200 bg-white hover:border-zinc-300"
                                            }`}
                                        >
                                            <label
                                                className={`flex items-start gap-3 ${
                                                    isLocked ? "cursor-not-allowed" : "cursor-pointer"
                                                }`}
                                            >
                                                <input
                                                    type="radio"
                                                    name="curriculum_unit_id"
                                                    checked={isLocked ? true : checked}
                                                    disabled={isLocked}
                                                    onChange={() =>
                                                        selectUnit(unit.id)
                                                    }
                                                    className="mt-1 h-4 w-4 border-zinc-300 text-emerald-600 focus:ring-emerald-500 disabled:cursor-not-allowed disabled:opacity-80"
                                                />
                                                <div className="space-y-1">
                                                    <span className="block">
                                                        {unit.name}
                                                    </span>
                                                    {isAssigned ? (
                                                        <p className="text-xs">
                                                            Already timetabled. Open
                                                            it with Edit if you want
                                                            to change that allocation.
                                                        </p>
                                                    ) : null}
                                                </div>
                                            </label>
                                            {isAssigned ? (
                                                <div className="mt-3 flex items-center justify-between gap-3 border-t border-zinc-200 pt-3">
                                                    <p className="text-xs text-zinc-500">
                                                        Assigned: {assignedTimetable.day_label} {assignedTimetable.time_range}
                                                    </p>
                                                    <button
                                                        type="button"
                                                        onClick={() => setEditUnit(unit)}
                                                        className="rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-xs font-medium text-zinc-700 transition hover:bg-zinc-50"
                                                    >
                                                        Edit
                                                    </button>
                                                </div>
                                            ) : null}
                                        </div>
                                    );
                                })
                            ) : (
                                <p className="text-sm text-zinc-400">
                                    {data.curriculum_mapping_id &&
                                    data.module_number
                                        ? "No curriculum units are connected to the selected course version mapping and module."
                                        : "Choose a course version mapping and module to load curriculum units."}
                                </p>
                            )}
                        </div>
                    </div>

                    {selectedUnit ? (
                        <div
                            className={`rounded-2xl border px-5 py-4 text-sm ${
                                selectedUnitCanMergeNow
                                    ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                                    : occupiedExactSlotExists
                                      ? "border-amber-200 bg-amber-50 text-amber-800"
                                      : "border-zinc-200 bg-white text-zinc-500"
                            }`}
                        >
                            {selectedUnitCanMergeNow
                                ? `This unit will share delivery with ${mergeMatches.map((unit) => unit.name).join(", ")} while keeping its own unit code in the timetable.`
                                : occupiedExactSlotExists
                                  ? "A matching live class already exists. Saving this unit will be allowed only if every selected session matches that occupied slot exactly."
                                  : selectedUnitIsAssigned
                                    ? "This unit already has its own timetable allocation."
                                    : "Choose trainer, room, and sessions. If they match an existing live class exactly, this unit can be scheduled alongside it."}
                        </div>
                    ) : null}

                    <div className="grid gap-6 md:grid-cols-2">
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
                                disabled={!data.curriculum_unit_ids.length}
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
                                disabled={!data.curriculum_unit_ids.length}
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
                                    Add one or more weekly meetings for this
                                    same merged class setup. Study slots are
                                    fixed to 08:00-10:00, 11:00-13:00, and
                                    14:00-16:00, with break and lunch between
                                    them.
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
                                            message={
                                                errors[
                                                    `sessions.${index}.day_of_week`
                                                ]
                                            }
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
                                            message={
                                                errors[
                                                    `sessions.${index}.start_time`
                                                ]
                                            }
                                            className="mt-2"
                                        />
                                        <p className="mt-2 text-xs text-zinc-500">
                                            {
                                                (
                                                    STUDY_SLOTS.find(
                                                        (slot) =>
                                                            slot.id ===
                                                            `${session.start_time}|${session.end_time}`,
                                                    ) ?? STUDY_SLOTS[0]
                                                ).helper
                                            }
                                            . Break follows 10:00 and lunch
                                            follows 13:00.
                                        </p>
                                        <InputError
                                            message={
                                                errors[
                                                    `sessions.${index}.end_time`
                                                ]
                                            }
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

            <Modal
                show={Boolean(editUnit)}
                onClose={() => setEditUnit(null)}
                maxWidth="2xl"
                align="top"
            >
                {editUnit ? (
                    <div className="p-6">
                        <h2 className="text-xl font-semibold text-zinc-900">
                            Assigned Unit
                        </h2>
                        <p className="mt-2 text-sm text-zinc-600">
                            {editUnit.name}
                        </p>
                        <div className="mt-5 space-y-2 rounded-2xl border border-zinc-200 bg-zinc-50 p-4 text-sm text-zinc-700">
                            <p>
                                <span className="font-medium">Trainer:</span>{" "}
                                {editUnit.assigned_timetable?.trainer_name || "-"}
                            </p>
                            <p>
                                <span className="font-medium">Room:</span>{" "}
                                {editUnit.assigned_timetable?.lecture_room_name || "-"}
                            </p>
                            <p>
                                <span className="font-medium">Slot:</span>{" "}
                                {editUnit.assigned_timetable?.day_label}{" "}
                                {editUnit.assigned_timetable?.time_range}
                            </p>
                        </div>
                        <div className="mt-6 flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => setEditUnit(null)}
                                className="rounded-xl border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50"
                            >
                                Close
                            </button>
                            <Link
                                href={route(
                                    "academic.timetables.edit",
                                    editUnit.assigned_timetable?.id,
                                )}
                                className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-700"
                            >
                                Edit Timetable
                            </Link>
                        </div>
                    </div>
                ) : null}
            </Modal>
        </>
    );
}
