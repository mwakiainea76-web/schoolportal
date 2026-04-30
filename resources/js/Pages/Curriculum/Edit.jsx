import React from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import TextArea from "@/Components/TextArea";
import TextInput from "@/Components/TextInput";
import ToggleSwitch from "@/Components/ToggleSwitch";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

const Edit = ({ curriculum }) => {
    const c = curriculum;
    const formatDateForInput = (value) => {
        if (!value) return "";

        if (typeof value === "string") {
            return value.slice(0, 10);
        }

        return "";
    };

    const { data, setData, put, processing, errors } = useForm({
        name: c?.name || "",
        description: c?.description || "",
        start_date: formatDateForInput(c?.start_date),
        end_date: formatDateForInput(c?.end_date),
        is_active: !!c?.is_active,
    });

    const submit = (e) => {
        e.preventDefault();

        put(route("curriculum.update", c.id), {
            preserveState: true,
            preserveScroll: true,
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Edit Curriculum" />

            <div className="mx-auto w-full">
                <legend className="text-white border-b border-white/50 text-center py-2 bg-slate-400 rounded-t-lg w-full">
                    Edit curriculum details
                </legend>
                <form
                    onSubmit={submit}
                    className="bg-white p-10 space-y-6 border rounded-lg"
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        <div>
                            <InputLabel value="Curriculum Name" required />
                            <TextInput
                                value={data.name}
                                onChange={(e) =>
                                    setData("name", e.target.value)
                                }
                                error={errors.name}
                            />
                            <InputError message={errors.name} />
                        </div>

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

                        <div>
                            <InputLabel value="End Date" />
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
                    </div>

                    <div>
                        <ToggleSwitch
                            label="Set as active curriculum"
                            checked={data.is_active}
                            onChange={(checked) =>
                                setData("is_active", checked)
                            }
                            error={errors.is_active}
                        />
                        <InputError message={errors.is_active} />
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
                            href={route("curriculum.index")}
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
