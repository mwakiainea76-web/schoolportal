import { Head, router } from "@inertiajs/react";
import { MoreHorizontalIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Table as ShadTable,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import TablePagination from "@/Components/TablePagination";
import formatDate from "@/utils/date";
import AcademicYearCreate from "@/Pages/AcademicYears/Create";
import AcademicYearEdit from "@/Pages/AcademicYears/Edit";

const YEAR_STATUS = {
    upcoming: {
        label: "Upcoming",
        badgeClass: "bg-amber-100 text-amber-700",
        actionLabel: "Start Year",
        action: "start",
    },
    ongoing: {
        label: "Ongoing",
        badgeClass: "bg-green-100 text-green-700",
        actionLabel: "End Year",
        action: "end",
    },
    completed: {
        label: "Completed",
        badgeClass: "bg-red-100 text-red-600",
        actionLabel: "Reactivate",
        action: "reactivate",
    },
    on_hold: {
        label: "On hold",
        badgeClass: "bg-slate-100 text-slate-700",
        actionLabel: "Activate",
        action: "start",
    },
};

export default function Index({
    academic_years,
    active_academic_year_id = "",
    filters = {},
}) {
    const [sortField, setSortField] = useState(
        filters.year_sort || "created_at",
    );
    const [sortDirection, setSortDirection] = useState(
        filters.year_direction || "desc",
    );
    const [searchTerm, setSearchTerm] = useState(filters.year_search || "");
    const [addModalOpen, setAddModalOpen] = useState(false);
    const [editingYear, setEditingYear] = useState(null);

    const fetchYears = (params) => {
        router.get(route("academic.years.index"), params, {
            preserveState: true,
            replace: true,
        });
    };

    const handleSort = (field) => {
        const direction =
            sortField === field && sortDirection === "asc" ? "desc" : "asc";

        setSortField(field);
        setSortDirection(direction);

        fetchYears({
            year_search: searchTerm,
            year_sort: field,
            year_direction: direction,
            year_page: 1,
        });
    };

    const renderArrow = (field) => {
        if (sortField !== field) {
            return null;
        }

        return sortDirection === "asc" ? " ^" : " v";
    };

    const submit = (event) => {
        event.preventDefault();

        fetchYears({
            year_search: searchTerm,
            year_sort: sortField,
            year_direction: sortDirection,
            year_page: 1,
        });
    };

    const handleDelete = (id) => {
        if (!confirm("Are you sure you want to delete this academic year?")) {
            return;
        }

        router.delete(route("academic.years.destroy", id), {
            preserveState: true,
            replace: true,
        });
    };

    const updateStatus = (year, action) => {
        router.patch(
            route("academic.years.status", year.id),
            { action },
            {
                preserveScroll: true,
            },
        );
    };

    const getYearStatus = (year) => {
        const key = year.status || (year.is_active ? "ongoing" : "upcoming");
        const status = YEAR_STATUS[key] || YEAR_STATUS.upcoming;
        const activating = ["start", "reactivate"].includes(status.action);

        return {
            ...status,
            disabled:
                activating &&
                Boolean(active_academic_year_id) &&
                String(active_academic_year_id) !== String(year.id),
            helper:
                "You can only activate an academic year after ending the previous one.",
        };
    };

    return (
        <>
            <Head title="Academic Years" />

            <div className="mx-auto w-full max-w-7xl animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <button
                        type="button"
                        onClick={() => setAddModalOpen(true)}
                        className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-700"
                    >
                        Add Academic Year
                    </button>
                </div>

                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <div className="border-b border-slate-100 px-6 py-5">
                        <form
                            className="relative flex w-full flex-col gap-3 md:flex-row"
                            onSubmit={submit}
                        >
                            <input
                                type="text"
                                placeholder="Search academic years..."
                                className="w-full rounded-xl border border-zinc-200 bg-zinc-50 py-2.5 pl-11 text-sm transition-all focus:border-emerald-400 focus:ring-0"
                                value={searchTerm}
                                onChange={(event) =>
                                    setSearchTerm(event.target.value)
                                }
                            />
                            <svg
                                className="absolute left-4 top-3.5 h-4 w-4 text-zinc-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                    strokeWidth="2"
                                />
                            </svg>
                            <button
                                className="rounded bg-emerald-600 px-4 py-2 text-white hover:bg-slate-700"
                                type="submit"
                            >
                                Search
                            </button>
                        </form>
                    </div>

                    <div className="px-6 pb-6">
                        <Table
                            pagination={academic_years}
                            sortField={sortField}
                            sortDirection={sortDirection}
                        >
                            <Thead>
                                <THdata
                                    onClick={() => handleSort("academic_year")}
                                    className="cursor-pointer"
                                >
                                    Academic Year{renderArrow("academic_year")}
                                </THdata>
                                <THdata>Start Date</THdata>
                                <THdata>End Date</THdata>
                                <THdata>Status</THdata>
                                <THdata
                                    onClick={() => handleSort("created_at")}
                                    className="cursor-pointer"
                                >
                                    Created{renderArrow("created_at")}
                                </THdata>
                                <THdata>Actions</THdata>
                            </Thead>

                            <Tbody>
                                {academic_years?.data?.length ? (
                                    academic_years.data.map((year) => {
                                        const status = getYearStatus(year);

                                        return (
                                            <Trow key={year.id}>
                                                <Tdata className="font-medium text-slate-700">
                                                    {year.academic_year}
                                                </Tdata>
                                                <Tdata>
                                                    {formatDate(year.start_date)}
                                                </Tdata>
                                                <Tdata>
                                                    {formatDate(year.end_date)}
                                                </Tdata>
                                                <Tdata>
                                                    <span
                                                        className={`rounded px-2 py-0.5 text-xs ${status.badgeClass}`}
                                                    >
                                                        {status.label}
                                                    </span>
                                                </Tdata>
                                                <Tdata>
                                                    {formatDate(year.created_at)}
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
                                                            className="w-44"
                                                        >
                                                            <DropdownMenuItem
                                                                onClick={() =>
                                                                    setEditingYear(
                                                                        year,
                                                                    )
                                                                }
                                                            >
                                                                Edit
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                title={
                                                                    status.disabled
                                                                        ? status.helper
                                                                        : ""
                                                                }
                                                                disabled={
                                                                    status.disabled
                                                                }
                                                                onClick={() =>
                                                                    !status.disabled &&
                                                                    updateStatus(
                                                                        year,
                                                                        status.action,
                                                                    )
                                                                }
                                                            >
                                                                {status.actionLabel}
                                                            </DropdownMenuItem>
                                                            {year.status !==
                                                            "on_hold" ? (
                                                                <DropdownMenuItem
                                                                    onClick={() =>
                                                                        updateStatus(
                                                                            year,
                                                                            "hold",
                                                                        )
                                                                    }
                                                                >
                                                                    Put On Hold
                                                                </DropdownMenuItem>
                                                            ) : null}
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem
                                                                variant="destructive"
                                                                onClick={() =>
                                                                    handleDelete(
                                                                        year.id,
                                                                    )
                                                                }
                                                            >
                                                                Delete
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </Tdata>
                                            </Trow>
                                        );
                                    })
                                ) : (
                                    <Trow>
                                        <Tdata
                                            colSpan="6"
                                            className="py-4 text-center"
                                        >
                                            No records found.
                                        </Tdata>
                                    </Trow>
                                )}
                            </Tbody>
                        </Table>
                    </div>
                </div>
            </div>

            <AcademicYearCreate
                modalMode
                open={addModalOpen}
                onClose={() => setAddModalOpen(false)}
            />

            {editingYear ? (
                <AcademicYearEdit
                    modalMode
                    open={Boolean(editingYear)}
                    onClose={() => setEditingYear(null)}
                    academic_year={editingYear}
                />
            ) : null}
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
