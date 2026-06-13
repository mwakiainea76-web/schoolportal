import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import { Transition } from "@headlessui/react";
import { Link, useForm } from "@inertiajs/react";
import { Mail } from "lucide-react";

export default function UpdateProfileInformation({
    user,
    mustVerifyEmail,
    status,
    className = "",
}) {
    const { data, setData, patch, errors, processing, recentlySuccessful } =
        useForm({
            first_name: user.first_name || "",
            last_name: user.last_name || "",
            email: user.email,
            phone_number: user.phone_number || "",
            address: user.address || "",
        });

    const submit = (e) => {
        e.preventDefault();

        patch(route("profile.update"));
    };

    const isStudent = !!user.student;
    const isStaff = !!user.staff;

    return (
        <section className={className}>
            <form onSubmit={submit} className="space-y-12">
                {/* Institutional Information (Clean Read-Only Cards) */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {isStudent && (
                        <>
                            <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-100 space-y-1">
                                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                                    Admission No.
                                </p>
                                <p className="text-sm font-bold text-zinc-900">
                                    {user.student.admission_number || "N/A"}
                                </p>
                            </div>
                            <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-100 space-y-1">
                                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                                    Current Course
                                </p>
                                <p
                                    className="text-sm font-bold text-zinc-900 truncate"
                                    title={
                                        user.student.course_enrollment?.course
                                            ?.name
                                    }
                                >
                                    {user.student.course_enrollment?.course
                                        ?.name ?? "Not Enrolled"}
                                </p>
                            </div>
                            <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-100 space-y-1">
                                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                                    Curriculum
                                </p>
                                <p className="text-sm font-bold text-zinc-900">
                                    {user.student.course_enrollment?.curriculum
                                        ?.name ?? "N/A"}
                                </p>
                            </div>
                            <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-100 space-y-1">
                                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                                    Status
                                </p>
                                <div className="flex items-center gap-2">
                                    <div
                                        className={`h-2 w-2 rounded-full ${user.student.enrollment_status === "active" ? "bg-emerald-500" : "bg-zinc-300"}`}
                                    />
                                    <p className="text-sm font-bold text-zinc-900 capitalize">
                                        {user.student.enrollment_status ??
                                            "Unknown"}
                                    </p>
                                </div>
                            </div>
                        </>
                    )}

                    {isStaff && (
                        <>
                            <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-100 space-y-1">
                                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                                    Staff Number
                                </p>
                                <p className="text-sm font-bold text-zinc-900">
                                    {user.staff.staff_number || "N/A"}
                                </p>
                            </div>
                            <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-100 space-y-1">
                                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                                    Department
                                </p>
                                <p className="text-sm font-bold text-zinc-900 truncate">
                                    {user.staff.department?.name ?? "N/A"}
                                </p>
                            </div>
                            <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-100 space-y-1">
                                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                                    Designation
                                </p>
                                <p className="text-sm font-bold text-zinc-900 truncate">
                                    {user.staff.designation ?? "N/A"}
                                </p>
                            </div>
                            <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-100 space-y-1">
                                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                                    Employment
                                </p>
                                <p className="text-sm font-bold text-zinc-900">
                                    {user.staff.employment_type ?? "N/A"}
                                </p>
                            </div>
                        </>
                    )}
                </div>

                {/* Editable Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                    <div className="space-y-1.5">
                        <InputLabel
                            htmlFor="first_name"
                            className="text-zinc-600 font-semibold"
                            value="First Name"
                        />
                        <TextInput
                            id="first_name"
                            className="block w-full border-zinc-300 focus:border-emerald-500 focus:ring-emerald-500 rounded-xl"
                            value={data.first_name}
                            onChange={(e) =>
                                setData("first_name", e.target.value)
                            }
                            required
                            autoComplete="given-name"
                        />
                        <InputError message={errors.first_name} />
                    </div>

                    <div className="space-y-1.5">
                        <InputLabel
                            htmlFor="last_name"
                            className="text-zinc-600 font-semibold"
                            value="Last Name"
                        />
                        <TextInput
                            id="last_name"
                            className="block w-full border-zinc-300 focus:border-emerald-500 focus:ring-emerald-500 rounded-xl"
                            value={data.last_name}
                            onChange={(e) =>
                                setData("last_name", e.target.value)
                            }
                            required
                            autoComplete="family-name"
                        />
                        <InputError message={errors.last_name} />
                    </div>

                    <div className="space-y-1.5">
                        <InputLabel
                            htmlFor="email"
                            className="text-zinc-600 font-semibold"
                            value="Email Address"
                        />
                        <TextInput
                            id="email"
                            type="email"
                            className="block w-full border-zinc-300 focus:border-emerald-500 focus:ring-emerald-500 rounded-xl"
                            value={data.email}
                            onChange={(e) => setData("email", e.target.value)}
                            required
                            autoComplete="username"
                        />
                        <InputError message={errors.email} />
                    </div>

                    <div className="space-y-1.5">
                        <InputLabel
                            htmlFor="phone_number"
                            className="text-zinc-600 font-semibold"
                            value="Phone Number"
                        />
                        <TextInput
                            id="phone_number"
                            className="block w-full border-zinc-300 focus:border-emerald-500 focus:ring-emerald-500 rounded-xl"
                            value={data.phone_number}
                            onChange={(e) =>
                                setData("phone_number", e.target.value)
                            }
                            autoComplete="tel"
                        />
                        <InputError message={errors.phone_number} />
                    </div>

                    <div className="md:col-span-2 space-y-1.5">
                        <InputLabel
                            htmlFor="address"
                            className="text-zinc-600 font-semibold"
                            value="Home Address"
                        />
                        <TextInput
                            id="address"
                            className="block w-full border-zinc-300 focus:border-emerald-500 focus:ring-emerald-500 rounded-xl"
                            value={data.address}
                            onChange={(e) => setData("address", e.target.value)}
                            autoComplete="street-address"
                        />
                        <InputError message={errors.address} />
                    </div>
                </div>

                {mustVerifyEmail && user.email_verified_at === null && (
                    <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-center gap-3">
                        <Mail className="text-amber-600 shrink-0" size={20} />
                        <div className="text-sm text-amber-800">
                            Your email address is unverified.
                            <Link
                                href={route("verification.send")}
                                method="post"
                                as="button"
                                className="ml-2 font-bold underline hover:text-amber-900"
                            >
                                Send verification email
                            </Link>
                        </div>
                    </div>
                )}

                <div className="flex items-center justify-between gap-4 pt-4">
                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out duration-300"
                        enterFrom="opacity-0 translate-y-1"
                        leave="transition ease-in-out duration-300"
                        leaveTo="opacity-0 translate-y-1"
                    >
                        <p className="text-sm font-medium text-emerald-600">
                            Profile saved.
                        </p>
                    </Transition>

                    <PrimaryButton
                        disabled={processing}
                        className="bg-emerald-600 hover:bg-emerald-700 rounded-xl px-8 h-11"
                    >
                        {processing ? "Saving..." : "Save Changes"}
                    </PrimaryButton>
                </div>
            </form>
        </section>
    );
}
