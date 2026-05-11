import React from "react";
import { Head, Link, useForm } from "@inertiajs/react";

import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import SearchSelect from "@/Components/SearchSelect";
import TextInput from "@/Components/TextInput";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function Create({ feePlans, academicYear, curriculums }) {
    const { data, setData, post, processing, errors } = useForm({
        fee_plan_id: "",
        academic_year_id: "",
        course_curriculum_id: "",
        year_of_study: "",
        session_number: "",
    });

    const submit = (e) => {
        e.preventDefault();

        post(route("fees.assignments.store"), {
            preserveScroll: true,
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Create Fee Assignment" />

            <div className="mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="overflow-hidden rounded-lg border border-zinc-100 bg-white shadow-sm">
                    <div className="bg-slate-400 py-2 text-center text-sm font-medium text-white">
                        Create Curriculum Fee Assignment
                    </div>

                    <form className="space-y-8 p-10" onSubmit={submit}>
                        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
                            <div>
                                <InputLabel value="Academic year" />
                                <SearchSelect
                                    defaultOptions={academicYear}
                                    placeholder="Select academic year..."
                                    onChange={(item) =>
                                        setData("academic_year_id", item.id)
                                    }
                                />
                                <InputError message={errors.academic_year_id} />
                            </div>

                            <div>
                                <InputLabel value="Fee Plan" />
                                <SearchSelect
                                    routeName="fee-plans.search"
                                    defaultOptions={feePlans}
                                    placeholder="Select fee plan..."
                                    onChange={(item) =>
                                        setData("fee_plan_id", item.id)
                                    }
                                />
                                <InputError message={errors.fee_plan_id} />
                            </div>

                            <div>
                                <InputLabel value="Curriculum" />
                                <SearchSelect
                                    routeName="curriculums.search"
                                    defaultOptions={curriculums}
                                    placeholder="Select curriculum..."
                                    onChange={(item) =>
                                        setData("course_curriculum_id", item.id)
                                    }
                                />
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
                                disabled={processing}
                                type="submit"
                                className="rounded bg-emerald-600 px-4 py-2 text-white hover:bg-slate-700 disabled:opacity-50"
                            >
                                {processing ? "Saving..." : "Save Assignment"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
