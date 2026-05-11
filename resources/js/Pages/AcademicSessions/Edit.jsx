import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm } from "@inertiajs/react";
import TextInput from "@/Components/TextInput";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import ToggleSwitch from "@/Components/ToggleSwitch";
import SearchSelect from "@/Components/SearchSelect";

export default function Edit({ academic_session }) {
    const { data, setData, put, processing, errors } = useForm({
        session_No: academic_session.session_No || "",
        academic_year_id: academic_session.academic_year_id || "",
        is_active: academic_session.is_active || false,
        close_session: academic_session.end_date ? false : true,
    });

    const submit = (e) => {
        e.preventDefault();
        put(
            route(
                "academic.sessions.update",
                encodeURIComponent(academic_session.id),
            ),
        );
    };

    return (
        <AuthenticatedLayout>
            <Head title="Edit Academic Session" />

            <div className="max-w-4xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="bg-white rounded-lg border border-zinc-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
                    <legend className=" text-white   border-b border-white/50  text-center py-2 bg-slate-400 rounded-t-lg w-full">
                        Edit academic year details
                    </legend>
                    <p className="text-center text-xs">
                        {" "}
                        Current status
                        <span
                            className={`px-2 py-0.5 rounded text-xs ${academic_session.end_date ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}
                        >
                            {academic_session.end_date
                                ? "Ongoing"
                                : "Completed"}
                        </span>
                    </p>

                    <form className="p-10 space-y-8" onSubmit={submit}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Academic Year Selection */}
                            <div>
                                <InputLabel value="Academic year" />
                                <TextInput
                                    className="cursor-not-allowed bg-slate-100"
                                    value={
                                        academic_session.academic_year
                                            .academic_year
                                    }
                                    disabled
                                />
                                <input
                                    type="hidden"
                                    name="academic_year_id"
                                    value={data.academic_year_id}
                                />
                                <InputError message={errors.academic_year_id} />
                            </div>

                            {/* Session Number */}
                            <div>
                                <InputLabel>Session Number</InputLabel>
                                <TextInput
                                    className="cursor-not-allowed bg-slate-100"
                                    disabled
                                    value={data.session_No}
                                    onChange={(e) =>
                                        setData("session_No", e.target.value)
                                    }
                                    placeholder="e.g. 1"
                                    error={errors.session_No}
                                />
                                <InputError message={errors.session_No} />
                            </div>

                            {/* Active Toggle */}
                            <div>
                                <ToggleSwitch
                                    label={
                                        academic_session.is_active
                                            ? "De activate this session now"
                                            : `Activate to current session now`
                                    }
                                    checked={data.is_active}
                                    onChange={(checked) =>
                                        setData("is_active", checked)
                                    }
                                    error={errors.is_active}
                                />
                                <InputError message={errors.is_active} />
                            </div>
                            {academic_session.start_date && (
                                <div>
                                    <ToggleSwitch
                                        label={
                                            academic_session.end_date
                                                ? "Re open this session now"
                                                : `Close this Academic session`
                                        }
                                        checked={data.close_session}
                                        onChange={(checked) =>
                                            setData("close_session", checked)
                                        }
                                        error={errors.close_session}
                                    />
                                    <InputError
                                        message={errors.close_session}
                                    />
                                </div>
                            )}
                        </div>

                        {/* Submit */}
                        <div className="pt-4 flex items-center gap-4">
                            <PrimaryButton disabled={processing}>
                                Update academic session
                            </PrimaryButton>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
