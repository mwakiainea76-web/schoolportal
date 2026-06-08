import React from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import TextArea from "@/Components/TextArea";
import TextInput from "@/Components/TextInput";
import CourseWorkspaceTabs from "@/Pages/Courses/Partials/CourseWorkspaceTabs";

const Edit = ({ curriculum }) => {
    const c = curriculum;

    const { data, setData, put, processing, errors } = useForm({
        exam_body_code: c?.exam_body?.code || "",
        name: c?.name || "",
        description: c?.description || "",
    });

    const submit = (e) => {
        e.preventDefault();

        put(route("curriculums.update", c.id), {
            preserveState: true,
            preserveScroll: true,
        });
    };

    return (
        <>
            <Head title="Edit Curriculum" />

            <div className="mx-auto w-full">
                <div className="mb-6">
                    <CourseWorkspaceTabs activeTab="curriculums" />
                </div>
                <legend className="text-white border-b border-white/50 text-center py-2 bg-slate-400 rounded-t-lg w-full">
                    Edit curriculum details
                </legend>
                <form
                    onSubmit={submit}
                    className="bg-white p-10 space-y-6 border rounded-lg"
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <InputLabel value="Exam Body Code" required />
                            <TextInput
                                value={data.exam_body_code}
                                onChange={(e) =>
                                    setData("exam_body_code", e.target.value)
                                }
                                error={errors.exam_body_code}
                                placeholder="Enter exact exam body code"
                            />
                            <InputError message={errors.exam_body_code} />
                        </div>

                        <div>
                            <InputLabel value="Curriculum Name" required />
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

                    <div>
                        <InputLabel value="Brief Description" />
                        <TextArea
                            value={data.description}
                            onChange={(e) =>
                                setData("description", e.target.value)
                            }
                            error={errors.description}
                        />
                        <InputError message={errors.description} />
                    </div>

                    <div className="flex justify-between pt-4">
                        <Link
                            href={route("curriculums.index")}
                            className="px-4 py-2 bg-slate-400 text-white rounded hover:bg-slate-700"
                        >
                            Cancel
                        </Link>

                        <button
                            disabled={processing || !c}
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
        </>
    );
};

export default Edit;
