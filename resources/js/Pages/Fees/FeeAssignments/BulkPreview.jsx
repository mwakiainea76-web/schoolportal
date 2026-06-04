import React, { useState } from "react";
import { Head, Link, router, useForm } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import SearchSelect from "@/Components/SearchSelect";

export default function BulkPreview({ affected, toFeePlan, criteria }) {
    const [confirming, setConfirming] = useState(false);
    const [processing, setProcessing] = useState(false);

    const handleReplace = () => {
        setProcessing(true);

        router.post(
            route("fees.assignments.bulk.replace"),
            {
                from_fee_plan_id: criteria.from_fee_plan_id,
                to_fee_plan_id: criteria.to_fee_plan_id,
                academic_year_id: criteria.academic_year_id,
                year_of_study: criteria.year_of_study,
                session_number: criteria.session_number,
            },
            {
                preserveScroll: true,
                onFinish: () => setProcessing(false),
            }
        );
    };

    return (
        <AuthenticatedLayout>
            <Head title="Bulk Replace Preview" />

            <div className="mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-700">
                {/* HEADER */}
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-lg font-semibold text-zinc-700">
                        Bulk Replace Preview
                    </h1>
                    <Link
                        href={route("fees.assignments.index")}
                        className="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-800 transition"
                    >
                        Back to Assignments
                    </Link>
                </div>

                {/* INFO PANEL */}
                <div className="bg-white border border-zinc-100 rounded-lg shadow-sm p-6 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div>
                            <span className="text-sm text-zinc-500">
                                From Fee Plan
                            </span>
                            <p className="font-medium text-zinc-800">
                                {
                                    affected[0]?.feePlan?.name
                                }
                            </p>
                        </div>
                        <div>
                            <span className="text-sm text-zinc-500">
                                To Fee Plan
                            </span>
                            <p className="font-medium text-zinc-800">
                                {toFeePlan?.name}
                            </p>
                        </div>
                        <div>
                            <span className="text-sm text-zinc-500">
                                Academic Year / Session
                            </span>
                            <p className="font-medium text-zinc-800">
                                Year {criteria.year_of_study}, Session{" "}
                                {criteria.session_number}
                            </p>
                        </div>
                    </div>
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                        <p className="text-sm text-amber-800">
                            <strong>Warning:</strong> This will deactivate{" "}
                            {affected.length} existing fee assignment
                            {affected.length !== 1 ? "s" : ""} and create new
                            ones under the target fee plan. This action is
                            reversible via the restore feature.
                        </p>
                    </div>
                </div>

                {/* AFFECTED ASSIGNMENTS TABLE */}
                <div className="bg-white border border-zinc-100 rounded-lg shadow-sm overflow-hidden">
                    <div className="bg-slate-50 px-6 py-3 border-b">
                        <h2 className="text-sm font-semibold text-slate-800">
                            Affected Assignments ({affected.length})
                        </h2>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-slate-200">
                            <thead className="bg-white">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                                        #
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                                        Course Version
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                                        Year / Session
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                                        Valid From
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                                        Current Fee Plan
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-slate-100">
                                {affected.map((assignment, index) => (
                                    <tr key={assignment.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-700">
                                            {index + 1}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-700">
                                            {assignment.courseCourseVersion?.name}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-700">
                                            Year {assignment.year_of_study}, Session{" "}
                                            {assignment.session_number}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-700">
                                            {assignment.valid_from}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-700">
                                            {assignment.feePlan?.name}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* CONFIRMATION */}
                <div className="mt-6 bg-white border border-zinc-100 rounded-lg shadow-sm p-6">
                    <div className="flex items-start gap-4">
                        <div className="flex-1">
                            <InputLabel value="Confirmation" />
                            <p className="text-sm text-zinc-600 mt-1">
                                Please confirm that you want to replace{" "}
                                <strong>{affected.length}</strong> fee
                                assignment(s) from their current fee plan to{" "}
                                <strong>{toFeePlan?.name}</strong>. This will
                                deactivate the old assignments and create new
                                ones.
                            </p>
                            <InputError
                                message={
                                    typeof window !== "undefined"
                                        ? new URLSearchParams(
                                              window.location.search
                                          ).get("error")
                                        : undefined
                                }
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-4 mt-6">
                        <Link
                            href={route("fees.assignments.index")}
                            className="px-4 py-2 bg-zinc-400 text-white rounded hover:bg-zinc-500 transition"
                        >
                            Cancel
                        </Link>

                        <button
                            onClick={handleReplace}
                            disabled={processing || confirming}
                            className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center gap-2"
                        >
                            {processing ? (
                                <>
                                    <span className="animate-spin inline-block w-4 h-4 border-[3px] border-white border-t-transparent rounded-full" />
                                    Replacing...
                                </>
                            ) : (
                                "Confirm & Replace"
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

