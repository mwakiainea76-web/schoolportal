import React, { useEffect, useRef, useState } from "react";
import { Head, Link, router, useForm } from "@inertiajs/react";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import TextArea from "@/Components/TextArea";
import SearchSelect from "@/Components/SearchSelect";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import ToggleSwitch from "@/Components/ToggleSwitch";

export default function EditCurriculum({ courses, curriculum }) {
    const hasInitialized = useRef(false);

    const { data, setData, put, processing, errors, reset } = useForm({
        name: "",
        start_date: "",
        end_date: "",
        is_active: true,
        description: "",
        course_id: "",
    });

    // Load curriculum into form
    useEffect(() => {
        if (!curriculum) {
            reset();
            hasInitialized.current = false;
            return;
        }

        setData({
            name: curriculum.name ?? "",
            start_date: curriculum.start_date ?? "",
            end_date: curriculum.end_date ?? "",
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
        setSearchTerm("");
    };

    return (
        <AuthenticatedLayout>
            <Head title="Edit Curriculum" />

            <div className="max-w-4xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-700">
                {/* ---------------- FORM SECTION ---------------- */}
                <div className="bg-white rounded-lg border border-zinc-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
                    <form className="p-10 space-y-8" onSubmit={submit}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <InputLabel value="Course" />

                                <SearchSelect
                                    routeName="courses.search"
                                    defaultOptions={courses}
                                    value={data.course_id}
                                    selectedLabel={curriculum?.course?.name} // 🔥 IMPORTANT
                                    placeholder="Search Course..."
                                    onChange={(c) => setData("course_id", c.id)}
                                    error={errors.course_id}
                                />

                                <InputError message={errors.course_id} />
                            </div>

                            <div>
                                <InputLabel
                                    htmlFor="name"
                                    value="Curriculum Name"
                                />
                                <TextInput
                                    id="name"
                                    type="text"
                                    className="mt-1 block w-full"
                                    value={data.name}
                                    onChange={(e) =>
                                        setData("name", e.target.value)
                                    }
                                    error={errors.name}
                                />
                                <InputError
                                    message={errors.name}
                                    className="mt-2"
                                />
                            </div>

                            {/* STATUS TOGGLE */}
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

                            {/* START DATE */}
                            <div>
                                <InputLabel
                                    htmlFor="start_date"
                                    value="Effective Date"
                                />
                                <TextInput
                                    id="start_date"
                                    type="date"
                                    className="mt-1 block w-full"
                                    value={data.start_date}
                                    onChange={(e) =>
                                        setData("start_date", e.target.value)
                                    }
                                    error={errors.start_date}
                                />
                                <InputError
                                    message={errors.start_date}
                                    className="mt-2"
                                />
                            </div>

                            {/* END DATE */}
                            <div>
                                <InputLabel
                                    htmlFor="end_date"
                                    value="Expiry Date (Optional)"
                                />
                                <TextInput
                                    id="end_date"
                                    type="date"
                                    className="mt-1 block w-full"
                                    value={data.end_date}
                                    onChange={(e) =>
                                        setData("end_date", e.target.value)
                                    }
                                    error={errors.end_date}
                                />
                                <InputError
                                    message={errors.end_date}
                                    className="mt-2"
                                />
                            </div>
                        </div>

                        {/* DESCRIPTION */}
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

                        {/* ACTIONS */}
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
