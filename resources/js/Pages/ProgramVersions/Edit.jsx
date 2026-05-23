import React from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import TextArea from "@/Components/TextArea";
import SearchSelect from "@/Components/SearchSelect";
import TextInput from "@/Components/TextInput";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

const Edit = ({ curriculum }) => {
    const c = curriculum;
    const lifecycleText = c?.end_date
        ? "Session is done"
        : c?.start_date
          ? "Session is ongoing"
          : "Upcoming";
    const isVersionStateLocked = Boolean(c?.end_date);
    const versionStateOptions = [
        { id: "start", name: "Start Version" },
        { id: "end", name: "End Version" },
    ];

    const { data, setData, put, processing, errors } = useForm({
        name: c?.name || "",
        description: c?.description || "",
        version_state: c?.is_active ? "start" : "end",
    });

    const submit = (e) => {
        e.preventDefault();

        put(route("program-versions.update", c.id), {
            preserveState: true,
            preserveScroll: true,
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Edit Program Version" />

            <div className="mx-auto w-full">
                <legend className="text-white border-b border-white/50 text-center py-2 bg-slate-400 rounded-t-lg w-full">
                    Edit program version details
                </legend>
                <form
                    onSubmit={submit}
                    className="bg-white p-10 space-y-6 border rounded-lg"
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        <div>
                            <InputLabel value="Program Version Name" required />
                            <TextInput
                                className="cursor-not-allowed bg-gray-100"
                                disabled
                                value={data.name}
                                onChange={(e) =>
                                    setData("name", e.target.value)
                                }
                                error={errors.name}
                            />
                            <InputError message={errors.name} />
                        </div>

                        <div>
                            <InputLabel value="Version State" required />

                            <SearchSelect
                                routeName={null}
                                defaultOptions={versionStateOptions}
                                value={data.version_state}
                                selectedLabel={
                                    data.version_state === "start"
                                        ? "Start Version"
                                        : "End Version"
                                }
                                placeholder="Select version state"
                                onChange={(item) =>
                                    setData("version_state", item.id)
                                }
                                error={errors.version_state}
                                disabled={isVersionStateLocked}
                            />
                            <InputError message={errors.version_state} />
                            <p
                                className={`mt-1 text-xs ${
                                    isVersionStateLocked
                                        ? "text-amber-600"
                                        : "text-slate-500"
                                }`}
                            >
                                {isVersionStateLocked
                                    ? "This program version is closed and cannot be reactivated."
                                    : lifecycleText}
                            </p>
                        </div>
                    </div>

                    <div>
                        <InputLabel value="Description" />
                        <TextArea
                            value={data.description}
                            onChange={(e) =>
                                setData("description", e.target.value)
                            }
                            error={errors.description}
                        />
                        <InputError message={errors.description} />
                    </div>

                    <div className="flex justify-between pt-4">
                        <Link
                            href={route("program-versions.index")}
                            className="px-4 py-2 bg-slate-400 text-white rounded hover:bg-slate-700"
                        >
                            Cancel
                        </Link>

                        <button
                            disabled={processing || !c}
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
        </AuthenticatedLayout>
    );
};

export default Edit;

