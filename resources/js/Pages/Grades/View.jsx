import { Head, router, useForm } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import InputLabel from "@/Components/InputLabel";
import InputError from "@/Components/InputError";
import SearchSelect from "@/Components/SearchSelect";
import MarksWorkspaceTabs from "@/Pages/Grades/Partials/MarksWorkspaceTabs";

export default function View({
    filters,
    selected_unit,
    submitted_marks,
    course_mappings,
    unit_options,
    filter_options,
    blocker,
    can_publish,
    selected_filters,
}) {
    const filterForm = useForm({
        curriculum_mapping_id: filters.curriculum_mapping_id || "",
        curriculum_unit_id: filters.curriculum_unit_id || "",
        assessment_type: filters.assessment_type || "",
        assessment_number: filters.assessment_number || "",
        academic_year_id: filters.academic_year_id || "",
        academic_session_id: filters.academic_session_id || "",
    });

    const marks = submitted_marks?.data ?? [];
    const currentPage = submitted_marks?.current_page ?? 1;
    const lastPage = submitted_marks?.last_page ?? 1;

    const loadUnits = (mappingId) => {
        router.get(
            route("academic.marks.view.index"),
            {
                curriculum_mapping_id: mappingId,
                assessment_type: filterForm.data.assessment_type,
                assessment_number: filterForm.data.assessment_number,
            },
            { preserveState: true, preserveScroll: true, replace: true },
        );
    };

    const searchMarks = (page = 1) => {
        router.get(
            route("academic.marks.view.index"),
            {
                ...filterForm.data,
                search_marks: true,
                page,
            },
            { preserveState: true, preserveScroll: true },
        );
    };

    const syncAcademicYear = (academicYear) => {
        router.get(
            route("academic.marks.view.index"),
            {
                curriculum_mapping_id: filterForm.data.curriculum_mapping_id,
                curriculum_unit_id: filterForm.data.curriculum_unit_id,
                assessment_type: filterForm.data.assessment_type,
                assessment_number: filterForm.data.assessment_number,
                academic_year_id: academicYear.id || "",
                academic_session_id: "",
            },
            { preserveState: true, preserveScroll: true, replace: true },
        );
    };

    const exportMarks = (format) => {
        const params = new URLSearchParams();

        Object.entries({
            ...filterForm.data,
            format,
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

    return (
        <AuthenticatedLayout>
            <Head title="View Marks" />

            <div className="mx-auto max-w-6xl space-y-8">
                <MarksWorkspaceTabs
                    activeTab="view"
                    canPublish={can_publish}
                />

                <div className="rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm">
                    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                        <div>
                            <InputLabel value="Course Mapping" required />
                            <select
                                value={filterForm.data.curriculum_mapping_id}
                                onChange={(e) => {
                                    filterForm.setData(
                                        "curriculum_mapping_id",
                                        e.target.value,
                                    );
                                    filterForm.setData("curriculum_unit_id", "");
                                    filterForm.setData("academic_year_id", "");
                                    filterForm.setData("academic_session_id", "");
                                    loadUnits(e.target.value);
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
                                message={filterForm.errors.curriculum_mapping_id}
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
                                            filterForm.data.curriculum_mapping_id,
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
                                    disabled={!filterForm.data.curriculum_mapping_id}
                                />
                            </div>
                            <InputError
                                message={filterForm.errors.curriculum_unit_id}
                                className="mt-2"
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
                                className="mt-2 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-400"
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
                                className="mt-2 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-400"
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

                    <div className="mt-6 flex items-center justify-between">
                        <div className="text-sm text-zinc-500">
                            {selected_unit ? (
                                <span className="font-semibold text-zinc-800">
                                    {selected_unit.code} - {selected_unit.name}
                                </span>
                            ) : (
                                "Choose a unit and search to load submitted marks."
                            )}
                        </div>
                        <button
                            type="button"
                            onClick={() => searchMarks()}
                            disabled={
                                !filterForm.data.curriculum_mapping_id ||
                                !filterForm.data.curriculum_unit_id
                            }
                            className="rounded-xl bg-emerald-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            Search Marks
                        </button>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-3">
                        <button
                            type="button"
                            onClick={() => exportMarks("csv")}
                            disabled={!filterForm.data.curriculum_unit_id}
                            className="rounded-xl border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            Export CSV
                        </button>
                        <button
                            type="button"
                            onClick={() => exportMarks("excel")}
                            disabled={!filterForm.data.curriculum_unit_id}
                            className="rounded-xl border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            Export Excel
                        </button>
                    </div>
                </div>

                {blocker && (
                    <div className="rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-800">
                        {blocker}
                    </div>
                )}

                <div className="rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm">
                    <h2 className="text-xl font-semibold text-zinc-900">
                        Submitted Marks
                    </h2>
                    <p className="mt-1 text-sm text-zinc-500">
                        Results are shown for the selected assessment filters,
                        with pagination when multiple assessments are included.
                    </p>

                    <div className="mt-6 overflow-hidden rounded-2xl border border-zinc-100">
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[48rem] border-collapse">
                                <thead className="bg-zinc-50">
                                    <tr className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                                        <th className="px-4 py-3 text-left">Reg. No.</th>
                                        <th className="px-4 py-3 text-left">Student</th>
                                        <th className="px-4 py-3 text-left">Unit</th>
                                        <th className="px-4 py-3 text-left">Session</th>
                                        <th className="px-4 py-3 text-left">Type</th>
                                        <th className="px-4 py-3 text-left">Assessment</th>
                                        <th className="px-4 py-3 text-left">Marks</th>
                                        <th className="px-4 py-3 text-left">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-zinc-100 bg-white">
                                    {marks.length ? (
                                        marks.map((mark) => (
                                            <tr key={mark.id} className="text-sm">
                                                <td className="px-4 py-3 font-medium text-zinc-900">
                                                    {mark.registration_number}
                                                </td>
                                                <td className="px-4 py-3 text-zinc-700">
                                                    {mark.student_name || "-"}
                                                </td>
                                                <td className="px-4 py-3 text-zinc-700">
                                                    {mark.unit_name || "-"}
                                                </td>
                                                <td className="px-4 py-3 text-zinc-700">
                                                    {mark.session_name || "-"}
                                                </td>
                                                <td className="px-4 py-3 text-zinc-700">
                                                    {mark.assessment_type || "-"}
                                                </td>
                                                <td className="px-4 py-3 text-zinc-700">
                                                    {mark.assessment_number || "-"}
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
                                onClick={() => searchMarks(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="rounded-lg border border-zinc-200 px-3 py-1.5 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                Prev
                            </button>
                            <button
                                type="button"
                                onClick={() => searchMarks(currentPage + 1)}
                                disabled={currentPage === lastPage}
                                className="rounded-lg border border-zinc-200 px-3 py-1.5 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                Next
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
