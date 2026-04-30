import React, { useEffect, useRef, useState } from "react";
import { Head, Link, router, useForm } from "@inertiajs/react";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import TextArea from "@/Components/TextArea";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

const Edit = ({ department }) => {
    const dept = department || null;

    const hasInitialized = useRef(false);

    const { data, setData, put, processing, errors } = useForm({
        code: "",
        name: "",
        description: "",
    });

    // ---------------------------
    // Load department into form (only on first load / new search)
    // ---------------------------
    useEffect(() => {
        if (hasInitialized.current) return;

        if (!department) {
            setData({
                code: "",
                name: "",
                description: "",
            });
            return;
        }

        setData({
            code: department.code ?? "",
            name: department.name ?? "",
            description: department.description ?? "",
        });

        hasInitialized.current = true;
    }, [department]);

    // ---------------------------
    // UPDATE
    // ---------------------------
    const submit = (e) => {
        e.preventDefault();

        if (!dept) return;

        put(route("departments.update", dept.id), {
            preserveScroll: true,
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Edit Department" />

            <div className=" mx-auto w-full">
                {/* ---------------- FORM ---------------- */}
                <div className="bg-white rounded-lg border shadow overflow-hidden">
                    <div className="bg-slate-400 text-white text-center py-2 text-sm font-medium">
                        Edit department details
                    </div>
                    <form className="w-full p-10 space-y-8" onSubmit={submit}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* CODE */}
                            <div>
                                <InputLabel
                                    htmlFor="code"
                                    value="Department Code"
                                />
                                <TextInput
                                    value={data.code}
                                    error={errors.code}
                                    onChange={(e) =>
                                        setData("code", e.target.value)
                                    }
                                />
                                <InputError message={errors.code} />
                            </div>

                            {/* NAME */}
                            <div>
                                <InputLabel
                                    htmlFor="name"
                                    value="Department Name"
                                />
                                <TextInput
                                    value={data.name}
                                    error={errors.name}
                                    onChange={(e) =>
                                        setData("name", e.target.value)
                                    }
                                />
                                <InputError message={errors.name} />
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
                            />
                            <InputError message={errors.description} />
                        </div>

                        {/* ACTIONS */}
                        <div className="flex justify-between pt-4">
                            <Link
                                href={route("departments.index")}
                                className="px-4 py-2 bg-slate-400 text-white rounded hover:bg-slate-700"
                            >
                                Cancel
                            </Link>

                            <button
                                disabled={processing || !dept}
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
};

export default Edit;
