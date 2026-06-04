import React, { useEffect, useRef } from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import SearchSelect from "@/Components/SearchSelect";

export default function EditCourseVersionUnit({ curriculum_unit }) {
    const hasInitialized = useRef(false);
    const mapping = curriculum_unit?.course_version_mapping;
    const cycleLabel =
        curriculum_unit?.course_version?.name ??
        mapping?.course_version?.name ??
        "";
    const courseLabel = mapping?.course?.name
        ? `${mapping.course_version?.name} (${mapping.course.name})`
        : mapping?.course_version?.name ?? "";
    const unitLabel = curriculum_unit?.unit
        ? [curriculum_unit.unit.code, curriculum_unit.unit.name]
              .filter(Boolean)
              .join(" - ")
        : "";

    const { data, setData, put, processing, errors } = useForm({
        course_version_id: "",
        course_version_mapping_id: "",
        unit_id: "",
        module_taught: "",
    });

    // Populate on load (once only)
    useEffect(() => {
        if (!curriculum_unit || hasInitialized.current) return;

        setData({
            course_version_id:
                curriculum_unit.course_version_id ??
                curriculum_unit.course_version_mapping?.course_version_id ??
                "",
            course_version_mapping_id:
                curriculum_unit.course_version_mapping_id ?? "",
            unit_id: curriculum_unit.unit_id ?? "",
            module_taught: curriculum_unit.module_taught ?? "",
        });

        hasInitialized.current = true;
    }, [curriculum_unit]);

    const submit = (e) => {
        e.preventDefault();

        put(route("units.course-version-units.update", curriculum_unit.id), {
            preserveScroll: true,
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Edit Course Version Unit" />

            <div className="max-w-4xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="bg-white rounded-lg border border-zinc-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-visible">
                    <form className="p-10 space-y-8" onSubmit={submit}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* CYCLE SELECT */}
                            <div>
                                <InputLabel
                                    htmlFor="course_version_id"
                                    value="Cycle"
                                />
                                <SearchSelect
                                    routeName="course-versions.search"
                                    defaultOptions={[]}
                                    placeholder="Search cycle..."
                                    value={data.course_version_id}
                                    selectedLabel={cycleLabel}
                                    preloadOptions
                                    minSearchLength={3}
                                    onChange={(cycle) => {
                                        const cycleId = cycle.id ?? "";

                                        setData({
                                            ...data,
                                            course_version_id: cycleId,
                                            course_version_mapping_id:
                                                String(cycleId) ===
                                                String(data.course_version_id)
                                                    ? data.course_version_mapping_id
                                                    : "",
                                        });
                                    }}
                                    error={errors.course_version_id}
                                />
                                <InputError
                                    message={errors.course_version_id}
                                    className="mt-2"
                                />
                            </div>

                            {/* course VERSION MAPPING */}
                            <div>
                                <InputLabel value="Course" />
                                <SearchSelect
                                    key={data.course_version_id || "no-cycle"}
                                    routeName="course-version-mappings.search"
                                    routeParams={{
                                        course_version_id:
                                            data.course_version_id,
                                    }}
                                    defaultOptions={[]}
                                    value={data.course_version_mapping_id}
                                    selectedLabel={courseLabel}
                                    placeholder={
                                        data.course_version_id
                                            ? "Search course under cycle..."
                                            : "Select cycle first..."
                                    }
                                    preloadOptions
                                    minSearchLength={3}
                                    onChange={(item) =>
                                        setData("course_version_mapping_id", item.id)
                                    }
                                    error={errors.course_version_mapping_id}
                                    disabled={!data.course_version_id}
                                />
                                <InputError
                                    message={errors.course_version_mapping_id}
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
                                    selectedLabel={unitLabel}
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
                                href={route("units.course-version-units.index")}
                                className="px-6 py-3 rounded-xl text-sm font-bold text-zinc-500 hover:bg-zinc-100 transition-colors"
                            >
                                Cancel
                            </Link>

                            <button
                                type="submit"
                                disabled={processing || !curriculum_unit}
                                className="px-8 py-3 rounded-xl bg-emerald-600 text-white font-bold text-sm shadow-lg shadow-emerald-500/20 hover:bg-emerald-400 hover:-translate-y-0.5 transition-all active:scale-95 disabled:opacity-50"
                            >
                                {processing ? (
                                    <span className="flex items-center gap-2">
                                        Updating
                                        <span className="animate-spin inline-block w-4 h-4 border-[3px] border-current border-t-transparent rounded-full" />
                                    </span>
                                ) : (
                                    "Update Course Version Unit"
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
