import React from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import TextArea from "@/Components/TextArea";
import ToggleSwitch from "@/Components/ToggleSwitch";
import SearchSelect from "@/Components/SearchSelect";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function CreateProgramVersion({
    program_versions,
    programs,
}) {
    const hasPrograms = programs.length > 0;
    const hasProgramVersions = program_versions.length > 0;
    const canMap = hasPrograms && hasProgramVersions;

    const { data, setData, post, processing, errors, reset } = useForm({
        program_version_id: "",
        program_id: "",
        is_active: false,
        description: "",
    });

    const submit = (e) => {
        e.preventDefault();
        post(route("programs.program-version-mappings.store"), {
            preserveScroll: true,
            onSuccess: () => reset(),
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Add Program Version Mapping" />

            <div className="max-w-4xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="bg-white rounded-lg border border-zinc-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
                    <form className="p-10 space-y-8" onSubmit={submit}>
                        {!canMap ? (
                            <div className="rounded border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
                                You cannot map a program version to a program until both a program and a program version exist.
                            </div>
                        ) : null}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <InputLabel value="Program Version" />

                                <SearchSelect
                                    routeName="programs.program-version-mappings.search"
                                    defaultOptions={program_versions}
                                    value={data.program_version_id}
                                    placeholder="Search program version..."
                                    onChange={(c) =>
                                        setData("program_version_id", c.id)
                                    }
                                    error={errors.program_version_id}
                                    disabled={!hasProgramVersions}
                                />
                                {!hasProgramVersions ? (
                                    <p className="mt-1 text-xs text-amber-600">
                                        Create a program version first to continue.
                                    </p>
                                ) : null}

                                <InputError message={errors.program_version_id} />
                            </div>
                            <div>
                                <InputLabel value="Program" />

                                <SearchSelect
                                    routeName="programs.program-version-mappings.program-search"
                                    defaultOptions={programs}
                                    value={data.program_id}
                                    placeholder="Search program..."
                                    onChange={(c) => setData("program_id", c.id)}
                                    error={errors.program_id}
                                    disabled={!hasPrograms}
                                />
                                {!hasPrograms ? (
                                    <p className="mt-1 text-xs text-amber-600">
                                        Create a program first to continue.
                                    </p>
                                ) : null}

                                <InputError message={errors.program_id} />
                            </div>

                            {/* STATUS */}
                            <div className="flex flex-col justify-center">
                                <ToggleSwitch
                                    label="Set as current program version mapping"
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
                                placeholder="Additional details about this program version mapping..."
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
                                href={route("programs.program-version-mappings.index")}
                                className="px-4 py-2 bg-slate-400 text-white rounded hover:bg-slate-700"
                            >
                                Cancel
                            </Link>

                            <button
                                disabled={processing || !canMap}
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


