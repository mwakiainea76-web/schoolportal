import { Head, Link } from "@inertiajs/react";
import { BookCheck, CalendarDays } from "lucide-react";

export default function RegisteredUnits({ session, units }) {
    return (
        <>
            <Head title="Registered Units" />

            <div className="mx-auto w-full max-w-6xl animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="rounded-[2rem] bg-[#1b263b] px-8 py-8 text-white shadow-xl">
                    <div className="flex items-center gap-3">
                        <div className="rounded-xl bg-emerald-500/20 p-2 text-emerald-400">
                            <BookCheck className="h-6 w-6" />
                        </div>
                        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-300">
                            Recently Registered Units
                        </p>
                    </div>
                    <h1 className="mt-4 text-3xl font-bold tracking-tight">
                        {session?.name ?? "No active registration"}
                    </h1>
                    {session && (
                        <div className="mt-3 flex flex-wrap gap-4 text-sm text-slate-300">
                            <div className="flex items-center gap-1.5">
                                <CalendarDays className="h-4 w-4 text-emerald-400" />
                                Year {session.year_of_study}
                            </div>
                            <div className="flex items-center gap-1.5">
                                <div className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                                Module {session.module}
                            </div>
                        </div>
                    )}
                </div>

                <div className="mt-6 flex items-center justify-between">
                    <Link
                        href={route("dashboard")}
                        className="text-sm font-medium text-emerald-700 transition hover:text-emerald-800"
                    >
                        Back to dashboard
                    </Link>
                    
                    <Link
                        href={route("student.course-units.index")}
                        className="text-sm font-medium text-zinc-600 transition hover:text-zinc-900"
                    >
                        View all curriculum units
                    </Link>
                </div>

                <div className="mt-6">
                    {units?.length ? (
                        <div className="rounded-[1.75rem] border border-zinc-100 bg-white p-6 shadow-sm">
                            <div className="overflow-hidden rounded-2xl border border-zinc-100">
                                <div className="overflow-x-auto">
                                    <table className="w-full min-w-[44rem] border-collapse">
                                        <thead className="bg-zinc-50">
                                            <tr className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                                                <th className="px-5 py-3 text-left">Code</th>
                                                <th className="px-5 py-3 text-left">Unit Name</th>
                                                <th className="px-5 py-3 text-center">Module</th>
                                                <th className="px-5 py-3 text-right">Credits</th>
                                                <th className="px-5 py-3 text-right">Hours</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-zinc-100 bg-white">
                                            {units.map((unit) => (
                                                <tr
                                                    key={unit.id}
                                                    className="group text-sm text-zinc-700 transition hover:bg-zinc-50/50"
                                                >
                                                    <td className="px-5 py-4 font-semibold text-emerald-700">
                                                        {unit.code ?? "-"}
                                                    </td>
                                                    <td className="px-5 py-4 font-semibold text-zinc-900">
                                                        {unit.name}
                                                    </td>
                                                    <td className="px-5 py-4 text-center">
                                                        <span className="inline-flex items-center rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-800">
                                                            Module {unit.module_taught}
                                                        </span>
                                                    </td>
                                                    <td className="px-5 py-4 text-right">
                                                        {unit.credit_factor ?? "-"}
                                                    </td>
                                                    <td className="px-5 py-4 text-right">
                                                        {unit.training_hours ?? "-"}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="rounded-[1.75rem] border border-dashed border-zinc-200 bg-white px-6 py-16 text-center shadow-sm">
                            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-zinc-50 text-zinc-400">
                                <BookCheck className="h-6 w-6" />
                            </div>
                            <h3 className="mt-4 text-sm font-semibold text-zinc-900">No registered units</h3>
                            <p className="mt-1 text-sm text-zinc-500">
                                You haven't registered for any units in the current session yet.
                            </p>
                            <div className="mt-6">
                                <Link
                                    href={route("dashboard")}
                                    className="inline-flex items-center rounded-xl bg-[#1b263b] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#2c3e50] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1b263b]"
                                >
                                    Go to Registration
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
