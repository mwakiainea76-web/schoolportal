import { Head, Link, router, usePage } from "@inertiajs/react";
import { useState } from "react";
import Table from "@/Components/Table/Table";
import Thead from "@/Components/Table/Thead";
import THdata from "@/Components/Table/THdata";
import Tbody from "@/Components/Table/Tbody";
import Trow from "@/Components/Table/Trow";
import Tdata from "@/Components/Table/Tdata";
import AcademicCalendarWorkspaceTabs from "@/Pages/Academic/Partials/AcademicCalendarWorkspaceTabs";
import formatDate from "@/utils/date";
import InputLabel from "@/Components/InputLabel";
import SearchSelect from "@/Components/SearchSelect";

const STATUS_STYLES = {
    active: "bg-green-100 text-green-700",
    completed: "bg-blue-100 text-blue-700",
    dropped: "bg-red-100 text-red-600",
    transferred: "bg-yellow-100 text-yellow-700",
    suspended: "bg-gray-100 text-gray-600",
};

const EMPTY_FILTERS = {
    course_id: "",
    curriculum_id: "",
    academic_year_id: "",
    academic_session_id: "",
    department_id: "",
    year_of_study: "",
    admission_number: "",
    status: "",
};

const FILTER_DEFINITIONS = [
    {
        key: "admission_number",
        label: "Admission Number",
        type: "text",
        placeholder: "Search by Reg No...",
    },
    {
        key: "department_id",
        label: "Department",
        type: "search",
        routeName: "departments.search",
        placeholder: "Search department...",
        selectedLabelKey: "department",
    },
    {
        key: "course_id",
        label: "Course Name",
        type: "search",
        routeName: "courses.search",
        placeholder: "Select course...",
        selectedLabelKey: "course",
        clears: ["curriculum_id"],
    },
    {
        key: "curriculum_id",
        label: "Curriculum Name",
        type: "search",
        routeName: "curriculums.search",
        placeholder: "Select curriculum...",
        selectedLabelKey: "curriculum",
        dependsOn: "course_id",
        disabledPlaceholder: "Select course first",
    },
    {
        key: "academic_year_id",
        label: "Academic Year",
        type: "search",
        routeName: "academic-years.search",
        placeholder: "Select academic year...",
        selectedLabelKey: "academic_year",
        clears: ["academic_session_id"],
    },
    {
        key: "academic_session_id",
        label: "Academic Session",
        type: "search",
        routeName: "academic-sessions.search",
        placeholder: "Select academic session...",
        selectedLabelKey: "academic_session",
        dependsOn: "academic_year_id",
        disabledPlaceholder: "Select academic year first",
        routeParams: (form) => ({
            academic_year_id: form.academic_year_id,
        }),
    },
    {
        key: "year_of_study",
        label: "Year of Study",
        type: "select",
        placeholder: "All years",
        options: [
            { value: "1", label: "Year 1" },
            { value: "2", label: "Year 2" },
            { value: "3", label: "Year 3" },
            { value: "4", label: "Year 4" },
        ],
    },
    {
        key: "status",
        label: "Status",
        type: "status",
        placeholder: "All statuses",
    },
];

const labelStatus = (status) =>
    status ? status.charAt(0).toUpperCase() + status.slice(1) : "-";

export default function Index({
    enrollments,
    filters = {},
    selectedFilters = {},
    statuses = [],
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
        ...EMPTY_FILTERS,
        course_id: pageFilters.course_id || "",
        curriculum_id: pageFilters.curriculum_id || "",
        academic_year_id: pageFilters.academic_year_id || "",
        academic_session_id: pageFilters.academic_session_id || "",
        department_id: pageFilters.department_id || "",
        year_of_study: pageFilters.year_of_study || "",
        admission_number: pageFilters.admission_number || "",
        status: pageFilters.status || "",
    });

    const [currentFilterKey, setCurrentFilterKey] = useState("");
    const [activeFilterKeys, setActiveFilterKeys] = useState(
        FILTER_DEFINITIONS.map((filter) => filter.key).filter(
            (key) => Boolean(pageFilters[key]),
        ),
    );

    const setFilter = (key, value) => {
        const definition = FILTER_DEFINITIONS.find(
            (filter) => filter.key === key,
        );

        setForm((current) => {
            const next = {
                ...current,
                [key]: value || "",
            };

            definition?.clears?.forEach((childKey) => {
                next[childKey] = "";
            });

            return next;
        });

        if (definition?.clears?.length) {
            setActiveFilterKeys((current) =>
                current.filter((filterKey) => !definition.clears.includes(filterKey)),
            );
        }
    };

    const selectFilterColumn = (key) => {
        setCurrentFilterKey(key);
    };

    const addCurrentFilter = () => {
        if (!currentFilterKey || !form[currentFilterKey]) return;

        setActiveFilterKeys((current) =>
            current.includes(currentFilterKey)
                ? current
                : [...current, currentFilterKey],
        );
        setCurrentFilterKey("");
    };

    const clearSingleFilter = (key) => {
        const definition = FILTER_DEFINITIONS.find(
            (filter) => filter.key === key,
        );

        setForm((current) => {
            const next = {
                ...current,
                [key]: "",
            };

            definition?.clears?.forEach((childKey) => {
                next[childKey] = "";
            });

            return next;
        });

        setActiveFilterKeys((current) =>
            current.filter(
                (filterKey) =>
                    filterKey !== key &&
                    !definition?.clears?.includes(filterKey),
            ),
        );

        if (currentFilterKey === key) {
            setCurrentFilterKey("");
        }
    };

    const activeFilters = FILTER_DEFINITIONS.filter(
        (filter) =>
            activeFilterKeys.includes(filter.key) && Boolean(form[filter.key]),
    );

    const getSelectedOptionLabel = (filter) => {
        if (filter.type === "status") return labelStatus(form[filter.key]);

        if (filter.type === "select") {
            return (
                filter.options.find(
                    (option) => String(option.value) === String(form[filter.key]),
                )?.label || form[filter.key]
            );
        }

        if (filter.type === "text") return form[filter.key];

        return (
            selectedFilters?.[filter.selectedLabelKey] ||
            selectedFilters?.[filter.key] ||
            form[filter.key]
        );
    };

    const renderFilterInput = (filter) => {
        if (!filter) {
            return (
                <div className="rounded-xl border border-dashed border-zinc-200 bg-zinc-50 px-4 py-2 text-sm text-zinc-400">
                    Select a column to show its input
                </div>
            );
        }

        if (filter.type === "text") {
            return (
                <input
                    type="text"
                    value={form[filter.key]}
                    onChange={(e) => setFilter(filter.key, e.target.value)}
                    placeholder={filter.placeholder}
                    className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
                />
            );
        }

        if (filter.type === "select") {
            return (
                <select
                    value={form[filter.key]}
                    onChange={(e) => setFilter(filter.key, e.target.value)}
                    className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
                >
                    <option value="">{filter.placeholder}</option>
                    {filter.options.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            );
        }

        if (filter.type === "status") {
            return (
                <select
                    value={form.status}
                    onChange={(e) => setFilter("status", e.target.value)}
                    className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
                >
                    <option value="">{filter.placeholder}</option>
                    {statuses.map((status) => (
                        <option key={status} value={status}>
                            {labelStatus(status)}
                        </option>
                    ))}
                </select>
            );
        }

        const disabled = filter.dependsOn && !form[filter.dependsOn];

        return (
            <SearchSelect
                routeName={filter.routeName}
                routeParams={
                    typeof filter.routeParams === "function"
                        ? filter.routeParams(form)
                        : undefined
                }
                disabled={Boolean(disabled)}
                defaultOptions={[]}
                value={form[filter.key]}
                selectedLabel={selectedFilters?.[filter.selectedLabelKey]}
                placeholder={
                    disabled ? filter.disabledPlaceholder : filter.placeholder
                }
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
            route("academic.sessions.enrollments.index"),
            { ...form, sort: field, direction, page: 1 },
            { preserveState: true, replace: true },
        );
    };

    const renderArrow = (field) => {
        if (sortField !== field) return null;
        return sortDirection === "asc" ? "↑" : "↓";
    };

    const submit = (e) => {
        e.preventDefault();

        const appliedFilters = activeFilters.reduce((values, filter) => {
            values[filter.key] = form[filter.key];
            return values;
        }, {});

        router.get(
            route("academic.sessions.enrollments.index"),
            {
                ...appliedFilters,
                sort: sortField,
                direction: sortDirection,
                page: 1,
            },
            { preserveState: true, replace: true },
        );
    };

    const clearFilters = () => {
        setForm(EMPTY_FILTERS);
        setCurrentFilterKey("");
        setActiveFilterKeys([]);

        router.get(
            route("academic.sessions.enrollments.index"),
            { sort: sortField, direction: sortDirection, page: 1 },
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

    const currentFilter = FILTER_DEFINITIONS.find(
        (filter) => filter.key === currentFilterKey,
    );

    return (
        <>
            <Head title="Academic Session Enrollments" />

            <div className="max-w-7xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-700">
                <AcademicCalendarWorkspaceTabs activeTab="enrollments" />

                <form
                    className="mb-4 rounded-lg border border-zinc-100 bg-white p-4 shadow-sm"
                    onSubmit={submit}
                >
                    <div className="grid grid-cols-1 items-end gap-3 lg:grid-cols-[minmax(220px,300px)_minmax(300px,1fr)_auto_auto_auto]">
                        <div>
                            <InputLabel value="Filter Column" />
                            <select
                                value={currentFilterKey}
                                onChange={(e) => selectFilterColumn(e.target.value)}
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
                                    currentFilter ? currentFilter.label : "Filter Value"
                                }
                            />

                            {renderFilterInput(currentFilter)}
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
                                        onClick={() => clearSingleFilter(filter.key)}
                                        className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 ring-1 ring-emerald-100 hover:bg-emerald-100"
                                    >
                                        <span>
                                            {filter.label}: {getSelectedOptionLabel(filter)}
                                        </span>
                                        <span className="text-emerald-900">×</span>
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
                        <THdata>Reg No</THdata>
                        <THdata>Department</THdata>
                        <THdata>Session</THdata>
                        <THdata>Curriculum</THdata>
                        <THdata>Course</THdata>
                        <THdata>Year</THdata>
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
                                    <Tdata>{enrollment.department}</Tdata>
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
                                            {labelStatus(enrollment.status)}
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
                                    colSpan="12"
                                    className="text-center py-4"
                                >
                                    No enrollments found.
                                </Tdata>
                            </Trow>
                        )}
                    </Tbody>
                </Table>
            </div>
        </>
    );
}
