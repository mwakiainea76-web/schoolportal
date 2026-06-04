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

// Updated prop name to match what is passed from the Controller
export default function UnitsIndex({ academic_years }) {
    // Accessing sort/direction from the paginated object meta or query params
    const [sortField, setSortField] = useState(
        academic_years.sort || "created_at",
    );
    const [sortDirection, setSortDirection] = useState(
        academic_years.direction || "desc",
    );
    const [searchTerm, setSearchTerm] = useState("");

    const handleSort = (field) => {
        const direction =
            sortField === field && sortDirection === "asc" ? "desc" : "asc";
        setSortField(field);
        setSortDirection(direction);
        router.get(
            route("academic.years.index"),
            { search: searchTerm, sort: field, direction, page: 1 },
            { preserveState: true, replace: true },
        );
    };

    const renderArrow = (field) => {
        if (sortField !== field) return null;
        return sortDirection === "asc" ? "↑" : "↓";
    };

    const submit = (e) => {
        e.preventDefault();
        router.get(
            route("academic.years.index"),
            { search: searchTerm, sort: sortField, direction: sortDirection },
            { preserveState: true, replace: true },
        );
    };

    const handleDelete = (id) => {
        if (!confirm("Are you sure you want to delete this year?")) return;
        router.delete(route("academic.years.destroy", id), {
            preserveState: true,
            replace: true,
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Academic Years" />

            <div className="max-w-6xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-700">
                <form
                    className="w-full relative flex gap-x-7"
                    onSubmit={submit}
                >
                    <input
                        type="text"
                        placeholder="Search academic years..."
                        className="w-full bg-zinc-50 border-zinc-200 rounded-xl py-2.5 pl-11 text-sm focus:ring-gray-400 transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <svg
                        className="w-4 h-4 text-zinc-400 absolute left-4 top-3"
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
                        className="px-4 py-1 bg-emerald-600 text-white rounded hover:bg-slate-700"
                        type="submit"
                    >
                        Search
                    </button>
                </form>

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
                            Academic Year {renderArrow("academic_year")}
                        </THdata>
                        <THdata>Start Date</THdata>
                        <THdata>End Date</THdata>
                        <THdata>Status</THdata>
                        <THdata
                            onClick={() => handleSort("created_at")}
                            className="cursor-pointer"
                        >
                            Created {renderArrow("created_at")}
                        </THdata>
                        <THdata>Actions</THdata>
                    </Thead>
                    <Tbody>
                        {academic_years?.data?.length ? (
                            academic_years.data.map((year) => (
                                <Trow key={year.id}>
                                    <Tdata className="font-medium text-slate-700">
                                        {year.academic_year}
                                    </Tdata>
                                    <Tdata>{formatDate(year.start_date)}</Tdata>
                                    <Tdata>{formatDate(year.end_date)}</Tdata>
                                    <Tdata>
                                        <span
                                            className={`px-2 py-0.5 rounded text-xs ${year.is_active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}
                                        >
                                            {year.is_active
                                                ? "Ongoing"
                                                : "Completed"}
                                        </span>
                                    </Tdata>
                                    <Tdata>{formatDate(year.updated_at)}</Tdata>
                                    <Tdata>
                                        <div className="flex items-center justify-center gap-x-10">
                                            <Link
                                                href={route(
                                                    "academic.years.edit",
                                                    year.id,
                                                )}
                                                className="text-emerald-600 hover:underline"
                                            >
                                                Edit
                                            </Link>
                                            <button
                                                onClick={() =>
                                                    handleDelete(year.id)
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
                                    No records found.
                                </Tdata>
                            </Trow>
                        )}
                    </Tbody>
                </Table>
            </div>
        </AuthenticatedLayout>
    );
}
