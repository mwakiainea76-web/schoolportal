import React, { useEffect, useRef, useState } from "react";
import { Head, Link, router, useForm } from "@inertiajs/react";

import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import TextArea from "@/Components/TextArea";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import SearchSelect from "@/Components/SearchSelect";

const Edit = ({ program, certification_levels, departments }) => {
    const activeProgram = program || null;
    const certs = certification_levels.map((cert) => ({
        id: cert.id,
        name: ` ${cert.exam_body.code} - ${cert.name}`,
    }));
    const hasDepartments = departments.length > 0;
    const hasCertificationLevels = certs.length > 0;
    const canEditProgram = hasDepartments && hasCertificationLevels;
    const hasInitialized = useRef(false);

    const { data, setData, put, processing, errors } = useForm({
        code: "",
        name: "",
        description: "",
        duration_in_months: "",
        certification_level_id: "",
        department_id: "",
        initials: "",
    });

    useEffect(() => {
        if (hasInitialized.current) return;

        if (!program) {
            setData({
                code: "",
                name: "",
                description: "",
                duration_in_months: "",
                certification_level_id: "",
                department_id: "",
                initials: "",
            });
            return;
        }

        setData({
            code: program.code ?? "",
            name: program.name ?? "",
            description: program.description ?? "",
            duration_in_months: program.duration_in_months ?? "",
            certification_level_id: program.certification_level_id ?? "",
            department_id: program.department_id ?? "",
            initials: program.initials ?? "",
        });

        hasInitialized.current = true;
    }, [program]);

    const submit = (e) => {
        e.preventDefault();

        if (!activeProgram) return;

        put(route("programs.update", activeProgram.id), {
            preserveScroll: true,
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Edit Program" />

            <div className="max-w-4xl mx-auto w-full">
                <div className="bg-white rounded-lg border shadow overflow-hidden">
                    <form className="w-full p-10 space-y-8" onSubmit={submit}>
                        {!canEditProgram ? (
                            <div className="rounded border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
                                You cannot fully update this program until both a department and a certification level exist.
                            </div>
                        ) : null}
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                            <div>
                                <InputLabel
                                    htmlFor="department_id"
                                    value="Department"
                                />
                                <SearchSelect
                                    routeName="departments.search"
                                    defaultOptions={departments}
                                    value={data.department_id}
                                    onChange={(dept) =>
                                        setData("department_id", dept.id)
                                    }
                                    disabled={!hasDepartments}
                                />
                                {!hasDepartments ? (
                                    <p className="mt-1 text-xs text-amber-600">
                                        Create a department first to continue.
                                    </p>
                                ) : null}
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
                                    defaultOptions={certs}
                                    value={data.certification_level_id}
                                    onChange={(level) =>
                                        setData(
                                            "certification_level_id",
                                            level.id,
                                        )
                                    }
                                    disabled={!hasCertificationLevels}
                                />
                                {!hasCertificationLevels ? (
                                    <p className="mt-1 text-xs text-amber-600">
                                        Create a certification level first to continue.
                                    </p>
                                ) : null}
                                <InputError
                                    message={errors.certification_level_id}
                                    className="mt-2"
                                />
                            </div>
                            {/* CODE */}
                            <div>
                                <InputLabel
                                    htmlFor="code"
                                    value="Program Code"
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
                                    value="Program Name"
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
                                    value="Program Initials"
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

                            {/* DURATION */}
                            <div>
                                <InputLabel
                                    htmlFor="duration_in_months"
                                    value="Duration (months)"
                                />
                                <TextInput
                                    id="duration_in_months"
                                    type="number"
                                    name="duration_in_months"
                                    className="mt-1 block w-full"
                                    placeholder="e.g. 6"
                                    min="1"
                                    value={data.duration_in_months}
                                    onChange={(e) =>
                                        setData(
                                            "duration_in_months",
                                            e.target.value,
                                        )
                                    }
                                />
                                <InputError
                                    message={errors.duration_in_months}
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
                                href={route("programs.index")}
                                className="px-4 py-2 bg-slate-400 text-white rounded"
                            >
                                Cancel
                            </Link>

                            <button
                                disabled={processing || !activeProgram || !canEditProgram}
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

