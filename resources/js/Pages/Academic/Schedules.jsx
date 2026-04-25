import { Head } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function Schedules() {
    return (
        <AuthenticatedLayout
            header={
                <div>
                    <h1 className="text-2xl font-bold text-zinc-900">
                        Class Schedules
                    </h1>
                    <p className="text-sm text-zinc-500 mt-1">
                        This is a simple nested route example.
                    </p>
                </div>
            }
        >
            <Head title="Class Schedules" />

            <div className="rounded-3xl border border-zinc-100 bg-white p-8 shadow-sm">
                <p className="text-zinc-600">
                    If you can see this inside the same sidebar and top bar,
                    nested routes are rendering inside the authenticated layout.
                </p>
            </div>
        </AuthenticatedLayout>
    );
}
