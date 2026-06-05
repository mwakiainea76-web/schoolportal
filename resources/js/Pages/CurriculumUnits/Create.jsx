import React from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import SearchSelect from "@/Components/SearchSelect";
import TextInput from "@/Components/TextInput";

export default function Create({ curriculum_mapping, selected_mapping_option }) {
    const { data, setData, post, processing, errors } = useForm({
        curriculum_mapping_id: selected_mapping_option?.id || curriculum_mapping?.id || "",
        code: "",
        name: "",
        credit_factor: "",
        training_hours: "",
        description: "",
        module_taught: "",
        semester: "",
        module: "",
        is_compulsory: true,
        sort_order: 0,
    });

    const selectedMappingLabel =
        selected_mapping_option?.name ||
        [
            curriculum_mapping?.curriculum?.name,
            curriculum_mapping?.course?.display_name || curriculum_mapping?.course?.name,
        ]
            .filter(Boolean)
            .join(" - ");

    const submit = (e) => {
        e.preventDefault();
        post(route("units.store"));
    };

    return (
        <AuthenticatedLayout>
            <Head title="Add Unit" />

            <div className="mx-auto w-full max-w-7xl animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-zinc-900">Add Unit</h1>
                    <p className="text-zinc-500">
                        Search the active versioned course, then capture the unit
                        details directly on the merged units table.
                    </p>
                </div>

                <div className="overflow-hidden rounded-lg border border-zinc-100 bg-white shadow-sm">
                    <form className="space-y-6 p-8" onSubmit={submit}>
                        <div className="rounded-xl border border-emerald-100 bg-emerald-50/60 p-4">
                            <InputLabel
                                htmlFor="curriculum_mapping_id"
                                value="Versioned Course"
                            />
                            <div className="mt-1">
                                <SearchSelect
                                    value={data.curriculum_mapping_id}
                                    selectedLabel={selectedMappingLabel}
                                    routeName="curriculum-mappings.search"
                                    preloadOptions
                                    minSearchLength={2}
                                    placeholder="Search active course by code, name, curriculum, or level..."
                                    onChange={(item) =>
                                        setData("curriculum_mapping_id", item.id || "")
                                    }
                                    error={errors.curriculum_mapping_id}
                                />
                            </div>
                            <p className="mt-2 text-xs text-zinc-600">
                                The selected course includes its certification
                                level for easier identification.
                            </p>
                            <InputError
                                message={errors.curriculum_mapping_id}
                                className="mt-2"
                            />
                        </div>

                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                            <div>
                                <InputLabel htmlFor="code" value="Unit Code" />
                                <TextInput
                                    id="code"
                                    type="text"
                                    className="mt-1 block w-full"
                                    value={data.code}
                                    onChange={(e) => setData("code", e.target.value)}
                                    required
                                />
                                <InputError message={errors.code} className="mt-2" />
                            </div>

                            <div>
                                <InputLabel htmlFor="name" value="Unit Name" />
                                <TextInput
                                    id="name"
                                    type="text"
                                    className="mt-1 block w-full"
                                    value={data.name}
                                    onChange={(e) => setData("name", e.target.value)}
                                    required
                                />
                                <InputError message={errors.name} className="mt-2" />
                            </div>

                            <div>
                                <InputLabel htmlFor="credit_factor" value="Credit Factor" />
                                <TextInput
                                    id="credit_factor"
                                    type="number"
                                    className="mt-1 block w-full"
                                    value={data.credit_factor}
                                    onChange={(e) => setData("credit_factor", e.target.value)}
                                    required
                                    min="1"
                                />
                                <InputError
                                    message={errors.credit_factor}
                                    className="mt-2"
                                />
                            </div>

                            <div>
                                <InputLabel htmlFor="training_hours" value="Training Hours" />
                                <TextInput
                                    id="training_hours"
                                    type="number"
                                    className="mt-1 block w-full"
                                    value={data.training_hours}
                                    onChange={(e) => setData("training_hours", e.target.value)}
                                    required
                                    min="1"
                                />
                                <InputError
                                    message={errors.training_hours}
                                    className="mt-2"
                                />
                            </div>

                            <div>
                                <InputLabel htmlFor="module_taught" value="Module Taught" />
                                <TextInput
                                    id="module_taught"
                                    type="number"
                                    className="mt-1 block w-full"
                                    value={data.module_taught}
                                    onChange={(e) => setData("module_taught", e.target.value)}
                                    required
                                    min="1"
                                    max="6"
                                />
                                <InputError
                                    message={errors.module_taught}
                                    className="mt-2"
                                />
                            </div>

                            <div>
                                <InputLabel htmlFor="semester" value="Semester (Optional)" />
                                <TextInput
                                    id="semester"
                                    type="number"
                                    className="mt-1 block w-full"
                                    value={data.semester}
                                    onChange={(e) => setData("semester", e.target.value)}
                                    min="1"
                                    max="12"
                                />
                                <InputError message={errors.semester} className="mt-2" />
                            </div>

                            <div>
                                <InputLabel htmlFor="module" value="Module Slot (Optional)" />
                                <TextInput
                                    id="module"
                                    type="number"
                                    className="mt-1 block w-full"
                                    value={data.module}
                                    onChange={(e) => setData("module", e.target.value)}
                                    min="1"
                                    max="6"
                                />
                                <InputError message={errors.module} className="mt-2" />
                            </div>

                            <div>
                                <InputLabel htmlFor="sort_order" value="Sort Order" />
                                <TextInput
                                    id="sort_order"
                                    type="number"
                                    className="mt-1 block w-full"
                                    value={data.sort_order}
                                    onChange={(e) => setData("sort_order", e.target.value)}
                                    min="0"
                                />
                                <InputError message={errors.sort_order} className="mt-2" />
                            </div>

                            <div className="flex items-center gap-2 pt-8">
                                <input
                                    id="is_compulsory"
                                    type="checkbox"
                                    className="rounded border-zinc-300 text-emerald-600 shadow-sm focus:ring-emerald-500"
                                    checked={data.is_compulsory}
                                    onChange={(e) => setData("is_compulsory", e.target.checked)}
                                />
                                <InputLabel htmlFor="is_compulsory" value="Compulsory Unit" />
                            </div>
                        </div>

                        <div>
                            <InputLabel htmlFor="description" value="Description (Optional)" />
                            <textarea
                                id="description"
                                className="mt-1 block w-full rounded-md border-zinc-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                                rows="3"
                                value={data.description}
                                onChange={(e) => setData("description", e.target.value)}
                            />
                            <InputError message={errors.description} className="mt-2" />
                        </div>

                        <div className="flex justify-end gap-x-4 border-t border-zinc-100 pt-6">
                            <Link
                                href={route(
                                    "units.index",
                                    {
                                        curriculum_mapping_id:
                                            data.curriculum_mapping_id || "",
                                    },
                                )}
                                className="rounded-md border border-zinc-300 bg-white px-4 py-2 text-sm font-semibold text-zinc-700 shadow-sm hover:bg-zinc-50"
                            >
                                Cancel
                            </Link>

                            <button
                                disabled={processing}
                                type="submit"
                                className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-500 disabled:opacity-50"
                            >
                                {processing ? "Saving..." : "Save Unit"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
