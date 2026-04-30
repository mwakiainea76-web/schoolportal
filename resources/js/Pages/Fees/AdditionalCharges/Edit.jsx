import React from "react";
import { useForm, Head, Link } from "@inertiajs/react";

import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import TextArea from "@/Components/TextArea";
import InputError from "@/Components/InputError";
import SearchSelect from "@/Components/SearchSelect";

import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function Edit({ additionalCharge, feeModels }) {
    const { data, setData, put, processing, errors } = useForm({
        fee_model_id: additionalCharge.fee_model_id || "",
        name: additionalCharge.name || "",
        amount: additionalCharge.amount || "",
        frequency: additionalCharge.frequency || "session",
        description: additionalCharge.description || "",
    });

    const handleChange = (e) => {
        setData(e.target.name, e.target.value);
    };

    const submit = (e) => {
        e.preventDefault();

        put(route("fees.additional.charges.update", additionalCharge.id), {
            preserveScroll: true,
        });
    };

    const frequencyOptions = [
        {
            value: "admission",
            label: "Admission - One-time charge for new students",
        },
        { value: "session", label: "Session - Charged per academic session" },
        { value: "year", label: "Year - Charged annually" },
    ];

    return (
        <AuthenticatedLayout>
            <Head title="Edit Additional Charge" />

            <div className="mx-auto max-w-5xl w-full">
                <form
                    onSubmit={submit}
                    className="bg-white p-10 space-y-6 border rounded-lg"
                >
                    {/* FORM GRID */}
                    <div className="space-y-6">
                        {/* BASIC INFO */}
                        <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
                            <div>
                                <InputLabel value="Fee Model" required />
                                <SearchSelect
                                    routeName="fee-models.search"
                                    defaultOptions={feeModels}
                                    placeholder="Search fee models..."
                                    value={data.fee_model_id}
                                    onChange={(model) =>
                                        setData("fee_model_id", model.id)
                                    }
                                    error={errors.fee_model_id}
                                />
                                <InputError message={errors.fee_model_id} />
                            </div>

                            <div>
                                <InputLabel value="Charge Name" required />
                                <TextInput
                                    type="text"
                                    name="name"
                                    value={data.name}
                                    onChange={handleChange}
                                    placeholder="e.g., Late Registration Fee"
                                    error={errors.name}
                                />
                                <InputError message={errors.name} />
                            </div>
                        </div>

                        {/* AMOUNT & FREQUENCY */}
                        <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
                            <div>
                                <InputLabel value="Amount (₦)" required />
                                <TextInput
                                    type="number"
                                    name="amount"
                                    value={data.amount}
                                    onChange={handleChange}
                                    placeholder="0.00"
                                    step="0.01"
                                    min="0"
                                    error={errors.amount}
                                />
                                <InputError message={errors.amount} />
                            </div>

                            <div>
                                <InputLabel value="Frequency" required />
                                <select
                                    name="frequency"
                                    value={data.frequency}
                                    onChange={handleChange}
                                    className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                >
                                    {frequencyOptions.map((option) => (
                                        <option
                                            key={option.value}
                                            value={option.value}
                                        >
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                                <InputError message={errors.frequency} />
                            </div>
                        </div>

                        {/* DESCRIPTION */}
                        <div>
                            <InputLabel value="Description" required />
                            <TextArea
                                name="description"
                                value={data.description}
                                onChange={handleChange}
                                placeholder="Describe what this charge is for..."
                                rows={4}
                                error={errors.description}
                            />
                            <InputError message={errors.description} />
                        </div>
                    </div>

                    {/* ACTIONS */}
                    <div className="flex justify-between pt-6">
                        <Link
                            href={route("fees.additional.charges.index")}
                            className="px-4 py-2 bg-slate-400 text-white rounded hover:bg-slate-700"
                        >
                            Cancel
                        </Link>

                        <button
                            type="submit"
                            disabled={processing}
                            className="px-6 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700 transition disabled:opacity-50"
                        >
                            {processing
                                ? "Updating..."
                                : "Update Additional Charge"}
                        </button>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
