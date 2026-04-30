import { Head, router, usePage } from "@inertiajs/react";
import { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

const fmt = (n) =>
    Number(n).toLocaleString("en-KE", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });

const TYPE_STYLES = {
    invoice: "text-gray-700",
    payment: "text-emerald-700 font-medium",
    adjustment: "text-blue-700",
    penalty: "text-red-700 font-medium",
};

const BalanceCell = ({ amount }) => {
    const isCredit = amount < 0;
    const isZero = amount === 0;
    return (
        <span
            className={
                isZero
                    ? "text-gray-500"
                    : isCredit
                      ? "text-emerald-600 font-medium"
                      : "text-red-600 font-medium"
            }
        >
            {fmt(Math.abs(amount))}
            {!isZero && (
                <span className="ml-1 text-xs font-normal opacity-70">
                    {isCredit ? "CR" : "DR"}
                </span>
            )}
        </span>
    );
};

export default function Index({
    student,
    sessions,
    grand_total_debit,
    grand_total_credit,
    grand_balance,
    searched,
    filters,
}) {
    const { errors } = usePage().props;
    const [regNo, setRegNo] = useState(filters.registration_number ?? "");

    const submit = (e) => {
        e.preventDefault();
        router.get(
            route("fees.statement"),
            { registration_number: regNo },
            { preserveState: true, replace: true },
        );
    };

    const clear = () => {
        setRegNo("");
        router.get(route("fees.statement"), {}, { replace: true });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Fee Statement" />

            <div className="mx-auto max-w-6xl w-full space-y-6">
                {/* ── Search bar ── */}
                <div className="bg-white border rounded-lg p-6 print:hidden">
                    <div className="flex items-start justify-between mb-4">
                        <div>
                            <h1 className="text-xl font-semibold text-gray-800">
                                Fee Statement
                            </h1>
                            <p className="text-sm text-gray-500 mt-0.5">
                                Enter a student registration number to load
                                their full fee history.
                            </p>
                        </div>
                        {searched && (
                            <button
                                onClick={() => window.print()}
                                className="px-4 py-2 text-sm bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition"
                            >
                                Print / PDF
                            </button>
                        )}
                    </div>
                    <form onSubmit={submit} className="flex gap-3 items-start">
                        <div className="flex-1">
                            <input
                                type="text"
                                value={regNo}
                                onChange={(e) => setRegNo(e.target.value)}
                                placeholder="e.g. STD/2026/04/0001"
                                className="w-full bg-zinc-50 border border-zinc-200 rounded-lg py-2.5 px-4 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500 transition"
                            />
                            {errors.registration_number && (
                                <p className="mt-1 text-xs text-red-500">
                                    {errors.registration_number}
                                </p>
                            )}
                        </div>
                        <button
                            type="submit"
                            className="px-5 py-2.5 bg-emerald-600 text-white text-sm rounded-lg hover:bg-emerald-700 transition"
                        >
                            Search
                        </button>
                        {searched && (
                            <button
                                type="button"
                                onClick={clear}
                                className="px-5 py-2.5 bg-slate-100 text-slate-700 text-sm rounded-lg hover:bg-slate-200 transition"
                            >
                                Clear
                            </button>
                        )}
                    </form>
                </div>

                {/* ── Empty state ── */}
                {!searched && (
                    <div className="bg-white border rounded-lg p-14 text-center">
                        <p className="text-gray-400 text-sm">
                            Enter a registration number above to view the fee
                            statement.
                        </p>
                    </div>
                )}

                {/* ── Results ── */}
                {searched && student && (
                    <>
                        {/* Print-only institution header */}
                        <div className="hidden print:block text-center border-b pb-4 mb-4">
                            <h1 className="text-lg font-bold uppercase tracking-wide">
                                Your Institution
                            </h1>
                            <p className="text-xs text-gray-500">
                                P.O. BOX 000 | Tel: 000 000 |
                                info@institution.ac.ke
                            </p>
                            <p className="text-sm font-semibold uppercase tracking-widest mt-2">
                                Fee Statement
                            </p>
                        </div>

                        {/* Student info card */}
                        <div className="bg-white border rounded-lg p-5">
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-3 text-sm">
                                {[
                                    ["Student Name", student.name],
                                    [
                                        "Registration No.",
                                        student.registration_number,
                                    ],
                                    ["Program", student.program],
                                    ["Curriculum", student.curriculum],
                                    ["Department", student.department],
                                ].map(([label, value]) => (
                                    <div key={label}>
                                        <p className="text-gray-400 text-xs uppercase tracking-wide mb-0.5">
                                            {label}
                                        </p>
                                        <p className="font-medium text-gray-800">
                                            {value}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* No transactions */}
                        {sessions.length === 0 && (
                            <div className="bg-white border rounded-lg p-10 text-center text-gray-400 text-sm">
                                No fee transactions found for this student.
                            </div>
                        )}

                        {/* ── Session blocks ── */}
                        {sessions.map((session, si) => (
                            <div
                                key={si}
                                className="bg-white border rounded-lg overflow-hidden"
                            >
                                {/* Session header */}
                                <div className="bg-slate-700 text-white px-5 py-2.5 flex justify-between items-center text-sm">
                                    <span className="font-medium uppercase tracking-wide">
                                        {session.session} &mdash; Module{" "}
                                        {session.module}
                                    </span>
                                    <span className="text-slate-400 text-xs">
                                        {session.transactions.length} record
                                        {session.transactions.length !== 1
                                            ? "s"
                                            : ""}
                                    </span>
                                </div>

                                <table
                                    className="min-w-full text-sm"
                                    style={{ tableLayout: "fixed" }}
                                >
                                    <colgroup>
                                        <col style={{ width: "40px" }} />
                                        <col style={{ width: "90px" }} />
                                        <col style={{ width: "110px" }} />
                                        <col />
                                        <col style={{ width: "120px" }} />
                                        <col style={{ width: "120px" }} />
                                        <col style={{ width: "130px" }} />
                                    </colgroup>
                                    <thead className="bg-gray-50 border-b text-xs text-gray-500 uppercase tracking-wide">
                                        <tr>
                                            <th className="px-3 py-2 text-left">
                                                No.
                                            </th>
                                            <th className="px-3 py-2 text-left">
                                                Date
                                            </th>
                                            <th className="px-3 py-2 text-left">
                                                Ref
                                            </th>
                                            <th className="px-3 py-2 text-left">
                                                Description
                                            </th>
                                            <th className="px-3 py-2 text-right">
                                                Debit (KES)
                                            </th>
                                            <th className="px-3 py-2 text-right">
                                                Credit (KES)
                                            </th>
                                            <th className="px-3 py-2 text-right">
                                                Balance (KES)
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {session.transactions.length === 0 ? (
                                            <tr>
                                                <td
                                                    colSpan={7}
                                                    className="px-4 py-5 text-center text-gray-400 text-xs"
                                                >
                                                    No transactions recorded for
                                                    this session.
                                                </td>
                                            </tr>
                                        ) : (
                                            session.transactions.map(
                                                (t, ti) => (
                                                    <tr
                                                        key={ti}
                                                        className={`hover:bg-gray-50 transition ${
                                                            t.type === "penalty"
                                                                ? "bg-red-50/40"
                                                                : t.type ===
                                                                    "payment"
                                                                  ? "bg-emerald-50/40"
                                                                  : t.type ===
                                                                      "adjustment"
                                                                    ? "bg-blue-50/30"
                                                                    : ""
                                                        }`}
                                                    >
                                                        <td className="px-3 py-2.5 text-gray-400 text-xs">
                                                            {ti + 1}
                                                        </td>
                                                        <td className="px-3 py-2.5 text-gray-500 text-xs whitespace-nowrap">
                                                            {t.date}
                                                        </td>
                                                        <td className="px-3 py-2.5 font-mono text-xs text-gray-500 truncate">
                                                            {t.ref}
                                                        </td>
                                                        <td
                                                            className={`px-3 py-2.5 text-xs ${TYPE_STYLES[t.type] ?? "text-gray-700"}`}
                                                        >
                                                            {t.description}
                                                        </td>
                                                        <td className="px-3 py-2.5 text-right text-xs text-red-600">
                                                            {t.debit > 0 ? (
                                                                fmt(t.debit)
                                                            ) : (
                                                                <span className="text-gray-300">
                                                                    —
                                                                </span>
                                                            )}
                                                        </td>
                                                        <td className="px-3 py-2.5 text-right text-xs text-emerald-600">
                                                            {t.credit > 0 ? (
                                                                fmt(t.credit)
                                                            ) : (
                                                                <span className="text-gray-300">
                                                                    —
                                                                </span>
                                                            )}
                                                        </td>
                                                        <td className="px-3 py-2.5 text-right text-xs">
                                                            <BalanceCell
                                                                amount={
                                                                    t.balance
                                                                }
                                                            />
                                                        </td>
                                                    </tr>
                                                ),
                                            )
                                        )}
                                    </tbody>

                                    {/* Session subtotal */}
                                    <tfoot className="border-t-2 border-slate-200 bg-slate-50 text-xs font-medium">
                                        <tr>
                                            <td
                                                colSpan={4}
                                                className="px-3 py-2.5 text-right text-gray-500 uppercase tracking-wide"
                                            >
                                                Session {session.session} Total
                                            </td>
                                            <td className="px-3 py-2.5 text-right text-red-600">
                                                {fmt(session.total_debit)}
                                            </td>
                                            <td className="px-3 py-2.5 text-right text-emerald-600">
                                                {fmt(session.total_credit)}
                                            </td>
                                            <td className="px-3 py-2.5 text-right">
                                                <BalanceCell
                                                    amount={
                                                        session.closing_balance
                                                    }
                                                />
                                            </td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                        ))}

                        {/* ── Grand total ── */}
                        {sessions.length > 0 && (
                            <div className="bg-slate-800 text-white rounded-lg px-6 py-4 flex justify-between items-center text-sm">
                                <span className="font-semibold uppercase tracking-widest text-slate-300 text-xs">
                                    Grand Total
                                </span>
                                <div className="flex gap-10">
                                    <div className="text-right">
                                        <p className="text-slate-400 text-xs mb-0.5 uppercase">
                                            Total Debit
                                        </p>
                                        <p className="font-semibold text-red-400">
                                            {fmt(grand_total_debit)}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-slate-400 text-xs mb-0.5 uppercase">
                                            Total Credit
                                        </p>
                                        <p className="font-semibold text-emerald-400">
                                            {fmt(grand_total_credit)}
                                        </p>
                                    </div>
                                    <div className="text-right border-l border-slate-600 pl-10">
                                        <p className="text-slate-400 text-xs mb-0.5 uppercase">
                                            Balance
                                        </p>
                                        <p
                                            className={`font-semibold text-base ${grand_balance <= 0 ? "text-emerald-400" : "text-red-400"}`}
                                        >
                                            {fmt(Math.abs(grand_balance))}
                                            {grand_balance !== 0 && (
                                                <span className="ml-1 text-xs font-normal opacity-75">
                                                    {grand_balance < 0
                                                        ? "CR"
                                                        : "DR"}
                                                </span>
                                            )}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
