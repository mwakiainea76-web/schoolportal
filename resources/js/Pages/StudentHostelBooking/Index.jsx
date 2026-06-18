import { Head, Link, useForm } from "@inertiajs/react";
import InputError from "@/Components/InputError";
import formatDate from "@/utils/date";
import { BedDouble, CheckCircle2, Home, Wallet } from "lucide-react";

const currency = (amount) =>
    `Ksh ${new Intl.NumberFormat("en-KE", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(Number(amount || 0))}`;

export default function Index({
    activeSession,
    enrollment,
    eligibility,
    hostels = [],
    existingInvoice,
    allocation,
}) {
    const { data, setData, post, processing, errors } = useForm({
        hostel_id: "",
    });

    const selectedHostel = hostels.find(
        (hostel) => hostel.id === data.hostel_id,
    );

    const submit = (e) => {
        e.preventDefault();

        post(route("student.hostel-booking.store"), {
            preserveScroll: true,
        });
    };

    return (
        <>
            <Head title="Book Hostel" />

            <div className="w-full animate-in fade-in slide-in-from-bottom-2 duration-500">
                <div className="rounded-2xl border border-zinc-100 bg-white p-6 shadow-sm">
                    <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                        <div>
                            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-600">
                                Hostel
                            </p>
                            <h1 className="mt-2 text-2xl font-semibold text-zinc-950">
                                Book Hostel Accommodation
                            </h1>
                            <p className="mt-2 max-w-3xl text-sm text-zinc-500">
                                {eligibility.message}
                            </p>
                        </div>

                        <div className="rounded-xl bg-zinc-50 px-4 py-3 text-sm">
                            <p className="text-zinc-500">Active Session</p>
                            <p className="mt-1 font-semibold text-zinc-900">
                                {activeSession?.name ?? "Not available"}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="mt-6 grid gap-4 md:grid-cols-3">
                    <div className="rounded-2xl border border-zinc-100 bg-white p-5 shadow-sm">
                        <div className="inline-flex rounded-xl bg-emerald-50 p-3 text-emerald-700">
                            <CheckCircle2 className="h-5 w-5" />
                        </div>
                        <p className="mt-4 text-sm text-zinc-500">
                            Session Registration
                        </p>
                        <p className="mt-1 font-semibold text-zinc-900">
                            {enrollment ? "Registered" : "Required"}
                        </p>
                    </div>

                    <div className="rounded-2xl border border-zinc-100 bg-white p-5 shadow-sm">
                        <div className="inline-flex rounded-xl bg-sky-50 p-3 text-sky-700">
                            <Wallet className="h-5 w-5" />
                        </div>
                        <p className="mt-4 text-sm text-zinc-500">
                            Hostel Invoice
                        </p>
                        <p className="mt-1 font-semibold text-zinc-900">
                            {existingInvoice
                                ? existingInvoice.invoice_number
                                : "Not requested"}
                        </p>
                        {existingInvoice ? (
                            <p className="mt-1 text-xs text-zinc-500">
                                Balance {currency(existingInvoice.balance_due)}
                            </p>
                        ) : null}
                    </div>

                    <div className="rounded-2xl border border-zinc-100 bg-white p-5 shadow-sm">
                        <div className="inline-flex rounded-xl bg-amber-50 p-3 text-amber-700">
                            <BedDouble className="h-5 w-5" />
                        </div>
                        <p className="mt-4 text-sm text-zinc-500">
                            Bed Allocation
                        </p>
                        <p className="mt-1 font-semibold text-zinc-900">
                            {allocation ? allocation.hostel : "Pending"}
                        </p>
                        {allocation ? (
                            <p className="mt-1 text-xs text-zinc-500">
                                {[allocation.room, allocation.bed]
                                    .filter(Boolean)
                                    .join(" - ")}
                            </p>
                        ) : null}
                    </div>
                </div>

                {existingInvoice ? (
                    <div className="mt-6 rounded-2xl border border-sky-100 bg-sky-50 p-5 text-sm text-sky-900">
                        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                            <div>
                                <p className="font-semibold">
                                    Hostel invoice ready
                                </p>
                                <p className="mt-1 text-sky-800">
                                    Amount {currency(existingInvoice.amount_due)}
                                    {existingInvoice.due_date
                                        ? `, due ${formatDate(existingInvoice.due_date)}`
                                        : ""}
                                </p>
                            </div>
                            <Link
                                href={route(
                                    "student.fee-statements.show",
                                    existingInvoice.id,
                                )}
                                className="inline-flex justify-center rounded-xl bg-sky-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-800"
                            >
                                View Statement
                            </Link>
                        </div>
                    </div>
                ) : null}

                {!eligibility.can_book ? (
                    <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-900">
                        <p className="font-semibold">Booking unavailable</p>
                        <p className="mt-1">{eligibility.message}</p>
                        {!enrollment ? (
                            <Link
                                href={route("dashboard")}
                                className="mt-4 inline-flex rounded-xl bg-amber-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-amber-800"
                            >
                                Go to Dashboard
                            </Link>
                        ) : null}
                    </div>
                ) : (
                    <form onSubmit={submit} className="mt-6 space-y-5">
                        <InputError message={errors.hostel_id} />

                        <div className="grid gap-5 lg:grid-cols-3">
                            {hostels.length ? (
                                hostels.map((hostel) => {
                                    const selected = data.hostel_id === hostel.id;

                                    return (
                                        <button
                                            key={hostel.id}
                                            type="button"
                                            onClick={() =>
                                                setData("hostel_id", hostel.id)
                                            }
                                            className={`flex h-full flex-col rounded-2xl border bg-white p-5 text-left shadow-sm transition ${
                                                selected
                                                    ? "border-emerald-500 ring-2 ring-emerald-100"
                                                    : "border-zinc-100 hover:border-emerald-200"
                                            }`}
                                        >
                                            <div className="flex items-start justify-between gap-4">
                                                <div>
                                                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500">
                                                        {hostel.code}
                                                    </p>
                                                    <h2 className="mt-2 text-lg font-semibold text-zinc-950">
                                                        {hostel.name}
                                                    </h2>
                                                </div>
                                                <div className="rounded-xl bg-emerald-50 p-3 text-emerald-700">
                                                    <Home className="h-5 w-5" />
                                                </div>
                                            </div>

                                            <p className="mt-3 line-clamp-2 text-sm text-zinc-500">
                                                {hostel.description ||
                                                    hostel.location ||
                                                    "Hostel accommodation"}
                                            </p>

                                            <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
                                                <div className="rounded-xl bg-zinc-50 px-3 py-2">
                                                    <p className="text-xs text-zinc-500">
                                                        Fee
                                                    </p>
                                                    <p className="mt-1 font-semibold text-zinc-900">
                                                        {currency(
                                                            hostel.session_fee_amount,
                                                        )}
                                                    </p>
                                                </div>
                                                <div className="rounded-xl bg-zinc-50 px-3 py-2">
                                                    <p className="text-xs text-zinc-500">
                                                        Available Beds
                                                    </p>
                                                    <p className="mt-1 font-semibold text-zinc-900">
                                                        {
                                                            hostel.available_beds_count
                                                        }
                                                    </p>
                                                </div>
                                            </div>
                                        </button>
                                    );
                                })
                            ) : (
                                <div className="rounded-2xl border border-zinc-100 bg-white p-5 text-sm text-zinc-500 lg:col-span-3">
                                    No hostel with an available bed is currently
                                    open for your session.
                                </div>
                            )}
                        </div>

                        <div className="flex flex-col gap-3 rounded-2xl border border-zinc-100 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <p className="text-sm font-semibold text-zinc-900">
                                    {selectedHostel
                                        ? selectedHostel.name
                                        : "Select a hostel"}
                                </p>
                                <p className="mt-1 text-sm text-zinc-500">
                                    {selectedHostel
                                        ? `Invoice amount ${currency(selectedHostel.session_fee_amount)}`
                                        : "A hostel invoice will be generated for payment."}
                                </p>
                            </div>

                            <button
                                type="submit"
                                disabled={processing || !data.hostel_id}
                                className="inline-flex justify-center rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {processing ? "Booking..." : "Book Hostel"}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </>
    );
}
