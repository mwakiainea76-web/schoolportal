import { Head } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function Dashboard() {
    return (
        <AuthenticatedLayout>
            <Head title="Dashboard" />

            <div className="animate-in fade-in slide-in-from-bottom-2 duration-700">
                <h1 className="text-3xl font-bold text-zinc-900 tracking-tight">
                    Academic Overview
                </h1>
                <p className="text-zinc-500 mt-1">
                    Manage programs, program versions, and institutional scheduling from one place.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">
                    <div className="h-64 rounded-3xl bg-white border border-zinc-100 shadow-sm p-8 flex items-center justify-center text-zinc-300 italic">
                        Page Content Area...
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
