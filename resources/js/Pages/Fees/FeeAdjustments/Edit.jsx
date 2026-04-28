import React from "react";
import { useForm, Head, Link } from "@inertiajs/react";

import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import InputError from "@/Components/InputError";
import SearchSelect from "@/Components/SearchSelect";

import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function Edit({ feeAdjustment, invoices, users }) {
    const { data, setData, put, processing, errors } = useForm({
        student_invoice_id: feeAdjustment.student_invoice_id || "",
        scope: feeAdjustment.scope || "student",
        scope_ref: feeAdjustment.scope_ref || "",
        type: feeAdjustment.type || "fixed",
        value: feeAdjustment.value || "",
        reason: feeAdjustment.reason || "",
        approved_by: feeAdjustment.approved_by || "",
    });

    const handleChange = (e) => {
        setData(e.target.name, e.target.value);
    };

    const submit = (e) => {
        e.preventDefault();
        put(route("fees.adjustments.update", feeAdjustment.id), {
            preserveScroll: true,
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title={`Edit Adjustment #${feeAdjustment.id}`} />

            <div className="mx-auto max-w-4xl w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Edit Adjustment #{feeAdjustment.id}</h1>
                    <p className="text-gray-600 mt-1">Update details for this discount or surcharge.</p>
                </div>

                <form
                    onSubmit={submit}
                    className="bg-white p-8 space-y-6 border rounded-xl shadow-sm"
                >
                    <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
                        <div>
                            <InputLabel value="Student Invoice" required />
                            <SearchSelect
                                routeName="fees.student-invoices.search"
                                defaultOptions={invoices}
                                placeholder="Search student invoice..."
                                value={data.student_invoice_id}
                                onChange={(i) => setData("student_invoice_id", i.id)}
                                error={errors.student_invoice_id}
                            />
                            <InputError message={errors.student_invoice_id} />
                        </div>

                        <div>
                            <InputLabel value="Adjustment Scope" required />
                            <select
                                name="scope"
                                value={data.scope}
                                onChange={handleChange}
                                className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm text-sm"
                            >
                                <option value="student">Student</option>
                                <option value="department">Department</option>
                                <option value="curriculum">Curriculum</option>
                                <option value="session">Session</option>
                            </select>
                            <InputError message={errors.scope} />
                        </div>
                    </div>

                    <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
                        <div>
                            <InputLabel value="Adjustment Type" required />
                            <div className="mt-3 flex gap-6">
                                <label className="inline-flex items-center cursor-pointer group">
                                    <input
                                        type="radio"
                                        name="type"
                                        value="fixed"
                                        checked={data.type === 'fixed'}
                                        onChange={handleChange}
                                        className="text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                                    />
                                    <span className="ml-2 text-sm font-medium text-gray-700 group-hover:text-indigo-600 transition-colors">Fixed Amount</span>
                                </label>
                                <label className="inline-flex items-center cursor-pointer group">
                                    <input
                                        type="radio"
                                        name="type"
                                        value="percentage"
                                        checked={data.type === 'percentage'}
                                        onChange={handleChange}
                                        className="text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                                    />
                                    <span className="ml-2 text-sm font-medium text-gray-700 group-hover:text-indigo-600 transition-colors">Percentage</span>
                                </label>
                            </div>
                            <InputError message={errors.type} />
                        </div>

                        <div>
                            <InputLabel value={data.type === 'percentage' ? "Percentage Value (%)" : "Adjustment Value"} required />
                            <TextInput
                                type="number"
                                step="0.01"
                                name="value"
                                value={data.value}
                                onChange={handleChange}
                                placeholder={data.type === 'percentage' ? "-10" : "-1000.00"}
                                error={errors.value}
                                className="font-mono"
                            />
                            <p className="mt-1.5 text-xs text-gray-500 italic flex items-center gap-1">
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                Use negative values for discounts, positive for surcharges.
                            </p>
                            <InputError message={errors.value} />
                        </div>
                    </div>

                    <div>
                        <InputLabel value="Reason for Adjustment" required />
                        <TextInput
                            type="text"
                            name="reason"
                            value={data.reason}
                            onChange={handleChange}
                            placeholder="e.g. HELB partial scholarship"
                            error={errors.reason}
                        />
                        <InputError message={errors.reason} />
                    </div>

                    <div>
                        <InputLabel value="Approved By" />
                        <SearchSelect
                            routeName="students.search"
                            defaultOptions={users}
                            placeholder="Search approver..."
                            value={data.approved_by}
                            onChange={(u) => setData("approved_by", u.id)}
                            error={errors.approved_by}
                        />
                        <p className="mt-1 text-xs text-gray-400">Authorized official who granted this adjustment.</p>
                        <InputError message={errors.approved_by} />
                    </div>

                    <div className="flex justify-between pt-8 border-t">
                        <Link
                            href={route("fees.adjustments.index")}
                            className="px-4 py-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition font-semibold"
                        >
                            Cancel
                        </Link>

                        <button
                            type="submit"
                            disabled={processing}
                            className="px-8 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:opacity-50 font-bold shadow-sm"
                        >
                            {processing ? "Updating..." : "Update Adjustment"}
                        </button>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
