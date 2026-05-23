import React from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm, Link } from "@inertiajs/react";
import TextInput from "@/Components/TextInput";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import SearchSelect from "@/Components/SearchSelect";

export default function Edit({ academic_session }) {
    const sessionActionOptions = [
        { id: "activate", name: "Make session active" },
        { id: "end", name: "End session" },
        { id: "disable", name: "Disable session" },
    ];

    const { data, setData, put, processing, errors } = useForm({
        session_No: academic_session.session_No || "",
        academic_year_id: academic_session.academic_year_id || "",
        session_action: academic_session.is_active
            ? "activate"
            : academic_session.end_date
              ? "end"
              : "disable",
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
                        is_active: data.session_action === "activate",
                        close_session: data.session_action === "end",
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

                            {/* Session Action */}
                            <div className="flex flex-col justify-center">
                                <InputLabel value="Session Action" required />
                                <SearchSelect
                                    routeName={null}
                                    defaultOptions={sessionActionOptions}
                                    value={data.session_action}
                                    selectedLabel={
                                        sessionActionOptions.find(
                                            (option) =>
                                                option.id ===
                                                data.session_action,
                                        )?.name || "Select session action"
                                    }
                                    placeholder="Select session action"
                                    onChange={(item) =>
                                        setData("session_action", item.id)
                                    }
                                    error={errors.session_action}
                                />
                                <InputError
                                    message={errors.session_action}
                                    className="mt-2"
                                />
                                <p className="mt-1 text-xs text-slate-500">
                                    Choose one action for this academic session.
                                </p>
                            </div>
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
