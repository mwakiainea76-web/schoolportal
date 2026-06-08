import React, { useEffect } from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import TextArea from "@/Components/TextArea";
import SearchSelect from "@/Components/SearchSelect";

export default function EditCurriculum({
    curriculumMapping,
}) {
    const { data, setData, put, processing, errors, reset } = useForm({
        curriculum_id: "",
        description: "",
        exam_body_id: "",
    });

    useEffect(() => {
        if (!curriculumMapping) {
            reset();
            hasInitialized.current = false;
            return;
        }

        setData({
            curriculum_id: curriculumMapping.curriculum_id ?? "",
            description: curriculumMapping.description ?? "",
            exam_body_id:
                curriculumMapping.course?.certification_level
                    ?.exam_body_id ??
                curriculumMapping.course?.certificationLevel
                    ?.exam_body_id ??
                "",
        });
    }, [curriculumMapping]);

    const submit = (e) => {
        e.preventDefault();
        if (!curriculumMapping) return;

        put(route("courses.curriculum-mappings.update", curriculumMapping.id), {
            preserveScroll: true,
        });
    };

    return (
        <>
            <Head title="Edit Curriculum Mapping" />

            <div className="mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="bg-white rounded-lg border border-zinc-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
                    <form className="p-10 space-y-8" onSubmit={submit}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <InputLabel value="Exam Body" />

                                <SearchSelect
                                    routeName="exam-bodies.search"
                                    defaultOptions={[]}
                                    value={data.exam_body_id}
                                    selectedLabel={
                                        curriculumMapping?.course
                                            ?.certification_level?.exam_body
                                            ? `${curriculumMapping.course.certification_level.exam_body.code} - ${curriculumMapping.course.certification_level.exam_body.name}`
                                            : curriculumMapping?.course
                                                  ?.certificationLevel?.examBody
                                              ? `${curriculumMapping.course.certificationLevel.examBody.code} - ${curriculumMapping.course.certificationLevel.examBody.name}`
                                              : undefined
                                    }
                                    placeholder="Search exam body..."
                                    preloadOptions
                                    onChange={(item) =>
                                        setData("exam_body_id", item.id)
                                    }
                                    error={errors.exam_body_id}
                                />

                                <InputError message={errors.exam_body_id} />
                            </div>

                            <div>
                                <InputLabel value="Curriculum" />

                                <SearchSelect
                                    routeName="curriculums.search"
                                    defaultOptions={[]}
                                    value={data.curriculum_id}
                                    selectedLabel={curriculumMapping?.curriculum?.name}
                                    placeholder="Select curriculum..."
                                    preloadOptions
                                    onChange={(item) =>
                                        setData("curriculum_id", item.id)
                                    }
                                    error={errors.curriculum_id}
                                />

                                <InputError message={errors.curriculum_id} />
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
                                href={route("courses.curriculum-mappings.index")}
                                className="px-4 py-2 bg-slate-400 text-white rounded hover:bg-slate-700"
                            >
                                Cancel
                            </Link>

                            <button
                                disabled={processing || !curriculumMapping}
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
}
