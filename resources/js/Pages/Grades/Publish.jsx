import { Head, router, useForm } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";

export default function Publish({ filters, selected_unit, submitted_marks, blocker, filter_options }) {
    const filterForm = useForm({
        program_version_unit_code: filters.program_version_unit_code || "",
        assessment_type: filters.assessment_type || "theory",
        assessment_number: filters.assessment_number || "1",
        academic_year: filters.academic_year || "",
        module: filters.module || "",
    });

    const loadAssessment = (e) => {
        e.preventDefault();
        router.get(
            route("academic.marks.publish.index"),
            {
                program_version_unit_code:
                    filterForm.data.program_version_unit_code,
                academic_year: filterForm.data.academic_year,
                module: filterForm.data.module,
            },
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
    };

    const publishAssessment = (action) => {
        router.post(
            route("academic.marks.publish.assessment"),
            {
                program_version_unit_code: filterForm.data.program_version_unit_code,
                academic_year: filterForm.data.academic_year,
                module: filterForm.data.module,
                action,
            },
            {
                preserveScroll: true,
            },
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
                        HOD review workspace for publishing or unpublishing marks
                        by unit assessment or by individual student.
                    </p>
                </div>
            }
        >
            <Head title="Publish Marks" />

            <div className="mx-auto max-w-6xl space-y-8">
                <form
                    onSubmit={loadAssessment}
                    className="space-y-6 rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm"
                >
                    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
                        <div className="xl:col-span-2">
                            <InputLabel
                                value="Program Version Unit Code"
                                required
                            />
                            <input
                                type="text"
                                value={filterForm.data.program_version_unit_code}
                                onChange={(e) =>
                                    filterForm.setData(
                                        "program_version_unit_code",
                                        e.target.value.toUpperCase(),
                                    )
                                }
                                className="mt-2 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-400"
                                placeholder="e.g. ICT101"
                            />
                            <InputError
                                message={
                                    filterForm.errors.program_version_unit_code
                                }
                                className="mt-2"
                            />
                        </div>

                        <div>
                            <InputLabel value="Academic Year" required />
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
                                {filter_options?.academic_years?.map((option) => (
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
                            <InputLabel value="Module" required />
                            <select
                                value={filterForm.data.module}
                                onChange={(e) =>
                                    filterForm.setData(
                                        "module",
                                        e.target.value,
                                    )
                                }
                                className="mt-2 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-400"
                            >
                                <option value="">All Modules</option>
                                {filter_options?.modules?.map((option) => (
                                    <option
                                        key={option.value}
                                        value={option.value}
                                    >
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="text-sm text-zinc-500">
                            {selected_unit ? (
                                <span className="font-semibold text-zinc-800">
                                    {selected_unit.code} - {selected_unit.name}
                                </span>
                            ) : (
                                "Load a unit assessment to review submitted marks."
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={!filterForm.data.program_version_unit_code}
                            className="rounded-xl bg-emerald-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            Load Assessment
                        </button>
                    </div>
                </form>

                {blocker ? (
                    <div className="rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-800">
                        {blocker}
                    </div>
                ) : null}

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
                                disabled={!selected_unit || !submitted_marks.length}
                                className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                Publish Unit
                            </button>
                            <button
                                type="button"
                                onClick={() => publishAssessment("unpublish")}
                                disabled={!selected_unit || !submitted_marks.length}
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
                                        <th className="px-4 py-3 text-left">Reg. No.</th>
                                        <th className="px-4 py-3 text-left">Student</th>
                                        <th className="px-4 py-3 text-left">Unit</th>
                                        <th className="px-4 py-3 text-left">Marks</th>
                                        <th className="px-4 py-3 text-left">Status</th>
                                        <th className="px-4 py-3 text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-zinc-100 bg-white">
                                    {submitted_marks.length ? (
                                        submitted_marks.map((mark) => (
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
                                                No submitted marks found for this assessment
                                                yet.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
