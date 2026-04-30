import React, { useEffect, useRef } from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import TextArea from "@/Components/TextArea";
import SearchSelect from "@/Components/SearchSelect";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import ToggleSwitch from "@/Components/ToggleSwitch";

export default function EditCurriculum({ courses, curriculums, curriculum }) {
    const hasInitialized = useRef(false);

    const { data, setData, put, processing, errors, reset } = useForm({
        curriculum_id: "",
        is_active: true,
        description: "",
        course_id: "",
    });

    useEffect(() => {
        if (!curriculum) {
            reset();
            hasInitialized.current = false;
            return;
        }

        setData({
            curriculum_id: curriculum.curriculum_id ?? "",
            is_active: !!curriculum.is_active,
            description: curriculum.description ?? "",
            course_id: curriculum.course_id ?? "",
        });

        hasInitialized.current = true;
    }, [curriculum]);

    const submit = (e) => {
        e.preventDefault();
        if (!curriculum) return;

        put(route("courses.curriculum.update", curriculum.id), {
            preserveScroll: true,
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Edit Curriculum" />

            <div className="max-w-4xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="bg-white rounded-lg border border-zinc-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
                    <form className="p-10 space-y-8" onSubmit={submit}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <InputLabel value="Course" />

                                <SearchSelect
                                    routeName="courses.curriculum.course-search"
                                    defaultOptions={courses}
                                    value={data.course_id}
                                    selectedLabel={curriculum?.course?.name}
                                    placeholder="Search Course..."
                                    onChange={(item) =>
                                        setData("course_id", item.id)
                                    }
                                    error={errors.course_id}
                                />

                                <InputError message={errors.course_id} />
                            </div>

                            <div>
                                <InputLabel value="Curriculum" />

                                <SearchSelect
                                    routeName="courses.curriculum.search"
                                    defaultOptions={curriculums}
                                    value={data.curriculum_id}
                                    selectedLabel={curriculum?.curriculum?.name}
                                    placeholder="Search Curriculum..."
                                    onChange={(item) =>
                                        setData("curriculum_id", item.id)
                                    }
                                    error={errors.curriculum_id}
                                />

                                <InputError message={errors.curriculum_id} />
                            </div>

                            <div className="flex flex-col justify-center">
                                <ToggleSwitch
                                    label="Set as current curriculum"
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

                        <div className="space-y-2">
                            <InputLabel value="Description" />
                            <TextArea
                                rows="4"
                                className="mt-1 block w-full"
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

                        <div className="flex justify-between pt-4">
                            <Link
                                href={route("courses.curriculum.index")}
                                className="px-4 py-2 bg-slate-400 text-white rounded hover:bg-slate-700"
                            >
                                Cancel
                            </Link>

                            <button
                                disabled={processing || !curriculum}
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
