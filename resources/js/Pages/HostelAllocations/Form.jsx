import { Link } from "@inertiajs/react";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import SearchSelect from "@/Components/SearchSelect";
import TextArea from "@/Components/TextArea";

export default function Form({
    form,
    title,
    description,
    submitLabel,
    cancelHref,
    enrollments,
    hostels,
    rooms,
    beds,
}) {
    const { data, setData, processing, errors } = form;

    const filteredRooms = data.hostel_id ? rooms.filter((room) => room.hostel_id === data.hostel_id) : rooms;
    const filteredBeds = data.hostel_room_id ? beds.filter((bed) => bed.hostel_room_id === data.hostel_room_id) : beds;
    const selectedHostel = hostels.find((hostel) => hostel.id === data.hostel_id);

    return (
        <form onSubmit={form.onSubmit} className="space-y-8 rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm">
            <div>
                <h1 className="text-3xl font-semibold text-zinc-900">{title}</h1>
                <p className="mt-2 max-w-3xl text-sm text-zinc-600">{description}</p>
            </div>

            <div className="rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-800">
                Hostel beds are allocated per academic session. Only students who already have an active session enrollment qualify, and room assignment is blocked until the hostel invoice for that session is fully paid.
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <div className="md:col-span-2">
                    <InputLabel value="Session Enrollment" required />
                    <SearchSelect
                        routeName={null}
                        defaultOptions={enrollments}
                        value={data.academic_session_enrollment_id}
                        placeholder="Select active session enrollment..."
                        onChange={(item) => setData("academic_session_enrollment_id", item.id)}
                        error={errors.academic_session_enrollment_id}
                    />
                    <InputError message={errors.academic_session_enrollment_id} className="mt-2" />
                </div>

                <div>
                    <InputLabel value="Hostel" required />
                    <SearchSelect
                        routeName={null}
                        defaultOptions={hostels}
                        value={data.hostel_id}
                        placeholder="Select hostel..."
                        onChange={(item) => {
                            setData("hostel_id", item.id);
                            setData("hostel_room_id", "");
                            setData("hostel_bed_id", "");
                        }}
                        error={errors.hostel_id}
                    />
                    <InputError message={errors.hostel_id} className="mt-2" />
                </div>

                <div>
                    <InputLabel value="Room" required />
                    <SearchSelect
                        routeName={null}
                        defaultOptions={filteredRooms}
                        value={data.hostel_room_id}
                        placeholder="Select room..."
                        onChange={(item) => {
                            setData("hostel_room_id", item.id);
                            setData("hostel_bed_id", "");
                        }}
                        error={errors.hostel_room_id}
                        disabled={!data.hostel_id}
                    />
                    <InputError message={errors.hostel_room_id} className="mt-2" />
                </div>

                <div>
                    <InputLabel value="Bed" required />
                    <SearchSelect
                        routeName={null}
                        defaultOptions={filteredBeds}
                        value={data.hostel_bed_id}
                        placeholder="Select bed..."
                        onChange={(item) => setData("hostel_bed_id", item.id)}
                        error={errors.hostel_bed_id}
                        disabled={!data.hostel_room_id}
                    />
                    <InputError message={errors.hostel_bed_id} className="mt-2" />
                </div>

                <div>
                    <InputLabel value="Allocated On" required />
                    <input
                        type="date"
                        value={data.allocated_on}
                        onChange={(e) => setData("allocated_on", e.target.value)}
                        className="mt-1 block w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-400"
                    />
                    <InputError message={errors.allocated_on} className="mt-2" />
                </div>

                <div>
                    <InputLabel value="Status" required />
                    <select
                        value={data.status}
                        onChange={(e) => setData("status", e.target.value)}
                        className="mt-1 block w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-400"
                    >
                        <option value="active">Active</option>
                        <option value="vacated">Vacated</option>
                    </select>
                    <InputError message={errors.status} className="mt-2" />
                </div>

                <div className="md:col-span-2 rounded-2xl border border-zinc-200 bg-zinc-50 px-5 py-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">Hostel fee snapshot</p>
                    <p className="mt-2 text-lg font-semibold text-zinc-900">
                        {selectedHostel
                            ? `Ksh ${new Intl.NumberFormat("en-KE", {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                              }).format(Number(selectedHostel.session_fee_amount || 0))}`
                            : "Select a hostel to view the fee"}
                    </p>
                    <p className="mt-1 text-sm text-zinc-500">
                        The selected hostel fee must already be fully settled on the student account before this bed can be assigned.
                    </p>
                </div>

                <div className="md:col-span-2">
                    <InputLabel value="Notes" />
                    <TextArea
                        rows="4"
                        value={data.notes}
                        onChange={(e) => setData("notes", e.target.value)}
                        className="mt-1 block w-full"
                        placeholder="Optional allocation notes..."
                    />
                    <InputError message={errors.notes} className="mt-2" />
                </div>
            </div>

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
