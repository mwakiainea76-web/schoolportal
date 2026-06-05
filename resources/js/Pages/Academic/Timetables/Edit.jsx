import { Head, Link, useForm } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import SearchSelect from "@/Components/SearchSelect";

export default function Edit({
    timetable,
    departments,
    trainers,
    lecture_rooms,
    curriculum_units,
    days,
}) {
    const { data, setData, put, processing, errors } = useForm({
        department_id: timetable.department_id || "",
        trainer_staff_id: timetable.trainer_staff_id || "",
        lecture_room_id: timetable.lecture_room_id || "",
        curriculum_unit_ids: timetable.curriculum_unit_ids || [],
        day_of_week: timetable.day_of_week || "monday",
        start_time: timetable.start_time || "",
        end_time: timetable.end_time || "",
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
        put(route("academic.timetables.update", timetable.id), {
            preserveScroll: true,
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <div>
                    <h1 className="text-3xl font-semibold text-zinc-900">
                        Edit Timetable Session
                    </h1>
                    <p className="mt-2 max-w-3xl text-sm text-zinc-600">
                        Adjust the merged class setup, including room, trainer,
                        units taught together, and the weekly slot.
                    </p>
                </div>
            }
        >
            <Head title="Edit Timetable Session" />

            <div className="mx-auto max-w-4xl">
                <form
                    onSubmit={submit}
                    className="space-y-8 rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm"
                >
                    <div className="rounded-2xl border border-sky-200 bg-sky-50 px-5 py-4 text-sm text-sky-800">
                        This form edits one weekly class session. That class can
                        still represent multiple courses sharing the same
                        content in one hall.
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
                                Merged Curriculum Units
                            </h2>
                            <p className="text-sm text-zinc-500">
                                Keep every equivalent curriculum unit attached to
                                this shared class so the timetable reflects the
                                real teaching arrangement.
                            </p>
                        </div>

                        <InputError
                            message={errors.curriculum_unit_ids}
                            className="mt-1"
                        />

                        <div className="grid gap-3 md:grid-cols-2">
                            {filteredUnits.map((unit) => {
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
                            })}
                        </div>
                    </div>

                    <div className="grid gap-6 md:grid-cols-3">
                        <div>
                            <label className="mb-2 block text-sm font-medium text-zinc-700">
                                Day of Week
                            </label>
                            <select
                                value={data.day_of_week}
                                onChange={(e) =>
                                    setData("day_of_week", e.target.value)
                                }
                                className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-400"
                            >
                                {days.map((day) => (
                                    <option key={day.id} value={day.id}>
                                        {day.name}
                                    </option>
                                ))}
                            </select>
                            <InputError
                                message={errors.day_of_week}
                                className="mt-2"
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium text-zinc-700">
                                Start Time
                            </label>
                            <input
                                type="time"
                                value={data.start_time}
                                onChange={(e) =>
                                    setData("start_time", e.target.value)
                                }
                                className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-400"
                            />
                            <InputError
                                message={errors.start_time}
                                className="mt-2"
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium text-zinc-700">
                                End Time
                            </label>
                            <input
                                type="time"
                                value={data.end_time}
                                onChange={(e) =>
                                    setData("end_time", e.target.value)
                                }
                                className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-400"
                            />
                            <InputError
                                message={errors.end_time}
                                className="mt-2"
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                        <Link
                            href={route("academic.timetables.index", {
                                department_id: data.department_id,
                            })}
                            className="rounded-xl border border-zinc-200 px-5 py-3 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50"
                        >
                            Cancel
                        </Link>

                        <button
                            type="submit"
                            disabled={processing}
                            className="rounded-xl bg-emerald-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {processing ? "Updating..." : "Update Session"}
                        </button>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
