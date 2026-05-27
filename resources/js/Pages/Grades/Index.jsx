import { Head, Link, router, useForm } from "@inertiajs/react";
import { useEffect } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";

export default function Index({
    filters,
    selected_unit,
    submitted_marks,
    blocker,
}) {
    const filterForm = useForm({
        program_version_unit_code: filters.program_version_unit_code || "",
        assessment_type: filters.assessment_type || "theory",
        assessment_number: filters.assessment_number || "1",
    });

    const marksForm = useForm({
        program_version_unit_code: filters.program_version_unit_code || "",
        assessment_type: filters.assessment_type || "theory",
        assessment_number: filters.assessment_number || "1",
        entries: [{ registration_number: "", marks: "" }],
    });

    useEffect(() => {
        marksForm.setData({
            program_version_unit_code: filters.program_version_unit_code || "",
            assessment_type: filters.assessment_type || "theory",
            assessment_number: filters.assessment_number || "1",
            entries: [{ registration_number: "", marks: "" }],
        });
    }, [filters]);

    const loadAssessment = (e) => {
        e.preventDefault();
        router.get(
            route("academic.marks.index"),
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

    const updateEntry = (index, field, value) => {
        const nextEntries = [...marksForm.data.entries];
        nextEntries[index] = {
            ...nextEntries[index],
            [field]: value,
        };
        marksForm.setData("entries", nextEntries);
    };

    const addRow = () => {
        marksForm.setData("entries", [
            ...marksForm.data.entries,
            { registration_number: "", marks: "" },
        ]);
    };

    const removeRow = (index) => {
        if (marksForm.data.entries.length === 1) {
            return;
        }

        marksForm.setData(
            "entries",
            marksForm.data.entries.filter((_, rowIndex) => rowIndex !== index),
        );
    };

    const submit = (e) => {
        e.preventDefault();
        marksForm.post(route("academic.marks.store"), {
            preserveScroll: true,
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <div>
                    <h1 className="text-3xl font-semibold text-zinc-900">
                        Marks Entry
                    </h1>
                    <p className="mt-2 max-w-3xl text-sm text-zinc-600">
                        Enter the program version unit code, choose theory or
                        practical, set the assessment number, then fill
                        registration number and marks manually.
                    </p>
                </div>
            }
        >
            <Head title="Marks Entry" />

            <div className="mx-auto max-w-6xl space-y-8">
                <form
                    onSubmit={loadAssessment}
                    className="space-y-6 rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm"
                >
                    <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm text-emerald-800">
                        Marks are saved only for students who already registered
                        the entered unit. You can record multiple assessments
                        per unit by changing the assessment number and choosing
                        theory or practical.
                    </div>

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
                            <InputError
                                message={filterForm.errors.assessment_type}
                                className="mt-2"
                            />
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
                            <InputError
                                message={filterForm.errors.assessment_number}
                                className="mt-2"
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
                                "Load a unit code to confirm the selected program version unit."
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={!filterForm.data.program_version_unit_code}
                            className="rounded-xl bg-emerald-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            Load Unit
                        </button>
                    </div>
                </form>

                <form
                    onSubmit={submit}
                    className="space-y-6 rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm"
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-semibold text-zinc-900">
                                Student Marks
                            </h2>
                            <p className="mt-1 text-sm text-zinc-500">
                                Enter registration number and marks between 0
                                and 100 for this assessment.
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={addRow}
                            className="rounded-xl border border-emerald-200 px-4 py-2 text-sm font-medium text-emerald-700 transition hover:bg-emerald-50"
                        >
                            Add Row
                        </button>
                    </div>

                    {blocker ? (
                        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-800">
                            {blocker}
                        </div>
                    ) : null}

                    {marksForm.errors.entries ? (
                        <p className="text-sm text-red-600">
                            {marksForm.errors.entries}
                        </p>
                    ) : null}

                    {selected_unit ? (
                        <div className="rounded-2xl bg-zinc-50 px-5 py-4 text-sm text-zinc-600">
                            <span className="font-semibold text-zinc-900">
                                {selected_unit.code} - {selected_unit.name}
                            </span>
                            {" | "}Module {selected_unit.module}
                            {" | "}
                            {selected_unit.program}
                            {" | "}
                            {selected_unit.version}
                        </div>
                    ) : null}

                    <div className="overflow-hidden rounded-2xl border border-zinc-100">
                        <div className="grid grid-cols-[1.2fr,0.8fr,0.4fr] gap-4 bg-zinc-50 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-zinc-500">
                            <p>Registration No.</p>
                            <p>Marks</p>
                            <p />
                        </div>

                        {marksForm.data.entries.map((entry, index) => (
                            <div
                                key={`${index}-${entry.registration_number}`}
                                className="grid grid-cols-[1.2fr,0.8fr,0.4fr] gap-4 border-t border-zinc-100 bg-white px-4 py-3"
                            >
                                <div>
                                    <input
                                        type="text"
                                        value={entry.registration_number}
                                        onChange={(e) =>
                                            updateEntry(
                                                index,
                                                "registration_number",
                                                e.target.value,
                                            )
                                        }
                                        className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm outline-none transition focus:border-emerald-400"
                                        placeholder="TVET/..."
                                    />
                                    <InputError
                                        message={
                                            marksForm.errors[
                                                `entries.${index}.registration_number`
                                            ]
                                        }
                                        className="mt-2"
                                    />
                                </div>

                                <div>
                                    <input
                                        type="number"
                                        min="0"
                                        max="100"
                                        step="1"
                                        value={entry.marks}
                                        onChange={(e) =>
                                            updateEntry(
                                                index,
                                                "marks",
                                                e.target.value,
                                            )
                                        }
                                        className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm outline-none transition focus:border-emerald-400"
                                        placeholder="0 - 100"
                                    />
                                    <InputError
                                        message={
                                            marksForm.errors[
                                                `entries.${index}.marks`
                                            ]
                                        }
                                        className="mt-2"
                                    />
                                </div>

                                <div className="flex items-center justify-end">
                                    <button
                                        type="button"
                                        onClick={() => removeRow(index)}
                                        className="text-sm font-medium text-red-600 transition hover:text-red-700"
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <input
                        type="hidden"
                        value={marksForm.data.program_version_unit_code}
                        name="program_version_unit_code"
                    />
                    <input
                        type="hidden"
                        value={marksForm.data.assessment_type}
                        name="assessment_type"
                    />
                    <input
                        type="hidden"
                        value={marksForm.data.assessment_number}
                        name="assessment_number"
                    />

                    <div className="flex items-center justify-between pt-2">
                        <Link
                            href={route("staff.dashboard")}
                            className="rounded-xl border border-zinc-200 px-5 py-3 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50"
                        >
                            Cancel
                        </Link>

                        <button
                            type="submit"
                            disabled={
                                marksForm.processing ||
                                !marksForm.data.program_version_unit_code ||
                                !!blocker
                            }
                            className="rounded-xl bg-emerald-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {marksForm.processing
                                ? "Saving Marks..."
                                : "Save Marks"}
                        </button>
                    </div>
                </form>

                <div className="rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-semibold text-zinc-900">
                                Submitted Marks
                            </h2>
                            <p className="mt-1 text-sm text-zinc-500">
                                Marks already saved for this unit assessment.
                            </p>
                        </div>
                    </div>

                    <div className="mt-6 overflow-hidden rounded-2xl border border-zinc-100">
                        <div className="grid grid-cols-[1fr,1.2fr,1.2fr,0.7fr,0.8fr] gap-4 bg-zinc-50 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-zinc-500">
                            <p>Reg. No.</p>
                            <p>Student</p>
                            <p>Unit</p>
                            <p>Marks</p>
                            <p>Status</p>
                        </div>

                        {submitted_marks.length ? (
                            submitted_marks.map((mark) => (
                                <div
                                    key={mark.id}
                                    className="grid grid-cols-[1fr,1.2fr,1.2fr,0.7fr,0.8fr] gap-4 border-t border-zinc-100 bg-white px-4 py-3 text-sm"
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
