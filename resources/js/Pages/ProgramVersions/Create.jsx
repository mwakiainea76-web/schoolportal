import React from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

const Create = () => {
    const { data, setData, post, processing, errors } = useForm({
        name: "",
    });

    const submit = (e) => {
        e.preventDefault();

        post(route("program-versions.store"), {
            preserveState: true,
            preserveScroll: true,
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Create Program Version" />

            <div className="mx-auto w-full rounded-lg">
                <legend className="text-white border-b border-white/50 text-center py-2 bg-slate-400 rounded-t-lg w-full">
                    Add program version
                </legend>
                <form
                    onSubmit={submit}
                    className="bg-white p-10 space-y-6 border rounded-lg"
                >
                    <div className="grid grid-cols-1 gap-6">
                        <div>
                            <InputLabel value="Program Version Name" required />
                            <TextInput
                                value={data.name}
                                onChange={(e) =>
                                    setData("name", e.target.value)
                                }
                                error={errors.name}
                            />
                            <InputError message={errors.name} />
                        </div>
                    </div>

                    <div className="flex justify-between pt-4">
                        <Link
                            href={route("program-versions.index")}
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
                                "Create Program Version"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
};

export default Create;

