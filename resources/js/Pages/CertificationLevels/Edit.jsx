import React, { useState } from "react";
import { Head, Link, router, useForm } from "@inertiajs/react";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import TextArea from "@/Components/TextArea";
import SearchSelect from "@/Components/SearchSelect";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

const Edit = ({ certification_level, exam_bodies }) => {
    const cert = certification_level || null;

    // ✅ initialize ONCE only (no useEffect syncing)
    const { data, setData, put, processing, errors } = useForm({
        code: certification_level?.code ?? "",
        exam_body_id: certification_level?.exam_body_id ?? "",
        name: certification_level?.name ?? "",
        description: certification_level?.description ?? "",
        entry_grade: certification_level?.entry_grade ?? "",
    });

    // ---------------------------
    // UPDATE
    // ---------------------------
    const submit = (e) => {
        e.preventDefault();

        if (!cert) return;

        put(route("certification-levels.update", encodeURIComponent(cert.id)), {
            preserveScroll: true,
            preserveState: true, // ✅ important: keeps form state
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Edit Certification Level" />

            <div className="mx-auto w-full">
                {/* ---------------- FORM ---------------- */}
                <div className="bg-white rounded-lg border shadow overflow-hidden">
                    <div className="bg-slate-400 text-white text-center py-2 text-sm font-medium">
                        Edit certification level
                    </div>
                    <form className="w-full p-10 space-y-8" onSubmit={submit}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 xl:grid-cols-3">
                            {/* EXAM BODY */}
                            <div>
                                <InputLabel
                                    htmlFor="exam_body_id"
                                    value="Exam Body"
                                />
                                <SearchSelect
                                    routeName="exam-bodies.search"
                                    defaultOptions={exam_bodies}
                                    value={data.exam_body_id} // ✅ ONLY THIS
                                    placeholder="Search Exam Body..."
                                    onChange={(body) =>
                                        setData("exam_body_id", body.id)
                                    }
                                    error={errors.exam_body_id}
                                />

                                <InputError message={errors.exam_body_id} />
                            </div>

                            {/* CODE */}
                            <div>
                                <InputLabel value="Certification Code" />
                                <TextInput
                                    error={errors.code}
                                    value={data.code}
                                    onChange={(e) =>
                                        setData("code", e.target.value)
                                    }
                                />
                                <InputError message={errors.code} />
                            </div>

                            {/* NAME */}
                            <div>
                                <InputLabel value="Certification Name" />
                                <TextInput
                                    error={errors.name}
                                    value={data.name}
                                    onChange={(e) =>
                                        setData("name", e.target.value)
                                    }
                                />
                                <InputError message={errors.name} />
                            </div>

                            {/* ENTRY GRADE */}
                            <div>
                                <InputLabel value="Entry Grade" />
                                <TextInput
                                    error={errors.entry_grade}
                                    value={data.entry_grade}
                                    onChange={(e) =>
                                        setData("entry_grade", e.target.value)
                                    }
                                />
                                <InputError message={errors.entry_grade} />
                            </div>
                        </div>

                        {/* DESCRIPTION */}
                        <div>
                            <InputLabel value="Description" />
                            <TextArea
                                error={errors.description}
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
                                href={route("certification-levels.index")}
                                className="px-4 py-2 bg-slate-400 text-white rounded hover:bg-slate-700"
                            >
                                Cancel
                            </Link>

                            <button
                                disabled={processing || !cert}
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
