import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import UpdatePasswordForm from "./Partials/UpdatePasswordForm";
import {
    UserCircle,
    ShieldCheck,
    Mail,
    Phone,
    MapPin,
    Briefcase,
    Building2,
    GraduationCap,
    IdCard,
    CalendarDays,
} from "lucide-react";

export default function Edit({ user, mustVerifyEmail }) {
    const isStudent = !!user.student;
    const roleName =
        user.roles && user.roles.length > 0 ? user.roles[0].name : "Member";
    const profile = user.student ?? user.staff ?? null;
    const activeEnrollment =
        user.student?.courseEnrollment ??
        user.student?.course_enrollment ??
        null;
    const activeMapping =
        activeEnrollment?.curriculumMapping ??
        activeEnrollment?.curriculum_mapping ??
        null;
    const phoneNumber = profile?.phone_number || "Not provided";
    const address = profile?.address || "Not provided";
    const identifier = isStudent
        ? user.student?.admission_number || "Not assigned"
        : user.staff?.staff_number || "Not assigned";
    const currentCourse =
        activeMapping?.course?.name ||
        activeEnrollment?.course?.name ||
        "Not enrolled";
    const currentCycle =
        activeMapping?.curriculum?.name ||
        activeEnrollment?.curriculum?.name ||
        "Not assigned";
    const memberSince = profile?.created_at || user.created_at;
    const nextOfKin = user.nextOfKin?.[0] ?? user.next_of_kin?.[0] ?? null;
    const nextOfKinName = nextOfKin
        ? [nextOfKin.first_name, nextOfKin.last_name]
              .filter(Boolean)
              .join(" ") || "Not provided"
        : "Not provided";
    const nextOfKinEmail = nextOfKin?.email || "Not provided";
    const nextOfKinPhone = nextOfKin?.phone_number || "Not provided";

    const overviewCards = [
        {
            label: isStudent ? "Admission Number" : "Staff Number",
            value: identifier,
            icon: IdCard,
        },
        {
            label: "Email Address",
            value: user.email,
            icon: Mail,
        },
        {
            label: "Phone Number",
            value: phoneNumber,
            icon: Phone,
        },
        {
            label: "Address",
            value: address,
            icon: MapPin,
        },
    ];

    const roleCards = isStudent
        ? [
              {
                  label: "Current Course",
                  value: currentCourse,
                  icon: GraduationCap,
              },
              {
                  label: "Cycle",
                  value: currentCycle,
                  icon: Briefcase,
              },
          ]
        : [
              {
                  label: "Department",
                  value: user.staff?.department?.name || "Not assigned",
                  icon: Building2,
              },
              {
                  label: "Designation",
                  value: user.staff?.designation || "Not assigned",
                  icon: Briefcase,
              },
              {
                  label: "Employment Type",
                  value: user.staff?.employment_type || "Not assigned",
                  icon: IdCard,
              },
          ];

    return (
        <AuthenticatedLayout>
            <Head title="My Profile" />

            <div className="mx-auto w-full max-w-6xl animate-in fade-in duration-500">
                <div className="overflow-hidden rounded-[28px] border border-zinc-200 bg-white shadow-sm">
                    <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-900 px-8 py-10 text-white">
                        <div className="absolute -right-16 -top-16 h-44 w-44 rounded-full bg-white/10 blur-2xl" />
                        <div className="absolute -bottom-20 left-16 h-48 w-48 rounded-full bg-emerald-400/10 blur-3xl" />

                        <div className="relative flex flex-col gap-8 md:flex-row md:items-center">
                            <div className="flex h-28 w-28 items-center justify-center rounded-full border border-white/20 bg-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.18)] backdrop-blur">
                                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-white/90 text-emerald-700">
                                    <UserCircle className="h-14 w-14" />
                                </div>
                            </div>

                            <div className="flex-1 space-y-3">
                                <div className="flex flex-wrap items-center gap-2">
                                    <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-white/90">
                                        {roleName}{" "}
                                    </span>{" "}
                                    {user.full_name || "Account Profile"}
                                </div>

                                <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/80">
                                    <div className="flex items-center gap-2">
                                        <Mail className="h-4 w-4" />
                                        {user.email}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <CalendarDays className="h-4 w-4" />
                                        Member since{" "}
                                        {memberSince
                                            ? new Date(
                                                  memberSince,
                                              ).toLocaleDateString()
                                            : "N/A"}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 items-start gap-8 px-8 py-8 lg:grid-cols-[1.1fr_0.9fr]">
                        <section className="space-y-8 self-start">
                            <div>
                                <h2 className="text-lg font-semibold text-zinc-900 text-center">
                                    Profile Overview
                                </h2>
                            </div>

                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                {overviewCards.map(
                                    ({ label, value, icon: Icon }) => (
                                        <div
                                            key={label}
                                            className="rounded-2xl border border-zinc-200 bg-zinc-50/70 p-5"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-emerald-700 shadow-sm">
                                                    <Icon className="h-5 w-5" />
                                                </div>
                                                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-400">
                                                    {label}
                                                </p>
                                            </div>
                                            <p className="mt-4 text-sm font-medium text-zinc-900">
                                                {value}
                                            </p>
                                        </div>
                                    ),
                                )}
                            </div>

                            <div className="rounded-2xl border border-zinc-200 bg-white p-6">
                                <h3 className="text-base font-semibold text-zinc-900">
                                    Institutional Details
                                </h3>
                                <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    {roleCards.map(
                                        ({ label, value, icon: Icon }) => (
                                            <div
                                                key={label}
                                                className="rounded-xl border border-zinc-100 bg-zinc-50/60 p-2"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-emerald-700 shadow-sm">
                                                        <Icon className="h-4 w-4" />
                                                    </div>
                                                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-400">
                                                        {label}
                                                    </p>
                                                </div>
                                                <p className="mt-3 text-sm font-medium text-zinc-900">
                                                    {value}
                                                </p>
                                            </div>
                                        ),
                                    )}
                                </div>
                            </div>

                            <div className="rounded-2xl border border-zinc-200 bg-white p-6">
                                <h3 className="text-base font-semibold text-zinc-900">
                                    Next Of Kin
                                </h3>
                                <div className="mt-5 grid grid-cols-1 gap-4">
                                    <div className="rounded-xl border border-zinc-100 bg-zinc-50/60 p-4">
                                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-400">
                                            Name
                                        </p>
                                        <p className="mt-1 text-sm font-medium text-zinc-900">
                                            {nextOfKinName}
                                        </p>
                                    </div>

                                    <div className="rounded-xl border border-zinc-100 bg-zinc-50/60 p-4">
                                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-400">
                                            Email
                                        </p>
                                        <p className="mt-1 text-sm font-medium text-zinc-900">
                                            {nextOfKinEmail}
                                        </p>
                                    </div>

                                    <div className="rounded-xl border border-zinc-100 bg-zinc-50/60 p-4">
                                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-400">
                                            Phone
                                        </p>
                                        <p className="mt-1 text-sm font-medium text-zinc-900">
                                            {nextOfKinPhone}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section className="space-y-6 self-start lg:pt-12">
                            {mustVerifyEmail &&
                            user.email_verified_at === null ? (
                                <div className="rounded-2xl border border-zinc-200 bg-white p-5 text-sm text-zinc-600">
                                    Your email address is pending verification.
                                </div>
                            ) : null}

                            <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
                                <div className="flex items-center gap-3 border-b border-zinc-100 bg-zinc-50/60 px-6 py-5">
                                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-emerald-700 shadow-sm">
                                        <ShieldCheck className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-semibold text-zinc-900">
                                            Password & Security
                                        </h2>
                                        <p className="text-sm text-zinc-500">
                                            Change the password .
                                        </p>
                                    </div>
                                </div>

                                <div className="p-6">
                                    <UpdatePasswordForm className="w-full" />
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
