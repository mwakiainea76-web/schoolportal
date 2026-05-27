import { Head, router } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function StudentResults({
    student,
    filters,
    filter_options,
    summary,
    results,
}) {
    const updateFilter = (field, value) => {
        router.get(
            route("student.results.index"),
            {
                module: field === "module" ? value || undefined : filters.module || undefined,
                year_of_study:
                    field === "year_of_study"
                        ? value || undefined
                        : filters.year_of_study || undefined,
            },
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            },
        );
    };

    const resetFilters = () => {
        router.get(
            route("student.results.index"),
            {},
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            },
        );
    };

    return (
        <AuthenticatedLayout
            header={
                <div>
                    <h1 className="text-3xl font-semibold text-zinc-900">
                        My Results
                    </h1>
                    <p className="mt-2 max-w-3xl text-sm text-zinc-600">
                        View only published marks and filter them by module or
                        year of study.
                    </p>
                </div>
            }
        >
            <Head title="My Results" />

            <div className="mx-auto max-w-7xl space-y-8">
                <div className="grid gap-4 md:grid-cols-3">
                    <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                            Student
                        </p>
                        <p className="mt-3 text-xl font-semibold text-zinc-900">
                            {student?.name || "Student"}
                        </p>
                        <p className="mt-1 text-sm text-zinc-500">
                            {student?.registration_number || "-"}
                        </p>
                    </div>

                    <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                            Published Results
                        </p>
                        <p className="mt-3 text-3xl font-semibold text-zinc-900">
                            {summary.published_count}
                        </p>
                        <p className="mt-1 text-sm text-zinc-500">
                            Marks released by HOD
                        </p>
                    </div>

                    <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                            Filtered View
                        </p>
                        <p className="mt-3 text-3xl font-semibold text-zinc-900">
                            {summary.filtered_count}
                        </p>
                        <p className="mt-1 text-sm text-zinc-500">
                            Results in the current view
                        </p>
                    </div>
                </div>

                <div className="rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                        <div>
                            <h2 className="text-xl font-semibold text-zinc-900">
                                Published Results
                            </h2>
                            <p className="mt-1 text-sm text-zinc-500">
                                Filter by module or year of study to narrow the
                                published results list.
                            </p>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2 lg:min-w-[26rem]">
                            <div>
                                <label className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                                    Module
                                </label>
                                <select
                                    value={filters.module || ""}
                                    onChange={(e) =>
                                        updateFilter("module", e.target.value)
                                    }
                                    className="mt-2 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-400"
                                >
                                    <option value="">All modules</option>
                                    {filter_options.modules.map((option) => (
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
                                <label className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                                    Year of Study
                                </label>
                                <select
                                    value={filters.year_of_study || ""}
                                    onChange={(e) =>
                                        updateFilter(
                                            "year_of_study",
                                            e.target.value,
                                        )
                                    }
                                    className="mt-2 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-400"
                                >
                                    <option value="">All years</option>
                                    {filter_options.years_of_study.map(
                                        (option) => (
                                            <option
                                                key={option.value}
                                                value={option.value}
                                            >
                                                {option.label}
                                            </option>
                                        ),
                                    )}
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="mt-5 flex justify-end">
                        <button
                            type="button"
                            onClick={resetFilters}
                            className="rounded-xl border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50"
                        >
                            Reset Filters
                        </button>
                    </div>

                    <div className="mt-6 overflow-hidden rounded-2xl border border-zinc-100">
                        <div className="grid grid-cols-[1fr,0.7fr,0.8fr,1.2fr,0.8fr,0.8fr,0.6fr] gap-4 bg-zinc-50 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-zinc-500">
                            <p>Session</p>
                            <p>Year</p>
                            <p>Module</p>
                            <p>Unit</p>
                            <p>Type</p>
                            <p>Assessment</p>
                            <p>Marks</p>
                        </div>

                        {results.length ? (
                            results.map((result) => (
                                <div
                                    key={result.id}
                                    className="grid grid-cols-[1fr,0.7fr,0.8fr,1.2fr,0.8fr,0.8fr,0.6fr] gap-4 border-t border-zinc-100 bg-white px-4 py-3 text-sm"
                                >
                                    <p className="text-zinc-700">
                                        {result.session}
                                    </p>
                                    <p className="text-zinc-700">
                                        {result.year_of_study
                                            ? `Year ${result.year_of_study}`
                                            : "-"}
                                    </p>
                                    <p className="text-zinc-700">
                                        {result.module
                                            ? `Module ${result.module}`
                                            : "-"}
                                    </p>
                                    <div>
                                        <p className="font-semibold text-zinc-900">
                                            {result.unit_code || "-"}
                                        </p>
                                        <p className="text-zinc-500">
                                            {result.unit_name || "-"}
                                        </p>
                                    </div>
                                    <p className="text-zinc-700">
                                        {result.assessment_type}
                                    </p>
                                    <p className="text-zinc-700">
                                        Assessment {result.assessment_number}
                                    </p>
                                    <p className="font-semibold text-zinc-900">
                                        {result.marks}
                                    </p>
                                </div>
                            ))
                        ) : (
                            <div className="px-4 py-10 text-center text-sm text-zinc-500">
                                No published results match the selected filter
                                yet.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
