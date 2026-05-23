import React from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import SearchSelect from "@/Components/SearchSelect";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function Create({ curricula, units }) {
    const hasMappings = curricula.length > 0;
    const hasUnits = units.length > 0;
    const canAssignUnit = hasMappings && hasUnits;

    const { data, setData, post, processing, errors, reset } = useForm({
        program_version_mapping_id: "",
        unit_id: "",
        module_taught: "",
    });

    const submit = (e) => {
        e.preventDefault();
        post(route("units.program-version-units.store"), {
            preserveScroll: true,
            onSuccess: () => {
                setData("unit_id", "");
                setData("module_taught", "");
            },
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Assign Unit to Program Version" />

            <div className="max-w-4xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="bg-white rounded-lg border border-zinc-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
                    <form className="p-10 space-y-8" onSubmit={submit}>
                        {!canAssignUnit ? (
                            <div className="rounded border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
                                You cannot assign a unit until both a program version mapping and a unit exist.
                            </div>
                        ) : null}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* COURSE SELECT */}

                            {/* PROGRAM VERSION MAPPING SELECT */}
                            <div>
                                <InputLabel
                                    htmlFor="program_version_mapping_id"
                                    value="Program Version Mapping"
                                />
                                <SearchSelect
                                    routeName={null}
                                    defaultOptions={curricula}
                                    placeholder="Search active program version mapping..."
                                    value={data.program_version_mapping_id}
                                    onChange={(curr) =>
                                        setData("program_version_mapping_id", curr.id)
                                    }
                                    error={errors.program_version_mapping_id}
                                    disabled={!hasMappings}
                                />
                                {!hasMappings ? (
                                    <p className="mt-1 text-xs text-amber-600">
                                        Create a program version mapping first to continue.
                                    </p>
                                ) : null}
                                <InputError
                                    message={errors.program_version_mapping_id}
                                    className="mt-2"
                                />
                            </div>

                            {/* UNIT SELECT */}
                            <div>
                                <InputLabel htmlFor="unit_id" value="Unit" />
                                <SearchSelect
                                    routeName="units.search"
                                    defaultOptions={units}
                                    placeholder="Search Unit..."
                                    value={data.unit_id}
                                    onChange={(unit) =>
                                        setData("unit_id", unit.id)
                                    }
                                    error={errors.unit_id}
                                    disabled={!hasUnits}
                                />
                                {!hasUnits ? (
                                    <p className="mt-1 text-xs text-amber-600">
                                        Create a unit first to continue.
                                    </p>
                                ) : null}
                                <InputError
                                    message={errors.unit_id}
                                    className="mt-2"
                                />
                            </div>

                            {/* MODULE TAUGHT */}
                            <div>
                                <InputLabel
                                    htmlFor="module_taught"
                                    value="Module Taught"
                                />
                                <TextInput
                                    id="module_taught"
                                    type="number"
                                    name="module_taught"
                                    className="mt-1 block w-full"
                                    placeholder="e.g. 1"
                                    min="1"
                                    value={data.module_taught}
                                    onChange={(e) =>
                                        setData("module_taught", e.target.value)
                                    }
                                />
                                <InputError
                                    message={errors.module_taught}
                                    className="mt-2"
                                />
                            </div>
                        </div>

                        {/* ACTIONS */}
                        <div className="flex justify-between pt-4">
                            <Link
                                href={route("units.program-version-units.index")}
                                className="px-4 py-2 bg-slate-400 text-white rounded hover:bg-slate-700"
                            >
                                Cancel
                            </Link>

                            <button
                                disabled={processing || !canAssignUnit}
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

