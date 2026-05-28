import { Head, router } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function StudentResults({
    student,
    filters,
    filter_options,
    summary,
    results,
}) {
    const updateFilter = (field, value) => {
        router.get(
            route("student.results.index"),
            {
                module: field === "module" ? value || undefined : filters.module || undefined,
                year_of_study:
                    field === "year_of_study"
                        ? value || undefined
                        : filters.year_of_study || undefined,
            },
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            },
        );
    };

    const resetFilters = () => {
        router.get(
            route("student.results.index"),
            {},
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            },
        );
    };

    return (
        <AuthenticatedLayout
            header={
                <div>
                    <h1 className="text-3xl font-semibold text-zinc-900">
                        My Results
                    </h1>
                    <p className="mt-2 max-w-3xl text-sm text-zinc-600">
                        View all recorded marks and filter them by module or
                        year of study.
                    </p>
                </div>
            }
        >
            <Head title="My Results" />

            <div className="mx-auto max-w-7xl space-y-8">
                <div className="grid gap-4 md:grid-cols-3">
                    <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                            Student
                        </p>
                        <p className="mt-3 text-xl font-semibold text-zinc-900">
                            {student?.name || "Student"}
                        </p>
                        <p className="mt-1 text-sm text-zinc-500">
                            {student?.registration_number || "-"}
                        </p>
                    </div>

                    <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                            Total Marks
                        </p>
                        <p className="mt-3 text-3xl font-semibold text-zinc-900">
                            {summary.published_count}
                        </p>
                        <p className="mt-1 text-sm text-zinc-500">
                            Recorded marks (theory & practical)
                        </p>
                    </div>

                    <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                            Filtered View
                        </p>
                        <p className="mt-3 text-3xl font-semibold text-zinc-900">
                            {summary.filtered_count}
                        </p>
                        <p className="mt-1 text-sm text-zinc-500">
                            Results in the current view
                        </p>
                    </div>
                </div>

                <div className="rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                        <div>
                            <h2 className="text-xl font-semibold text-zinc-900">
                                My Results
                            </h2>
                            <p className="mt-1 text-sm text-zinc-500">
                                View all recorded marks and filter them by module or
                                year of study. Marks are shown for both theory and practical assessments.
                            </p>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2 lg:min-w-[26rem]">
                            <div>
                                <label className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                                    Module
                                </label>
                                <select
                                    value={filters.module || ""}
                                    onChange={(e) =>
                                        updateFilter("module", e.target.value)
                                    }
                                    className="mt-2 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-400"
                                >
                                    <option value="">All modules</option>
                                    {filter_options.modules.map((option) => (
                                        <option
                                            key={option.value}
                                            value={option.value}
                                        >
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                                    Year of Study
                                </label>
                                <select
                                    value={filters.year_of_study || ""}
                                    onChange={(e) =>
                                        updateFilter(
                                            "year_of_study",
                                            e.target.value,
                                        )
                                    }
                                    className="mt-2 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-400"
                                >
                                    <option value="">All years</option>
                                    {filter_options.years_of_study.map(
                                        (option) => (
                                            <option
                                                key={option.value}
                                                value={option.value}
                                            >
                                                {option.label}
                                            </option>
                                        ),
                                    )}
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="mt-5 flex justify-end">
                        <button
                            type="button"
                            onClick={resetFilters}
                            className="rounded-xl border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50"
                        >
                            Reset Filters
                        </button>
                    </div>

<div className="mt-6 overflow-x-auto rounded-2xl border border-zinc-100">
   <table className="w-full border-collapse">
     <thead>
       <tr className="bg-zinc-50">
         <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-zinc-500 min-w-[100px]">Module</th>
         <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-zinc-500 min-w-[150px]">Unit</th>
         <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-zinc-500 min-w-[200px]">Theory Marks</th>
         <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-zinc-500 min-w-[200px]">Practical Marks</th>
       </tr>
     </thead>
     <tbody>
       {results.length ? (
         Object.entries(
           results.reduce((acc, result) => {
             const unitKey = `${result.unit_code}-${result.unit_name}`;
             if (!acc[unitKey]) {
               acc[unitKey] = {
                 module: result.module,
                 unit_code: result.unit_code,
                 unit_name: result.unit_name,
                 marks: [],
               };
             }
             acc[unitKey].marks.push(result);
             return acc;
           }, {})
         ).map(([unitKey, unitData]) => {
           const sessions = [...new Set(unitData.marks.map(m => m.session))].filter(Boolean);

           return (
             <tr key={unitKey} className="border-t border-zinc-100 bg-white">
               <td className="px-4 py-3 text-sm text-zinc-700">
                    {unitData.unit_code || "-"}
               </td>
               <td className="px-4 py-3 text-sm text-zinc-500">
            
              {unitData.unit_name || "-"}
               </td>
               <td className="px-4 py-3">
                 {(() => {
                   const theoryMarks = unitData.marks
                     .filter(m => m.mark_type === 'theory' || (m.theory_marks !== null && m.theory_marks !== undefined))
                     .map(result => result.mark_type === 'theory' ? (result.marks || result.score) : result.theory_marks)
                     .filter(m => m !== null && m !== undefined);
                   const avg = theoryMarks.length > 0 ? Math.round(theoryMarks.reduce((a, b) => a + b, 0) / theoryMarks.length) : null;
                   
                   if (theoryMarks.length === 0) {
                     return <span className="text-sm text-zinc-400">-</span>;
                   }
                   
                   return (
                     <div className="flex flex-wrap gap-2 items-center">
                       {theoryMarks.map((mark, idx) => (
                         <span key={`theory-${idx}`} className="rounded bg-blue-50 px-2 py-1 text-sm font-semibold text-blue-700">
                           {mark}
                         </span>
                       ))}
                       {avg !== null && (
                         <span className="text-sm font-bold text-red-700">
                           Avg: {avg}
                         </span>
                       )}
                     </div>
                   );
                 })()}
               </td>
               <td className="px-4 py-3">
                 {(() => {
                   const practicalMarks = unitData.marks
                     .filter(m => m.mark_type === 'practical' || (m.practical_marks !== null && m.practical_marks !== undefined))
                     .map(result => result.mark_type === 'practical' ? (result.marks || result.score) : result.practical_marks)
                     .filter(m => m !== null && m !== undefined);
                   const avg = practicalMarks.length > 0 ? Math.round(practicalMarks.reduce((a, b) => a + b, 0) / practicalMarks.length) : null;
                   
                   if (practicalMarks.length === 0) {
                     return <span className="text-sm text-zinc-400">-</span>;
                   }
                   
                   return (
                     <div className="flex flex-wrap gap-2 items-center">
                       {practicalMarks.map((mark, idx) => (
                         <span key={`practical-${idx}`} className="rounded bg-emerald-50 px-2 py-1 text-sm font-semibold text-emerald-700">
                           {mark}
                         </span>
                       ))}
                       {avg !== null && (
                         <span className="text-sm font-bold text-red-700">
                           Avg: {avg}
                         </span>
                       )}
                     </div>
                   );
                 })()}
               </td>
             </tr>
           );
         })
       ) : (
         <tr>
           <td colSpan={5} className="px-4 py-10 text-center text-sm text-zinc-500">
             No recorded marks match the selected filter yet.
           </td>
         </tr>
       )}
     </tbody>
   </table>
</div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
