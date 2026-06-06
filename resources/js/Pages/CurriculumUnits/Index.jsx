import React, { useState } from "react";
import { Head, Link, router } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import InputLabel from "@/Components/InputLabel";
import SearchSelect from "@/Components/SearchSelect";
import Table from "@/Components/Table/Table";
import Thead from "@/Components/Table/Thead";
import THdata from "@/Components/Table/THdata";
import Tbody from "@/Components/Table/Tbody";
import Trow from "@/Components/Table/Trow";
import Tdata from "@/Components/Table/Tdata";
import CourseWorkspaceTabs from "@/Pages/Courses/Partials/CourseWorkspaceTabs";

export default function Index({
    curriculum_mapping,
    selected_mapping_option,
    filters = {},
    selectedFilters = {},
    units,
}) {
    const pageFilters =
        filters && !Array.isArray(filters) && typeof filters === "object"
            ? filters
            : {};

    const [sortField, setSortField] = useState(
        pageFilters.sort || units.sort || "module_taught",
    );
    const [sortDirection, setSortDirection] = useState(
        pageFilters.direction || units.direction || "asc",
    );
    const [form, setForm] = useState({
        unit_id: pageFilters.unit_id || "",
        module_taught: pageFilters.module_taught || "",
        course_id: pageFilters.course_id || "",
        exam_body_id: pageFilters.exam_body_id || "",
        certification_level_id: pageFilters.certification_level_id || "",
        curriculum_mapping_id:
            pageFilters.curriculum_mapping_id ||
            selected_mapping_option?.id ||
            curriculum_mapping?.id ||
            "",
    });

    const setFilter = (key, value) => {
        setForm((current) => {
            const next = {
                ...current,
                [key]: value,
            };

            if (key === "exam_body_id") {
                next.course_id = "";
                next.certification_level_id = "";
                next.unit_id = "";
                next.curriculum_mapping_id = "";
            }

            if (
                key === "course_id" ||
                key === "certification_level_id" ||
                key === "curriculum_mapping_id"
            ) {
                next.unit_id = "";
            }

            if (
                key === "course_id" ||
                key === "certification_level_id"
            ) {
                next.curriculum_mapping_id = "";
            }

            return next;
        });
    };

    const effectiveCurriculumMappingId =
        form.course_id || form.exam_body_id || form.certification_level_id
            ? ""
            : form.curriculum_mapping_id;

    const currentFilters = () => ({
        unit_id: form.unit_id,
        module_taught: form.module_taught,
        course_id: form.course_id,
        exam_body_id: form.exam_body_id,
        certification_level_id: form.certification_level_id,
        curriculum_mapping_id: effectiveCurriculumMappingId,
    });

    const applyFilters = (
        nextSort = sortField,
        nextDirection = sortDirection,
    ) => {
        router.get(
            route("units.index"),
            {
                ...currentFilters(),
                sort: nextSort,
                direction: nextDirection,
                page: 1,
            },
            { preserveState: true, replace: true },
        );
    };

    const submit = (e) => {
        e.preventDefault();
        applyFilters(sortField, sortDirection);
    };

    const clearFilters = () => {
        setForm({
            unit_id: "",
            module_taught: "",
            course_id: "",
            exam_body_id: "",
            certification_level_id: "",
            curriculum_mapping_id: "",
        });

        router.get(
            route("units.index"),
            { sort: sortField, direction: sortDirection, page: 1 },
            { preserveState: true, replace: true },
        );
    };

    const handleSort = (field) => {
        const direction =
            sortField === field && sortDirection === "asc" ? "desc" : "asc";

        setSortField(field);
        setSortDirection(direction);
        applyFilters(field, direction);
    };

    const renderArrow = (field) => {
        if (sortField !== field) return null;

        return sortDirection === "asc" ? " ^" : " v";
    };

    const handleDelete = (id) => {
        if (!confirm("Are you sure you want to delete this unit?")) {
            return;
        }

        router.delete(route("units.destroy", id), {
            preserveState: true,
            replace: true,
        });
    };

    const title = curriculum_mapping
        ? `Units for ${curriculum_mapping.curriculum?.name}`
        : "Units";
    const subtitle = curriculum_mapping?.course?.name || "All units";
    const displayedFiltersCount = [
        form.unit_id,
        form.module_taught,
        form.course_id,
        form.exam_body_id,
        form.certification_level_id,
        form.curriculum_mapping_id,
    ].filter(Boolean).length;

    return (
        <AuthenticatedLayout>
            <Head title={title} />

            <div className="mx-auto w-full max-w-6xl animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="mb-6">
                    <CourseWorkspaceTabs activeTab="units" />
                </div>
                <form
                    className="mb-4 rounded-lg border border-zinc-100 bg-white p-4 shadow-sm"
                    onSubmit={submit}
                >
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                        <div>
                            <InputLabel value="Unit Name" />
                            <SearchSelect
                                routeName="units.search"
                                defaultOptions={[]}
                                value={form.unit_id}
                                selectedLabel={selectedFilters.unit}
                                routeParams={{
                                    curriculum_mapping_id:
                                        effectiveCurriculumMappingId || "",
                                    module_taught: form.module_taught || "",
                                    course_id: form.course_id || "",
                                    exam_body_id: form.exam_body_id || "",
                                    certification_level_id:
                                        form.certification_level_id || "",
                                }}
                                placeholder="Select unit..."
                                preloadOptions
                                minSearchLength={2}
                                onChange={(unit) =>
                                    setFilter("unit_id", unit.id)
                                }
                            />
                        </div>

                        <div>
                            <InputLabel value="Module Taught" />
                            <SearchSelect
                                defaultOptions={[1, 2, 3, 4, 5, 6].map(
                                    (module) => ({
                                        id: String(module),
                                        name: `Module ${module}`,
                                    }),
                                )}
                                value={form.module_taught}
                                placeholder="Select module..."
                                onChange={(module) =>
                                    setFilter("module_taught", module.id)
                                }
                            />
                        </div>

                        <div>
                            <InputLabel value="Curriculum Course" />
                            <SearchSelect
                                routeName="courses.search"
                                defaultOptions={[]}
                                value={form.course_id}
                                selectedLabel={selectedFilters.course}
                                routeParams={{
                                    versioned_only: 1,
                                    exam_body_id: form.exam_body_id || "",
                                }}
                                placeholder="Select active course..."
                                preloadOptions
                                onChange={(course) =>
                                    setFilter("course_id", course.id)
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
                                routeParams={{
                                    exam_body_id: form.exam_body_id || "",
                                }}
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

                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-zinc-900">
                            {title}
                        </h1>
                        <p className="text-zinc-500">
                            {subtitle}
                            {displayedFiltersCount
                                ? ` | ${displayedFiltersCount} filter${displayedFiltersCount > 1 ? "s" : ""} applied`
                                : ""}
                        </p>
                    </div>
                    <Link
                        href={route("units.create", {
                            curriculum_mapping_id:
                                selected_mapping_option?.id ||
                                curriculum_mapping?.id ||
                                "",
                        })}
                        className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-500"
                    >
                        Add Unit
                    </Link>
                </div>

                <Table
                    pagination={units}
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
                            onClick={() => handleSort("module_taught")}
                            className="cursor-pointer text-center"
                        >
                            Module {renderArrow("module_taught")}
                        </THdata>
                        <THdata>Course</THdata>
                        <THdata>Exam Body</THdata>
                        <THdata>Certification Level</THdata>
                        <THdata className="text-center">Compulsory</THdata>
                        <THdata className="text-center">Actions</THdata>
                    </Thead>

                    <Tbody>
                        {units?.data?.length ? (
                            units.data.map((item) => (
                                <Trow key={item.id}>
                                    <Tdata className="font-mono text-sm">
                                        {item.code}
                                    </Tdata>
                                    <Tdata>{item.name}</Tdata>
                                    <Tdata className="text-center">
                                        {item.module_taught}
                                    </Tdata>
                                    <Tdata>
                                        {item.curriculum_mapping?.course
                                            ?.name || "-"}
                                    </Tdata>
                                    <Tdata>
                                        {item.curriculum_mapping?.course
                                            ?.certification_level?.exam_body
                                            ? `${item.curriculum_mapping.course.certification_level.exam_body.code} - ${item.curriculum_mapping.course.certification_level.exam_body.name}`
                                            : "-"}
                                    </Tdata>
                                    <Tdata>
                                        {item.curriculum_mapping?.course
                                            ?.certification_level?.name || "-"}
                                    </Tdata>
                                    <Tdata className="text-center">
                                        {item.is_compulsory ? (
                                            <span className="text-emerald-600">
                                                Yes
                                            </span>
                                        ) : (
                                            <span className="text-zinc-400">
                                                No
                                            </span>
                                        )}
                                    </Tdata>
                                    <Tdata>
                                        <div className="flex items-center justify-center gap-x-6">
                                            <Link
                                                href={route(
                                                    "units.edit",
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
                                    colSpan="8"
                                    className="py-12 text-center text-zinc-400"
                                >
                                    No units found for the selected filters.
                                </Tdata>
                            </Trow>
                        )}
                    </Tbody>
                </Table>
            </div>
        </AuthenticatedLayout>
    );
}
