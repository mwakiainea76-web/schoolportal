import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm, Link } from "@inertiajs/react";
import TextInput from "@/Components/TextInput";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        academic_year: "",
    });

    const submit = (e) => {
        e.preventDefault();
        post(route("academic.years.store"));
    };

    return (
        <AuthenticatedLayout>
            <Head title="Create Academic Year" />

            <div className="max-w-4xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="bg-white rounded-lg border border-zinc-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
                    <legend className=" text-white   border-b border-white/50  text-center py-2 bg-slate-400 rounded-t-lg w-full">
                        Create new academic year
                    </legend>
                    <form className="p-10 space-y-8" onSubmit={submit}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Name */}
                            <div>
                                <InputLabel>Academic Year Name</InputLabel>
                                <TextInput
                                    value={data.academic_year}
                                    onChange={(e) =>
                                        setData("academic_year", e.target.value)
                                    }
                                    placeholder="e.g. 2023/2024"
                                    error={errors.academic_year}
                                />
                                <InputError message={errors.academic_year} />
                            </div>
                        </div>
                        <div className="flex justify-between pt-4">
                            <Link
                                href={route("academic.years.index")}
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
