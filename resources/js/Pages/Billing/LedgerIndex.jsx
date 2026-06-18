import { Head, router } from "@inertiajs/react";
import { useState } from "react";
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

    const currentQuery = (extra = {}) => ({
        ...localFilters,
        sort: sortField,
        direction: sortDirection,
        ...extra,
    });

    const applyFilters = (extra = {}) => {
        router.get(
            route("billing.ledger.index"),
            currentQuery(extra),
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

    const setFilter = (key, value) => {
        setLocalFilters((current) => ({ ...current, [key]: value }));
    };

    const submit = (event) => {
        event.preventDefault();
        applyFilters({ page: 1 });
    };

    const resetFilters = () => {
        const reset = {
            search: "",
            type: "",
            academic_session_id: "",
        };

        setLocalFilters(reset);
        router.get(
            route("billing.ledger.index"),
            { sort: sortField, direction: sortDirection, page: 1 },
            { preserveState: true, replace: true },
        );
    };

    return (
        <>
            <Head title="Financial Ledger" />

            <div className="mx-auto w-full space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-lg font-semibold text-zinc-700">
                            Financial Ledger
                        </h1>
                        <p className="mt-1 text-sm text-zinc-500">
                            Core transaction history for invoices, payments,
                            discounts, penalties, and reversals.
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

                <form
                    className="mb-2 flex w-full flex-wrap items-center gap-3"
                    onSubmit={submit}
                >
                    <div className="min-w-[220px] flex-1">
                        <input
                            type="text"
                            value={localFilters.search}
                            onChange={(e) =>
                                setFilter("search", e.target.value)
                            }
                            placeholder="Search reference, invoice, student..."
                            className="h-[34px] w-full rounded border border-slate-300 px-3 text-sm text-slate-700 focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-inset focus:ring-gray-500"
                        />
                    </div>

                    <div className="min-w-[160px]">
                        <select
                            value={localFilters.type}
                            onChange={(e) =>
                                setFilter("type", e.target.value)
                            }
                            className="h-[34px] w-full rounded border border-slate-300 bg-white px-3 text-sm text-slate-700 focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-inset focus:ring-gray-500"
                        >
                            <option value="">All Types</option>
                            {types.map((type) => (
                                <option key={type} value={type}>
                                    {type.charAt(0).toUpperCase() + type.slice(1)}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="min-w-[220px]">
                        <select
                            value={localFilters.academic_session_id}
                            onChange={(e) =>
                                setFilter(
                                    "academic_session_id",
                                    e.target.value,
                                )
                            }
                            className="h-[34px] w-full rounded border border-slate-300 bg-white px-3 text-sm text-slate-700 focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-inset focus:ring-gray-500"
                        >
                            <option value="">All Sessions</option>
                            {sessions.map((session) => (
                                <option key={session.id} value={session.id}>
                                    {session.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <button
                        type="submit"
                        className="h-[34px] rounded bg-emerald-600 px-4 text-sm font-medium text-white transition-colors hover:bg-slate-700"
                    >
                        Search
                    </button>

                    <button
                        type="button"
                        onClick={resetFilters}
                        className="h-[34px] rounded bg-zinc-500 px-4 text-sm font-medium text-white transition-colors hover:bg-zinc-600"
                    >
                        Reset
                    </button>
                </form>

                <div className="overflow-hidden rounded-2xl border border-zinc-100 bg-white shadow-sm">
                    <Table
                        pagination={transactions}
                        sortField={sortField}
                        sortDirection={sortDirection}
                    >
                        <Thead>
                            <THdata
                                onClick={() => handleSort("transaction_date")}
                                className="cursor-pointer"
                            >
                                Date {renderArrow("transaction_date")}
                            </THdata>
                            <THdata>Student</THdata>
                            <THdata
                                onClick={() => handleSort("type")}
                                className="cursor-pointer"
                            >
                                Type {renderArrow("type")}
                            </THdata>
                            <THdata>Reference</THdata>
                            <THdata>Session</THdata>
                            <THdata
                                onClick={() => handleSort("debit")}
                                className="cursor-pointer"
                            >
                                Debit {renderArrow("debit")}
                            </THdata>
                            <THdata
                                onClick={() => handleSort("credit")}
                                className="cursor-pointer"
                            >
                                Credit {renderArrow("credit")}
                            </THdata>
                            <THdata>Description</THdata>
                            <THdata>Recorded By</THdata>
                        </Thead>

                        <Tbody>
                            {transactions?.data?.length ? (
                                transactions.data.map((transaction) => (
                                    <Trow key={transaction.id}>
                                        <Tdata>
                                            {formatDate(
                                                transaction.transaction_date,
                                            )}
                                        </Tdata>
                                        <Tdata>
                                            {transaction.student || "-"}
                                            <br />
                                            <span className="text-xs text-zinc-500">
                                                {transaction.admission_number ||
                                                    ""}
                                            </span>
                                        </Tdata>
                                        <Tdata>
                                            <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold capitalize text-slate-700">
                                                {transaction.type}
                                            </span>
                                        </Tdata>
                                        <Tdata>{transaction.reference || "-"}</Tdata>
                                        <Tdata>{transaction.session || "-"}</Tdata>
                                        <Tdata className="font-medium text-red-600">
                                            {transaction.debit
                                                ? currency(transaction.debit)
                                                : "-"}
                                        </Tdata>
                                        <Tdata className="font-medium text-emerald-600">
                                            {transaction.credit
                                                ? currency(transaction.credit)
                                                : "-"}
                                        </Tdata>
                                        <Tdata>{transaction.description || "-"}</Tdata>
                                        <Tdata>{transaction.created_by || "-"}</Tdata>
                                    </Trow>
                                ))
                            ) : (
                                <Trow>
                                    <Tdata
                                        colSpan="9"
                                        className="py-8 text-center text-zinc-500"
                                    >
                                        No ledger transactions found.
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
