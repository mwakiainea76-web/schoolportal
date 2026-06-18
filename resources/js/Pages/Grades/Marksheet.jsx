import { Head, router, useForm } from "@inertiajs/react";
import { useState } from "react";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import SearchSelect from "@/Components/SearchSelect";
import formatDate from "@/utils/date";

const FILTER_DEFINITIONS = [
    { key: "admission_number", label: "Admission Number", type: "text" },
    { key: "curriculum_mapping_id", label: "Course Mapping" },
    { key: "curriculum_unit_id", label: "Unit" },
    { key: "academic_year_id", label: "Academic Year" },
    { key: "academic_session_id", label: "Session" },
];

export default function Marksheet({
    filters,
    selected_unit,
    course_mappings,
    unit_options,
    filter_options,
    marksheet,
    blocker,
    can_publish,
    selected_filters,
}) {
    const filterForm = useForm({
        admission_number: filters.admission_number || "",
        curriculum_mapping_id: filters.curriculum_mapping_id || "",
        curriculum_unit_id: filters.curriculum_unit_id || "",
        academic_year_id: filters.academic_year_id || "",
        academic_session_id: filters.academic_session_id || "",
    });
    const [exportFormat, setExportFormat] = useState("pdf");

    const loadMarksheet = (event) => {
        event?.preventDefault();
        router.get(route("academic.marks.marksheet.index"), filterForm.data, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const clearFilters = () => {
        filterForm.setData({
            curriculum_mapping_id: "",
            curriculum_unit_id: "",
            academic_year_id: "",
            academic_session_id: "",
            admission_number: "",
        });
    };

    const clearSingleFilter = (key) => {
        const updates = { [key]: "" };

        if (key === "curriculum_mapping_id") {
            updates.curriculum_unit_id = "";
            updates.academic_year_id = "";
            updates.academic_session_id = "";
        }

        if (key === "academic_year_id") {
            updates.academic_session_id = "";
        }

        filterForm.setData({ ...filterForm.data, ...updates });
    };

    const downloadMarksheet = () => {
        const params = new URLSearchParams();

        Object.entries({
            ...filterForm.data,
            format: exportFormat,
        }).forEach(([key, value]) => {
            if (value !== null && value !== undefined && value !== "") {
                params.set(key, value);
            }
        });

        window.open(
            `${route("academic.marks.marksheet.export")}?${params.toString()}`,
            "_blank",
            "noopener,noreferrer",
        );
    };

    const selectedLabel = (filter) => {
        const value = filterForm.data[filter.key];

        if (!value) return "";

        if (filter.key === "curriculum_mapping_id") {
            return (
                course_mappings.find(
                    (mapping) => String(mapping.id) === String(value),
                )?.name || value
            );
        }

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

    const activeFilters = FILTER_DEFINITIONS.filter(
        (filter) => filterForm.data[filter.key],
    );

    const rows = marksheet?.rows ?? [];
    const pagination = marksheet?.pagination ?? {
        current_page: 1,
        last_page: 1,
        total: rows.length,
    };
    const meta = marksheet?.meta ?? {};

    const goToPage = (page) => {
        router.get(
            route("academic.marks.marksheet.index"),
            {
                ...filterForm.data,
                page,
            },
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
    };

    return (
        <>
            <Head title="FA Marksheet" />

            <div className="mx-auto max-w-7xl space-y-8">
                <form
                    onSubmit={loadMarksheet}
                    className="rounded-lg border border-zinc-100 bg-white p-4 shadow-sm"
                >
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                        <div>
                            <InputLabel value="Admission Number" />
                            <input
                                type="text"
                                value={filterForm.data.admission_number}
                                onChange={(e) =>
                                    filterForm.setData(
                                        "admission_number",
                                        e.target.value,
                                    )
                                }
                                placeholder="Search admission number..."
                                className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
                            />
                        </div>

                        <div>
                            <InputLabel value="Course Mapping" />
                            <select
                                value={filterForm.data.curriculum_mapping_id}
                                onChange={(event) => {
                                    filterForm.setData(
                                        "curriculum_mapping_id",
                                        event.target.value,
                                    );
                                    filterForm.setData("curriculum_unit_id", "");
                                    filterForm.setData("academic_year_id", "");
                                    filterForm.setData(
                                        "academic_session_id",
                                        "",
                                    );
                                }}
                                className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
                            >
                                <option value="">
                                    Select course mapping...
                                </option>
                                {course_mappings.map((mapping) => (
                                    <option key={mapping.id} value={mapping.id}>
                                        {mapping.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <InputLabel value="Unit" />
                            <SearchSelect
                                routeName="units.search"
                                routeParams={{
                                    curriculum_mapping_id:
                                        filterForm.data.curriculum_mapping_id,
                                    limit: 10,
                                }}
                                defaultOptions={unit_options}
                                value={filterForm.data.curriculum_unit_id}
                                selectedLabel={selectedLabel({
                                    key: "curriculum_unit_id",
                                })}
                                placeholder={
                                    filterForm.data.curriculum_mapping_id
                                        ? "Search unit..."
                                        : "Select course mapping first..."
                                }
                                preloadOptions
                                onChange={(unit) =>
                                    filterForm.setData(
                                        "curriculum_unit_id",
                                        unit?.id || "",
                                    )
                                }
                                error={filterForm.errors.curriculum_unit_id}
                                disabled={
                                    !filterForm.data.curriculum_mapping_id
                                }
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
                    </div>

                    <InputError
                        message={filterForm.errors.curriculum_mapping_id}
                        className="mt-2"
                    />
                    <InputError
                        message={filterForm.errors.curriculum_unit_id}
                        className="mt-2"
                    />

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
                                            {selectedLabel(filter)}
                                        </span>
                                        <span className="text-emerald-900">
                                            x
                                        </span>
                                    </button>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-zinc-500">
                                No filters selected. Set filter values above to
                                load the marksheet.
                            </p>
                        )}
                    </div>

                    <div className="mt-4 flex items-center justify-between border-t border-zinc-100 pt-3">
                        <div className="flex gap-2">
                            <button
                                type="submit"
                                disabled={
                                    !filterForm.data.curriculum_unit_id
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
                                onClick={downloadMarksheet}
                                disabled={!filterForm.data.curriculum_unit_id}
                                className="h-[34px] whitespace-nowrap rounded-r bg-gray-400 px-4 text-sm font-medium text-white transition-colors hover:bg-gray-600 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                Export {exportFormat.toUpperCase()}
                            </button>
                        </div>
                    </div>
                </form>

                {blocker ? (
                    <div className="rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-800">
                        {blocker}
                    </div>
                ) : null}

                {selected_unit && !blocker ? (
                    <div className="overflow-hidden border border-zinc-200 bg-white px-5 py-6 shadow-sm">
                        <div className="text-[12px] text-black">
                            <div className="mb-6 text-center text-[15px] font-semibold uppercase tracking-wide text-blue-800 underline">
                                Formative Assessment (FA) Marksheet Per Unit of
                                Competency
                            </div>

                            <div className="mb-3 grid grid-cols-1 gap-x-10 gap-y-3 md:grid-cols-[1fr_1fr_0.9fr]">
                                <div>
                                    <span className="font-bold">
                                        Assessment Center Code:
                                    </span>
                                </div>
                                <div>
                                    <span className="font-bold">
                                        Assessment Center Name:
                                    </span>{" "}
                                    {meta.assessment_center_name || ""}
                                </div>
                                <div>
                                    <span className="font-bold">
                                        Term Dates:
                                    </span>{" "}
                                    From{" "}
                                    {meta.term_from
                                        ? formatDate(meta.term_from)
                                        : ""}{" "}
                                    to{" "}
                                    {meta.term_to
                                        ? formatDate(meta.term_to)
                                        : ""}
                                </div>
                            </div>

                            <div className="mb-3 grid grid-cols-1 gap-x-10 gap-y-3 md:grid-cols-[1fr_1fr_0.9fr]">
                                <div>
                                    <span className="font-bold">
                                        Course Code:
                                    </span>{" "}
                                    {meta.course_code || ""}
                                </div>
                                <div>
                                    <span className="font-bold">
                                        Course Title:
                                    </span>{" "}
                                    {meta.course_title || ""}
                                </div>
                                <div>
                                    <span className="font-bold">
                                        Unit Code:
                                    </span>{" "}
                                    {meta.unit_code || ""}
                                </div>
                            </div>

                            <div className="mb-5">
                                <span className="font-bold">Unit Title:</span>{" "}
                                {meta.unit_title || ""}
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full min-w-[980px] border-collapse border border-zinc-500 text-[12px]">
                                    <thead>
                                        <tr className="bg-white">
                                            <th
                                                rowSpan="2"
                                                className="w-[44px] border border-zinc-500 bg-zinc-50 px-1 py-2 text-left font-bold"
                                            >
                                                S/N
                                            </th>
                                            <th
                                                rowSpan="2"
                                                className="w-[220px] border border-zinc-500 bg-zinc-50 px-1 py-2 text-left font-bold"
                                            >
                                                Candidate&apos;s Reg Code
                                            </th>
                                            <th
                                                rowSpan="2"
                                                className="w-[180px] border border-zinc-500 bg-zinc-50 px-1 py-2 text-left font-bold"
                                            >
                                                Candidate&apos;s Name
                                            </th>
                                            <th
                                                colSpan="4"
                                                className="border border-zinc-500 bg-zinc-200 px-1 py-1 text-center font-bold"
                                            >
                                                Continuous Theory (CT) Marks
                                                (100%)
                                            </th>
                                            <th
                                                colSpan="4"
                                                className="border border-zinc-500 bg-orange-50 px-1 py-1 text-center font-bold"
                                            >
                                                Continuous Practical (CP) Marks
                                                (100%)
                                            </th>
                                        </tr>
                                        <tr className="bg-white">
                                            <th className="w-[80px] border border-zinc-500 bg-zinc-50 px-1 py-1 text-center font-bold">
                                                FA 1
                                            </th>
                                            <th className="w-[80px] border border-zinc-500 bg-zinc-50 px-1 py-1 text-center font-bold">
                                                FA 2
                                            </th>
                                            <th className="w-[80px] border border-zinc-500 bg-zinc-50 px-1 py-1 text-center font-bold">
                                                FA 3
                                            </th>
                                            <th className="w-[140px] border border-zinc-500 bg-zinc-200 px-1 py-1 text-center font-bold">
                                                Average
                                            </th>
                                            <th className="w-[92px] border border-zinc-500 bg-orange-50 px-1 py-1 text-center font-bold">
                                                Pract 1
                                            </th>
                                            <th className="w-[92px] border border-zinc-500 bg-orange-50 px-1 py-1 text-center font-bold">
                                                Pract 2
                                            </th>
                                            <th className="w-[92px] border border-zinc-500 bg-orange-50 px-1 py-1 text-center font-bold">
                                                Pract 3
                                            </th>
                                            <th className="w-[140px] border border-zinc-500 bg-orange-100 px-1 py-1 text-center font-bold">
                                                Average
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {rows.map((row, index) => (
                                            <tr
                                                key={
                                                    row.admission_number ||
                                                    index
                                                }
                                            >
                                                <td className="border border-zinc-500 px-1 py-1 text-center">
                                                    {`${index + 1}.`}
                                                </td>
                                                <td className="border border-zinc-500 px-1 py-1">
                                                    {row.admission_number ||
                                                        ""}
                                                </td>
                                                <td className="border border-zinc-500 px-1 py-1">
                                                    {row.student_name || ""}
                                                </td>
                                                <td className="border border-zinc-500 px-1 py-1 text-center">
                                                    {row.theory?.[1] || ""}
                                                </td>
                                                <td className="border border-zinc-500 px-1 py-1 text-center">
                                                    {row.theory?.[2] || ""}
                                                </td>
                                                <td className="border border-zinc-500 px-1 py-1 text-center">
                                                    {row.theory?.[3] || ""}
                                                </td>
                                                <td className="border border-zinc-500 bg-zinc-100 px-1 py-1 text-center font-semibold text-rose-700">
                                                    {row.theory_average || ""}
                                                </td>
                                                <td className="border border-zinc-500 px-1 py-1 text-center">
                                                    {row.practical?.[1] || ""}
                                                </td>
                                                <td className="border border-zinc-500 px-1 py-1 text-center">
                                                    {row.practical?.[2] || ""}
                                                </td>
                                                <td className="border border-zinc-500 px-1 py-1 text-center">
                                                    {row.practical?.[3] || ""}
                                                </td>
                                                <td className="border border-zinc-500 bg-orange-50 px-1 py-1 text-center font-semibold text-rose-700">
                                                    {row.practical_average ||
                                                        ""}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {pagination.last_page > 1 ? (
                                <div className="flex items-center justify-between pt-3">
                                    <div className="text-sm text-zinc-600">
                                        Page {pagination.current_page} of{" "}
                                        {pagination.last_page} |{" "}
                                        {pagination.total} students
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                goToPage(
                                                    pagination.current_page - 1,
                                                )
                                            }
                                            disabled={
                                                pagination.current_page === 1
                                            }
                                            className="rounded-lg border border-zinc-200 px-3 py-1.5 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-40"
                                        >
                                            Prev
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                goToPage(
                                                    pagination.current_page + 1,
                                                )
                                            }
                                            disabled={
                                                pagination.current_page ===
                                                pagination.last_page
                                            }
                                            className="rounded-lg border border-zinc-200 px-3 py-1.5 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-40"
                                        >
                                            Next
                                        </button>
                                    </div>
                                </div>
                            ) : null}
                        </div>
                    </div>
                ) : null}
            </div>
        </>
    );
}
