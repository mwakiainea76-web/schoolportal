import { Head, Link, router } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import Table from "@/Components/Table/Table";
import Thead from "@/Components/Table/Thead";
import THdata from "@/Components/Table/THdata";
import Tbody from "@/Components/Table/Tbody";
import Trow from "@/Components/Table/Trow";
import Tdata from "@/Components/Table/Tdata";
import formatDate from "@/utils/date";

export default function PaymentsIndex({ payments }) {
    const handleDelete = (id) => {
        if (!confirm("Remove this payment record?")) return;
        router.delete(route("fees.payments.destroy", id));
    };

    const getMethodLabel = (method) => {
        return method.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    };

    return (
        <AuthenticatedLayout>
            <Head title="Invoice Payments" />

            <div className="mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Invoice Payments</h1>
                    <Link
                        href={route("fees.payments.create")}
                        className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition shadow-sm font-medium"
                    >
                        Record Payment
                    </Link>
                </div>

                <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                    <Table pagination={payments}>
                        <Thead>
                            <THdata>ID</THdata>
                            <THdata>Invoice</THdata>
                            <THdata>Student</THdata>
                            <THdata>Reference</THdata>
                            <THdata>Method</THdata>
                            <THdata className="text-right">Amount Paid</THdata>
                            <THdata>Date Paid</THdata>
                            <THdata className="text-center">Actions</THdata>
                        </Thead>
                        <Tbody>
                            {payments.data.length ? (
                                payments.data.map((payment) => (
                                    <Trow key={payment.id} className="hover:bg-gray-50 transition-colors">
                                        <Tdata className="font-mono text-gray-500">{payment.id}</Tdata>
                                        <Tdata>
                                            <Link href={route('fees.student-invoices.show', payment.invoice.id)} className="text-indigo-600 hover:text-indigo-900 font-medium">
                                                #{payment.invoice.id}
                                            </Link>
                                        </Tdata>
                                        <Tdata>
                                            <div className="font-medium text-gray-900">
                                                {payment.invoice.enrollment?.student?.user?.first_name} {payment.invoice.enrollment?.student?.user?.last_name}
                                            </div>
                                        </Tdata>
                                        <Tdata className="font-mono font-medium text-slate-700">
                                            {payment.reference}
                                        </Tdata>
                                        <Tdata>
                                            <span className="px-2 py-0.5 rounded text-xs font-semibold bg-slate-100 text-slate-700 capitalize">
                                                {getMethodLabel(payment.method)}
                                            </span>
                                        </Tdata>
                                        <Tdata className="text-right font-mono font-bold text-emerald-600">
                                            {Number(payment.amount_paid).toLocaleString(undefined, {minimumFractionDigits: 2})}
                                        </Tdata>
                                        <Tdata className="text-gray-500 text-sm">{formatDate(payment.paid_at)}</Tdata>
                                        <Tdata>
                                            <div className="flex justify-center gap-3">
                                                <button onClick={() => handleDelete(payment.id)} className="text-rose-600 hover:text-rose-900 font-medium">Delete</button>
                                            </div>
                                        </Tdata>
                                    </Trow>
                                ))
                            ) : (
                                <Trow>
                                    <Tdata colSpan="8" className="text-center py-12 text-gray-500 italic bg-gray-50/50">
                                        No payments recorded yet.
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
