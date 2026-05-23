import React from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import TextArea from "@/Components/TextArea";
import SearchSelect from "@/Components/SearchSelect";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import ToggleSwitch from "@/Components/ToggleSwitch";

export default function CreateProgram({ certification_levels, departments }) {
    const hasDepartments = departments.length > 0;
    const certs = certification_levels.map((cert) => ({
        id: cert.id,
        name: ` ${cert.exam_body.code} - ${cert.name}`,
    }));
    const hasCertificationLevels = certs.length > 0;
    const canCreateProgram = hasDepartments && hasCertificationLevels;

    const { data, setData, post, processing, errors, reset } = useForm({
        code: "",
        name: "",
        description: "",
        duration_in_months: "",
        initials: "",
        certification_level_id: "",
        department_id: "",
    });

    const submit = (e) => {
        e.preventDefault();
        post(route("programs.store"), {
            preserveScroll: true,
            onSuccess: () => {
                setData("code", "");
                setData("name", "");
                setData("description", "");
                setData("duration_in_months", "");
                setData("initials", "");
            },
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Add Program" />

            <div className=" mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="bg-white rounded-lg border border-zinc-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
                    <form className="p-10 space-y-8" onSubmit={submit}>
                        {!canCreateProgram ? (
                            <div className="rounded border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
                                You cannot create a program until both a department and a certification level exist.
                            </div>
                        ) : null}
                        <div className=" grid grid-cols-1 md:grid-cols-2  xl:grid-cols-3  gap-8">
                            <div>
                                <InputLabel
                                    htmlFor="department_id"
                                    value="Department"
                                />
                                <SearchSelect
                                    routeName="departments.search"
                                    defaultOptions={departments}
                                    placeholder="Search Department..."
                                    value={data.department_id}
                                    onChange={(dept) =>
                                        setData("department_id", dept.id)
                                    }
                                    error={errors.department_id}
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
                                    placeholder="Type in certification name ..."
                                    value={data.certification_level_id}
                                    onChange={(level) =>
                                        setData(
                                            "certification_level_id",
                                            level.id,
                                        )
                                    }
                                    error={errors.certification_level_id}
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
                                placeholder="Provide details about the program..."
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
                                href={route("programs.index")}
                                className="px-4 py-2 bg-slate-400 text-white rounded hover:bg-slate-700"
                            >
                                Cancel
                            </Link>

                            <button
                                disabled={processing || !canCreateProgram}
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


