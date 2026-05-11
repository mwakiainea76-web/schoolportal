import { Head, Link, useForm } from "@inertiajs/react";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import ToggleSwitch from "@/Components/ToggleSwitch";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function EditFeePlan({ feePlan }) {
    const { data, setData, put, processing, errors } = useForm({
        name: feePlan.name || "",
        version: feePlan.version || "",
        is_active: feePlan.is_active ?? false,
    });

    const submit = (e) => {
        e.preventDefault();

        put(route("fees.plans.update", feePlan.id), {
            preserveScroll: true,
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Edit Fee Plan" />

            <div className="mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="bg-white rounded-lg border border-zinc-100 shadow-sm overflow-hidden">
                    {/* HEADER */}
                    <div className="bg-slate-400 text-white text-center py-2 text-sm font-medium">
                        Edit Fee Plan
                    </div>

                    <form className="p-10 space-y-8" onSubmit={submit}>
                        {/* GRID */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* NAME */}
                            <div>
                                <InputLabel
                                    htmlFor="name"
                                    value="Fee Plan Name"
                                />
                                <TextInput
                                    id="name"
                                    name="name"
                                    value={data.name}
                                    onChange={(e) =>
                                        setData("name", e.target.value)
                                    }
                                    error={errors.name}
                                />
                                <InputError message={errors.name} />
                            </div>

                            {/* VERSION */}
                            <div>
                                <InputLabel htmlFor="version" value="Version" />
                                <TextInput
                                    id="version"
                                    name="version"
                                    value={data.version}
                                    onChange={(e) =>
                                        setData("version", e.target.value)
                                    }
                                    error={errors.version}
                                />
                                <InputError message={errors.version} />
                            </div>

                            {/* TOGGLE */}
                            <div className="flex flex-col justify-center">
                                <ToggleSwitch
                                    label="Set Fee Plan Active"
                                    checked={data.is_active}
                                    onChange={(checked) =>
                                        setData("is_active", checked)
                                    }
                                    error={errors.is_active}
                                />
                                <InputError message={errors.is_active} />
                            </div>
                        </div>

                        {/* ACTIONS */}
                        <div className="flex justify-between pt-4">
                            <Link
                                href={route("fees.plans.index")}
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
                                        Updating
                                        <span className="animate-spin inline-block w-4 h-4 border-[3px] border-current border-t-transparent rounded-full" />
                                    </span>
                                ) : (
                                    "Update Fee Plan"
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
