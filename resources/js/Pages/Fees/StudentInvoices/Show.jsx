import React from "react";
import { Head, Link } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import formatDate from "@/utils/date";

export default function Show({ studentInvoice }) {
    const getStatusBadge = (status) => {
        const colors = {
            paid: "bg-green-100 text-green-800",
            partial: "bg-yellow-100 text-yellow-800",
            overpaid: "bg-blue-100 text-blue-800",
            unpaid: "bg-red-100 text-red-800",
        };

        return (
            <span
                className={`px-2 py-1 text-xs rounded-full font-medium capitalize ${colors[status] || "bg-gray-100 text-gray-800"}`}
            >
                {status}
            </span>
        );
    };

    return (
        <AuthenticatedLayout>
            <Head title={`Invoice #${studentInvoice.id}`} />

            <div className="mx-auto max-w-4xl w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex justify-between items-center mb-6">
                    <Link
                        href={route("fees.student-invoices.index")}
                        className="text-gray-600 hover:text-gray-900 flex items-center gap-2"
                    >
                        ← Back to Invoices
                    </Link>
                    <div className="flex gap-2">
                        <Link
                            href={route(
                                "fees.students.invoices.edit",
                                studentInvoice.id,
                            )}
                            className="px-4 py-1 bg-emerald-600 text-white rounded hover:bg-emerald-700 transition"
                        >
                            Edit
                        </Link>
                    </div>
                </div>

                <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
                    {/* Header */}
                    <div className="p-8 border-b bg-gray-50 flex flex-col md:flex-row justify-between items-start gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                                INVOICE
                            </h1>
                            <p className="text-gray-500 mt-1 font-medium">
                                #{studentInvoice.id}
                            </p>
                        </div>
                        <div className="text-left md:text-right">
                            {getStatusBadge(studentInvoice.status)}
                            <p className="text-sm text-gray-500 mt-2">
                                Date Created:{" "}
                                {formatDate(studentInvoice.created_at)}
                            </p>
                            <p className="text-sm text-gray-500">
                                Due Date:{" "}
                                {studentInvoice.due_date
                                    ? formatDate(studentInvoice.due_date)
                                    : "N/A"}
                            </p>
                        </div>
                    </div>

                    {/* Details */}
                    <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
                                Bill To
                            </h2>
                            <div className="text-gray-900">
                                <p className="text-xl font-bold">
                                    {
                                        studentInvoice.enrollment?.student?.user
                                            ?.first_name
                                    }{" "}
                                    {
                                        studentInvoice.enrollment?.student?.user
                                            ?.last_name
                                    }
                                </p>
                                <p className="text-gray-600 font-medium">
                                    {
                                        studentInvoice.enrollment?.student
                                            ?.registration_number
                                    }
                                </p>
                                <p className="text-gray-600">
                                    {studentInvoice.enrollment?.academic_session
                                        ?.session_No ||
                                        studentInvoice.enrollment
                                            ?.academic_session?.name}
                                </p>
                                <p className="text-gray-600">
                                    {
                                        studentInvoice.enrollment?.curriculum
                                            ?.name
                                    }{" "}
                                    - {studentInvoice.enrollment?.course?.name}
                                </p>
                                <p className="text-gray-600">
                                    {
                                        studentInvoice.enrollment?.student?.user
                                            ?.email
                                    }
                                </p>
                                <p className="text-gray-600">
                                    {
                                        studentInvoice.enrollment?.student?.user
                                            ?.phone_number
                                    }
                                </p>
                            </div>
                        </div>
                        <div className="text-left md:text-right">
                            <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
                                Fee Model
                            </h2>
                            <p className="text-lg font-medium text-gray-900">
                                {studentInvoice.fee_model?.display_name ||
                                    "N/A"}
                            </p>
                            <p className="text-sm text-gray-500 mt-2">
                                Module {studentInvoice.enrollment?.module}
                            </p>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="px-8 py-4">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b text-sm font-semibold text-gray-600 uppercase tracking-wider">
                                    <th className="py-4">Description</th>
                                    <th className="py-4 text-right">Amount</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y text-gray-800">
                                <tr>
                                    <td className="py-4 font-medium">
                                        Gross Amount
                                    </td>
                                    <td className="py-4 text-right font-mono">
                                        {Number(
                                            studentInvoice.gross_amount,
                                        ).toLocaleString(undefined, {
                                            minimumFractionDigits: 2,
                                        })}
                                    </td>
                                </tr>
                                {studentInvoice.adjustments?.length > 0 &&
                                    studentInvoice.adjustments.map((adj) => (
                                        <tr
                                            key={adj.id}
                                            className="text-sm text-gray-600 italic"
                                        >
                                            <td className="py-2 pl-4">
                                                — {adj.reason} (
                                                {adj.type === "percentage"
                                                    ? `${adj.value}%`
                                                    : Number(
                                                          adj.value,
                                                      ).toLocaleString()}
                                                )
                                            </td>
                                            <td
                                                className={`py-2 text-right font-mono ${Number(adj.value) < 0 ? "text-emerald-600" : "text-rose-600"}`}
                                            >
                                                {Number(adj.value) < 0
                                                    ? ""
                                                    : "+"}
                                                {Number(
                                                    adj.type === "percentage"
                                                        ? (studentInvoice.gross_amount *
                                                              adj.value) /
                                                              100
                                                        : adj.value,
                                                ).toLocaleString(undefined, {
                                                    minimumFractionDigits: 2,
                                                })}
                                            </td>
                                        </tr>
                                    ))}
                                {studentInvoice.penalties?.length > 0 &&
                                    studentInvoice.penalties.map((penalty) => (
                                        <tr
                                            key={penalty.id}
                                            className="text-sm text-rose-600 font-medium italic"
                                        >
                                            <td className="py-2 pl-4">
                                                !{" "}
                                                {penalty.penalty_type
                                                    .split("_")
                                                    .join(" ")}
                                            </td>
                                            <td className="py-2 text-right font-mono">
                                                +
                                                {Number(
                                                    penalty.amount,
                                                ).toLocaleString(undefined, {
                                                    minimumFractionDigits: 2,
                                                })}
                                            </td>
                                        </tr>
                                    ))}
                            </tbody>
                            <tfoot className="border-t-2 border-gray-100">
                                <tr>
                                    <td className="py-4 text-gray-900 font-bold text-lg uppercase">
                                        Total Adjusted
                                    </td>
                                    <td className="py-4 text-right text-gray-900 font-bold text-xl font-mono">
                                        {Number(
                                            studentInvoice.adjusted_amount,
                                        ).toLocaleString(undefined, {
                                            minimumFractionDigits: 2,
                                        })}
                                    </td>
                                </tr>
                                <tr className="text-emerald-600">
                                    <td className="py-2 font-medium">
                                        Amount Paid
                                    </td>
                                    <td className="py-2 text-right font-bold font-mono">
                                        -
                                        {Number(
                                            studentInvoice.total_paid,
                                        ).toLocaleString(undefined, {
                                            minimumFractionDigits: 2,
                                        })}
                                    </td>
                                </tr>
                                <tr className="text-red-600 bg-red-50">
                                    <td className="py-4 font-bold text-xl uppercase pl-4">
                                        Balance Remaining
                                    </td>
                                    <td className="py-4 text-right font-bold text-2xl font-mono pr-4">
                                        {Number(
                                            studentInvoice.balance_remaining,
                                        ).toLocaleString(undefined, {
                                            minimumFractionDigits: 2,
                                        })}
                                    </td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>

                    {/* Payments History */}
                    <div className="p-8 bg-gray-50 border-t">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">
                            Payment History
                        </h3>
                        {studentInvoice.payments?.length > 0 ? (
                            studentInvoice.payments.map((payment) => (
                                <div
                                    key={payment.id}
                                    className="flex justify-between items-center p-4 bg-gray-50 rounded-lg border border-gray-100"
                                >
                                    <div>
                                        <div className="font-semibold text-gray-800">
                                            {payment.reference}
                                        </div>
                                        <div className="text-sm text-gray-500 capitalize">
                                            {payment.method
                                                .split("_")
                                                .join(" ")}{" "}
                                            • {formatDate(payment.paid_at)}
                                        </div>
                                    </div>
                                    <div className="text-lg font-bold text-emerald-600">
                                        +
                                        {Number(
                                            payment.amount_paid,
                                        ).toLocaleString(undefined, {
                                            minimumFractionDigits: 2,
                                        })}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-6 text-gray-500 italic bg-gray-50 rounded-lg border border-dashed">
                                No payments recorded for this invoice yet.
                            </div>
                        )}
                    </div>

                    {/* Footer Notes */}
                    <div className="p-8 border-t bg-white text-sm text-gray-500 flex flex-col md:flex-row justify-between gap-4">
                        <div>
                            <p>
                                Overpayment Action:{" "}
                                <span className="font-bold text-gray-700 capitalize">
                                    {studentInvoice.overpayment_action}
                                </span>
                            </p>
                            {Number(studentInvoice.credit_balance) > 0 && (
                                <p className="mt-1">
                                    Initial Credit Balance applied:{" "}
                                    <span className="font-bold text-gray-700 font-mono">
                                        {Number(
                                            studentInvoice.credit_balance,
                                        ).toLocaleString()}
                                    </span>
                                </p>
                            )}
                        </div>
                        <div className="md:text-right italic">
                            Thank you for your payment!
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
