import { Head, router } from "@inertiajs/react";
import { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import Table from "@/Components/Table/Table";
import Thead from "@/Components/Table/Thead";
import THdata from "@/Components/Table/THdata";
import Tbody from "@/Components/Table/Tbody";
import Trow from "@/Components/Table/Trow";
import Tdata from "@/Components/Table/Tdata";

const currency = (amount) =>
    `Ksh ${new Intl.NumberFormat("en-KE", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(Number(amount || 0))}`;

export default function LedgerIndex({
    transactions,
    filters,
    types,
    sessions,
    summary,
}) {
    const [sortField, setSortField] = useState(
        transactions.sort || "transaction_date",
    );
    const [sortDirection, setSortDirection] = useState(
        transactions.direction || "desc",
    );
    const [localFilters, setLocalFilters] = useState({
        search: filters.search || "",
        type: filters.type || "",
        academic_session_id: filters.academic_session_id || "",
    });

    const applyFilters = (extra = {}) => {
        router.get(
            route("billing.ledger.index"),
            {
                ...localFilters,
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

    const updateFilter = (key, value) => {
        const updated = { ...localFilters, [key]: value };
        setLocalFilters(updated);
        applyFilters({ [key]: value });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Financial Ledger" />

            <div className="mx-auto w-full space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-lg font-semibold text-zinc-700">
                            Financial Ledger
                        </h1>
                        <p className="mt-1 text-sm text-zinc-500">
                            Core transaction history for invoices, payments, discounts, penalties, and reversals.
                        </p>
                    </div>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                    <div className="rounded-2xl border border-zinc-100 bg-white p-5 shadow-sm">
                        <p className="text-sm text-zinc-500">Total Debits</p>
                        <p className="mt-2 text-2xl font-bold text-zinc-900">
                            {currency(summary.debit_total)}
                        </p>
                    </div>
                    <div className="rounded-2xl border border-zinc-100 bg-white p-5 shadow-sm">
                        <p className="text-sm text-zinc-500">Total Credits</p>
                        <p className="mt-2 text-2xl font-bold text-zinc-900">
                            {currency(summary.credit_total)}
                        </p>
                    </div>
                    <div className="rounded-2xl border border-zinc-100 bg-white p-5 shadow-sm">
                        <p className="text-sm text-zinc-500">Net Movement</p>
                        <p className="mt-2 text-2xl font-bold text-zinc-900">
                            {currency(summary.net_total)}
                        </p>
                    </div>
                </div>

                <div className="rounded-2xl border border-zinc-100 bg-white p-4 shadow-sm">
                    <div className="grid gap-4 md:grid-cols-4">
                        <input
                            type="text"
                            value={localFilters.search}
                            onChange={(e) =>
                                updateFilter("search", e.target.value)
                            }
                            placeholder="Search reference, invoice, student..."
                            className="rounded-xl border border-zinc-200 px-3 py-2"
                        />

                        <select
                            value={localFilters.type}
                            onChange={(e) =>
                                updateFilter("type", e.target.value)
                            }
                            className="rounded-xl border border-zinc-200 px-3 py-2"
                        >
                            <option value="">All Types</option>
                            {types.map((type) => (
                                <option key={type} value={type}>
                                    {type.charAt(0).toUpperCase() + type.slice(1)}
                                </option>
                            ))}
                        </select>

                        <select
                            value={localFilters.academic_session_id}
                            onChange={(e) =>
                                updateFilter(
                                    "academic_session_id",
                                    e.target.value,
                                )
                            }
                            className="rounded-xl border border-zinc-200 px-3 py-2"
                        >
                            <option value="">All Sessions</option>
                            {sessions.map((session) => (
                                <option key={session.id} value={session.id}>
                                    {session.name}
                                </option>
                            ))}
                        </select>

                        <button
                            onClick={() => {
                                const reset = {
                                    search: "",
                                    type: "",
                                    academic_session_id: "",
                                };
                                setLocalFilters(reset);
                                router.get(route("billing.ledger.index"));
                            }}
                            className="rounded-xl bg-zinc-500 px-4 py-2 text-white transition hover:bg-zinc-600"
                        >
                            Reset
                        </button>
                    </div>
                </div>

                <div className="overflow-hidden rounded-2xl border border-zinc-100 bg-white shadow-sm">
                    <Table
                        pagination={transactions}
                        sortField={sortField}
                        sortDirection={sortDirection}
                    >
                        <Thead>
                            <THdata onClick={() => handleSort("transaction_date")} className="cursor-pointer">
                                Date {renderArrow("transaction_date")}
                            </THdata>
                            <THdata>Student</THdata>
                            <THdata onClick={() => handleSort("type")} className="cursor-pointer">
                                Type {renderArrow("type")}
                            </THdata>
                            <THdata>Reference</THdata>
                            <THdata>Session</THdata>
                            <THdata onClick={() => handleSort("debit")} className="cursor-pointer">
                                Debit {renderArrow("debit")}
                            </THdata>
                            <THdata onClick={() => handleSort("credit")} className="cursor-pointer">
                                Credit {renderArrow("credit")}
                            </THdata>
                            <THdata>Description</THdata>
                            <THdata>Recorded By</THdata>
                        </Thead>

                        <Tbody>
                            {transactions?.data?.length ? (
                                transactions.data.map((transaction) => (
                                    <Trow key={transaction.id}>
                                        <Tdata>{transaction.transaction_date ?? "—"}</Tdata>
                                        <Tdata>
                                            {transaction.student || "—"}
                                            <br />
                                            <span className="text-xs text-zinc-500">
                                                {transaction.registration_number || ""}
                                            </span>
                                        </Tdata>
                                        <Tdata>
                                            <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold capitalize text-slate-700">
                                                {transaction.type}
                                            </span>
                                        </Tdata>
                                        <Tdata>{transaction.reference || "—"}</Tdata>
                                        <Tdata>{transaction.session || "—"}</Tdata>
                                        <Tdata className="font-medium text-red-600">
                                            {transaction.debit
                                                ? currency(transaction.debit)
                                                : "—"}
                                        </Tdata>
                                        <Tdata className="font-medium text-emerald-600">
                                            {transaction.credit
                                                ? currency(transaction.credit)
                                                : "—"}
                                        </Tdata>
                                        <Tdata>{transaction.description || "—"}</Tdata>
                                        <Tdata>{transaction.created_by || "—"}</Tdata>
                                    </Trow>
                                ))
                            ) : (
                                <Trow>
                                    <Tdata colSpan="9" className="py-8 text-center text-zinc-500">
                                        No ledger transactions found.
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
