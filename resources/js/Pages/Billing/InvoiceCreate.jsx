import React from "react";
import { Head, useForm, Link } from "@inertiajs/react";

import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import SearchSelect from "@/Components/SearchSelect";
import InputLabel from "@/Components/InputLabel";
import InputError from "@/Components/InputError";
import TextInput from "@/Components/TextInput";

export default function InvoiceCreate({ students, enrollments }) {
    const hasStudents = students.length > 0;
    const hasEnrollments = enrollments.length > 0;
    const canCreateInvoice = hasStudents && hasEnrollments;

    const { data, setData, post, processing, errors } = useForm({
        student_id: "",
        enrollment_id: "",
        issue_date: "",
        due_date: "",
    });

    const submit = (e) => {
        e.preventDefault();

        post(route("billing.invoices.store"), {
            preserveScroll: true,
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Create Invoice" />

            <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="bg-white rounded-lg shadow border p-8 space-y-6">
                    <h2 className="text-lg font-semibold text-zinc-700">
                        Create Invoice
                    </h2>

                    <form onSubmit={submit} className="space-y-6">
                        {!canCreateInvoice ? (
                            <div className="rounded border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
                                You cannot create an invoice until both a student and an enrollment exist.
                            </div>
                        ) : null}
                        {/* STUDENT */}
                        <div>
                            <InputLabel value="Student" />
                            <SearchSelect
                                routeName="students.search"
                                defaultOptions={students}
                                disabled={!hasStudents}
                                onChange={(item) =>
                                    setData("student_id", item.id)
                                }
                            />
                            {!hasStudents ? (
                                <p className="mt-1 text-xs text-amber-600">
                                    Create a student first to continue.
                                </p>
                            ) : null}
                            <InputError message={errors.student_id} />
                        </div>

                        {/* ENROLLMENT */}
                        <div>
                            <InputLabel value="Enrollment" />
                            <SearchSelect
                                routeName="enrollments.search"
                                defaultOptions={enrollments}
                                disabled={!hasEnrollments}
                                onChange={(item) =>
                                    setData("enrollment_id", item.id)
                                }
                            />
                            {!hasEnrollments ? (
                                <p className="mt-1 text-xs text-amber-600">
                                    Create an enrollment first to continue.
                                </p>
                            ) : null}
                            <InputError message={errors.enrollment_id} />
                        </div>

                        {/* ISSUE DATE */}
                        <div>
                            <InputLabel value="Issue Date" />
                            <TextInput
                                type="date"
                                value={data.issue_date}
                                onChange={(e) =>
                                    setData("issue_date", e.target.value)
                                }
                            />
                            <InputError message={errors.issue_date} />
                        </div>

                        {/* DUE DATE */}
                        <div>
                            <InputLabel value="Due Date" />
                            <TextInput
                                type="date"
                                value={data.due_date}
                                onChange={(e) =>
                                    setData("due_date", e.target.value)
                                }
                            />
                            <InputError message={errors.due_date} />
                        </div>

                        {/* ACTIONS */}
                        <div className="flex justify-between">
                            <Link
                                href={route("billing.invoices.index")}
                                className="px-4 py-2 bg-slate-400 text-white rounded"
                            >
                                Cancel
                            </Link>

                            <button
                                disabled={processing || !canCreateInvoice}
                                className="px-4 py-2 bg-emerald-600 text-white rounded"
                            >
                                {processing ? "Saving..." : "Create Invoice"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
