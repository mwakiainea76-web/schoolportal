import { Head, router, useForm } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";

export default function Publish({ filters, selected_unit, submitted_marks, blocker }) {
    const filterForm = useForm({
        program_version_unit_code: filters.program_version_unit_code || "",
        assessment_type: filters.assessment_type || "theory",
        assessment_number: filters.assessment_number || "1",
    });

    const loadAssessment = (e) => {
        e.preventDefault();
        router.get(
            route("academic.marks.publish.index"),
            {
                program_version_unit_code:
                    filterForm.data.program_version_unit_code,
                assessment_type: filterForm.data.assessment_type,
                assessment_number: filterForm.data.assessment_number,
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
                assessment_type: filterForm.data.assessment_type,
                assessment_number: filterForm.data.assessment_number,
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
                            <InputLabel value="Assessment Type" required />
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
                                <option value="theory">Theory</option>
                                <option value="practical">Practical</option>
                            </select>
                        </div>

                        <div>
                            <InputLabel value="Assessment Number" required />
                            <input
                                type="number"
                                min="1"
                                value={filterForm.data.assessment_number}
                                onChange={(e) =>
                                    filterForm.setData(
                                        "assessment_number",
                                        e.target.value,
                                    )
                                }
                                className="mt-2 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-400"
                            />
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
                        <div className="grid grid-cols-[1fr,1.2fr,1.2fr,0.6fr,0.8fr,0.9fr] gap-4 bg-zinc-50 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-zinc-500">
                            <p>Reg. No.</p>
                            <p>Student</p>
                            <p>Unit</p>
                            <p>Marks</p>
                            <p>Status</p>
                            <p className="text-right">Action</p>
                        </div>

                        {submitted_marks.length ? (
                            submitted_marks.map((mark) => (
                                <div
                                    key={mark.id}
                                    className="grid grid-cols-[1fr,1.2fr,1.2fr,0.6fr,0.8fr,0.9fr] gap-4 border-t border-zinc-100 bg-white px-4 py-3 text-sm"
                                >
                                    <p className="font-medium text-zinc-900">
                                        {mark.registration_number}
                                    </p>
                                    <p className="text-zinc-700">
                                        {mark.student_name || "-"}
                                    </p>
                                    <p className="text-zinc-700">
                                        {mark.unit_name || "-"}
                                    </p>
                                    <p className="font-semibold text-zinc-900">
                                        {mark.marks}
                                    </p>
                                    <p>
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
                                    </p>
                                    <div className="text-right">
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
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="px-4 py-8 text-center text-sm text-zinc-500">
                                No submitted marks found for this assessment
                                yet.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
