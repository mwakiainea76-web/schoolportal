import { Head, Link } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { BookOpen } from "lucide-react";

export default function StudentIndex({ program, units_by_module }) {
    return (
        <AuthenticatedLayout>
            <Head title="My Units" />

            <div className="mx-auto w-full max-w-6xl animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="rounded-[2rem] bg-[#1b263b] px-8 py-8 text-white shadow-xl">
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-300">
                        My Units
                    </p>
                    <h1 className="mt-3 text-3xl font-bold tracking-tight">
                        {program?.name ?? "Program not assigned"}
                    </h1>
                    <p className="mt-2 text-sm text-slate-300">
                        {program?.version ?? "Program version not assigned"}
                    </p>
                </div>

                <div className="mt-6 flex items-center justify-between">
                    <Link
                        href={route("student.dashboard")}
                        className="text-sm font-medium text-emerald-700 transition hover:text-emerald-800"
                    >
                        Back to dashboard
                    </Link>
                </div>

                <div className="mt-6 space-y-6">
                    {units_by_module?.length ? (
                        units_by_module.map((group) => (
                            <section
                                key={group.module}
                                className="rounded-[1.75rem] border border-zinc-100 bg-white p-6 shadow-sm"
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h2 className="text-xl font-semibold text-zinc-900">
                                            Module {group.module}
                                        </h2>
                                        <p className="mt-1 text-sm text-zinc-500">
                                            Units assigned to this module.
                                        </p>
                                    </div>
                                    <div className="rounded-2xl bg-emerald-50 p-3 text-emerald-600">
                                        <BookOpen className="h-5 w-5" />
                                    </div>
                                </div>

                                <div className="mt-5 overflow-hidden rounded-2xl border border-zinc-100">
                                    <div className="grid grid-cols-[0.85fr,1.8fr,0.8fr,0.8fr] gap-4 bg-zinc-50 px-5 py-3 text-xs font-semibold uppercase tracking-wide text-zinc-500">
                                        <p>Code</p>
                                        <p>Unit Name</p>
                                        <p className="text-right">Credits</p>
                                        <p className="text-right">Hours</p>
                                    </div>
                                    {group.units.map((unit) => (
                                        <div
                                            key={unit.id}
                                            className="grid grid-cols-[0.85fr,1.8fr,0.8fr,0.8fr] gap-4 border-t border-zinc-100 bg-white px-5 py-4 text-sm text-zinc-700"
                                        >
                                            <p className="font-semibold text-emerald-700">
                                                {unit.code ?? "-"}
                                            </p>
                                            <p className="font-semibold text-zinc-900">
                                                {unit.name}
                                            </p>
                                            <p className="text-right">
                                                {unit.credit_factor ?? "-"}
                                            </p>
                                            <p className="text-right">
                                                {unit.training_hours ?? "-"}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        ))
                    ) : (
                        <div className="rounded-[1.75rem] border border-dashed border-zinc-200 bg-white px-6 py-12 text-center text-sm text-zinc-500 shadow-sm">
                            No units have been assigned to your program version yet.
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
