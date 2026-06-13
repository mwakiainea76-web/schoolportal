import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import { Head, useForm, usePage } from "@inertiajs/react";
import { KeyRound, ShieldCheck, UserRound } from "lucide-react";

export default function ResetStaffPassword() {
    const { flash = {} } = usePage().props;
    const form = useForm({
        staff_number: "",
        password: "",
        password_confirmation: "",
    });
    const isFormIncomplete =
        !form.data.staff_number.trim() ||
        !form.data.password ||
        !form.data.password_confirmation;

    const submit = (e) => {
        e.preventDefault();

        form.post(route("staffs.password-reset.store"), {
            preserveScroll: true,
            onSuccess: () => form.reset("password", "password_confirmation"),
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Reset Staff Password" />

            <div className="mx-auto w-full max-w-5xl py-6">
                <div className="rounded-[28px] border border-zinc-200 bg-white shadow-sm">
                    <div className="grid gap-6 px-8 py-8 lg:grid-cols-[0.85fr_1.15fr]">
                        <section className="rounded-2xl border border-zinc-200 bg-zinc-50/70 p-6">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-emerald-700 shadow-sm">
                                    <UserRound className="h-5 w-5" />
                                </div>
                                <h2 className="text-base font-semibold text-zinc-900">
                                    Staff Account Recovery
                                </h2>
                            </div>

                            <div className="mt-5 space-y-4 text-sm text-zinc-600">
                                <p>
                                    Enter the staff number and choose a new
                                    password for that account.
                                </p>
                                <p>
                                    The latest password takes effect immediately
                                    after submission.
                                </p>
                            </div>
                        </section>

                        <section className="rounded-2xl border border-zinc-200 bg-white p-6">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                                    <KeyRound className="h-5 w-5" />
                                </div>
                                <div>
                                    <h2 className="text-base font-semibold text-zinc-900">
                                        New Password Details
                                    </h2>
                                </div>
                            </div>

                            {flash.success ? (
                                <div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
                                    {flash.success}
                                </div>
                            ) : null}

                            <form onSubmit={submit} className="mt-6 space-y-6">
                                <div className="grid grid-cols-1 gap-5">
                                    <div>
                                        <InputLabel
                                            value="Staff Number"
                                            required
                                        />
                                        <TextInput
                                            required
                                            name="staff_number"
                                            value={form.data.staff_number}
                                            onChange={(e) =>
                                                form.setData(
                                                    "staff_number",
                                                    e.target.value,
                                                )
                                            }
                                            error={form.errors.staff_number}
                                            placeholder="TVET/STAFF/001"
                                        />
                                        <InputError
                                            message={form.errors.staff_number}
                                        />
                                    </div>

                                    <div>
                                        <InputLabel
                                            value="New Password"
                                            required
                                        />
                                        <TextInput
                                            type="password"
                                            required
                                            name="password"
                                            value={form.data.password}
                                            onChange={(e) =>
                                                form.setData(
                                                    "password",
                                                    e.target.value,
                                                )
                                            }
                                            error={form.errors.password}
                                        />
                                        <InputError
                                            message={form.errors.password}
                                        />
                                    </div>

                                    <div>
                                        <InputLabel
                                            value="Confirm Password"
                                            required
                                        />
                                        <TextInput
                                            type="password"
                                            required
                                            name="password_confirmation"
                                            value={
                                                form.data.password_confirmation
                                            }
                                            onChange={(e) =>
                                                form.setData(
                                                    "password_confirmation",
                                                    e.target.value,
                                                )
                                            }
                                            error={
                                                form.errors
                                                    .password_confirmation
                                            }
                                        />
                                        <InputError
                                            message={
                                                form.errors
                                                    .password_confirmation
                                            }
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-end">
                                    <PrimaryButton
                                        disabled={
                                            form.processing || isFormIncomplete
                                        }
                                    >
                                        Reset Staff Password
                                    </PrimaryButton>
                                </div>
                            </form>
                        </section>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
