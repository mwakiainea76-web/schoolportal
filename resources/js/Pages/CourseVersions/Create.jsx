import React from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import SearchSelect from "@/Components/SearchSelect";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

const Create = () => {
    const { data, setData, post, processing, errors } = useForm({
        course_id: "",
        exam_body_id: "",
        name: "",
    });

    const submit = (e) => {
        e.preventDefault();

        post(route("course-versions.store"), {
            preserveState: true,
            preserveScroll: true,
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Create Course Version" />

            <div className="mx-auto w-full rounded-lg">
                <legend className="text-white border-b border-white/50 text-center py-2 bg-slate-400 rounded-t-lg w-full">
                    Add course version
                </legend>
                <form
                    onSubmit={submit}
                    className="bg-white p-10 space-y-6 border rounded-lg"
                >
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div>
                            <InputLabel value="Course" required />
                            <SearchSelect
                                routeName="courses.search"
                                defaultOptions={[]}
                                placeholder="Search course..."
                                value={data.course_id}
                                preloadOptions
                                minSearchLength={3}
                                onChange={(course) =>
                                    setData({
                                        ...data,
                                        course_id: course.id,
                                        exam_body_id: course.exam_body_id ?? "",
                                    })
                                }
                                error={errors.course_id}
                            />
                            <InputError message={errors.course_id} />
                            <InputError message={errors.exam_body_id} />
                        </div>

                        <div>
                            <InputLabel value="Course Version Name" required />
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
                            href={route("course-versions.index")}
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
                                "Create Course Version"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
};

export default Create;
