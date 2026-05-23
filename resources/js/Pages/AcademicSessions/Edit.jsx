import React from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm, Link } from "@inertiajs/react";
import TextInput from "@/Components/TextInput";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import SearchSelect from "@/Components/SearchSelect";

export default function Edit({ academic_session }) {
    const lifecycleText = academic_session?.end_date
        ? "Academic session is closed"
        : academic_session?.start_date
          ? "Academic session is ongoing"
          : "Upcoming";
    const isSessionStateLocked = Boolean(academic_session?.end_date);

    const sessionStatusOptions = [
        { id: "active", name: "Active" },
        { id: "inactive", name: "Inactive" },
    ];

    const sessionLifecycleOptions = [
        { id: "open", name: "Keep Session Open" },
        { id: "close", name: "Close Session" },
    ];

    const { data, setData, put, processing, errors } = useForm({
        session_No: academic_session.session_No || "",
        academic_year_id: academic_session.academic_year_id || "",
        session_status: academic_session.is_active ? "active" : "inactive",
        session_lifecycle: academic_session.end_date
            ? "reopen"
            : academic_session.start_date
              ? "open"
              : "upcoming",
    });

    const submit = (e) => {
        e.preventDefault();
        put(
            route(
                "academic.sessions.update",
                encodeURIComponent(academic_session.id),
            ),
            {
                preserveScroll: true,
                onBefore: (visit) => {
                    visit.data = {
                        session_No: data.session_No,
                        academic_year_id: data.academic_year_id,
                        is_active: data.session_status === "active",
                        close_session: data.session_lifecycle === "close",
                    };
                },
            },
        );
    };

    return (
        <AuthenticatedLayout>
            <Head
                title={`Edit Academic Session - ${academic_session?.session_No}`}
            />

            <div className="max-w-4xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="bg-white rounded-lg border border-zinc-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
                    <legend className=" text-white   border-b border-white/50  text-center py-2 bg-slate-400 rounded-t-lg w-full">
                        Edit academic session
                    </legend>
                    <p className="text-center text-xs">
                        {" "}
                        Current status
                        <span
                            className={`px-2 py-0.5 rounded text-xs ${academic_session.is_active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}
                        >
                            {academic_session.is_active ? "Active" : "Inactive"}
                        </span>
                    </p>

                    <form className="p-10 space-y-8" onSubmit={submit}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Academic Year Selection */}
                            <div>
                                <InputLabel value="Academic year" />
                                <TextInput
                                    className="cursor-not-allowed bg-gray-100"
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
                                    className="cursor-not-allowed bg-gray-100"
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

                            {/* Active Status */}
                            <div className="flex flex-col justify-center">
                                <InputLabel value="Session Status" required />
                                <SearchSelect
                                    routeName={null}
                                    defaultOptions={sessionStatusOptions}
                                    value={data.session_status}
                                    selectedLabel={
                                        data.session_status === "active"
                                            ? "Active"
                                            : "Inactive"
                                    }
                                    placeholder="Select session status"
                                    onChange={(item) =>
                                        setData("session_status", item.id)
                                    }
                                    error={errors.session_status}
                                    disabled={isSessionStateLocked}
                                />
                                <InputError
                                    message={errors.session_status}
                                    className="mt-2"
                                />
                                <p
                                    className={`mt-1 text-xs ${isSessionStateLocked ? "text-amber-600" : "text-slate-500"}`}
                                >
                                    {isSessionStateLocked
                                        ? "This academic session is closed and cannot be reactivated."
                                        : lifecycleText}
                                </p>
                            </div>

                            {academic_session.start_date && (
                                <div className="flex flex-col justify-center">
                                    <InputLabel
                                        value="Session Lifecycle"
                                        required
                                    />
                                    <SearchSelect
                                        routeName={null}
                                        defaultOptions={sessionLifecycleOptions}
                                        value={data.session_lifecycle}
                                        selectedLabel={
                                            data.session_lifecycle === "close"
                                                ? "Close Session"
                                                : "Keep Session Open"
                                        }
                                        placeholder="Select session lifecycle"
                                        onChange={(item) =>
                                            setData(
                                                "session_lifecycle",
                                                item.id,
                                            )
                                        }
                                        error={errors.session_lifecycle}
                                        disabled={
                                            isSessionStateLocked &&
                                            !academic_session.end_date
                                        }
                                    />
                                    <InputError
                                        message={errors.session_lifecycle}
                                        className="mt-2"
                                    />
                                </div>
                            )}
                        </div>

                        {/* Actions */}
                        <div className="pt-6 flex items-center justify-end gap-4 border-t border-zinc-50">
                            <Link
                                href={route("academic.sessions.index")}
                                className="px-6 py-3 rounded-xl text-sm font-bold text-zinc-500 hover:bg-zinc-100 transition-colors"
                            >
                                Cancel
                            </Link>

                            <PrimaryButton disabled={processing}>
                                {processing
                                    ? "Updating..."
                                    : "Update Academic Session"}
                            </PrimaryButton>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
