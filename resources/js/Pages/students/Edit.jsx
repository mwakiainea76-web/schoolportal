import React, { useState } from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import axios from "axios";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import PersonalStep from "./Forms/PersonalDetails";
import AcademicStep from "./Forms/AcademicDetails";
import KinStep from "./Forms/KinDetails";

const STEP_LABELS = ["Personal", "Academic", "Next of Kin"];

const STEP_FIELDS = {
    1: [
        "first_name",
        "last_name",
        "other_name",
        "email",
        "phone_number",
        "gender",
        "date_of_birth",
        "county",
        "address",
        "religion",
        "is_pwd",
        "disability_type",
        "medical_condition",
    ],
    2: [
        "previous_school",
        "admission_date",
        "current_module",
        "fee_discount_percentage",
        "student_status",
    ],
    3: [
        "kin_first_name",
        "kin_last_name",
        "kin_relationship",
        "kin_phone",
        "kin_alt_phone",
        "kin_email",
    ],
};

export default function EditStudent({ student, courseCurricula = [] }) {
    const [step, setStep] = useState(1);
    const [stepErrors, setStepErrors] = useState({});
    const [validating, setValidating] = useState(false);
    const hasProgramVersionMappings = courseCurricula.length > 0;

    const { data, setData, put, processing, errors } = useForm({
        // Personal
        first_name: student.user?.first_name || "",
        last_name: student.user?.last_name || "",
        other_name: student.user?.other_name || "",
        email: student.user?.email || "",
        phone_number: student.user?.phone_number || "",
        gender: student.user?.gender || "",
        date_of_birth: student.user?.date_of_birth || "",
        county: student.user?.county || "",
        address: student.user?.address || "",
        religion: student.user?.religion || "",
        is_pwd: student.user?.is_pwd ?? false,
        disability_type: student.user?.disability_type || "",
        medical_condition: student.user?.medical_condition || "",

        // Academic
        previous_school: student.previous_school || "",
        course_curriculum_id:
            student.program_enrollment?.program_version_mapping_id || "",
        admission_date: student.admission_date || "",
        current_module: student.current_module || "",
        fee_discount_percentage: student.fee_discount_percentage || "",
        student_status: student.student_status || "active",

        // Kin
        kin_first_name: student.user?.nextofkin?.first_name || "",
        kin_last_name: student.user?.nextofkin?.last_name || "",
        kin_relationship: student.user?.nextofkin?.relationship || "",
        kin_phone: student.user?.nextofkin?.phone_number || "",
        kin_alt_phone: student.user?.nextofkin?.alternate_phone_number || "",
        kin_email: student.user?.nextofkin?.email || "",
    });

    const allErrors = { ...errors, ...stepErrors };

    const nextStep = async () => {
        setStepErrors({});
        setValidating(true);

        const payload = { step, _student_id: student.id };
        STEP_FIELDS[step].forEach((field) => {
            payload[field] = data[field];
        });

        try {
            await axios.post(route("students.validateStep"), payload);
            setStep((s) => Math.min(s + 1, 3));
        } catch (err) {
            if (err.response?.status === 422) {
                setStepErrors(err.response.data.errors ?? {});
            }
        } finally {
            setValidating(false);
        }
    };

    const prevStep = () => {
        setStepErrors({});
        setStep((s) => Math.max(s - 1, 1));
    };

    const submit = (e) => {
        e.preventDefault();
        put(route("students.update", student.id), { preserveScroll: true });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Edit Student" />

            <div className="mx-auto w-full">
                <div className="rounded-xl pt-2">
                    {/* Step indicator */}
                    <div className="flex justify-center gap-2 mb-4">
                        {STEP_LABELS.map((label, i) => {
                            const s = i + 1;
                            const done = s < step;
                            const current = s === step;
                            return (
                                <div
                                    key={s}
                                    className="flex flex-col items-center gap-1"
                                >
                                    <div
                                        className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold transition-colors
                                        ${
                                            done
                                                ? "bg-emerald-500 text-white"
                                                : current
                                                  ? "bg-emerald-600 text-white ring-2 ring-emerald-300"
                                                  : "bg-zinc-200 text-zinc-500"
                                        }`}
                                    >
                                        {done ? "✓" : s}
                                    </div>
                                    <span
                                        className={`text-xs hidden sm:block
                                        ${current ? "text-emerald-700 font-medium" : "text-zinc-400"}`}
                                    >
                                        {label}
                                    </span>
                                </div>
                            );
                        })}
                    </div>

                    {/* Form card */}
                    <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                        <div className="bg-slate-400 text-white text-center py-2 text-sm font-medium">
                            {STEP_LABELS[step - 1]} Details
                        </div>

                        <form onSubmit={submit} className="space-y-6 p-6">
                            {step === 1 && (
                                <PersonalStep
                                    data={data}
                                    setData={setData}
                                    errors={allErrors}
                                />
                            )}
                            {step === 2 && (
                                <AcademicStep
                                    data={data}
                                    setData={setData}
                                    errors={allErrors}
                                    courseCurricula={courseCurricula}
                                    isEdit
                                />
                            )}
                            {step === 3 && (
                                <KinStep
                                    data={data}
                                    setData={setData}
                                    errors={allErrors}
                                />
                            )}

                            <div className="flex justify-between pt-4">
                                {step === 1 ? (
                                    <Link
                                        href={route("students.index")}
                                        className="px-5 py-2 bg-zinc-400 text-white rounded-lg hover:bg-zinc-500 transition text-sm"
                                    >
                                        Cancel
                                    </Link>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={prevStep}
                                        className="px-5 py-2 bg-zinc-200 rounded-lg hover:bg-zinc-300 transition text-sm"
                                    >
                                        ← Back
                                    </button>
                                )}

                                {step < 3 ? (
                                    <button
                                        type="button"
                                        onClick={nextStep}
                                        disabled={
                                            validating ||
                                            (step === 2 &&
                                                !hasProgramVersionMappings)
                                        }
                                        className="px-5 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 transition text-sm flex items-center gap-2"
                                    >
                                        {validating ? (
                                            <>
                                                <span className="animate-spin inline-block w-4 h-4 border-[3px] border-white border-t-transparent rounded-full" />
                                                Checking...
                                            </>
                                        ) : (
                                            "Next →"
                                        )}
                                    </button>
                                ) : (
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="px-5 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 transition text-sm flex items-center gap-2"
                                    >
                                        {processing ? (
                                            <>
                                                <span className="animate-spin inline-block w-4 h-4 border-[3px] border-white border-t-transparent rounded-full" />
                                                Updating...
                                            </>
                                        ) : (
                                            "Update"
                                        )}
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
