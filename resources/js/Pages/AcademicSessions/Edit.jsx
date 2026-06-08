import React from "react";
import { Head, useForm, Link } from "@inertiajs/react";
import { useEffect } from "react";
import TextInput from "@/Components/TextInput";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import Modal from "@/Components/Modal";
import AcademicCalendarWorkspaceTabs from "@/Pages/Academic/Partials/AcademicCalendarWorkspaceTabs";

export default function Edit({
    academic_session,
    modalMode = false,
    open = false,
    onClose = () => {},
}) {
    const { data, setData, put, processing, errors } = useForm({
        session_No: academic_session.session_No || "",
        academic_year_id: academic_session.academic_year_id || "",
    });

    useEffect(() => {
        setData({
            session_No: academic_session?.session_No || "",
            academic_year_id: academic_session?.academic_year_id || "",
        });
    }, [academic_session?.id]);

    const submit = (e) => {
        e.preventDefault();
        put(
            route(
                "academic.sessions.update",
                encodeURIComponent(academic_session.id),
            ),
            {
                preserveScroll: true,
                onSuccess: () => {
                    if (modalMode) {
                        onClose();
                    }
                },
            },
        );
    };

    const academicYearLabel =
        academic_session?.academicYear?.academic_year ||
        academic_session?.academic_year?.academic_year ||
        "";

    const content = (
        <div className="bg-white rounded-lg border border-zinc-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
            <form className="p-10 space-y-8" onSubmit={submit}>
                <div className="text-sm text-zinc-500">
                    Current status
                    <span
                        className={`ml-2 rounded px-2 py-0.5 text-xs ${academic_session.is_active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}
                    >
                        {academic_session.is_active ? "Active" : "Inactive"}
                    </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <InputLabel value="Academic year" />
                        <TextInput
                            className="cursor-not-allowed bg-gray-100"
                            value={academicYearLabel}
                            disabled
                        />
                        <input
                            type="hidden"
                            name="academic_year_id"
                            value={data.academic_year_id}
                        />
                        <InputError message={errors.academic_year_id} />
                    </div>

                    <div>
                        <InputLabel>Session Number</InputLabel>
                        <TextInput
                            value={data.session_No}
                            onChange={(e) =>
                                setData("session_No", e.target.value)
                            }
                            placeholder="e.g. 1"
                            error={errors.session_No}
                        />
                        <InputError message={errors.session_No} />
                    </div>
                </div>

                <div className="pt-6 flex items-center justify-end gap-4 border-t border-zinc-50">
                    {modalMode ? (
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-3 rounded-xl text-sm font-bold text-zinc-500 hover:bg-zinc-100 transition-colors"
                        >
                            Cancel
                        </button>
                    ) : (
                        <Link
                            href={route("academic.sessions.index")}
                            className="px-6 py-3 rounded-xl text-sm font-bold text-zinc-500 hover:bg-zinc-100 transition-colors"
                        >
                            Cancel
                        </Link>
                    )}

                    <PrimaryButton disabled={processing}>
                        {processing ? "Updating..." : "Update Academic Session"}
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
        <>
            <Head
                title={`Edit Academic Session - ${academic_session?.session_No}`}
            />

            <div className="max-w-7xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-700">
                <AcademicCalendarWorkspaceTabs activeTab="sessions" />
                {content}
            </div>
        </>
    );
}
