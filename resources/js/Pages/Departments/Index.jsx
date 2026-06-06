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
import SearchSelect from "@/Components/SearchSelect";
import DepartmentWorkspaceTabs from "@/Pages/Departments/Partials/DepartmentWorkspaceTabs";

export default function DepartmentsIndex({ departments }) {
    const [sortField, setSortField] = useState(
        departments.sort || "created_at",
    );
    const [sortDirection, setSortDirection] = useState(
        departments.direction || "desc",
    );
    const [searchTerm, setSearchTerm] = useState("");

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
        if (!confirm("Are you sure you want to delete this department?"))
            return;
        router.delete(route("departments.destroy", encodeURIComponent(id)), {
            preserveState: true,
            replace: true,
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Departments" />

            <div className=" mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="mb-6">
                    <DepartmentWorkspaceTabs activeTab="departments" />
                </div>
                <form
                    className="w-full relative flex gap-x-7"
                    onSubmit={submit}
                >
                    <SearchSelect
                        routeName="departments.search"
                        defaultOptions={departments.data}
                        placeholder="Type in  department name  ..."
                        onChange={(body) => setSearchTerm(body.code)}
                    />
                    <button
                        className="px-4 py-1 bg-emerald-600 text-white rounded hover:bg-slate-700"
                        type="submit"
                    >
                        Search
                    </button>
                </form>

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
                                            ? [department.hod.staff_number, department.hod.name]
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
        </AuthenticatedLayout>
    );
}
