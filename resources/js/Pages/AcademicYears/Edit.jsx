import React from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm, Link } from "@inertiajs/react";
import TextInput from "@/Components/TextInput";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import ToggleSwitch from "@/Components/ToggleSwitch";

export default function Edit({ academic_year }) {
    // Initialize form with existing academic_year data
    const { data, setData, put, processing, errors } = useForm({
        academic_year: academic_year?.academic_year || "",
        start_date: academic_year?.start_date || "",
        end_date: academic_year?.end_date || "",
        is_active: !!academic_year?.is_active,
    });

    const submit = (e) => {
        e.preventDefault();
        // Assuming the route uses the ID for updates
        put(
            route(
                "academic.years.update",
                encodeURIComponent(academic_year.id),
            ),
            {
                preserveScroll: true,
            },
        );
    };

    return (
        <AuthenticatedLayout>
            <Head
                title={`Edit Academic Year - ${academic_year.academic_year}`}
            />

            <div className="max-w-4xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="bg-white rounded-lg border border-zinc-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
                    <legend className=" text-white   border-b border-white/50  text-center py-2 bg-slate-400 rounded-t-lg w-full">
                        Edit academic year
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

                            {/* Start Date */}
                            <div>
                                <InputLabel>Start Date</InputLabel>
                                <TextInput
                                    type="date"
                                    value={data.start_date}
                                    onChange={(e) =>
                                        setData("start_date", e.target.value)
                                    }
                                    error={errors.start_date}
                                />
                                <InputError message={errors.start_date} />
                            </div>

                            {/* End Date */}
                            <div>
                                <InputLabel>End Date</InputLabel>
                                <TextInput
                                    type="date"
                                    value={data.end_date}
                                    onChange={(e) =>
                                        setData("end_date", e.target.value)
                                    }
                                    error={errors.end_date}
                                />
                                <InputError message={errors.end_date} />
                            </div>

                            {/* Active Toggle */}
                            <div className="flex flex-col justify-center">
                                <ToggleSwitch
                                    label="Set as Current Academic Year"
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

                        {/* Actions */}
                        <div className="pt-6 flex items-center justify-end gap-4 border-t border-zinc-50">
                            <Link
                                href={route("academic.years.index")}
                                className="px-6 py-3 rounded-xl text-sm font-bold text-zinc-500 hover:bg-zinc-100 transition-colors"
                            >
                                Cancel
                            </Link>

                            <PrimaryButton disabled={processing}>
                                {processing
                                    ? "Updating..."
                                    : "Update Academic Year"}
                            </PrimaryButton>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
