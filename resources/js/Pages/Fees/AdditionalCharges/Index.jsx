import { Head, Link, router } from "@inertiajs/react";
import { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

import Table from "@/Components/Table/Table";
import Thead from "@/Components/Table/Thead";
import THdata from "@/Components/Table/THdata";
import Tbody from "@/Components/Table/Tbody";
import Trow from "@/Components/Table/Trow";
import Tdata from "@/Components/Table/Tdata";

import SearchSelect from "@/Components/SearchSelect";
import formatDate from "@/utils/date";

export default function AdditionalChargesIndex({
    additionalCharges,
    feeModels,
}) {
    const [sortField, setSortField] = useState(
        additionalCharges.sort || "created_at",
    );
    const [sortDirection, setSortDirection] = useState(
        additionalCharges.direction || "desc",
    );
    const [searchTerm, setSearchTerm] = useState("");
    const [filters, setFilters] = useState({
        frequency: "",
        fee_model: "",
        min_amount: "",
        max_amount: "",
    });

    const handleSort = (field) => {
        const direction =
            sortField === field && sortDirection === "asc" ? "desc" : "asc";

        setSortField(field);
        setSortDirection(direction);

        router.get(
            route("fees.additional-charges.index"),
            { sort: field, direction, page: 1, ...filters },
            { preserveState: true, replace: true },
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
            route("fees.additional-charges.index"),
            {
                search: searchTerm,
                sort: sortField,
                direction: sortDirection,
                ...newFilters,
                page: 1,
            },
            { preserveState: true, replace: true },
        );
    };

    const submit = (e) => {
        e.preventDefault();

        router.get(
            route("fees.additional-charges.index"),
            {
                search: searchTerm,
                sort: sortField,
                direction: sortDirection,
                ...filters,
            },
            { preserveState: true, replace: true },
        );

        setSearchTerm("");
    };

    const handleDelete = (id) => {
        if (!confirm("Delete this additional charge?")) return;

        router.delete(route("fees.additional-charges.destroy", id), {
            preserveState: true,
            replace: true,
        });
    };

    const getFrequencyBadge = (frequency) => {
        const colors = {
            admission: "bg-blue-100 text-blue-800",
            session: "bg-green-100 text-green-800",
            year: "bg-purple-100 text-purple-800",
        };

        return (
            <span
                className={`px-2 py-1 text-xs rounded capitalize ${colors[frequency] || "bg-gray-100 text-gray-800"}`}
            >
                {frequency}
            </span>
        );
    };

    return (
        <AuthenticatedLayout>
            <Head title="Additional Charges" />

            <div className="mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-700">
                {/* CREATE */}
                <Link
                    href={route("fees.additional-charges.create")}
                    className="mb-4 px-4 py-1 bg-slate-400 text-white rounded hover:bg-slate-700 inline-block"
                >
                    Add Additional Charge
                </Link>

                {/* SEARCH */}
                <form className="w-full flex gap-x-6 mb-4" onSubmit={submit}>
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search additional charges..."
                        className="flex-1 px-3 py-2 border border-gray-300 rounded"
                    />

                    <button
                        type="submit"
                        className="px-4 py-1 bg-emerald-600 text-white rounded hover:bg-slate-700"
                    >
                        Search
                    </button>
                </form>

                {/* FILTERS */}
                <div className="mb-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                    <select
                        value={filters.frequency}
                        onChange={(e) =>
                            handleFilterChange("frequency", e.target.value)
                        }
                        className="px-3 py-2 border border-gray-300 rounded text-sm"
                    >
                        <option value="">All Frequencies</option>
                        <option value="admission">Admission</option>
                        <option value="session">Session</option>
                        <option value="year">Year</option>
                    </select>

                    <select
                        value={filters.fee_model}
                        onChange={(e) =>
                            handleFilterChange("fee_model", e.target.value)
                        }
                        className="px-3 py-2 border border-gray-300 rounded text-sm"
                    >
                        <option value="">All Fee Models</option>
                        {feeModels.map((model) => (
                            <option key={model.id} value={model.id}>
                                {model.name}
                            </option>
                        ))}
                    </select>

                    <input
                        type="number"
                        value={filters.min_amount}
                        onChange={(e) =>
                            handleFilterChange("min_amount", e.target.value)
                        }
                        placeholder="Min Amount"
                        className="px-3 py-2 border border-gray-300 rounded text-sm"
                    />

                    <input
                        type="number"
                        value={filters.max_amount}
                        onChange={(e) =>
                            handleFilterChange("max_amount", e.target.value)
                        }
                        placeholder="Max Amount"
                        className="px-3 py-2 border border-gray-300 rounded text-sm"
                    />
                </div>

                {/* TABLE */}
                <Table
                    pagination={additionalCharges}
                    sortField={sortField}
                    sortDirection={sortDirection}
                >
                    <Thead>
                        <THdata
                            onClick={() => handleSort("id")}
                            className="cursor-pointer"
                        >
                            ID {renderArrow("id")}
                        </THdata>

                        <THdata
                            onClick={() => handleSort("name")}
                            className="cursor-pointer"
                        >
                            Name {renderArrow("name")}
                        </THdata>

                        <THdata>Fee Model</THdata>

                        <THdata
                            onClick={() => handleSort("amount")}
                            className="cursor-pointer"
                        >
                            Amount {renderArrow("amount")}
                        </THdata>

                        <THdata
                            onClick={() => handleSort("frequency")}
                            className="cursor-pointer"
                        >
                            Frequency {renderArrow("frequency")}
                        </THdata>

                        <THdata>Description</THdata>

                        <THdata
                            onClick={() => handleSort("created_at")}
                            className="cursor-pointer"
                        >
                            Created {renderArrow("created_at")}
                        </THdata>

                        <THdata>Actions</THdata>
                    </Thead>

                    <Tbody>
                        {additionalCharges?.data?.length ? (
                            additionalCharges.data.map((charge) => (
                                <Trow key={charge.id}>
                                    <Tdata>{charge.id}</Tdata>

                                    <Tdata>
                                        <div>
                                            <div className="font-medium">
                                                {charge.name}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                {charge.display_name}
                                            </div>
                                        </div>
                                    </Tdata>

                                    <Tdata>
                                        {charge.fee_model?.display_name || "—"}
                                    </Tdata>

                                    <Tdata>
                                        ₦
                                        {parseFloat(
                                            charge.amount,
                                        ).toLocaleString()}
                                    </Tdata>

                                    <Tdata>
                                        {getFrequencyBadge(charge.frequency)}
                                    </Tdata>

                                    <Tdata>
                                        <div className="max-w-xs truncate">
                                            {charge.description}
                                        </div>
                                    </Tdata>

                                    <Tdata>
                                        {formatDate(charge.created_at)}
                                    </Tdata>

                                    <Tdata>
                                        <div className="flex justify-center gap-x-6">
                                            <Link
                                                href={route(
                                                    "fees.additional-charges.edit",
                                                    encodeURIComponent(
                                                        charge.id,
                                                    ),
                                                )}
                                                className="text-emerald-600 hover:underline"
                                            >
                                                Edit
                                            </Link>

                                            <button
                                                onClick={() =>
                                                    handleDelete(
                                                        encodeURIComponent(
                                                            charge.id,
                                                        ),
                                                    )
                                                }
                                                className="text-red-600 hover:underline"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </Tdata>
                                </Trow>
                            ))
                        ) : (
                            <Trow>
                                <Tdata colSpan="8" className="text-center py-4">
                                    No additional charges found.
                                </Tdata>
                            </Trow>
                        )}
                    </Tbody>
                </Table>
            </div>
        </AuthenticatedLayout>
    );
}
