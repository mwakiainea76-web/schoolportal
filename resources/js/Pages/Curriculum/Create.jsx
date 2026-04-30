import React from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import TextArea from "@/Components/TextArea";
import TextInput from "@/Components/TextInput";
import ToggleSwitch from "@/Components/ToggleSwitch";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

const Create = () => {
    const { data, setData, post, processing, errors } = useForm({
        name: "",
        description: "",
        start_date: "",
        end_date: "",
        is_active: true,
    });

    const submit = (e) => {
        e.preventDefault();

        post(route("curriculum.store"), {
            preserveState: true,
            preserveScroll: true,
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Create Curriculum" />

            <div className="mx-auto w-full rounded-lg">
                <legend className="text-white border-b border-white/50 text-center py-2 bg-slate-400 rounded-t-lg w-full">
                    Add curriculum
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
                            <InputLabel value="Start Date" required />
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
                            disabled={processing}
                            type="submit"
                            className="px-4 py-2 bg-emerald-500 text-white rounded hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {processing ? (
                                <span className="flex items-center gap-2">
                                    Saving
                                    <span className="animate-spin inline-block w-4 h-4 border-[3px] border-current border-t-transparent rounded-full" />
                                </span>
                            ) : (
                                "Create Curriculum"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
};

export default Create;
