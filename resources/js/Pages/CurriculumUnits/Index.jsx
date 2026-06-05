import React, { useState } from "react";
import { Head, Link, router } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import SearchSelect from "@/Components/SearchSelect";
import Table from "@/Components/Table/Table";
import Thead from "@/Components/Table/Thead";
import THdata from "@/Components/Table/THdata";
import Tbody from "@/Components/Table/Tbody";
import Trow from "@/Components/Table/Trow";
import Tdata from "@/Components/Table/Tdata";
import formatDate from "@/utils/date";

export default function Index({
    curriculum_units,
    filters = {},
    selected_curriculum = null,
    selected_curriculum_mapping = null,
}) {
    const [sortField, setSortField] = useState(
        curriculum_units.sort || "created_at",
    );
    const [sortDirection, setSortDirection] = useState(
        curriculum_units.direction || "desc",
    );
    const [selectedFilters, setSelectedFilters] = useState({
        curriculum_id: filters.curriculum_id || "",
        curriculum_mapping_id: filters.curriculum_mapping_id || "",
    });

    const applyFilters = (
        nextFilters,
        nextSort = sortField,
        nextDirection = sortDirection,
    ) => {
        router.get(
            route("units.curriculum-units.index"),
            {
                ...nextFilters,
                sort: nextSort,
                direction: nextDirection,
                page: 1,
            },
            { preserveState: true, replace: true },
        );
    };

    const handleSort = (field) => {
        const direction =
            sortField === field && sortDirection === "asc" ? "desc" : "asc";

        setSortField(field);
        setSortDirection(direction);
        applyFilters(selectedFilters, field, direction);
    };

    const renderArrow = (field) => {
        if (sortField !== field) return null;

        return sortDirection === "asc" ? " ^" : " v";
    };

    const handleCycleChange = (cycle) => {
        const nextFilters = {
            curriculum_id: cycle.id ?? "",
            curriculum_mapping_id: "",
        };

        setSelectedFilters(nextFilters);
        applyFilters(nextFilters);
    };

    const handlecourseChange = (course) => {
        const nextFilters = {
            ...selectedFilters,
            curriculum_mapping_id: course.id ?? "",
        };

        setSelectedFilters(nextFilters);
        applyFilters(nextFilters);
    };

    const resetFilters = () => {
        const nextFilters = {
            curriculum_id: "",
            curriculum_mapping_id: "",
        };

        setSelectedFilters(nextFilters);
        applyFilters(nextFilters);
    };

    const handleDelete = (id) => {
        if (
            !confirm(
                "Are you sure you want to remove this unit from the curriculum?",
            )
        ) {
            return;
        }

        router.delete(route("units.curriculum-units.destroy", id), {
            preserveState: true,
            replace: true,
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Curriculum Units" />

            <div className="max-w-6xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-700">
                <section className="rounded-lg border border-zinc-100 bg-white p-6 shadow-sm">
                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                        <div>
                            <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                                Cycle
                            </label>
                            <SearchSelect
                                routeName="curriculums.search"
                                defaultOptions={[]}
                                placeholder="Select cycle..."
                                value={selectedFilters.curriculum_id}
                                selectedLabel={selected_curriculum?.name}
                                preloadOptions
                                minSearchLength={3}
                                onChange={handleCycleChange}
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                                Course
                            </label>
                            <SearchSelect
                                key={
                                    selectedFilters.curriculum_id ||
                                    "no-cycle"
                                }
                                routeName="curriculum-mappings.search"
                                routeParams={{
                                    curriculum_id:
                                        selectedFilters.curriculum_id,
                                }}
                                defaultOptions={[]}
                                placeholder={
                                    selectedFilters.curriculum_id
                                        ? "Select course under cycle..."
                                        : "Select cycle first..."
                                }
                                value={
                                    selectedFilters.curriculum_mapping_id
                                }
                                selectedLabel={
                                    selected_curriculum_mapping?.name
                                }
                                preloadOptions
                                minSearchLength={3}
                                onChange={handlecourseChange}
                                disabled={
                                    !selectedFilters.curriculum_id
                                }
                            />
                        </div>
                    </div>

                    <div className="mt-4 flex justify-end">
                        <button
                            type="button"
                            onClick={resetFilters}
                            className="rounded border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50"
                        >
                            Reset Filters
                        </button>
                    </div>
                </section>

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
                            onClick={() =>
                                handleSort("curriculum_mapping_id")
                            }
                            className="cursor-pointer"
                        >
                            Curriculum{" "}
                            {renderArrow("curriculum_mapping_id")}
                        </THdata>
                        <THdata
                            onClick={() => handleSort("module_taught")}
                            className="cursor-pointer text-center"
                        >
                            Module Taught {renderArrow("module_taught")}
                        </THdata>
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
                                    <Tdata>
                                        {item.curriculum?.course?.name ??
                                            item.curriculum_mapping
                                                ?.course?.name}
                                    </Tdata>
                                    <Tdata>
                                        {item.curriculum?.name ??
                                            item.curriculum_mapping
                                                ?.curriculum?.name}
                                    </Tdata>
                                    <Tdata className="text-center">
                                        Module {item.module_taught}
                                    </Tdata>
                                    <Tdata className="text-zinc-500 text-sm">
                                        {formatDate(item.created_at)}
                                    </Tdata>
                                    <Tdata>
                                        <div className="flex items-center justify-center gap-x-6">
                                            <Link
                                                href={route(
                                                    "units.curriculum-units.edit",
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
                                    colSpan="6"
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
