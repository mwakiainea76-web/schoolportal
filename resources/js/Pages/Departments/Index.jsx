import { Head, Link, router } from "@inertiajs/react";
import { useState } from "react";
import Table from "@/Components/Table/Table";
import Thead from "@/Components/Table/Thead";
import THdata from "@/Components/Table/THdata";
import Tbody from "@/Components/Table/Tbody";
import Trow from "@/Components/Table/Trow";
import Tdata from "@/Components/Table/Tdata";
import formatDate from "@/utils/date";
import SearchSelect from "@/Components/SearchSelect";
import { downloadExport } from "@/utils/exportDownload";

export default function DepartmentsIndex({ departments }) {
    const [sortField, setSortField] = useState(
        departments.sort || "created_at",
    );
    const [sortDirection, setSortDirection] = useState(
        departments.direction || "desc",
    );
    const [searchTerm, setSearchTerm] = useState("");
    const [exportFormat, setExportFormat] = useState("pdf");

    const handleSort = (field) => {
        const direction =
            sortField === field && sortDirection === "asc" ? "desc" : "asc";
        setSortField(field);
        setSortDirection(direction);
        router.get(
            route("departments.index"),
            { sort: field, direction, page: 1 },
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
            route("departments.index"),
            { search: searchTerm, sort: sortField, direction: sortDirection },
            { preserveState: true, replace: true },
        );
        setSearchTerm("");
    };

    const handleDelete = (id) => {
        if (!confirm("Are you sure you want to delete this department?")) {
            return;
        }
        router.delete(route("departments.destroy", encodeURIComponent(id)), {
            preserveState: true,
            replace: true,
        });
    };

    const handleExport = () => {
        downloadExport("departments", exportFormat, {
            search: searchTerm || departments.filters?.search || "",
            sort: sortField,
            direction: sortDirection,
        });
    };

    return (
        <>
            <Head title="Departments" />

            <div className="mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-700">

                {/* Row 1: Search form */}
                <form
                    className="w-full flex flex-wrap items-center gap-3 mb-2"
                    onSubmit={submit}
                >
                    <div className="flex-1 min-w-[200px]">
                        <SearchSelect
                            routeName="departments.search"
                            defaultOptions={departments.data}
                            placeholder="Type in department name ..."
                            onChange={(body) => setSearchTerm(body.code)}
                        />
                    </div>
                    <button
                        type="submit"
                        className="px-4 py-1.5 bg-emerald-600 text-white text-sm font-medium rounded hover:bg-slate-700 transition-colors whitespace-nowrap"
                    >
                        Search
                    </button>
                </form>

                {/* Row 2: Export group — sits right, just above the table */}
                <div className="flex justify-end ">
                    <div className="flex items-center">
                        <select
                            value={exportFormat}
                            onChange={(e) => setExportFormat(e.target.value)}
                            className="h-[34px] rounded-l border border-slate-300 border-r-0 bg-white px-3 text-sm text-slate-700 focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-inset focus:ring-gray-500"
                        >
                            <option value="pdf">PDF</option>
                            <option value="csv">CSV</option>
                            <option value="excel">Excel</option>
                        </select>
                        <button
                            type="button"
                            onClick={handleExport}
                            className="h-[34px] px-4 bg-gray-400 text-white text-sm font-medium rounded-r hover:bg-gray-600 transition-colors whitespace-nowrap"
                        >
                            Export {exportFormat.toUpperCase()}
                        </button>
                    </div>
                </div>

                {/* Table */}
                <Table
                    pagination={departments}
                    sortField={sortField}
                    sortDirection={sortDirection}
                >
                    <Thead>
                        <THdata
                            onClick={() => handleSort("code")}
                            className="cursor-pointer"
                        >
                            Code {renderArrow("code")}
                        </THdata>
                        <THdata
                            onClick={() => handleSort("name")}
                            className="cursor-pointer"
                        >
                            Name {renderArrow("name")}
                        </THdata>
                        <THdata
                            onClick={() => handleSort("created_at")}
                            className="cursor-pointer"
                        >
                            Created {renderArrow("created_at")}
                        </THdata>
                        <THdata>HOD</THdata>
                        <THdata>Actions</THdata>
                    </Thead>
                    <Tbody>
                        {departments?.data?.length ? (
                            departments.data.map((department) => (
                                <Trow key={department.id}>
                                    <Tdata>{department.code}</Tdata>
                                    <Tdata>{department.name}</Tdata>
                                    <Tdata>
                                        {formatDate(department.created_at)}
                                    </Tdata>
                                    <Tdata>
                                        {department.hod
                                            ? [
                                                  department.hod.staff_number,
                                                  department.hod.name,
                                              ]
                                                  .filter(Boolean)
                                                  .join(" - ")
                                            : "-"}
                                    </Tdata>
                                    <Tdata>
                                        <div className="flex items-center justify-center gap-x-10">
                                            <Link
                                                href={route(
                                                    "departments.edit",
                                                    encodeURIComponent(
                                                        department.id,
                                                    ),
                                                )}
                                                className="text-emerald-600 hover:underline"
                                            >
                                                Edit
                                            </Link>
                                            <button
                                                onClick={() =>
                                                    handleDelete(department.id)
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
                                <Tdata colSpan="6" className="text-center py-4">
                                    No departments found.
                                </Tdata>
                            </Trow>
                        )}
                    </Tbody>
                </Table>
            </div>
        </>
    );
}