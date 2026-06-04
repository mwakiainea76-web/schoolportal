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

export default function CourseVersionMappingsIndex({
    courseVersionMappings,
}) {
    const [sortField, setSortField] = useState(
        courseVersionMappings.sort || "created_at",
    );
    const [sortDirection, setSortDirection] = useState(
        courseVersionMappings.direction || "desc",
    );
    const [searchTerm, setSearchTerm] = useState("");

    const handleSort = (field) => {
        const direction =
            sortField === field && sortDirection === "asc" ? "desc" : "asc";

        setSortField(field);
        setSortDirection(direction);

        router.get(
            route("courses.course-version-mappings.index"),
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
            route("courses.course-version-mappings.index"),
            { search: searchTerm, sort: sortField, direction: sortDirection },
            { preserveState: true, replace: true },
        );

        setSearchTerm("");
    };

    const handleDelete = (id) => {
        if (!confirm("Are you sure you want to delete this mapping?")) {
            return;
        }

        router.delete(
            route(
                "courses.course-version-mappings.destroy",
                encodeURIComponent(id),
            ),
            {
                preserveState: true,
                replace: true,
            },
        );
    };

    return (
        <AuthenticatedLayout>
            <Head title="Course Version Mapping" />

            <div className="max-w-6xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-700">
                <form
                    className="relative flex w-full gap-x-7"
                    onSubmit={submit}
                >
                    <SearchSelect
                        routeName="course-versions.search"
                        defaultOptions={[]}
                        placeholder="Select course version ..."
                        preloadOptions
                        onChange={(body) => setSearchTerm(body.name ?? "")}
                    />
                    <button
                        className="rounded bg-emerald-600 px-4 py-1 text-white hover:bg-slate-700"
                        type="submit"
                    >
                        Search
                    </button>
                </form>

                <Table
                    pagination={courseVersionMappings}
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
                        <THdata>Exam Body</THdata>
                        <THdata
                            onClick={() => handleSort("is_active")}
                            className="cursor-pointer"
                        >
                            Status {renderArrow("is_active")}
                        </THdata>
                        <THdata
                            onClick={() => handleSort("created_at")}
                            className="cursor-pointer"
                        >
                            Created {renderArrow("created_at")}
                        </THdata>
                        <THdata>
                            <p className="flex w-full justify-center">
                                <span>Actions</span>
                            </p>
                        </THdata>
                    </Thead>

                    <Tbody>
                        {courseVersionMappings?.data?.length ? (
                            courseVersionMappings.data.map((mapping) => (
                                <Trow key={mapping.id}>
                                    <Tdata>{mapping.course_version?.name}</Tdata>
                                    <Tdata>{mapping.course?.name ?? "-"}</Tdata>
                                    <Tdata>
                                        {mapping.course?.certification_level
                                            ?.exam_body
                                            ? `${mapping.course.certification_level.exam_body.code} - ${mapping.course.certification_level.exam_body.name}`
                                            : "-"}
                                    </Tdata>
                                    <Tdata>
                                        <span
                                            className={`rounded px-2 py-1 text-xs ${
                                                mapping.is_active
                                                    ? "bg-green-100 text-green-800"
                                                    : "bg-red-100 text-red-800"
                                            }`}
                                        >
                                            {mapping.is_active
                                                ? "Active"
                                                : "Inactive"}
                                        </span>
                                    </Tdata>
                                    <Tdata>
                                        {formatDate(mapping.created_at)}
                                    </Tdata>
                                    <Tdata>
                                        <div className="flex items-center justify-center gap-x-10">
                                            <Link
                                                href={route(
                                                    "courses.course-version-mappings.edit",
                                                    encodeURIComponent(
                                                        mapping.id,
                                                    ),
                                                )}
                                                className="text-emerald-600 hover:underline"
                                            >
                                                Edit
                                            </Link>
                                            <button
                                                onClick={() =>
                                                    handleDelete(mapping.id)
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
                                <Tdata colSpan="6" className="py-4 text-center">
                                    No course version mappings found.
                                </Tdata>
                            </Trow>
                        )}
                    </Tbody>
                </Table>
            </div>
        </AuthenticatedLayout>
    );
}
