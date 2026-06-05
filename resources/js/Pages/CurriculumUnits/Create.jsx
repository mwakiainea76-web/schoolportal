import React from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import SearchSelect from "@/Components/SearchSelect";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        curriculum_id: "",
        curriculum_mapping_id: "",
        unit_id: "",
        module_taught: "",
    });

    const submit = (e) => {
        e.preventDefault();
        post(route("units.curriculum-units.store"), {
            preserveScroll: true,
            onSuccess: () => {
                setData({
                    ...data,
                    unit_id: "",
                    module_taught: "",
                });
            },
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Assign Unit to Curriculum" />

            <div className="mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="bg-white rounded-lg border border-zinc-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-visible">
                    <form className="p-10 space-y-8" onSubmit={submit}>
                        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                            {/* CYCLE SELECT */}
                            <div>
                                <InputLabel
                                    htmlFor="curriculum_id"
                                    value="Cycle"
                                />
                                <SearchSelect
                                    routeName="curriculums.search"
                                    defaultOptions={[]}
                                    placeholder="Search cycle..."
                                    value={data.curriculum_id}
                                    preloadOptions
                                    minSearchLength={3}
                                    onChange={(cycle) => {
                                        const cycleId = cycle.id ?? "";

                                        setData({
                                            ...data,
                                            curriculum_id: cycleId,
                                            curriculum_mapping_id:
                                                String(cycleId) ===
                                                String(data.curriculum_id)
                                                    ? data.curriculum_mapping_id
                                                    : "",
                                        });
                                    }}
                                    error={errors.curriculum_id}
                                />
                                <InputError
                                    message={errors.curriculum_id}
                                    className="mt-2"
                                />
                            </div>

                            {/* course VERSION MAPPING SELECT */}
                            <div>
                                <InputLabel
                                    htmlFor="curriculum_mapping_id"
                                    value="Course"
                                />
                                <SearchSelect
                                    key={data.curriculum_id || "no-cycle"}
                                    routeName="curriculum-mappings.search"
                                    routeParams={{
                                        curriculum_id:
                                            data.curriculum_id,
                                    }}
                                    defaultOptions={[]}
                                    placeholder={
                                        data.curriculum_id
                                            ? "Search course under cycle..."
                                            : "Select cycle first..."
                                    }
                                    value={data.curriculum_mapping_id}
                                    preloadOptions
                                    minSearchLength={3}
                                    onChange={(curr) =>
                                        setData("curriculum_mapping_id", curr.id)
                                    }
                                    error={errors.curriculum_mapping_id}
                                    disabled={!data.curriculum_id}
                                />
                                <InputError
                                    message={errors.curriculum_mapping_id}
                                    className="mt-2"
                                />
                            </div>

                            {/* UNIT SELECT */}
                            <div>
                                <InputLabel htmlFor="unit_id" value="Unit" />
                                <SearchSelect
                                    routeName="units.search"
                                    defaultOptions={[]}
                                    placeholder="Search Unit..."
                                    value={data.unit_id}
                                    preloadOptions
                                    minSearchLength={3}
                                    onChange={(unit) =>
                                        setData("unit_id", unit.id)
                                    }
                                    error={errors.unit_id}
                                />
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
                                href={route("units.curriculum-units.index")}
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
