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

export default function StudentInvoicesIndex({ invoices }) {
    const [sortField, setSortField] = useState(invoices.sort || "created_at");
    const [sortDirection, setSortDirection] = useState(invoices.direction || "desc");
    const [searchTerm, setSearchTerm] = useState("");
    const [filters, setFilters] = useState({
        status: "",
    });

    const handleSort = (field) => {
        const direction = sortField === field && sortDirection === "asc" ? "desc" : "asc";
        setSortField(field);
        setSortDirection(direction);

        router.get(
            route("fees.student-invoices.index"),
            { sort: field, direction, page: 1, ...filters },
            { preserveState: true, replace: true }
        );
    };

    const renderArrow = (field) => {
        if (sortField !== field) return null;
        return sortDirection === "asc" ? "↑" : "↓";
    };

    const handleFilterChange = (filterName, value) => {
        const newFilters = { ...filters, [filterName]: value };
        setFilters(newFilters);

        router.get(
            route("fees.student-invoices.index"),
            {
                search: searchTerm,
                sort: sortField,
                direction: sortDirection,
                ...newFilters,
                page: 1,
            },
            { preserveState: true, replace: true }
        );
    };

    const submit = (e) => {
        e.preventDefault();
        router.get(
            route("fees.student-invoices.index"),
            {
                search: searchTerm,
                sort: sortField,
                direction: sortDirection,
                ...filters,
            },
            { preserveState: true, replace: true }
        );
    };

    const handleDelete = (id) => {
        if (!confirm("Delete this invoice?")) return;
        router.delete(route("fees.student-invoices.destroy", id), {
            preserveState: true,
            replace: true,
        });
    };

    const getStatusBadge = (status) => {
        const colors = {
            paid: "bg-green-100 text-green-800",
            partial: "bg-yellow-100 text-yellow-800",
            overpaid: "bg-blue-100 text-blue-800",
            unpaid: "bg-red-100 text-red-800",
        };

        return (
            <span className={`px-2 py-1 text-xs rounded capitalize ${colors[status] || "bg-gray-100 text-gray-800"}`}>
                {status}
            </span>
        );
    };

    return (
        <AuthenticatedLayout>
            <Head title="Student Invoices" />

            <div className="mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-2xl font-semibold text-gray-800">Student Invoices</h1>
                    <Link
                        href={route("fees.student-invoices.create")}
                        className="px-4 py-1 bg-slate-400 text-white rounded hover:bg-slate-700 inline-block"
                    >
                        Create Invoice
                    </Link>
                </div>

                <div className="flex flex-col md:flex-row gap-4 mb-4">
                    <form className="flex-1 flex gap-2" onSubmit={submit}>
                        <input
                            type="text"
                            placeholder="Search invoices, students..."
                            className="px-4 py-1 border border-gray-300 rounded w-full"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <button
                            type="submit"
                            className="px-4 py-1 bg-emerald-600 text-white rounded hover:bg-slate-700"
                        >
                            Search
                        </button>
                    </form>

                    <div className="w-full md:w-48">
                        <select
                            value={filters.status}
                            onChange={(e) => handleFilterChange("status", e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                        >
                            <option value="">All Status</option>
                            <option value="unpaid">Unpaid</option>
                            <option value="partial">Partial</option>
                            <option value="paid">Paid</option>
                            <option value="overpaid">Overpaid</option>
                        </select>
                    </div>
                </div>

                <Table
                    pagination={invoices}
                    sortField={sortField}
                    sortDirection={sortDirection}
                >
                    <Thead>
                        <THdata onClick={() => handleSort("id")} className="cursor-pointer">
                            ID {renderArrow("id")}
                        </THdata>
                        <THdata onClick={() => handleSort("student_name")} className="cursor-pointer">
                            Student {renderArrow("student_name")}
                        </THdata>
                        <THdata>Fee Model</THdata>
                        <THdata onClick={() => handleSort("gross_amount")} className="cursor-pointer text-right">
                            Gross {renderArrow("gross_amount")}
                        </THdata>
                        <THdata onClick={() => handleSort("adjusted_amount")} className="cursor-pointer text-right">
                            Adjusted {renderArrow("adjusted_amount")}
                        </THdata>
                        <THdata className="text-right">Paid</THdata>
                        <THdata className="text-right">Balance</THdata>
                        <THdata onClick={() => handleSort("due_date")} className="cursor-pointer">
                            Due Date {renderArrow("due_date")}
                        </THdata>
                        <THdata>Status</THdata>
                        <THdata>Actions</THdata>
                    </Thead>

                    <Tbody>
                        {invoices?.data?.length ? (
                            invoices.data.map((invoice) => (
                                <Trow key={invoice.id}>
                                    <Tdata>{invoice.id}</Tdata>
                                    <Tdata>
                                        <div>
                                            <div className="font-medium text-gray-900">
                                                {invoice.enrollment?.student?.user?.first_name} {invoice.enrollment?.student?.user?.last_name}
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                {invoice.enrollment?.student?.registration_number}
                                            </div>
                                        </div>
                                    </Tdata>
                                    <Tdata>{invoice.fee_model?.display_name || 'N/A'}</Tdata>
                                    <Tdata className="text-right font-mono">{Number(invoice.gross_amount).toLocaleString()}</Tdata>
                                    <Tdata className="text-right font-mono">{Number(invoice.adjusted_amount).toLocaleString()}</Tdata>
                                    <Tdata className="text-right font-mono text-emerald-600">{Number(invoice.total_paid).toLocaleString()}</Tdata>
                                    <Tdata className="text-right font-mono text-red-600">{Number(invoice.balance_remaining).toLocaleString()}</Tdata>
                                    <Tdata className="text-sm">{invoice.due_date ? formatDate(invoice.due_date) : "—"}</Tdata>
                                    <Tdata>{getStatusBadge(invoice.status)}</Tdata>
                                    <Tdata>
                                        <div className="flex justify-center gap-x-4">
                                            <Link
                                                href={route("fees.student-invoices.show", invoice.id)}
                                                className="text-blue-600 hover:text-blue-900 transition-colors"
                                            >
                                                View
                                            </Link>
                                            <Link
                                                href={route("fees.student-invoices.edit", invoice.id)}
                                                className="text-emerald-600 hover:text-emerald-900 transition-colors"
                                            >
                                                Edit
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(invoice.id)}
                                                className="text-red-600 hover:text-red-900 transition-colors"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </Tdata>
                                </Trow>
                            ))
                        ) : (
                            <Trow>
                                <Tdata colSpan="10" className="text-center py-10 text-gray-500">
                                    No invoices found.
                                </Tdata>
                            </Trow>
                        )}
                    </Tbody>
                </Table>
            </div>
        </AuthenticatedLayout>
    );
}
