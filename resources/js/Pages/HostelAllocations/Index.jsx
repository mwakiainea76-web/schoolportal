import { Head, Link, router } from "@inertiajs/react";
import { MoreHorizontalIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "@/Components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu";
import {
    Table as ShadTable,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/Components/ui/table";
import TablePagination from "@/Components/TablePagination";
import formatDate from "@/utils/date";

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
        <>
            <Head title="Hostel Allocations" />

            <div className="mx-auto w-full space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
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
                                        <div className="mt-1 text-xs text-zinc-500">{allocation.admission_number}</div>
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
                                    <Tdata>{formatDate(allocation.allocated_on)}</Tdata>
                                    <Tdata className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="size-8"
                                                >
                                                    <MoreHorizontalIcon />
                                                    <span className="sr-only">
                                                        Open menu
                                                    </span>
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent
                                                side="left"
                                                align="start"
                                                sideOffset={8}
                                                className="w-40"
                                            >
                                                <DropdownMenuItem asChild>
                                                    <Link
                                                        href={route(
                                                            "hostel-allocations.edit",
                                                            allocation.id,
                                                        )}
                                                    >
                                                        Edit
                                                    </Link>
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
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
        </>
    );
}
const Table = ({ children, pagination, ...props }) => (
    <>
        <ShadTable {...props}>{children}</ShadTable>
        <TablePagination pagination={pagination} />
    </>
);
const Thead = ({ children, ...props }) => (
    <TableHeader {...props}>
        <TableRow>{children}</TableRow>
    </TableHeader>
);
const THdata = (props) => <TableHead {...props} />;
const Tbody = (props) => <TableBody {...props} />;
const Trow = (props) => <TableRow {...props} />;
const Tdata = (props) => <TableCell {...props} />;
