import React, { useEffect, useState } from "react";
import { useForm, Head, Link, router } from "@inertiajs/react";

import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import TextArea from "@/Components/TextArea";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

const Edit = ({ exam_body }) => {
    const exam = exam_body || null;

    // ✅ Initialize ONCE from props (DO NOT sync later via useEffect)
    const { data, setData, put, processing, errors, reset } = useForm({
        code: exam?.code || "",
        name: exam?.name || "",
        description: exam?.description || "",
    });

    /**
     * ✅ Only update form when switching to a DIFFERENT exam record
     * This prevents overwriting user input after validation errors
     */
    useEffect(() => {
        if (!exam) {
            reset();
            return;
        }

        setData((prev) => {
            // avoid unnecessary overwrite if same record
            if (prev.code === exam.code) return prev;

            return {
                code: exam.code || "",
                name: exam.name || "",
                description: exam.description || "",
            };
        });
    }, [exam?.code]); // important: depend only on identity change

    // SEARCH HANDLER

    // SUBMIT HANDLER
    const submit = (e) => {
        e.preventDefault();

        if (!exam) return;

        put(route("exam.bodies.update", encodeURIComponent(exam.id)), {
            preserveScroll: true,
            preserveState: true, // 🔥 CRITICAL: prevents form reset on validation failure
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Edit Exam Body" />

            <div className="mx-auto w-full">
                {/* FORM */}
                <div className="bg-white rounded-lg border shadow overflow-hidden">
                    <legend className=" text-white   border-b border-white/50  text-center py-2 bg-slate-400 rounded-t-lg w-full">
                        Edit exam body
                    </legend>
                    <form className="w-full p-10 space-y-6" onSubmit={submit}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <InputLabel
                                    htmlFor="code"
                                    value="Entity Code"
                                />
                                <TextInput
                                    id="code"
                                    error={errors.code}
                                    value={data.code}
                                    onChange={(e) =>
                                        setData("code", e.target.value)
                                    }
                                    className="mt-1 block w-full"
                                />
                                <InputError message={errors.code} />
                            </div>

                            <div>
                                <InputLabel
                                    htmlFor="name"
                                    value="Entity Name"
                                />
                                <TextInput
                                    id="name"
                                    error={errors.name}
                                    value={data.name}
                                    onChange={(e) =>
                                        setData("name", e.target.value)
                                    }
                                    className="mt-1 block w-full"
                                />
                                <InputError message={errors.name} />
                            </div>
                        </div>

                        <div>
                            <InputLabel value="Description" />
                            <TextArea
                                error={errors.description}
                                value={data.description}
                                onChange={(e) =>
                                    setData("description", e.target.value)
                                }
                                className="mt-1 block w-full"
                            />
                            <InputError message={errors.description} />
                        </div>

                        <div className="flex justify-between pt-4">
                            <Link
                                href={route("exam.bodies.index")}
                                className="px-4 py-2 bg-slate-400 text-white rounded hover:bg-slate-700"
                            >
                                Cancel
                            </Link>

                            <button
                                disabled={processing || !exam}
                                type="submit"
                                className="px-4 py-2 bg-emerald-600 text-white rounded hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {processing ? "Updating..." : "Update"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default Edit;
