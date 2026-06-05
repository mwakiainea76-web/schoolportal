import { Head, router, useForm } from "@inertiajs/react";
import { useEffect, useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";

export default function CourseChange({
    filters,
    student,
    lookupError,
    curriculumMappings,
    latestTransfer,
}) {
    const [showConfirm, setShowConfirm] = useState(false);
    const lookupForm = useForm({
        registration_number: filters.registration_number || "",
    });
    const transferForm = useForm({
        registration_number: filters.registration_number || "",
        new_curriculum_mapping_id: "",
        notes: "",
    });

    useEffect(() => {
        transferForm.setData("registration_number", filters.registration_number || "");
    }, [filters.registration_number]);

    const selectedCourse = curriculumMappings.find(
        (course) =>
            String(course.id) ===
            String(transferForm.data.new_curriculum_mapping_id),
    );
    const isSameCourse =
        student &&
        selectedCourse &&
        Number(student.current_curriculum_mapping_id) ===
            Number(selectedCourse.id);

    const lookupStudent = (e) => {
        e.preventDefault();
        router.get(
            route("students.course-change.index"),
            {
                registration_number: lookupForm.data.registration_number,
            },
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
        setShowConfirm(false);
    };

    const submitTransfer = (e) => {
        e.preventDefault();
        transferForm.post(route("students.course-change.store"), {
            preserveScroll: true,
            onSuccess: () => {
                setShowConfirm(false);
                transferForm.reset("new_curriculum_mapping_id", "notes");
                lookupForm.reset("registration_number");
            },
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <div>
                    <h1 className="text-3xl font-semibold text-zinc-900">
                        Student Course Change
                    </h1>
                    <p className="mt-2 max-w-3xl text-sm text-zinc-600">
                        Transfer a student into another active course while
                        keeping enrolment and login history intact.
                    </p>
                </div>
            }
        >
            <Head title="Student Course Change" />

            <div className="mx-auto max-w-5xl space-y-6">
                {latestTransfer ? (
                    <section className="rounded-3xl border border-zinc-200 bg-white p-6 text-sm text-zinc-900 shadow-sm">
                        <h2 className="text-lg font-semibold">
                            Course change completed
                        </h2>
                        <div className="mt-4 grid gap-3 md:grid-cols-2">
                            <Info label="Old admission number" value={latestTransfer.old_registration_number} />
                            <Info label="New admission number" value={latestTransfer.new_registration_number} />
                            <Info label="Old course" value={latestTransfer.old_course} />
                            <Info label="New course" value={latestTransfer.new_course} />
                            <Info label="New username" value={latestTransfer.username} />
                        </div>
                    </section>
                ) : null}

                <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
                    <form onSubmit={lookupStudent} className="grid gap-4 md:grid-cols-[1fr,auto] md:items-end">
                        <div>
                            <InputLabel value="Existing Registration Number" required />
                            <input
                                type="text"
                                value={lookupForm.data.registration_number}
                                onChange={(e) =>
                                    lookupForm.setData(
                                        "registration_number",
                                        e.target.value.toUpperCase(),
                                    )
                                }
                                className="mt-2 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-400"
                                placeholder="STD/2026/05/0001"
                            />
                            <InputError message={lookupForm.errors.registration_number} className="mt-2" />
                        </div>
                        <button
                            type="submit"
                            className="rounded-xl bg-emerald-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-emerald-700"
                        >
                            Look Up Student
                        </button>
                    </form>

                    {lookupError ? (
                        <div className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">
                            {lookupError}
                        </div>
                    ) : null}
                </section>

                {student ? (
                    <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
                        <h2 className="text-lg font-semibold text-zinc-900">
                            Confirm Student
                        </h2>
                        <div className="mt-4 grid gap-3 md:grid-cols-2">
                            <Info label="Full name" value={student.full_name} />
                            <Info label="Current course" value={student.current_course} />
                            <Info label="Current admission number" value={student.current_admission_number} />
                            <Info label="Current enrolment status" value={student.current_enrolment_status} />
                        </div>

                        <form onSubmit={submitTransfer} className="mt-6 space-y-5">
                            <div>
                                <InputLabel value="New Course" required />
                                <select
                                    value={transferForm.data.new_curriculum_mapping_id}
                                    onChange={(e) => {
                                        transferForm.setData(
                                            "new_curriculum_mapping_id",
                                            e.target.value,
                                        );
                                        setShowConfirm(false);
                                    }}
                                    className="mt-2 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-400"
                                >
                                    <option value="">Select a new course</option>
                                    {curriculumMappings.map((course) => (
                                        <option key={course.id} value={course.id}>
                                            {course.name}
                                        </option>
                                    ))}
                                </select>
                                <InputError message={transferForm.errors.new_curriculum_mapping_id} className="mt-2" />
                                {isSameCourse ? (
                                    <p className="mt-2 text-sm text-red-600">
                                        New course must differ from current course.
                                    </p>
                                ) : null}
                            </div>

                            <div>
                                <InputLabel value="Notes" />
                                <textarea
                                    value={transferForm.data.notes}
                                    onChange={(e) =>
                                        transferForm.setData("notes", e.target.value)
                                    }
                                    className="mt-2 min-h-24 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-400"
                                    placeholder="Optional reason or approval reference"
                                />
                                <InputError message={transferForm.errors.notes} className="mt-2" />
                            </div>

                            {selectedCourse && !isSameCourse ? (
                                <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-4 text-sm text-amber-900">
                                    <p className="font-semibold">
                                        Transfer summary
                                    </p>
                                    <p className="mt-2">
                                        {student.current_course} → {selectedCourse.name}
                                    </p>
                                </div>
                            ) : null}

                            {showConfirm ? (
                                <div className="flex flex-col gap-3 rounded-2xl bg-zinc-50 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
                                    <p className="text-sm text-zinc-600">
                                        Confirming will deactivate the old login,
                                        create a new student login, and record an
                                        audit trail.
                                    </p>
                                    <button
                                        type="submit"
                                        disabled={transferForm.processing || isSameCourse}
                                        className="rounded-xl bg-emerald-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-emerald-700 disabled:opacity-60"
                                    >
                                        {transferForm.processing
                                            ? "Processing..."
                                            : "Confirm Course Change"}
                                    </button>
                                </div>
                            ) : (
                                <div className="flex justify-end">
                                    <button
                                        type="button"
                                        disabled={!selectedCourse || isSameCourse}
                                        onClick={() => setShowConfirm(true)}
                                        className="rounded-xl bg-zinc-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:opacity-60"
                                    >
                                        Review Change
                                    </button>
                                </div>
                            )}
                        </form>
                    </section>
                ) : null}
            </div>
        </AuthenticatedLayout>
    );
}

function Info({ label, value }) {
    return (
        <div className="rounded-2xl bg-zinc-50 px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                {label}
            </p>
            <p className="mt-1 text-sm font-semibold text-zinc-900">
                {value || "-"}
            </p>
        </div>
    );
}
