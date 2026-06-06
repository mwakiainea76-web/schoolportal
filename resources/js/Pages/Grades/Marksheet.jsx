import { Head, router, useForm } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import SearchSelect from "@/Components/SearchSelect";

export default function Marksheet({
    filters,
    selected_unit,
    available_years,
    marksheet_data,
    blocker,
    selected_filters,
}) {
    const filterForm = useForm({
        curriculum_unit_code: filters.curriculum_unit_code || "",
        academic_session_id: filters.academic_session_id || "",
        year_of_study: filters.year_of_study || "",
        registration_number: filters.registration_number || "",
    });

    const loadMarksheet = (e) => {
        e.preventDefault();
        router.get(
            route("academic.marks.marksheet.index"),
            {
                curriculum_unit_code:
                    filterForm.data.curriculum_unit_code,
                academic_session_id: filterForm.data.academic_session_id,
                year_of_study: filterForm.data.year_of_study,
                registration_number: filterForm.data.registration_number,
            },
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
    };

    const resetFilters = () => {
        router.get(
            route("academic.marks.marksheet.index"),
            {},
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            },
        );
    };

    const performersTable = (performers, assessmentType) => (
        <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
                <thead>
                    <tr className="border-b border-zinc-200 bg-zinc-50">
                        <th className="px-4 py-3 font-semibold text-zinc-900">
                            Rank
                        </th>
                        <th className="px-4 py-3 font-semibold text-zinc-900">
                            Registration Number
                        </th>
                        <th className="px-4 py-3 font-semibold text-zinc-900">
                            Student Name
                        </th>
                        <th className="px-4 py-3 font-semibold text-zinc-900">
                            Marks
                        </th>
                        <th className="px-4 py-3 font-semibold text-zinc-900">
                            Year of Study
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {performers.length > 0 ? (
                        performers.map((performer, index) => (
                            <tr
                                key={index}
                                className="border-b border-zinc-100 hover:bg-zinc-50"
                            >
                                <td className="px-4 py-3 font-semibold text-zinc-900">
                                    #{index + 1}
                                </td>
                                <td className="px-4 py-3 font-mono text-zinc-700">
                                    {performer.registration_number}
                                </td>
                                <td className="px-4 py-3 text-zinc-700">
                                    {performer.student_name}
                                </td>
                                <td className="px-4 py-3 font-semibold text-emerald-700">
                                    {performer.marks}
                                </td>
                                <td className="px-4 py-3 text-zinc-700">
                                    Year {performer.year_of_study || "–"}
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td
                                colSpan="5"
                                className="px-4 py-8 text-center text-zinc-500"
                            >
                                No {assessmentType.toLowerCase()} marks
                                available
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );

    return (
        <AuthenticatedLayout
            header={
                <div>
                    <h1 className="text-3xl font-semibold text-zinc-900">
                        Marks Per Unit - Marksheet
                    </h1>
                    <p className="mt-2 max-w-3xl text-sm text-zinc-600">
                        View top performers for a unit. Filter by session, year
                        of study, or registration number to narrow results.
                    </p>
                </div>
            }
        >
            <Head title="Unit Marksheet" />

            <div className="mx-auto max-w-7xl space-y-8">
                {/* ── Filter Form ── */}
                <form
                    onSubmit={loadMarksheet}
                    className="space-y-6 rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm"
                >
                    <div className="rounded-2xl border border-blue-200 bg-blue-50 px-5 py-4 text-sm text-blue-800">
                        Enter a unit code to view the marksheet with top 3
                        performers in theory and practical assessments.
                    </div>

                    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-5">
                        <div className="xl:col-span-2">
                            <InputLabel value="Unit Code" required />
                            <input
                                type="text"
                                value={
                                    filterForm.data.curriculum_unit_code
                                }
                                onChange={(e) =>
                                    filterForm.setData(
                                        "curriculum_unit_code",
                                        e.target.value.toUpperCase(),
                                    )
                                }
                                className="mt-2 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm outline-none transition focus:border-blue-400"
                                placeholder="e.g. ICT101"
                            />
                            <InputError
                                message={
                                    filterForm.errors.curriculum_unit_code
                                }
                                className="mt-2"
                            />
                        </div>

                        <div>
                            <InputLabel value="Academic Session" />
                            <div className="mt-2">
                                <SearchSelect
                                    routeName="academic-sessions.search"
                                    value={filterForm.data.academic_session_id}
                                    selectedLabel={
                                        selected_filters?.academic_session?.name
                                    }
                                    placeholder="Select academic session..."
                                    defaultOptions={[]}
                                    preloadOptions
                                    onChange={(academicSession) =>
                                        filterForm.setData(
                                            "academic_session_id",
                                            academicSession.id || "",
                                        )
                                    }
                                />
                            </div>
                        </div>

                        <div>
                            <InputLabel value="Year of Study" />
                            <select
                                value={filterForm.data.year_of_study}
                                onChange={(e) =>
                                    filterForm.setData(
                                        "year_of_study",
                                        e.target.value,
                                    )
                                }
                                className="mt-2 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm outline-none transition focus:border-blue-400"
                            >
                                <option value="">All years</option>
                                {available_years.map((option) => (
                                    <option
                                        key={option.value}
                                        value={option.value}
                                    >
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <InputLabel value="Registration Number" />
                            <input
                                type="text"
                                value={filterForm.data.registration_number}
                                onChange={(e) =>
                                    filterForm.setData(
                                        "registration_number",
                                        e.target.value.toUpperCase(),
                                    )
                                }
                                className="mt-2 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm outline-none transition focus:border-blue-400"
                                placeholder="e.g. REG001"
                            />
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <button
                            type="submit"
                            className="rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
                        >
                            Load Marksheet
                        </button>
                        <button
                            type="button"
                            onClick={resetFilters}
                            className="rounded-xl border border-zinc-200 bg-white px-6 py-3 text-sm font-semibold text-zinc-900 transition hover:bg-zinc-50"
                        >
                            Reset Filters
                        </button>
                    </div>
                </form>

                {/* ── Blocker ── */}
                {blocker && (
                    <div className="rounded-3xl border border-red-200 bg-red-50 p-8 text-center">
                        <p className="text-sm text-red-800">{blocker}</p>
                    </div>
                )}

                {/* ── Unit Info ── */}
                {selected_unit && (
                    <div className="rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm">
                        <h2 className="text-xl font-semibold text-zinc-900">
                            {selected_unit.code}
                        </h2>
                        <p className="mt-1 text-sm text-zinc-600">
                            {selected_unit.name}
                        </p>
                    </div>
                )}

                {/* ── Marksheet Results ── */}
                {selected_unit && !blocker && (
                    <div className="space-y-8">
                        {/* Theory */}
                        <div className="rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm">
                            <div className="mb-6 flex items-center justify-between">
                                <div>
                                    <h3 className="text-xl font-semibold text-zinc-900">
                                        Theory Assessment
                                    </h3>
                                    <p className="mt-1 text-sm text-zinc-600">
                                        Top 3 performers
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                                        Average Score
                                    </p>
                                    <p className="mt-2 text-3xl font-semibold text-blue-600">
                                        {marksheet_data.theory?.average ?? 0}
                                    </p>
                                </div>
                            </div>
                            {performersTable(
                                marksheet_data.theory?.top_performers ?? [],
                                "Theory",
                            )}
                        </div>

                        {/* Practical */}
                        <div className="rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm">
                            <div className="mb-6 flex items-center justify-between">
                                <div>
                                    <h3 className="text-xl font-semibold text-zinc-900">
                                        Practical Assessment
                                    </h3>
                                    <p className="mt-1 text-sm text-zinc-600">
                                        Top 3 performers
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                                        Average Score
                                    </p>
                                    <p className="mt-2 text-3xl font-semibold text-emerald-600">
                                        {marksheet_data.practical?.average ?? 0}
                                    </p>
                                </div>
                            </div>
                            {performersTable(
                                marksheet_data.practical?.top_performers ?? [],
                                "Practical",
                            )}
                        </div>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
