import { Head, Link, useForm } from "@inertiajs/react";
import { useEffect } from "react";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import InputError from "@/Components/InputError";
import AccessWorkspaceTabs from "@/Pages/Roles/Partials/AccessWorkspaceTabs";

export default function EditPermission({ permission }) {
    const { data, setData, put, processing, errors } = useForm({
        name: "",
    });

    // Populate on load
    useEffect(() => {
        if (permission) {
            setData({
                name: permission.name ?? "",
            });
        }
    }, [permission]);

    const submit = (e) => {
        e.preventDefault();
        put(route("permissions.update", permission.id));
    };

    return (
        <>
            <Head title="Edit Permission" />

            <div className="max-w-4xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="mb-6">
                    <AccessWorkspaceTabs
                        activeTab="edit-permission"
                        permissionId={permission.id}
                    />
                </div>
                <div className="bg-white rounded-lg border border-zinc-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
                    <form className="p-10 space-y-8" onSubmit={submit}>
                        {/* Permission Name */}
                        <div>
                            <InputLabel>Permission Name</InputLabel>
                            <TextInput
                                value={data.name}
                                onChange={(e) =>
                                    setData("name", e.target.value)
                                }
                                placeholder="e.g. units.update"
                                error={errors.name}
                            />
                            <InputError message={errors.name} />
                        </div>

                        {/* ACTIONS */}
                        <div className="flex justify-between pt-4">
                            <Link
                                href={route("permissions.index")}
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
                                    "Update Permission"
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}
