import React, { useState } from "react";
import { Head, Link, router } from "@inertiajs/react";

import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import Table from "@/Components/Table/Table";
import Thead from "@/Components/Table/Thead";
import THdata from "@/Components/Table/THdata";
import Tbody from "@/Components/Table/Tbody";
import Trow from "@/Components/Table/Trow";
import Tdata from "@/Components/Table/Tdata";
import SearchSelect from "@/Components/SearchSelect";
import formatDate from "@/utils/date";
import Modal from "@/Components/Modal";

export default function FeeAssignmentsIndex({ assignments, filters }) {
    const [sortField, setSortField] = useState(
        assignments.sort || "created_at",
    );
    const [sortDirection, setSortDirection] = useState(
        assignments.direction || "desc",
    );
    const [searchTerm, setSearchTerm] = useState("");
    const [showInactive, setShowInactive] = useState(filters.show_inactive === "true" || false);

    const handleSort = (field) => {
        const direction =
            sortField === field && sortDirection === "asc" ? "desc" : "asc";

        setSortField(field);
        setSortDirection(direction);

        router.get(
            route("fees.assignments.index"),
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
            route("fees.assignments.index"),
            {
                search: searchTerm,
                sort: sortField,
                direction: sortDirection,
            },
            { preserveState: true, replace: true },
        );

        setSearchTerm("");
    };

    const handleDelete = (id) => {
        if (!confirm("Are you sure you want to delete this assignment?")) {
            return;
        }

        router.delete(route("fees.assignments.destroy", id), {
            preserveState: true,
            replace: true,
        });
    };

    const programCertificationLabel = (assignment) => {
        const programName =
            assignment.program_version_mapping?.program?.name ||
            assignment.course_curriculum?.course?.name;
        const certificationName =
            assignment.program_version_mapping?.program?.certificationLevel
                ?.name ||
            assignment.program_version_mapping?.program?.certification_level
                ?.name ||
            assignment.course_curriculum?.course?.certificationLevel?.name ||
            assignment.course_curriculum?.course?.certification_level?.name;

        if (!programName && !certificationName) {
            return "-";
        }

        return [programName, certificationName].filter(Boolean).join(" - ");
    };
    const [showModal, setShowModal] = useState(false);
    return (
        <AuthenticatedLayout>
            <Head title="Fee Assignments" />

            <div className="mx-auto w-full max-w-7xl animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link
                            className="inline-block rounded bg-slate-400 px-4 py-1 text-white hover:bg-slate-700"
                            href={route("fees.assignments.create")}
                        >
                            + Add Program Version Fee Assignment
                        </Link>

                        <button
                            onClick={() => {
                                const newShowInactive = !showInactive;
                                setShowInactive(newShowInactive);
                                router.get(
                                    route("fees.assignments.index"),
                                    { ...filters, show_inactive: newShowInactive },
                                    { preserveState: true, replace: true }
                                );
                            }}
                            className={`rounded px-4 py-1 transition ${
                                showInactive
                                    ? "bg-emerald-600 text-white hover:bg-emerald-700"
                                    : "bg-zinc-200 text-zinc-700 hover:bg-zinc-300"
                            }`}
                        >
                            {showInactive ? "Showing All" : "Active Only"}
                        </button>
                    </div>

                    <div className="flex gap-3">
                        <Link
                            href={route("fees.assignments.bulk")}
                            className="rounded bg-blue-600 px-4 py-1 text-white transition hover:bg-blue-800"
                        >
                            Bulk Assign
                        </Link>

                        <span className="rounded bg-orange-100 px-4 py-1 text-orange-700">
                            Bulk Replace starts from Preview
                        </span>
                    </div>
                </div>

                <form
                    className="relative mb-4 flex w-full gap-x-7"
                    onSubmit={submit}
                >
                    <SearchSelect
                        routeName="fees.assignments.search"
                        defaultOptions={assignments.data}
                        placeholder="Search fee plan..."
                        onChange={(item) => setSearchTerm(item.id)}
                    />

                    <button
                        className="rounded bg-emerald-600 px-4 py-1 text-white hover:bg-slate-700"
                        type="submit"
                    >
                        Search
                    </button>
                </form>

                <Table
                    pagination={assignments}
                    sortField={sortField}
                    sortDirection={sortDirection}
                >
                    <Thead>
                        <THdata
                            onClick={() => handleSort("course_curriculum_id")}
                        >
                            Program / Certification{" "}
                            {renderArrow("course_curriculum_id")}
                        </THdata>

                        <THdata onClick={() => handleSort("fee_plan_id")}>
                            Fee Plan {renderArrow("fee_plan_id")}
                        </THdata>

                        <THdata onClick={() => handleSort("year_of_study")}>
                            Year Of Study {renderArrow("year_of_study")}
                        </THdata>

                        <THdata onClick={() => handleSort("session_number")}>
                            Session Number {renderArrow("session_number")}
                        </THdata>

                        <THdata onClick={() => handleSort("is_active")}>
                            Status {renderArrow("is_active")}
                        </THdata>

                        <THdata onClick={() => handleSort("valid_from")}>
                            Valid From {renderArrow("valid_from")}
                        </THdata>

                        <THdata onClick={() => handleSort("valid_to")}>
                            Valid To {renderArrow("valid_to")}
                        </THdata>

                        <THdata>Actions</THdata>
                    </Thead>

                    <Tbody>
                        {assignments?.data?.length ? (
                            assignments.data.map((item) => (
                                <Trow key={item.id}>
                                    <Tdata>
                                        {programCertificationLabel(item)}
                                    </Tdata>

                                    <Tdata>{item.fee_plan?.name ?? "-"}</Tdata>

                                    <Tdata>{item.year_of_study ?? "-"}</Tdata>

                                    <Tdata>{item.session_number ?? "-"}</Tdata>

                                    <Tdata>
                                        <span
                                            className={`px-2 py-1 rounded text-xs ${
                                                item.is_active
                                                    ? "bg-emerald-100 text-emerald-700"
                                                    : "bg-red-100 text-red-700"
                                            }`}
                                        >
                                            {item.is_active ? "Active" : "Inactive"}
                                        </span>
                                    </Tdata>

                                    <Tdata>{formatDate(item.valid_from)}</Tdata>

                                    <Tdata>
                                        {item.valid_to
                                            ? formatDate(item.valid_to)
                                            : "-"}
                                    </Tdata>

                                    <Tdata>
                                        <div className="flex items-center justify-center gap-x-10">
                                            <Link
                                                href={route(
                                                    "fees.assignments.edit",
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
                                <Tdata colSpan="8" className="py-4 text-center">
                                    No fee assignments found.
                                </Tdata>
                            </Trow>
                        )}
                    </Tbody>
                </Table>
            </div>
        </AuthenticatedLayout>
    );
}
