import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm } from "@inertiajs/react";
import TextInput from "@/Components/TextInput";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        academic_year: "",
        start_date: "",
        end_date: "",
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
                        </div>

                        {/* Submit */}
                        <div className="pt-4">
                            <PrimaryButton disabled={processing}>
                                Create Academic Year
                            </PrimaryButton>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
