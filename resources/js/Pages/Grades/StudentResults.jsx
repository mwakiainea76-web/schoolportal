import { Head, router } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function StudentResults({
    student,
    filters,
    filter_options,
    summary,
    results,
}) {
    // ── Pagination helpers ────────────────────────────────────────────────────
    const rows = results?.data ?? [];
    const currentPage = results?.current_page ?? 1;
    const lastPage = results?.last_page ?? 1;
    const total = results?.total ?? 0;

    // ── Group flat rows by unit (code + name) so theory & practical
    //    for the same unit appear on one table row ──────────────────────────
    const groupedUnits = Object.values(
        rows.reduce((acc, result) => {
            const key = `${result.unit_code}||${result.unit_name}`;
            if (!acc[key]) {
                acc[key] = {
                    module: result.module,
                    year_of_study: result.year_of_study,
                    unit_code: result.unit_code,
                    unit_name: result.unit_name,
                    theory: [],
                    practical: [],
                };
            }
            if (result.mark_type === "theory") {
                acc[key].theory.push(result.marks);
            } else if (result.mark_type === "practical") {
                acc[key].practical.push(result.marks);
            }
            return acc;
        }, {}),
    );

    const avg = (arr) =>
        arr.length > 0
            ? Math.round(arr.reduce((a, b) => a + b, 0) / arr.length)
            : null;

    const updateFilter = (field, value) => {
        router.get(
            route("student.results.index"),
            {
                module:
                    field === "module"
                        ? value || undefined
                        : filters.module || undefined,
                year_of_study:
                    field === "year_of_study"
                        ? value || undefined
                        : filters.year_of_study || undefined,
            },
            { preserveState: true, preserveScroll: true, replace: true },
        );
    };

    const resetFilters = () => {
        router.get(
            route("student.results.index"),
            {},
            { preserveState: true, preserveScroll: true, replace: true },
        );
    };

    const goToPage = (page) => {
        router.get(
            route("student.results.index"),
            {
                module: filters.module || undefined,
                year_of_study: filters.year_of_study || undefined,
                page,
            },
            { preserveState: true, preserveScroll: true },
        );
    };

    // ── Mark badge ────────────────────────────────────────────────────────────
    const MarksCell = ({ markArr, colorClass }) => {
        if (markArr.length === 0) {
            return <span className="text-sm text-zinc-400">–</span>;
        }
        const average = avg(markArr);
        return (
            <div className="flex flex-wrap items-center gap-2">
                {markArr.map((mark, idx) => (
                    <span
                        key={idx}
                        className={`rounded px-2 py-1 text-sm font-semibold ${colorClass}`}
                    >
                        {mark}
                    </span>
                ))}
                {markArr.length > 1 && average !== null && (
                    <span className="text-sm font-bold text-red-700">
                        Avg: {average}
                    </span>
                )}
            </div>
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
                        View all recorded marks and filter them by module or
                        year of study.
                    </p>
                </div>
            }
        >
            <Head title="My Results" />

            <div className="mx-auto max-w-7xl space-y-8">
                {/* ── Summary cards ── */}
                <div className="grid gap-4 md:grid-cols-3">
                    <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                            Student
                        </p>
                        <p className="mt-3 text-xl font-semibold text-zinc-900">
                            {student?.name || "Student"}
                        </p>
                        <p className="mt-1 text-sm text-zinc-500">
                            {student?.admission_number || "–"}
                        </p>
                    </div>

                    <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                            Total Marks
                        </p>
                        <p className="mt-3 text-3xl font-semibold text-zinc-900">
                            {summary.published_count}
                        </p>
                        <p className="mt-1 text-sm text-zinc-500">
                            Recorded marks (theory &amp; practical)
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

                {/* ── Results table ── */}
                <div className="rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm">
                    {/* Header + filters */}
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                        <div>
                            <h2 className="text-xl font-semibold text-zinc-900">
                                My Results
                            </h2>
                            <p className="mt-1 text-sm text-zinc-500">
                                Marks are shown for both theory and practical
                                assessments. Multiple marks per unit are
                                averaged.
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
                                    {filter_options.modules.map((opt) => (
                                        <option
                                            key={opt.value}
                                            value={opt.value}
                                        >
                                            {opt.label}
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
                                        (opt) => (
                                            <option
                                                key={opt.value}
                                                value={opt.value}
                                            >
                                                {opt.label}
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

                    {/* Table */}
                    <div className="mt-6 overflow-x-auto rounded-2xl border border-zinc-100">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="bg-zinc-50">
                                    <th className="min-w-[100px] px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-zinc-500">
                                        Module
                                    </th>
                                    <th className="min-w-[80px] px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-zinc-500">
                                        Year
                                    </th>
                                    <th className="min-w-[200px] px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-zinc-500">
                                        Unit
                                    </th>
                                    <th className="min-w-[180px] px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-zinc-500">
                                        Theory Marks
                                    </th>
                                    <th className="min-w-[180px] px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-zinc-500">
                                        Practical Marks
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {groupedUnits.length ? (
                                    groupedUnits.map((unit) => (
                                        <tr
                                            key={`${unit.unit_code}||${unit.unit_name}`}
                                            className="border-t border-zinc-100 bg-white hover:bg-zinc-50"
                                        >
                                            <td className="px-4 py-3 text-sm text-zinc-700">
                                                {unit.module
                                                    ? `Module ${unit.module}`
                                                    : "–"}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-zinc-700">
                                                {unit.year_of_study
                                                    ? `Year ${unit.year_of_study}`
                                                    : "–"}
                                            </td>
                                            <td className="px-4 py-3">
                                                <p className="text-sm font-medium text-zinc-900">
                                                    {unit.unit_code || "–"}
                                                </p>
                                                <p className="text-xs text-zinc-500">
                                                    {unit.unit_name || "–"}
                                                </p>
                                            </td>
                                            <td className="px-4 py-3">
                                                <MarksCell
                                                    markArr={unit.theory}
                                                    colorClass="bg-blue-50 text-blue-700"
                                                />
                                            </td>
                                            <td className="px-4 py-3">
                                                <MarksCell
                                                    markArr={unit.practical}
                                                    colorClass="bg-emerald-50 text-emerald-700"
                                                />
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan={5}
                                            className="px-4 py-10 text-center text-sm text-zinc-500"
                                        >
                                            No recorded marks match the selected
                                            filter yet.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* ── Pagination ── */}
                    {lastPage > 1 && (
                        <div className="mt-5 flex items-center justify-between gap-4">
                            <p className="text-sm text-zinc-500">
                                Showing{" "}
                                <span className="font-medium text-zinc-800">
                                    {(currentPage - 1) * 30 + 1}–
                                    {Math.min(currentPage * 30, total)}
                                </span>{" "}
                                of{" "}
                                <span className="font-medium text-zinc-800">
                                    {total}
                                </span>{" "}
                                records
                            </p>

                            <div className="flex items-center gap-1">
                                <button
                                    onClick={() => goToPage(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className="rounded-lg border border-zinc-200 px-3 py-1.5 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                    ← Prev
                                </button>

                                {Array.from(
                                    { length: lastPage },
                                    (_, i) => i + 1,
                                )
                                    .filter(
                                        (p) =>
                                            p === 1 ||
                                            p === lastPage ||
                                            Math.abs(p - currentPage) <= 1,
                                    )
                                    .reduce((acc, p, idx, arr) => {
                                        if (idx > 0 && p - arr[idx - 1] > 1) {
                                            acc.push("ellipsis-" + p);
                                        }
                                        acc.push(p);
                                        return acc;
                                    }, [])
                                    .map((p) =>
                                        typeof p === "string" ? (
                                            <span
                                                key={p}
                                                className="px-2 text-sm text-zinc-400"
                                            >
                                                …
                                            </span>
                                        ) : (
                                            <button
                                                key={p}
                                                onClick={() => goToPage(p)}
                                                className={`rounded-lg border px-3 py-1.5 text-sm font-medium transition ${
                                                    p === currentPage
                                                        ? "border-emerald-500 bg-emerald-600 text-white"
                                                        : "border-zinc-200 text-zinc-700 hover:bg-zinc-50"
                                                }`}
                                            >
                                                {p}
                                            </button>
                                        ),
                                    )}

                                <button
                                    onClick={() => goToPage(currentPage + 1)}
                                    disabled={currentPage === lastPage}
                                    className="rounded-lg border border-zinc-200 px-3 py-1.5 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                    Next →
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
