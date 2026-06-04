import React from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import TextArea from "@/Components/TextArea";
import ToggleSwitch from "@/Components/ToggleSwitch";
import SearchSelect from "@/Components/SearchSelect";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function CreateCourseVersion() {
    const { data, setData, post, processing, errors, reset } = useForm({
        course_version_id: "",
        exam_body_id: "",
        is_active: false,
        description: "",
    });

    const submit = (e) => {
        e.preventDefault();
        post(route("courses.course-version-mappings.store"), {
            preserveScroll: true,
            onSuccess: () => reset(),
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Add Course Version Mapping" />

            <div className="mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="bg-white rounded-lg border border-zinc-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
                    <form className="p-10 space-y-8" onSubmit={submit}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <InputLabel value="Course Version" />

                                <SearchSelect
                                    routeName="course-versions.search"
                                    defaultOptions={[]}
                                    value={data.course_version_id}
                                    placeholder="Select course version..."
                                    preloadOptions
                                    onChange={(c) =>
                                        setData("course_version_id", c.id)
                                    }
                                    error={errors.course_version_id}
                                />

                                <InputError message={errors.course_version_id} />
                            </div>
                            <div>
                                <InputLabel value="Exam Body" />

                                <SearchSelect
                                    routeName="exam-bodies.search"
                                    defaultOptions={[]}
                                    value={data.exam_body_id}
                                    placeholder="Search exam body..."
                                    preloadOptions
                                    onChange={(c) => setData("exam_body_id", c.id)}
                                    error={errors.exam_body_id}
                                />

                                <InputError message={errors.exam_body_id} />
                            </div>

                            {/* STATUS */}
                            <div className="flex flex-col justify-center">
                                <ToggleSwitch
                                    label="Set as current course version mapping"
                                    checked={data.is_active}
                                    onChange={(checked) =>
                                        setData("is_active", checked)
                                    }
                                    error={errors.is_active}
                                />
                                <InputError
                                    message={errors.is_active}
                                    className="mt-2"
                                />
                            </div>
                        </div>

                        {/* DESCRIPTION */}
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-zinc-700 ml-1">
                                Description
                            </label>
                            <TextArea
                                name="description"
                                rows="4"
                                className="mt-1 block w-full"
                                placeholder="Additional details about this course version mapping..."
                                value={data.description}
                                onChange={(e) =>
                                    setData("description", e.target.value)
                                }
                            />
                            <InputError
                                message={errors.description}
                                className="mt-2"
                            />
                        </div>

                        {/* ACTIONS */}
                        <div className="flex justify-between pt-4">
                            <Link
                                href={route("courses.course-version-mappings.index")}
                                className="px-4 py-2 bg-slate-400 text-white rounded hover:bg-slate-700"
                            >
                                Cancel
                            </Link>

                            <button
                                disabled={processing}
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
}
