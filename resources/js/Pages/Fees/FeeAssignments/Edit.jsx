import React from "react";
import { Head, Link, useForm } from "@inertiajs/react";

import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import SearchSelect from "@/Components/SearchSelect";
import TextInput from "@/Components/TextInput";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function Edit({
    assignment,
    feePlans,
    academicYear,
    curriculums,
}) {
    const hasAcademicYears = academicYear.length > 0;
    const hasFeePlans = feePlans.length > 0;
    const hasProgramVersions = curriculums.length > 0;
    const canUpdateAssignment =
        !!assignment && hasAcademicYears && hasFeePlans && hasProgramVersions;

    const { data, setData, put, processing, errors } = useForm({
        fee_plan_id: assignment.fee_plan_id || "",
        academic_year_id: assignment.academic_year_id || "",
        course_curriculum_id: assignment.course_curriculum_id || "",
        year_of_study: assignment.year_of_study || "",
        session_number: assignment.session_number || "",
    });

    const submit = (e) => {
        e.preventDefault();

        put(route("fees.assignments.update", assignment.id), {
            preserveScroll: true,
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Edit Fee Assignment" />

            <div className="mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="overflow-hidden rounded-lg border border-zinc-100 bg-white shadow-sm">
                    <div className="bg-slate-400 py-2 text-center text-sm font-medium text-white">
                        Edit Program Version Fee Assignment
                    </div>

                    <form className="space-y-8 p-10" onSubmit={submit}>
                        {!canUpdateAssignment ? (
                            <div className="rounded border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
                                You cannot update this fee assignment until an academic year, a fee plan, and a program version mapping are available.
                            </div>
                        ) : null}
                        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
                            <div>
                                <InputLabel value="Academic year" />
                                <SearchSelect
                                    defaultOptions={academicYear}
                                    value={data.academic_year_id}
                                    placeholder="Select year..."
                                    disabled={!hasAcademicYears}
                                    onChange={(item) =>
                                        setData("academic_year_id", item.id)
                                    }
                                />
                                {!hasAcademicYears ? (
                                    <p className="mt-1 text-xs text-amber-600">
                                        Create an academic year first to continue.
                                    </p>
                                ) : null}
                                <InputError message={errors.academic_year_id} />
                            </div>

                            <div>
                                <InputLabel value="Fee Plan" />
                                <SearchSelect
                                    defaultOptions={feePlans}
                                    value={data.fee_plan_id}
                                    placeholder="Select fee plan..."
                                    disabled={!hasFeePlans}
                                    onChange={(item) =>
                                        setData("fee_plan_id", item.id)
                                    }
                                />
                                {!hasFeePlans ? (
                                    <p className="mt-1 text-xs text-amber-600">
                                        Create a fee plan first to continue.
                                    </p>
                                ) : null}
                                <InputError message={errors.fee_plan_id} />
                            </div>

                            <div>
                                <InputLabel value="Program Version" />
                                <SearchSelect
                                    defaultOptions={curriculums}
                                    value={data.course_curriculum_id}
                                    placeholder="Select program version..."
                                    disabled={!hasProgramVersions}
                                    onChange={(item) =>
                                        setData("course_curriculum_id", item.id)
                                    }
                                />
                                {!hasProgramVersions ? (
                                    <p className="mt-1 text-xs text-amber-600">
                                        Create a program version mapping first to continue.
                                    </p>
                                ) : null}
                                <InputError
                                    message={errors.course_curriculum_id}
                                />
                            </div>

                            <div>
                                <InputLabel value="Year Of Study" />
                                <TextInput
                                    type="number"
                                    min="1"
                                    value={data.year_of_study}
                                    onChange={(e) =>
                                        setData("year_of_study", e.target.value)
                                    }
                                    className="w-full"
                                />
                                <InputError message={errors.year_of_study} />
                            </div>

                            <div>
                                <InputLabel value="Session Number" />
                                <TextInput
                                    type="number"
                                    min="1"
                                    value={data.session_number}
                                    onChange={(e) =>
                                        setData(
                                            "session_number",
                                            e.target.value,
                                        )
                                    }
                                    className="w-full"
                                />
                                <InputError message={errors.session_number} />
                            </div>
                        </div>

                        <div className="flex justify-between pt-4">
                            <Link
                                href={route("fees.assignments.index")}
                                className="rounded bg-slate-400 px-4 py-2 text-white hover:bg-slate-700"
                            >
                                Cancel
                            </Link>

                            <button
                                disabled={processing || !canUpdateAssignment}
                                type="submit"
                                className="rounded bg-emerald-600 px-4 py-2 text-white hover:bg-slate-700 disabled:opacity-50"
                            >
                                {processing
                                    ? "Updating..."
                                    : "Update Assignment"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
