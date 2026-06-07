import { Head, Link, router, usePage } from "@inertiajs/react";
import { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import Table from "@/Components/Table/Table";
import Thead from "@/Components/Table/Thead";
import THdata from "@/Components/Table/THdata";
import Tbody from "@/Components/Table/Tbody";
import Trow from "@/Components/Table/Trow";
import Tdata from "@/Components/Table/Tdata";
import AcademicCalendarWorkspaceTabs from "@/Pages/Academic/Partials/AcademicCalendarWorkspaceTabs";
import formatDate from "@/utils/date";

const STATUS_STYLES = {
    active: "bg-green-100 text-green-700",
    completed: "bg-blue-100 text-blue-700",
    dropped: "bg-red-100 text-red-600",
    transferred: "bg-yellow-100 text-yellow-700",
    suspended: "bg-gray-100 text-gray-600",
};

export default function Index({ enrollments }) {
    const { flash } = usePage().props;

    const [sortField, setSortField] = useState(
        enrollments.sort || "created_at",
    );
    const [sortDirection, setSortDirection] = useState(
        enrollments.direction || "desc",
    );
    const [searchTerm, setSearchTerm] = useState("");

    const handleSort = (field) => {
        const direction =
            sortField === field && sortDirection === "asc" ? "desc" : "asc";
        setSortField(field);
        setSortDirection(direction);
        router.get(
            route("academic.sessions.enrollments.index"),
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
            route("academic.sessions.enrollments.index"),
            { search: searchTerm, sort: sortField, direction: sortDirection },
            { preserveState: true, replace: true },
        );
    };

    const handleDelete = (id) => {
        if (!confirm("Are you sure you want to remove this enrollment?"))
            return;
        router.delete(route("academic.session.enrollments.destroy", id), {
            preserveScroll: true,
            replace: true,
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Academic Session Enrollments" />

            <div className="max-w-7xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-700">
                <AcademicCalendarWorkspaceTabs activeTab="enrollments" />

                {/* Search */}
                <form
                    className="w-full relative flex gap-x-7"
                    onSubmit={submit}
                >
                    <input
                        type="text"
                        placeholder="Search by student name or admission number..."
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
                    pagination={enrollments}
                    sortField={sortField}
                    sortDirection={sortDirection}
                >
                    <Thead>
                        <THdata
                            onClick={() => handleSort("id")}
                            className="cursor-pointer"
                        >
                            Id {renderArrow("id")}
                        </THdata>
                        <THdata>Student</THdata>
                        <THdata>Admission Number</THdata>
                        <THdata>Session</THdata>
                        <THdata>Curriculum</THdata>
                        <THdata>Course</THdata>
                        <THdata>Year Of Study</THdata>
                        <THdata>Module</THdata>
                        <THdata>Status</THdata>
                        <THdata
                            onClick={() => handleSort("created_at")}
                            className="cursor-pointer"
                        >
                            Enrolled {renderArrow("created_at")}
                        </THdata>
                        <THdata>Actions</THdata>
                    </Thead>
                    <Tbody>
                        {enrollments?.data?.length ? (
                            enrollments.data.map((enrollment) => (
                                <Trow key={enrollment.id}>
                                    <Tdata>{enrollment.id}</Tdata>
                                    <Tdata className="font-medium text-slate-700">
                                        {enrollment.student_name}
                                    </Tdata>
                                    <Tdata className="text-slate-500">
                                        {enrollment.admission_number}
                                    </Tdata>
                                    <Tdata>{enrollment.session}</Tdata>
                                    <Tdata>{enrollment.curriculum}</Tdata>
                                    <Tdata>{enrollment.course}</Tdata>
                                    <Tdata className="text-center">
                                        {enrollment.year_of_study}
                                    </Tdata>
                                    <Tdata className="text-center">
                                        {enrollment.module}
                                    </Tdata>
                                    <Tdata>
                                        <span
                                            className={`px-2 py-0.5 rounded text-xs ${STATUS_STYLES[enrollment.status] ?? "bg-gray-100 text-gray-600"}`}
                                        >
                                            {enrollment.status
                                                .charAt(0)
                                                .toUpperCase() +
                                                enrollment.status.slice(1)}
                                        </span>
                                    </Tdata>
                                    <Tdata>{formatDate(enrollment.created_at)}</Tdata>
                                    <Tdata>
                                        <div className="flex items-center justify-center gap-x-6">
                                            <Link
                                                href={route(
                                                    "academic.sessions.enrollments.edit",
                                                    enrollment.id,
                                                )}
                                                className="text-emerald-600 hover:underline"
                                            >
                                                Edit
                                            </Link>
                                            <button
                                                onClick={() =>
                                                    handleDelete(enrollment.id)
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
                                    colSpan="11"
                                    className="text-center py-4"
                                >
                                    No enrollments found.
                                </Tdata>
                            </Trow>
                        )}
                    </Tbody>
                </Table>
            </div>
        </AuthenticatedLayout>
    );
}
