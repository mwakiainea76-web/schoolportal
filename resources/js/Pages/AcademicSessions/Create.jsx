import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm } from "@inertiajs/react";
import { useEffect } from "react";
import TextInput from "@/Components/TextInput";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import Modal from "@/Components/Modal";
import AcademicCalendarWorkspaceTabs from "@/Pages/Academic/Partials/AcademicCalendarWorkspaceTabs";

export default function Create({
    academic_year,
    session_no,
    prerequisite_error,
    modalMode = false,
    open = false,
    onClose = () => {},
}) {
    const { data, setData, post, processing, errors } = useForm({
        session_No: session_no,
        academic_year_id: academic_year?.id,
    });

    useEffect(() => {
        setData({
            session_No: session_no,
            academic_year_id: academic_year?.id,
        });
    }, [session_no, academic_year?.id]);

    const submit = (e) => {
        e.preventDefault();
        post(route("academic.sessions.store"), {
            preserveScroll: true,
            onSuccess: () => {
                if (modalMode) {
                    onClose();
                }
            },
        });
    };

    const content = (
        <div className="bg-white rounded-lg border border-zinc-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
            <form className="p-10 space-y-8" onSubmit={submit}>
                {prerequisite_error ? (
                    <div className="rounded border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
                        {prerequisite_error}
                    </div>
                ) : null}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <InputLabel value="Academic year" />
                        <TextInput
                            className="cursor-not-allowed bg-slate-100"
                            value={academic_year?.academic_year ?? "No active academic year"}
                            disabled
                        />

                        <InputError message={errors.academic_year_id} />
                    </div>
                    <div>
                        <InputLabel value="Session no." />
                        <TextInput
                            value={data.session_No}
                            onChange={(e) =>
                                setData("session_No", e.target.value)
                            }
                            error={errors.session_No}
                        />
                        <InputError message={errors.session_No} />
                    </div>
                </div>
                <input
                    type="hidden"
                    name="academic_year_id"
                    value={data.academic_year_id || ""}
                />
                <div className="pt-4 flex items-center justify-end gap-4">
                    {modalMode ? (
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-3 rounded-xl text-sm font-bold text-zinc-500 hover:bg-zinc-100 transition-colors"
                        >
                            Cancel
                        </button>
                    ) : null}
                    <PrimaryButton disabled={processing || !academic_year}>
                        Create academic session
                    </PrimaryButton>
                </div>
            </form>
        </div>
    );

    if (modalMode) {
        return (
            <Modal show={open} onClose={onClose} maxWidth="3xl" align="top">
                {content}
            </Modal>
        );
    }

    return (
        <AuthenticatedLayout>
            <Head title="Create Academic session" />

            <div className="max-w-7xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-700">
                <AcademicCalendarWorkspaceTabs activeTab="add-session" />
                {content}
            </div>
        </AuthenticatedLayout>
    );
}
