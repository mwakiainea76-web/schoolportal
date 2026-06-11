import React from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import SearchSelect from "@/Components/SearchSelect";
import TextInput from "@/Components/TextInput";
import TextArea from "@/Components/TextArea";

const Create = () => {
    const { data, setData, post, processing, errors } = useForm({
        exam_body_code: "",
        name: "",
        description: "",
    });

    const submit = (e) => {
        e.preventDefault();

        post(route("curriculums.store"), {
            preserveState: true,
            preserveScroll: true,
        });
    };

    return (
        <>
            <Head title="Create Curriculum" />

            <div className="mx-auto w-full rounded-lg">
                <legend className="text-white border-b border-white/50 text-center py-2 bg-slate-400 rounded-t-lg w-full">
                    Add curriculum
                </legend>
                <form
                    onSubmit={submit}
                    className="bg-white p-10 space-y-6 border rounded-lg"
                >
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div>
                            <InputLabel value="Exam Body" required />
                            <SearchSelect
                                routeName="exam.bodies.search"
                                value={data.exam_body_code}
                                placeholder="Select exam body..."
                                minSearchLength={0}
                                preloadOptions
                                onChange={(examBody) =>
                                    setData(
                                        "exam_body_code",
                                        examBody.code ?? "",
                                    )
                                }
                                error={errors.exam_body_code}
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
                                "Create Curriculum"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default Create;
