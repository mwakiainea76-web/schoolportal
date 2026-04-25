import React from "react";
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
export default function curriculumIndex({ curriculum }) {
    const [sortField, setSortField] = useState(curriculum.sort || "created_at");
    const [sortDirection, setSortDirection] = useState(
        curriculum.direction || "desc",
    );
    const [searchTerm, setSearchTerm] = useState("");

    const handleSort = (field) => {
        const direction =
            sortField === field && sortDirection === "asc" ? "desc" : "asc";
        setSortField(field);
        setSortDirection(direction);
        router.get(
            route("curriculum.index"),
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
            route("courses.curriculum.index"),
            { search: searchTerm, sort: sortField, direction: sortDirection },
            { preserveState: true, replace: true },
        );
        setSearchTerm("");
    };

    const handleDelete = (id) => {
        if (!confirm("Are you sure you want to delete this batch?")) return;
        router.delete(
            route("courses.curriculum.destroy", encodeURIComponent(id)),
            {
                preserveState: true,
                replace: true,
            },
        );
    };

    return (
        <AuthenticatedLayout>
            <Head title="curriculum" />

            <div className="max-w-6xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-700">
                <Link
                    className="mb-4 px-4 py-1 bg-slate-400 text-white rounded hover:bg-slate-700 inline-block"
                    href={route("courses.curriculum.create")}
                >
                    Add Curriculum
                </Link>

                <form
                    className="w-full relative flex gap-x-7"
                    onSubmit={submit}
                >
                    <SearchSelect
                        routeName="courses.search"
                        defaultOptions={curriculum.data}
                        placeholder="Type in course name ..."
                        onChange={(body) => setSearchTerm(body.name)}
                    />
                    <button
                        className="px-4 py-1 bg-emerald-600 text-white rounded hover:bg-slate-700"
                        type="submit"
                    >
                        Search
                    </button>
                </form>

                <Table
                    pagination={curriculum}
                    sortField={sortField}
                    sortDirection={sortDirection}
                >
                    <Thead>
                        <THdata
                            onClick={() => handleSort("name")}
                            className="cursor-pointer"
                        >
                            Name {renderArrow("name")}
                        </THdata>
                        <THdata>Course</THdata>
                        <THdata onClick={() => handleSort("is_active")}>
                            Status {renderArrow("is_active")}
                        </THdata>

                        <THdata
                            onClick={() => handleSort("created_at")}
                            className="cursor-pointer"
                        >
                            Created {renderArrow("created_at")}
                        </THdata>
                        <THdata className="">
                            <p className=" flex justify-center w-full">
                                <span>Actions</span>
                            </p>
                        </THdata>
                    </Thead>
                    <Tbody>
                        {curriculum?.data?.length ? (
                            curriculum.data.map((curricula) => (
                                <Trow key={curricula.id}>
                                    <Tdata>{curricula.name}</Tdata>
                                    <Tdata>{curricula.course.name}</Tdata>

                                    <Tdata>
                                        <span
                                            className={`px-2 py-1 rounded text-xs ${curricula.is_active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                                        >
                                            {curricula.is_active
                                                ? "Active"
                                                : "Inactive"}
                                        </span>
                                    </Tdata>
                                    <Tdata>
                                        {formatDate(curricula.created_at)}
                                    </Tdata>
                                    <Tdata>
                                        <div className="flex items-center justify-center gap-x-10">
                                            <Link
                                                href={route(
                                                    "courses.curriculum.edit",
                                                    encodeURIComponent(
                                                        curricula.id,
                                                    ),
                                                )}
                                                className="text-emerald-600 hover:underline"
                                            >
                                                Edit
                                            </Link>
                                            <button
                                                onClick={() =>
                                                    handleDelete(curricula.id)
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
                                    No curriculum found.
                                </Tdata>
                            </Trow>
                        )}
                    </Tbody>
                </Table>
            </div>
        </AuthenticatedLayout>
    );
}
