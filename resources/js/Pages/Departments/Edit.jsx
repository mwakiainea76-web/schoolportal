import React, { useEffect, useRef } from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import TextArea from "@/Components/TextArea";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import DepartmentWorkspaceTabs from "@/Pages/Departments/Partials/DepartmentWorkspaceTabs";

const Edit = ({ department, selectedHod = null }) => {
    const dept = department || null;

    const hasInitialized = useRef(false);

    const { data, setData, put, processing, errors } = useForm({
        code: "",
        name: "",
        hod_staff_number: "",
        description: "",
    });

    // ---------------------------
    // Load department into form (only on first load / new search)
    // ---------------------------
    useEffect(() => {
        if (hasInitialized.current) return;

        if (!department) {
            setData({
                code: "",
                name: "",
                hod_staff_number: "",
                description: "",
            });
            return;
        }

        setData({
            code: department.code ?? "",
            name: department.name ?? "",
            hod_staff_number: selectedHod?.staff_number ?? "",
            description: department.description ?? "",
        });

        hasInitialized.current = true;
    }, [department]);

    // ---------------------------
    // UPDATE
    // ---------------------------
    const submit = (e) => {
        e.preventDefault();

        if (!dept) return;

        put(route("departments.update", dept.id), {
            preserveScroll: true,
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Edit Department" />

            <div className=" mx-auto w-full">
                <div className="mb-6">
                    <DepartmentWorkspaceTabs activeTab="departments" />
                </div>
                {/* ---------------- FORM ---------------- */}
                <div className="bg-white rounded-lg border shadow overflow-hidden">
                    <div className="bg-slate-400 text-white text-center py-2 text-sm font-medium">
                        Edit department details
                    </div>
                    <form className="w-full p-10 space-y-8" onSubmit={submit}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* CODE */}
                            <div>
                                <InputLabel
                                    htmlFor="code"
                                    value="Department Code"
                                />
                                <TextInput
                                    value={data.code}
                                    error={errors.code}
                                    onChange={(e) =>
                                        setData("code", e.target.value)
                                    }
                                />
                                <InputError message={errors.code} />
                            </div>

                            {/* NAME */}
                            <div>
                                <InputLabel
                                    htmlFor="name"
                                    value="Department Name"
                                />
                                <TextInput
                                    value={data.name}
                                    error={errors.name}
                                    onChange={(e) =>
                                        setData("name", e.target.value)
                                    }
                                />
                                <InputError message={errors.name} />
                            </div>

                            <div>
                                <InputLabel value="HOD (Staff number)" />
                                <TextInput
                                    value={data.hod_staff_number}
                                    error={errors.hod_staff_number}
                                    placeholder="Nullable: enter exact staff number"
                                    onChange={(e) =>
                                        setData(
                                            "hod_staff_number",
                                            e.target.value,
                                        )
                                    }
                                />
                                <InputError message={errors.hod_staff_number} />
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
                        <div className="flex justify-between pt-4">
                            <Link
                                href={route("departments.index")}
                                className="px-4 py-2 bg-slate-400 text-white rounded hover:bg-slate-700"
                            >
                                Cancel
                            </Link>

                            <button
                                disabled={processing || !dept}
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
};

export default Edit;
