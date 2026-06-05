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
import InputLabel from "@/Components/InputLabel";

export default function coursesIndex({
    courses,
    filters = {},
    selectedFilters = {},
}) {
    const pageFilters =
        filters && !Array.isArray(filters) && typeof filters === "object"
            ? filters
            : {};

    const [sortField, setSortField] = useState(
        pageFilters.sort || "created_at",
    );
    const [sortDirection, setSortDirection] = useState(
        pageFilters.direction || "desc",
    );
    const [form, setForm] = useState({
        course_id: pageFilters.course_id || "",
        department_id: pageFilters.department_id || "",
        exam_body_id: pageFilters.exam_body_id || "",
        certification_level_id: pageFilters.certification_level_id || "",
        curriculum_id: pageFilters.curriculum_id || "",
    });

    const setFilter = (key, value) => {
        setForm((current) => ({
            ...current,
            [key]: value,
        }));
    };

    const currentFilters = () => ({
        course_id: form.course_id,
        department_id: form.department_id,
        exam_body_id: form.exam_body_id,
        certification_level_id: form.certification_level_id,
        curriculum_id: form.curriculum_id,
    });

    const handleSort = (field) => {
        const direction =
            sortField === field && sortDirection === "asc" ? "desc" : "asc";

        setSortField(field);
        setSortDirection(direction);

        router.get(
            route("courses.index"),
            { ...currentFilters(), sort: field, direction, page: 1 },
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
            route("courses.index"),
            {
                ...currentFilters(),
                sort: sortField,
                direction: sortDirection,
                page: 1,
            },
            { preserveState: true, replace: true },
        );
    };

    const clearFilters = () => {
        setForm({
            course_id: "",
            department_id: "",
            exam_body_id: "",
            certification_level_id: "",
            curriculum_id: "",
        });

        router.get(
            route("courses.index"),
            { sort: sortField, direction: sortDirection, page: 1 },
            { preserveState: true, replace: true },
        );
    };

    const handleDelete = (id) => {
        if (!confirm("Are you sure you want to delete this course?")) {
            return;
        }

        router.delete(route("courses.destroy", encodeURIComponent(id)), {
            preserveState: true,
            replace: true,
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Courses" />

            <div className="max-w-6xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-700">
                <form className="mb-4 rounded-lg border border-zinc-100 bg-white p-4 shadow-sm" onSubmit={submit}>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                        <div>
                            <InputLabel value="Course Name" />
                            <SearchSelect
                                routeName="courses.search"
                                defaultOptions={[]}
                                value={form.course_id}
                                selectedLabel={selectedFilters.course}
                                placeholder="Select active course..."
                                preloadOptions
                                onChange={(course) =>
                                    setFilter("course_id", course.id)
                                }
                            />
                        </div>

                        <div>
                            <InputLabel value="Curriculum" />
                            <SearchSelect
                                routeName="curriculums.search"
                                defaultOptions={[]}
                                value={form.curriculum_id}
                                selectedLabel={selectedFilters.curriculum}
                                placeholder="Select curriculum..."
                                preloadOptions
                                onChange={(curriculum) =>
                                    setFilter("curriculum_id", curriculum.id)
                                }
                            />
                        </div>

                        <div>
                            <InputLabel value="Department" />
                            <SearchSelect
                                routeName="departments.search"
                                defaultOptions={[]}
                                value={form.department_id}
                                selectedLabel={selectedFilters.department}
                                placeholder="Type to search department..."
                                preloadOptions
                                onChange={(department) =>
                                    setFilter("department_id", department.id)
                                }
                            />
                        </div>

                        <div>
                            <InputLabel value="Exam Body" />
                            <SearchSelect
                                routeName="exam-bodies.search"
                                defaultOptions={[]}
                                value={form.exam_body_id}
                                selectedLabel={selectedFilters.exam_body}
                                placeholder="Type to search exam body..."
                                preloadOptions
                                onChange={(examBody) =>
                                    setFilter("exam_body_id", examBody.id)
                                }
                            />
                        </div>

                        <div>
                            <InputLabel value="Certification Level" />
                            <SearchSelect
                                routeName="certification-levels.search"
                                defaultOptions={[]}
                                value={form.certification_level_id}
                                selectedLabel={
                                    selectedFilters.certification_level
                                }
                                placeholder="Type to search level..."
                                preloadOptions
                                onChange={(level) =>
                                    setFilter(
                                        "certification_level_id",
                                        level.id,
                                    )
                                }
                            />
                        </div>
                    </div>

                    <div className="mt-4 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={clearFilters}
                            className="rounded bg-zinc-400 px-4 py-2 text-sm text-white hover:bg-zinc-600"
                        >
                            Clear
                        </button>
                        <button
                            className="rounded bg-emerald-600 px-4 py-2 text-sm text-white hover:bg-slate-700"
                            type="submit"
                        >
                            Search
                        </button>
                    </div>
                </form>

                <Table
                    pagination={courses}
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
                            onClick={() => handleSort("certification_level_id")}
                            className="cursor-pointer"
                        >
                            Certification Level{" "}
                            {renderArrow("certification_level_id")}
                        </THdata>
                        <THdata
                            onClick={() => handleSort("department_id")}
                            className="cursor-pointer"
                        >
                            Department {renderArrow("department_id")}
                        </THdata>
                        <THdata>Current Curriculum</THdata>
                        <THdata
                            onClick={() => handleSort("created_at")}
                            className="cursor-pointer"
                        >
                            Created {renderArrow("created_at")}
                        </THdata>
                        <THdata>Actions</THdata>
                    </Thead>

                    <Tbody>
                        {courses?.data?.length ? (
                            courses.data.map((course) => (
                                <Trow key={course.id}>
                                    <Tdata>{course.id}</Tdata>
                                    <Tdata>{course.code}</Tdata>
                                    <Tdata>{course.name}</Tdata>
                                    <Tdata>
                                        {course.certification_level ?? "-"}
                                    </Tdata>
                                    <Tdata>{course.department ?? "-"}</Tdata>
                                    <Tdata>{course.curriculum ?? "-"}</Tdata>
                                    <Tdata>
                                        {formatDate(course.created_at)}
                                    </Tdata>
                                    <Tdata>
                                        <div className="flex items-center justify-center gap-x-10">
                                            <Link
                                                href={route(
                                                    "courses.edit",
                                                    encodeURIComponent(course.id),
                                                )}
                                                className="text-emerald-600 hover:underline"
                                            >
                                                Edit
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(course.id)}
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
                                    No courses found.
                                </Tdata>
                            </Trow>
                        )}
                    </Tbody>
                </Table>
            </div>
        </AuthenticatedLayout>
    );
}
