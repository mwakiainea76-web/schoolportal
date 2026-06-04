import React, { useEffect, useRef } from "react";
import { Head, Link, useForm } from "@inertiajs/react";

import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import TextArea from "@/Components/TextArea";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import SearchSelect from "@/Components/SearchSelect";

const Edit = ({
    course,
    selected_filters = {},
}) => {
    const activecourse = course || null;
    const activeMapping = course?.course_version_mappings?.find(
        (mapping) => mapping.is_active,
    );
    const selectedMapping =
        activeMapping || course?.course_version_mappings?.[0] || null;
    const hasInitialized = useRef(false);

    const { data, setData, put, processing, errors } = useForm({
        code: "",
        name: "",
        description: "",
        course_version_id: "",
        certification_level_id: "",
        department_id: "",
        initials: "",
    });

    useEffect(() => {
        if (hasInitialized.current) return;

        if (!course) {
            setData({
                code: "",
                name: "",
                description: "",
                course_version_id: "",
                certification_level_id: "",
                department_id: "",
                initials: "",
            });
            return;
        }

        setData({
            code: course.code ?? "",
            name: course.name ?? "",
            description: course.description ?? "",
            course_version_id: selectedMapping?.course_version_id ?? "",
            certification_level_id: course.certification_level_id ?? "",
            department_id: course.department_id ?? "",
            initials: course.initials ?? "",
        });

        hasInitialized.current = true;
    }, [course]);

    const submit = (e) => {
        e.preventDefault();

        if (!activecourse) return;

        put(route("courses.update", activecourse.id), {
            preserveScroll: true,
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Edit Course" />

            <div className="mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="bg-white rounded-lg border border-zinc-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
                    <form className="w-full p-10 space-y-8" onSubmit={submit}>
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                            <div>
                                <InputLabel
                                    htmlFor="course_version_id"
                                    value="Course Version"
                                />
                                <SearchSelect
                                    routeName="course-versions.search"
                                    defaultOptions={[]}
                                    value={data.course_version_id}
                                    selectedLabel={selected_filters.course_version}
                                    placeholder="Select course version..."
                                    preloadOptions
                                    onChange={(version) =>
                                        setData("course_version_id", version.id)
                                    }
                                />
                                <InputError
                                    message={errors.course_version_id}
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
                                    value={data.department_id}
                                    selectedLabel={selected_filters.department}
                                    placeholder="Search Department..."
                                    preloadOptions
                                    onChange={(dept) =>
                                        setData("department_id", dept.id)
                                    }
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
                                    defaultOptions={[]}
                                    value={data.certification_level_id}
                                    selectedLabel={
                                        selected_filters.certification_level
                                    }
                                    placeholder="Type in certification name ..."
                                    preloadOptions
                                    onChange={(level) =>
                                        setData(
                                            "certification_level_id",
                                            level.id,
                                        )
                                    }
                                />
                                <InputError
                                    message={errors.certification_level_id}
                                    className="mt-2"
                                />
                            </div>
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

                        </div>

                        {/* DESCRIPTION */}
                        <div>
                            <InputLabel value="Description" />
                            <TextArea
                                value={data.description}
                                onChange={(e) =>
                                    setData("description", e.target.value)
                                }
                            />
                            <InputError message={errors.description} />
                        </div>

                        {/* ACTIONS */}
                        <div className="flex justify-between pt-6 border-t">
                            <Link
                                href={route("courses.index")}
                                className="px-4 py-2 bg-slate-400 text-white rounded"
                            >
                                Cancel
                            </Link>

                            <button
                                disabled={processing || !activecourse}
                                type="submit"
                                className="px-6 py-2 bg-emerald-600 text-white rounded disabled:opacity-50"
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
