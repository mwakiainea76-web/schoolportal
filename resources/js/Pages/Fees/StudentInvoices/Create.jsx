import React, { useState } from "react";
import { useForm, Head, Link } from "@inertiajs/react";

import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import InputError from "@/Components/InputError";
import SearchSelect from "@/Components/SearchSelect";

import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function Create({ feeModels }) {
    const { data, setData, post, processing, errors } = useForm({
        fee_model_id: "",
        amount: "",
        registration_number: "",
    });

    const handleChange = (e) => {
        setData(e.target.name, e.target.value);
    };

    const submit = (e) => {
        e.preventDefault();
        post(route("fees.students.invoices.store"), {
            preserveScroll: true,
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Create Student Invoice" />

            <div className="mx-auto max-w-5xl w-full">
                <div className="mb-6">
                    <h1 className="text-2xl font-semibold text-gray-800">
                        Create Student Invoice
                    </h1>
                    <p className="text-sm text-gray-600">
                        Generate a new invoice for a student enrollment.
                    </p>
                </div>

                <form
                    onSubmit={submit}
                    className="bg-white p-10 space-y-6 border rounded-lg shadow-sm"
                >
                    <div className="grid gap-6 grid-cols-1 md:grid-cols-2 ">
                        <div>
                            <InputLabel value=" Registration number" required />
                            <TextInput
                                type="text"
                                name="registration_number"
                                value={data.registration_number}
                                onChange={handleChange}
                                placeholder="STD/001/2026"
                                error={errors.registration_number}
                            />
                            <InputError message={errors.registration_number} />
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

                    <div className="flex justify-between pt-6 ">
                        <Link
                            href={route("fees.students.invoices.index")}
                            className="px-4 py-2 bg-slate-400 text-white rounded hover:bg-slate-700 transition"
                        >
                            Cancel
                        </Link>

                        <button
                            type="submit"
                            disabled={processing}
                            className="px-6 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700 transition disabled:opacity-50"
                        >
                            {processing ? "Creating..." : "Create Invoice"}
                        </button>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
