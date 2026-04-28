import { Head, Link, router } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import Table from "@/Components/Table/Table";
import Thead from "@/Components/Table/Thead";
import THdata from "@/Components/Table/THdata";
import Tbody from "@/Components/Table/Tbody";
import Trow from "@/Components/Table/Trow";
import Tdata from "@/Components/Table/Tdata";
import formatDate from "@/utils/date";

export default function FeeAdjustmentsIndex({ adjustments }) {
    const handleDelete = (id) => {
        if (!confirm("Remove this adjustment?")) return;
        router.delete(route("fees.adjustments.destroy", id));
    };

    return (
        <AuthenticatedLayout>
            <Head title="Fee Adjustments" />

            <div className="mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Fee Adjustments</h1>
                    <Link
                        href={route("fees.adjustments.create")}
                        className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition shadow-sm font-medium"
                    >
                        Create Adjustment
                    </Link>
                </div>

                <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                    <Table pagination={adjustments}>
                        <Thead>
                            <THdata>ID</THdata>
                            <THdata>Invoice</THdata>
                            <THdata>Student</THdata>
                            <THdata>Scope</THdata>
                            <THdata>Type</THdata>
                            <THdata className="text-right">Value</THdata>
                            <THdata>Reason</THdata>
                            <THdata>Approved By</THdata>
                            <THdata>Date</THdata>
                            <THdata className="text-center">Actions</THdata>
                        </Thead>
                        <Tbody>
                            {adjustments.data.length ? (
                                adjustments.data.map((adjustment) => (
                                    <Trow key={adjustment.id} className="hover:bg-gray-50 transition-colors">
                                        <Tdata className="font-mono text-gray-500">{adjustment.id}</Tdata>
                                        <Tdata>
                                            <Link href={route('fees.student-invoices.show', adjustment.invoice.id)} className="text-indigo-600 hover:text-indigo-900 font-medium">
                                                #{adjustment.invoice.id}
                                            </Link>
                                        </Tdata>
                                        <Tdata>
                                            <div className="font-medium text-gray-900">
                                                {adjustment.invoice.enrollment?.student?.user?.first_name} {adjustment.invoice.enrollment?.student?.user?.last_name}
                                            </div>
                                        </Tdata>
                                        <Tdata>
                                            <span className="px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-700 capitalize">
                                                {adjustment.scope}
                                            </span>
                                        </Tdata>
                                        <Tdata className="capitalize text-gray-600">{adjustment.type}</Tdata>
                                        <Tdata className={`text-right font-mono font-bold ${Number(adjustment.value) < 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                                            {Number(adjustment.value) < 0 ? '' : '+'}{adjustment.type === 'percentage' ? `${adjustment.value}%` : Number(adjustment.value).toLocaleString(undefined, {minimumFractionDigits: 2})}
                                        </Tdata>
                                        <Tdata>
                                            <span className="text-gray-600 max-w-xs block truncate" title={adjustment.reason}>
                                                {adjustment.reason}
                                            </span>
                                        </Tdata>
                                        <Tdata className="text-gray-600 text-sm">
                                            {adjustment.approver ? `${adjustment.approver.first_name} ${adjustment.approver.last_name}` : '—'}
                                        </Tdata>
                                        <Tdata className="text-gray-500 text-sm">{formatDate(adjustment.created_at)}</Tdata>
                                        <Tdata>
                                            <div className="flex justify-center gap-3">
                                                <Link href={route('fees.adjustments.edit', adjustment.id)} className="text-indigo-600 hover:text-indigo-900 font-medium">Edit</Link>
                                                <button onClick={() => handleDelete(adjustment.id)} className="text-rose-600 hover:text-rose-900 font-medium">Delete</button>
                                            </div>
                                        </Tdata>
                                    </Trow>
                                ))
                            ) : (
                                <Trow>
                                    <Tdata colSpan="10" className="text-center py-12 text-gray-500 italic bg-gray-50/50">
                                        No adjustments found in the system.
                                    </Tdata>
                                </Trow>
                            )}
                        </Tbody>
                    </Table>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
