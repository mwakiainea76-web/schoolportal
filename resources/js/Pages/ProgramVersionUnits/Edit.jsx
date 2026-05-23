import React, { useEffect, useRef } from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import SearchSelect from "@/Components/SearchSelect";

export default function EditProgramVersionUnit({ curriculum_unit, curricula, units }) {
    const hasMappings = curricula.length > 0;
    const hasUnits = units.length > 0;
    const canUpdateUnitAssignment = hasMappings && hasUnits;
    const hasInitialized = useRef(false);

    const { data, setData, put, processing, errors } = useForm({
        program_version_mapping_id: "",
        unit_id: "",
        module_taught: "",
    });

    // Populate on load (once only)
    useEffect(() => {
        if (!curriculum_unit || hasInitialized.current) return;

        setData({
            program_version_mapping_id:
                curriculum_unit.program_version_mapping_id ?? "",
            unit_id: curriculum_unit.unit_id ?? "",
            module_taught: curriculum_unit.module_taught ?? "",
        });

        hasInitialized.current = true;
    }, [curriculum_unit]);

    const submit = (e) => {
        e.preventDefault();

        put(route("units.program-version-units.update", curriculum_unit.id), {
            preserveScroll: true,
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Edit Program Version Unit" />

            <div className="max-w-4xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="bg-white rounded-lg border border-zinc-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
                    <form className="p-10 space-y-8" onSubmit={submit}>
                        {!canUpdateUnitAssignment ? (
                            <div className="rounded border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
                                You cannot update this unit assignment until both a program version mapping and a unit exist.
                            </div>
                        ) : null}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* PROGRAM VERSION MAPPING */}
                            <div>
                                <InputLabel value="Program Version Mapping" />
                                <SearchSelect
                                    routeName={null}
                                    defaultOptions={curricula}
                                    value={data.program_version_mapping_id}
                                    selectedLabel={`${curriculum_unit.program_version_mapping?.program_version?.name} - ${curriculum_unit.program_version_mapping?.program?.name}`}
                                    placeholder="Search active program version mapping..."
                                    onChange={(item) =>
                                        setData("program_version_mapping_id", item.id)
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
                        <div className="pt-6 flex items-center justify-end gap-4 border-t border-zinc-50">
                            <Link
                                href={route("units.program-version-units.index")}
                                className="px-6 py-3 rounded-xl text-sm font-bold text-zinc-500 hover:bg-zinc-100 transition-colors"
                            >
                                Cancel
                            </Link>

                            <button
                                type="submit"
                                disabled={processing || !curriculum_unit || !canUpdateUnitAssignment}
                                className="px-8 py-3 rounded-xl bg-emerald-600 text-white font-bold text-sm shadow-lg shadow-emerald-500/20 hover:bg-emerald-400 hover:-translate-y-0.5 transition-all active:scale-95 disabled:opacity-50"
                            >
                                {processing ? (
                                    <span className="flex items-center gap-2">
                                        Updating
                                        <span className="animate-spin inline-block w-4 h-4 border-[3px] border-current border-t-transparent rounded-full" />
                                    </span>
                                ) : (
                                    "Update Program Version Unit"
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}


