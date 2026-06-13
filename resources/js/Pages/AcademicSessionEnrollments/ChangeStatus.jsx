import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import SearchSelect from "@/Components/SearchSelect";
import TextArea from "@/Components/TextArea";
import TextInput from "@/Components/TextInput";
import { Head, Link, useForm, usePage } from "@inertiajs/react";
import { ClipboardCheck, RefreshCcw } from "lucide-react";

export default function ChangeStatus({ statuses = [] }) {
    const { auth } = usePage().props;
    const { data, setData, post, processing, errors } = useForm({
        admission_number: "",
        status: "active",
        effective_date: new Date().toISOString().slice(0, 10),
        reason: "",
        resume_date: "",
    });

    const statusOptions = statuses.map((status) => ({
        id: status,
        name: status.charAt(0).toUpperCase() + status.slice(1),
    }));

    const requiresReason = ["deferred", "expelled"].includes(data.status);
    const showResumeDate = data.status === "deferred";
    const isFormIncomplete =
        !data.admission_number.trim() ||
        !data.status.trim() ||
        !data.effective_date.trim() ||
        (requiresReason && !data.reason.trim());

    const submit = (e) => {
        e.preventDefault();

        post(route("students.session-enrollment-status.store"), {
            preserveScroll: true,
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header="Students / Change Student Status"
        >
            <Head title="Change Student Status" />

            <div className="mx-auto w-full max-w-5xl py-6">
                <div className="rounded-[28px] border border-zinc-200 bg-white shadow-sm">
                    <div className="border-b border-zinc-100 px-8 py-6">
                        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                            <div className="flex items-start gap-4">
                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                                    <ClipboardCheck className="h-6 w-6" />
                                </div>

                                <div>
                                    <h1 className="text-2xl font-semibold text-zinc-900">
                                        Change Student Status
                                    </h1>
                                    <p className="mt-1 text-sm text-zinc-500">
                                        Update the current student status and
                                        keep a dated audit trail for every
                                        transition.
                                    </p>
                                </div>
                            </div>

                            <Link
                                href={route(
                                    "students.session-enrollment.create",
                                )}
                                className="inline-flex items-center justify-center rounded-xl border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50"
                            >
                                Back to Session Enrolment
                            </Link>
                        </div>
                    </div>

                    <form onSubmit={submit} className="space-y-6 px-8 py-8">
                        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                            <div>
                                <InputLabel value="Admission Number" required />
                                <TextInput
                                    required
                                    name="admission_number"
                                    value={data.admission_number}
                                    onChange={(e) =>
                                        setData(
                                            "admission_number",
                                            e.target.value,
                                        )
                                    }
                                    error={errors.admission_number}
                                    placeholder="TVET/2026/001"
                                />
                                <InputError message={errors.admission_number} />
                            </div>

                            <div>
                                <InputLabel value="Student Status" required />
                                <SearchSelect
                                    defaultOptions={statusOptions}
                                    value={data.status}
                                    onChange={(status) =>
                                        setData(
                                            "status",
                                            status.name.toLowerCase(),
                                        )
                                    }
                                    error={errors.status}
                                    placeholder="Select status..."
                                />
                                <InputError message={errors.status} />
                            </div>

                            <div>
                                <InputLabel value="Effective Date" required />
                                <TextInput
                                    type="date"
                                    name="effective_date"
                                    value={data.effective_date}
                                    onChange={(e) =>
                                        setData(
                                            "effective_date",
                                            e.target.value,
                                        )
                                    }
                                    error={errors.effective_date}
                                />
                                <InputError message={errors.effective_date} />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                            {showResumeDate ? (
                                <div>
                                    <InputLabel value="Resume Date" />
                                    <TextInput
                                        type="date"
                                        name="resume_date"
                                        value={data.resume_date}
                                        onChange={(e) =>
                                            setData(
                                                "resume_date",
                                                e.target.value,
                                            )
                                        }
                                        error={errors.resume_date}
                                    />
                                    <InputError message={errors.resume_date} />
                                </div>
                            ) : (
                                <div />
                            )}

                            <div
                                className={
                                    showResumeDate ? "" : "md:col-span-2"
                                }
                            >
                                <InputLabel
                                    value="Reason"
                                    required={requiresReason}
                                />
                                <TextArea
                                    name="reason"
                                    rows={4}
                                    value={data.reason}
                                    onChange={(e) =>
                                        setData("reason", e.target.value)
                                    }
                                    className="rounded-xl border-zinc-200 bg-zinc-50 px-4 py-3 text-sm shadow-sm focus:border-zinc-300 focus:ring-zinc-200"
                                />
                                <InputError message={errors.reason} />
                            </div>
                        </div>

                        <div className="flex justify-between pt-2">
                            <Link
                                href={route(
                                    "academic.sessions.enrollments.index",
                                )}
                                className="rounded-xl border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50"
                            >
                                Cancel
                            </Link>
                            <PrimaryButton
                                disabled={processing || isFormIncomplete}
                                className="inline-flex items-center gap-2"
                            >
                                <RefreshCcw className="h-4 w-4" />
                                {processing
                                    ? "Updating..."
                                    : "Update Student Status"}
                            </PrimaryButton>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
