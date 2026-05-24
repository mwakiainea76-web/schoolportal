import { Head, Link } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import PageLayout from "@/Components/PageLayout";

export default function FormScaffold({
    title,
    description,
    backHref,
    backLabel = "Back to manual billing",
    children,
}) {
    return (
        <AuthenticatedLayout>
            <Head title={title} />

            <PageLayout>
                <div className="rounded-[2rem] bg-[#1b263b] px-8 py-8 text-white shadow-xl">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                        <div>
                            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-300">
                                Billing Operations
                            </p>
                            <h1 className="mt-3 text-3xl font-bold tracking-tight">
                                {title}
                            </h1>
                            <p className="mt-2 max-w-2xl text-sm text-slate-300">
                                {description}
                            </p>
                        </div>

                        <Link
                            href={backHref}
                            className="inline-flex rounded-xl bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/20"
                        >
                            {backLabel}
                        </Link>
                    </div>
                </div>

                {children}
            </PageLayout>
        </AuthenticatedLayout>
    );
}
