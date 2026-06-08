import { useForm, Head, Link } from "@inertiajs/react";
import InputLabel from "@/Components/InputLabel";
import InputError from "@/Components/InputError";
import AcademicCalendarWorkspaceTabs from "@/Pages/Academic/Partials/AcademicCalendarWorkspaceTabs";

const STATUS_STYLES = {
    active: "bg-emerald-100 text-emerald-700",
    completed: "bg-blue-100 text-blue-700",
    dropped: "bg-red-100 text-red-700",
    transferred: "bg-yellow-100 text-yellow-700",
    suspended: "bg-gray-100 text-gray-600",
};

export default function Edit({ enrollment, statuses }) {
    const { data, setData, patch, processing, errors } = useForm({
        status: enrollment.status,
    });

    const submit = (e) => {
        e.preventDefault();
        patch(route("academic.sessions.enrollments.update", enrollment.id), {
            preserveScroll: true,
        });
    };

    return (
        <>
            <Head title="Edit Enrollment" />

            <div className="mx-auto w-full max-w-5xl space-y-6">
                <AcademicCalendarWorkspaceTabs
                    activeTab="edit-enrollment"
                    enrollmentId={enrollment.id}
                />

                {/* Header */}
                <div>
                    <h1 className="text-2xl font-semibold text-gray-800">
                        Edit Enrollment
                    </h1>
                    <p className="text-sm text-gray-500">
                        Update the status for this student's session enrollment.
                    </p>
                </div>

                <div className="bg-white border rounded-lg shadow-sm p-8 space-y-6">
                    {/* Read-only info */}
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                        <div>
                            <InputLabel value="Student" />
                            <p className="mt-1 px-3 py-2 bg-gray-50 border rounded text-sm text-gray-700">
                                {enrollment.student_name}
                            </p>
                        </div>
                        <div>
                            <InputLabel value="Admission Number" />
                            <p className="mt-1 px-3 py-2 bg-gray-50 border rounded text-sm text-gray-700">
                                {enrollment.admission_number}
                            </p>
                        </div>
                        <div>
                            <InputLabel value="Academic Session" />
                            <p className="mt-1 px-3 py-2 bg-gray-50 border rounded text-sm text-gray-700">
                                {enrollment.session}
                            </p>
                        </div>
                        <div>
                            <InputLabel value="Year Of Study" />
                            <p className="mt-1 px-3 py-2 bg-gray-50 border rounded text-sm text-gray-700">
                                Year {enrollment.year_of_study}
                            </p>
                        </div>
                        <div>
                            <InputLabel value="Module" />
                            <p className="mt-1 px-3 py-2 bg-gray-50 border rounded text-sm text-gray-700">
                                Module {enrollment.module}
                            </p>
                        </div>
                        <div>
                            <InputLabel value="Curriculum" />
                            <p className="mt-1 px-3 py-2 bg-gray-50 border rounded text-sm text-gray-700">
                                {enrollment.curriculum}
                            </p>
                        </div>
                        <div>
                            <InputLabel value="Course" />
                            <p className="mt-1 px-3 py-2 bg-gray-50 border rounded text-sm text-gray-700">
                                {enrollment.course}
                            </p>
                        </div>
                    </div>

                    <hr />

                    {/* Editable status */}
                    <form onSubmit={submit} className="space-y-6">
                        <div>
                            <InputLabel value="Status" required />
                            <div className="mt-2 flex flex-wrap gap-2">
                                {statuses.map((s) => (
                                    <button
                                        key={s}
                                        type="button"
                                        onClick={() => setData("status", s)}
                                        className={`px-4 py-1.5 rounded-full text-sm font-medium border transition ${
                                            data.status === s
                                                ? `${STATUS_STYLES[s]} border-transparent ring-2 ring-offset-1 ring-current`
                                                : "bg-white text-gray-500 border-gray-300 hover:bg-gray-50"
                                        }`}
                                    >
                                        {s.charAt(0).toUpperCase() + s.slice(1)}
                                    </button>
                                ))}
                            </div>
                            <InputError message={errors.status} />
                        </div>

                        <div className="flex justify-between pt-2">
                            <Link
                                href={route(
                                    "academic.sessions.enrollments.index",
                                )}
                                className="px-4 py-2 bg-slate-400 text-white text-sm rounded hover:bg-slate-700 transition"
                            >
                                Cancel
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="px-6 py-2 bg-emerald-600 text-white text-sm rounded hover:bg-emerald-700 transition disabled:opacity-50"
                            >
                                {processing ? "Saving..." : "Save Changes"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}
