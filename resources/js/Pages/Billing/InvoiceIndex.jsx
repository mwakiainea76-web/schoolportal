import { Head, Link, router } from "@inertiajs/react";
import { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

import Table from "@/Components/Table/Table";
import Thead from "@/Components/Table/Thead";
import THdata from "@/Components/Table/THdata";
import Tbody from "@/Components/Table/Tbody";
import Trow from "@/Components/Table/Trow";
import Tdata from "@/Components/Table/Tdata";

import formatDate from "@/utils/date";

export default function InvoiceIndex({ invoices }) {
    const [sortField, setSortField] = useState(invoices.sort || "created_at");
    const [sortDirection, setSortDirection] = useState(
        invoices.direction || "desc",
    );

    const [filters, setFilters] = useState({
        search: invoices.search || "",
        status: invoices.status || "",
        approval_status: invoices.approval_status || "",
    });

    const applyFilters = (extra = {}) => {
        router.get(
            route("billing.invoices.index"),
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
        if (!confirm("Delete this invoice?")) return;

        router.delete(route("billing.invoices.destroy", id), {
            preserveState: true,
            replace: true,
        });
    };

    const handleApproval = (id, action) => {
        const actionText = action === "approve" ? "approve" : "reject";
        const confirmMessage = `Are you sure you want to ${actionText} this invoice write-off?`;

        if (!confirm(confirmMessage)) return;

        router.post(
            route("billing.invoices.approval", { invoice: id, action }),
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
        <AuthenticatedLayout>
            <Head title="Student Invoices" />

            <div className="mx-auto w-full space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                {/* HEADER ACTION BAR */}
                <div className="flex justify-between items-center">
                    <h1 className="text-lg font-semibold text-zinc-700">
                        Student Invoices
                    </h1>

                    <div className="flex gap-4">
                        <Link
                            href={route("billing.bulk.operations")}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-800 transition"
                        >
                            Bulk Generate
                        </Link>
                        <Link
                            href={route("billing.invoices.create")}
                            className="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-800 transition"
                        >
                            + New Invoice
                        </Link>
                    </div>
                </div>

                {/* FILTER BAR */}
                <div className="bg-white border border-zinc-100 rounded-lg shadow-sm p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
                        {/* SEARCH */}
                        <input
                            type="text"
                            value={filters.search}
                            onChange={(e) =>
                                updateFilter("search", e.target.value)
                            }
                            placeholder="Search invoices..."
                            className="border border-zinc-200 px-3 py-2 rounded-lg w-full md:w-72 focus:outline-none focus:ring-2 focus:ring-slate-300"
                        />

                        {/* STATUS */}
                        <select
                            value={filters.status}
                            onChange={(e) =>
                                updateFilter("status", e.target.value)
                            }
                            className="border border-zinc-200 px-3 py-2 rounded-lg"
                        >
                            <option value="">All Status</option>
                            <option value="issued">Issued</option>
                            <option value="paid">Paid</option>
                            <option value="overdue">Overdue</option>
                            <option value="cancelled">Cancelled</option>
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
                                    status: "",
                                    approval_status: "",
                                };
                                setFilters(reset);
                                router.get(route("billing.invoices.index"));
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
                        pagination={invoices}
                        sortField={sortField}
                        sortDirection={sortDirection}
                    >
                        <Thead>
                            <THdata>ID</THdata>

                            <THdata
                                onClick={() => handleSort("invoice_number")}
                                className="cursor-pointer"
                            >
                                Invoice # {renderArrow("invoice_number")}
                            </THdata>

                            <THdata
                                onClick={() =>
                                    handleSort("student.registration_number")
                                }
                                className="cursor-pointer"
                            >
                                Student{" "}
                                {renderArrow("student.registration_number")}
                            </THdata>

                            <THdata>Type</THdata>

                            <THdata>Session</THdata>

                            <THdata
                                onClick={() => handleSort("status")}
                                className="cursor-pointer"
                            >
                                Status {renderArrow("status")}
                            </THdata>

                            <THdata
                                onClick={() => handleSort("amount_due")}
                                className="cursor-pointer"
                            >
                                Amount Due {renderArrow("amount_due")}
                            </THdata>

                            <THdata
                                onClick={() => handleSort("balance_due")}
                                className="cursor-pointer"
                            >
                                Balance {renderArrow("balance_due")}
                            </THdata>

                            <THdata
                                onClick={() => handleSort("approval_status")}
                                className="cursor-pointer"
                            >
                                Approval {renderArrow("approval_status")}
                            </THdata>

                            <THdata
                                onClick={() => handleSort("due_date")}
                                className="cursor-pointer"
                            >
                                Due Date {renderArrow("due_date")}
                            </THdata>

                            <THdata>Actions</THdata>
                        </Thead>

                        <Tbody>
                            {invoices?.data?.length ? (
                                invoices.data.map((invoice) => (
                                    <Trow key={invoice.id}>
                                        <Tdata>{invoice.id}</Tdata>
                                        <Tdata>{invoice.invoice_number}</Tdata>
                                        <Tdata>
                                            {invoice.student?.id ?? "—"}
                                            <br />
                                            <span className="text-sm text-gray-500">
                                                {invoice.student
                                                    ?.registration_number ?? ""}
                                            </span>
                                        </Tdata>
                                        <Tdata>
                                            {invoice.invoice_type ===
                                            "default_fees"
                                                ? "Default Fees"
                                                : invoice.invoice_type ===
                                                    "penalty"
                                                  ? "Penalty"
                                                  : "Fees"}
                                        </Tdata>
                                        <Tdata>
                                            {invoice.enrollment
                                                ?.academic_session?.id ??
                                                invoice.academic_session_id ??
                                                "—"}
                                        </Tdata>
                                        <Tdata>
                                            <span
                                                className={`px-2 py-1 rounded text-xs ${
                                                    invoice.status === "paid"
                                                        ? "bg-emerald-100 text-emerald-700"
                                                        : invoice.status ===
                                                            "overdue"
                                                          ? "bg-red-100 text-red-700"
                                                          : invoice.status ===
                                                              "issued"
                                                            ? "bg-blue-100 text-blue-700"
                                                            : "bg-gray-100 text-gray-700"
                                                }`}
                                            >
                                                {invoice.status
                                                    .charAt(0)
                                                    .toUpperCase() +
                                                    invoice.status.slice(1)}
                                            </span>
                                        </Tdata>
                                        <Tdata>${invoice.amount_due}</Tdata>
                                        <Tdata>${invoice.balance_due}</Tdata>

                                        <Tdata>
                                            <span
                                                className={`px-2 py-1 rounded text-xs ${
                                                    invoice.approval_status ===
                                                    "approved"
                                                        ? "bg-emerald-100 text-emerald-700"
                                                        : invoice.approval_status ===
                                                            "pending_approval"
                                                          ? "bg-yellow-100 text-yellow-700"
                                                          : invoice.approval_status ===
                                                              "rejected"
                                                            ? "bg-red-100 text-red-700"
                                                            : "bg-gray-100 text-gray-700"
                                                }`}
                                            >
                                                {invoice.approval_status ===
                                                "pending_approval"
                                                    ? "Pending"
                                                    : invoice.approval_status
                                                          .charAt(0)
                                                          .toUpperCase() +
                                                      invoice.approval_status
                                                          .slice(1)
                                                          .replace("_", " ")}
                                            </span>
                                        </Tdata>

                                        <Tdata>
                                            {formatDate(invoice.due_date)}
                                        </Tdata>

                                        <Tdata>
                                            <div className="flex gap-2 justify-center">
                                                <Link
                                                    href={route(
                                                        "billing.invoices.show",
                                                        invoice.id,
                                                    )}
                                                    className="text-emerald-600 hover:underline text-sm"
                                                >
                                                    View
                                                </Link>

                                                {invoice.approval_status ===
                                                    "pending_approval" && (
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() =>
                                                                handleApproval(
                                                                    invoice.id,
                                                                    "approve",
                                                                )
                                                            }
                                                            className="text-green-600 hover:underline text-sm"
                                                        >
                                                            Approve
                                                        </button>
                                                        <button
                                                            onClick={() =>
                                                                handleApproval(
                                                                    invoice.id,
                                                                    "reject",
                                                                )
                                                            }
                                                            className="text-red-600 hover:underline text-sm"
                                                        >
                                                            Reject
                                                        </button>
                                                    </div>
                                                )}

                                                <Link
                                                    href={route(
                                                        "billing.payments.create",
                                                        invoice.id,
                                                    )}
                                                    className="text-blue-600 hover:underline text-sm"
                                                >
                                                    Record Payment
                                                </Link>
                                            </div>
                                        </Tdata>
                                    </Trow>
                                ))
                            ) : (
                                <Trow>
                                    <Tdata
                                        colSpan="8"
                                        className="text-center py-6 text-zinc-500"
                                    >
                                        No invoices found
                                    </Tdata>
                                </Trow>
                            )}
                        </Tbody>
                    </Table>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
