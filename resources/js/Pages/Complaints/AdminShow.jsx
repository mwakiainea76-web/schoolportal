import { Head, router, useForm } from "@inertiajs/react";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextArea from "@/Components/TextArea";

const STATUS_STYLES = {
    pending: "bg-amber-100 text-amber-700 border-amber-200",
    in_review: "bg-sky-100 text-sky-700 border-sky-200",
    escalated: "bg-purple-100 text-purple-700 border-purple-200",
    resolved: "bg-emerald-100 text-emerald-700 border-emerald-200",
};

export default function AdminShow({ complaint, staffOptions }) {
    const form = useForm({
        escalated_to: "",
        admin_notes: complaint.admin_notes || "",
    });

    const escalateComplaint = (e) => {
        e.preventDefault();
        form.post(route("complaints.admin.escalate", complaint.id));
    };

    const resolveComplaint = (e) => {
        e.preventDefault();
        router.post(
            route("complaints.admin.resolve", complaint.id),
            { admin_notes: form.data.admin_notes },
            { preserveState: true, preserveScroll: true },
        );
    };

    return (
        <>
            <Head title={`Complaint: ${complaint.subject}`} />

            <div className="mx-auto max-w-3xl">
                <div className="mb-4">
                    <a
                        href={route("complaints.admin.index")}
                        className="text-sm font-medium text-sky-600 hover:text-sky-800"
                    >
                        &larr; Back to Complaints
                    </a>
                </div>

                <div className="rounded-lg border border-zinc-100 bg-white p-6 shadow-sm">
                    <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
                        <div>
                            <h1 className="text-lg font-semibold text-zinc-950">
                                {complaint.subject}
                            </h1>
                            <p className="mt-1 text-sm text-zinc-500">
                                Submitted{" "}
                                {complaint.created_at}
                            </p>
                        </div>
                        <span
                            className={`inline-flex rounded-full border px-3 py-1 text-xs font-medium capitalize ${
                                STATUS_STYLES[complaint.status] ||
                                "bg-zinc-100 text-zinc-600"
                            }`}
                        >
                            {complaint.status.replace("_", " ")}
                        </span>
                    </div>

                    <div className="mb-6 grid grid-cols-2 gap-4 rounded-lg bg-zinc-50 p-4 text-sm">
                        <div>
                            <span className="font-medium text-zinc-700">
                                Student:
                            </span>{" "}
                            <span className="text-zinc-600">
                                {complaint.student?.name ?? "N/A"}
                            </span>
                        </div>
                        <div>
                            <span className="font-medium text-zinc-700">
                                Admission No:
                            </span>{" "}
                            <span className="text-zinc-600">
                                {complaint.student?.admission_number ?? "N/A"}
                            </span>
                        </div>
                        <div>
                            <span className="font-medium text-zinc-700">
                                Email:
                            </span>{" "}
                            <span className="text-zinc-600">
                                {complaint.student?.email ?? "N/A"}
                            </span>
                        </div>
                        {complaint.escalated_to && (
                            <div>
                                <span className="font-medium text-zinc-700">
                                    Escalated To:
                                </span>{" "}
                                <span className="text-zinc-600">
                                    {complaint.escalated_to.name} (
                                    {complaint.escalated_to.designation} -{" "}
                                    {complaint.escalated_to.department})
                                </span>
                            </div>
                        )}
                    </div>

                    <div className="mb-6">
                        <h2 className="mb-2 text-sm font-semibold text-zinc-700">
                            Description
                        </h2>
                        <p className="whitespace-pre-wrap rounded-lg border border-zinc-200 bg-white p-4 text-sm text-zinc-600">
                            {complaint.description}
                        </p>
                    </div>

                    {complaint.admin_notes && (
                        <div className="mb-6">
                            <h2 className="mb-2 text-sm font-semibold text-zinc-700">
                                Admin Notes
                            </h2>
                            <p className="whitespace-pre-wrap rounded-lg border border-zinc-200 bg-zinc-50 p-4 text-sm text-zinc-600">
                                {complaint.admin_notes}
                            </p>
                        </div>
                    )}

                    {complaint.status !== "resolved" && (
                        <div className="border-t border-zinc-100 pt-6">
                            <h2 className="mb-4 text-sm font-semibold text-zinc-700">
                                Actions
                            </h2>

                            <form onSubmit={escalateComplaint} className="mb-4">
                                <div className="mb-3">
                                    <InputLabel value="Escalate to Responsible Person" />
                                    <select
                                        value={form.data.escalated_to}
                                        onChange={(e) =>
                                            form.setData(
                                                "escalated_to",
                                                e.target.value,
                                            )
                                        }
                                        className="mt-1 w-full rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
                                    >
                                        <option value="">
                                            Select staff member...
                                        </option>
                                        {staffOptions.map((staff) => (
                                            <option
                                                key={staff.value}
                                                value={staff.value}
                                            >
                                                {staff.label}
                                            </option>
                                        ))}
                                    </select>
                                    <InputError
                                        message={form.errors.escalated_to}
                                    />
                                </div>

                                <div className="mb-3">
                                    <InputLabel value="Admin Notes" />
                                    <TextArea
                                        value={form.data.admin_notes}
                                        onChange={(e) =>
                                            form.setData(
                                                "admin_notes",
                                                e.target.value,
                                            )
                                        }
                                        className="mt-1 w-full"
                                        rows={3}
                                        placeholder="Add notes about this escalation..."
                                    />
                                    <InputError
                                        message={form.errors.admin_notes}
                                    />
                                </div>

                                <div className="flex gap-2">
                                    <PrimaryButton
                                        disabled={
                                            form.processing ||
                                            !form.data.escalated_to
                                        }
                                    >
                                        Escalate
                                    </PrimaryButton>
                                    <button
                                        type="button"
                                        onClick={resolveComplaint}
                                        className="rounded-lg border border-emerald-300 bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700 hover:bg-emerald-100"
                                    >
                                        Mark as Resolved
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
