import React, { useState } from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import axios from "axios";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import PersonalStep from "./Forms/PersonalDetails";
import EmploymentStep from "./Forms/EmploymentDetails";
import KinStep from "./Forms/KinDetails";

const STEP_LABELS = ["Personal", "Employment", "Next of kin"];
const STEP_HEADERS = [
    "Personal details",
    "Employment details",
    "Next of kin details",
];

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
        "department_id",
        "staff_number",
        "role_name",
        "designation",
        "national_id_number",
        "salary",
        "employment_type",
        "hired_date",
        "staff_status",
        "highest_qualification",
        "specialization",
        "kra_pin",
        "nhif_number",
        "nssf_number",
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

export default function EditStaff({ staff, departments, roles }) {
    const [step, setStep] = useState(1);
    const [stepErrors, setStepErrors] = useState({});
    const [validating, setValidating] = useState(false);

    const { data, setData, put, processing, errors, reset } = useForm({
        first_name: staff.user?.first_name || "",
        last_name: staff.user?.last_name || "",
        other_name: staff.user?.other_name || "",
        email: staff.user?.email || "",
        phone_number: staff.user?.phone_number || "",
        gender: staff.user?.gender || "",
        date_of_birth: staff.user?.date_of_birth || "",
        county: staff.user?.county || "",
        address: staff.user?.address || "",
        religion: staff.user?.religion || "",
        profile_photo: null,

        department_id: staff.department_id || "",
        staff_number: staff.staff_number || "",
        role_name: staff.user?.roles?.[0]?.name || "",
        designation: staff.designation || "",
        national_id_number: staff.national_id_number || "",
        salary: staff.salary || "",
        employment_type: staff.employment_type || "",
        hired_date: staff.hired_date || "",
        staff_status: staff.staff_status || "",
        highest_qualification: staff.highest_qualification || "",
        specialization: staff.specialization || "",
        kra_pin: staff.kra_pin || "",
        nhif_number: staff.nhif_number || "",
        nssf_number: staff.nssf_number || "",

        kin_first_name: staff.user?.nextofkin?.first_name || "",
        kin_last_name: staff.user?.nextofkin?.last_name || "",
        kin_relationship: staff.user?.nextofkin?.relationship || "",
        kin_phone: staff.user?.nextofkin?.phone_number || "",
        kin_alt_phone: staff.user?.nextofkin?.alternate_phone_number || "",
        kin_email: staff.user?.nextofkin?.email || "",

        is_pwd: staff.user?.is_pwd ?? false,
        disability_type: staff.user?.disability_type || "",
        medical_condition: staff.user?.medical_condition || "",
    });

    const allErrors = { ...errors, ...stepErrors };

    // ── Per-step backend validation ─────────────────────────────────
    const nextStep = async () => {
        setStepErrors({});
        setValidating(true);

        const payload = { step };
        STEP_FIELDS[step].forEach((field) => {
            payload[field] = data[field];
        });

        // Pass staff id so the unique-email rule can ignore this record
        payload._staff_id = staff.id;

        try {
            await axios.post(route("staffs.validateStep"), payload);
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
        put(route("staffs.update", staff.id), { preserveScroll: true });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Edit Staff" />
            <div className="mx-auto w-full">
                <div className="rounded-xl shadow-inner pt-2">
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
                            {STEP_HEADERS[step - 1]}
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
                                <EmploymentStep
                                    data={data}
                                    setData={setData}
                                    errors={allErrors}
                                    departments={departments}
                                    roles={roles}
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
                                        href={route("staffs.index")}
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
                                        disabled={validating}
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
                                            "Update staff"
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
