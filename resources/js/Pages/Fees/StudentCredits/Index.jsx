import { Head, Link } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import Table from "@/Components/Table/Table";
import Thead from "@/Components/Table/Thead";
import THdata from "@/Components/Table/THdata";
import Tbody from "@/Components/Table/Tbody";
import Trow from "@/Components/Table/Trow";
import Tdata from "@/Components/Table/Tdata";
import formatDate from "@/utils/date";

export default function StudentCreditsIndex({ credits }) {
    return (
        <AuthenticatedLayout>
            <Head title="Student Credits" />

            <div className="mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Student Credits</h1>
                </div>

                <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                    <Table pagination={credits}>
                        <Thead>
                            <THdata>ID</THdata>
                            <THdata>Student</THdata>
                            <THdata className="text-right">Amount</THdata>
                            <THdata>Status</THdata>
                            <THdata>Source Invoice</THdata>
                            <THdata>Applied Invoice</THdata>
                            <THdata>Created At</THdata>
                            <THdata>Applied At</THdata>
                        </Thead>
                        <Tbody>
                            {credits.data.length ? (
                                credits.data.map((credit) => (
                                    <Trow key={credit.id} className="hover:bg-gray-50 transition-colors">
                                        <Tdata className="font-mono text-gray-500">{credit.id}</Tdata>
                                        <Tdata>
                                            <div className="font-medium text-gray-900">
                                                {credit.student?.user?.first_name} {credit.student?.user?.last_name}
                                            </div>
                                            <div className="text-xs text-gray-500">{credit.student?.registration_number}</div>
                                        </Tdata>
                                        <Tdata className="text-right font-mono font-bold text-emerald-600">
                                            {Number(credit.amount).toLocaleString(undefined, {minimumFractionDigits: 2})}
                                        </Tdata>
                                        <Tdata>
                                            <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${credit.status === 'applied' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'}`}>
                                                {credit.status}
                                            </span>
                                        </Tdata>
                                        <Tdata>
                                            {credit.source_invoice ? (
                                                <Link href={route('fees.student-invoices.show', credit.source_invoice.id)} className="text-indigo-600 hover:underline">
                                                    #{credit.source_invoice.id}
                                                </Link>
                                            ) : '—'}
                                        </Tdata>
                                        <Tdata>
                                            {credit.applied_invoice ? (
                                                <Link href={route('fees.student-invoices.show', credit.applied_invoice.id)} className="text-indigo-600 hover:underline">
                                                    #{credit.applied_invoice.id}
                                                </Link>
                                            ) : '—'}
                                        </Tdata>
                                        <Tdata className="text-gray-500 text-sm">{formatDate(credit.created_at)}</Tdata>
                                        <Tdata className="text-gray-500 text-sm">{credit.applied_at ? formatDate(credit.applied_at) : '—'}</Tdata>
                                    </Trow>
                                ))
                            ) : (
                                <Trow>
                                    <Tdata colSpan="8" className="text-center py-12 text-gray-500 italic bg-gray-50/50">
                                        No student credits found.
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
