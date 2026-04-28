import React from "react";
import { useForm, Head, Link } from "@inertiajs/react";

import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import InputError from "@/Components/InputError";
import SearchSelect from "@/Components/SearchSelect";

import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function Edit({ studentInvoice, enrollments, feeModels }) {
    const { data, setData, put, processing, errors } = useForm({
        enrollment_id: studentInvoice.enrollment_id || "",
        fee_model_id: studentInvoice.fee_model_id || "",
        gross_amount: studentInvoice.gross_amount || "",
        adjusted_amount: studentInvoice.adjusted_amount || "",
        credit_balance: studentInvoice.credit_balance || "0",
        overpayment_action: studentInvoice.overpayment_action || "credit",
        due_date: studentInvoice.due_date || "",
    });

    const handleChange = (e) => {
        setData(e.target.name, e.target.value);
    };

    const submit = (e) => {
        e.preventDefault();
        put(route("fees.student-invoices.update", studentInvoice.id), {
            preserveScroll: true,
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title={`Edit Invoice #${studentInvoice.id}`} />

            <div className="mx-auto max-w-5xl w-full">
                <div className="mb-6">
                    <h1 className="text-2xl font-semibold text-gray-800">Edit Invoice #{studentInvoice.id}</h1>
                    <p className="text-sm text-gray-600">Update invoice details for {studentInvoice.enrollment?.student?.user?.first_name} {studentInvoice.enrollment?.student?.user?.last_name}.</p>
                </div>

                <form
                    onSubmit={submit}
                    className="bg-white p-10 space-y-6 border rounded-lg shadow-sm"
                >
                    <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
                        <div>
                            <InputLabel value="Student Enrollment" required />
                            <SearchSelect
                                routeName="enrollments.search"
                                defaultOptions={enrollments}
                                placeholder="Search student enrollment..."
                                value={data.enrollment_id}
                                onChange={(e) => setData("enrollment_id", e.id)}
                                error={errors.enrollment_id}
                            />
                            <InputError message={errors.enrollment_id} />
                        </div>

                        <div>
                            <InputLabel value="Fee Model" required />
                            <SearchSelect
                                routeName="fees.models.search"
                                defaultOptions={feeModels}
                                placeholder="Search fee model..."
                                value={data.fee_model_id}
                                onChange={(m) => setData("fee_model_id", m.id)}
                                error={errors.fee_model_id}
                            />
                            <InputError message={errors.fee_model_id} />
                        </div>
                    </div>

                    <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
                        <div>
                            <InputLabel value="Gross Amount" required />
                            <TextInput
                                type="number"
                                step="0.01"
                                name="gross_amount"
                                value={data.gross_amount}
                                onChange={handleChange}
                                placeholder="0.00"
                                error={errors.gross_amount}
                            />
                            <InputError message={errors.gross_amount} />
                        </div>

                        <div>
                            <InputLabel value="Adjusted Amount" required />
                            <TextInput
                                type="number"
                                step="0.01"
                                name="adjusted_amount"
                                value={data.adjusted_amount}
                                onChange={handleChange}
                                placeholder="0.00"
                                error={errors.adjusted_amount}
                            />
                            <InputError message={errors.adjusted_amount} />
                        </div>

                        <div>
                            <InputLabel value="Credit Balance" />
                            <TextInput
                                type="number"
                                step="0.01"
                                name="credit_balance"
                                value={data.credit_balance}
                                onChange={handleChange}
                                placeholder="0.00"
                                error={errors.credit_balance}
                            />
                            <InputError message={errors.credit_balance} />
                        </div>
                    </div>

                    <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
                        <div>
                            <InputLabel value="Due Date" />
                            <TextInput
                                type="date"
                                name="due_date"
                                value={data.due_date}
                                onChange={handleChange}
                                error={errors.due_date}
                            />
                            <InputError message={errors.due_date} />
                        </div>

                        <div>
                            <InputLabel value="Overpayment Action" />
                            <select
                                name="overpayment_action"
                                value={data.overpayment_action}
                                onChange={handleChange}
                                className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                            >
                                <option value="credit">Keep as Credit</option>
                                <option value="refund">Request Refund</option>
                                <option value="pending">Keep Pending</option>
                            </select>
                            <InputError message={errors.overpayment_action} />
                        </div>
                    </div>

                    <div className="flex justify-between pt-6 border-t">
                        <Link
                            href={route("fees.student-invoices.index")}
                            className="px-4 py-2 bg-slate-400 text-white rounded hover:bg-slate-700 transition"
                        >
                            Cancel
                        </Link>

                        <button
                            type="submit"
                            disabled={processing}
                            className="px-6 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700 transition disabled:opacity-50"
                        >
                            {processing ? "Updating..." : "Update Invoice"}
                        </button>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
