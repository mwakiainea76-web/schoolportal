import { useForm, Head, Link } from "@inertiajs/react";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import InputError from "@/Components/InputError";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import AcademicCalendarWorkspaceTabs from "@/Pages/Academic/Partials/AcademicCalendarWorkspaceTabs";

export default function Create({ activeSession }) {
    const { data, setData, post, processing, errors } = useForm({
        admission_number: "",
    });

    const submit = (e) => {
        e.preventDefault();
        post(route("academic.sessions.enrollments.store"), {
            preserveScroll: true,
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Enroll Student in Session" />

            <div className="mx-auto max-w-2xl w-full">
                <AcademicCalendarWorkspaceTabs activeTab="add-enrollment" />

                <div className="mb-6">
                    <h1 className="text-2xl font-semibold text-gray-800">
                        Enroll Student in Academic Session
                    </h1>
                    <p className="text-sm text-gray-500">
                        The system will automatically detect the current active
                        session and calculate the student's module.
                    </p>
                </div>

                <form
                    onSubmit={submit}
                    className="bg-white p-8 space-y-6 border rounded-lg shadow-sm"
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Admission Number */}
                        <div>
                            <InputLabel
                                value="Student Admission Number"
                                required
                            />
                            <TextInput
                                type="text"
                                name="admission_number"
                                value={data.admission_number}
                                onChange={(e) =>
                                    setData(
                                        "admission_number",
                                        e.target.value,
                                    )
                                }
                                placeholder="e.g. STD/001/2026"
                                className="mt-1 block w-full"
                            />
                            <InputError message={errors.admission_number} />
                        </div>

                        {/* Active Session — read only */}
                        <div>
                            <InputLabel value="Active Academic Session" />
                            <TextInput
                                type="text"
                                value={
                                    activeSession
                                        ? activeSession.name
                                        : "No active session"
                                }
                                disabled
                                className="mt-1 block w-full bg-gray-100 text-gray-500 cursor-not-allowed"
                            />
                            {!activeSession && (
                                <p className="mt-1 text-xs text-red-500">
                                    No active session found. Please activate a
                                    session before enrolling.
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="flex justify-between pt-4">
                        <Link
                            href={route("academic.sessions.enrollments.index")}
                            className="px-4 py-2 bg-slate-400 text-white rounded hover:bg-slate-700 transition"
                        >
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            disabled={processing || !activeSession}
                            className="px-6 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700 transition disabled:opacity-50"
                        >
                            {processing ? "Enrolling..." : "Enroll Student"}
                        </button>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
