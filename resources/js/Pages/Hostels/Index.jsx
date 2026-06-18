import { Head, Link, router } from "@inertiajs/react";
import { useState } from "react";
import { MoreHorizontalIcon } from "lucide-react";
import {
    Table as ShadTable,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/Components/ui/table";
import TablePagination from "@/Components/TablePagination";
import { Button } from "@/Components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu";

const currency = (amount) =>
    `Ksh ${new Intl.NumberFormat("en-KE", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(Number(amount || 0))}`;

export default function Index({ hostels, filters }) {
    const [search, setSearch] = useState(filters.search || "");

    const submit = (e) => {
        e.preventDefault();
        router.get(route("hostels.index"), { search }, { preserveState: true, replace: true });
    };

    const handleDelete = (id) => {
        if (!confirm("Delete this hostel?")) return;
        router.delete(route("hostels.destroy", id), { preserveScroll: true });
    };

    return (
        <>
            <Head title="Hostels" />

            <div className="mx-auto w-full space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <form
                    className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm"
                    onSubmit={submit}
                >
                    <div className="grid gap-4 md:grid-cols-[minmax(0,2fr)_140px] md:items-end lg:max-w-2xl">
                        <label className="block">
                            <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                                Search
                            </span>
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search hostel name, code, or location..."
                                className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-400"
                            />
                        </label>
                        <button
                            className="rounded-xl bg-emerald-600 px-4 py-3 text-white hover:bg-emerald-700"
                            type="submit"
                        >
                            Search
                        </button>
                    </div>
                </form>

                <Table pagination={hostels}>
                    <Thead>
                        <THdata>Code</THdata>
                        <THdata>Name</THdata>
                        <THdata>Fee / Session</THdata>
                        <THdata>Gender</THdata>
                        <THdata>Rooms</THdata>
                        <THdata>Beds</THdata>
                        <THdata>Active Allocations</THdata>
                        <THdata>Status</THdata>
                        <THdata>Actions</THdata>
                    </Thead>
                    <Tbody>
                        {hostels?.data?.length ? (
                            hostels.data.map((hostel) => (
                                <Trow key={hostel.id}>
                                    <Tdata>{hostel.code}</Tdata>
                                    <Tdata>
                                        {hostel.name}
                                        <div className="mt-1 text-xs text-zinc-500">{hostel.location || "No location"}</div>
                                    </Tdata>
                                    <Tdata>{currency(hostel.session_fee_amount)}</Tdata>
                                    <Tdata>{hostel.gender ? hostel.gender.toUpperCase() : "OPEN"}</Tdata>
                                    <Tdata>{hostel.rooms_count}</Tdata>
                                    <Tdata>{hostel.beds_count}</Tdata>
                                    <Tdata>{hostel.active_allocations_count}</Tdata>
                                    <Tdata>
                                        <span className={`rounded-full px-3 py-1 text-xs font-medium ${hostel.is_active ? "bg-emerald-50 text-emerald-700" : "bg-zinc-100 text-zinc-500"}`}>
                                            {hostel.is_active ? "Active" : "Inactive"}
                                        </span>
                                    </Tdata>
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
                                                            "hostels.edit",
                                                            hostel.id,
                                                        )}
                                                    >
                                                        Edit
                                                    </Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem
                                                    variant="destructive"
                                                    onClick={() =>
                                                        handleDelete(hostel.id)
                                                    }
                                                >
                                                    Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </Tdata>
                                </Trow>
                            ))
                        ) : (
                            <Trow>
                                <Tdata colSpan="9" className="py-8 text-center">
                                    No hostels found.
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
