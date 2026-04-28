import { Head, Link, router } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import Table from "@/Components/Table/Table";
import Thead from "@/Components/Table/Thead";
import THdata from "@/Components/Table/THdata";
import Tbody from "@/Components/Table/Tbody";
import Trow from "@/Components/Table/Trow";
import Tdata from "@/Components/Table/Tdata";
import formatDate from "@/utils/date";

export default function PenaltiesIndex({ penalties }) {
    const handleDelete = (id) => {
        if (!confirm("Remove this penalty?")) return;
        router.delete(route("fees.penalties.destroy", id));
    };

    const getPenaltyTypeLabel = (type) => {
        return type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    };

    return (
        <AuthenticatedLayout>
            <Head title="Fee Penalties" />

            <div className="mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Fee Penalties</h1>
                    <Link
                        href={route("fees.penalties.create")}
                        className="px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition shadow-sm font-medium"
                    >
                        Raise Penalty
                    </Link>
                </div>

                <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                    <Table pagination={penalties}>
                        <Thead>
                            <THdata>ID</THdata>
                            <THdata>Invoice</THdata>
                            <THdata>Student</THdata>
                            <THdata>Penalty Type</THdata>
                            <THdata className="text-right">Amount</THdata>
                            <THdata>Trigger</THdata>
                            <THdata>Raised By</THdata>
                            <THdata>Date</THdata>
                            <THdata className="text-center">Actions</THdata>
                        </Thead>
                        <Tbody>
                            {penalties.data.length ? (
                                penalties.data.map((penalty) => (
                                    <Trow key={penalty.id} className="hover:bg-gray-50 transition-colors">
                                        <Tdata className="font-mono text-gray-500">{penalty.id}</Tdata>
                                        <Tdata>
                                            <Link href={route('fees.student-invoices.show', penalty.invoice.id)} className="text-indigo-600 hover:text-indigo-900 font-medium">
                                                #{penalty.invoice.id}
                                            </Link>
                                        </Tdata>
                                        <Tdata>
                                            <div className="font-medium text-gray-900">
                                                {penalty.invoice.enrollment?.student?.user?.first_name} {penalty.invoice.enrollment?.student?.user?.last_name}
                                            </div>
                                        </Tdata>
                                        <Tdata>
                                            <span className="text-gray-700 font-medium">
                                                {getPenaltyTypeLabel(penalty.penalty_type)}
                                            </span>
                                        </Tdata>
                                        <Tdata className="text-right font-mono font-bold text-rose-600">
                                            {Number(penalty.amount).toLocaleString(undefined, {minimumFractionDigits: 2})}
                                        </Tdata>
                                        <Tdata>
                                            <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${penalty.trigger === 'event' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'}`}>
                                                {penalty.trigger}
                                            </span>
                                        </Tdata>
                                        <Tdata className="text-gray-600 text-sm">
                                            {penalty.raised_by_user ? `${penalty.raised_by_user.first_name} ${penalty.raised_by_user.last_name}` : (penalty.trigger === 'event' ? 'System' : '—')}
                                        </Tdata>
                                        <Tdata className="text-gray-500 text-sm">{formatDate(penalty.raised_at)}</Tdata>
                                        <Tdata>
                                            <div className="flex justify-center gap-3">
                                                <button onClick={() => handleDelete(penalty.id)} className="text-rose-600 hover:text-rose-900 font-medium">Remove</button>
                                            </div>
                                        </Tdata>
                                    </Trow>
                                ))
                            ) : (
                                <Trow>
                                    <Tdata colSpan="9" className="text-center py-12 text-gray-500 italic bg-gray-50/50">
                                        No penalties found.
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
