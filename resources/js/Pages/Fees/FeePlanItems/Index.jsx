import React, { useState } from "react";
import { Head, router } from "@inertiajs/react";
import { MoreHorizontalIcon } from "lucide-react";
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
import SearchSelect from "@/Components/SearchSelect";
import Modal from "@/Components/Modal";
import EditModal from "./EditModal";

export default function Index({
    feePlans,
    sort,
    direction,
    feePlanOptions,
    feePlan,
}) {
    const [sortField, setSortField] = useState(sort || "created_at");
    const [sortDirection, setSortDirection] = useState(direction || "desc");

    const [search, setSearch] = useState("");
    const [editingItem, setEditingItem] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);

    const handleSort = (field) => {
        const dir =
            sortField === field && sortDirection === "asc" ? "desc" : "asc";

        setSortField(field);
        setSortDirection(dir);

        router.get(route("fees.plans.items.index"), {
            sort: field,
            direction: dir,
        });
    };

    const submitSearch = (e) => {
        e.preventDefault();

        router.get(route("fees.plans.items.index"), {
            search,
            sort: sortField,
            direction: sortDirection,
        });
    };

    const deleteItem = (id) => {
        if (!confirm("Delete this item?")) return;

        router.delete(route("fees.plans.items.destroy", id));
    };

    const openEditModal = (item) => {
        setEditingItem(item);
        setShowEditModal(true);
    };

    // Calculate total amount of all fee items
    const totalAmount = feePlans?.data
        ? feePlans.data.reduce(
              (sum, item) => sum + parseFloat(item.amount || 0),
              0,
          )
        : feePlans?.length
          ? feePlans.reduce(
                (sum, item) => sum + parseFloat(item.amount || 0),
                0,
            )
          : 0;

    return (
        <>
            <Head title="Fee Plan Items" />
            <div className="mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-700">
                {/* Fee Plan Header (when viewing items for a specific fee plan) */}
                {feePlan && (
                    <div className="mb-6 p-4 bg-white border border-zinc-100 shadow-sm rounded-lg">
                        <h2 className="text-lg font-semibold text-zinc-800">
                            Fee Plan: {feePlan.name}
                        </h2>
                        <p className="text-sm text-zinc-500 mt-1">
                            Total Items:{" "}
                            {feePlans?.data
                                ? feePlans.data.length
                                : feePlans?.length || 0}{" "}
                            | Total Amount: Ksh {totalAmount.toFixed(2)}
                        </p>
                    </div>
                )}

                {/* HEADER (Add button) */}

                <form
                    className="w-full relative flex gap-x-7 align-content-center text-center"
                    onSubmit={submitSearch}
                >
                    <div className="flex-1">
                        <SearchSelect
                            //routeName="fee-plans.search"
                            // defaultOptions={feePlans}
                            placeholder="Search fee plan..."
                            // value={data.fee_plan_id}
                            //  onChange={(plan) => setData("fee_plan_id", plan.id)}
                            // error={errors.fee_plan_id}
                        />
                    </div>
                    <button
                        className="px-4 py-1 bg-emerald-600 text-white rounded hover:bg-slate-700"
                        type="submit"
                    >
                        Search
                    </button>
                </form>

                {/* TABLE */}
                <Table
                    pagination={feePlans}
                    sortField={sortField}
                    sortDirection={sortDirection}
                >
                    <Thead>
                        <THdata>#</THdata>
                        <THdata
                            onClick={() => handleSort("name")}
                            className="cursor-pointer"
                        >
                            Fee component name
                        </THdata>
                        <THdata
                            onClick={() => handleSort("amount")}
                            className="cursor-pointer"
                        >
                            Amount
                        </THdata>
                        <THdata>Actions</THdata>
                    </Thead>
                    <Tbody>
                        {feePlans?.data?.length || feePlans?.length ? (
                            (feePlans?.data || feePlans).map(
                                (feePlanItem, index) => (
                                    <Trow key={feePlanItem.id}>
                                        <Tdata>{index + 1}</Tdata>
                                        <Tdata>{feePlanItem?.name}</Tdata>
                                        <Tdata>{feePlanItem.amount}</Tdata>
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
                                                    <DropdownMenuItem
                                                        onClick={() =>
                                                            openEditModal(
                                                                feePlanItem,
                                                            )
                                                        }
                                                    >
                                                        Edit
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem
                                                        variant="destructive"
                                                        onClick={() =>
                                                            deleteItem(
                                                                feePlanItem.id,
                                                            )
                                                        }
                                                    >
                                                        Delete
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </Tdata>
                                    </Trow>
                                ),
                            )
                        ) : (
                            <Trow>
                                <Tdata
                                    colSpan="6"
                                    className="text-center py-4 text-zinc-500"
                                >
                                    No fee plan items found
                                </Tdata>
                            </Trow>
                        )}
                    </Tbody>
                </Table>
            </div>

            {/* Edit Modal */}
            {showEditModal && editingItem && (
                <Modal
                    show={showEditModal}
                    onClose={() => setShowEditModal(false)}
                    align="top"
                >
                    <EditModal
                        item={editingItem}
                        feePlanOptions={feePlanOptions}
                        setShowModal={setShowEditModal}
                    />
                </Modal>
            )}
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
