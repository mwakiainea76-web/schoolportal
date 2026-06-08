import { Head, Link, useForm } from "@inertiajs/react";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import SearchSelect from "@/Components/SearchSelect";
import TextArea from "@/Components/TextArea";
import TextInput from "@/Components/TextInput";

export default function Edit({ lecture_room, departments }) {
    const { data, setData, put, processing, errors } = useForm({
        department_id: String(lecture_room.department_id ?? ""),
        name: lecture_room.name ?? "",
        code: lecture_room.code ?? "",
        capacity: lecture_room.capacity ?? "",
        location: lecture_room.location ?? "",
        description: lecture_room.description ?? "",
        is_active: Boolean(lecture_room.is_active),
    });

    const submit = (e) => {
        e.preventDefault();
        put(route("lecture-rooms.update", lecture_room.id), {
            preserveScroll: true,
        });
    };

    return (
        <>
            <Head title="Edit Lecture Room" />

            <div className="mx-auto w-full max-w-4xl animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="overflow-hidden rounded-lg border border-zinc-100 bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                    <form className="space-y-8 p-10" onSubmit={submit}>
                        <div>
                            <h1 className="text-2xl font-semibold text-zinc-900">
                                Edit Lecture Room
                            </h1>
                            <p className="mt-2 text-sm text-zinc-500">
                                Update the teaching space details used by the
                                timetable.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                            <div>
                                <InputLabel value="Department" required />
                                <SearchSelect
                                    routeName={null}
                                    defaultOptions={departments}
                                    value={data.department_id}
                                    placeholder="Select department..."
                                    onChange={(department) =>
                                        setData("department_id", department.id)
                                    }
                                    error={errors.department_id}
                                />
                                <InputError
                                    message={errors.department_id}
                                    className="mt-2"
                                />
                            </div>

                            <div>
                                <InputLabel value="Room Name" required />
                                <TextInput
                                    value={data.name}
                                    onChange={(e) =>
                                        setData("name", e.target.value)
                                    }
                                    className="mt-1 block w-full"
                                    error={errors.name}
                                />
                                <InputError
                                    message={errors.name}
                                    className="mt-2"
                                />
                            </div>

                            <div>
                                <InputLabel value="Room Code" required />
                                <TextInput
                                    value={data.code}
                                    onChange={(e) =>
                                        setData("code", e.target.value)
                                    }
                                    className="mt-1 block w-full"
                                    error={errors.code}
                                />
                                <InputError
                                    message={errors.code}
                                    className="mt-2"
                                />
                            </div>

                            <div>
                                <InputLabel value="Capacity" />
                                <TextInput
                                    type="number"
                                    min="1"
                                    value={data.capacity}
                                    onChange={(e) =>
                                        setData("capacity", e.target.value)
                                    }
                                    className="mt-1 block w-full"
                                    error={errors.capacity}
                                />
                                <InputError
                                    message={errors.capacity}
                                    className="mt-2"
                                />
                            </div>

                            <div className="md:col-span-2">
                                <InputLabel value="Location" />
                                <TextInput
                                    value={data.location}
                                    onChange={(e) =>
                                        setData("location", e.target.value)
                                    }
                                    className="mt-1 block w-full"
                                    error={errors.location}
                                />
                                <InputError
                                    message={errors.location}
                                    className="mt-2"
                                />
                            </div>

                            <div className="md:col-span-2">
                                <InputLabel value="Description" />
                                <TextArea
                                    rows="5"
                                    value={data.description}
                                    onChange={(e) =>
                                        setData("description", e.target.value)
                                    }
                                    className="mt-1 block w-full"
                                    error={errors.description}
                                />
                                <InputError
                                    message={errors.description}
                                    className="mt-2"
                                />
                            </div>
                        </div>

                        <label className="flex items-center gap-3 text-sm font-medium text-zinc-700">
                            <input
                                type="checkbox"
                                checked={data.is_active}
                                onChange={(e) =>
                                    setData("is_active", e.target.checked)
                                }
                                className="h-4 w-4 rounded border-zinc-300 text-emerald-600 focus:ring-emerald-500"
                            />
                            Room is active and available for scheduling
                        </label>

                        <div className="flex justify-between pt-4">
                            <Link
                                href={route("lecture-rooms.index")}
                                className="rounded bg-slate-400 px-4 py-2 text-white hover:bg-slate-700"
                            >
                                Cancel
                            </Link>

                            <button
                                disabled={processing}
                                type="submit"
                                className="rounded bg-emerald-600 px-4 py-2 text-white hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {processing ? "Updating..." : "Update Room"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}
