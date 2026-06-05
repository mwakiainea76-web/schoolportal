import { Head, Link, useForm } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import SearchSelect from "@/Components/SearchSelect";

export default function Create({
    departments,
    trainers,
    lecture_rooms,
    curriculum_units,
    days,
    current_department_id,
    selected_department_id,
}) {
    const initialDepartment = selected_department_id || current_department_id || "";

    const { data, setData, post, processing, errors } = useForm({
        department_id: initialDepartment,
        trainer_staff_id: "",
        lecture_room_id: "",
        curriculum_unit_ids: [],
        sessions: [
            {
                day_of_week: "monday",
                start_time: "",
                end_time: "",
            },
        ],
    });

    const filteredTrainers = data.department_id
        ? trainers.filter((trainer) => trainer.department_id === data.department_id)
        : trainers;

    const filteredUnits = data.department_id
        ? curriculum_units.filter((unit) => unit.department_id === data.department_id)
        : curriculum_units;

    const filteredRooms = data.department_id
        ? lecture_rooms.filter((room) => room.department_id === data.department_id)
        : lecture_rooms;

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
                start_time: "",
                end_time: "",
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
            setData("curriculum_unit_ids", [
                ...data.curriculum_unit_ids,
                unitId,
            ]);
            return;
        }

        setData(
            "curriculum_unit_ids",
            data.curriculum_unit_ids.filter((id) => id !== unitId),
        );
    };

    const submit = (e) => {
        e.preventDefault();
        post(route("academic.timetables.store"), {
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
                        Plan a real class session with trainer, hall, and one or
                        more equivalent curriculum units that can be taught
                        together across courses.
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
                    <div className="rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-800">
                        A trainer can merge students from different courses into
                        one class when the content is the same. Select all
                        matching curriculum units below, then assign one room and
                        one weekly slot for that merged teaching session.
                    </div>

                    <div className="grid gap-6 md:grid-cols-3">
                        <div>
                            <InputLabel value="Department" required />
                            <SearchSelect
                                routeName={null}
                                defaultOptions={departments}
                                value={data.department_id}
                                placeholder="Select department..."
                                onChange={(department) => {
                                    setData("department_id", department.id);
                                    setData("trainer_staff_id", "");
                                    setData("lecture_room_id", "");
                                    setData("curriculum_unit_ids", []);
                                }}
                                error={errors.department_id}
                            />
                            <InputError
                                message={errors.department_id}
                                className="mt-2"
                            />
                        </div>

                        <div>
                            <InputLabel value="Trainer" required />
                            <SearchSelect
                                routeName={null}
                                defaultOptions={filteredTrainers}
                                value={data.trainer_staff_id}
                                placeholder="Select trainer..."
                                onChange={(item) =>
                                    setData("trainer_staff_id", item.id)
                                }
                                error={errors.trainer_staff_id}
                                disabled={!data.department_id}
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
                                defaultOptions={filteredRooms}
                                value={data.lecture_room_id}
                                placeholder="Select lecture room..."
                                onChange={(item) =>
                                    setData("lecture_room_id", item.id)
                                }
                                error={errors.lecture_room_id}
                                disabled={!data.department_id}
                            />
                            <InputError
                                message={errors.lecture_room_id}
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
                                Choose every curriculum unit that shares the
                                same content and can be merged into one teaching
                                room and slot.
                            </p>
                        </div>

                        <InputError
                            message={errors.curriculum_unit_ids}
                            className="mt-1"
                        />

                        <div className="grid gap-3 md:grid-cols-2">
                            {filteredUnits.length ? (
                                filteredUnits.map((unit) => {
                                    const checked = data.curriculum_unit_ids.includes(
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
                                    No curriculum units available for the
                                    selected department.
                                </p>
                            )}
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
                                    merged class setup.
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

                                <div className="grid gap-4 md:grid-cols-3">
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
                                            Start Time
                                        </label>
                                        <input
                                            type="time"
                                            value={session.start_time}
                                            onChange={(e) =>
                                                updateSession(
                                                    index,
                                                    "start_time",
                                                    e.target.value,
                                                )
                                            }
                                            className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-400"
                                        />
                                        <InputError
                                            message={errors[`sessions.${index}.start_time`]}
                                            className="mt-2"
                                        />
                                    </div>

                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-zinc-700">
                                            End Time
                                        </label>
                                        <input
                                            type="time"
                                            value={session.end_time}
                                            onChange={(e) =>
                                                updateSession(
                                                    index,
                                                    "end_time",
                                                    e.target.value,
                                                )
                                            }
                                            className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-400"
                                        />
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
                            {processing ? "Saving Timetable..." : "Save Timetable"}
                        </button>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
