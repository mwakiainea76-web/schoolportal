import React from "react";
import { Head, useForm, Link, router } from "@inertiajs/react";

import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import InputError from "@/Components/InputError";
import ToggleSwitch from "@/Components/ToggleSwitch";
import SearchSelect from "@/Components/SearchSelect";

export default function Create({ templates }) {
    const { data, setData, post, processing, errors } = useForm({
        fee_template_id: "",
        name: "",
        type: "",
        amount: "",
        frequency: "session",
        is_optional: false,
        sort_order: 0,
    });

    const submit = (e) => {
        e.preventDefault();

        post(route("fees.components.store"), {
            preserveScroll: true,
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Create Fee Component" />

            <div className="mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="bg-white rounded-lg border border-zinc-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
                    <form className="p-10 space-y-8" onSubmit={submit}>
                        {/* GRID */}
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                            {/* TEMPLATE */}
                            <div>
                                <InputLabel value="Fee Template" required />
                                <SearchSelect
                                    defaultOptions={templates}
                                    value={data.fee_template_id}
                                    onChange={(t) =>
                                        setData("fee_template_id", t.id)
                                    }
                                    error={errors.fee_template_id}
                                />
                                <InputError message={errors.fee_template_id} />
                            </div>

                            {/* NAME */}
                            <div>
                                <InputLabel value="Component Name" required />
                                <TextInput
                                    value={data.name}
                                    onChange={(e) =>
                                        setData("name", e.target.value)
                                    }
                                    error={errors.name}
                                />
                                <InputError message={errors.name} />
                            </div>

                            {/* TYPE */}
                            <div>
                                <InputLabel value="Type" required />
                                <TextInput
                                    value={data.type}
                                    onChange={(e) =>
                                        setData("type", e.target.value)
                                    }
                                    error={errors.type}
                                />
                                <InputError message={errors.type} />
                            </div>

                            {/* AMOUNT */}
                            <div>
                                <InputLabel value="Amount" required />
                                <TextInput
                                    type="number"
                                    value={data.amount}
                                    onChange={(e) =>
                                        setData("amount", e.target.value)
                                    }
                                    error={errors.amount}
                                />
                                <InputError message={errors.amount} />
                            </div>

                            {/* FREQUENCY */}
                            <div>
                                <InputLabel value="Frequency" />
                                <select
                                    value={data.frequency}
                                    onChange={(e) =>
                                        setData("frequency", e.target.value)
                                    }
                                    className="mt-1 block w-full border rounded p-2"
                                >
                                    <option value="admission">Admission</option>
                                    <option value="always">Always</option>
                                    <option value="session">Session</option>
                                    <option value="year">Year</option>
                                </select>
                                <InputError message={errors.frequency} />
                            </div>

                            {/* SORT ORDER */}
                            <div>
                                <InputLabel value="Sort Order" />
                                <TextInput
                                    type="number"
                                    value={data.sort_order}
                                    onChange={(e) =>
                                        setData("sort_order", e.target.value)
                                    }
                                />
                            </div>

                            {/* TOGGLE */}
                            <div className="flex flex-col justify-center">
                                <ToggleSwitch
                                    label="Optional Component"
                                    checked={data.is_optional}
                                    onChange={(v) => setData("is_optional", v)}
                                />
                            </div>
                        </div>

                        {/* ACTIONS */}
                        <div className="flex justify-between pt-4">
                            <Link
                                href={route("fees.components.index")}
                                className="px-4 py-2 bg-slate-400 text-white rounded hover:bg-slate-700"
                            >
                                Cancel
                            </Link>

                            <button
                                disabled={processing}
                                type="submit"
                                className="px-4 py-2 bg-emerald-600 text-white rounded hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {processing ? (
                                    <span className="flex items-center gap-2">
                                        Saving
                                        <span className="animate-spin inline-block w-4 h-4 border-[3px] border-current border-t-transparent rounded-full" />
                                    </span>
                                ) : (
                                    "Save"
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
