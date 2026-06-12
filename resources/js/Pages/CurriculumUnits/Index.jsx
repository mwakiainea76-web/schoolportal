import React, { useState } from "react";
import { Head, Link, router } from "@inertiajs/react";
import SearchSelect from "@/Components/SearchSelect";
import InputLabel from "@/Components/InputLabel";
import Table from "@/Components/Table/Table";
import Thead from "@/Components/Table/Thead";
import THdata from "@/Components/Table/THdata";
import Tbody from "@/Components/Table/Tbody";
import Trow from "@/Components/Table/Trow";
import Tdata from "@/Components/Table/Tdata";
import { downloadExport } from "@/utils/exportDownload";

const FILTER_DEFINITIONS = [
    {
        key: "unit_id",
        label: "Unit Name",
        routeName: "units.search",
        placeholder: "Type in unit name...",
        selectedLabelKey: "unit",
    },
    {
        key: "curriculum_mapping_id",
        label: "Course",
        routeName: "courses.curriculum-mappings.search",
        placeholder: "Search course curriculum...",
        selectedLabelKey: "curriculum_mapping",
    },
    {
        key: "module_taught",
        label: "Module Taught",
        type: "select",
        selectedLabelKey: "module_taught",
        options: [1, 2, 3, 4, 5, 6].map((module) => ({
            value: String(module),
            label: `Module ${module}`,
        })),
    },
];

const FILTER_KEYS = FILTER_DEFINITIONS.map((filter) => filter.key);

const emptyFilterState = () =>
    FILTER_KEYS.reduce((values, key) => ({ ...values, [key]: "" }), {});

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
    const [exportFormat, setExportFormat] = useState("pdf");
    const [form, setForm] = useState({
        ...emptyFilterState(),
        unit_id: pageFilters.unit_id || "",
        module_taught: pageFilters.module_taught || "",
        course_id: pageFilters.course_id || "",
        curriculum_mapping_id:
            pageFilters.curriculum_mapping_id ||
            selected_mapping_option?.id ||
            curriculum_mapping?.id ||
            "",
    });
    const [currentFilterKey, setCurrentFilterKey] = useState(
        FILTER_KEYS.find((key) => pageFilters[key]) || "",
    );

    const setFilter = (key, value) => {
        setForm((current) => {
            const next = {
                ...current,
                [key]: value,
            };

            if (
                key === "module_taught" ||
                key === "curriculum_mapping_id"
            ) {
                next.unit_id = "";
            }

            return next;
        });
    };

    const effectiveCurriculumMappingId = form.curriculum_mapping_id;

    const currentFilters = () => ({
        ...FILTER_KEYS.reduce(
            (values, key) => ({ ...values, [key]: form[key] }),
            {},
        ),
        curriculum_mapping_id: effectiveCurriculumMappingId,
    });

    const selectedFilterDefinition = FILTER_DEFINITIONS.find(
        (filter) => filter.key === currentFilterKey,
    );

    const activeFilters = FILTER_DEFINITIONS.filter((filter) => form[filter.key]);

    const addCurrentFilter = () => {
        if (!currentFilterKey || !form[currentFilterKey]) return;

        setCurrentFilterKey("");
    };

    const clearSingleFilter = (key) => {
        setFilter(key, "");

        if (currentFilterKey === key) {
            setCurrentFilterKey("");
        }
    };

    const clearFilters = () => {
        setForm((current) => ({
            ...current,
            ...emptyFilterState(),
            curriculum_mapping_id:
                pageFilters.curriculum_mapping_id ||
                selected_mapping_option?.id ||
                curriculum_mapping?.id ||
                "",
        }));
        setCurrentFilterKey("");

        router.get(
            route("units.index"),
            {
                curriculum_mapping_id:
                    pageFilters.curriculum_mapping_id ||
                    selected_mapping_option?.id ||
                    curriculum_mapping?.id ||
                    "",
                sort: sortField,
                direction: sortDirection,
                page: 1,
            },
            { preserveState: true, replace: true },
        );
    };

    const getSelectedOptionLabel = (filter) =>
        selectedFilters?.[filter.selectedLabelKey] ||
        filter.options?.find((option) => option.value === form[filter.key])
            ?.label ||
        form[filter.key];

    const renderFilterInput = (filter) => {
        if (!filter) {
            return (
                <div className="rounded-xl border border-dashed border-zinc-200 bg-zinc-50 px-4 py-2 text-sm text-zinc-400">
                    Select a column to show its input
                </div>
            );
        }

        if (filter.type === "select") {
            return (
                <select
                    value={form[filter.key]}
                    onChange={(e) => setFilter(filter.key, e.target.value)}
                    className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
                >
                    <option value="">Choose module...</option>
                    {filter.options.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            );
        }

        const routeParams =
            filter.key === "unit_id"
                ? {
                      curriculum_mapping_id:
                          effectiveCurriculumMappingId || "",
                      module_taught: form.module_taught || "",
                  }
                : filter.routeParams || {};

        return (
            <SearchSelect
                routeName={filter.routeName}
                defaultOptions={[]}
                value={form[filter.key]}
                selectedLabel={selectedFilters?.[filter.selectedLabelKey]}
                routeParams={routeParams}
                placeholder={filter.placeholder}
                preloadOptions
                minSearchLength={filter.key === "unit_id" ? 2 : undefined}
                onChange={(option) => setFilter(filter.key, option?.id || "")}
            />
        );
    };

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

    const handleExport = () => {
        downloadExport("units", exportFormat, {
            ...currentFilters(),
            sort: sortField,
            direction: sortDirection,
        });
    };

    const title = curriculum_mapping
        ? `Units for ${curriculum_mapping.curriculum?.name}`
        : "Units";
    const subtitle = curriculum_mapping?.course?.name || "All units";
    const displayedFiltersCount = activeFilters.length;

    return (
        <>
            <Head title={title} />

            <div className="mx-auto w-full max-w-6xl animate-in fade-in slide-in-from-bottom-4 duration-700">


                <form
                    className="mb-4 rounded-lg border border-zinc-100 bg-white p-4 shadow-sm"
                    onSubmit={submit}
                >
                    <div className="grid grid-cols-1 items-end gap-3 lg:grid-cols-[minmax(220px,300px)_minmax(300px,1fr)_auto_auto_auto]">
                        <div>
                            <InputLabel value="Filter Column" />
                            <select
                                value={currentFilterKey}
                                onChange={(e) =>
                                    setCurrentFilterKey(e.target.value)
                                }
                                className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
                            >
                                <option value="">Choose column...</option>
                                {FILTER_DEFINITIONS.map((filter) => (
                                    <option key={filter.key} value={filter.key}>
                                        {filter.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <InputLabel
                                value={
                                    selectedFilterDefinition?.label ||
                                    "Filter Value"
                                }
                            />
                            {renderFilterInput(selectedFilterDefinition)}
                        </div>

                        <button
                            type="button"
                            onClick={addCurrentFilter}
                            disabled={!currentFilterKey || !form[currentFilterKey]}
                            className="inline-flex h-10 items-center justify-center rounded-lg border border-zinc-300 bg-white px-4 text-sm font-medium text-zinc-700 hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            + Add filter
                        </button>

                        <button
                            type="button"
                            onClick={clearFilters}
                            className="inline-flex h-10 items-center justify-center rounded-lg border border-zinc-300 bg-white px-4 text-sm text-zinc-700 hover:bg-zinc-50"
                        >
                            Clear all
                        </button>

                        <button
                            className="inline-flex h-10 items-center justify-center rounded-lg bg-emerald-600 px-4 text-sm text-white hover:bg-emerald-700"
                            type="submit"
                        >
                            Apply
                        </button>
                    </div>

                    <div className="mt-4 border-t border-zinc-100 pt-3">
                        {activeFilters.length ? (
                            <div className="flex flex-wrap gap-2">
                                {activeFilters.map((filter) => (
                                    <button
                                        key={filter.key}
                                        type="button"
                                        onClick={() =>
                                            clearSingleFilter(filter.key)
                                        }
                                        className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 ring-1 ring-emerald-100 hover:bg-emerald-100"
                                    >
                                        <span>
                                            {filter.label}:{" "}
                                            {getSelectedOptionLabel(filter)}
                                        </span>
                                        <span className="text-emerald-900">
                                            x
                                        </span>
                                    </button>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-zinc-500">
                                No filters selected. Choose a column above to
                                filter this table.
                            </p>
                        )}
                    </div>
                </form>

                <div className="mb-2 flex justify-end">
                    <div className="flex items-center">
                        <select
                            value={exportFormat}
                            onChange={(e) => setExportFormat(e.target.value)}
                            className="h-[34px] rounded-l border border-slate-300 border-r-0 bg-white px-3 text-sm text-slate-700 focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-inset focus:ring-gray-500"
                        >
                            <option value="pdf">PDF</option>
                            <option value="csv">CSV</option>
                            <option value="excel">Excel</option>
                        </select>
                        <button
                            type="button"
                            onClick={handleExport}
                            className="h-[34px] whitespace-nowrap rounded-r bg-gray-400 px-4 text-sm font-medium text-white transition-colors hover:bg-gray-600"
                        >
                            Export {exportFormat.toUpperCase()}
                        </button>
                    </div>
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
                                    colSpan="7"
                                    className="py-12 text-center text-zinc-400"
                                >
                                    No units found for the selected filters.
                                </Tdata>
                            </Trow>
                        )}
                    </Tbody>
                </Table>
            </div>
        </>
    );
}
