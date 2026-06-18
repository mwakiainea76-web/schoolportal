import { Head, Link, router } from "@inertiajs/react";
import { MoreHorizontalIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "@/Components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
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

export default function FeePlans({ feePlans }) {
    const [sortField, setSortField] = useState(feePlans.sort || "created_at");
    const [sortDirection, setSortDirection] = useState(
        feePlans.direction || "desc",
    );

    const [filters, setFilters] = useState({
        search: feePlans.search || "",
        is_active: feePlans.is_active ?? "",
        version: feePlans.version || "",
        approval_status: feePlans.approval_status || "",
    });

    const applyFilters = (extra = {}) => {
        router.get(
            route("fees.plans.index"),
            {
                ...filters,
                sort: sortField,
                direction: sortDirection,
                ...extra,
            },
            {
                preserveState: true,
                replace: true,
            },
        );
    };

    const handleSort = (field) => {
        const direction =
            sortField === field && sortDirection === "asc" ? "desc" : "asc";

        setSortField(field);
        setSortDirection(direction);

        applyFilters({ sort: field, direction });
    };

    const renderArrow = (field) => {
        if (sortField !== field) return null;
        return sortDirection === "asc" ? "↑" : "↓";
    };

    const handleDelete = (id) => {
        if (!confirm("Delete this fee plan?")) return;

        router.delete(route("fees.plans.destroy", id), {
            preserveState: true,
            replace: true,
        });
    };

    const handleApproval = (id, action) => {
        const actionText = action === "approve" ? "approve" : "reject";
        const confirmMessage = `Are you sure you want to ${actionText} this fee plan?`;

        if (!confirm(confirmMessage)) return;

        router.post(
            route("fees.plans.approval", { feePlan: id, action }),
            {},
            {
                preserveState: true,
                replace: true,
            },
        );
    };

    const updateFilter = (key, value) => {
        const updated = { ...filters, [key]: value };
        setFilters(updated);
        applyFilters({ [key]: value });
    };

    return (
        <>
            <Head title="Fee Plans" />

            <div className="mx-auto w-full space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                {/* HEADER ACTION BAR */}
                <div>
                    <h1 className="text-lg font-semibold text-zinc-700">
                        Fee Plans
                    </h1>
                </div>

                {/* FILTER BAR */}
                <div className="bg-white border border-zinc-100 rounded-lg shadow-sm p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2  xl:grid-cols-3 gap-8">
                        {/* SEARCH */}
                        <input
                            type="text"
                            value={filters.search}
                            onChange={(e) =>
                                updateFilter("search", e.target.value)
                            }
                            placeholder="Search fee plans..."
                            className="border border-zinc-200 px-3 py-2 rounded-lg w-full md:w-72 focus:outline-none focus:ring-2 focus:ring-slate-300"
                        />

                        {/* STATUS */}
                        <select
                            value={filters.is_active}
                            onChange={(e) =>
                                updateFilter("is_active", e.target.value)
                            }
                            className="border border-zinc-200 px-3 py-2 rounded-lg"
                        >
                            <option value="">All Status</option>
                            <option value="1">Active</option>
                            <option value="0">Inactive</option>
                        </select>

                        {/* VERSION */}
                        <select
                            value={filters.version}
                            onChange={(e) =>
                                updateFilter("version", e.target.value)
                            }
                            className="border border-zinc-200 px-3 py-2 rounded-lg"
                        >
                            <option value="">All Versions</option>
                            <option value="v1">v1</option>
                            <option value="v2">v2</option>
                            <option value="v3">v3</option>
                        </select>

                        {/* APPROVAL STATUS */}
                        <select
                            value={filters.approval_status}
                            onChange={(e) =>
                                updateFilter("approval_status", e.target.value)
                            }
                            className="border border-zinc-200 px-3 py-2 rounded-lg"
                        >
                            <option value="">All Approvals</option>
                            <option value="draft">Draft</option>
                            <option value="pending_approval">
                                Pending Approval
                            </option>
                            <option value="approved">Approved</option>
                            <option value="rejected">Rejected</option>
                        </select>

                        {/* RESET */}
                        <button
                            onClick={() => {
                                const reset = {
                                    search: "",
                                    is_active: "",
                                    version: "",
                                    approval_status: "",
                                };
                                setFilters(reset);
                                router.get(route("fees.plans.index"));
                            }}
                            className="px-4 py-2 bg-zinc-400 text-white rounded-lg hover:bg-zinc-500 transition"
                        >
                            Reset
                        </button>
                    </div>
                </div>

                {/* TABLE */}
                <div className="bg-white border border-zinc-100 rounded-lg shadow-sm overflow-hidden">
                    <Table
                        pagination={feePlans}
                        sortField={sortField}
                        sortDirection={sortDirection}
                    >
                        <Thead>
                            <THdata
                                onClick={() => handleSort("name")}
                                className="cursor-pointer"
                            >
                                Name {renderArrow("name")}
                            </THdata>

                            <THdata
                                onClick={() => handleSort("version")}
                                className="cursor-pointer"
                            >
                                Version {renderArrow("version")}
                            </THdata>

                            <THdata
                                onClick={() => handleSort("is_active")}
                                className="cursor-pointer"
                            >
                                Status {renderArrow("is_active")}
                            </THdata>

                            <THdata
                                onClick={() => handleSort("approval_status")}
                                className="cursor-pointer"
                            >
                                Approval {renderArrow("approval_status")}
                            </THdata>

                            <THdata
                                onClick={() => handleSort("created_at")}
                                className="cursor-pointer"
                            >
                                Created {renderArrow("created_at")}
                            </THdata>

                            <THdata>Actions</THdata>
                        </Thead>

                        <Tbody>
                            {feePlans?.data?.length ? (
                                feePlans.data.map((plan) => (
                                    <Trow key={plan.id}>
                                        <Tdata>{plan.name}</Tdata>
                                        <Tdata>{plan.version}</Tdata>

                                        <Tdata>
                                            <span
                                                className={`px-2 py-1 rounded text-xs ${
                                                    plan.is_active == 1
                                                        ? "bg-emerald-100 text-emerald-700"
                                                        : "bg-red-100 text-red-700"
                                                }`}
                                            >
                                                {plan.is_active == 1
                                                    ? "Active"
                                                    : "Inactive"}
                                            </span>
                                        </Tdata>

                                        <Tdata>
                                            <span
                                                className={`px-2 py-1 rounded text-xs ${
                                                    plan.approval_status ===
                                                    "approved"
                                                        ? "bg-emerald-100 text-emerald-700"
                                                        : plan.approval_status ===
                                                            "pending_approval"
                                                          ? "bg-yellow-100 text-yellow-700"
                                                          : plan.approval_status ===
                                                              "rejected"
                                                            ? "bg-red-100 text-red-700"
                                                            : "bg-gray-100 text-gray-700"
                                                }`}
                                            >
                                                {plan.approval_status ===
                                                "pending_approval"
                                                    ? "Pending"
                                                    : plan.approval_status
                                                          .charAt(0)
                                                          .toUpperCase() +
                                                      plan.approval_status
                                                          .slice(1)
                                                          .replace("_", " ")}
                                            </span>
                                        </Tdata>

                                        <Tdata>
                                            {formatDate(plan.created_at)}
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
                                                    <DropdownMenuItem asChild>
                                                        <Link
                                                            href={route(
                                                                "fees.plans.edit",
                                                                plan.id,
                                                            )}
                                                        >
                                                            Edit
                                                        </Link>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem asChild>
                                                        <Link
                                                            href={route(
                                                                "fees.plans.items",
                                                                plan.id,
                                                            )}
                                                        >
                                                            Fee Items
                                                        </Link>
                                                    </DropdownMenuItem>
                                                    {plan.approval_status ===
                                                    "pending_approval" ? (
                                                        <>
                                                            <DropdownMenuItem
                                                                onClick={() =>
                                                                    handleApproval(
                                                                        plan.id,
                                                                        "approve",
                                                                    )
                                                                }
                                                            >
                                                                Approve
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                onClick={() =>
                                                                    handleApproval(
                                                                        plan.id,
                                                                        "reject",
                                                                    )
                                                                }
                                                            >
                                                                Reject
                                                            </DropdownMenuItem>
                                                        </>
                                                    ) : null}
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem
                                                        variant="destructive"
                                                        onClick={() =>
                                                            handleDelete(
                                                                plan.id,
                                                            )
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
                                    <Tdata
                                        colSpan="6"
                                        className="text-center py-6 text-zinc-500"
                                    >
                                        No fee plans found
                                    </Tdata>
                                </Trow>
                            )}
                        </Tbody>
                    </Table>
                </div>
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
