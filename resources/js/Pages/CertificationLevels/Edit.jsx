import React from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import TextArea from "@/Components/TextArea";
import SearchSelect from "@/Components/SearchSelect";

const Edit = ({ certification_level, exam_bodies, selectedExamBody }) => {
    const cert = certification_level || null;
    const hasExamBodies = true;

    const { data, setData, put, processing, errors } = useForm({
        code: certification_level?.code ?? "",
        exam_body_id: certification_level?.exam_body_id ?? "",
        name: certification_level?.name ?? "",
        description: certification_level?.description ?? "",
        entry_grade: certification_level?.entry_grade ?? "",
        modules: certification_level?.modules ?? 1,
    });

    const submit = (e) => {
        e.preventDefault();

        if (!cert) return;

        put(route("certification-levels.update", encodeURIComponent(cert.id)), {
            preserveScroll: true,
            preserveState: true,
        });
    };

    return (
        <>
            <Head title="Edit Certification Level" />

            <div className="mx-auto w-full">
                <div className="bg-white rounded-lg border shadow overflow-hidden">
                    <div className="bg-slate-400 text-white text-center py-2 text-sm font-medium">
                        Edit certification level
                    </div>
                    <form className="w-full p-10 space-y-8" onSubmit={submit}>
                        {!hasExamBodies ? (
                            <div className="rounded border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
                                You cannot update this certification level until an exam body exists.
                            </div>
                        ) : null}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 xl:grid-cols-3">
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

                            <div>
                                <InputLabel
                                    htmlFor="exam_body_id"
                                    value="Exam Body"
                                />
                                <SearchSelect
                                    routeName="exam-bodies.search"
                                    defaultOptions={[]}
                                    value={data.exam_body_id}
                                    selectedLabel={
                                        selectedExamBody
                                            ? `${selectedExamBody.code} - ${selectedExamBody.name}`
                                            : null
                                    }
                                    placeholder="Search Exam Body..."
                                    disabled={!hasExamBodies}
                                    onChange={(body) =>
                                        setData("exam_body_id", body.id)
                                    }
                                    error={errors.exam_body_id}
                                />
                                {!hasExamBodies ? (
                                    <p className="mt-1 text-xs text-amber-600">
                                        Type to search exam bodies.
                                    </p>
                                ) : null}
                                <InputError message={errors.exam_body_id} />
                            </div>

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

                            <div>
                                <InputLabel value="Modules" />
                                <TextInput
                                    type="number"
                                    min="1"
                                    error={errors.modules}
                                    value={data.modules}
                                    onChange={(e) =>
                                        setData("modules", e.target.value)
                                    }
                                />
                                <p className="mt-1 text-xs text-zinc-500">
                                    Duration: {Math.max(parseInt(data.modules || 1, 10), 1) * 4} months
                                </p>
                                <InputError message={errors.modules} />
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
                            />
                            <InputError message={errors.description} />
                        </div>

                        <div className="flex justify-between pt-4">
                            <Link
                                href={route("certification-levels.index", selectedExamBody?.id ? {
                                    exam_body_id: selectedExamBody.id,
                                } : {})}
                                className="px-4 py-2 bg-slate-400 text-white rounded hover:bg-slate-700"
                            >
                                Cancel
                            </Link>

                            <button
                                disabled={processing || !cert || !hasExamBodies}
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
        </>
    );
};

export default Edit;
