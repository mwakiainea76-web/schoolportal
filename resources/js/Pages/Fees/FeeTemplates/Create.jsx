import React from "react";
import { useForm, Head, Link, router } from "@inertiajs/react";

import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import TextArea from "@/Components/TextArea";
import InputError from "@/Components/InputError";
import ToggleSwitch from "@/Components/ToggleSwitch";

import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        name: "",
        description: "",
        is_active: true,
        is_reusable: true,
    });

    const handleChange = (e) => {
        setData(e.target.name, e.target.value);
    };

    const submit = (e) => {
        e.preventDefault();

        post(route("fees.templates.store"), {
            preserveScroll: true,
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Create Fee Template" />

            <div className="mx-auto max-w-5xl w-full">
                <form
                    onSubmit={submit}
                    className="bg-white p-10 space-y-6 border rounded-lg"
                >
                    {/* FORM GRID */}
                    <div className=" gap-6 ">
                        <div className="grid   gap-6 grid-cols-1 md:grid-cols-2">
                            <div className=" ">
                                <InputLabel value="Template Name" required />
                                <TextInput
                                    name="name"
                                    value={data.name}
                                    onChange={handleChange}
                                    error={errors.name}
                                    placeholder="e.g 2026 Standard Fee Structure"
                                />
                                <InputError message={errors.name} />
                            </div>
                            <div className="flex justify-between">
                                <ToggleSwitch
                                    label="Active Template"
                                    checked={data.is_active}
                                    onChange={(val) =>
                                        setData("is_active", val)
                                    }
                                />

                                <ToggleSwitch
                                    label="Reusable Template"
                                    checked={data.is_reusable}
                                    onChange={(val) =>
                                        setData("is_reusable", val)
                                    }
                                />
                            </div>
                        </div>

                        {/* DESCRIPTION */}
                        <div className="mt-6">
                            <InputLabel value="Description" />
                            <TextArea
                                name="description"
                                value={data.description}
                                onChange={handleChange}
                                error={errors.description}
                                placeholder="Optional description of this template..."
                            />
                            <InputError message={errors.description} />
                        </div>
                    </div>

                    {/* ACTIONS */}
                    <div className="flex justify-between pt-6">
                        <Link
                            href={route("fees.templates.index")}
                            className="px-4 py-2 bg-slate-400 text-white rounded hover:bg-slate-700"
                        >
                            Cancel
                        </Link>

                        <button
                            type="submit"
                            disabled={processing}
                            className="px-6 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700 transition disabled:opacity-50"
                        >
                            {processing ? (
                                <span className="flex items-center gap-2">
                                    Saving
                                    <span className="animate-spin inline-block w-4 h-4 border-[3px] border-current border-t-transparent rounded-full" />
                                </span>
                            ) : (
                                "Create Template"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
