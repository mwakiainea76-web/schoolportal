import { Head, router, useForm } from "@inertiajs/react";
import { useState } from "react";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import SearchSelect from "@/Components/SearchSelect";

const FILTER_DEFINITIONS = [
    { key: "curriculum_unit_id", label: "Unit" },
    {
        key: "assessment_type",
        label: "Assessment Type",
        options: [
            { value: "theory", label: "Theory" },
            { value: "practical", label: "Practical" },
        ],
    },
    { key: "assessment_number", label: "Assessment Number", type: "number" },
    { key: "academic_year_id", label: "Academic Year" },
    { key: "academic_session_id", label: "Session" },
];

export default function View({
    filters,
    selected_unit,
    submitted_marks,
    unit_options,
    filter_options,
    blocker,
    selected_filters,
}) {
    const filterForm = useForm({
        curriculum_unit_id: filters.curriculum_unit_id || "",
        assessment_type: filters.assessment_type || "",
        assessment_number: filters.assessment_number || "",
        academic_year_id: filters.academic_year_id || "",
        academic_session_id: filters.academic_session_id || "",
    });

    const marks = submitted_marks?.data ?? [];
    const currentPage = submitted_marks?.current_page ?? 1;
    const lastPage = submitted_marks?.last_page ?? 1;
    const [exportFormat, setExportFormat] = useState("pdf");

    const searchMarks = (page = 1) => {
        router.get(
            route("academic.marks.view.index"),
            { ...filterForm.data, search_marks: true, page },
            { preserveState: true, preserveScroll: true },
        );
    };

    const clearFilters = () => {
        filterForm.setData({
            curriculum_unit_id: "",
            assessment_type: "",
            assessment_number: "",
            academic_year_id: "",
            academic_session_id: "",
        });
    };

    const exportMarks = () => {
        const params = new URLSearchParams();

        Object.entries({
            ...filterForm.data,
            format: exportFormat,
            context: "view",
        }).forEach(([key, value]) => {
            if (value !== null && value !== undefined && value !== "") {
                params.set(key, value);
            }
        });

        window.open(
            `${route("academic.marks.export")}?${params.toString()}`,
            "_blank",
            "noopener,noreferrer",
        );
    };

    const selectedLabel = (filter) => {
        const value = filterForm.data[filter.key];

        if (!value) return "";

        if (filter.key === "curriculum_unit_id") {
            return (
                unit_options.find((unit) => String(unit.id) === String(value))
                    ?.display_name ||
                unit_options.find((unit) => String(unit.id) === String(value))
                    ?.name ||
                selected_unit?.display_name ||
                selected_unit?.name ||
                value
            );
        }

        if (filter.key === "assessment_type") {
            return (
                filter.options.find((option) => option.value === value)
                    ?.label || value
            );
        }

        if (filter.key === "assessment_number") {
            return `Assessment ${value}`;
        }

        if (filter.key === "academic_year_id") {
            return (
                filter_options?.academic_years?.find(
                    (year) => String(year.value) === String(value),
                )?.label ||
                selected_filters?.academic_year?.name ||
                value
            );
        }

        if (filter.key === "academic_session_id") {
            return (
                filter_options?.sessions?.find(
                    (session) => String(session.value) === String(value),
                )?.label ||
                selected_filters?.academic_session?.name ||
                value
            );
        }

        return value;
    };

    return (
        <>
            <Head title="View Marks" />

            <div className="mx-auto max-w-6xl space-y-8">
                <form
                    className="rounded-lg border border-zinc-100 bg-white p-4 shadow-sm"
                    onSubmit={(event) => {
                        event.preventDefault();
                        searchMarks();
                    }}
                >
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                        <div>
                            <InputLabel value="Unit" />
                            <SearchSelect
                                routeName="units.search"
                                routeParams={{ limit: 10 }}
                                defaultOptions={unit_options}
                                value={filterForm.data.curriculum_unit_id}
                                selectedLabel={selectedLabel({
                                    key: "curriculum_unit_id",
                                })}
                                placeholder="Search unit..."
                                preloadOptions
                                onChange={(unit) =>
                                    filterForm.setData(
                                        "curriculum_unit_id",
                                        unit?.id || "",
                                    )
                                }
                                error={filterForm.errors.curriculum_unit_id}
                            />
                        </div>

                        <div>
                            <InputLabel value="Academic Year" />
                            <SearchSelect
                                routeName="academic.years.search"
                                value={filterForm.data.academic_year_id}
                                selectedLabel={selectedLabel({
                                    key: "academic_year_id",
                                })}
                                placeholder="Select academic year..."
                                defaultOptions={
                                    filter_options?.academic_years?.map(
                                        (year) => ({
                                            id: year.value,
                                            name: year.label,
                                        }),
                                    ) ?? []
                                }
                                preloadOptions
                                onChange={(academicYear) => {
                                    filterForm.setData(
                                        "academic_year_id",
                                        academicYear?.id || "",
                                    );
                                    filterForm.setData(
                                        "academic_session_id",
                                        "",
                                    );
                                }}
                            />
                        </div>

                        <div>
                            <InputLabel value="Session" />
                            <SearchSelect
                                routeName="academic.sessions.search"
                                routeParams={{
                                    academic_year_id:
                                        filterForm.data.academic_year_id,
                                }}
                                value={filterForm.data.academic_session_id}
                                selectedLabel={selectedLabel({
                                    key: "academic_session_id",
                                })}
                                placeholder={
                                    filterForm.data.academic_year_id
                                        ? "Search session..."
                                        : "Select academic year first..."
                                }
                                defaultOptions={
                                    filter_options?.sessions?.map(
                                        (session) => ({
                                            id: session.value,
                                            name: session.label,
                                        }),
                                    ) ?? []
                                }
                                preloadOptions
                                onChange={(session) =>
                                    filterForm.setData(
                                        "academic_session_id",
                                        session?.id || "",
                                    )
                                }
                                disabled={
                                    !filterForm.data.academic_year_id
                                }
                            />
                        </div>

                        <div>
                            <InputLabel value="Assessment Type" />
                            <select
                                value={filterForm.data.assessment_type}
                                onChange={(e) =>
                                    filterForm.setData(
                                        "assessment_type",
                                        e.target.value,
                                    )
                                }
                                className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
                            >
                                <option value="">All Assessment Types</option>
                                <option value="theory">Theory</option>
                                <option value="practical">Practical</option>
                            </select>
                        </div>

                        <div>
                            <InputLabel value="Assessment Number" />
                            <input
                                type="number"
                                min="1"
                                step="1"
                                list="view-assessment-number-options"
                                value={filterForm.data.assessment_number}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    filterForm.setData(
                                        "assessment_number",
                                        value === ""
                                            ? ""
                                            : value.replace(/\D/g, ""),
                                    );
                                }}
                                placeholder="All Assessments or type a number"
                                className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
                            />
                            <datalist id="view-assessment-number-options">
                                {(filter_options?.assessment_numbers ?? []).map(
                                    (assessment) => (
                                        <option
                                            key={assessment.value}
                                            value={assessment.value}
                                        >
                                            {assessment.label}
                                        </option>
                                    ),
                                )}
                            </datalist>
                        </div>
                    </div>

                    <InputError
                        message={filterForm.errors.curriculum_unit_id}
                        className="mt-2"
                    />

                    <div className="mt-4 flex flex-col gap-3 border-t border-zinc-100 pt-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex gap-2">
                            <button
                                type="submit"
                                disabled={
                                    !filterForm.data.curriculum_unit_id ||
                                    !filterForm.data.academic_year_id ||
                                    !filterForm.data.academic_session_id
                                }
                                className="inline-flex h-10 items-center justify-center rounded-lg bg-emerald-600 px-6 text-sm text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                Apply
                            </button>
                            <button
                                type="button"
                                onClick={clearFilters}
                                className="inline-flex h-10 items-center justify-center rounded-lg border border-zinc-300 bg-white px-4 text-sm text-zinc-700 hover:bg-zinc-50"
                            >
                                Clear all
                            </button>
                        </div>

                        <div className="flex items-center">
                            {selected_unit && (
                                <span className="mr-3 text-sm font-semibold text-zinc-800">
                                    {selected_unit.code} - {selected_unit.name}
                                </span>
                            )}
                            <select
                                value={exportFormat}
                                onChange={(event) =>
                                    setExportFormat(event.target.value)
                                }
                                className="h-[34px] rounded-l border border-slate-300 border-r-0 bg-white px-3 text-sm text-slate-700 focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-inset focus:ring-gray-500"
                            >
                                <option value="pdf">PDF</option>
                                <option value="csv">CSV</option>
                                <option value="excel">Excel</option>
                            </select>
                            <button
                                type="button"
                                onClick={exportMarks}
                                disabled={
                                    !filterForm.data.curriculum_unit_id ||
                                    !filterForm.data.academic_year_id ||
                                    !filterForm.data.academic_session_id
                                }
                                className="h-[34px] whitespace-nowrap rounded-r bg-gray-400 px-4 text-sm font-medium text-white transition-colors hover:bg-gray-600 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                Export {exportFormat.toUpperCase()}
                            </button>
                        </div>
                    </div>
                </form>

                {blocker && (
                    <div className="rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-800">
                        {blocker}
                    </div>
                )}

                {marks.length > 0 && (
                    <div className="rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm">
                        <h2 className="text-xl font-semibold text-zinc-900">
                            Submitted Marks
                        </h2>
                        <p className="mt-1 text-sm text-zinc-500">
                            Results are shown for the selected assessment
                            filters, with pagination when multiple assessments
                            are included.
                        </p>

                        <div className="mt-6 overflow-hidden rounded-2xl border border-zinc-100">
                            <div className="overflow-x-auto">
                                <table className="w-full min-w-[48rem] border-collapse">
                                    <thead className="bg-zinc-50">
                                        <tr className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                                            <th className="px-4 py-3 text-left">
                                                Reg. No.
                                            </th>
                                            <th className="px-4 py-3 text-left">
                                                Student
                                            </th>
                                            <th className="px-4 py-3 text-left">
                                                Unit
                                            </th>
                                            <th className="px-4 py-3 text-left">
                                                Session
                                            </th>
                                            <th className="px-4 py-3 text-left">
                                                Type
                                            </th>
                                            <th className="px-4 py-3 text-left">
                                                Assessment
                                            </th>
                                            <th className="px-4 py-3 text-left">
                                                Marks
                                            </th>
                                            <th className="px-4 py-3 text-left">
                                                Status
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-zinc-100 bg-white">
                                        {marks.length ? (
                                            marks.map((mark) => (
                                                <tr
                                                    key={mark.id}
                                                    className="text-sm"
                                                >
                                                    <td className="px-4 py-3 font-medium text-zinc-900">
                                                        {mark.admission_number}
                                                    </td>
                                                    <td className="px-4 py-3 text-zinc-700">
                                                        {mark.student_name ||
                                                            "-"}
                                                    </td>
                                                    <td className="px-4 py-3 text-zinc-700">
                                                        {mark.unit_name || "-"}
                                                    </td>
                                                    <td className="px-4 py-3 text-zinc-700">
                                                        {mark.session_name ||
                                                            "-"}
                                                    </td>
                                                    <td className="px-4 py-3 text-zinc-700">
                                                        {mark.assessment_type ||
                                                            "-"}
                                                    </td>
                                                    <td className="px-4 py-3 text-zinc-700">
                                                        {mark.assessment_number ||
                                                            "-"}
                                                    </td>
                                                    <td className="px-4 py-3 font-semibold text-zinc-900">
                                                        {mark.marks}
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <span
                                                            className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                                                mark.is_published
                                                                    ? "bg-emerald-100 text-emerald-700"
                                                                    : "bg-amber-100 text-amber-700"
                                                            }`}
                                                        >
                                                            {mark.is_published
                                                                ? "Published"
                                                                : "Unpublished"}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td
                                                    colSpan="8"
                                                    className="px-4 py-8 text-center text-sm text-zinc-500"
                                                >
                                                    {submitted_marks
                                                        ? "No submitted marks found for the selected filters."
                                                        : "Run a search to view submitted marks."}
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {lastPage > 1 && (
                            <div className="mt-5 flex justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() =>
                                        searchMarks(currentPage - 1)
                                    }
                                    disabled={currentPage === 1}
                                    className="rounded-lg border border-zinc-200 px-3 py-1.5 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                    Prev
                                </button>
                                <button
                                    type="button"
                                    onClick={() =>
                                        searchMarks(currentPage + 1)
                                    }
                                    disabled={currentPage === lastPage}
                                    className="rounded-lg border border-zinc-200 px-3 py-1.5 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </>
    );
}
