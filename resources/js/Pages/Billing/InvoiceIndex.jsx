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

const formatCurrency = (amount) =>
    `Ksh ${new Intl.NumberFormat("en-KE", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(Number(amount || 0))}`;

export default function InvoiceIndex({
    invoices,
    filters: initialFilters = {},
}) {
    const [sortField, setSortField] = useState(invoices.sort || "created_at");
    const [sortDirection, setSortDirection] = useState(
        invoices.direction || "desc",
    );

    const [filters, setFilters] = useState({
        search: initialFilters.search || "",
        status: initialFilters.status || "",
        approval_status: initialFilters.approval_status || "",
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

        return sortDirection === "asc" ? "^" : "v";
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
                <div className="flex items-center justify-between">
                    <h1 className="text-lg font-semibold text-zinc-700">
                        Student Invoices
                    </h1>

                    <div className="flex gap-4">
                        <Link
                            href={route("billing.manual.index")}
                            className="rounded-lg bg-emerald-600 px-4 py-2 text-white transition hover:bg-emerald-800"
                        >
                            Manual Billing
                        </Link>
                        <Link
                            href={route("billing.ledger.index")}
                            className="rounded-lg bg-slate-600 px-4 py-2 text-white transition hover:bg-slate-800"
                        >
                            Financial Ledger
                        </Link>
                    </div>
                </div>

                <div className="rounded-lg border border-zinc-100 bg-white p-4 shadow-sm">
                    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-4">
                        <input
                            type="text"
                            value={filters.search}
                            onChange={(e) =>
                                updateFilter("search", e.target.value)
                            }
                            placeholder="Search invoices..."
                            className="w-full rounded-lg border border-zinc-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-300 md:w-72"
                        />

                        <select
                            value={filters.status}
                            onChange={(e) =>
                                updateFilter("status", e.target.value)
                            }
                            className="rounded-lg border border-zinc-200 px-3 py-2"
                        >
                            <option value="">All Status</option>
                            <option value="issued">Issued</option>
                            <option value="partial">Partial</option>
                            <option value="paid">Paid</option>
                            <option value="overdue">Overdue</option>
                            <option value="cancelled">Cancelled</option>
                        </select>

                        <select
                            value={filters.approval_status}
                            onChange={(e) =>
                                updateFilter("approval_status", e.target.value)
                            }
                            className="rounded-lg border border-zinc-200 px-3 py-2"
                        >
                            <option value="">All Approvals</option>
                            <option value="draft">Draft</option>
                            <option value="pending_approval">
                                Pending Approval
                            </option>
                            <option value="approved">Approved</option>
                            <option value="rejected">Rejected</option>
                        </select>

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
                            className="rounded-lg bg-zinc-400 px-4 py-2 text-white transition hover:bg-zinc-500"
                        >
                            Reset
                        </button>
                    </div>
                </div>

                <div className="overflow-hidden rounded-lg border border-zinc-100 bg-white shadow-sm">
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
                            <THdata className="cursor-pointer">
                                Student
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
                                invoices.data.map((invoice) => {
                                    const studentName = `${invoice.student?.user?.first_name ?? ""} ${invoice.student?.user?.last_name ?? ""}`.trim();
                                    const sessionName =
                                        invoice.enrollment?.academic_session
                                            ?.display_name ??
                                        invoice.academic_session
                                            ?.display_name ??
                                        invoice.academic_session_id ??
                                        "-";

                                    return (
                                        <Trow key={invoice.id}>
                                            <Tdata>{invoice.id}</Tdata>
                                            <Tdata>
                                                {invoice.invoice_number}
                                            </Tdata>
                                            <Tdata>
                                                {studentName || "-"}
                                                <br />
                                                <span className="text-sm text-gray-500">
                                                    {invoice.student
                                                        ?.registration_number ??
                                                        ""}
                                                </span>
                                            </Tdata>
                                            <Tdata>
                                                {invoice.display_type_label ??
                                                    "STANDARD INVOICE"}
                                            </Tdata>
                                            <Tdata>{sessionName}</Tdata>
                                            <Tdata>
                                                <span
                                                    className={`rounded px-2 py-1 text-xs ${
                                                        invoice.status ===
                                                        "paid"
                                                            ? "bg-emerald-100 text-emerald-700"
                                                            : invoice.status ===
                                                                "overdue"
                                                              ? "bg-red-100 text-red-700"
                                                              : invoice.status ===
                                                                  "issued"
                                                                ? "bg-blue-100 text-blue-700"
                                                                : invoice.status ===
                                                                    "partial"
                                                                  ? "bg-amber-100 text-amber-700"
                                                                  : "bg-gray-100 text-gray-700"
                                                    }`}
                                                >
                                                    {invoice.status
                                                        .charAt(0)
                                                        .toUpperCase() +
                                                        invoice.status.slice(1)}
                                                </span>
                                            </Tdata>
                                            <Tdata>
                                                {formatCurrency(
                                                    invoice.amount_due,
                                                )}
                                            </Tdata>
                                            <Tdata>
                                                {formatCurrency(
                                                    invoice.balance_due,
                                                )}
                                            </Tdata>
                                            <Tdata>
                                                <span
                                                    className={`rounded px-2 py-1 text-xs ${
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
                                                <div className="flex justify-center gap-2">
                                                    <Link
                                                        href={route(
                                                            "billing.invoices.show",
                                                            invoice.id,
                                                        )}
                                                        className="text-sm text-emerald-600 hover:underline"
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
                                                                className="text-sm text-green-600 hover:underline"
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
                                                                className="text-sm text-red-600 hover:underline"
                                                            >
                                                                Reject
                                                            </button>
                                                        </div>
                                                    )}

                                                    <Link
                                                        href={route(
                                                            "billing.manual.index",
                                                            {
                                                                registration_number:
                                                                    invoice
                                                                        .student
                                                                        ?.registration_number,
                                                            },
                                                        )}
                                                        className="text-sm text-blue-600 hover:underline"
                                                    >
                                                        Manual actions
                                                    </Link>
                                                </div>
                                            </Tdata>
                                        </Trow>
                                    );
                                })
                            ) : (
                                <Trow>
                                    <Tdata
                                        colSpan="11"
                                        className="py-6 text-center text-zinc-500"
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
