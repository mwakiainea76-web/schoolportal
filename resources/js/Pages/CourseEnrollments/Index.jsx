import React, { useState } from "react";
import { Head, router } from "@inertiajs/react";
import Table from "@/Components/Table/Table";
import Thead from "@/Components/Table/Thead";
import THdata from "@/Components/Table/THdata";
import Tbody from "@/Components/Table/Tbody";
import Trow from "@/Components/Table/Trow";
import Tdata from "@/Components/Table/Tdata";
import formatDate from "@/utils/date";
import InputLabel from "@/Components/InputLabel";
import SearchSelect from "@/Components/SearchSelect";

const STATUS_STYLES = {
    active: "bg-emerald-100 text-emerald-700",
    deferred: "bg-amber-100 text-amber-700",
    transferred: "bg-yellow-100 text-yellow-700",
    suspended: "bg-zinc-100 text-zinc-600",
    completed: "bg-blue-100 text-blue-700",
    dropped: "bg-red-100 text-red-600",
    deactivated: "bg-slate-100 text-slate-600",
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
        label: "Course",
        type: "search",
        routeName: "courses.search",
        placeholder: "Select course...",
        selectedLabelKey: "course",
        clears: ["curriculum_id"],
    },
    {
        key: "curriculum_id",
        label: "Curriculum",
        type: "search",
        routeName: "curriculums.search",
        placeholder: "Select curriculum...",
        selectedLabelKey: "curriculum",
        dependsOn: "course_id",
        disabledPlaceholder: "Select course first",
        routeParams: (form) => ({ course_id: form.course_id }),
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
        routeParams: (form) => ({ academic_year_id: form.academic_year_id }),
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
    courseEnrollments,
    filters = {},
    selectedFilters = {},
    statuses = [],
    department_context = null,
}) {
    const pageFilters =
        filters && !Array.isArray(filters) && typeof filters === "object"
            ? filters
            : {};

    const visibleFilters = department_context
        ? FILTER_DEFINITIONS.filter((filter) => filter.key !== "department_id")
        : FILTER_DEFINITIONS;

    const [form, setForm] = useState({
        ...EMPTY_FILTERS,
        ...Object.fromEntries(
            Object.entries(pageFilters).filter(([key]) => key in EMPTY_FILTERS),
        ),
    });

    const [filterLabels, setFilterLabels] = useState({
        department_id: selectedFilters.department || "",
        course_id: selectedFilters.course || "",
        curriculum_id: selectedFilters.curriculum || "",
        academic_year_id: selectedFilters.academic_year || "",
        academic_session_id: selectedFilters.academic_session || "",
    });

    const firstActiveFilter = visibleFilters.find((filter) => pageFilters[filter.key]);

    const [currentFilterKey, setCurrentFilterKey] = useState(
        firstActiveFilter?.key || "",
    );

    const activeFilters = visibleFilters.filter((filter) => form[filter.key]);

    const setFilterValue = (key, value, label = "") => {
        const filter = FILTER_DEFINITIONS.find((item) => item.key === key);

        setForm((current) => {
            const next = { ...current, [key]: value };
            filter?.clears?.forEach((childKey) => {
                next[childKey] = "";
            });
            return next;
        });

        if (filter?.type === "search") {
            setFilterLabels((current) => ({
                ...current,
                [key]: label,
                ...(filter.clears || []).reduce(
                    (labels, childKey) => ({ ...labels, [childKey]: "" }),
                    {},
                ),
            }));
        }
    };

    const clearSingleFilter = (key) => {
        const nextEmpty = { [key]: "" };

        if (key === "course_id") nextEmpty.curriculum_id = "";
        if (key === "academic_year_id") nextEmpty.academic_session_id = "";

        setForm((current) => ({ ...current, ...nextEmpty }));
        setFilterLabels((current) => ({
            ...current,
            ...Object.keys(nextEmpty).reduce(
                (labels, emptyKey) => ({ ...labels, [emptyKey]: "" }),
                {},
            ),
        }));

        if (currentFilterKey && currentFilterKey in nextEmpty) {
            setCurrentFilterKey("");
        }
    };

    const submit = (e) => {
        e.preventDefault();

        const cleanFilters = Object.fromEntries(
            Object.entries(form).filter(
                ([, value]) => value !== "" && value !== null,
            ),
        );

        router.get(
            route("courses.enrollments.index"),
            { ...cleanFilters, page: 1 },
            { preserveState: true, replace: true },
        );
    };

    const clearFilters = () => {
        setForm(EMPTY_FILTERS);
        setFilterLabels({});
        setCurrentFilterKey("");

        router.get(
            route("courses.enrollments.index"),
            { page: 1 },
            { preserveState: true, replace: true },
        );
    };

    const getSelectedOptionLabel = (filter) => {
        if (filter.type === "search") {
            return (
                filterLabels[filter.key] ||
                selectedFilters[filter.selectedLabelKey] ||
                form[filter.key]
            );
        }

        if (filter.key === "status") return labelStatus(form.status);
        if (filter.key === "year_of_study") return `Year ${form.year_of_study}`;

        return form[filter.key];
    };

    const renderFilterInput = (filter) => {
        if (!filter) return null;

        const isDisabled = filter.dependsOn && !form[filter.dependsOn];

        if (filter.type === "text") {
            return (
                <input
                    type="text"
                    value={form[filter.key]}
                    onChange={(e) => setFilterValue(filter.key, e.target.value)}
                    placeholder={filter.placeholder}
                    className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
                />
            );
        }

        if (filter.type === "select" || filter.type === "status") {
            const options =
                filter.type === "status"
                    ? statuses.map((status) => ({
                          value: status,
                          label: labelStatus(status),
                      }))
                    : filter.options;

            return (
                <select
                    value={form[filter.key]}
                    onChange={(e) => setFilterValue(filter.key, e.target.value)}
                    className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
                >
                    <option value="">{filter.placeholder}</option>
                    {options.map((option) => (
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
                routeParams={
                    filter.routeParams ? filter.routeParams(form) : undefined
                }
                disabled={Boolean(isDisabled)}
                defaultOptions={[]}
                value={form[filter.key]}
                selectedLabel={
                    filterLabels[filter.key] ||
                    selectedFilters[filter.selectedLabelKey]
                }
                placeholder={
                    isDisabled ? filter.disabledPlaceholder : filter.placeholder
                }
                preloadOptions
                onChange={(option) =>
                    setFilterValue(
                        filter.key,
                        option?.id || "",
                        option?.name || option?.label || "",
                    )
                }
            />
        );
    };

    const selectedFilterDefinition = visibleFilters.find(
        (filter) => filter.key === currentFilterKey,
    );

    return (
        <>
            <Head
                title={
                    department_context
                        ? "Department Enrollments"
                        : "Course Enrollments"
                }
            />

            <div className="mx-auto w-full max-w-6xl">
                {department_context ? (
                    <div className="mb-4 rounded-lg border border-zinc-100 bg-white p-4 shadow-sm">
                        <h1 className="text-2xl font-semibold text-zinc-900">
                            Department Enrollments
                        </h1>
                        <p className="mt-1 text-sm text-zinc-500">
                            View student course enrollments within your department
                            only.
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

                            {selectedFilterDefinition ? (
                                renderFilterInput(selectedFilterDefinition)
                            ) : (
                                <div className="rounded-xl border border-dashed border-zinc-200 bg-zinc-50 px-4 py-2 text-sm text-zinc-400">
                                    Select a column to show its input
                                </div>
                            )}
                        </div>

                        <button
                            type="button"
                            onClick={() =>
                                currentFilterKey &&
                                form[currentFilterKey] &&
                                setCurrentFilterKey("")
                            }
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

                <Table pagination={courseEnrollments}>
                    <Thead>
                        <THdata>Student</THdata>
                        <THdata>Reg No</THdata>
                        <THdata>Department</THdata>
                        <THdata>Course</THdata>
                        <THdata>Year</THdata>
                        <THdata>Session</THdata>
                        <THdata>Status</THdata>
                        <THdata>Admitted</THdata>
                    </Thead>
                    <Tbody>
                        {courseEnrollments?.data?.length ? (
                            courseEnrollments.data.map((item) => (
                                <Trow key={item.id}>
                                    <Tdata>{item.student_name || "-"}</Tdata>
                                    <Tdata>
                                        {item.admission_number || "-"}
                                    </Tdata>
                                    <Tdata>{item.department ?? "-"}</Tdata>
                                    <Tdata>{item.course ?? "-"}</Tdata>
                                    <Tdata>{item.year_of_study ?? "-"}</Tdata>
                                    <Tdata>
                                        {item.academic_session ?? "-"}
                                    </Tdata>
                                    <Tdata>
                                        <span
                                            className={`rounded px-2 py-0.5 text-xs ${STATUS_STYLES[item.status] ?? "bg-gray-100 text-gray-600"}`}
                                        >
                                            {labelStatus(item.status)}
                                        </span>
                                    </Tdata>
                                    <Tdata>{formatDate(item.created_at)}</Tdata>
                                </Trow>
                            ))
                        ) : (
                            <Trow>
                                <Tdata colSpan="8" className="py-6 text-center">
                                    No course enrollments found.
                                </Tdata>
                            </Trow>
                        )}
                    </Tbody>
                </Table>
            </div>
        </>
    );
}
