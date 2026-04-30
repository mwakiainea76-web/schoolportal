import React from "react";
import { useForm, Head, Link, router } from "@inertiajs/react";

import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import TextArea from "@/Components/TextArea";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

const Create = () => {
    const { data, setData, post, processing, errors, reset } = useForm({
        code: "",
        name: "",
        description: "",
        credit_factor: "",
        training_hours: "",
    });

    // ---------------- STORE ----------------
    const submit = (e) => {
        e.preventDefault();

        post(route("units.store"), {
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => reset(),
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Create Unit" />

            <div className="mx-auto w-full rounded-lg">
                <legend className=" text-white   border-b border-white/50  text-center py-2 bg-slate-400 rounded-t-lg w-full">
                    Add unit
                </legend>
                <form
                    onSubmit={submit}
                    className="bg-white p-10 space-y-6 border rounded-lg"
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        <div>
                            <InputLabel value="Unit Code" required />
                            <TextInput
                                value={data.code}
                                onChange={(e) =>
                                    setData("code", e.target.value)
                                }
                                error={errors.code}
                            />
                            <InputError message={errors.code} />
                        </div>

                        <div>
                            <InputLabel value="Unit Name" required />
                            <TextInput
                                value={data.name}
                                onChange={(e) =>
                                    setData("name", e.target.value)
                                }
                                error={errors.name}
                            />
                            <InputError message={errors.name} />
                        </div>

                        <div>
                            <InputLabel value="Credit Factor " required />
                            <TextInput
                                type="number"
                                value={data.credit_factor}
                                onChange={(e) =>
                                    setData("credit_factor", e.target.value)
                                }
                                error={errors.credit_factor}
                            />
                            <InputError message={errors.credit_factor} />
                        </div>

                        <div>
                            <InputLabel value="Training Hours" required />
                            <TextInput
                                type="number"
                                value={data.training_hours}
                                onChange={(e) =>
                                    setData("training_hours", e.target.value)
                                }
                                error={errors.training_hours}
                            />
                            <InputError message={errors.training_hours} />
                        </div>
                    </div>

                    {/* DESCRIPTION */}
                    <div>
                        <InputLabel value="Description" />
                        <TextArea
                            value={data.description}
                            onChange={(e) =>
                                setData("description", e.target.value)
                            }
                            error={errors.description}
                        />
                        <InputError message={errors.description} />
                    </div>

                    {/* ACTIONS */}
                    <div className="flex justify-between pt-4">
                        <Link
                            href={route("units.index")}
                            className="px-4 py-2 bg-slate-400 text-white rounded hover:bg-slate-700"
                        >
                            Cancel
                        </Link>

                        <button
                            disabled={processing}
                            type="submit"
                            className="px-4 py-2 bg-emerald-500 text-white rounded hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {processing ? (
                                <span className="flex items-center gap-2">
                                    Saving
                                    <span className="animate-spin inline-block w-4 h-4 border-[3px] border-current border-t-transparent rounded-full" />
                                </span>
                            ) : (
                                "Create Unit"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
};

export default Create;
