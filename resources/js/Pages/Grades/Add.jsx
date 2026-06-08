import { Head, Link, useForm } from "@inertiajs/react";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import SearchSelect from "@/Components/SearchSelect";
import MarksWorkspaceTabs from "@/Pages/Grades/Partials/MarksWorkspaceTabs";

export default function Add({
    filters,
    selected_unit,
    unit_options,
    blocker,
    can_publish,
}) {
    const form = useForm({
        curriculum_unit_id: filters.curriculum_unit_id || "",
        assessment_type: filters.assessment_type || "theory",
        assessment_number: filters.assessment_number || "1",
        student_identifier: "",
        marks: "",
    });

    const submit = (e) => {
        e.preventDefault();
        form.post(route("academic.marks.add.store"), {
            preserveScroll: true,
            onSuccess: () => {
                form.setData("student_identifier", "");
                form.setData("marks", "");
            },
        });
    };

    return (
        <>
            <Head title="Add Marks" />

            <div className="mx-auto max-w-6xl space-y-8">
                <form
                    onSubmit={submit}
                    className="space-y-6 rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm"
                >
                    <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm text-emerald-800">
                        Theory assessments can have multiple tests. Use the
                        assessment number to separate Test 1, Test 2, and later
                        entries for the same unit.
                    </div>

                    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                        <div>
                            <InputLabel value="Unit" required />
                            <div className="mt-2">
                                <SearchSelect
                                    routeName="units.search"
                                    defaultOptions={unit_options}
                                    value={form.data.curriculum_unit_id}
                                    selectedLabel={
                                        selected_unit
                                            ? selected_unit.display_name
                                            : null
                                    }
                                    placeholder="Search unit..."
                                    preloadOptions
                                    onChange={(unit) =>
                                        form.setData(
                                            "curriculum_unit_id",
                                            unit.id || "",
                                        )
                                    }
                                    error={form.errors.curriculum_unit_id}
                                />
                            </div>
                            <InputError
                                message={form.errors.curriculum_unit_id}
                                className="mt-2"
                            />
                        </div>

                        <div>
                            <InputLabel value="Assessment Type" required />
                            <select
                                value={form.data.assessment_type}
                                onChange={(e) =>
                                    form.setData(
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
                                value={form.data.assessment_number}
                                onChange={(e) =>
                                    form.setData(
                                        "assessment_number",
                                        e.target.value,
                                    )
                                }
                                className="mt-2 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-400"
                            />
                        </div>

                        <div>
                            <InputLabel value="Admission Number / Student ID" required />
                            <input
                                type="text"
                                value={form.data.student_identifier}
                                onChange={(e) =>
                                    form.setData(
                                        "student_identifier",
                                        e.target.value,
                                    )
                                }
                                className="mt-2 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-400"
                                placeholder="Student ID or TVET/..."
                            />
                            <InputError
                                message={form.errors.student_identifier}
                                className="mt-2"
                            />
                        </div>

                        <div>
                            <InputLabel value="Marks" required />
                            <input
                                type="number"
                                min="0"
                                max="100"
                                step="1"
                                value={form.data.marks}
                                onChange={(e) =>
                                    form.setData("marks", e.target.value)
                                }
                                className="mt-2 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-400"
                                placeholder="0 - 100"
                            />
                            <InputError
                                message={form.errors.marks}
                                className="mt-2"
                            />
                        </div>
                    </div>

                    <div className="rounded-2xl bg-zinc-50 px-5 py-4 text-sm text-zinc-600">
                        {selected_unit ? (
                            <>
                                <span className="font-semibold text-zinc-900">
                                    {selected_unit.code} - {selected_unit.name}
                                </span>
                                {" | "}Module {selected_unit.module}
                                {" | "}
                                {selected_unit.course}
                                {" | "}
                                {selected_unit.version}
                            </>
                        ) : (
                            "Select the unit, assessment type, and assessment number once, then keep entering students and marks."
                        )}
                    </div>

                    {blocker && (
                        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-800">
                            {blocker}
                        </div>
                    )}

                    <div className="flex items-center justify-between pt-2">
                        <Link
                            href={route("dashboard")}
                            className="rounded-xl border border-zinc-200 px-5 py-3 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50"
                        >
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            disabled={form.processing || !form.data.curriculum_unit_id}
                            className="rounded-xl bg-emerald-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {form.processing ? "Saving..." : "Save Marks"}
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
}
            </form>
            </div>
        </>
    );
}
