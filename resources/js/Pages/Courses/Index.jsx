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
        key: "course_id",
        label: "Course Name",
        routeName: "courses.search",
        placeholder: "Select active course...",
        selectedLabelKey: "course",
    },
    {
        key: "curriculum_id",
        label: "Curriculum",
        routeName: "curriculums.search",
        placeholder: "Select curriculum...",
        selectedLabelKey: "curriculum",
    },
    {
        key: "department_id",
        label: "Department",
        routeName: "departments.search",
        placeholder: "Type to search department...",
        selectedLabelKey: "department",
    },
    {
        key: "exam_body_id",
        label: "Exam Body",
        routeName: "exam.bodies.search",
        placeholder: "Type to search exam body...",
        selectedLabelKey: "exam_body",
    },
    {
        key: "certification_level_id",
        label: "Certification Level",
        routeName: "certification-levels.search",
        placeholder: "Type to search level...",
        selectedLabelKey: "certification_level",
    },
];

const FILTER_KEYS = FILTER_DEFINITIONS.map((filter) => filter.key);

const emptyFilterState = () =>
    FILTER_KEYS.reduce((values, key) => ({ ...values, [key]: "" }), {});

export default function Index({
    courses,
    filters = {},
    selectedFilters = {},
    department_context = null,
}) {
    const pageFilters =
        filters && !Array.isArray(filters) && typeof filters === "object"
            ? filters
            : {};

    const visibleFilters = department_context
        ? FILTER_DEFINITIONS.filter(
              (filter) =>
                  ![
                      "department_id",
                      "exam_body_id",
                      "certification_level_id",
                  ].includes(filter.key),
          )
        : FILTER_DEFINITIONS;

    const [sortField, setSortField] = useState(
        pageFilters.sort || "created_at",
    );
    const [sortDirection, setSortDirection] = useState(
        pageFilters.direction || "desc",
    );
    const [form, setForm] = useState({
        ...emptyFilterState(),
        course_id: pageFilters.course_id || "",
        department_id: pageFilters.department_id || "",
        exam_body_id: pageFilters.exam_body_id || "",
        certification_level_id: pageFilters.certification_level_id || "",
        curriculum_id: pageFilters.curriculum_id || "",
    });
    const [currentFilterKey, setCurrentFilterKey] = useState(
        visibleFilters.find((filter) => pageFilters[filter.key])?.key || "",
    );
    const [exportFormat, setExportFormat] = useState("pdf");

    const setFilter = (key, value) => {
        setForm((current) => ({
            ...current,
            [key]: value,
        }));
    };

    const currentFilters = () =>
        FILTER_KEYS.reduce(
            (values, key) => ({ ...values, [key]: form[key] }),
            {},
        );

    const selectedFilterDefinition = visibleFilters.find(
        (filter) => filter.key === currentFilterKey,
    );

    const activeFilters = visibleFilters.filter((filter) => form[filter.key]);

    const clearSingleFilter = (key) => {
        setFilter(key, "");

        if (currentFilterKey === key) {
            setCurrentFilterKey("");
        }
    };

    const getSelectedOptionLabel = (filter) =>
        selectedFilters?.[filter.selectedLabelKey] || form[filter.key];

    const renderFilterInput = (filter) => {
        if (!filter) {
            return (
                <div className="rounded-xl border border-dashed border-zinc-200 bg-zinc-50 px-4 py-2 text-sm text-zinc-400">
                    Select a column to show its input
                </div>
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
        setForm(emptyFilterState());
        setCurrentFilterKey("");

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

    const handleExport = () => {
        downloadExport("courses", exportFormat, {
            ...currentFilters(),
            search: pageFilters.search || "",
            sort: sortField,
            direction: sortDirection,
        });
    };

    return (
        <>
            <Head
                title={department_context ? "Department Courses" : "Courses"}
            />

            <div className="mx-auto w-full max-w-6xl animate-in fade-in slide-in-from-bottom-4 duration-700">
                {department_context ? (
                    <div className="mb-4 rounded-lg border border-zinc-100 bg-white p-4 shadow-sm">
                        <h1 className="text-2xl font-semibold text-zinc-900">
                            Department Courses
                        </h1>
                        <p className="mt-1 text-sm text-zinc-500">
                            View the courses and active curricula in your
                            department only.
                        </p>
                        <div className="mt-3 inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 ring-1 ring-emerald-100">
                            {department_context.label}
                        </div>
                    </div>
                ) : null}

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
                                {visibleFilters.map((filter) => (
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
                            onClick={() =>
                                currentFilterKey &&
                                form[currentFilterKey] &&
                                setCurrentFilterKey("")
                            }
                            disabled={
                                !currentFilterKey || !form[currentFilterKey]
                            }
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
                        {!department_context ? <THdata>Actions</THdata> : null}
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
                                    {!department_context ? (
                                        <Tdata>
                                            <div className="flex items-center justify-center gap-x-10">
                                                <Link
                                                    href={route(
                                                        "courses.edit",
                                                        encodeURIComponent(
                                                            course.id,
                                                        ),
                                                    )}
                                                    className="text-emerald-600 hover:underline"
                                                >
                                                    Edit
                                                </Link>
                                                <button
                                                    onClick={() =>
                                                        handleDelete(course.id)
                                                    }
                                                    className="text-red-600 hover:underline"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </Tdata>
                                    ) : null}
                                </Trow>
                            ))
                        ) : (
                            <Trow>
                                <Tdata
                                    colSpan={department_context ? "7" : "8"}
                                    className="py-4 text-center"
                                >
                                    No courses found.
                                </Tdata>
                            </Trow>
                        )}
                    </Tbody>
                </Table>
            </div>
        </>
    );
}
