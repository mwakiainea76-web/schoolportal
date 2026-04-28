import React from "react";
import { useForm, Head, Link } from "@inertiajs/react";

import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import InputError from "@/Components/InputError";
import SearchSelect from "@/Components/SearchSelect";

import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function Create({ invoices, users }) {
    const { data, setData, post, processing, errors } = useForm({
        student_invoice_id: "",
        penalty_type: "other",
        amount: "",
        trigger: "manual",
        raised_by: "",
        raised_at: new Date().toISOString().split('T')[0],
    });

    const handleChange = (e) => {
        setData(e.target.name, e.target.value);
    };

    const submit = (e) => {
        e.preventDefault();
        post(route("fees.penalties.store"), {
            preserveScroll: true,
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Raise Penalty" />

            <div className="mx-auto max-w-4xl w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Raise Penalty</h1>
                    <p className="text-gray-600 mt-1">Directly increase a student's balance due to a violation or loss.</p>
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
                            <InputLabel value="Penalty Type" required />
                            <select
                                name="penalty_type"
                                value={data.penalty_type}
                                onChange={handleChange}
                                className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm text-sm"
                            >
                                <option value="lost_library_card">Lost Library Card</option>
                                <option value="lost_id">Lost ID</option>
                                <option value="lost_book">Lost Book</option>
                                <option value="late_payment">Late Payment</option>
                                <option value="other">Other</option>
                            </select>
                            <InputError message={errors.penalty_type} />
                        </div>
                    </div>

                    <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
                        <div>
                            <InputLabel value="Amount" required />
                            <TextInput
                                type="number"
                                step="0.01"
                                name="amount"
                                value={data.amount}
                                onChange={handleChange}
                                placeholder="0.00"
                                error={errors.amount}
                                className="font-mono text-rose-600 font-bold"
                            />
                            <InputError message={errors.amount} />
                        </div>

                        <div>
                            <InputLabel value="Raised At" required />
                            <TextInput
                                type="date"
                                name="raised_at"
                                value={data.raised_at}
                                onChange={handleChange}
                                error={errors.raised_at}
                            />
                            <InputError message={errors.raised_at} />
                        </div>
                    </div>

                    <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
                        <div>
                            <InputLabel value="Trigger" required />
                            <select
                                name="trigger"
                                value={data.trigger}
                                onChange={handleChange}
                                className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm text-sm"
                            >
                                <option value="manual">Manual (Admin)</option>
                                <option value="event">Event (System Auto)</option>
                            </select>
                            <InputError message={errors.trigger} />
                        </div>

                        <div>
                            <InputLabel value="Raised By" />
                            <SearchSelect
                                routeName="students.search"
                                defaultOptions={users}
                                placeholder="Search official..."
                                value={data.raised_by}
                                onChange={(u) => setData("raised_by", u.id)}
                                error={errors.raised_by}
                            />
                            <InputError message={errors.raised_by} />
                        </div>
                    </div>

                    <div className="flex justify-between pt-8 border-t">
                        <Link
                            href={route("fees.penalties.index")}
                            className="px-4 py-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition font-semibold"
                        >
                            Cancel
                        </Link>

                        <button
                            type="submit"
                            disabled={processing}
                            className="px-8 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition disabled:opacity-50 font-bold shadow-sm"
                        >
                            {processing ? "Raising..." : "Raise Penalty"}
                        </button>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
