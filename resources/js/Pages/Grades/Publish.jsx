import { Head, router, useForm } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";

export default function Publish({
    filters,
    selected_unit,
    submitted_marks,
    blocker,
    filter_options,
}) {
    const filterForm = useForm({
        course_version_unit_code: filters.course_version_unit_code || "",
        academic_year: filters.academic_year || "",
        module: filters.module || "",
    });

    // ── Pagination helpers ────────────────────────────────────────────────────
    const marks = submitted_marks?.data ?? [];
    const currentPage = submitted_marks?.current_page ?? 1;
    const lastPage = submitted_marks?.last_page ?? 1;
    const total = submitted_marks?.total ?? 0;

    // filter_options may arrive as a PHP empty array (serialised as [])
    // so guard every property access with nullish coalescing
    const academicYears = filter_options?.academic_years ?? [];
    const modules = filter_options?.modules ?? [];

    const loadAssessment = (e) => {
        e.preventDefault();
        router.get(
            route("academic.marks.publish.index"),
            {
                course_version_unit_code:
                    filterForm.data.course_version_unit_code,
                academic_year: filterForm.data.academic_year,
                module: filterForm.data.module,
            },
            { preserveState: true, preserveScroll: true },
        );
    };

    const goToPage = (page) => {
        router.get(
            route("academic.marks.publish.index"),
            {
                course_version_unit_code:
                    filterForm.data.course_version_unit_code,
                academic_year: filterForm.data.academic_year,
                module: filterForm.data.module,
                page,
            },
            { preserveState: true, preserveScroll: true },
        );
    };

    const publishAssessment = (action) => {
        router.post(
            route("academic.marks.publish.assessment"),
            {
                course_version_unit_code:
                    filterForm.data.course_version_unit_code,
                academic_year: filterForm.data.academic_year,
                module: filterForm.data.module,
                action,
            },
            { preserveScroll: true },
        );
    };

    const toggleStudentMark = (markId, action) => {
        router.post(
            route("academic.marks.publish.toggle", markId),
            { action },
            { preserveScroll: true },
        );
    };

    return (
        <AuthenticatedLayout
            header={
                <div>
                    <h1 className="text-3xl font-semibold text-zinc-900">
                        Publish Marks
                    </h1>
                    <p className="mt-2 max-w-3xl text-sm text-zinc-600">
                        HOD review workspace for publishing or unpublishing
                        marks by unit assessment or by individual student.
                    </p>
                </div>
            }
        >
            <Head title="Publish Marks" />

            <div className="mx-auto max-w-6xl space-y-8">
                {/* ── Filter Form ── */}
                <form
                    onSubmit={loadAssessment}
                    className="space-y-6 rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm"
                >
                    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
                        <div className="xl:col-span-2">
                            <InputLabel
                                value="Course Version Unit Code"
                                required
                            />
                            <input
                                type="text"
                                value={
                                    filterForm.data.course_version_unit_code
                                }
                                onChange={(e) =>
                                    filterForm.setData(
                                        "course_version_unit_code",
                                        e.target.value.toUpperCase(),
                                    )
                                }
                                className="mt-2 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-400"
                                placeholder="e.g. ICT101"
                            />
                            <InputError
                                message={
                                    filterForm.errors.course_version_unit_code
                                }
                                className="mt-2"
                            />
                        </div>

                        <div>
                            <InputLabel value="Academic Year" />
                            <select
                                value={filterForm.data.academic_year}
                                onChange={(e) =>
                                    filterForm.setData(
                                        "academic_year",
                                        e.target.value,
                                    )
                                }
                                className="mt-2 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-400"
                            >
                                <option value="">All Years</option>
                                {academicYears.map((opt) => (
                                    <option key={opt.value} value={opt.value}>
                                        {opt.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <InputLabel value="Module" />
                            <select
                                value={filterForm.data.module}
                                onChange={(e) =>
                                    filterForm.setData("module", e.target.value)
                                }
                                className="mt-2 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-400"
                            >
                                <option value="">All Modules</option>
                                {modules.map((opt) => (
                                    <option key={opt.value} value={opt.value}>
                                        {opt.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="text-sm text-zinc-500">
                            {selected_unit ? (
                                <span className="font-semibold text-zinc-800">
                                    {selected_unit.code} – {selected_unit.name}
                                </span>
                            ) : (
                                "Load a unit assessment to review submitted marks."
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={
                                !filterForm.data.course_version_unit_code
                            }
                            className="rounded-xl bg-emerald-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            Load Assessment
                        </button>
                    </div>
                </form>

                {/* ── Blocker ── */}
                {blocker && (
                    <div className="rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-800">
                        {blocker}
                    </div>
                )}

                {/* ── Marks Table ── */}
                <div className="rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h2 className="text-xl font-semibold text-zinc-900">
                                Submitted Assessment Marks
                            </h2>
                            <p className="mt-1 text-sm text-zinc-500">
                                Publish or unpublish the whole assessment, or
                                control visibility student by student.
                            </p>
                        </div>

                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={() => publishAssessment("publish")}
                                disabled={!selected_unit || !marks.length}
                                className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                Publish Unit
                            </button>
                            <button
                                type="button"
                                onClick={() => publishAssessment("unpublish")}
                                disabled={!selected_unit || !marks.length}
                                className="rounded-xl border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                Unpublish Unit
                            </button>
                        </div>
                    </div>

                    <div className="mt-6 overflow-hidden rounded-2xl border border-zinc-100">
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[60rem] border-collapse">
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
                                            Marks
                                        </th>
                                        <th className="px-4 py-3 text-left">
                                            Status
                                        </th>
                                        <th className="px-4 py-3 text-right">
                                            Action
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
                                                    {mark.registration_number}
                                                </td>
                                                <td className="px-4 py-3 text-zinc-700">
                                                    {mark.student_name || "–"}
                                                </td>
                                                <td className="px-4 py-3 text-zinc-700">
                                                    {mark.unit_name || "–"}
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
                                                <td className="px-4 py-3 text-right">
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            toggleStudentMark(
                                                                mark.id,
                                                                mark.is_published
                                                                    ? "unpublish"
                                                                    : "publish",
                                                            )
                                                        }
                                                        className="text-sm font-medium text-emerald-700 transition hover:text-emerald-800"
                                                    >
                                                        {mark.is_published
                                                            ? "Unpublish"
                                                            : "Publish"}
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td
                                                colSpan="6"
                                                className="px-4 py-8 text-center text-sm text-zinc-500"
                                            >
                                                No submitted marks found for
                                                this assessment yet.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* ── Pagination ── */}
                    {lastPage > 1 && (
                        <div className="mt-5 flex items-center justify-between gap-4">
                            <p className="text-sm text-zinc-500">
                                Showing{" "}
                                <span className="font-medium text-zinc-800">
                                    {(currentPage - 1) * 25 + 1}–
                                    {Math.min(currentPage * 25, total)}
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
