import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm } from "@inertiajs/react";
import TextInput from "@/Components/TextInput";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import ToggleSwitch from "@/Components/ToggleSwitch";
import SearchSelect from "@/Components/SearchSelect";
export default function Create({ academic_years }) {
    const { data, setData, post, processing, errors } = useForm({
        session_No: "",
        academic_year_id: "",
        start_date: "",
        end_date: "",
    });

    const submit = (e) => {
        e.preventDefault();
        post(route("academic.sessions.store"));
    };

    return (
        <AuthenticatedLayout>
            <Head title="Create Academic session" />

            <div className="max-w-4xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="bg-white rounded-lg border border-zinc-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
                    <legend className=" text-white   border-b border-white/50  text-center py-2 bg-slate-400 rounded-t-lg w-full">
                        Create new academic session
                    </legend>
                    <form className="p-10 space-y-8" onSubmit={submit}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <InputLabel value="Academic year" />

                                <SearchSelect
                                    value={data.academic_year_id}
                                    routeName="academic-years.search"
                                    defaultOptions={academic_years}
                                    placeholder="Search Academic Year..."
                                    onChange={(c) =>
                                        setData("academic_year_id", c.id)
                                    }
                                />
                                <InputError message={errors.academic_year_id} />
                            </div>
                            <div>
                                <InputLabel>Session Number</InputLabel>
                                <TextInput
                                    type="number"
                                    value={data.session_No}
                                    onChange={(e) =>
                                        setData("session_No", e.target.value)
                                    }
                                    placeholder="e.g. 1"
                                    error={errors.session_No}
                                />
                                <InputError message={errors.session_No} />
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
                                Create academic session
                            </PrimaryButton>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
