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
import InputLabel from "@/Components/InputLabel";
import { downloadExport } from "@/utils/exportDownload";

const FILTER_DEFINITIONS = [
    {
        key: "curriculum_id",
        label: "Curriculum",
        routeName: "curriculums.search",
        placeholder: "Select curriculum...",
        selectedLabelKey: "curriculum",
    },
    {
        key: "course_id",
        label: "Course",
        routeName: "courses.search",
        placeholder: "Select course...",
        selectedLabelKey: "course",
    },
    {
        key: "exam_body_id",
        label: "Exam Body",
        routeName: "exam.bodies.search",
        placeholder: "Select exam body...",
        selectedLabelKey: "exam_body",
    },
    {
        key: "is_active",
        label: "Status",
        type: "select",
        selectedLabelKey: "status",
        options: [
            { value: "1", label: "Active" },
            { value: "0", label: "Inactive" },
        ],
    },
];

const FILTER_KEYS = FILTER_DEFINITIONS.map((filter) => filter.key);

const emptyFilterState = () =>
    FILTER_KEYS.reduce((values, key) => ({ ...values, [key]: "" }), {});

export default function CurriculumMappingsIndex({
    curriculumMappings,
    filters = {},
    selectedFilters = {},
}) {
    const pageFilters =
        filters && typeof filters === "object" && !Array.isArray(filters)
            ? filters
            : {};
    const [sortField, setSortField] = useState(
        pageFilters.sort || curriculumMappings.sort || "created_at",
    );
    const [sortDirection, setSortDirection] = useState(
        pageFilters.direction || curriculumMappings.direction || "desc",
    );
    const [form, setForm] = useState({
        ...emptyFilterState(),
        curriculum_id: pageFilters.curriculum_id || "",
        course_id: pageFilters.course_id || "",
        exam_body_id: pageFilters.exam_body_id || "",
        is_active: pageFilters.is_active ?? "",
    });
    const [currentFilterKey, setCurrentFilterKey] = useState(
        FILTER_KEYS.find((key) => pageFilters[key] !== undefined && pageFilters[key] !== "") || "",
    );
    const [exportFormat, setExportFormat] = useState("pdf");

    const setFilter = (key, value) => {
        setForm((current) => ({
            ...current,
            [key]: value,
        }));
    };

    const currentFilters = () =>
        FILTER_KEYS.reduce((values, key) => ({ ...values, [key]: form[key] }), {});

    const selectedFilterDefinition = FILTER_DEFINITIONS.find(
        (filter) => filter.key === currentFilterKey,
    );

    const activeFilters = FILTER_DEFINITIONS.filter(
        (filter) => form[filter.key] !== undefined && form[filter.key] !== "",
    );

    const addCurrentFilter = () => {
        if (!currentFilterKey || form[currentFilterKey] === "") return;

        setCurrentFilterKey("");
    };

    const clearSingleFilter = (key) => {
        setFilter(key, "");

        if (currentFilterKey === key) {
            setCurrentFilterKey("");
        }
    };

    const getSelectedOptionLabel = (filter) =>
        selectedFilters?.[filter.selectedLabelKey] ||
        filter.options?.find((option) => option.value === form[filter.key])?.label ||
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
                    <option value="">Choose status...</option>
                    {filter.options.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            );
        }

        return (
            <SearchSelect
                routeName={filter.routeName}
                defaultOptions={[]}
                value={form[filter.key]}
                selectedLabel={selectedFilters?.[filter.selectedLabelKey]}
                placeholder={filter.placeholder}
                preloadOptions
                onChange={(option) => setFilter(filter.key, option?.id || "")}
            />
        );
    };

    const handleSort = (field) => {
        const direction =
            sortField === field && sortDirection === "asc" ? "desc" : "asc";

        setSortField(field);
        setSortDirection(direction);

        router.get(
            route("courses.curriculum-mappings.index"),
            {
                ...currentFilters(),
                sort: field,
                direction,
                page: 1,
            },
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
        setForm(emptyFilterState());
        setCurrentFilterKey("");

        router.get(
            route("courses.curriculum-mappings.index"),
            { sort: sortField, direction: sortDirection, page: 1 },
            { preserveState: true, replace: true },
        );
    };

    const handleExport = () => {
        downloadExport("curriculum-mappings", exportFormat, {
            ...currentFilters(),
            search: pageFilters.search || "",
            sort: sortField,
            direction: sortDirection,
        });
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
                                onChange={(e) => setCurrentFilterKey(e.target.value)}
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
                                value={selectedFilterDefinition?.label || "Filter Value"}
                            />
                            {renderFilterInput(selectedFilterDefinition)}
                        </div>

                        <button
                            type="button"
                            onClick={addCurrentFilter}
                            disabled={!currentFilterKey || form[currentFilterKey] === ""}
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
                                        onClick={() => clearSingleFilter(filter.key)}
                                        className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 ring-1 ring-emerald-100 hover:bg-emerald-100"
                                    >
                                        <span>
                                            {filter.label}: {getSelectedOptionLabel(filter)}
                                        </span>
                                        <span className="text-emerald-900">x</span>
                                    </button>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-zinc-500">
                                No filters selected. Choose a column above to filter this table.
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
