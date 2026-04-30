import React, { useState } from "react";
import { Head, Link, router } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import Table from "@/Components/Table/Table";
import Thead from "@/Components/Table/Thead";
import THdata from "@/Components/Table/THdata";
import Tbody from "@/Components/Table/Tbody";
import Trow from "@/Components/Table/Trow";
import Tdata from "@/Components/Table/Tdata";
import formatDate from "@/utils/date";

export default function Index({ curriculum_units }) {
    const [sortField, setSortField] = useState(
        curriculum_units.sort || "created_at",
    );
    const [sortDirection, setSortDirection] = useState(
        curriculum_units.direction || "desc",
    );
    const [searchTerm, setSearchTerm] = useState("");

    const handleSort = (field) => {
        const direction =
            sortField === field && sortDirection === "asc" ? "desc" : "asc";
        setSortField(field);
        setSortDirection(direction);
        router.get(
            route("units.curriculum.index"),
            { sort: field, direction, page: 1 },
            { preserveState: true, replace: true },
        );
    };

    const renderArrow = (field) => {
        if (sortField !== field) return null;
        return sortDirection === "asc" ? " ↑" : " ↓";
    };

    const submit = (e) => {
        e.preventDefault();
        router.get(
            route("units.curriculum.index"),
            { search: searchTerm, sort: sortField, direction: sortDirection },
            { preserveState: true, replace: true },
        );
    };

    const handleDelete = (id) => {
        if (
            !confirm(
                "Are you sure you want to remove this unit from the curriculum?",
            )
        )
            return;
        router.delete(route("units.curriculum.destroy", id), {
            preserveState: true,
            replace: true,
        });
        setSearchTerm("");
    };

    return (
        <AuthenticatedLayout>
            <Head title="curriculum" />

            <div className="max-w-6xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-700">
                <Link
                    className="mb-4 px-4 py-1 bg-slate-400 text-white rounded hover:bg-slate-700 inline-block"
                    href={route("units.curriculum.create")}
                >
                    Add Curriculum units
                </Link>

                <form
                    className="w-full relative flex gap-x-7"
                    onSubmit={submit}
                >
                    <input
                        type="text"
                        placeholder="Search for curriculum..."
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
                    pagination={curriculum_units}
                    sortField={sortField}
                    sortDirection={sortDirection}
                >
                    <Thead>
                        <THdata
                            onClick={() => handleSort("created_at")}
                            className="cursor-pointer"
                        >
                            Unit Name {renderArrow("created_at")}
                        </THdata>
                        <THdata className="text-center">Course</THdata>
                        <THdata
                            onClick={() => handleSort("course_curriculum_id")}
                            className="cursor-pointer"
                        >
                            Curriculum {renderArrow("course_curriculum_id")}
                        </THdata>

                        <THdata className="text-center">Module Taught</THdata>
                        <THdata
                            onClick={() => handleSort("created_at")}
                            className="cursor-pointer"
                        >
                            Assigned {renderArrow("created_at")}
                        </THdata>
                        <THdata className="text-center">Actions</THdata>
                    </Thead>
                    <Tbody>
                        {curriculum_units?.data?.length ? (
                            curriculum_units.data.map((item) => (
                                <Trow key={item.id}>
                                    <Tdata>{item.unit?.name}</Tdata>

                                    {/* Curriculum & Course Name */}
                                    <Tdata>
                                        {item.course_curriculum?.course?.name}
                                    </Tdata>
                                    <Tdata>
                                        {item.course_curriculum?.curriculum?.name}
                                    </Tdata>

                                    <Tdata className="text-center">
                                        Module {item.module_taught}
                                    </Tdata>

                                    {/* Created At */}
                                    <Tdata className="text-zinc-500 text-sm">
                                        {formatDate(item.created_at)}
                                    </Tdata>

                                    {/* Actions */}
                                    <Tdata>
                                        <div className="flex items-center justify-center gap-x-6">
                                            <Link
                                                href={route(
                                                    "units.curriculum.edit",
                                                    item.id,
                                                )}
                                                className="text-emerald-600 hover:underline"
                                            >
                                                Edit
                                            </Link>
                                            <button
                                                onClick={() =>
                                                    handleDelete(item.id)
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
                                <Tdata
                                    colSpan="5"
                                    className="text-center py-12 text-zinc-400"
                                >
                                    No unit assignments found.
                                </Tdata>
                            </Trow>
                        )}
                    </Tbody>
                </Table>
            </div>
        </AuthenticatedLayout>
    );
}
