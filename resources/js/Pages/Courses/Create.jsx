import React from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import TextArea from "@/Components/TextArea";
import SearchSelect from "@/Components/SearchSelect";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import CourseWorkspaceTabs from "@/Pages/Courses/Partials/CourseWorkspaceTabs";

export default function Createcourse() {
    const { data, setData, post, processing, errors } = useForm({
        exam_body_id: "",
        curriculum_id: "",
        code: "",
        name: "",
        description: "",
        initials: "",
        certification_level_id: "",
        department_id: "",
    });

    const submit = (e) => {
        e.preventDefault();
        post(route("courses.store"), {
            preserveScroll: true,
            onSuccess: () => {
                setData("exam_body_id", "");
                setData("curriculum_id", "");
                setData("certification_level_id", "");
                setData("code", "");
                setData("name", "");
                setData("description", "");
                setData("initials", "");
            },
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Add Course" />

            <div className=" mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="mb-6">
                    <CourseWorkspaceTabs activeTab="add-course" />
                </div>
                <div className="bg-white rounded-lg border border-zinc-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
                    <form className="p-10 space-y-8" onSubmit={submit}>
                        <div className=" grid grid-cols-1 md:grid-cols-2  xl:grid-cols-3  gap-8">
                            {/* CODE */}
                            <div>
                                <InputLabel
                                    htmlFor="code"
                                    value="Course Code"
                                />
                                <TextInput
                                    id="code"
                                    type="text"
                                    name="code"
                                    className="mt-1 block w-full"
                                    placeholder="e.g. CS101"
                                    isFocused={true}
                                    value={data.code}
                                    onChange={(e) =>
                                        setData("code", e.target.value)
                                    }
                                />
                                <InputError
                                    message={errors.code}
                                    className="mt-2"
                                />
                            </div>

                            {/* NAME */}
                            <div>
                                <InputLabel
                                    htmlFor="name"
                                    value="Course Name"
                                />
                                <TextInput
                                    id="name"
                                    type="text"
                                    name="name"
                                    className="mt-1 block w-full"
                                    placeholder="e.g. Certificate in ICT"
                                    value={data.name}
                                    onChange={(e) =>
                                        setData("name", e.target.value)
                                    }
                                />
                                <InputError
                                    message={errors.name}
                                    className="mt-2"
                                />
                            </div>

                            <div>
                                <InputLabel
                                    htmlFor="Initials"
                                    value="Course Initials"
                                />
                                <TextInput
                                    id="Initials"
                                    type="text"
                                    name="initials"
                                    className="mt-1 block w-full"
                                    placeholder="e.g. FB,HD"
                                    value={data.initials}
                                    onChange={(e) =>
                                        setData("initials", e.target.value)
                                    }
                                />
                                <InputError
                                    message={errors.initials}
                                    className="mt-2"
                                />
                            </div>
                            <div>
                                <InputLabel
                                    htmlFor="exam_body_id"
                                    value="Exam Body"
                                />
                                <SearchSelect
                                    routeName="exam-bodies.search"
                                    defaultOptions={[]}
                                    placeholder="Select exam body..."
                                    value={data.exam_body_id}
                                    preloadOptions
                                    onChange={(examBody) => {
                                        setData({
                                            ...data,
                                            exam_body_id: examBody.id,
                                            curriculum_id: "",
                                            certification_level_id: "",
                                        });
                                    }}
                                    error={errors.exam_body_id}
                                />
                                <InputError
                                    message={errors.exam_body_id}
                                    className="mt-2"
                                />
                            </div>

                            <div>
                                <InputLabel
                                    htmlFor="curriculum_id"
                                    value="Curriculum"
                                />
                                <SearchSelect
                                    routeName="curriculums.search"
                                    routeParams={{
                                        exam_body_id: data.exam_body_id,
                                    }}
                                    defaultOptions={[]}
                                    placeholder="Select curriculum..."
                                    value={data.curriculum_id}
                                    preloadOptions
                                    minSearchLength={0}
                                    disabled={!data.exam_body_id}
                                    onChange={(curriculum) =>
                                        setData("curriculum_id", curriculum.id)
                                    }
                                    error={errors.curriculum_id}
                                />
                                <InputError
                                    message={errors.curriculum_id}
                                    className="mt-2"
                                />
                            </div>

                            <div>
                                <InputLabel
                                    htmlFor="department_id"
                                    value="Department"
                                />
                                <SearchSelect
                                    routeName="departments.search"
                                    defaultOptions={[]}
                                    placeholder="Search Department..."
                                    value={data.department_id}
                                    preloadOptions
                                    onChange={(dept) =>
                                        setData("department_id", dept.id)
                                    }
                                    error={errors.department_id}
                                />
                                <InputError
                                    message={errors.department_id}
                                    className="mt-2"
                                />
                            </div>
                            {/* CERTIFICATION LEVEL */}
                            <div>
                                <InputLabel
                                    htmlFor="certification_level_id"
                                    value="Certification Level"
                                />
                                <SearchSelect
                                    routeName="certification-levels.search"
                                    routeParams={{
                                        exam_body_id: data.exam_body_id,
                                    }}
                                    defaultOptions={[]}
                                    placeholder="Select certification level..."
                                    value={data.certification_level_id}
                                    preloadOptions
                                    minSearchLength={0}
                                    disabled={!data.exam_body_id}
                                    onChange={(level) =>
                                        setData(
                                            "certification_level_id",
                                            level.id,
                                        )
                                    }
                                    error={errors.certification_level_id}
                                />
                                <InputError
                                    message={errors.certification_level_id}
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
                                rows="5"
                                className="mt-1 block w-full"
                                placeholder="Provide details about the course..."
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
                                href={route("courses.index")}
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
