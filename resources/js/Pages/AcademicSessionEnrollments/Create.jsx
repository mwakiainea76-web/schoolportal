import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import { Head, Link, useForm } from "@inertiajs/react";

function deriveStudyProgress(moduleNumber) {
    const parsedModule = Number.parseInt(moduleNumber, 10);

    if (!Number.isInteger(parsedModule) || parsedModule < 1) {
        return {
            yearOfStudy: "",
            sessionNumber: "",
        };
    }

    return {
        yearOfStudy: Math.floor((parsedModule - 1) / 3) + 1,
        sessionNumber: ((parsedModule - 1) % 3) + 1,
    };
}

export default function Create({ activeSession }) {
    const { data, setData, post, processing, errors } = useForm({
        admission_number: "",
        active_session_id: activeSession?.id ?? "",
        module_number: "",
    });

    const studyProgress = deriveStudyProgress(data.module_number);
    const activeSessionNumber = activeSession?.session_number ?? null;
    const sessionMismatch =
        data.module_number !== "" &&
        activeSessionNumber !== null &&
        studyProgress.sessionNumber !== "" &&
        studyProgress.sessionNumber !== activeSessionNumber;

    const submit = (e) => {
        e.preventDefault();

        post(route("students.session-enrollment.store"), {
            preserveScroll: true,
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Session Enrolment" />

            <div className="mx-auto w-full max-w-5xl py-6">
                <div className="rounded-[28px] border border-zinc-200 bg-white shadow-sm">
                    <div className="border-b border-zinc-100 px-8 py-6">
                        <h1 className="text-2xl font-semibold text-zinc-900">
                            Enrol Student To Session
                        </h1>
                    </div>

                    <form onSubmit={submit} className="space-y-6 px-8 py-8">
                        {errors.session_registration ? (
                            <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                                {errors.session_registration}
                            </div>
                        ) : null}

                        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                            <div>
                                <InputLabel value="Admission Number" required />
                                <TextInput
                                    required
                                    name="admission_number"
                                    value={data.admission_number}
                                    onChange={(e) =>
                                        setData("admission_number", e.target.value)
                                    }
                                    error={errors.admission_number}
                                    placeholder="TVET/2026/001"
                                />
                                <InputError message={errors.admission_number} />
                            </div>

                            <div>
                                <InputLabel value="Current Year - Current Session" />
                                <input
                                    type="hidden"
                                    name="active_session_id"
                                    value={data.active_session_id}
                                />
                                <TextInput
                                    value={activeSession?.name ?? "No active session"}
                                    disabled
                                    className="text-zinc-500"
                                />
                            </div>

                            <div>
                                <InputLabel value="Module Number" required />
                                <TextInput
                                    required
                                    type="number"
                                    min="1"
                                    name="module_number"
                                    value={data.module_number}
                                    onChange={(e) =>
                                        setData("module_number", e.target.value)
                                    }
                                    error={errors.module_number}
                                    placeholder="4"
                                />
                                <InputError message={errors.module_number} />
                            </div>

                            <div>
                                <InputLabel value="Year Of Study" />
                                <TextInput
                                    value={studyProgress.yearOfStudy}
                                    disabled
                                    className="text-zinc-500"
                                />
                            </div>

                            <div>
                                <InputLabel value="Session Number" />
                                <TextInput
                                    value={studyProgress.sessionNumber}
                                    disabled
                                    className="text-zinc-500"
                                />
                            </div>
                        </div>

                        {sessionMismatch ? (
                            <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
                                Module {data.module_number} maps to Session{" "}
                                {studyProgress.sessionNumber}, but the active session
                                is Session {activeSessionNumber}.
                            </div>
                        ) : null}

                        <div className="flex justify-between pt-2">
                            <Link
                                href={route("academic.sessions.enrollments.index")}
                                className="rounded-xl border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50"
                            >
                                Cancel
                            </Link>
                            <PrimaryButton
                                disabled={
                                    processing ||
                                    !activeSession ||
                                    !data.admission_number.trim() ||
                                    !data.module_number ||
                                    sessionMismatch
                                }
                            >
                                {processing ? "Enrolling..." : "Enroll Student"}
                            </PrimaryButton>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
