import { Head, router, useForm } from "@inertiajs/react";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import SearchSelect from "@/Components/SearchSelect";
import MarksWorkspaceTabs from "@/Pages/Grades/Partials/MarksWorkspaceTabs";
import formatDate from "@/utils/date";

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
        curriculum_mapping_id: filters.curriculum_mapping_id || "",
        curriculum_unit_id: filters.curriculum_unit_id || "",
        academic_year_id: filters.academic_year_id || "",
        academic_session_id: filters.academic_session_id || "",
    });

    const loadUnits = (mappingId) => {
        router.get(
            route("academic.marks.marksheet.index"),
            {
                curriculum_mapping_id: mappingId,
            },
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            },
        );
    };

    const syncAcademicYear = (academicYear) => {
        router.get(
            route("academic.marks.marksheet.index"),
            {
                curriculum_mapping_id: filterForm.data.curriculum_mapping_id,
                curriculum_unit_id: filterForm.data.curriculum_unit_id,
                academic_year_id: academicYear.id || "",
                academic_session_id: "",
            },
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            },
        );
    };

    const loadMarksheet = (event) => {
        event.preventDefault();

        router.get(route("academic.marks.marksheet.index"), filterForm.data, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const downloadMarksheet = (format) => {
        const params = new URLSearchParams();

        Object.entries({
            ...filterForm.data,
            format,
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
                    className="space-y-6 rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm"
                >
                    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
                        <div>
                            <InputLabel value="Course Mapping" required />
                            <select
                                value={filterForm.data.curriculum_mapping_id}
                                onChange={(event) => {
                                    filterForm.setData(
                                        "curriculum_mapping_id",
                                        event.target.value,
                                    );
                                    filterForm.setData(
                                        "curriculum_unit_id",
                                        "",
                                    );
                                    filterForm.setData("academic_year_id", "");
                                    filterForm.setData(
                                        "academic_session_id",
                                        "",
                                    );
                                    loadUnits(event.target.value);
                                }}
                                className="mt-2 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-400"
                            >
                                <option value="">Select course mapping</option>
                                {course_mappings.map((mapping) => (
                                    <option key={mapping.id} value={mapping.id}>
                                        {mapping.name}
                                    </option>
                                ))}
                            </select>
                            <InputError
                                message={
                                    filterForm.errors.curriculum_mapping_id
                                }
                                className="mt-2"
                            />
                        </div>

                        <div>
                            <InputLabel value="Unit" required />
                            <div className="mt-2">
                                <SearchSelect
                                    routeName="units.search"
                                    routeParams={{
                                        curriculum_mapping_id:
                                            filterForm.data
                                                .curriculum_mapping_id,
                                        limit: 10,
                                    }}
                                    defaultOptions={unit_options}
                                    value={filterForm.data.curriculum_unit_id}
                                    selectedLabel={
                                        selected_unit
                                            ? selected_unit.display_name
                                            : null
                                    }
                                    placeholder={
                                        filterForm.data.curriculum_mapping_id
                                            ? "Search unit..."
                                            : "Select course mapping first..."
                                    }
                                    preloadOptions
                                    onChange={(unit) =>
                                        filterForm.setData(
                                            "curriculum_unit_id",
                                            unit.id || "",
                                        )
                                    }
                                    error={filterForm.errors.curriculum_unit_id}
                                    disabled={
                                        !filterForm.data.curriculum_mapping_id
                                    }
                                />
                            </div>
                            <InputError
                                message={filterForm.errors.curriculum_unit_id}
                                className="mt-2"
                            />
                        </div>

                        <div>
                            <InputLabel value="Academic Year" />
                            <div className="mt-2">
                                <SearchSelect
                                    routeName="academic.years.search"
                                    value={filterForm.data.academic_year_id}
                                    selectedLabel={
                                        selected_filters?.academic_year?.name
                                    }
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
                                            academicYear.id || "",
                                        );
                                        filterForm.setData(
                                            "academic_session_id",
                                            "",
                                        );
                                        syncAcademicYear(academicYear);
                                    }}
                                />
                            </div>
                        </div>

                        <div>
                            <InputLabel value="Session" />
                            <div className="mt-2">
                                <SearchSelect
                                    routeName="academic.sessions.search"
                                    routeParams={{
                                        academic_year_id:
                                            filterForm.data.academic_year_id,
                                    }}
                                    value={filterForm.data.academic_session_id}
                                    selectedLabel={
                                        selected_filters?.academic_session?.name
                                    }
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
                                            session.id || "",
                                        )
                                    }
                                    disabled={!filterForm.data.academic_year_id}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <button
                            type="submit"
                            disabled={!filterForm.data.curriculum_unit_id}
                            className="rounded-xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            Load Marksheet
                        </button>
                        <button
                            type="button"
                            onClick={() => downloadMarksheet("csv")}
                            disabled={!filterForm.data.curriculum_unit_id}
                            className="rounded-xl border border-zinc-200 bg-white px-6 py-3 text-sm font-semibold text-zinc-900 transition hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            Download CSV
                        </button>
                        <button
                            type="button"
                            onClick={() => downloadMarksheet("excel")}
                            disabled={!filterForm.data.curriculum_unit_id}
                            className="rounded-xl border border-zinc-200 bg-white px-6 py-3 text-sm font-semibold text-zinc-900 transition hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            Download Excel
                        </button>
                    </div>
                </form>

                {blocker ? (
                    <div className="rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-800">
                        {blocker}
                    </div>
                ) : null}

                {selected_unit && !blocker ? (
                    <div className="overflow-hidden rounded-3xl border border-zinc-300 bg-white p-6 shadow-sm">
                        <div className="space-y-4 text-[13px] text-zinc-900">
                            <div className="text-sm font-semibold">
                                {meta.session_name || ""}
                            </div>

                            <div className="text-center text-base font-bold uppercase tracking-wide text-blue-800 underline">
                                Formative Assessment (FA) Marksheet Per Unit of
                                Competency
                            </div>

                            <div className="grid gap-x-10 gap-y-2 md:grid-cols-3">
                                <div>
                                    <span className="font-semibold">
                                        Assessment Center Code:
                                    </span>{" "}
                                    {meta.assessment_center_code || ""}
                                </div>
                                <div>
                                    <span className="font-semibold">
                                        Assessment Center Name:
                                    </span>{" "}
                                    {meta.assessment_center_name || ""}
                                </div>
                                <div>
                                    <span className="font-semibold">
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
                                <div>
                                    <span className="font-semibold">
                                        Course Code:
                                    </span>{" "}
                                    {meta.course_code || ""}
                                </div>
                                <div>
                                    <span className="font-semibold">
                                        Course Title:
                                    </span>{" "}
                                    {meta.course_title || ""}
                                </div>
                                <div>
                                    <span className="font-semibold">
                                        Unit Code:
                                    </span>{" "}
                                    {meta.unit_code || ""}
                                </div>
                                <div className="md:col-span-3">
                                    <span className="font-semibold">
                                        Unit Title:
                                    </span>{" "}
                                    {meta.unit_title || ""}
                                </div>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full  border-collapse border border-zinc-500 text-[12px]">
                                    <thead>
                                        <tr className="bg-white">
                                            <th
                                                rowSpan="2"
                                                className="border border-zinc-500 bg-zinc-50  text-left"
                                            >
                                                S/N
                                            </th>
                                            <th
                                                rowSpan="2"
                                                className="border border-zinc-500 bg-zinc-50  text-left"
                                            >
                                                Candidate&apos;s Reg Code
                                            </th>
                                            <th
                                                rowSpan="2"
                                                className="border border-zinc-500 bg-zinc-50  text-left"
                                            >
                                                Candidate&apos;s Name
                                            </th>
                                            <th
                                                colSpan="4"
                                                className="border border-zinc-500 bg-zinc-200  text-center"
                                            >
                                                Continuous Theory (CT) Marks
                                                (100%)
                                            </th>
                                            <th
                                                colSpan="4"
                                                className="border border-zinc-500 bg-orange-100  text-center"
                                            >
                                                Continuous Practical (CP) Marks
                                                (100%)
                                            </th>
                                        </tr>
                                        <tr className="bg-white">
                                            <th className="border border-zinc-500 bg-zinc-100  text-center">
                                                FA 1
                                            </th>
                                            <th className="border border-zinc-500 bg-zinc-100  text-center">
                                                FA 2
                                            </th>
                                            <th className="border border-zinc-500 bg-zinc-100  text-center">
                                                FA 3
                                            </th>
                                            <th className="border border-zinc-500 bg-zinc-200  text-center">
                                                Average
                                            </th>
                                            <th className="border border-zinc-500 bg-orange-50  text-center">
                                                Pract 1
                                            </th>
                                            <th className="border border-zinc-500 bg-orange-50  text-center">
                                                Pract 2
                                            </th>
                                            <th className="border border-zinc-500 bg-orange-50  text-center">
                                                Pract 3
                                            </th>
                                            <th className="border border-zinc-500 bg-orange-100  text-center">
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
                                                <td className="border border-zinc-500  text-center">
                                                    {`${index + 1}.`}
                                                </td>
                                                <td className="border border-zinc-500 ">
                                                    {row.admission_number ||
                                                        ""}
                                                </td>
                                                <td className="border border-zinc-500 ">
                                                    {row.student_name || ""}
                                                </td>
                                                <td className="border border-zinc-500  text-center">
                                                    {row.theory?.[1] || ""}
                                                </td>
                                                <td className="border border-zinc-500  text-center">
                                                    {row.theory?.[2] || ""}
                                                </td>
                                                <td className="border border-zinc-500  text-center">
                                                    {row.theory?.[3] || ""}
                                                </td>
                                                <td className="border border-zinc-500 bg-zinc-100  text-center font-semibold text-rose-700">
                                                    {row.theory_average || ""}
                                                </td>
                                                <td className="border border-zinc-500  text-center">
                                                    {row.practical?.[1] || ""}
                                                </td>
                                                <td className="border border-zinc-500  text-center">
                                                    {row.practical?.[2] || ""}
                                                </td>
                                                <td className="border border-zinc-500  text-center">
                                                    {row.practical?.[3] || ""}
                                                </td>
                                                <td className="border border-zinc-500 bg-orange-50  text-center font-semibold text-rose-700">
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
                ) : null}
            </div>
        </>
    );
}
