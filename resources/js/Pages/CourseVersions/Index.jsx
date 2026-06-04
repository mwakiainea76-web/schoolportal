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
import useRbac from "@/Hooks/UseRBAC";

export default function CourseVersionIndex({
    curricula,
    course_versions = [],
}) {
    const [sortField, setSortField] = useState(curricula.sort || "created_at");
    const [sortDirection, setSortDirection] = useState(
        curricula.direction || "desc",
    );
    const [searchTerm, setSearchTerm] = useState("");
    const { can } = useRbac();

    const handleSort = (field) => {
        const direction =
            sortField === field && sortDirection === "asc" ? "desc" : "asc";

        setSortField(field);
        setSortDirection(direction);

        router.get(
            route("course-versions.index"),
            { sort: field, direction, page: 1 },
            { preserveState: true, replace: true },
        );
    };

    const renderArrow = (field) => {
        if (sortField !== field) return null;

        return sortDirection === "asc" ? "^" : "v";
    };

    const submit = (e) => {
        e.preventDefault();

        router.get(
            route("course-versions.index"),
            { search: searchTerm, sort: sortField, direction: sortDirection },
            { preserveState: true, replace: true },
        );
    };

    const handleDelete = (id) => {
        if (!confirm("Are you sure you want to delete this course version?")) {
            return;
        }

        router.delete(route("course-versions.destroy", { curriculum: id }), {
            preserveState: true,
            replace: true,
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Course Versions" />

            <div className="mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-700">
                {can("course-versions.view") ? (
                    <form
                        className="w-full relative flex gap-x-7"
                        onSubmit={submit}
                    >
                        <SearchSelect
                            defaultOptions={course_versions}
                            placeholder="Select course version ..."
                            onChange={(body) => setSearchTerm(body.name)}
                        />
                        <button
                            className="px-4 py-1 bg-emerald-600 text-white rounded hover:bg-slate-700"
                            type="submit"
                        >
                            Search
                        </button>
                    </form>
                ) : null}

                <Table
                    pagination={curricula}
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
                        <THdata
                            onClick={() => handleSort("name")}
                            className="cursor-pointer"
                        >
                            Name {renderArrow("name")}
                        </THdata>
                        <THdata
                            onClick={() => handleSort("start_date")}
                            className="cursor-pointer"
                        >
                            Start Date {renderArrow("start_date")}
                        </THdata>
                        <THdata
                            onClick={() => handleSort("end_date")}
                            className="cursor-pointer"
                        >
                            End Date {renderArrow("end_date")}
                        </THdata>
                        <THdata>Status</THdata>
                        <THdata
                            onClick={() => handleSort("created_at")}
                            className="cursor-pointer"
                        >
                            Created {renderArrow("created_at")}
                        </THdata>

                        {can("course-versions.edit") ||
                        can("course-versions.delete") ? (
                            <THdata>
                                <p className="text-center">Actions</p>
                            </THdata>
                        ) : null}
                    </Thead>

                    <Tbody>
                        {curricula?.data?.length ? (
                            curricula.data.map((curriculum) => (
                                <Trow key={curriculum.id}>
                                    <Tdata>{curriculum.id}</Tdata>
                                    <Tdata>{curriculum.name}</Tdata>
                                    <Tdata>
                                        {formatDate(curriculum.start_date)}
                                    </Tdata>
                                    <Tdata>
                                        {curriculum.end_date
                                            ? formatDate(curriculum.end_date)
                                            : "Ongoing"}
                                    </Tdata>
                                    <Tdata>
                                        <span
                                            className={`px-2 py-1 rounded text-xs ${
                                                curriculum.is_active
                                                    ? "bg-green-100 text-green-800"
                                                    : "bg-red-100 text-red-800"
                                            }`}
                                        >
                                            {curriculum.is_active
                                                ? "Active"
                                                : "Inactive"}
                                        </span>
                                    </Tdata>
                                    <Tdata>
                                        {formatDate(curriculum.created_at)}
                                    </Tdata>

                                    {can("course-versions.edit") ||
                                    can("course-versions.delete") ? (
                                        <Tdata>
                                            <div className="flex items-center justify-center gap-x-10">
                                                {can("course-versions.edit") ? (
                                                    <Link
                                                        href={route(
                                                            "course-versions.edit",
                                                            {
                                                                curriculum:
                                                                    curriculum.id,
                                                            },
                                                        )}
                                                        className="text-emerald-600 hover:underline"
                                                    >
                                                        Edit
                                                    </Link>
                                                ) : null}

                                                {can("course-versions.delete") ? (
                                                    <button
                                                        onClick={() =>
                                                            handleDelete(
                                                                curriculum.id,
                                                            )
                                                        }
                                                        className="text-red-600 hover:underline"
                                                    >
                                                        Delete
                                                    </button>
                                                ) : null}
                                            </div>
                                        </Tdata>
                                    ) : null}
                                </Trow>
                            ))
                        ) : (
                            <Trow>
                                <Tdata colSpan="7" className="text-center py-4">
                                    No course versions found.
                                </Tdata>
                            </Trow>
                        )}
                    </Tbody>
                </Table>
            </div>
        </AuthenticatedLayout>
    );
}
