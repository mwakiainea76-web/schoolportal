import { Head, Link, router, useForm } from "@inertiajs/react";
import { useEffect, useCallback, useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";

export default function Index({
    filters,
    selected_unit,
    submitted_marks,
    blocker,
    filter_options,
}) {
    const [hasSearched, setHasSearched] = useState(!!submitted_marks?.length);

    const filterForm = useForm({
        program_version_unit_code: filters.program_version_unit_code || "",
        assessment_type: filters.assessment_type || "theory",
        assessment_number: filters.assessment_number || "1",
        module: filters.module || "",
        academic_year: filters.academic_year || "",
    });

    const marksForm = useForm({
        entries: [{ registration_number: "", marks: "" }],
    });

    const resetEntries = useCallback(() => {
        marksForm.setData("entries", [{ registration_number: "", marks: "" }]);
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        resetEntries();
    }, [selected_unit]); // eslint-disable-line react-hooks/exhaustive-deps

    const loadAssessment = (e) => {
        e.preventDefault();
        setHasSearched(false);
        router.get(
            route("academic.marks.index"),
            {
                program_version_unit_code:
                    filterForm.data.program_version_unit_code,
                assessment_type: filterForm.data.assessment_type,
                assessment_number: filterForm.data.assessment_number,
            },
            { preserveState: true, preserveScroll: true }
        );
    };

    const searchMarks = (e) => {
        e.preventDefault();
        setHasSearched(true);
        router.get(
            route("academic.marks.index"),
            {
                program_version_unit_code:
                    filterForm.data.program_version_unit_code,
                assessment_type: filterForm.data.assessment_type,
                assessment_number: filterForm.data.assessment_number,
                module: filterForm.data.module,
                academic_year: filterForm.data.academic_year,
                search_marks: true,
            },
            { preserveState: true, preserveScroll: true }
        );
    };

    const updateEntry = (index, field, value) => {
        const nextEntries = [...marksForm.data.entries];
        nextEntries[index] = { ...nextEntries[index], [field]: value };
        marksForm.setData("entries", nextEntries);
    };

    const addRow = () => {
        marksForm.setData("entries", [
            ...marksForm.data.entries,
            { registration_number: "", marks: "" },
        ]);
    };

    const submit = (e) => {
        e.preventDefault();
        marksForm
            .transform((data) => ({
                ...data,
                program_version_unit_code:
                    filterForm.data.program_version_unit_code,
                assessment_type: filterForm.data.assessment_type,
                assessment_number: filterForm.data.assessment_number,
            }))
            .post(route("academic.marks.store"), {
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
                        Enter the program version unit code, then fill
                        registration numbers and marks manually.
                    </p>
                </div>
            }
        >
            <Head title="Marks Entry" />

            <div className="mx-auto max-w-6xl space-y-8">

                {/* ── Form 1: Load Unit ── */}
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

                    <div>
                        <InputLabel value="Program Version Unit Code" required />
                        <input
                            type="text"
                            value={filterForm.data.program_version_unit_code}
                            onChange={(e) =>
                                filterForm.setData(
                                    "program_version_unit_code",
                                    e.target.value.toUpperCase()
                                )
                            }
                            className="mt-2 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-400"
                            placeholder="e.g. ICT101"
                        />
                        <InputError
                            message={filterForm.errors.program_version_unit_code}
                            className="mt-2"
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="text-sm text-zinc-500">
                            {selected_unit ? (
                                <span className="font-semibold text-zinc-800">
                                    {selected_unit.code} – {selected_unit.name}
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

                {/* ── Form 2: Enter Marks ── */}
                {selected_unit ? (
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
                                    Enter registration number and marks between
                                    0 and 100 for this assessment.
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

                        {blocker && (
                            <div className="rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-800">
                                {blocker}
                            </div>
                        )}

                        {marksForm.errors.entries && (
                            <p className="text-sm text-red-600">
                                {marksForm.errors.entries}
                            </p>
                        )}

                        <div className="rounded-2xl bg-zinc-50 px-5 py-4 text-sm text-zinc-600">
                            <span className="font-semibold text-zinc-900">
                                {selected_unit.code} – {selected_unit.name}
                            </span>
                            {" | "}Module {selected_unit.module}
                            {" | "}
                            {selected_unit.program}
                            {" | "}
                            {selected_unit.version}
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <div>
                                <InputLabel value="Assessment Type" required />
                                <select
                                    value={filterForm.data.assessment_type}
                                    onChange={(e) =>
                                        filterForm.setData(
                                            "assessment_type",
                                            e.target.value
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
                                            e.target.value
                                        )
                                    }
                                    className="mt-2 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-400"
                                />
                            </div>
                        </div>

                        {/* Hidden fields carry filter state to the POST */}
                        <input type="hidden" value={filters.program_version_unit_code} name="program_version_unit_code" />
                        <input type="hidden" value={filterForm.data.assessment_type} name="assessment_type" />
                        <input type="hidden" value={filterForm.data.assessment_number} name="assessment_number" />

                        <div className="overflow-hidden rounded-2xl border border-zinc-100">
                            <div className="grid grid-cols-2 gap-4 bg-zinc-50 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-zinc-500">
                                <p>Registration No.</p>
                                <p>Marks</p>
                            </div>

                            {marksForm.data.entries.map((entry, index) => (
                                <div
                                    key={index}
                                    className="grid grid-cols-2 gap-4 border-t border-zinc-100 bg-white px-4 py-3"
                                >
                                    <div>
                                        <input
                                            type="text"
                                            value={entry.registration_number}
                                            onChange={(e) =>
                                                updateEntry(index, "registration_number", e.target.value)
                                            }
                                            className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm outline-none transition focus:border-emerald-400"
                                            placeholder="TVET/..."
                                        />
                                        <InputError
                                            message={marksForm.errors[`entries.${index}.registration_number`]}
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
                                                updateEntry(index, "marks", e.target.value)
                                            }
                                            className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm outline-none transition focus:border-emerald-400"
                                            placeholder="0 – 100"
                                        />
                                        <InputError
                                            message={marksForm.errors[`entries.${index}.marks`]}
                                            className="mt-2"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="flex items-center justify-between pt-2">
                            <button
                                type="submit"
                                disabled={marksForm.processing}
                                className="rounded-xl bg-emerald-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-emerald-700 disabled:opacity-60"
                            >
                                {marksForm.processing ? "Saving…" : "Save Marks"}
                            </button>
                            <Link
                                href={route("staff.dashboard")}
                                className="rounded-xl border border-zinc-200 px-5 py-3 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50"
                            >
                                Cancel
                            </Link>
                        </div>
                    </form>
                ) : (
                    <div className="rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm">
                        <div className="flex items-center gap-3 rounded-2xl border border-blue-200 bg-blue-50 px-5 py-4 text-sm text-blue-800">
                            <svg className="h-5 w-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zm-11-1a1 1 0 11-2 0 1 1 0 012 0z" clipRule="evenodd" />
                            </svg>
                            <span className="font-semibold">Load a unit first</span>
                            <p className="ml-auto text-xs">
                                Enter the unit code and click "Load Unit" above to start entering marks.
                            </p>
                        </div>
                    </div>
                )}

                {/* ── Submitted Marks ── */}
                {selected_unit ? (
                    <div className="rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm">
                        <div className="mb-6">
                            <h2 className="text-xl font-semibold text-zinc-900">
                                Submitted Marks
                            </h2>
                            <p className="mt-1 text-sm text-zinc-500">
                                Filter by module and academic year, then click Search.
                            </p>
                        </div>

                        {/* ── Filter bar ── */}
                        <form
                            onSubmit={searchMarks}
                            className="mb-6 grid grid-cols-1 gap-3 rounded-2xl border border-zinc-100 bg-zinc-50 p-4 sm:grid-cols-[1fr,1fr,1fr,auto]"
                        >
                            <div className="flex flex-col gap-1">
                                <label className="text-xs font-medium text-zinc-500">
                                    Academic year
                                </label>
                                <select
                                    value={filterForm.data.academic_year}
                                    onChange={(e) => {
                                        const newYear = e.target.value;
                                        // Clear module – options will refresh for the new year
                                        filterForm.setData("module", "");
                                        filterForm.setData("academic_year", newYear);
                                        // Re-fetch the scoped module options immediately
                                        // (no search_marks flag so no rows load yet)
                                        router.get(
                                            route("academic.marks.index"),
                                            {
                                                program_version_unit_code:
                                                    filterForm.data.program_version_unit_code,
                                                assessment_type: filterForm.data.assessment_type,
                                                assessment_number: filterForm.data.assessment_number,
                                                academic_year: newYear,
                                                module: "",
                                            },
                                            { preserveState: true, preserveScroll: true }
                                        );
                                    }}
                                    className="rounded-xl border border-zinc-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-emerald-400"
                                >
                                    <option value="">All years</option>
                                    {filter_options?.academic_years?.map((opt) => (
                                        <option key={opt.value} value={opt.value}>
                                            {opt.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex flex-col gap-1">
                                <label className="text-xs font-medium text-zinc-500">
                                    Module
                                    {filterForm.data.academic_year && (
                                        <span className="ml-1 text-zinc-400">
                                            (for selected year)
                                        </span>
                                    )}
                                </label>
                                <select
                                    value={filterForm.data.module}
                                    onChange={(e) =>
                                        filterForm.setData("module", e.target.value)
                                    }
                                    className="rounded-xl border border-zinc-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-emerald-400"
                                    disabled={!filterForm.data.academic_year && filter_options?.modules?.length === 0}
                                >
                                    <option value="">All modules</option>
                                    {filter_options?.modules?.map((opt) => (
                                        <option key={opt.value} value={opt.value}>
                                            {opt.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex items-end">
                                <button
                                    type="submit"
                                    className="w-full rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-emerald-700 sm:w-auto"
                                >
                                    Search
                                </button>
                            </div>
                        </form>

                        {/* ── Results ── */}
                        {!hasSearched ? (
                            <div className="rounded-2xl border border-zinc-100 bg-zinc-50 px-5 py-10 text-center text-sm text-zinc-400">
                                Use the filters above and click Search to view submitted marks.
                            </div>
                        ) : (
                            <div className="overflow-hidden rounded-2xl border border-zinc-100">
                                <div className="overflow-x-auto">
                                    <table className="w-full min-w-[52rem] border-collapse">
                                        <thead className="bg-zinc-50">
                                            <tr className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                                                <th className="px-4 py-3 text-left">Reg. No.</th>
                                                <th className="px-4 py-3 text-left">Student</th>
                                                <th className="px-4 py-3 text-left">Unit</th>
                                                <th className="px-4 py-3 text-left">Marks</th>
                                                <th className="px-4 py-3 text-left">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-zinc-100 bg-white">
                                            {submitted_marks?.length ? (
                                                submitted_marks.map((mark) => (
                                                    <tr key={mark.id} className="text-sm">
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
                                                                {mark.is_published ? "Published" : "Unpublished"}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td
                                                        colSpan="5"
                                                        className="px-4 py-8 text-center text-sm text-zinc-500"
                                                    >
                                                        No submitted marks found for this filter.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm">
                        <div className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-gray-50 px-5 py-4 text-sm text-gray-800">
                            <svg className="h-5 w-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zm-11-1a1 1 0 11-2 0 1 1 0 012 0z" clipRule="evenodd" />
                            </svg>
                            <span className="font-semibold">Load a unit first</span>
                            <p className="ml-auto text-xs">
                                Enter the unit code and click "Load Unit" above to view submitted marks.
                            </p>
                        </div>
                    </div>
                )}

            </div>
        </AuthenticatedLayout>
    );
}
