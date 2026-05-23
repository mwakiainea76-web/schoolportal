import React, { useEffect, useRef } from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import TextArea from "@/Components/TextArea";
import SearchSelect from "@/Components/SearchSelect";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import ToggleSwitch from "@/Components/ToggleSwitch";

export default function EditProgramVersion({
    programs,
    program_versions,
    programVersionMapping,
}) {
    const hasPrograms = programs.length > 0;
    const hasProgramVersions = program_versions.length > 0;
    const canMap = hasPrograms && hasProgramVersions;

    const hasInitialized = useRef(false);

    const { data, setData, put, processing, errors, reset } = useForm({
        program_version_id: "",
        is_active: true,
        description: "",
        program_id: "",
    });

    useEffect(() => {
        if (!programVersionMapping) {
            reset();
            hasInitialized.current = false;
            return;
        }

        setData({
            program_version_id: programVersionMapping.program_version_id ?? "",
            is_active: !!programVersionMapping.is_active,
            description: programVersionMapping.description ?? "",
            program_id: programVersionMapping.program_id ?? "",
        });

        hasInitialized.current = true;
    }, [programVersionMapping]);

    const submit = (e) => {
        e.preventDefault();
        if (!programVersionMapping) return;

        put(route("programs.program-version-mappings.update", programVersionMapping.id), {
            preserveScroll: true,
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Edit Program Version Mapping" />

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
                                <InputLabel value="Program" />

                                <SearchSelect
                                    routeName="programs.program-version-mappings.program-search"
                                    defaultOptions={programs}
                                    value={data.program_id}
                                    selectedLabel={programVersionMapping?.program?.name}
                                    placeholder="Search program..."
                                    onChange={(item) =>
                                        setData("program_id", item.id)
                                    }
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

                            <div>
                                <InputLabel value="Program Version" />

                                <SearchSelect
                                    routeName="programs.program-version-mappings.search"
                                    defaultOptions={program_versions}
                                    value={data.program_version_id}
                                    selectedLabel={programVersionMapping?.program_version?.name}
                                    placeholder="Search program version..."
                                    onChange={(item) =>
                                        setData("program_version_id", item.id)
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
                                href={route("programs.program-version-mappings.index")}
                                className="px-4 py-2 bg-slate-400 text-white rounded hover:bg-slate-700"
                            >
                                Cancel
                            </Link>

                            <button
                                disabled={processing || !programVersionMapping || !canMap}
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


