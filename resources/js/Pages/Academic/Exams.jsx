import { Head } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function Exams() {
    return (
        <AuthenticatedLayout
            header={
                <div>
                    <h1 className="text-2xl font-bold text-zinc-900">
                        Examinations
                    </h1>
                    <p className="text-sm text-zinc-500 mt-1">
                        Another nested page inside the same layout.
                    </p>
                </div>
            }
        >
            <Head title="Examinations" />

            <div className="rounded-3xl border border-zinc-100 bg-white p-8 shadow-sm">
                <p className="text-zinc-600">
                    Use this as a placeholder for exam setup or listings.
                </p>
            </div>
        </AuthenticatedLayout>
    );
}
