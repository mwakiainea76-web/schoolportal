import { Head, Link, router } from "@inertiajs/react";
import { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import Table from "@/Components/Table/Table";
import Tbody from "@/Components/Table/Tbody";
import Tdata from "@/Components/Table/Tdata";
import THdata from "@/Components/Table/THdata";
import Thead from "@/Components/Table/Thead";
import Trow from "@/Components/Table/Trow";

const currency = (amount) =>
    `Ksh ${new Intl.NumberFormat("en-KE", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(Number(amount || 0))}`;

export default function Index({ allocations, filters, hostels, sessions }) {
    const [search, setSearch] = useState(filters.search || "");

    const submit = (e) => {
        e.preventDefault();
        router.get(
            route("hostel-allocations.index"),
            {
                search,
                status: filters.status,
                hostel_id: filters.hostel_id,
                academic_session_id: filters.academic_session_id,
            },
            { preserveState: true, replace: true },
        );
    };

    const updateFilter = (field, value) => {
        router.get(
            route("hostel-allocations.index"),
            {
                search,
                ...filters,
                [field]: value,
            },
            { preserveState: true, replace: true },
        );
    };

    return (
        <AuthenticatedLayout>
            <Head title="Hostel Allocations" />

            <div className="mx-auto w-full space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                        <h1 className="text-3xl font-semibold text-zinc-900">Hostel Allocations</h1>
                        <p className="mt-2 text-sm text-zinc-500">
                            Allocate beds per session, confirm that the student is enrolled first, and keep hostel billing tied to the allocation record.
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <Link href={route("hostels.index")} className="rounded bg-slate-600 px-4 py-2 text-white hover:bg-slate-700">
                            Manage Hostels
                        </Link>
                        <Link href={route("hostel-allocations.create")} className="rounded bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700">
                            Allocate Bed
                        </Link>
                    </div>
                </div>

                <form
                    className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm"
                    onSubmit={submit}
                >
                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-[minmax(0,2fr)_180px_220px_200px_140px] xl:items-end">
                        <label className="block">
                            <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                                Search
                            </span>
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search student, hostel, room, or bed..."
                                className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-400"
                            />
                        </label>
                        <label className="block">
                            <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                                Status
                            </span>
                            <select
                                value={filters.status}
                                onChange={(e) => updateFilter("status", e.target.value)}
                                className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-400"
                            >
                                <option value="">All statuses</option>
                                <option value="active">Active</option>
                                <option value="vacated">Vacated</option>
                            </select>
                        </label>
                        <label className="block">
                            <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                                Hostel
                            </span>
                            <select
                                value={filters.hostel_id}
                                onChange={(e) => updateFilter("hostel_id", e.target.value)}
                                className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-400"
                            >
                                <option value="">All hostels</option>
                                {hostels.map((hostel) => (
                                    <option key={hostel.id} value={hostel.id}>
                                        {hostel.name}
                                    </option>
                                ))}
                            </select>
                        </label>
                        <label className="block">
                            <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                                Session
                            </span>
                            <select
                                value={filters.academic_session_id}
                                onChange={(e) => updateFilter("academic_session_id", e.target.value)}
                                className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-400"
                            >
                                <option value="">All sessions</option>
                                {sessions.map((session) => (
                                    <option key={session.id} value={session.id}>
                                        {session.name}
                                    </option>
                                ))}
                            </select>
                        </label>
                        <button
                            className="rounded-xl bg-emerald-600 px-4 py-3 text-white hover:bg-emerald-700"
                            type="submit"
                        >
                            Search
                        </button>
                    </div>
                </form>

                <Table pagination={allocations}>
                    <Thead>
                        <THdata>Student</THdata>
                        <THdata>Session</THdata>
                        <THdata>Hostel</THdata>
                        <THdata>Room / Bed</THdata>
                        <THdata>Fee</THdata>
                        <THdata>Invoice</THdata>
                        <THdata>Status</THdata>
                        <THdata>Allocated On</THdata>
                        <THdata>Actions</THdata>
                    </Thead>
                    <Tbody>
                        {allocations?.data?.length ? (
                            allocations.data.map((allocation) => (
                                <Trow key={allocation.id}>
                                    <Tdata>
                                        {allocation.student_name}
                                        <div className="mt-1 text-xs text-zinc-500">{allocation.registration_number}</div>
                                    </Tdata>
                                    <Tdata>{allocation.session_name}</Tdata>
                                    <Tdata>{allocation.hostel_name}</Tdata>
                                    <Tdata>
                                        <div>{allocation.room_name}</div>
                                        <div className="mt-1 text-xs text-zinc-500">{allocation.bed_label}</div>
                                    </Tdata>
                                    <Tdata>{currency(allocation.hostel_fee_amount)}</Tdata>
                                    <Tdata>
                                        {allocation.invoice_number || "Pending"}
                                        {allocation.invoice_balance_due !== null ? (
                                            <div className="mt-1 text-xs text-zinc-500">
                                                Balance {currency(allocation.invoice_balance_due)}
                                            </div>
                                        ) : null}
                                    </Tdata>
                                    <Tdata>
                                        <span className={`rounded-full px-3 py-1 text-xs font-medium ${allocation.status === "active" ? "bg-emerald-50 text-emerald-700" : "bg-zinc-100 text-zinc-600"}`}>
                                            {allocation.status}
                                        </span>
                                    </Tdata>
                                    <Tdata>{allocation.allocated_on || "-"}</Tdata>
                                    <Tdata>
                                        <Link href={route("hostel-allocations.edit", allocation.id)} className="text-emerald-600 hover:underline">
                                            Edit
                                        </Link>
                                    </Tdata>
                                </Trow>
                            ))
                        ) : (
                            <Trow>
                                <Tdata colSpan="9" className="py-8 text-center">
                                    No hostel allocations found.
                                </Tdata>
                            </Trow>
                        )}
                    </Tbody>
                </Table>
            </div>
        </AuthenticatedLayout>
    );
}
