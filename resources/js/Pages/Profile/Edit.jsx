import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';
import { UserCircle, ShieldCheck, Settings, GraduationCap, Briefcase, Mail, Phone, MapPin } from "lucide-react";

export default function Edit({ user, mustVerifyEmail, status }) {
    const isStudent = !!user.student;
    const isStaff = !!user.staff;
    const roleName = user.roles && user.roles.length > 0 ? user.roles[0].name : 'Member';

    return (
        <AuthenticatedLayout>
            <Head title="Profile Settings" />

            <div className="mx-auto w-full max-w-5xl py-6 animate-in fade-in duration-500">
                {/* Simplified Professional Header */}
                <div className="bg-white rounded-2xl border border-zinc-200 p-8 mb-8 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-zinc-50 rounded-bl-full -mr-10 -mt-10 opacity-50" />
                    
                    <div className="relative flex flex-col md:flex-row items-center md:items-start gap-8">
                        <div className="h-24 w-24 rounded-2xl bg-zinc-100 flex items-center justify-center text-zinc-400 border border-zinc-200 shrink-0">
                            {user.profile_photo ? (
                                <img src={user.profile_photo} alt={user.full_name} className="h-full w-full object-cover rounded-2xl" />
                            ) : (
                                <UserCircle className="h-16 w-16 opacity-50" />
                            )}
                        </div>

                        <div className="text-center md:text-left flex-1 space-y-2">
                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                                <span className="px-2.5 py-0.5 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-bold uppercase tracking-wider border border-emerald-100">
                                    {roleName}
                                </span>
                                <span className="px-2.5 py-0.5 rounded-lg bg-zinc-50 text-zinc-600 text-xs font-bold uppercase tracking-wider border border-zinc-100">
                                    {isStudent ? 'Student ID' : 'Staff ID'}: {isStudent ? user.student.admission_number : (user.staff?.staff_number || 'N/A')}
                                </span>
                            </div>
                            
                            <h1 className="text-3xl font-extrabold text-zinc-900 tracking-tight">
                                {user.full_name}
                            </h1>
                            
                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-6 gap-y-2 text-sm text-zinc-500 font-medium">
                                <div className="flex items-center gap-2">
                                    <Mail size={14} className="text-zinc-400" />
                                    {user.email}
                                </div>
                                {user.phone_number && (
                                    <div className="flex items-center gap-2">
                                        <Phone size={14} className="text-zinc-400" />
                                        {user.phone_number}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-8">
                    {/* Profile Information Section */}
                    <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
                        <div className="px-8 py-5 border-b border-zinc-100 bg-zinc-50/50 flex items-center gap-3">
                            <div className="h-8 w-8 rounded-lg bg-white border border-zinc-200 flex items-center justify-center text-emerald-600 shadow-sm">
                                <Settings size={18} />
                            </div>
                            <h2 className="text-lg font-bold text-zinc-900">Personal Information</h2>
                        </div>
                        
                        <div className="p-8">
                            <UpdateProfileInformationForm
                                user={user}
                                mustVerifyEmail={mustVerifyEmail}
                                status={status}
                            />
                        </div>
                    </div>

                    {/* Security Section */}
                    <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
                        <div className="px-8 py-5 border-b border-zinc-100 bg-zinc-50/50 flex items-center gap-3">
                            <div className="h-8 w-8 rounded-lg bg-white border border-zinc-200 flex items-center justify-center text-sky-600 shadow-sm">
                                <ShieldCheck size={18} />
                            </div>
                            <h2 className="text-lg font-bold text-zinc-900">Security & Password</h2>
                        </div>
                        
                        <div className="p-8">
                            <UpdatePasswordForm className="w-full" />
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
