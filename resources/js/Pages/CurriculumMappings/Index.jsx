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
import CourseWorkspaceTabs from "@/Pages/Courses/Partials/CourseWorkspaceTabs";

export default function CurriculumMappingsIndex({
    curriculumMappings,
}) {
    const [sortField, setSortField] = useState(
        curriculumMappings.sort || "created_at",
    );
    const [sortDirection, setSortDirection] = useState(
        curriculumMappings.direction || "desc",
    );
    const [searchTerm, setSearchTerm] = useState("");

    const handleSort = (field) => {
        const direction =
            sortField === field && sortDirection === "asc" ? "desc" : "asc";

        setSortField(field);
        setSortDirection(direction);

        router.get(
            route("courses.curriculum-mappings.index"),
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
            route("courses.curriculum-mappings.index"),
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
                "courses.curriculum-mappings.destroy",
                encodeURIComponent(id),
            ),
            {
                preserveState: true,
                replace: true,
            },
        );
    };

    const handleActivate = (id) => {
        if (!confirm("Activate this curriculum mapping?")) {
            return;
        }

        router.patch(
            route("courses.curriculum-mappings.activate", id),
            {},
            {
                preserveScroll: true,
                preserveState: true,
                replace: true,
            },
        );
    };

    const handleDeactivate = (id) => {
        if (!confirm("Deactivate this curriculum mapping?")) {
            return;
        }

        router.patch(
            route("courses.curriculum-mappings.deactivate", id),
            {},
            {
                preserveScroll: true,
                preserveState: true,
                replace: true,
            },
        );
    };

    return (
        <>
            <Head title="Curriculum Mapping" />

            <div className="max-w-6xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="mb-6">
                    <CourseWorkspaceTabs activeTab="mappings" />
                </div>
                <form
                    className="relative flex w-full gap-x-7"
                    onSubmit={submit}
                >
                    <SearchSelect
                        routeName="curriculums.search"
                        defaultOptions={[]}
                        placeholder="Select curriculum ..."
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
                    pagination={curriculumMappings}
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
                        {curriculumMappings?.data?.length ? (
                            curriculumMappings.data.map((mapping) => (
                                <Trow key={mapping.id}>
                                    <Tdata>{mapping.curriculum?.name}</Tdata>
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
                                        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
                                            <Link
                                                href={route(
                                                    "units.index",
                                                    {
                                                        curriculum_mapping_id:
                                                            mapping.id,
                                                    },
                                                )}
                                                className="text-emerald-600 hover:underline"
                                            >
                                                Units
                                            </Link>
                                            <Link
                                                href={route(
                                                    "courses.curriculum-mappings.edit",
                                                    encodeURIComponent(
                                                        mapping.id,
                                                    ),
                                                )}
                                                className="text-emerald-600 hover:underline"
                                            >
                                                Edit
                                            </Link>
                                            {mapping.is_active ? (
                                                <button
                                                    onClick={() =>
                                                        handleDeactivate(
                                                            mapping.id,
                                                        )
                                                    }
                                                    className="text-amber-600 hover:underline"
                                                >
                                                    Deactivate
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() =>
                                                        handleActivate(
                                                            mapping.id,
                                                        )
                                                    }
                                                    className="text-emerald-600 hover:underline"
                                                >
                                                    Activate
                                                </button>
                                            )}
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
                                    No curriculum mappings found.
                                </Tdata>
                            </Trow>
                        )}
                    </Tbody>
                </Table>
            </div>
        </>
    );
}
