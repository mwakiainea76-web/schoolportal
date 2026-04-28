import React from "react";
import { useForm, Head, Link } from "@inertiajs/react";

import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import InputError from "@/Components/InputError";
import SearchSelect from "@/Components/SearchSelect";

import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function Create({ invoices }) {
    const { data, setData, post, processing, errors } = useForm({
        student_invoice_id: "",
        amount_paid: "",
        reference: "",
        method: "mpesa",
        paid_at: new Date().toISOString().split('T')[0],
        notes: "",
    });

    const handleChange = (e) => {
        setData(e.target.name, e.target.value);
    };

    const submit = (e) => {
        e.preventDefault();
        post(route("fees.payments.store"), {
            preserveScroll: true,
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Record Payment" />

            <div className="mx-auto max-w-4xl w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Record Payment</h1>
                    <p className="text-gray-600 mt-1">Receive funds and update an invoice balance.</p>
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
                            <InputLabel value="Payment Method" required />
                            <select
                                name="method"
                                value={data.method}
                                onChange={handleChange}
                                className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm text-sm"
                            >
                                <option value="mpesa">M-Pesa</option>
                                <option value="bank_transfer">Bank Transfer</option>
                                <option value="cash">Cash</option>
                            </select>
                            <InputError message={errors.method} />
                        </div>
                    </div>

                    <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
                        <div>
                            <InputLabel value="Amount Paid" required />
                            <TextInput
                                type="number"
                                step="0.01"
                                name="amount_paid"
                                value={data.amount_paid}
                                onChange={handleChange}
                                placeholder="0.00"
                                error={errors.amount_paid}
                                className="font-mono text-emerald-600 font-bold"
                            />
                            <InputError message={errors.amount_paid} />
                        </div>

                        <div>
                            <InputLabel value="Transaction Reference" required />
                            <TextInput
                                type="text"
                                name="reference"
                                value={data.reference}
                                onChange={handleChange}
                                placeholder="e.g. MPESA-ABC123"
                                error={errors.reference}
                            />
                            <InputError message={errors.reference} />
                        </div>
                    </div>

                    <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
                        <div>
                            <InputLabel value="Paid At" required />
                            <TextInput
                                type="date"
                                name="paid_at"
                                value={data.paid_at}
                                onChange={handleChange}
                                error={errors.paid_at}
                            />
                            <InputError message={errors.paid_at} />
                        </div>
                    </div>

                    <div>
                        <InputLabel value="Notes" />
                        <textarea
                            name="notes"
                            value={data.notes}
                            onChange={handleChange}
                            rows="3"
                            className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm text-sm"
                            placeholder="Optional payment details..."
                        ></textarea>
                        <InputError message={errors.notes} />
                    </div>

                    <div className="flex justify-between pt-8 border-t">
                        <Link
                            href={route("fees.payments.index")}
                            className="px-4 py-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition font-semibold"
                        >
                            Cancel
                        </Link>

                        <button
                            type="submit"
                            disabled={processing}
                            className="px-8 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition disabled:opacity-50 font-bold shadow-sm shadow-emerald-100"
                        >
                            {processing ? "Recording..." : "Record Payment"}
                        </button>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
