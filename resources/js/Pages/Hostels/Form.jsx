import { Link } from "@inertiajs/react";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import TextArea from "@/Components/TextArea";
import TextInput from "@/Components/TextInput";

const genders = [
    { value: "", label: "All / Not restricted" },
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
    { value: "mixed", label: "Mixed" },
];

export default function Form({ form, title, description, submitLabel, cancelHref }) {
    const { data, setData, processing, errors } = form;

    const updateRoom = (index, field, value) => {
        const rooms = [...data.rooms];
        rooms[index] = { ...rooms[index], [field]: value };
        setData("rooms", rooms);
    };

    const addRoom = () => {
        setData("rooms", [
            ...data.rooms,
            { id: null, name: "", code: "", floor: "", bed_count: 1, is_active: true },
        ]);
    };

    const removeRoom = (index) => {
        if (data.rooms.length === 1) {
            return;
        }

        setData(
            "rooms",
            data.rooms.filter((_, roomIndex) => roomIndex !== index),
        );
    };

    return (
        <form onSubmit={form.onSubmit} className="space-y-8 rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm">
            <div>
                <h1 className="text-3xl font-semibold text-zinc-900">{title}</h1>
                <p className="mt-2 max-w-3xl text-sm text-zinc-600">{description}</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <div>
                    <InputLabel value="Hostel Name" required />
                    <TextInput
                        value={data.name}
                        onChange={(e) => setData("name", e.target.value)}
                        className="mt-1 block w-full"
                        placeholder="e.g. Sunrise Hostel"
                    />
                    <InputError message={errors.name} className="mt-2" />
                </div>

                <div>
                    <InputLabel value="Hostel Code" required />
                    <TextInput
                        value={data.code}
                        onChange={(e) => setData("code", e.target.value)}
                        className="mt-1 block w-full"
                        placeholder="e.g. HSTL-A"
                    />
                    <InputError message={errors.code} className="mt-2" />
                </div>

                <div>
                    <InputLabel value="Session Hostel Fee" required />
                    <TextInput
                        type="number"
                        min="0"
                        step="0.01"
                        value={data.session_fee_amount}
                        onChange={(e) => setData("session_fee_amount", e.target.value)}
                        className="mt-1 block w-full"
                        placeholder="e.g. 18000"
                    />
                    <InputError message={errors.session_fee_amount} className="mt-2" />
                </div>

                <div>
                    <InputLabel value="Gender" />
                    <select
                        value={data.gender}
                        onChange={(e) => setData("gender", e.target.value)}
                        className="mt-1 block w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-400"
                    >
                        {genders.map((gender) => (
                            <option key={gender.value || "all"} value={gender.value}>
                                {gender.label}
                            </option>
                        ))}
                    </select>
                    <InputError message={errors.gender} className="mt-2" />
                </div>

                <div className="md:col-span-2">
                    <InputLabel value="Location" />
                    <TextInput
                        value={data.location}
                        onChange={(e) => setData("location", e.target.value)}
                        className="mt-1 block w-full"
                        placeholder="e.g. North Wing"
                    />
                    <InputError message={errors.location} className="mt-2" />
                </div>

                <div className="md:col-span-2">
                    <InputLabel value="Description" />
                    <TextArea
                        rows="4"
                        value={data.description}
                        onChange={(e) => setData("description", e.target.value)}
                        className="mt-1 block w-full"
                        placeholder="Optional notes about the hostel..."
                    />
                    <InputError message={errors.description} className="mt-2" />
                </div>
            </div>

            <label className="flex items-center gap-3 text-sm font-medium text-zinc-700">
                <input
                    type="checkbox"
                    checked={data.is_active}
                    onChange={(e) => setData("is_active", e.target.checked)}
                    className="h-4 w-4 rounded border-zinc-300 text-emerald-600 focus:ring-emerald-500"
                />
                Hostel is active and available for boarding allocation
            </label>

            <section className="space-y-4 rounded-2xl border border-zinc-200 bg-zinc-50 p-5">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-lg font-semibold text-zinc-900">Rooms and Beds</h2>
                        <p className="text-sm text-zinc-500">
                            Each room will automatically generate its bed inventory from the bed count you set.
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={addRoom}
                        className="rounded-xl border border-emerald-200 px-4 py-2 text-sm font-medium text-emerald-700 transition hover:bg-emerald-50"
                    >
                        Add Room
                    </button>
                </div>

                <InputError message={errors.rooms} className="mt-1" />

                {data.rooms.map((room, index) => (
                    <div key={room.id ?? `room-${index}`} className="rounded-2xl border border-zinc-200 bg-white p-5">
                        <div className="mb-4 flex items-center justify-between">
                            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-zinc-500">
                                Room {index + 1}
                            </p>
                            {data.rooms.length > 1 ? (
                                <button
                                    type="button"
                                    onClick={() => removeRoom(index)}
                                    className="text-sm font-medium text-red-600 hover:underline"
                                >
                                    Remove
                                </button>
                            ) : null}
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                            <div>
                                <InputLabel value="Room Name" required />
                                <TextInput
                                    value={room.name}
                                    onChange={(e) => updateRoom(index, "name", e.target.value)}
                                    className="mt-1 block w-full"
                                    placeholder="e.g. Blue Wing Room 1"
                                />
                                <InputError message={errors[`rooms.${index}.name`]} className="mt-2" />
                            </div>

                            <div>
                                <InputLabel value="Room Code" required />
                                <TextInput
                                    value={room.code}
                                    onChange={(e) => updateRoom(index, "code", e.target.value)}
                                    className="mt-1 block w-full"
                                    placeholder="e.g. BWR-01"
                                />
                                <InputError message={errors[`rooms.${index}.code`]} className="mt-2" />
                            </div>

                            <div>
                                <InputLabel value="Floor" />
                                <TextInput
                                    value={room.floor}
                                    onChange={(e) => updateRoom(index, "floor", e.target.value)}
                                    className="mt-1 block w-full"
                                    placeholder="e.g. Ground Floor"
                                />
                                <InputError message={errors[`rooms.${index}.floor`]} className="mt-2" />
                            </div>

                            <div>
                                <InputLabel value="Beds in Room" required />
                                <TextInput
                                    type="number"
                                    min="1"
                                    value={room.bed_count}
                                    onChange={(e) => updateRoom(index, "bed_count", e.target.value)}
                                    className="mt-1 block w-full"
                                />
                                <InputError message={errors[`rooms.${index}.bed_count`]} className="mt-2" />
                            </div>
                        </div>

                        <label className="mt-4 flex items-center gap-3 text-sm font-medium text-zinc-700">
                            <input
                                type="checkbox"
                                checked={room.is_active}
                                onChange={(e) => updateRoom(index, "is_active", e.target.checked)}
                                className="h-4 w-4 rounded border-zinc-300 text-emerald-600 focus:ring-emerald-500"
                            />
                            Room is active for boarding allocation
                        </label>
                    </div>
                ))}
            </section>

            <div className="flex items-center justify-between pt-2">
                <Link
                    href={cancelHref}
                    className="rounded-xl border border-zinc-200 px-5 py-3 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50"
                >
                    Cancel
                </Link>

                <button
                    type="submit"
                    disabled={processing}
                    className="rounded-xl bg-emerald-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {processing ? "Saving..." : submitLabel}
                </button>
            </div>
        </form>
    );
}
