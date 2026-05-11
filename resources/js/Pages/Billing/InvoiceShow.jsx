import React from "react";
import { Head, Link } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import formatDate from "@/utils/date";

export default function Show({ invoice }) {
    const student = invoice.student;
    const enrollment = invoice.enrollment;

    return (
        <AuthenticatedLayout>
            <Head title={`Invoice ${invoice.invoice_number}`} />

            <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                {/* HEADER */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-lg font-semibold text-zinc-700">
                            Invoice #{invoice.invoice_number}
                        </h1>
                        <p className="text-sm text-zinc-500">
                            Created on {formatDate(invoice.created_at)}
                        </p>
                    </div>

                    <Link
                        href={route("billing.invoices.index")}
                        className="px-4 py-2 bg-slate-500 text-white rounded hover:bg-slate-700"
                    >
                        Back
                    </Link>
                </div>

                {/* SUMMARY CARD */}
                <div className="bg-white border border-zinc-100 rounded-lg shadow-sm p-6 grid md:grid-cols-3 gap-6">
                    <div>
                        <h3 className="text-sm text-zinc-500">Student</h3>
                        <p className="font-medium">{student?.name}</p>
                        <p className="text-sm text-zinc-500">
                            ID: {student?.id} • {student?.registration_number}
                        </p>
                    </div>

                    <div>
                        <h3 className="text-sm text-zinc-500">Type</h3>
                        <p>
                            {invoice.invoice_type === "default_fees"
                                ? "Default Fees"
                                : invoice.invoice_type === "penalty"
                                  ? "Penalty"
                                  : "Fees"}
                        </p>
                    </div>

                    <div>
                        <h3 className="text-sm text-zinc-500">Session</h3>
                        <p>
                            {invoice.enrollment?.academic_session?.name ??
                                invoice.academic_session_id ??
                                "—"}
                        </p>
                    </div>

                    <div>
                        <h3 className="text-sm text-zinc-500">Course</h3>
                        <p>
                            {enrollment?.course_curriculum?.course?.name ?? "—"}
                        </p>
                    </div>

                    <div>
                        <h3 className="text-sm text-zinc-500">Issue Date</h3>
                        <p>{formatDate(invoice.issue_date)}</p>
                    </div>

                    <div>
                        <h3 className="text-sm text-zinc-500">Due Date</h3>
                        <p>{formatDate(invoice.due_date)}</p>
                    </div>

                    <div>
                        <h3 className="text-sm text-zinc-500">Status</h3>
                        <span
                            className={`px-2 py-1 rounded text-xs ${
                                invoice.status === "paid"
                                    ? "bg-emerald-100 text-emerald-700"
                                    : invoice.status === "overdue"
                                      ? "bg-red-100 text-red-700"
                                      : "bg-blue-100 text-blue-700"
                            }`}
                        >
                            {invoice.status}
                        </span>
                    </div>
                </div>

                {/* FINANCIAL SUMMARY */}
                <div className="bg-white border border-zinc-100 rounded-lg shadow-sm p-6 grid md:grid-cols-3 gap-6">
                    <div>
                        <h3 className="text-sm text-zinc-500">Amount Due</h3>
                        <p className="text-lg font-semibold">
                            ${invoice.amount_due}
                        </p>
                    </div>

                    <div>
                        <h3 className="text-sm text-zinc-500">Paid</h3>
                        <p className="text-lg font-semibold text-emerald-600">
                            ${invoice.amount_due - invoice.balance_due}
                        </p>
                    </div>

                    <div>
                        <h3 className="text-sm text-zinc-500">Balance</h3>
                        <p className="text-lg font-semibold text-red-600">
                            ${invoice.balance_due}
                        </p>
                    </div>
                </div>

                {/* INVOICE ITEMS */}
                <div className="bg-white border border-zinc-100 rounded-lg shadow-sm">
                    <div className="px-6 py-3 border-b text-sm font-medium">
                        Invoice Items
                    </div>

                    <table className="w-full text-sm">
                        <thead className="bg-zinc-50">
                            <tr>
                                <th className="px-4 py-2 text-left">
                                    Description
                                </th>
                                <th className="px-4 py-2 text-right">Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {invoice.invoice_items?.length ? (
                                invoice.invoice_items.map((item) => (
                                    <tr key={item.id} className="border-t">
                                        <td className="px-4 py-2">
                                            {item.description}
                                        </td>
                                        <td className="px-4 py-2 text-right">
                                            ${item.amount}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan="2"
                                        className="text-center py-4 text-zinc-500"
                                    >
                                        No items
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* PAYMENTS */}
                <div className="bg-white border border-zinc-100 rounded-lg shadow-sm">
                    <div className="px-6 py-3 border-b text-sm font-medium">
                        Payments
                    </div>

                    <table className="w-full text-sm">
                        <thead className="bg-zinc-50">
                            <tr>
                                <th className="px-4 py-2 text-left">Date</th>
                                <th className="px-4 py-2 text-right">Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {invoice.payments?.length ? (
                                invoice.payments.map((p) => (
                                    <tr key={p.id} className="border-t">
                                        <td className="px-4 py-2">
                                            {formatDate(p.created_at)}
                                        </td>
                                        <td className="px-4 py-2 text-right text-emerald-600">
                                            ${p.amount}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan="2"
                                        className="text-center py-4 text-zinc-500"
                                    >
                                        No payments recorded
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* ADJUSTMENTS */}
                <div className="bg-white border border-zinc-100 rounded-lg shadow-sm">
                    <div className="px-6 py-3 border-b text-sm font-medium">
                        Adjustments
                    </div>

                    <table className="w-full text-sm">
                        <thead className="bg-zinc-50">
                            <tr>
                                <th className="px-4 py-2 text-left">Type</th>
                                <th className="px-4 py-2 text-right">Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {invoice.adjustments?.length ? (
                                invoice.adjustments.map((a) => (
                                    <tr key={a.id} className="border-t">
                                        <td className="px-4 py-2 capitalize">
                                            {a.type}
                                        </td>
                                        <td className="px-4 py-2 text-right text-blue-600">
                                            -${a.amount}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan="2"
                                        className="text-center py-4 text-zinc-500"
                                    >
                                        No adjustments
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
