import { Head, router } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import Table from "@/Components/Table/Table";
import Thead from "@/Components/Table/Thead";
import THdata from "@/Components/Table/THdata";
import Tbody from "@/Components/Table/Tbody";
import Trow from "@/Components/Table/Trow";
import Tdata from "@/Components/Table/Tdata";
import formatDate from "@/utils/date";

export default function RefundsIndex({ refunds }) {
    const handleProcess = (id) => {
        if (!confirm("Process this refund?")) return;
        router.post(route("fees.refunds.process", id));
    };

    const handleFail = (id) => {
        if (!confirm("Mark this refund as failed?")) return;
        router.post(route("fees.refunds.fail", id));
    };

    return (
        <AuthenticatedLayout>
            <Head title="Invoice Refunds" />

            <div className="mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Invoice Refunds</h1>
                    <p className="text-gray-600 mt-1">Manage reversals for overpaid invoices.</p>
                </div>

                <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                    <Table pagination={refunds}>
                        <Thead>
                            <THdata>ID</THdata>
                            <THdata>Invoice</THdata>
                            <THdata>Student</THdata>
                            <THdata className="text-right">Amount</THdata>
                            <THdata>Status</THdata>
                            <THdata>Raised By</THdata>
                            <THdata>Processed By</THdata>
                            <THdata>Date Raised</THdata>
                            <THdata className="text-center">Actions</THdata>
                        </Thead>
                        <Tbody>
                            {refunds.data.length ? (
                                refunds.data.map((refund) => (
                                    <Trow key={refund.id} className="hover:bg-gray-50 transition-colors">
                                        <Tdata className="font-mono text-gray-500">{refund.id}</Tdata>
                                        <Tdata>
                                            <span className="font-medium">#{refund.invoice.id}</span>
                                        </Tdata>
                                        <Tdata>
                                            <div className="font-medium text-gray-900">
                                                {refund.invoice.enrollment?.student?.user?.first_name} {refund.invoice.enrollment?.student?.user?.last_name}
                                            </div>
                                        </Tdata>
                                        <Tdata className="text-right font-mono font-bold text-rose-600">
                                            {Number(refund.amount).toLocaleString(undefined, {minimumFractionDigits: 2})}
                                        </Tdata>
                                        <Tdata>
                                            <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${
                                                refund.status === 'processed' ? 'bg-green-100 text-green-700' : 
                                                refund.status === 'failed' ? 'bg-red-100 text-red-700' : 
                                                'bg-amber-100 text-amber-700'
                                            }`}>
                                                {refund.status}
                                            </span>
                                        </Tdata>
                                        <Tdata className="text-gray-600 text-sm">
                                            {refund.raised_by_user ? `${refund.raised_by_user.first_name} ${refund.raised_by_user.last_name}` : '—'}
                                        </Tdata>
                                        <Tdata className="text-gray-600 text-sm">
                                            {refund.processed_by_user ? `${refund.processed_by_user.first_name} ${refund.processed_by_user.last_name}` : '—'}
                                        </Tdata>
                                        <Tdata className="text-gray-500 text-sm">{formatDate(refund.raised_at)}</Tdata>
                                        <Tdata>
                                            {refund.status === 'pending' && (
                                                <div className="flex justify-center gap-3">
                                                    <button onClick={() => handleProcess(refund.id)} className="text-emerald-600 hover:text-emerald-900 font-medium">Process</button>
                                                    <button onClick={() => handleFail(refund.id)} className="text-rose-600 hover:text-rose-900 font-medium">Fail</button>
                                                </div>
                                            )}
                                        </Tdata>
                                    </Trow>
                                ))
                            ) : (
                                <Trow>
                                    <Tdata colSpan="9" className="text-center py-12 text-gray-500 italic bg-gray-50/50">
                                        No refunds pending processing.
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
