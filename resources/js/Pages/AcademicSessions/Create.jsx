import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm } from "@inertiajs/react";
import TextInput from "@/Components/TextInput";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
export default function Create({ academic_year, session_no }) {
    const { post, processing, errors } = useForm({
        session_No: session_no,
        academic_year_id: academic_year?.id,
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
                                <TextInput
                                    className="cursor-not-allowed bg-slate-100"
                                    value={academic_year.academic_year}
                                    disabled
                                />

                                <InputError message={errors.academic_year_id} />
                            </div>
                            <div>
                                <InputLabel value="Session no." />
                                <TextInput
                                    className="cursor-not-allowed bg-slate-100"
                                    value={session_no}
                                    disabled
                                />

                                <InputError message={errors.session_No} />
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
