import React from "react";
import { useForm, Head, Link, router } from "@inertiajs/react";

import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import TextArea from "@/Components/TextArea";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import useRbac from "@/Hooks/UseRBAC";
const Edit = ({ unit }) => {
    const { can } = useRbac();
    const u = unit;

    const { data, setData, put, processing, errors } = useForm({
        code: u?.code || "",
        name: u?.name || "",
        description: u?.description || "",
        credit_factor: u?.credit_factor || "",
        training_hours: u?.training_hours || "",
    });

    // ---------------- SEARCH ----------------

    // ---------------- UPDATE ----------------
    const submit = (e) => {
        e.preventDefault();

        put(route("units.update", u.id), {
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => router.visit(route("units.index")),
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Edit Unit" />

            <div className=" mx-auto w-full">
                {/* FORM */}
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
                            <InputLabel value="Credit Factor" required />
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
                            disabled={processing || !u}
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
        </AuthenticatedLayout>
    );
};

export default Edit;
